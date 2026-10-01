// Offline-Speicher der Web-App (nur im fertigen Build über HTTPS registriert, s. main.ts).
// Startseite: erst Netz (neue Versionen kommen sofort an), offline aus dem Speicher.
// Alles andere (Spielcode mit Hash im Namen, Bilder): erst Speicher, sonst Netz – und dabei merken.
const CACHE = 'resist-the-cute-v2';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './manifest.webmanifest', './icons/apple-touch-icon.png'])));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Die Seite schickt nach dem ersten Laden die Liste ihrer Dateien – dann geht die App gleich danach offline.
self.addEventListener('message', (event) => {
  const urls = event.data && event.data.cache;
  if (!Array.isArray(urls)) return;
  event.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(urls.map((u) => c.match(u).then((hit) => hit || fetch(u).then((res) => res.ok && c.put(u, res))).catch(() => undefined))),
    ),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  const isPage = req.mode === 'navigate';
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      if (isPage) {
        try {
          const res = await fetch(req);
          cache.put('./', res.clone());
          return res;
        } catch {
          return (await cache.match('./')) ?? Response.error();
        }
      }
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) cache.put(req, res.clone());
      return res;
    })(),
  );
});
