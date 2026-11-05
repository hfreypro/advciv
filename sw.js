/* Aide jeu réel : l'app marche sans Internet une fois ouverte.
   Réseau d'abord (pour recevoir les nouvelles versions), copie en cache si pas de réseau. */
const CACHE = 'advciv-joueur-v1';
const FICHIERS = ['./', './index.html', './manifest.json', './icone-192.png', './icone-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return; // polices Google : le navigateur s'en charge
  e.respondWith(fetch(r).then((res) => { if (res.ok) { const copie = res.clone(); caches.open(CACHE).then((c) => c.put(r, copie)); } return res; })
    .catch(() => caches.match(r).then((m) => m || caches.match('./index.html'))));
});
