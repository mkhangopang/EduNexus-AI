
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Prioritize the VITE_GEMINI_API_KEY, fallback to API_KEY, then empty string.
      // This allows setting 'API_KEY' directly in Vercel dashboard.
      'process.env.API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || env.API_KEY || ''),
    },
    server: {
      host: true,
      port: 3000
    }
    ,
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
              if (id.includes('@supabase') || id.includes('realtime') ) return 'vendor-supabase';
              if (id.includes('@google/generative-ai') || id.includes('@google/genai')) return 'vendor-genai';
              if (id.includes('recharts')) return 'vendor-charts';
              if (id.includes('lucide-react')) return 'vendor-icons';
              return 'vendor-others';
            }
          }
        }
      }
    }
  };
});
