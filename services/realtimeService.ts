
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { RealtimeChannel } from '@supabase/supabase-js';

type EventHandler = (payload: any) => void;

class RealtimeService {
  private channel: RealtimeChannel | null = null;
  private listeners: Record<string, EventHandler[]> = {};

  // Join a Supabase Realtime Channel
  joinRoom(roomId: string, user: { id: string; name: string; avatar: string; color?: string }) {
    // Safety check for Demo/Pitch mode without backend
    if (!isSupabaseConfigured()) {
        console.warn("[Realtime] Supabase not configured. Running in local simulation mode.");
        return;
    }

    // Cleanup previous channel if exists
    if (this.channel) this.leaveRoom();

    console.log(`[Realtime] Joining room: ${roomId}`);

    this.channel = supabase.channel(roomId, {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    this.channel
      .on('presence', { event: 'sync' }, () => {
        const state = this.channel?.presenceState();
        // Transform Supabase presence state object into a flat array of users
        const users: any[] = [];
        if (state) {
            Object.keys(state).forEach(key => {
                // Each key is a user ID, value is an array of presence objects (sessions)
                // We take the first session as the active user data
                if (state[key] && state[key].length > 0) {
                    users.push(state[key][0]);
                }
            });
        }
        this.emit('presence', users);
      })
      .on('broadcast', { event: 'cursor' }, (payload) => this.emit('cursor', payload.payload))
      .on('broadcast', { event: 'text_update' }, (payload) => this.emit('text_update', payload.payload))
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
           console.log(`[Realtime] Subscribed to ${roomId}`);
           const userStatus = {
               id: user.id,
               name: user.name,
               avatar: user.avatar,
               color: user.color || '#4f46e5',
               status: 'online',
               joinedAt: new Date().toISOString()
           };
           await this.channel?.track(userStatus);
        }
      });
  }

  leaveRoom() {
    if (this.channel) {
        console.log('[Realtime] Leaving room');
        supabase.removeChannel(this.channel);
        this.channel = null;
        this.listeners = {};
    }
  }

  // Subscribe to internal events (bridging Supabase events to React components)
  on(event: string, callback: EventHandler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
        }
    };
  }

  // Internal event dispatcher
  private emit(event: string, payload: any) {
    if (this.listeners[event]) {
        this.listeners[event].forEach(cb => cb(payload));
    }
  }

  // Broadcast local cursor position
  broadcastCursor(x: number, y: number, userId: string) {
     if (!this.channel) return;
     this.channel.send({
         type: 'broadcast',
         event: 'cursor',
         payload: { userId, x, y }
     });
  }

  // Broadcast text changes
  broadcastTextChange(newText: string, userId: string) {
     if (!this.channel) return;
     this.channel.send({
         type: 'broadcast',
         event: 'text_update',
         payload: { userId, text: newText }
     });
  }
}

export const realtime = new RealtimeService();
