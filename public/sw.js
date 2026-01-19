// Service Worker для FOX YVN Dashboard
const CACHE_NAME = 'foxyvn-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/comms',
  '/settings',
  '/manifest.json',
  '/favicon.svg',
];

// Установка SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Активация SW
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Возвращаем кэш или делаем запрос
      return response || fetch(event.request).then((fetchResponse) => {
        // Кэшируем новые запросы
        if (fetchResponse.status === 200) {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return fetchResponse;
      });
    }).catch(() => {
      // Офлайн fallback
      if (event.request.mode === 'navigate') {
        return caches.match('/dashboard');
      }
    })
  );
});
