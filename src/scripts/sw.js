import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate, CacheFirst, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { skipWaiting, clientsClaim } from 'workbox-core';

skipWaiting();
clientsClaim();

// Precache all assets
precacheAndRoute(self.__WB_MANIFEST);

// Cache strategy for CSS and JS files
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

// Cache strategy for images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Cache strategy for API responses
registerRoute(
  ({ url }) => url.origin === 'https://story-api.dicoding.dev',
  new NetworkFirst({
    cacheName: 'api-responses',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  })
);

// Cache strategy for pages (navigation)
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 10,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
  })
);

// Offline fallback
const offlineFallback = '/offline.html';
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({
    cacheName: 'offline-fallback',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
      }),
    ],
  })
);

// Push Notification Event
self.addEventListener('push', (event) => {
  const payload = event.data?.json() || { 
    title: 'StoryShare', 
    body: 'Anda memiliki cerita baru yang bisa dibaca!' 
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: { url: '/' }
    })
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const urlToOpen = new URL(event.notification.data.url || '/', self.location.origin).href;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      const matchingClient = windowClients.find(client => 
        client.url === urlToOpen && 'focus' in client
      );
      
      if (matchingClient) {
        return matchingClient.focus();
      }
      
      return clients.openWindow(urlToOpen);
    })
  );
});

// Offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(offlineFallback))
    );
  }
});