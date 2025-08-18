import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-api-domain.com' 
  : 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        console.log('Connected to Socket.io server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from Socket.io server');
      });
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  joinAnime(animeId: string): void {
    if (this.socket) {
      this.socket.emit('join anime', animeId);
    }
  }

  leaveAnime(animeId: string): void {
    if (this.socket) {
      this.socket.emit('leave anime', animeId);
    }
  }
}

export const socket = new SocketService().connect();
export default SocketService;