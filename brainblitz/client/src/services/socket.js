import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: localStorage.getItem('bb_token') },
      autoConnect: false,
    });
  }
  return socket;
};

export const connectSocket    = () => getSocket().connect();
export const disconnectSocket = () => { if (socket) { socket.disconnect(); socket = null; } };
