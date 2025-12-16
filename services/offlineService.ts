
import { Document } from '../types';

const DB_NAME = 'EduNexusDB';
const DB_VERSION = 1;
const STORES = {
  DOCUMENTS: 'documents',
  SYNC_QUEUE: 'syncQueue'
};

interface SyncTask {
  id: string;
  type: 'UPDATE_DOC' | 'AI_GENERATION';
  payload: any;
  timestamp: number;
}

interface SyncHandlers {
    onProgress?: (remaining: number) => void;
    onProcessAI?: (payload: any) => Promise<void>;
}

class OfflineService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORES.DOCUMENTS)) {
          db.createObjectStore(STORES.DOCUMENTS, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
        }
      };
    });
  }

  // --- Document Operations ---

  async saveDocument(doc: Document): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.DOCUMENTS], 'readwrite');
      const store = transaction.objectStore(STORES.DOCUMENTS);
      const request = store.put(doc);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getDocuments(): Promise<Document[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.DOCUMENTS], 'readonly');
      const store = transaction.objectStore(STORES.DOCUMENTS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getDocument(id: string): Promise<Document | undefined> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.DOCUMENTS], 'readonly');
      const store = transaction.objectStore(STORES.DOCUMENTS);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // --- Sync Queue Operations ---

  async queueAction(type: 'UPDATE_DOC' | 'AI_GENERATION', payload: any): Promise<void> {
    if (!this.db) await this.init();
    const task: SyncTask = {
      id: crypto.randomUUID(),
      type,
      payload,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SYNC_QUEUE], 'readwrite');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.add(task);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPendingActions(): Promise<SyncTask[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SYNC_QUEUE], 'readonly');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async clearProcessedAction(id: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORES.SYNC_QUEUE], 'readwrite');
      const store = transaction.objectStore(STORES.SYNC_QUEUE);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- Sync Logic ---

  async syncPendingActions(handlers: SyncHandlers = {}): Promise<number> {
    const actions = await this.getPendingActions();
    if (actions.length === 0) return 0;

    let remaining = actions.length;
    console.log(`[OfflineService] Syncing ${remaining} pending actions...`);

    for (const action of actions) {
      try {
        if (action.type === 'UPDATE_DOC') {
          // In a real app, this would call supabase.from('documents').upsert(...)
          console.log('[OfflineService] Syncing Doc:', action.payload.id);
          // Simulate API latency
          await new Promise(r => setTimeout(r, 500));
        } else if (action.type === 'AI_GENERATION') {
            console.log('[OfflineService] Processing queued AI prompt:', action.payload);
            if (handlers.onProcessAI) {
                await handlers.onProcessAI(action.payload);
            }
        }
        
        await this.clearProcessedAction(action.id);
        remaining--;
        if (handlers.onProgress) handlers.onProgress(remaining);
      } catch (error) {
        console.error('[OfflineService] Failed to sync action', action.id, error);
        // Keep in queue to retry later
      }
    }
    
    return actions.length;
  }
}

export const offlineService = new OfflineService();
