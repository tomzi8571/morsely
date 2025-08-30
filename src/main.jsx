import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import ReactDOM from 'react-dom/client'

createRoot(document.getElementById('root')).render(
    <App />
)

// Register PWA service worker (vite-plugin-pwa)
if ('serviceWorker' in navigator) {
  // vite-plugin-pwa enables this virtual module
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      immediate: true,
      onNeedRefresh() {
        // Optional: show a toast/banner to refresh
        // For now, refresh immediately:
        updateSW(true);
      },
      onOfflineReady() {
        // Optional: show a message "App ready to work offline"
        // console.log('PWA offline ready');
      }
    });
  });
}
