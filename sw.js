const CACHE_NAME='alpine-team-manager-v01392';
const APP_CACHE_PREFIX='alpine-team-manager-';
const APP_SHELL=[
  './',
  './index.html',
  './manifest.webmanifest',
  './snowtech-icon-192.png',
  './snowtech-icon-512.png',
  './apple-touch-icon.png'
];

async function cacheAppShell(){
  const cache=await caches.open(CACHE_NAME);
  // addAll is intentionally atomic: never activate a new worker with a partial shell.
  await cache.addAll(APP_SHELL.map(url=>new Request(url,{cache:'reload'})));
}

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    await cacheAppShell();
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    // The complete v0.13.92 shell exists before older Manager caches are removed.
    const keys=await caches.keys();
    await Promise.all(keys
      .filter(key=>key.startsWith(APP_CACHE_PREFIX) && key!==CACHE_NAME)
      .map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  if(event.data?.type==='SKIP_WAITING'){
    self.skipWaiting();
    return;
  }
  if(event.data?.type==='WARM_APP_SHELL'){
    event.waitUntil(cacheAppShell());
  }
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;

  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(event.request,{cache:'no-store'});
        if(fresh?.ok){
          const cache=await caches.open(CACHE_NAME);
          await cache.put('./index.html',fresh.clone());
        }
        return fresh;
      }catch{
        return (await caches.match(event.request,{ignoreSearch:true}))
          || (await caches.match('./'))
          || (await caches.match('./index.html'))
          || Response.error();
      }
    })());
    return;
  }

  // Update checks are online-only; application launch never depends on this file.
  if(url.pathname.endsWith('/version.json')){
    event.respondWith(fetch(event.request,{cache:'no-store'}));
    return;
  }

  event.respondWith((async()=>{
    const cached=await caches.match(event.request,{ignoreSearch:true});
    if(cached)return cached;
    try{
      const fresh=await fetch(event.request);
      if(fresh?.ok){
        const cache=await caches.open(CACHE_NAME);
        await cache.put(event.request,fresh.clone());
      }
      return fresh;
    }catch{
      return Response.error();
    }
  })());
});
