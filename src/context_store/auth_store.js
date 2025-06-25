import { create } from 'zustand';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  what : false,

  // Register user
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/register`, userData);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      set({ user: response.data.user, isAuthenticated: true, loading: false, what : true });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Registration failed', loading: false });
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${BACKEND_URL}/auth/login`, credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ user: user, isAuthenticated: true, loading: false, what : true });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
      throw error;
    }
  },

  // Update user profile
  updateUser: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.put(`${BACKEND_URL}/auth/update`, userData);
      set({ user: response.data.user, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Update failed', loading: false });
      throw error;
    }
  },

  // Logout user
  logout: () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    
    // Remove authorization header
    delete axios.defaults.headers.common['Authorization'];
    
    set({ user: null, isAuthenticated: false, error: null });
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Initialize auth state
  initialize: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Set default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Fetch user data
        const response = await axios.get(`${BACKEND_URL}/auth/me`);
        set({ 
          user: response.data.user, 
          isAuthenticated: true,
          loading: false 
        })
      } catch (error) {
        console.error('Error initializing auth:', error);
        // If token is invalid, clear everything
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        set({ 
          user: null, 
          isAuthenticated: false,
          loading: false,
          error: 'Session expired. Please login again.'
        });
      }
    } else {
      set({ 
        user: null, 
        isAuthenticated: false,
        loading: false 
      });
    }
  }
}));

export default useAuth; 