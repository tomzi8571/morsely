import { useEffect } from 'react';

export function useServiceWorkerUpdater({ interval = 60 * 60 * 1000 } = {}) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      let updateTimer;

      const checkForUpdate = async () => {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            await registration.update();
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              window.location.reload();
            }
          }
        } catch (err) {
          // Optionally handle errors
        }
      };

      checkForUpdate();
      updateTimer = setInterval(checkForUpdate, interval);

      return () => clearInterval(updateTimer);
    }
  }, [interval]);
}

