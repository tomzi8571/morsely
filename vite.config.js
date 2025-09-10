import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';
import vitePluginGenerateIcons, { generateManifest } from './scripts/vite-plugin-generate-icons';
import svgr from 'vite-plugin-svgr';

export default async function({ mode } = {}) {
    const manifest = await generateManifest({
        svgFile: './src/assets/morsely_icon.svg',
        outputDir: './public/icons',
        sizes: [16, 32, 48, 64, 128, 192, 256, 384, 512],
        safeZoneRatio: 0.8
    });

    // Use a different base only for the GitHub Pages build (served under /morsely/)
    const base = mode === 'gh' ? '/morsely/' : '/';

    return defineConfig({
        base,
        plugins: [
            react(),
            svgr(),
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
                manifest,
                workbox: {
                    globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
                    // Make navigate fallback relative so it works on Netlify AND GitHub Pages base
                    navigateFallback: 'index.html',
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
}
