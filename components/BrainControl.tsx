import React, { useState } from 'react';
import { Save, RefreshCw, AlertTriangle, TrendingUp, ThumbsUp, AlertCircle, ArrowRight, BrainCircuit } from 'lucide-react';
import { MASTER_PROMPT_SYSTEM_INSTRUCTION } from '../services/geminiService';

export const BrainControl: React.FC = () => {
    const [prompt, setPrompt] = useState(MASTER_PROMPT_SYSTEM_INSTRUCTION);

    return (
        <div className="p-6 space-y-8 h-full overflow-y-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <BrainCircuit className="text-indigo-600" />
                        Neural Core Control
                    </h2>
                    <p className="text-slate-500">Manage the global AI personality and pedagogical framework.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                        <RefreshCw size={18} /> Reset to Default
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <h4 className="font-semibold text-amber-800">Caution: Global Impact</h4>
                    <p className="text-sm text-amber-700">Changes here affect all 12,450 users immediately. Please test in Staging environment first.</p>
                </div>
            </div>

            {/* Editor Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[500px]">
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

            {/* AI Training Insights Section */}
            <div className="border-t border-slate-200 pt-8">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" size={24}/>
                    AI Training Insights <span className="text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">Weekly Auto-Analysis</span>
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Pattern Recognition */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-4">
                             <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><TrendingUp size={18}/></div>
                             <h4 className="font-semibold text-slate-700">Emerging Patterns</h4>
                        </div>
                        <ul className="space-y-4">
                            <li className="text-sm border-l-2 border-blue-500 pl-3">
                                <span className="block font-medium text-slate-800">Rubric Preference</span>
                                <span className="text-slate-500 text-xs">67% of users explicitly request "4-point scales" over 5-point.</span>
                            </li>
                             <li className="text-sm border-l-2 border-blue-500 pl-3">
                                <span className="block font-medium text-slate-800">Context Usage</span>
                                <span className="text-slate-500 text-xs">89% of science queries reference NGSS standards.</span>
                            </li>
                            <li className="text-sm border-l-2 border-blue-500 pl-3">
                                <span className="block font-medium text-slate-800">Differentiation</span>
                                <span className="text-slate-500 text-xs">"ELL Support" is the most requested add-on for Lesson Plans.</span>
                            </li>
                        </ul>
                    </div>

                    {/* Card 2: Success Analysis */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-4">
                             <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><ThumbsUp size={18}/></div>
                             <h4 className="font-semibold text-slate-700">High Performance</h4>
                        </div>
                         <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 font-medium">UbD Lesson Plans</span>
                                    <span className="font-bold text-emerald-600">4.9/5.0</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full w-[98%] shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-600 font-medium">Differentiation Wizard</span>
                                    <span className="font-bold text-emerald-600">4.8/5.0</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full w-[96%] shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div></div>
                            </div>
                             <div className="bg-emerald-50 p-3 rounded-lg text-xs text-emerald-800 border border-emerald-100">
                                <strong>Insight:</strong> Detailed scaffolding in Tier 1 differentiation is driving high user satisfaction.
                            </div>
                         </div>
                    </div>

                    {/* Card 3: Areas for Improvement */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-4">
                             <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><AlertCircle size={18}/></div>
                             <h4 className="font-semibold text-slate-700">Optimization Targets</h4>
                        </div>
                        <ul className="space-y-3">
                            <li className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-amber-900 text-sm">Essay Prompts</span>
                                    <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-700 font-bold">High Regen</span>
                                </div>
                                <p className="text-xs text-amber-800 mb-2">32% regeneration rate. Users find prompts too broad.</p>
                                <button className="text-xs font-semibold text-amber-700 flex items-center hover:underline group">
                                    Apply Suggested Fix <ArrowRight size={10} className="ml-1 group-hover:translate-x-0.5 transition-transform"/>
                                </button>
                            </li>
                             <li className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-amber-900 text-sm">Token Usage</span>
                                    <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-amber-200 text-amber-700 font-bold">Cost Alert</span>
                                </div>
                                <p className="text-xs text-amber-800">Average response length for "Concise" format exceeds target by 15%.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};