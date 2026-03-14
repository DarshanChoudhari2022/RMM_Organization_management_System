import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) return 'vendor-motion';
            if (id.includes('lucide-react')) return 'vendor-lucide';
            if (id.includes('@tanstack/react-query')) return 'vendor-query';
            if (id.includes('@supabase/supabase-js')) return 'vendor-supabase';
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) return 'vendor-react';
            return 'vendor'; // Fallback for other node_modules
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000, 
  }
}));
