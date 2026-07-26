const CACHE_NAME = 'chili-v1';
const urlsToCache = [
  '/',
  '/index.html'
  // /src/ файлы удалены, так как Vite собирает их в /assets/
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Стратегия: Cache First для статики (/assets/), Network First для всего остального
  if (event.request.url.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request).then(fetchResponse => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  } else {
    // Для HTML и API идем в сеть сначала (чтобы юзеры получали свежий код)
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html'); // Оффлайн фоллбэк для SPA
      })
    );
  }
});