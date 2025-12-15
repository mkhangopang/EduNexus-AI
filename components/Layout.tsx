import React from 'react';
import { UserRole, AppView, User } from '../types';
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
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  currentView, 
  onChangeView,
  onLogout 
}) => {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-dark text-white border-r border-slate-800">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary-600 p-2 rounded-lg">
             <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
             <h1 className="font-bold text-xl tracking-tight">EduNexus AI</h1>
             <p className="text-xs text-slate-400 font-medium">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredNav.map((item) => (
            <button
              key={item.label}
              onClick={() => onChangeView(item.view)}
              className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                currentView === item.view 
                  ? 'bg-primary-600 text-white' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full bg-slate-700" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{user.plan} Plan</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-md"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="md:hidden flex items-center justify-between bg-dark p-4 text-white">
           <div className="flex items-center gap-2">
             <Sparkles className="w-6 h-6 text-primary-500" />
             <span className="font-bold text-lg">EduNexus</span>
           </div>
           <button onClick={() => setIsMobileOpen(!isMobileOpen)}>
             <Menu className="w-6 h-6" />
           </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 z-50 bg-dark border-b border-slate-800 p-4">
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
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto bg-slate-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
