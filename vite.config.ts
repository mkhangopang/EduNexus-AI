
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
  };
});
