const CACHE='snowtech-alpine-v060';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',e=>e.waitUntil((async()=>{await caches.open(CACHE).then(c=>c.addAll(ASSETS));await self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{
  const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;
}).catch(()=>caches.match('./index.html')))));

self.addEventListener('message',e=>{if(e.data&&e.data.type==='SKIP_WAITING')self.skipWaiting();});
