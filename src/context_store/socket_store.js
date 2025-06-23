import { create } from 'zustand';
import { io } from 'socket.io-client';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useSocket = create((set) => ({
    socket: null,
    isConnected: false,

    // Initialize socket connection
    initializeSocket: (userId) => {
        const socket = io(`${BACKEND_URL}`, {
            query: { userId }
        });

        socket.on('connect', () => {
            console.log('Socket connected');
            set({ isConnected: true });
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            set({ isConnected: false });
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            set({ isConnected: false });
        });

        set({ socket });
    },

    // Disconnect socket
    disconnectSocket: () => {
        const { socket } = useSocket.getState();
        if (socket) {
            socket.disconnect();
            set({ socket: null, isConnected: false });
        }
    }
}));

export default useSocket; 