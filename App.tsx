
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { ChatInterface } from './components/ChatInterface';
import { ToolGrid } from './components/Tools';
import { UsageChart, AdminTrainingChart, UserDistributionChart } from './components/DashboardCharts';
import { LiveEditor } from './components/LiveEditor';
import { BrainControl } from './components/BrainControl';
import { Settings } from './components/Settings';
import { PricingModal } from './components/PricingModal';
import { AITrainingDashboard } from './components/AITrainingDashboard';
import { Auth } from './components/Auth';
import { UserRole, AppView, User, Document, AITool } from './types';
import { Brain, Upload, FileText, CheckCircle, Users, Activity, Clock, Lock, Infinity, WifiOff, X, BookOpen } from 'lucide-react';
import { MASTER_PROMPT_SYSTEM_INSTRUCTION } from './services/geminiService';
import { offlineService } from './services/offlineService';

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
    plan: 'free'
  }
};

const SAMPLE_CURRICULUM = `
Title: Advanced Biology: Genetics & Heredity
Grade Level: 9-10
Subject: Science / Biology

Unit Overview:
This unit covers the fundamental principles of genetics, including Mendelian inheritance, DNA structure and function, and modern genetic engineering.

Key Learning Objectives (SLOs):
1. Students will analyze how biological traits are passed on to successive generations.
2. Students will use Punnett squares to predict the probability of traits.
3. Students will construct an explanation based on evidence for how the structure of DNA determines the structure of proteins.

Core Content:
- Section 1: DNA Structure (Double Helix, Nucleotides, Base Pairing)
- Section 2: Mitosis vs Meiosis (Process and Outcomes)
- Section 3: Patterns of Inheritance (Dominant/Recessive, Incomplete Dominance)
- Section 4: Genetic Disorders and Bioethics.

Assessment Standards:
- NGSS HS-LS3-1
- NGSS HS-LS3-2
`;

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  // This state tracks the document currently being Edited (LiveEditor)
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  // This state tracks the "Context Document" (The curriculum content driving AI)
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [offlineDocs, setOfflineDocs] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize DB on load
  useEffect(() => {
    offlineService.init();
  }, []);

  // Attempt to load documents from IDB if network is questionable
  useEffect(() => {
      const fetchOfflineDocs = async () => {
          try {
              const docs = await offlineService.getDocuments();
              setOfflineDocs(docs);
          } catch (e) {
              console.error("Failed to load offline docs", e);
          }
      };
      fetchOfflineDocs();
  }, [currentView]);

  // If no user is logged in, show Auth screen
  if (!currentUser) {
    return <Auth onLogin={(user) => setCurrentUser(user)} />;
  }

  const handleOpenDocumentInEditor = (docId: string) => {
      // Feature Gate: Free users only 1 doc
      if (currentUser.plan === 'free' && docId !== '1' && docId !== 'recent') {
          setIsPricingOpen(true);
          return;
      }
      setEditingDocId(docId);
      setCurrentView(AppView.EDITOR);
  };

  const handleSetContext = (doc: Document) => {
      setActiveDocument(doc);
      // Automatically switch to chat if context is set from dashboard
      // setCurrentView(AppView.CHAT); // Optional: depends on UX preference.
  };

  const handleSimulateUpload = () => {
      setIsUploading(true);
      setTimeout(() => {
          const newDoc: Document = {
              id: 'curr_' + Date.now(),
              name: 'Biology_Unit4_Genetics.docx',
              type: 'docx',
              size: '2.4MB',
              uploadedAt: new Date().toISOString(),
              status: 'processed',
              content: SAMPLE_CURRICULUM,
              lastModifiedBy: currentUser.id,
              subject: 'Biology',
              gradeLevel: '9th Grade',
              summary: 'Genetics, DNA, and Heredity unit.'
          };
          
          setActiveDocument(newDoc);
          setEditingDocId(newDoc.id); // Also open it for editing
          setIsUploading(false);
          // Show chat or editor? Let's show chat to demonstrate personalization
          setCurrentView(AppView.CHAT);
      }, 1500);
  };

  const handleUpgrade = (newPlan: 'free' | 'pro' | 'enterprise') => {
      setCurrentUser(prev => prev ? ({ ...prev, plan: newPlan }) : null);
      setIsPricingOpen(false);
      // In a real app, this would trigger Stripe/payment flow
      alert(`Successfully upgraded to ${newPlan.toUpperCase()}!`);
  };

  const handleLaunchTool = (tool: AITool, contextContent: string) => {
      // Logic to switch to chat and pre-fill input with the prompt
      setCurrentView(AppView.CHAT);
      // In a real implementation, we would pass the prompt to the Chat component via props or context
      // For this demo, we rely on the user knowing they are in the chat now, or we could set a transient state
      console.log(`Launching ${tool.name} with context`);
      // Simulating a system message or user prompt injection
      alert(`Tool launched! The AI will now use the active curriculum to: ${tool.name}`);
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
                                onClick={() => handleOpenDocumentInEditor(i.toString())}
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
        const planLimit = currentUser.plan === 'free' ? 50 : (currentUser.plan === 'pro' ? 500 : 10000);
        const queriesUsed = 45; // Mock data
        const isUnlimited = currentUser.plan === 'enterprise';
        
        return (
          <div className="space-y-6">
             <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome back, {currentUser.name}!</h1>
                    <p className="text-indigo-100 mb-6 max-w-xl">
                        You've saved approximately 8 hours this week. 
                        {currentUser.plan === 'free' && <span className="ml-1 font-semibold text-amber-300">Upgrade to Pro to save even more.</span>}
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleSimulateUpload}
                            disabled={isUploading}
                            className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2"
                        >
                            {isUploading ? <Activity className="animate-spin" size={18} /> : <Upload size={18} />}
                            {isUploading ? 'Analyzing...' : 'Upload Curriculum'}
                        </button>
                        <button 
                            onClick={() => setCurrentView(AppView.AI_TOOLS)}
                            className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition-colors flex items-center gap-2 border border-indigo-400"
                        >
                            <Brain size={18} /> Generate Lesson
                        </button>
                    </div>
                </div>
                {/* Decorative background element */}
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12"></div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Weekly Activity</h3>
                    </div>
                    <UsageChart />
                 </div>
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Plan Usage</h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                            currentUser.plan === 'enterprise' ? 'bg-indigo-100 text-indigo-700' : 
                            currentUser.plan === 'pro' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>{currentUser.plan}</span>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 bg-slate-50 rounded-xl">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-medium text-slate-600">AI Queries</span>
                                <span className="font-bold text-indigo-600 flex items-center gap-1">
                                    {isUnlimited ? <Infinity size={16} /> : `${queriesUsed} / ${planLimit}`}
                                </span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                                {isUnlimited ? (
                                    <div className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse"></div>
                                ) : (
                                    <div 
                                        className={`h-2 rounded-full ${queriesUsed / planLimit > 0.8 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                                        style={{ width: `${Math.min((queriesUsed / planLimit) * 100, 100)}%` }}
                                    ></div>
                                )}
                            </div>
                            {!isUnlimited && queriesUsed / planLimit > 0.8 && (
                                <p className="text-xs text-amber-600 mt-2 font-medium">Running low! Upgrade for more.</p>
                            )}
                        </div>

                         <div 
                             onClick={() => handleOpenDocumentInEditor('recent')}
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
    if (currentView === AppView.EDITOR && editingDocId) {
      // Logic: if docId is 'recent', try to find last modified from offlineDocs
      let content = activeDocument && activeDocument.id === editingDocId ? activeDocument.content! : `Title: Unit 3 - The Industrial Revolution\n\n...`;
      
      // Check offline cache for this specific doc
      const cached = offlineDocs.find(d => d.id === editingDocId);
      if (cached && cached.content) {
          content = cached.content;
      }

      return (
        <LiveEditor
          documentId={editingDocId}
          initialContent={content}
          currentUser={currentUser}
          onBack={() => setCurrentView(AppView.DASHBOARD)}
        />
      );
    }

    if (currentView === AppView.CHAT) {
      return (
        <div className="h-full w-full">
          <ChatInterface activeDocument={activeDocument} />
        </div>
      );
    }

    if (currentView === AppView.AI_TOOLS) {
        return (
            <div className="p-6">
                <ToolGrid 
                    user={currentUser} 
                    activeDocument={activeDocument}
                    onUpgrade={() => setIsPricingOpen(true)}
                    onLaunchTool={handleLaunchTool}
                />
            </div>
        )
    }

    if (currentView === AppView.DOCUMENTS) {
        return (
             <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">My Documents</h2>
                    <div className="flex gap-3">
                         <button 
                            onClick={handleSimulateUpload}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
                        >
                            {isUploading ? <Activity className="animate-spin" size={16} /> : <Upload size={16} />}
                            Upload New
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Render standard docs, mixed with offline queue status */}
                    {[1,2,3].map(i => {
                        const isLocked = currentUser.plan === 'free' && i > 1;
                        // Check if this doc is available offline
                        const isCached = offlineDocs.some(d => d.id === i.toString());
                        
                        return (
                            <div 
                                key={i} 
                                onClick={() => handleOpenDocumentInEditor(i.toString())}
                                className={`p-6 rounded-xl border shadow-sm transition-all relative ${
                                    isLocked 
                                    ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-75' 
                                    : 'bg-white border-slate-200 cursor-pointer hover:shadow-md hover:border-indigo-200'
                                }`}
                            >
                                {isLocked && (
                                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex flex-col items-center justify-center z-10 rounded-xl">
                                        <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                                            <Lock size={20} className="text-slate-400" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-500">Upgrade to Open</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                        <FileText size={24} />
                                    </div>
                                    {isCached && !navigator.onLine && (
                                        <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                                            <WifiOff size={10} />
                                            Available Offline
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2">Science Curriculum Unit {i}</h3>
                                <p className="text-sm text-slate-500 mb-4">Last modified 2 hours ago by You</p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Draft</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
             </div>
        )
    }

    if (currentView === AppView.BRAIN_CONTROL) {
        return <BrainControl />;
    }

    if (currentView === AppView.AI_TRAINING) {
        return <AITrainingDashboard />;
    }

    if (currentView === AppView.SETTINGS) {
        return <Settings user={currentUser} />;
    }

    return renderDashboard();
  };

  return (
    <Layout 
      user={currentUser} 
      currentView={currentView} 
      onChangeView={setCurrentView}
      onLogout={() => setCurrentUser(null)}
      onOpenUpgrade={() => setIsPricingOpen(true)}
    >
      <PricingModal 
        isOpen={isPricingOpen} 
        onClose={() => setIsPricingOpen(false)} 
        currentUser={currentUser}
        onUpgrade={handleUpgrade}
      />
      
      {/* Active Context Banner */}
      {activeDocument && (
          <div className="bg-indigo-600 text-white px-4 py-2 flex justify-between items-center shadow-md relative z-20">
              <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-indigo-200" />
                  <span className="text-sm font-medium">Active Curriculum Context: <span className="font-bold text-white">{activeDocument.name}</span></span>
                  <span className="text-xs bg-indigo-500 px-2 py-0.5 rounded text-indigo-100 ml-2">{activeDocument.subject}</span>
              </div>
              <div className="flex gap-3">
                  <button 
                    onClick={() => setCurrentView(AppView.CHAT)}
                    className="text-xs bg-white text-indigo-600 px-2 py-1 rounded font-bold hover:bg-indigo-50"
                  >
                      Ask AI
                  </button>
                  <button onClick={() => setActiveDocument(null)} className="text-indigo-200 hover:text-white">
                      <X size={16} />
                  </button>
              </div>
          </div>
      )}

      {/* View Switcher for Demo - Only visible if not in specific admin views to avoid clutter */}
      {currentUser.role === UserRole.APP_ADMIN && currentView === AppView.DASHBOARD && (
          <div className="mb-6 flex justify-end">
              <select 
                className="text-xs bg-slate-200 border-none rounded px-2 py-1 text-slate-700 cursor-pointer hover:bg-slate-300"
                value={currentUser.role}
                onChange={(e) => {
                    const newRole = e.target.value as UserRole;
                    const newUser = { ...mockUsers[newRole] };
                    if (newRole === UserRole.TEACHER) newUser.plan = 'free'; 
                    setCurrentUser(newUser);
                    setCurrentView(AppView.DASHBOARD);
                }}
              >
                <option value={UserRole.TEACHER}>View as Teacher (Free)</option>
                <option value={UserRole.ENTERPRISE_ADMIN}>View as Ent. Admin</option>
                <option value={UserRole.APP_ADMIN}>View as App Admin</option>
              </select>
          </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
