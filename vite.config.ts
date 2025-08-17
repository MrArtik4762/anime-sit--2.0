import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Временно отключаем PWA плагин для диагностики
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
    //   manifest: {
    //     name: 'Anime Site',
    //     short_name: 'AnimeSite',
    //     description: 'Сайт для просмотра аниме',
    //     theme_color: '#8B5CF6',
    //     background_color: '#1F2937',
    //     display: 'standalone',
    //     icons: [
    //       {
    //         src: 'pwa-192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: 'pwa-512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    //   workbox: {
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/anilibria\.top\/.*$/,
    //         handler: 'NetworkFirst',
    //         options: {
    //           cacheName: 'anilibria-api-cache',
    //           expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 }
    //         }
    //       },
    //       {
    //         urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
    //         handler: 'CacheFirst',
    //         options: {
    //           cacheName: 'image-cache',
    //           expiration: { maxEntries: 300, maxAgeSeconds: 60 * 60 * 24 * 30 }
    //         }
    //       }
    //     ],
    //   },
    // }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})