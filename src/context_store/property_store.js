import { create } from 'zustand';
import axios from 'axios';

const useProperty = create((set) => ({
  isAddPropertyModalOpen: false,
  amenities: [],
  properties: [],
  loading: false,
  error: null,

  // Set modal state
  setIsAddPropertyModalOpen: (isOpen) => set({ isAddPropertyModalOpen: isOpen }),

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
  fetchAllProperties: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get('http://localhost:3000/property/properties');
      set({ properties: response.data, loading: false });
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
      set({ properties: response.data, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to fetch properties', loading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => set({ error: null })
}));

export default useProperty;

