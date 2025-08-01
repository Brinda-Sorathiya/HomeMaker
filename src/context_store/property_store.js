import { create } from 'zustand';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useProperty = create((set) => ({
  isAddPropertyModalOpen: false,
  amenities: [],
  properties: [],
  myproperties : [],
  currentInsightProperty: null,
  loading: false,
  error: null,
  wishlist: [],

  setIsAddPropertyModalOpen: (isOpen) => set({ isAddPropertyModalOpen: isOpen }),
  setCurrentInsightProperty: (property) => set({ currentInsightProperty: property }),

  // Add to wishlist
  addToWishlist: async (propertyId) => {
    try {
      const response = await axios.post(`${BACKEND_URL}/property/wish`, { propertyId });
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
  removeFromWishlist: async (propertyId) => {
    try {
      await axios.delete(`${BACKEND_URL}/property/unwish/${propertyId}`);
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

  // Fetch amenities from backend
  fetchAmenities: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BACKEND_URL}/property/amenities`);
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
      const response = await axios.post(`${BACKEND_URL}/property/add`, propertyData);
      set({ loading: false, isAddPropertyModalOpen: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to add property', loading: false });
      throw error;
    }
  },

  // Fetch all properties
  fetchAllProperties: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BACKEND_URL}/property/properties`);
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
  fetchPropertiesByOwner: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BACKEND_URL}/property/properties_owner`);
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
      const response = await axios.put(`${BACKEND_URL}/property/update/${apn}`, propertyData);
      
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

