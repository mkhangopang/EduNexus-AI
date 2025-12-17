import React from 'react';
import { isSupabaseConfigured } from '../services/supabaseClient';

const mask = (s?: string) => {
  if (!s) return '(empty)';
  if (s.length <= 8) return s;
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
};

const EnvDebug: React.FC = () => {
  const env = (import.meta as any).env || {};
  const supabaseUrl = env.VITE_SUPABASE_URL || '';
  const supabaseKey = env.VITE_SUPABASE_ANON_KEY || '';

  return (
    <div className="fixed bottom-4 left-4 z-60 bg-white border border-slate-200 rounded-lg p-3 shadow-md text-xs text-slate-700 w-80">
      <div className="font-bold text-sm mb-2">Env Debug (masked)</div>
      <div className="mb-1"><strong>VITE_SUPABASE_URL:</strong> <span className="text-slate-500">{mask(supabaseUrl)}</span></div>
      <div className="mb-1"><strong>VITE_SUPABASE_ANON_KEY:</strong> <span className="text-slate-500">{mask(supabaseKey)}</span></div>
      <div className="mt-2"><strong>isSupabaseConfigured():</strong> <span className="font-medium">{isSupabaseConfigured() ? 'true' : 'false'}</span></div>
      <div className="mt-2 text-xxs text-slate-400">Show this panel by adding <code>?debug</code> to the app URL.</div>
    </div>
  );
};

export default EnvDebug;
