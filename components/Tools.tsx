
import React from 'react';
import { BookOpen, ListChecks, Target, Network, Layers, FileOutput, Lock, Infinity, FileText } from 'lucide-react';
import { AITool, User, Document } from '../types';

const tools: AITool[] = [
    { 
        id: '1', 
        name: 'Rubric Generator', 
        description: "Create Bloom's aligned rubrics in seconds.", 
        icon: 'ListChecks', 
        promptTemplate: 'Generate a Type 1: Rubric for the following assignment/standard found in the text: ',
        minPlan: 'free'
    },
    { 
        id: '2', 
        name: 'Lesson Planner', 
        description: "Draft 5E or UbD lesson plans instantly.", 
        icon: 'BookOpen', 
        promptTemplate: 'Create a Type 3: Lesson Plan (specify 5E or UbD) based on the following content: ',
        minPlan: 'free'
    },
    { 
        id: '3', 
        name: 'Assessment Builder', 
        description: "Generate MCQs and essay prompts.", 
        icon: 'Target', 
        promptTemplate: 'Create a Type 2: Assessment (5 MCQs) and one Type 4: Short Response based on: ',
        minPlan: 'free'
    },
    { 
        id: '4', 
        name: 'SLO Auto-Tagger', 
        description: "Identify learning objectives automatically.", 
        icon: 'Target', 
        promptTemplate: 'Extract all Student Learning Objectives (SLOs) and tag with Bloom\'s/DOK levels from this content: ',
        minPlan: 'pro'
    },
    { 
        id: '5', 
        name: 'Differentiation Wizard', 
        description: "Scaffold content for diverse learners.", 
        icon: 'Layers', 
        promptTemplate: 'Apply Type 5: Differentiation (3-Tier System) to this specific section of the content: ',
        minPlan: 'pro'
    },
    { 
        id: '6', 
        name: 'Standards Mapper', 
        description: "Align content to Common Core/NGSS.", 
        icon: 'Network', 
        promptTemplate: 'Map the following content to [State/National] standards and identify gaps: ',
        minPlan: 'pro'
    },
];

const IconMap: Record<string, React.FC<any>> = {
    ListChecks, BookOpen, Target, Layers, Network, FileOutput
};

interface ToolGridProps {
    user: User;
    activeDocument: Document | null;
    onUpgrade: () => void;
    onLaunchTool: (tool: AITool, contextContent: string) => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({ user, activeDocument, onUpgrade, onLaunchTool }) => {
    // Helper to check access
    const hasAccess = (toolPlan: 'free' | 'pro' | 'enterprise') => {
        if (toolPlan === 'free') return true;
        if (toolPlan === 'pro') return user.plan === 'pro' || user.plan === 'enterprise';
        if (toolPlan === 'enterprise') return user.plan === 'enterprise';
        return false;
    };

    const getPlanLimitDisplay = () => {
        if (user.plan === 'enterprise') return 'Unlimited';
        if (user.plan === 'pro') return '500';
        return '50';
    };

    const handleLaunch = (tool: AITool) => {
        if (activeDocument && activeDocument.content) {
            onLaunchTool(tool, activeDocument.content);
        } else {
            // If no doc, we still launch but maybe prompt user to paste text
            // For now we just log
            console.log("No active document context");
            alert("Please select a document from the Dashboard or My Documents to use this tool with context.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">AI Generation Tools</h2>
                    {activeDocument && (
                        <p className="text-sm text-indigo-600 font-medium flex items-center gap-1 mt-1">
                            <FileText size={14} />
                            Context: {activeDocument.name} ({activeDocument.subject})
                        </p>
                    )}
                </div>
                <div className="flex gap-2 items-center self-end md:self-auto">
                    <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm flex items-center gap-1">
                        Queries: <span className="text-indigo-600 font-bold">{getPlanLimitDisplay()}</span>
                        {user.plan === 'enterprise' && <Infinity size={14} className="text-indigo-600"/>}
                    </span>
                    {user.plan === 'free' && (
                        <button 
                            onClick={onUpgrade}
                            className="text-sm font-medium text-white bg-indigo-600 px-3 py-1 rounded-full shadow-sm hover:bg-indigo-700 transition-colors"
                        >
                            Upgrade
                        </button>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => {
                    const Icon = IconMap[tool.icon] || FileOutput;
                    const isLocked = !hasAccess(tool.minPlan);

                    return (
                        <div 
                            key={tool.id} 
                            onClick={() => isLocked ? onUpgrade() : handleLaunch(tool)}
                            className={`group relative bg-white p-6 rounded-xl border shadow-sm transition-all duration-300 ${
                                isLocked 
                                ? 'border-slate-100 cursor-not-allowed overflow-hidden' 
                                : 'border-slate-200 hover:shadow-md hover:border-indigo-200 cursor-pointer'
                            }`}
                        >
                            {/* Pro Badge for Tools that are Pro but unlocked */}
                            {!isLocked && tool.minPlan === 'pro' && (
                                <span className="absolute top-4 right-4 text-[10px] uppercase font-bold text-white bg-indigo-500 px-2 py-0.5 rounded-full shadow-sm">
                                    PRO
                                </span>
                            )}

                            {/* Locked Overlay */}
                            {isLocked && (
                                <div className="absolute inset-0 bg-slate-50/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white p-3 rounded-full shadow-lg mb-2 scale-90 group-hover:scale-100 transition-transform">
                                        <Lock className="w-6 h-6 text-indigo-600" />
                                    </div>
                                    <p className="font-bold text-slate-800 text-sm">
                                        Requires {tool.minPlan === 'enterprise' ? 'Enterprise' : 'Pro'} Plan
                                    </p>
                                    <span className="text-xs text-indigo-600 font-medium mt-1">Click to Upgrade</span>
                                </div>
                            )}

                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${
                                isLocked ? 'bg-slate-100 grayscale' : 'bg-indigo-50 group-hover:bg-indigo-600 group-hover:scale-110'
                            }`}>
                                <Icon className={`w-6 h-6 transition-colors ${
                                    isLocked ? 'text-slate-400' : 'text-indigo-600 group-hover:text-white'
                                }`} />
                            </div>
                            <h3 className={`text-lg font-bold mb-2 ${isLocked ? 'text-slate-400' : 'text-slate-800'}`}>{tool.name}</h3>
                            <p className={`text-sm mb-4 ${isLocked ? 'text-slate-300' : 'text-slate-500'}`}>{tool.description}</p>
                            
                            <div className="flex items-center justify-between">
                                <button disabled={isLocked} className={`py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                                    isLocked 
                                    ? 'bg-slate-100 text-slate-400' 
                                    : 'text-indigo-600 bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white w-full'
                                }`}>
                                    {isLocked ? 'Locked' : activeDocument ? 'Use with Active Doc' : 'Launch Tool'}
                                </button>
                                
                                {isLocked && (
                                    <span className="absolute top-4 right-4 text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full border border-slate-200">
                                        {tool.minPlan}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
