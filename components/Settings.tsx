import React from 'react';
import { User } from '../types';
import { Bell, Shield, User as UserIcon, Moon } from 'lucide-react';

interface SettingsProps {
    user: User;
}

export const Settings: React.FC<SettingsProps> = ({ user }) => {
    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-slate-800">Account Settings</h2>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-start gap-6">
                    <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full border-4 border-slate-50" />
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
                        <p className="text-slate-500 capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
                        <button className="mt-3 text-sm text-indigo-600 font-medium hover:text-indigo-700">Change Avatar</button>
                    </div>
                </div>
                
                <div className="divide-y divide-slate-100">
                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><UserIcon size={20} /></div>
                            <div>
                                <p className="font-medium text-slate-800">Profile Information</p>
                                <p className="text-sm text-slate-500">Update your name and email address</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Edit</button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Bell size={20} /></div>
                            <div>
                                <p className="font-medium text-slate-800">Notifications</p>
                                <p className="text-sm text-slate-500">Manage email and push notifications</p>
                            </div>
                        </div>
                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-indigo-600 rounded-full cursor-pointer">
                            <span className="absolute left-6 top-1 bg-white w-4 h-4 rounded-full transition-all"></span>
                        </div>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Shield size={20} /></div>
                            <div>
                                <p className="font-medium text-slate-800">Security & Privacy</p>
                                <p className="text-sm text-slate-500">2FA and password settings</p>
                            </div>
                        </div>
                        <button className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50">Manage</button>
                    </div>

                    <div className="p-6 flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Moon size={20} /></div>
                            <div>
                                <p className="font-medium text-slate-800">Dark Mode</p>
                                <p className="text-sm text-slate-500">Switch between light and dark themes</p>
                            </div>
                        </div>
                         <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-slate-200 rounded-full cursor-pointer">
                            <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};