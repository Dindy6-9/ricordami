const CACHE_NAME = 'ricordami-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// Riceve i promemoria dall'app e li programma
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE') {
    const { id, text, fireAt } = e.data;
    const delay = fireAt - Date.now();
    if (delay <= 0) return;
    setTimeout(() => {
      self.registration.showNotification('🔔 Ricordami', {
        body: text,
        requireInteraction: true,
        vibrate: [200, 100, 200],
        tag: 'reminder-' + id,
        icon: 'icon-192.png',
        badge: 'icon-192.png',
        data: { id, text }
      });
    }, delay);
  }
  if (e.data && e.data.type === 'CANCEL') {
    // Non possiamo cancellare setTimeout nel SW, ma possiamo ignorarlo alla notifica
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    if (list.length > 0) return list[0].focus();
    return clients.openWindow('https://dindy6-9.github.io/ricordami/appunti-vocali.html');
  }));
});
