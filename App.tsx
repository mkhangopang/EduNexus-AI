
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Layout } from './components/Layout';
const LazyChatInterface = React.lazy(() => import('./components/ChatInterface').then(m => ({ default: m.ChatInterface })));
import { ToolGrid } from './components/Tools';
const LazyUsageChart = React.lazy(() => import('./components/DashboardCharts').then(m => ({ default: m.UsageChart })));
const LazyAdminTrainingChart = React.lazy(() => import('./components/DashboardCharts').then(m => ({ default: m.AdminTrainingChart })));
const LazyUserDistributionChart = React.lazy(() => import('./components/DashboardCharts').then(m => ({ default: m.UserDistributionChart })));
const LazyLiveEditor = React.lazy(() => import('./components/LiveEditor').then(m => ({ default: m.LiveEditor })));
const LazyBrainControl = React.lazy(() => import('./components/BrainControl').then(m => ({ default: m.BrainControl })));
import { Settings } from './components/Settings';
import { PricingModal } from './components/PricingModal';
import { AITrainingDashboard } from './components/AITrainingDashboard';
import { Auth } from './components/Auth';
import { UserRole, AppView, User, Document, AITool } from './types';
import { Brain, Upload, FileText, Users, Activity, Clock, Lock, Infinity, WifiOff, X, BookOpen, ChevronDown } from 'lucide-react';
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

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [activeDocument, setActiveDocument] = useState<Document | null>(null);
  
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [offlineDocs, setOfflineDocs] = useState<Document[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    offlineService.init();
  }, []);

  useEffect(() => {
      const fetchOfflineDocs = async () => {
          try {
              const docs = await offlineService.getDocuments();
              setOfflineDocs(docs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()));
          } catch (e) {
              console.error("Failed to load offline docs", e);
          }
      };
      fetchOfflineDocs();
  }, [currentView]);

  if (!currentUser) {
    return <Auth onLogin={(user) => setCurrentUser(user)} />;
  }

  const handleOpenDocumentInEditor = (docId: string) => {
      const doc = offlineDocs.find(d => d.id === docId);
      if (doc) {
          setActiveDocument(doc);
      }
      setEditingDocId(docId);
      setCurrentView(AppView.EDITOR);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
        let content = '';
        let subject = 'General';
        
        // Simulating text extraction for demo purposes
        // In production, this would go to an API endpoint
        if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
            content = await file.text();
            subject = 'Text Document';
        } else {
            content = `[System Message: The file '${file.name}' was uploaded successfully.]\n\nNote: As this is a browser-only demo environment, we cannot extract the full text from PDF/DOCX files automatically yet. \n\nPlease treat this as a placeholder. You can copy-paste your curriculum text here to use the AI features.`;
            subject = 'Uploaded File';
        }

        // Add a small delay to simulate processing
        await new Promise(r => setTimeout(r, 800));

        const newDoc: Document = {
            id: crypto.randomUUID(),
            name: file.name,
            type: file.name.split('.').pop() as any || 'txt',
            size: (file.size / 1024).toFixed(1) + 'KB',
            uploadedAt: new Date().toISOString(),
            status: 'processed',
            content: content,
            lastModifiedBy: currentUser.id,
            subject: subject,
            gradeLevel: 'Unspecified',
            summary: `Uploaded ${file.name}`
        };

        await offlineService.saveDocument(newDoc);
        
        setOfflineDocs(prev => [newDoc, ...prev]);
        setActiveDocument(newDoc); // Immediately set as context
        
        // Navigate to chat immediately to show it working
        setCurrentView(AppView.CHAT);

    } catch (error) {
        console.error("Upload failed", error);
        alert("Failed to read file.");
    } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleUpgrade = (newPlan: 'free' | 'pro' | 'enterprise') => {
      setCurrentUser(prev => prev ? ({ ...prev, plan: newPlan }) : null);
      setIsPricingOpen(false);
      alert(`Successfully upgraded to ${newPlan.toUpperCase()}!`);
  };

  const handleLaunchTool = (tool: AITool, _contextContent: string) => {
      setCurrentView(AppView.CHAT);
      console.log(`Launching ${tool.name}`);
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
                                        <Suspense fallback={<div className="h-48" /> }>
                                            <LazyUserDistributionChart />
                                        </Suspense>
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
                                        <Suspense fallback={<div className="h-48" /> }>
                                            <LazyAdminTrainingChart />
                                        </Suspense>
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
                                        <Suspense fallback={<div className="h-48" /> }>
                                            <LazyUsageChart />
                                        </Suspense>
                </div>
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <h3 className="font-semibold text-slate-700 mb-4">Recent Documents</h3>
                    <div className="space-y-3">
                        {offlineDocs.slice(0, 3).map((doc) => (
                            <div 
                                key={doc.id} 
                                onClick={() => handleOpenDocumentInEditor(doc.id)}
                                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <FileText className="text-slate-400" size={20} />
                                    <div>
                                        <p className="text-sm font-medium">{doc.name}</p>
                                        <p className="text-xs text-slate-500">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Processed</span>
                            </div>
                        ))}
                        {offlineDocs.length === 0 && <p className="text-sm text-slate-400 italic">No documents yet.</p>}
                    </div>
                </div>
             </div>
          </div>
        );
      default: // Teacher
        const planLimit = currentUser.plan === 'free' ? 50 : (currentUser.plan === 'pro' ? 500 : 10000);
        const queriesUsed = 45;
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
                            onClick={handleUploadClick}
                            disabled={isUploading}
                            className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2"
                        >
                            {isUploading ? <Activity className="animate-spin" size={18} /> : <Upload size={18} />}
                            {isUploading ? 'Reading File...' : 'Upload Curriculum'}
                        </button>
                        <button 
                            onClick={() => setCurrentView(AppView.AI_TOOLS)}
                            className="bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-800 transition-colors flex items-center gap-2 border border-indigo-400"
                        >
                            <Brain size={18} /> Generate Lesson
                        </button>
                    </div>
                </div>
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/5 skew-x-12 transform translate-x-12"></div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">Weekly Activity</h3>
                    </div>
                                        <Suspense fallback={<div style={{height: 300}}/>}>
                                            <LazyUsageChart />
                                        </Suspense>
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
                        </div>

                         {offlineDocs.length > 0 && (
                            <div 
                                onClick={() => handleOpenDocumentInEditor(offlineDocs[0].id)}
                                className="flex items-center justify-between p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-indigo-50 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded-lg text-green-600"><Clock size={20}/></div>
                                    <div className="overflow-hidden">
                                        <span className="text-sm font-medium group-hover:text-indigo-700 truncate block max-w-[120px]">
                                            {offlineDocs[0].name}
                                        </span>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-slate-500">Edit &rarr;</span>
                            </div>
                         )}
                    </div>
                 </div>
             </div>
          </div>
        );
    }
  };

  const renderContent = () => {
        if (currentView === AppView.EDITOR && editingDocId) {
      const doc = offlineDocs.find(d => d.id === editingDocId);
      const content = doc ? (doc.content || '') : '';

      return (
                <Suspense fallback={<div className="min-h-[400px]" /> }>
                    <LazyLiveEditor
                        documentId={editingDocId}
                        initialContent={content}
                        currentUser={currentUser}
                        onBack={() => setCurrentView(AppView.DASHBOARD)}
                    />
                </Suspense>
      );
    }

        if (currentView === AppView.CHAT) {
            return (
                <div className="h-full w-full">
                    <Suspense fallback={<div className="min-h-[300px]" />}>
                        <LazyChatInterface activeDocument={activeDocument} />
                    </Suspense>
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
                            onClick={handleUploadClick}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 flex items-center gap-2"
                        >
                            {isUploading ? <Activity className="animate-spin" size={16} /> : <Upload size={16} />}
                            Upload New
                        </button>
                    </div>
                </div>
                
                {offlineDocs.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <FileText className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No documents yet</h3>
                        <p className="text-slate-500 mt-1 mb-6">Upload a curriculum file to get started.</p>
                        <button 
                            onClick={handleUploadClick}
                            className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50"
                        >
                            Select File
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {offlineDocs.map(doc => (
                            <div 
                                key={doc.id} 
                                onClick={() => handleOpenDocumentInEditor(doc.id)}
                                className={`p-6 rounded-xl border shadow-sm transition-all relative bg-white border-slate-200 cursor-pointer hover:shadow-md hover:border-indigo-200`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                        <FileText size={24} />
                                    </div>
                                    {!navigator.onLine && (
                                        <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                                            <WifiOff size={10} />
                                            Available Offline
                                        </div>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-slate-800 mb-2 truncate" title={doc.name}>{doc.name}</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}
                                </p>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Processed</span>
                                    {doc.subject && <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">{doc.subject}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
        )
    }

        if (currentView === AppView.BRAIN_CONTROL) {
                return (
                    <Suspense fallback={<div />}>
                        <LazyBrainControl />
                    </Suspense>
                );
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
      
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".txt,.md,.json,.csv,.pdf,.docx" 
        onChange={handleFileSelect}
      />

      {activeDocument && (
          <div className="bg-indigo-600 text-white px-4 py-2 flex justify-between items-center shadow-md relative z-20">
              <div className="flex items-center gap-2 overflow-hidden">
                  <BookOpen size={16} className="text-indigo-200 shrink-0" />
                  <span className="text-sm font-medium truncate">Active Context: <span className="font-bold text-white">{activeDocument.name}</span></span>
                  <span className="text-xs bg-indigo-500 px-2 py-0.5 rounded text-indigo-100 ml-2 hidden md:inline">{activeDocument.subject}</span>
              </div>
              <div className="flex gap-3 shrink-0">
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

      {/* View Switcher - ALWAYS VISIBLE for Testing/Demo purposes */}
      {currentView === AppView.DASHBOARD && (
          <div className="mb-6 flex justify-end">
             <div className="bg-slate-100 p-1 rounded-lg border border-slate-200 flex items-center gap-2">
                <span className="text-xs text-slate-500 pl-2 font-medium">Simulate Role:</span>
                <div className="relative">
                  <select 
                    className="text-xs bg-white border border-slate-200 rounded px-2 py-1 pr-6 text-slate-700 cursor-pointer hover:border-indigo-300 focus:outline-none focus:border-indigo-500 appearance-none"
                    value={currentUser.role}
                    onChange={(e) => {
                        const newRole = e.target.value as UserRole;
                        const newUser = { ...mockUsers[newRole] };
                        if (newRole === UserRole.TEACHER) newUser.plan = 'free'; 
                        setCurrentUser(newUser);
                        setCurrentView(AppView.DASHBOARD);
                    }}
                  >
                    <option value={UserRole.TEACHER}>Teacher (Free)</option>
                    <option value={UserRole.ENTERPRISE_ADMIN}>Ent. Admin</option>
                    <option value={UserRole.APP_ADMIN}>App Admin (Neural Core)</option>
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
             </div>
          </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
