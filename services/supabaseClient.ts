
import { createClient } from '@supabase/supabase-js';

// Access environment variables using standard Vite import.meta.env
// Use a safe access pattern: default to empty object if env is undefined
const env = (import.meta as any).env || {};
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
// We provide fallback values to prevent crash on initialization, but connection will fail if invalid.
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
