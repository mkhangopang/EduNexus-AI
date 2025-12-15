import { Collaborator } from '../types';

// Mock types for Supabase Realtime
type RealtimeEvent = 'presence' | 'cursor' | 'text_update';
type EventHandler = (payload: any) => void;

class RealtimeService {
  private listeners: Record<string, EventHandler[]> = {};
  private activeRoom: string | null = null;
  private currentUser: Partial<Collaborator> | null = null;

  // Simulation state
  private mockInterval: any;
  private mockTimeout: any;

  constructor() {
    this.listeners = {};
  }

  // Mimic supabase.channel().subscribe()
  joinRoom(roomId: string, user: { id: string; name: string; avatar: string }) {
    this.activeRoom = roomId;
    this.currentUser = { ...user, color: '#4f46e5', status: 'online' };
    console.log(`[Realtime] Joined room: ${roomId} as ${user.name}`);

    // Simulate network delay for presence sync
    this.mockTimeout = setTimeout(() => {
        this.emit('presence', { 
            action: 'join', 
            users: [
                { id: 'collab_1', name: 'Alice Teacher', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', color: '#10b981', status: 'online' },
                { id: 'collab_2', name: 'Bob Admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', color: '#f59e0b', status: 'idle' }
            ] 
        });
        this.startMockActivity();
    }, 800);
  }

  leaveRoom() {
    if (this.activeRoom) {
        console.log(`[Realtime] Left room: ${this.activeRoom}`);
        this.activeRoom = null;
        this.listeners = {};
        if (this.mockInterval) clearInterval(this.mockInterval);
        if (this.mockTimeout) clearTimeout(this.mockTimeout);
    }
  }

  // Subscribe to events
  on(event: RealtimeEvent, callback: EventHandler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    };
  }

  // Internal event dispatcher
  private emit(event: RealtimeEvent, payload: any) {
    if (this.listeners[event]) {
        this.listeners[event].forEach(cb => cb(payload));
    }
  }

  // Broadcast local actions to the "server"
  broadcastCursor(x: number, y: number) {
     // In a real app, this sends data to Supabase
     // supabase.channel(this.activeRoom).send({ type: 'broadcast', event: 'cursor', payload: { x, y } })
  }

  broadcastTextChange(newText: string) {
     // supabase.channel(this.activeRoom).send({ type: 'broadcast', event: 'text_update', payload: { text: newText } })
  }

  // Simulates incoming events from other users
  private startMockActivity() {
      // Periodic cursor movement for Alice
      this.mockInterval = setInterval(() => {
          const mockCursorUpdate = {
              userId: 'collab_1',
              x: Math.random() * 40 + 50, // Right half of screen
              y: Math.random() * 200 + 100 // Random pixel Y
          };
          this.emit('cursor', mockCursorUpdate);
      }, 2500);

      // Simulate a text insertion from Alice after 5 seconds
      setTimeout(() => {
          this.emit('text_update', {
              userId: 'collab_1',
              text: "\n\n[Collaborator Note: I added the standard alignment section below.]"
          });
      }, 5000);
  }
}

export const realtime = new RealtimeService();