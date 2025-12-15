import React from 'react';
import { BookOpen, ListChecks, Target, Network, Layers, FileOutput } from 'lucide-react';
import { AITool } from '../types';

const tools: AITool[] = [
    { 
        id: '1', 
        name: 'Rubric Generator', 
        description: "Create Bloom's aligned rubrics in seconds.", 
        icon: 'ListChecks', 
        promptTemplate: 'Generate a Type 1: Rubric for the following assignment/standard: ' 
    },
    { 
        id: '2', 
        name: 'Lesson Planner', 
        description: "Draft 5E or UbD lesson plans instantly.", 
        icon: 'BookOpen', 
        promptTemplate: 'Create a Type 3: Lesson Plan (specify 5E or UbD) for: ' 
    },
    { 
        id: '3', 
        name: 'Assessment Builder', 
        description: "Generate MCQs and essay prompts.", 
        icon: 'Target', 
        promptTemplate: 'Create a Type 2: Assessment (5 MCQs) and one Type 4: Short Response for: ' 
    },
    { 
        id: '4', 
        name: 'SLO Auto-Tagger', 
        description: "Identify learning objectives automatically.", 
        icon: 'Target', 
        promptTemplate: 'Extract all Student Learning Objectives (SLOs) and tag with Bloom\'s/DOK levels from: ' 
    },
    { 
        id: '5', 
        name: 'Differentiation Wizard', 
        description: "Scaffold content for diverse learners.", 
        icon: 'Layers', 
        promptTemplate: 'Apply Type 5: Differentiation (3-Tier System) to this content: ' 
    },
    { 
        id: '6', 
        name: 'Standards Mapper', 
        description: "Align content to Common Core/NGSS.", 
        icon: 'Network', 
        promptTemplate: 'Map the following content to [State/National] standards and identify gaps: ' 
    },
];

const IconMap: Record<string, React.FC<any>> = {
    ListChecks, BookOpen, Target, Layers, Network, FileOutput
};

export const ToolGrid: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-800">AI Generation Tools</h2>
                <div className="flex gap-2">
                    <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                        Plan Usage: 45 / 500 Queries
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => {
                    const Icon = IconMap[tool.icon] || FileOutput;
                    return (
                        <div key={tool.id} className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all cursor-pointer">
                            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:scale-110 transition-all duration-300">
                                <Icon className="w-6 h-6 text-primary-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2">{tool.name}</h3>
                            <p className="text-sm text-slate-500 mb-4">{tool.description}</p>
                            <button className="w-full py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                Launch Tool
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
