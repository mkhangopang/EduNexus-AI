import React, { useEffect, useRef, useState } from 'react';
import { realtime } from '../services/realtimeService';
import { Collaborator } from '../types';
import { CollaboratorHeader } from './CollaboratorHeader';
import { Loader2 } from 'lucide-react';

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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Connect to the room
        realtime.joinRoom(`doc_${documentId}`, currentUser);

        // Listen for presence changes
        const unsubscribePresence = realtime.on('presence', (payload: any) => {
            if (payload.action === 'join') {
                setCollaborators(prev => {
                    // Avoid duplicates
                    const newUsers = payload.users.filter((u: Collaborator) => !prev.find(p => p.id === u.id));
                    return [...prev, ...newUsers];
                });
            }
        });

        // Listen for cursor updates
        const unsubscribeCursor = realtime.on('cursor', (payload: any) => {
            const p = payload as { userId: string; x: number; y: number };
            setCursors(prev => ({
                ...prev,
                [p.userId]: { x: p.x, y: p.y }
            }));
        });

        // Listen for text updates
        const unsubscribeText = realtime.on('text_update', (payload: any) => {
            // In a real application, we would use CRDTs (like Yjs) or Operational Transformation
            // to merge changes intelligently without overwriting the local user's work.
            // For this simulated demo, we simply append the remote text.
            setContent(prev => prev + payload.text);
            
            // Optional: Scroll to bottom to show change if appropriate
            // if (textareaRef.current) textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        });

        return () => {
            realtime.leaveRoom();
            unsubscribePresence();
            unsubscribeCursor();
            unsubscribeText();
        };
    }, [documentId, currentUser]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        realtime.broadcastTextChange(e.target.value);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLTextAreaElement>) => {
        // Broadcast approximate cursor position based on mouse for demo purposes
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100; // Percentage
        const y = e.clientY - rect.top; // Pixels
        realtime.broadcastCursor(x, y);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            <CollaboratorHeader 
                activeUsers={collaborators} 
                documentTitle={`Curriculum_Draft_v${documentId}.docx`}
                onInvite={() => alert("Invite link copied to clipboard!")}
            />
            
            <div className="flex-1 p-8 overflow-auto flex justify-center">
                <div className="w-full max-w-4xl bg-white shadow-md rounded-xl min-h-[800px] relative p-12 border border-slate-200">
                    
                    {/* Render Remote Cursors */}
                    {Object.entries(cursors).map(([userId, pos]: [string, { x: number; y: number }]) => {
                        const user = collaborators.find(c => c.id === userId);
                        if (!user) return null;
                        return (
                            <div 
                                key={userId}
                                className="absolute pointer-events-none transition-all duration-300 ease-out z-10"
                                style={{ 
                                    left: `${pos.x}%`, 
                                    top: `${pos.y}px` 
                                }}
                            >
                                <div 
                                    className="w-0.5 h-6 absolute" 
                                    style={{ backgroundColor: user.color }}
                                />
                                <div 
                                    className="absolute -top-6 left-0 px-2 py-0.5 rounded text-white text-[10px] font-bold whitespace-nowrap shadow-sm"
                                    style={{ backgroundColor: user.color }}
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