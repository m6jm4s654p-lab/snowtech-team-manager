const CACHE_NAME='alpine-team-manager-v01380';
const CORE=['./','./index.html','./app.js','./manifest.webmanifest'];
self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(c=>Promise.allSettled(CORE.map(u=>c.add(new Request(u,{cache:'reload'}))))));
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(event.request,{cache:'no-store'});
        if(fresh && fresh.ok){const c=await caches.open(CACHE_NAME);c.put('./index.html',fresh.clone()).catch(()=>{});}
        return fresh;
      }catch(e){return (await caches.match('./index.html')) || Response.error();}
    })());
    return;
  }
  // version.json must always come from the network so update checks cannot be stale.
  if(url.pathname.endsWith('/version.json')){
    event.respondWith(fetch(event.request,{cache:'no-store'}));
    return;
  }
  event.respondWith((async()=>{
    try{
      const fresh=await fetch(event.request);
      if(fresh && fresh.ok){const c=await caches.open(CACHE_NAME);c.put(event.request,fresh.clone()).catch(()=>{});}
      return fresh;
    }catch(e){return (await caches.match(event.request)) || Response.error();}
  })());
});
