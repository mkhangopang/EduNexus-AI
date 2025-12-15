import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { ToolGrid } from './components/Tools';
import { UsageChart, AdminTrainingChart, UserDistributionChart } from './components/DashboardCharts';
import { LiveEditor } from './components/LiveEditor';
import { BrainControl } from './components/BrainControl';
import { Settings } from './components/Settings';
import { UserRole, AppView, User } from './types';
import { Brain, Upload, FileText, CheckCircle, Users, Activity, Clock } from 'lucide-react';
import { MASTER_PROMPT_SYSTEM_INSTRUCTION } from './services/geminiService';

const mockUsers: Record<UserRole, User> = {
  [UserRole.APP_ADMIN]: {
    id: 'admin1',
    name: 'Sarah Connor',
    role: UserRole.APP_ADMIN,
    avatar: 'https://picsum.photos/200',
    plan: 'enterprise'
  },
  [UserRole.ENTERPRISE_ADMIN]: {
    id: 'ent1',
    name: 'Principal Skinner',
    role: UserRole.ENTERPRISE_ADMIN,
    avatar: 'https://picsum.photos/201',
    plan: 'enterprise'
  },
  [UserRole.TEACHER]: {
    id: 't1',
    name: 'Ms. Frizzle',
    role: UserRole.TEACHER,
    avatar: 'https://picsum.photos/202',
    plan: 'pro'
  }
};

