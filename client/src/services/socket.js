import { io } from 'socket.io-client';

// Use production Render URL as primary/fallback so all remote devices connect to Render
const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'https://wolf-96hv.onrender.com';

export const socket = io(SERVER_URL, {
  autoConnect: true,
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000
});
