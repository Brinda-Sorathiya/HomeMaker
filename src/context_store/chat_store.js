import { create } from 'zustand';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useChat = create((set) => ({
  messages: [],
  loading: false,
  error: null,

  // Send a message to the backend and update messages
  sendMessage: async (userMessage) => {
    set({ loading: true, error: null });
    try {
      // Add user message to local state
      set(state => ({
        messages: [...state.messages, { sender: 'user', text: userMessage }],
      }));
      const response = await axios.post(`${BACKEND_URL}/chat/ask`, { message: userMessage });
      // Add bot response to local state
      set(state => ({
        messages: [...state.messages, { sender: 'bot', text: response.data.reply }],
        loading: false
      }));
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to send message', loading: false });
      throw error;
    }
  },

  // Clear chat
  clearChat: () => set({ messages: [] }),
  // Clear error
  clearError: () => set({ error: null })
}));

export default useChat; 