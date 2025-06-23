import { create } from 'zustand';
import axios from 'axios';
import useSocket from './socket_store';
import useAuth from './auth_store';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useReview = create((set, get) => ({
    reviews: [],
    loading: false,
    error: null,
    userReview: null,

    // Fetch reviews for a property
    fetchReviews: async (propertyId, userId) => {
        try {
            set({ loading: true, error: null });
            const response = await axios.get(`${BACKEND_URL}/review/${propertyId}`);
            set({ reviews: response.data, loading: false });
            
            // current user has a review check
            const userReview = response.data.find(review => review.user_id === userId.trim());
            set({ userReview });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error fetching reviews', loading: false });
        }
    },

    // Send a new review (optimistic update, then API, then emit socket)
    sendReview: async (propertyId, ratings, comments) => {
        const user = useAuth.getState().user;
        const userId = user.id.trim();
        const optimisticReview = {
            user_id: userId,
            property_id: propertyId,
            ratings,
            comments,
            name: user.name
        };
        
        set(state => ({
            reviews: [...state.reviews, optimisticReview],
            userReview: optimisticReview
        }));
        try {
            const response = await axios.post(`${BACKEND_URL}/review/send`, {
                propertyId,
                ratings,
                comments
            });
           
            const socket = useSocket.getState().socket;
            if (socket) {
                socket.emit('send_review', { ...optimisticReview });
            }
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error sending review' });
            throw error;
        }
    },

    // Edit existing review (optimistic update, then API, then emit socket)
    editReview: async (propertyId, ratings, comments) => {
        const user = useAuth.getState().user;
        const userId = user.id.trim();
        const optimisticReview = {
            user_id: userId,
            property_id: propertyId,
            ratings,
            comments,
            name: user.name
        };
        
        set(state => ({
            reviews: state.reviews.map(r => r.user_id === userId ? optimisticReview : r),
            userReview: optimisticReview
        }));
        try {
            const response = await axios.put(`${BACKEND_URL}/review/edit`, {
                propertyId,
                ratings,
                comments
            });
            
            const socket = useSocket.getState().socket;
            if (socket) {
                socket.emit('update_review', { ...optimisticReview });
            }
            return response.data;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Error editing review' });
            throw error;
        }
    },

    // Clear reviews when leaving property page
    clearReviews: () => {
        set({ reviews: [], userReview: null, error: null });
    },

    // Initialize socket connection for reviews
    initializeReviewSocket: (propertyId, userId) => {
        const socket = useSocket.getState().socket;
        if (!socket) {
            console.error('Socket not initialized');
            return;
        }
        
        socket.on(`send_review_${propertyId}`, (reviewData) => {
            if (reviewData.user_id !== userId) {
                set(state => ({
                    reviews: [...state.reviews, reviewData]
                }));
            }
        });
        socket.on(`update_review_${propertyId}`, (reviewData) => {
            if (reviewData.user_id !== userId) {
                set(state => ({
                    reviews: state.reviews.map(r => r.user_id === reviewData.user_id ? reviewData : r)
                }));
            }
        });
        return () => {
            socket.off(`send_review_${propertyId}`);
            socket.off(`update_review_${propertyId}`);
        };
    }
}));

export default useReview;
