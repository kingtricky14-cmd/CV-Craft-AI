import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'CVCraft AI',
        short_name: 'CVCraft',
        description: 'Build your professional resume in minutes with AI assistance',
        theme_color: '#f97316',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/icon-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: '/screenshot-540x720.png',
            sizes: '540x720',
            type: 'image/png',
            form_factor: 'narrow',
          },
          {
            src: '/screenshot-1280x720.png',
            sizes: '1280x720',
            type: 'image/png',
            form_factor: 'wide',
          },
        ],
        categories: ['productivity', 'business'],
        shortcuts: [
          {
            name: 'Create Resume',
            short_name: 'Resume',
            description: 'Create a new resume',
            url: '/dashboard?action=new-resume',
            icons: [
              {
                src: '/icon-96x96.png',
                sizes: '96x96',
                type: 'image/png',
              },
            ],
          },
          {
            name: 'Create Cover Letter',
            short_name: 'Cover Letter',
            description: 'Create a new cover letter',
            url: '/cover-letters',
            icons: [
              {
                src: '/icon-96x96.png',
                sizes: '96x96',
                type: 'image/png',
              },
            ],
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
  },
});
