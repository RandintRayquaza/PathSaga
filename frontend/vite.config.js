import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        /* Code-split vendor deps for better caching */
        manualChunks: {
          react:  ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux:  ['@reduxjs/toolkit', 'react-redux'],
          ui:     ['lucide-react'],
        },
      },
    },
  },
});
