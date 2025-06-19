import { create } from 'zustand';
import axios from 'axios';
import useProperty from './property_store';

const useRecommendation = create((set, get) => ({
  recommendations: [],
  loading: false,
  error: null,

  fetchRecommendations: async (propertyId) => {
    if (!propertyId) return;
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`http://localhost:3000/recommend/${propertyId}`);
      const apnList = res.data;
      // Get properties from property store
      const properties = useProperty.getState().properties;
      const recommended = Array.isArray(apnList)
        ? properties.filter(p => apnList.includes(p.apn))
        : [];
      set({ recommendations: recommended, loading: false });
    } catch (err) {
      set({ recommendations: [], loading: false, error: err.response?.data?.message || err.message || 'Error' });
    }
  },

  clearRecommendations: () => set({ recommendations: [], loading: false, error: null }),

}));

export default useRecommendation; 