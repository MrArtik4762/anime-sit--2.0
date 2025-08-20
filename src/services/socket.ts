import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

class SocketService {
  private socket: Socket | null = null;

  connect(): Socket | null {
    // Если URL сокета пустой, не подключаемся
    if (!SOCKET_URL) {
      console.log('Socket.io disabled: VITE_SOCKET_URL is empty');
      return null;
    }

    if (!this.socket) {
      try {
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
      } catch (error) {
        console.error('Failed to connect to Socket.io:', error);
        return null;
      }
    }

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      try {
        this.socket.disconnect();
        this.socket = null;
      } catch (error) {
        console.error('Error disconnecting from Socket.io:', error);
      }
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  joinAnime(animeId: string): void {
    if (this.socket && this.socket.emit) {
      this.socket.emit('join anime', animeId);
    }
  }

  leaveAnime(animeId: string): void {
    if (this.socket && this.socket.emit) {
      this.socket.emit('leave anime', animeId);
    }
  }
}

export const socket = new SocketService().connect();
export default SocketService;