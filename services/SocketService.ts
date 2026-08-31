import { io, Socket } from 'socket.io-client';
import { getAccessToken } from './TokenService';
import { NotificationPayload } from '@/types';

class SocketServiceClass {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(...args: any[]) => void>> = new Map();
  private attachedEvents: Set<string> = new Set();

  connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const socketUrl = apiUrl.replace('/api', '');
    const token = getAccessToken();

    this.socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      auth: {
        token: token ? `Bearer ${token}` : undefined,
      },
      extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    // Attach master multiplexers for all subscribed events
    this.listeners.forEach((_, event) => {
      this.ensureSocketListener(event);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.attachedEvents.clear();
    }
  }

  private ensureSocketListener(event: string) {
    if (!this.socket || this.attachedEvents.has(event)) return;

    // Attach exactly ONE listener per event on the raw socket that dispatches to all subscribers
    this.socket.on(event, (...args: any[]) => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        callbacks.forEach((cb) => {
          try {
            cb(...args);
          } catch (err) {
            console.error(`Error in socket listener for ${event}:`, err);
          }
        });
      }
    });

    this.attachedEvents.add(event);
  }

  onNotification(callback: (notification: NotificationPayload) => void): () => void {
    return this.on('notification', callback);
  }

  on(event: string, callback: (...args: any[]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event)?.add(callback);
    this.ensureSocketListener(event);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  emit(event: string, ...args: any[]): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, ...args);
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

const SocketService = new SocketServiceClass();
export default SocketService;
