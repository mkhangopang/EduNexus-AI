
import React, { useState, useEffect } from 'react';
import { UserRole, AppView, User } from '../types';
import { offlineService } from '../services/offlineService';
import { generateAIResponse } from '../services/geminiService';
import { 
  LayoutDashboard, 
  FileText, 
  Bot, 
  MessageSquare, 
  Settings, 
  BrainCircuit, 
  Users, 
  Menu,
  Sparkles,
  LogOut,
  Zap,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  WifiOff,
  RefreshCw,
  Bell
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onLogout: () => void;
  onOpenUpgrade: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  currentView, 
  onChangeView,
  onLogout,
  onOpenUpgrade
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [notification, setNotification] = useState<{title: string, message: string} | null>(null);

  const updatePendingCount = async () => {
    try {
        const actions = await offlineService.getPendingActions();
        setPendingCount(actions.length);
    } catch (e) {
        console.error("Error fetching pending actions", e);
    }
  };

  useEffect(() => {
    if (notification) {
        const timer = setTimeout(() => setNotification(null), 5000);
        return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    let offlineInterval: ReturnType<typeof setInterval>;

    const handleOnline = async () => {
        setIsOnline(true);
        setIsSyncing(true);
        
        if (offlineInterval) clearInterval(offlineInterval);

        try {
            // Update initial count before sync starts
            await updatePendingCount();

            const count = await offlineService.syncPendingActions({
                onProgress: (remaining) => {
                   setPendingCount(remaining);
                },
                onProcessAI: async (payload) => {
                    // Logic to process queued AI requests
                    // In a real app, you might save this result to a database or message history
                    try {
                        const response = await generateAIResponse(payload.prompt, payload.context);
                        setNotification({
                            title: 'AI Request Processed',
                            message: `Your queued request "${payload.prompt.substring(0, 20)}..." is ready. \nResult snippet: ${response.substring(0, 60)}...`
                        });
                    } catch (e) {
                        console.error("Failed to process queued AI request", e);
                    }
                }
            });
            
            if (count > 0) {
                console.log(`Synced ${count} items.`);
            }
        } finally {
            setIsSyncing(false);
            setPendingCount(0);
        }
    };
    
    const handleOffline = () => {
        setIsOnline(false);
        updatePendingCount();
        // Poll for changes while offline (e.g. saves happening in background)
        offlineInterval = setInterval(updatePendingCount, 2000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    if (navigator.onLine) {
       handleOnline();
    } else {
       handleOffline();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (offlineInterval) clearInterval(offlineInterval);
    };
  }, []);

  const navItems = [
    { 
      label: 'Dashboard', 
      view: AppView.DASHBOARD, 
      icon: LayoutDashboard,
      roles: [UserRole.APP_ADMIN, UserRole.ENTERPRISE_ADMIN, UserRole.TEACHER]
    },
    { 
      label: 'My Documents', 
      view: AppView.DOCUMENTS, 
      icon: FileText,
      roles: [UserRole.ENTERPRISE_ADMIN, UserRole.TEACHER]
    },
    { 
      label: 'AI Tools', 
      view: AppView.AI_TOOLS, 
      icon: Bot,
      roles: [UserRole.TEACHER, UserRole.ENTERPRISE_ADMIN]
    },
    { 
      label: 'Chat Assistant', 
      view: AppView.CHAT, 
      icon: MessageSquare,
      roles: [UserRole.TEACHER, UserRole.ENTERPRISE_ADMIN]
    },
    { 
      label: 'Neural Core', 
      view: AppView.BRAIN_CONTROL, 
      icon: BrainCircuit,
      roles: [UserRole.APP_ADMIN]
    },
    { 
      label: 'AI Training', 
      view: AppView.AI_TRAINING, 
      icon: TrendingUp,
      roles: [UserRole.APP_ADMIN]
    },
    { 
      label: 'Team Management', 
      view: AppView.TEAM_MANAGEMENT, 
      icon: Users,
      roles: [UserRole.ENTERPRISE_ADMIN]
    },
    { 
      label: 'Settings', 
      view: AppView.SETTINGS, 
      icon: Settings,
      roles: [UserRole.APP_ADMIN, UserRole.ENTERPRISE_ADMIN, UserRole.TEACHER]
    },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-[70] bg-white border border-emerald-200 shadow-xl rounded-xl p-4 max-w-sm animate-[slideIn_0.3s_ease-out] flex gap-3">
             <div className="bg-emerald-100 p-2 rounded-lg h-fit text-emerald-600">
                 <Sparkles size={20} />
             </div>
             <div>
                 <h4 className="font-bold text-slate-800 text-sm">{notification.title}</h4>
                 <p className="text-xs text-slate-500 mt-1 leading-relaxed whitespace-pre-line">{notification.message}</p>
             </div>
             <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 h-fit">
                 <span className="sr-only">Close</span>
                 &times;
             </button>
        </div>
      )}

      {/* Offline Indicator Banner */}
      {!isOnline && (
        <div className="absolute top-0 left-0 right-0 z-[60] bg-amber-500 text-white px-4 py-1 text-xs font-bold flex justify-center items-center gap-2 shadow-md">
            <WifiOff size={14} />
            Offline Mode - {pendingCount} {pendingCount === 1 ? 'change' : 'changes'} pending sync.
        </div>
      )}
      {isOnline && isSyncing && (
        <div className="absolute top-0 left-0 right-0 z-[60] bg-emerald-600 text-white px-4 py-1 text-xs font-bold flex justify-center items-center gap-2 shadow-md animate-pulse">
            <RefreshCw size={14} className="animate-spin" />
            Syncing {pendingCount} {pendingCount === 1 ? 'item' : 'items'}...
        </div>
      )}

      {/* Sidebar Desktop */}
      <aside className={`hidden md:flex flex-col bg-dark text-white border-r border-slate-800 transition-all duration-300 ease-in-out relative ${!isOnline || isSyncing ? 'pt-6' : ''} ${isCollapsed ? 'w-20' : 'w-64'}`}>
        
        {/* Collapse Toggle Button */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`absolute -right-3 top-8 bg-slate-800 text-slate-400 hover:text-white border border-slate-700 rounded-full p-1 shadow-md z-50 hidden md:flex items-center justify-center hover:scale-110 transition-transform ${!isOnline || isSyncing ? 'mt-6' : ''}`}
        >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all`}>
          <div className="flex items-center gap-3 overflow-hidden">
             <div className="bg-primary-600 p-2 rounded-lg shrink-0 transition-all">
                <Sparkles className="w-6 h-6 text-white" />
             </div>
             {!isCollapsed && (
                 <div className="transition-opacity duration-300 min-w-[120px]">
                    <h1 className="font-bold text-xl tracking-tight">EduNexus AI</h1>
                    <p className="text-xs text-slate-400 font-medium">{user.role.replace('_', ' ')}</p>
                 </div>
             )}
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {filteredNav.map((item) => (
            <button
              key={item.label}
              onClick={() => onChangeView(item.view)}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center w-full py-3 text-sm font-medium rounded-lg transition-colors group whitespace-nowrap ${
                currentView === item.view 
                  ? 'bg-primary-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              } ${isCollapsed ? 'justify-center px-2' : 'px-4'}`}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && <span className="opacity-100 transition-opacity duration-200">{item.label}</span>}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Upgrade/Manage CTA */}
        <div className={`mb-4 transition-all duration-300 ${isCollapsed ? 'px-2' : 'px-4'}`}>
            {!isCollapsed ? (
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-center relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Zap size={64} />
                    </div>
                    <h3 className="font-bold text-white mb-1 truncate">
                        {user.plan === 'enterprise' ? 'Manage Plan' : 'Upgrade Plan'}
                    </h3>
                    <p className="text-xs text-indigo-100 mb-3 truncate">
                        {user.plan === 'enterprise' ? 'Manage seats & billing.' : 'Get unlimited AI.'}
                    </p>
                    <button 
                        onClick={onOpenUpgrade}
                        className="w-full py-2 bg-white text-indigo-600 text-xs font-bold rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
                    >
                        View Pricing
                    </button>
                </div>
            ) : (
                <button 
                    onClick={onOpenUpgrade}
                    title="Upgrade Plan"
                    className="w-full flex justify-center items-center p-3 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-all"
                >
                    <Zap size={20} />
                </button>
            )}
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 mb-4 transition-all ${isCollapsed ? 'justify-center' : ''}`}>
            <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full bg-slate-700 shrink-0" />
            {!isCollapsed && (
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate capitalize">{user.plan} Plan</p>
                </div>
            )}
          </div>
          <button 
            onClick={onLogout}
            title={isCollapsed ? "Sign Out" : ""}
            className={`flex items-center w-full py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-md transition-all ${isCollapsed ? 'justify-center px-0' : 'px-4'}`}
          >
            <LogOut className={`w-4 h-4 shrink-0 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span className="truncate">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className={`md:hidden flex items-center justify-between bg-dark p-3 text-white shrink-0 ${!isOnline || isSyncing ? 'mt-6' : ''}`}>
           <div className="flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-primary-500" />
             <span className="font-bold text-base">EduNexus</span>
           </div>
           <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
             <Menu className="w-5 h-5" />
           </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileOpen && (
          <div className="md:hidden absolute top-14 left-0 right-0 z-50 bg-dark border-b border-slate-800 p-4 shadow-xl">
             {filteredNav.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                  onChangeView(item.view);
                  setIsMobileOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 mb-1 text-sm font-medium rounded-lg transition-colors ${
                currentView === item.view 
                  ? 'bg-primary-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
          
          <button 
            onClick={() => {
                onOpenUpgrade();
                setIsMobileOpen(false);
            }}
            className="flex items-center w-full px-4 py-3 mb-1 text-sm font-medium rounded-lg bg-indigo-600 text-white"
          >
            <Zap className="w-5 h-5 mr-3" />
            {user.plan === 'enterprise' ? 'Manage Plan' : 'Upgrade Plan'}
          </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className={`flex-1 bg-slate-50 transition-all duration-200 ${
            currentView === AppView.CHAT 
            ? 'p-0 md:p-6 overflow-hidden flex flex-col' 
            : 'p-4 md:p-6 overflow-auto'
        }`}>
          {children}
        </main>
      </div>
    </div>
  );
};
