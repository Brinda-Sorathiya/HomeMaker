import React, { useState, useEffect } from 'react';
import { Star, Edit2, Plus } from 'lucide-react';
import useReview from '../../context_store/review_store';
import useSocket from '../../context_store/socket_store';
import useAuth from '../../context_store/auth_store';

const Reviews = ({ propertyId }) => {
    const { user } = useAuth();
    const { reviews, userReview, loading, error, fetchReviews, sendReview, editReview, initializeReviewSocket } = useReview();
    const { socket, isConnected, initializeSocket } = useSocket();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isEditing, setIsEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const userId = user.id.trim();

    useEffect(() => {
       
        if (!isConnected) {
            if (userId) {
                initializeSocket(userId);
            }
        }
    }, [isConnected]);

    useEffect(() => {
        fetchReviews(propertyId, userId);
        const cleanup = initializeReviewSocket(propertyId, userId);
        
        return () => {
            if (cleanup) cleanup();
        };
    }, [propertyId, isConnected]);

    useEffect(() => {
        if (userReview) {
            setRating(userReview.ratings);
            setComment(userReview.comments || '');
        }
    }, [userReview]);

    const handleOpenForm = () => {
        if (userReview) {
            setRating(userReview.ratings);
            setComment(userReview.comments || '');
        } else {
            setRating(0);
            setComment('');
        }
        setShowForm(true);
    };

    const handleCancel = () => {
        setShowForm(false);
        setRating(userReview ? userReview.ratings : 0);
        setComment(userReview ? userReview.comments || '' : '');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (userReview) {
                await editReview(propertyId, rating, comment);
            } else {
                await sendReview(propertyId, rating, comment);
            }
            setShowForm(false);
            setRating(0);
            setComment('');
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };

    const handleEdit = (review) => {
        setIsEditing(review.user_id + '-' + review.property_id);
        setRating(review.ratings);
        setComment(review.comments || '');
    };

    const StarRating = ({ rating, size = 20 }) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, index) => (
                    <Star
                        key={index}
                        size={size}
                        fill={index < rating ? "#FFD700" : "none"}
                        stroke={index < rating ? "#FFD700" : "#e4e5e9"}
                        className="transition-colors duration-200"
                    />
                ))}
            </div>
        );
    };

    if (loading) return <div className="text-white">Loading reviews...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="bg-[#16213E] rounded-lg p-3 h-[600px] flex flex-col relative">
            <h2 className="text-lg font-semibold text-white mb-2">Reviews</h2>
            {/* Top-right fixed button */}
            <div className="absolute top-[7px] right-[10px] z-10 flex items-center justify-center">
                {!showForm && (
                    <div className="relative flex items-center justify-center">
                        {/* Glowing red effect */}
                        <div className="absolute -inset-2 bg-red-600 blur-sm opacity-40 animate-pulse z-0"></div>
                        {userReview ? (
                            <button
                                onClick={handleOpenForm}
                                className="relative bg-[#1A1A2E] p-2 rounded shadow hover:bg-[#23234a] z-10"
                                title="Edit your review"
                            >
                                <Edit2 size={14} className="text-[#E94560]" />
                            </button>
                        ) : (
                            <button
                                onClick={handleOpenForm}
                                className="relative bg-[#1A1A2E] p-2 rounded shadow hover:bg-[#23234a] z-10"
                                title="Add a review"
                            >
                                <Plus size={14} className="text-[#E94560]" />
                            </button>
                        )}
                    </div>
                )}
            </div>
            {/* Review Form */}
            {showForm && (
                <form onSubmit={handleSubmit} className="mb-2 p-3 bg-[#1A1A2E] rounded-lg text-sm">
                    <div className="flex items-center mb-1">
                        {[...Array(5)].map((_, index) => (
                            <Star
                                key={index}
                                size={18}
                                fill={index < (hover || rating) ? "#FFD700" : "none"}
                                stroke={index < (hover || rating) ? "#FFD700" : "#e4e5e9"}
                                onClick={() => setRating(index + 1)}
                                onMouseEnter={() => setHover(index + 1)}
                                onMouseLeave={() => setHover(0)}
                                className="cursor-pointer transition-colors duration-200 mb-1"
                            />
                        ))}
                    </div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review..."
                        className="w-full mb-[2px] p-2 rounded bg-[#0F3460] text-white placeholder-gray-400 text-xs"
                        rows="2"
                    />
                    <div className="flex gap-2 mt-1">
                        <button
                            type="submit"
                            className="px-2 py-1 bg-[#E94560] text-white rounded hover:bg-[#c73a4f] text-xs"
                        >
                            {userReview ? 'Update Review' : 'Submit Review'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-xs"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
            {/* Reviews List */}
            <div className="flex-1 overflow-y-auto mt-2">
                {reviews.map((review) => (
                    <div key={`${review.user_id}-${review.property_id}`} className="mb-2 p-2 bg-[#1A1A2E] rounded-lg text-sm">
                        <div className="flex justify-between items-start mb-1 ">
                            <div>
                                <p className="text-white font-semibold text-s mb-1">{review.name}</p>
                                <StarRating rating={review.ratings} size={16} />
                            </div>
                        </div>
                        <p className="text-gray-300 text-s">{review.comments}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Reviews;
