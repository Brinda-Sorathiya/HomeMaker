import { create } from 'zustand';
import axios from 'axios';

const useProperty = create((set) => ({
  isAddPropertyModalOpen: false,
  amenities: [],
  properties: [],
  myproperties : [],
  currentInsightProperty: null,
  loading: false,
  error: null,
  wishlist: [],

  // Set modal state
  setIsAddPropertyModalOpen: (isOpen) => set({ isAddPropertyModalOpen: isOpen }),

  // Set current insight property
  setCurrentInsightProperty: (property) => set({ currentInsightProperty: property }),

  // Add to wishlist
  addToWishlist: async (propertyId, userId) => {
    try {
      const response = await axios.post('http://localhost:3000/property/wish', { propertyId, userId});
      set(state => ({
        properties: state.properties.map(p => 
          p.apn === propertyId ? { ...p, is_wish: true } : p
        ),
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add to wishlist', loading: false });
      throw error;
    }
  },

  // Remove from wishlist
  removeFromWishlist: async (propertyId, userId) => {
    try {
      await axios.delete(`http://localhost:3000/property/unwish/${propertyId}/${userId}`);
      set(state => ({
        properties: state.properties.map(p => 
          p.apn === propertyId ? { ...p, is_wish: false } : p
        ),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to remove from wishlist', loading: false });
      throw error;
    }
  },

  // Fetch wishlist - now filters from properties
  fetchWishlist: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:3000/property/wishlist/${userId}`);
      // set(state => {
      //   wishlist = state.properties.filter()
      // });
      // { wishlist: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch wishlist', loading: false });
      throw error;
    }
  },

  // Fetch amenities from backend
  fetchAmenities: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('http://localhost:3000/property/amenities');
      console.log(response)
      set({ amenities: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch amenities', loading: false });
      throw error;
    }
  },

  // Add new property
  addProperty: async (propertyData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('http://localhost:3000/property/add', propertyData);
      set({ loading: false, isAddPropertyModalOpen: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add property', loading: false });
      throw error;
    }
  },

  // Fetch all properties
  fetchAllProperties: async (userId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:3000/property/properties/${userId}`);
      const tmp = response.data;
      const ws = tmp.filter(p => p.is_wish);
      set({ properties: tmp, wishlist: ws, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch properties', loading: false });
      throw error;
    }
  },

  // Fetch properties by owner
  fetchPropertiesByOwner: async (ownerId) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`http://localhost:3000/property/properties/owner/${ownerId}`);
      set({ myproperties: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch properties', loading: false });
      throw error;
    }
  },

  // Update property
  updateProperty: async (apn, propertyData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`http://localhost:3000/property/update/${apn}`, propertyData);
      
      // Update local state
      set(state => ({
        properties: state.properties.map(p => 
          p.apn === apn ? { ...p, ...propertyData } : p
        ),
        myproperties: state.myproperties.map(p => 
          p.apn === apn ? { ...p, ...propertyData } : p
        ),
        loading: false
      }));
      
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to update property', loading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useProperty;

