// Service Worker بسيط ديال AMYLO — كيخزن الملفات الأساسية باش التطبيق يحل بسرعة
// حتى بلا انترنت (بصح الرد ديال Gemini محتاج انترنت دائماً)
const CACHE_NAME = 'amylo-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // كنعطيو الأولوية للشبكة (باش نتأكدو من آخر نسخة)، وإلا فشلات كنستعملو النسخة المخزنة
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
