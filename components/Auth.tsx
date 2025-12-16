import React, { useState } from 'react';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, AlertCircle } from 'lucide-react';
import { User, UserRole } from '../types';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fallback demo login for when Supabase is not configured
  const handleDemoLogin = () => {
      let role = UserRole.TEACHER;
      let plan: 'free' | 'pro' | 'enterprise' = 'free';
      
      if (email.includes('admin')) { role = UserRole.APP_ADMIN; plan = 'enterprise'; }
      else if (email.includes('ent')) { role = UserRole.ENTERPRISE_ADMIN; plan = 'enterprise'; }
      else if (email.includes('pro')) { plan = 'pro'; }

      const user: User = {
        id: Date.now().toString(),
        name: name || (email.split('@')[0] || 'User'),
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        plan
      };
      onLogin(user);
      setIsLoading(false);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Check if connected
    if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured. Using demo login.");
        setTimeout(handleDemoLogin, 800);
        return;
    }

    try {
        if (isLogin) {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;
            if (data.user) {
                // In a real app, you would fetch the user's role/plan from a 'profiles' table here
                const user: User = {
                    id: data.user.id,
                    name: data.user.user_metadata.name || email.split('@')[0],
                    role: UserRole.TEACHER, // Default role
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.email}`,
                    plan: 'free' // Default plan
                };
                onLogin(user);
            }
        } else {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name }
                }
            });
            
            if (error) throw error;
            if (data.user) {
                 const user: User = {
                    id: data.user.id,
                    name: name,
                    role: UserRole.TEACHER,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
                    plan: 'free'
                };
                onLogin(user);
            }
        }
    } catch (err: any) {
        setError(err.message || "Authentication failed");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white mb-4 shadow-lg shadow-indigo-200">
            <Sparkles size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">EduNexus AI</h1>
          <p className="text-slate-500 mt-2">
            {isLogin ? 'Welcome back, educator.' : 'Start your teaching revolution.'}
          </p>
          {!isSupabaseConfigured() && (
             <div className="mt-4 p-2 bg-amber-50 text-amber-700 text-xs rounded border border-amber-200 flex items-center justify-center gap-2">
                 <AlertCircle size={14} />
                 <span>Supabase keys missing. Using Demo Mode.</span>
             </div>
          )}
        </div>

        {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
            </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <UserIcon size={18} />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  placeholder="Jane Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="teacher@school.edu"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md hover:shadow-indigo-200 flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
               <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
               <>
                 {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
               </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-indigo-600 font-bold hover:text-indigo-700 hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100">
           <div className="text-xs text-center text-slate-400 mb-3">Or try demo accounts</div>
           <div className="flex justify-center gap-2">
               <button onClick={() => { setEmail('admin@edunexus.ai'); setPassword('demo'); setIsLogin(true); }} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600">App Admin</button>
               <button onClick={() => { setEmail('ent@school.org'); setPassword('demo'); setIsLogin(true); }} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600">Ent. Admin</button>
               <button onClick={() => { setEmail('teacher@school.edu'); setPassword('demo'); setIsLogin(true); }} className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600">Teacher</button>
           </div>
        </div>
      </div>
    </div>
  );
};