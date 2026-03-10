import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'DamaLive App',
        short_name: 'DamaLive',
        description: 'A progressive web app for knowledge and growth tracking',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: '/images/IMG_8667.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/images/IMG_8667.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  envPrefix: ['VITE_', 'SUPABASE_', 'GEMINI_'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
