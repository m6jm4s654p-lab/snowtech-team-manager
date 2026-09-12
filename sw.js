const CACHE='snowtech-alpine-v0126';
const CACHE_PREFIX='snowtech-alpine-';
const ASSETS=[
  './','./index.html','./manifest.webmanifest','./snowtech-logo.png',
  './alpine-team-manager-logo.png','./snowtech-icon-192.png',
  './snowtech-icon-512.png','./apple-touch-icon.png'
];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(
      keys
        .filter(k=>k.startsWith(CACHE_PREFIX) && k!==CACHE)
        .map(k=>caches.delete(k))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;

  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;

  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(req);
        if(fresh && fresh.ok){
          const cache=await caches.open(CACHE);
          cache.put('./index.html',fresh.clone()).catch(()=>{});
        }
        return fresh;
      }catch{
        return (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    const cached=await caches.match(req);
    if(cached)return cached;
    const resp=await fetch(req);
    if(resp && resp.ok && ['style','script','image','manifest','font'].includes(req.destination)){
      const cache=await caches.open(CACHE);
      cache.put(req,resp.clone()).catch(()=>{});
    }
    return resp;
  })());
});

self.addEventListener('message',event=>{
  if(event.data && event.data.type==='SKIP_WAITING')self.skipWaiting();
});
