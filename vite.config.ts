import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',

      injectRegister: 'auto',

      includeAssets: [
        'favicon.ico',
        'apple-touch-icon.png',
        'robots.txt'
      ],

      manifest: {
        name: 'My App',
        short_name: 'MyApp',
        description: 'My React PWA',
        theme_color: '#1976d2',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        lang: 'en',

        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },

      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,png,svg,json}'
        ]
      }
    })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

})
