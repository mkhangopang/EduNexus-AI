import React, { useState } from 'react';
import { Collaborator } from '../types';
import { Users, Plus, Share2, Circle } from 'lucide-react';

interface CollaboratorHeaderProps {
    activeUsers: Collaborator[];
    documentTitle: string;
    onInvite: () => void;
}

export const CollaboratorHeader: React.FC<CollaboratorHeaderProps> = ({ activeUsers, documentTitle, onInvite }) => {
    return (
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg">
                    <Share2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h2 className="font-semibold text-slate-800 text-lg leading-tight">{documentTitle}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live Sync Active
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex -space-x-3 items-center">
                    {activeUsers.map((user) => (
                        <div key={user.id} className="relative group cursor-pointer transition-transform hover:-translate-y-1">
                            <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-9 h-9 rounded-full border-2 border-white object-cover"
                                style={{ borderColor: user.status === 'online' ? '#ffffff' : '#f1f5f9' }}
                            />
                            <div 
                                className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                                style={{ backgroundColor: user.status === 'online' ? '#10b981' : '#f59e0b' }}
                            />
                            {/* Tooltip */}
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-30">
                                {user.name}
                            </div>
                        </div>
                    ))}
                    <button 
                        onClick={onInvite}
                        className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border-2 border-white text-slate-500 hover:bg-slate-200 transition-colors"
                        title="Add people"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <button 
                    onClick={onInvite}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Users className="w-4 h-4" />
                    Share
                </button>
            </div>
        </div>
    );
};
