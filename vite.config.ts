import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), tanstackStart(), react(), tailwindcss()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    hmr: {
      overlay: true,
    },
  },
  build: {
    sourcemap: false,
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    target: 'es2015',
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
  },
});
