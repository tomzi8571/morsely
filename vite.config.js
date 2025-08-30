import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';
import vitePluginGenerateIcons from './scripts/vite-plugin-generate-icons';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        vitePluginGenerateIcons({
            svgFile: './src/assets/morsely_icon.svg',
            outputDir: './public/icons',
            manifestPath: './public/manifest.json',
            safeZoneRatio: 0.8
        }),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'icons/favicon.svg',
                'icons/favicon.ico',
                'icons/apple-touch-icon.png',
                'icons/mask-morsely_icon.svg',
            ],
            manifest: {
                name: 'Morsely',
                short_name: 'Morsely',
                description: 'Have fun learning Morse code',
                theme_color: '#0ea5e9',
                background_color: '#ffffff',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    {src: 'icons/pwa-192x192.png', sizes: '192x192', type: 'image/png'},
                    {src: 'icons/pwa-512x512.png', sizes: '512x512', type: 'image/png'},
                    {src: 'icons/pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'}
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
                navigateFallback: '/index.html',
                runtimeCaching: [
                    {
                        urlPattern: ({request}) => request.mode === 'navigate',
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'pages',
                            networkTimeoutSeconds: 3
                        }
                    },
                    {
                        urlPattern: ({request}) => request.destination === 'style' || request.destination === 'script',
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'assets'
                        }
                    },
                    {
                        urlPattern: ({request}) => request.destination === 'image',
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'images',
                            expiration: {maxEntries: 64, maxAgeSeconds: 60 * 60 * 24 * 30}
                        }
                    }
                ]
            }
        })
    ]
});
