const CACHE_NAME = 'courier-route-v13';
const ASSETS = [
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/images/image_1.png",
  "./assets/images/image_2.webp",
  "./assets/images/image_3.webp",
  "./assets/images/image_4.jpg",
  "./assets/images/image_5.png",
  "./assets/audio/track_1.mp3",
  "./assets/audio/track_2.mp3",
  "./assets/audio/track_3.mp3"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached =>
      cached || fetch(event.request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        return response;
      })
    )
  );
});
