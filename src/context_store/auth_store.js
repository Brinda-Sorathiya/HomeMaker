import { create } from 'zustand';
import axios from 'axios';

const useAuth = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  // Register user
  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post('http://localhost:3000/auth/register', userData);
      set({ user: response.data.user, isAuthenticated: true, loading: false });
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
      const response = await axios.post('http://localhost:3000/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Set default authorization header for all future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      set({ user, isAuthenticated: true, loading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Login failed', loading: false });
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
        const response = await axios.get('http://localhost:3000/auth/me');
        set({ 
          user: response.data.user, 
          isAuthenticated: true,
          loading: false 
        });
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