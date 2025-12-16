import { createClient } from '@supabase/supabase-js';

// Safe access to environment variables in Vite
const getEnvVar = (key: string) => {
  try {
    // Check if import.meta.env exists (standard Vite)
    const meta = import.meta as any;
    if (meta && meta.env) {
      return meta.env[key] || '';
    }
  } catch (e) {
    console.warn('Error accessing import.meta.env', e);
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseKey || 'placeholder-key'
);

export const isSupabaseConfigured = () => {
    return (
        supabaseUrl && 
        supabaseKey && 
        supabaseUrl !== 'https://placeholder-url.supabase.co' &&
        supabaseUrl !== ''
    );
};