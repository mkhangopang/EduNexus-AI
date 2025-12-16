import { createClient } from '@supabase/supabase-js';

// Safely access environment variables with a fallback to avoid runtime errors
// if import.meta.env is not defined in the current environment.
const env = (import.meta as any).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co', 
  supabaseKey || 'placeholder-key'
);

export const isSupabaseConfigured = () => {
    return supabaseUrl && supabaseKey && supabaseUrl !== 'https://placeholder-url.supabase.co';
};