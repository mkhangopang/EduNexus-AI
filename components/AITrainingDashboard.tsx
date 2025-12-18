
import React from 'react';
import { 
  PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { AlertCircle, CheckCircle, Brain, Target, MessageSquare, ArrowUpRight, BrainCircuit } from 'lucide-react';

const queryTypeData = [
  { name: 'Rubric Generation', value: 35 },
  { name: 'Lesson Planning', value: 30 },
  { name: 'Assessment', value: 20 },
  { name: 'Chat/Q&A', value: 15 },
];

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#64748b'];

const performanceData = [
  { day: 'Mon', success: 92, error: 2 },
  { day: 'Tue', success: 88, error: 4 },
  { day: 'Wed', success: 94, error: 1 },
  { day: 'Thu', success: 91, error: 3 },
  { day: 'Fri', success: 95, error: 2 },
  { day: 'Sat', success: 97, error: 0 },
  { day: 'Sun', success: 98, error: 1 },
];

const mockInteractions = [
    { id: 'int_1293', query: 'Create 5E lesson for Photosynthesis', type: 'Lesson Plan', rating: 5, status: 'success', time: '2 mins ago' },
    { id: 'int_1294', query: 'MCQ for Romeo and Juliet Act 2', type: 'Assessment', rating: 4, status: 'success', time: '5 mins ago' },
    { id: 'int_1295', query: 'Differentiation for Calculus AB', type: 'Differentiation', rating: 2, status: 'flagged', time: '12 mins ago' },
    { id: 'int_1296', query: 'Rubric for Oral Presentation', type: 'Rubric', rating: 5, status: 'success', time: '15 mins ago' },
    { id: 'int_1297', query: 'Explain Quantum Entanglement simply', type: 'Chat', rating: 1, status: 'flagged', time: '22 mins ago' },
];

export const AITrainingDashboard: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">AI Training Dashboard</h2>
                    <p className="text-slate-500">Monitor automated learning loops and model performance.</p>
                </div>
                <div className="flex gap-3">
                    <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Auto-Training Active
                    </span>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><Brain size={24} /></div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">45,231</h3>
                    <p className="text-sm text-slate-500">Total Interactions</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Target size={24} /></div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+2.4%</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">94.8%</h3>
                    <p className="text-sm text-slate-500">Response Success Rate</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><MessageSquare size={24} /></div>
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">Last 7d</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">1,204</h3>
                    <p className="text-sm text-slate-500">Feedback Received</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><BrainCircuit size={24} /></div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">v4.1 Pending</span>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">342</h3>
                    <p className="text-sm text-slate-500">Patterns Learned</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Query Patterns */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Common Query Patterns</h3>
                    <div className="h-64 flex">
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={queryTypeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {queryTypeData.map((_entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-40 flex flex-col justify-center gap-3">
                            {queryTypeData.map((entry, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-slate-700">{entry.value}%</span>
                                        <span className="text-xs text-slate-500">{entry.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Trend */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-6">Success vs. Error Rate (7 Days)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={performanceData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                <Tooltip />
                                <Line type="monotone" dataKey="success" stroke="#10b981" strokeWidth={3} dot={{r: 4}} name="Success Rate" />
                                <Line type="monotone" dataKey="error" stroke="#ef4444" strokeWidth={3} dot={{r: 4}} name="Error Rate" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Interactions Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Recent Training Interactions</h3>
                    <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-1">
                        View All <ArrowUpRight size={16} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium">Query Snippet</th>
                                <th className="px-6 py-4 font-medium">Type</th>
                                <th className="px-6 py-4 font-medium">Rating</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Time</th>
                                <th className="px-6 py-4 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {mockInteractions.map((interaction) => (
                                <tr key={interaction.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-slate-800 font-medium truncate max-w-xs">{interaction.query}</td>
                                    <td className="px-6 py-4 text-slate-500">{interaction.type}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex text-amber-400 gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < interaction.rating ? 'opacity-100' : 'opacity-30'}>★</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {interaction.status === 'success' ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle size={12} /> Success
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                <AlertCircle size={12} /> Flagged
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400">{interaction.time}</td>
                                    <td className="px-6 py-4">
                                        <button className="text-indigo-600 hover:text-indigo-900 font-medium">Analyze</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
