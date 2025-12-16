
import React, { useEffect, useRef, useState } from 'react';
import { realtime } from '../services/realtimeService';
import { offlineService } from '../services/offlineService';
import { Collaborator, Document } from '../types';
import { CollaboratorHeader } from './CollaboratorHeader';
import { Loader2, WifiOff } from 'lucide-react';

interface LiveEditorProps {
    documentId: string;
    initialContent: string;
    currentUser: { id: string; name: string; avatar: string };
    onBack: () => void;
}

export const LiveEditor: React.FC<LiveEditorProps> = ({ documentId, initialContent, currentUser, onBack }) => {
    const [content, setContent] = useState(initialContent);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [cursors, setCursors] = useState<Record<string, { x: number; y: number }>>({});
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Load offline content if available
    useEffect(() => {
        const loadOfflineContent = async () => {
            if (!navigator.onLine) {
                const cachedDoc = await offlineService.getDocument(documentId);
                if (cachedDoc && cachedDoc.content) {
                    setContent(cachedDoc.content);
                }
            }
        };
        loadOfflineContent();
    }, [documentId]);

    useEffect(() => {
        const handleConnectionChange = () => setIsOffline(!navigator.onLine);
        window.addEventListener('online', handleConnectionChange);
        window.addEventListener('offline', handleConnectionChange);

        if (!isOffline) {
            // Connect to the room with user metadata
            realtime.joinRoom(`doc_${documentId}`, {
                ...currentUser,
                color: `#${Math.floor(Math.random()*16777215).toString(16)}` // Random cursor color
            });

            // Listen for presence sync (full list of users)
            const unsubscribePresence = realtime.on('presence', (users: Collaborator[]) => {
                setCollaborators(users);
            });

            // Listen for cursor updates
            const unsubscribeCursor = realtime.on('cursor', (payload: any) => {
                const p = payload as { userId: string; x: number; y: number };
                if (p.userId !== currentUser.id) {
                    setCursors(prev => ({
                        ...prev,
                        [p.userId]: { x: p.x, y: p.y }
                    }));
                }
            });

            // Listen for text updates
            const unsubscribeText = realtime.on('text_update', (payload: any) => {
                if (payload.userId !== currentUser.id) {
                    setContent(payload.text);
                }
            });

            return () => {
                realtime.leaveRoom();
                unsubscribePresence();
                unsubscribeCursor();
                unsubscribeText();
                window.removeEventListener('online', handleConnectionChange);
                window.removeEventListener('offline', handleConnectionChange);
            };
        }
    }, [documentId, currentUser, isOffline]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setContent(newVal);

        // 1. Broadcast if online
        if (!isOffline) {
            realtime.broadcastTextChange(newVal, currentUser.id);
        }

        // 2. Debounced save to Offline DB (acts as autosave & sync queue)
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        
        saveTimeoutRef.current = setTimeout(async () => {
            const docUpdate: Document = {
                id: documentId,
                name: `Curriculum_Draft_v${documentId}.docx`, // In real app, fetch actual name
                type: 'docx',
                size: '12kb',
                uploadedAt: new Date().toISOString(),
                status: 'processed',
                content: newVal,
                lastModifiedBy: currentUser.id
            };

            // Save to local indexedDB
            await offlineService.saveDocument(docUpdate);

            // If offline, specifically queue this for backend sync later
            if (isOffline) {
                await offlineService.queueAction('UPDATE_DOC', docUpdate);
            }
        }, 500); // 500ms debounce
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        if (isOffline) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100; // Percentage
        const y = e.clientY - rect.top; // Pixels
        realtime.broadcastCursor(x, y, currentUser.id);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <CollaboratorHeader 
                activeUsers={isOffline ? [] : collaborators} 
                documentTitle={`Curriculum_Draft_v${documentId}.docx`}
                onInvite={() => alert("Invite link copied to clipboard!")}
            />
            
            <div className="flex-1 p-8 overflow-auto flex justify-center">
                <div className="w-full max-w-4xl bg-white shadow-md rounded-xl min-h-[800px] relative p-12 border border-slate-200">
                    
                    {isOffline && (
                        <div className="absolute top-2 right-2 px-3 py-1 bg-amber-50 text-amber-600 text-xs rounded-lg border border-amber-200 flex items-center gap-2 z-20">
                            <WifiOff size={12} />
                            Editing Offline
                        </div>
                    )}

                    {/* Render Remote Cursors (only if online) */}
                    {!isOffline && Object.entries(cursors).map(([userId, pos]: [string, { x: number; y: number }]) => {
                        const user = collaborators.find(c => c.id === userId);
                        if (!user || userId === currentUser.id) return null;
                        
                        return (
                            <div 
                                key={userId}
                                className="absolute pointer-events-none transition-all duration-100 ease-linear z-10"
                                style={{ 
                                    left: `${pos.x}%`, 
                                    top: `${pos.y}px` 
                                }}
                            >
                                <div 
                                    className="w-0.5 h-6 absolute" 
                                    style={{ backgroundColor: user.color || '#4f46e5' }}
                                />
                                <div 
                                    className="absolute -top-6 left-0 px-2 py-0.5 rounded text-white text-[10px] font-bold whitespace-nowrap shadow-sm"
                                    style={{ backgroundColor: user.color || '#4f46e5' }}
                                >
                                    {user.name}
                                </div>
                            </div>
                        );
                    })}

                    <textarea
                        ref={textareaRef}
                        className="w-full h-full resize-none outline-none border-none text-slate-800 font-serif text-lg leading-relaxed bg-transparent relative z-0"
                        value={content}
                        onChange={handleInput}
                        onMouseMove={handleMouseMove}
                        spellCheck={false}
                        placeholder="Start typing your collaborative lesson plan..."
                    />
                </div>
            </div>

            <div className="fixed bottom-6 right-6 z-50">
                <button onClick={onBack} className="bg-slate-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-slate-700 transition-all text-sm font-medium">
                    Exit Editor
                </button>
            </div>
        </div>
    );
};
