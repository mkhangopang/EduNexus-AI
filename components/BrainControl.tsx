import React, { useState } from 'react';
import { Save, RefreshCw, AlertTriangle } from 'lucide-react';
import { MASTER_PROMPT_SYSTEM_INSTRUCTION } from '../services/geminiService';

export const BrainControl: React.FC = () => {
    const [prompt, setPrompt] = useState(MASTER_PROMPT_SYSTEM_INSTRUCTION);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Neural Core Control</h2>
                    <p className="text-slate-500">Manage the global AI personality and pedagogical framework.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                        <RefreshCw size={18} /> Reset to Default
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="font-semibold text-amber-800">Caution: Global Impact</h4>
                    <p className="text-sm text-amber-700">Changes here affect all 12,450 users immediately. Please test in Staging environment first.</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
                <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-500">system_instruction.txt</span>
                    <span className="text-xs font-mono text-slate-500">v4.0.1</span>
                </div>
                <textarea 
                    className="flex-1 w-full p-4 font-mono text-sm bg-slate-900 text-slate-200 resize-none focus:outline-none"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    spellCheck={false}
                />
            </div>
        </div>
    );
};