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

  // Set modal state
  setIsAddPropertyModalOpen: (isOpen) => set({ isAddPropertyModalOpen: isOpen }),

  // Set current insight property
  setCurrentInsightProperty: (property) => set({ currentInsightProperty: property }),

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