const initialDocContent = `Title: Unit 3 - The Industrial Revolution

Learning Objectives:
1. Students will analyze the causes of urbanization.
2. Students will evaluate the impact of new technologies.

Part 1: Introduction (15 mins)
- Hook: Show images of Manchester in 1750 vs 1850.
- Discuss: What changed? Why?

...`;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[UserRole.TEACHER]);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const handleOpenDocument = (docId: string) => {
      setActiveDocId(docId);
      setCurrentView(AppView.EDITOR);
  };

  const renderDashboard = () => {
    switch (currentUser.role) {
      case UserRole.APP_ADMIN:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Global Platform Health</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600"><Users size={24}/></div>
                   <div>
                      <p className="text-sm text-slate-500">Total Users</p>
                      <h3 className="text-2xl font-bold">12,450</h3>
                   </div>
                </div>
                <div className="h-48">
                    <UserDistributionChart />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-emerald-100 rounded-lg text-emerald-600"><Brain size={24}/></div>
                   <div>
                      <p className="text-sm text-slate-500">AI Accuracy Score</p>
                      <h3 className="text-2xl font-bold">94.2%</h3>
                   </div>
                </div>
                <div className="h-48">
                    <AdminTrainingChart />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4 mb-4">
                   <div className="p-3 bg-amber-100 rounded-lg text-amber-600"><Activity size={24}/></div>
                   <div>
                      <p className="text-sm text-slate-500">System Load</p>
                      <h3 className="text-2xl font-bold">Healthy</h3>
                   </div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between text-sm"><span>API Latency</span><span className="font-medium">124ms</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-green-500 h-2 rounded-full w-[20%]"></div></div>
                    <div className="flex justify-between text-sm"><span>Database IOPS</span><span className="font-medium">45%</span></div>
                    <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full w-[45%]"></div></div>
                </div>
              </div>
            </div>
          </div>
        );
      case UserRole.ENTERPRISE_ADMIN:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">District Overview</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-700 mb-4">Team Usage Activity</h3>
                    <UsageChart />
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-700 mb-4">Recent Documents</h3>
                    <div className="space-y-3">
                        {[1,2,3].map(i => (
                            <div 
                                key={i} 
                                onClick={() => handleOpenDocument(i.toString())}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="text-slate-400" size={20} />
                                    <div>
                                        <p className="text-sm font-medium">Science_Curriculum_v{i}.pdf</p>
                                        <p className="text-xs text-slate-500">Added by Mrs. Krabappel</p>
                                    </div>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Processed</span>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
          </div>
        );
      default: // Teacher
        return (
          <div className="space-y-6">
             <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
                <p className="text-indigo-100 mb-6 max-w-xl">You've saved approximately 8 hours this week using EduNexus. Ready to plan your next unit?</p>
                <div className="flex gap-4">
                    <button 
                        onClick={() => setCurrentView(AppView.DOCUMENTS)}
                        className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2"
                    >
                        <Upload size={18} /> Upload Document
                    </button>
                    <button 
                        onClick={() => setCurrentView(AppView.AI_TOOLS)}
                        className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition-colors flex items-center gap-2 border border-indigo-400"
                    >
                        <Brain size={18} /> Generate Lesson
                    </button>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Weekly Activity</h3>
                    </div>
                    <UsageChart />
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FileText size={20}/></div>
                                <span className="text-sm font-medium">Docs Active</span>
                            </div>
                            <span className="font-bold text-slate-800">12</span>
                        </div>
                         <div 
                             onClick={() => handleOpenDocument('recent')}
                             className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-lg text-green-600"><Clock size={20}/></div>
                                <span className="text-sm font-medium group-hover:text-indigo-700">Recent Draft</span>
                            </div>
                            <span className="text-xs font-medium text-slate-500">Edit &rarr;</span>
                        </div>
                    </div>
                 </div>
             </div>
          </div>
        );
    }
  };

  const renderContent = () => {
    if (currentView === AppView.EDITOR && activeDocId) {
      return (
        <LiveEditor
          documentId={activeDocId}
          initialContent={initialDocContent}
          currentUser={currentUser}
          onBack={() => setCurrentView(AppView.DASHBOARD)}
        />
      );
    }

    if (currentView === AppView.CHAT) {
      return (
        <div className="h-[calc(100vh-100px)]">
          <ChatInterface />
        </div>
      );
    }

    if (currentView === AppView.AI_TOOLS) {
        return (
            <div className="p-6">
                <ToolGrid />
            </div>
        )
    }

    if (currentView === AppView.DOCUMENTS) {
        return (
             <div className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-slate-800">My Documents</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1,2,3].map(i => (
                        <div 
                            key={i} 
                            onClick={() => handleOpenDocument(i.toString())}
                            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all"
                        >
                            <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                                <FileText size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 mb-2">Science Curriculum Unit {i}</h3>
                            <p className="text-sm text-slate-500 mb-4">Last modified 2 hours ago by You</p>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Draft</span>
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded font-medium">Grade 9</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
        )
    }

    if (currentView === AppView.BRAIN_CONTROL) {
        return <BrainControl />;
    }

    if (currentView === AppView.SETTINGS) {
        return <Settings user={currentUser} />;
    }

    // Default to dashboard or unhandled views
    return renderDashboard();
  };

  // If we are in EDITOR view, we might want to hide the sidebar or make it compact, 
  // but for now we reuse Layout.
  return (
    <Layout 
      user={currentUser} 
      currentView={currentView} 
      onChangeView={setCurrentView}
      onLogout={() => console.log('logout')}
    >
      <div className="mb-6 flex justify-end">
          {/* Mock Role Switcher for Demo Purposes */}
          <select 
            className="text-xs bg-slate-200 border-none rounded px-2 py-1 text-slate-700 cursor-pointer hover:bg-slate-300"
            value={currentUser.role}
            onChange={(e) => {
                const newRole = e.target.value as UserRole;
                setCurrentUser(mockUsers[newRole]);
                setCurrentView(AppView.DASHBOARD);
            }}
          >
            <option value={UserRole.TEACHER}>View as Teacher</option>
            <option value={UserRole.ENTERPRISE_ADMIN}>View as Ent. Admin</option>
            <option value={UserRole.APP_ADMIN}>View as App Admin</option>
          </select>
      </div>
      {renderContent()}
    </Layout>
  );
};

export default App;