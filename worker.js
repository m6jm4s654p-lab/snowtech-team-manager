/**
 * SnowTech SAJ API v0.13.47
 * GET /api/saj-athlete?saj=03028493
 *
 * Strategy:
 * 1) Biography page is the primary identity source.
 * 2) Current-season point list is preferred for official SAJ points.
 * 3) Previous-season point list is fallback.
 * Public SAJ pages only.
 */
const SAJ_ORIGIN = "https://sajdb.shikuminet.jp";


const SAJ_RANKING_CACHE_SECONDS = 6 * 60 * 60;      // 6 hours
const SAJ_RANKING_STALE_SECONDS = 24 * 60 * 60;     // stale fallback
const SAJ_RANKING_CACHE_VERSION = "v01347";


const SAJ_POINT_CALENDAR_CACHE_SECONDS = 6 * 60 * 60;
function pointCalendarCacheUrl(season){
  return `https://cache.alpine-team-manager.invalid/saj-point-calendar?v=${SAJ_RANKING_CACHE_VERSION}&season=${encodeURIComponent(season)}`;
}
function extractCalendarZipEntries(html, source){
  const entries=[];
  const trs=String(html||"").match(/<tr\b[\s\S]*?<\/tr>/gi)||[];
  for(const tr of trs){
    const rowText=strip(tr);
    let m=rowText.match(/SAJ\s*(?:No\.?|NO\.?|Ｎｏ\.?|№)?\s*(\d{1,3})/i);
    if(!m){
      const cells=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(x=>strip(x[1]));
      m=String(cells[0]||"").match(/(?:^|\D)(\d{1,3})(?:\D|$)/);
    }
    if(!m)continue;
    const pointListNumber=Number(m[1]);
    if(!(pointListNumber>0&&pointListNumber<100))continue;
    for(const link of extractDownloadLinks(tr)){
      if(!/\.zip(?:$|\?)/i.test(link))continue;
      const file=link.split('/').pop()||'';
      let sex=null;
      if(/AW(?:_|\.|$)|WOMAN|WOMEN/i.test(file+" "+rowText))sex="女";
      else if(/AM(?:_|\.|$)|MAN|MEN/i.test(file+" "+rowText))sex="男";
      if(sex)entries.push({pointListNumber,sex,url:link});
    }
  }
  return entries;
}

async function getLatestPointCalendarMeta(season){
  const key=new Request(pointCalendarCacheUrl(season));
  try{
    const hit=await caches.default.match(key);
    if(hit){
      const d=await hit.json(), age=Date.now()-(Number(d.cachedAt)||0);
      if(age>=0 && age<SAJ_POINT_CALENDAR_CACHE_SECONDS*1000)return {...d,calendarCacheStatus:"HIT"};
    }
  }catch{}
  const source=`${SAJ_ORIGIN}/alpine/point/calendar?season_code=${encodeURIComponent(season)}`;
  const html=await getText(source);
  const zipEntries=extractCalendarZipEntries(html,source);
  const nums=zipEntries.map(x=>x.pointListNumber).filter(n=>n>0&&n<100);
  if(!nums.length){
    for(const m of String(html).matchAll(/SAJ\s*(?:No\.?|NO\.?|Ｎｏ\.?|№)?\s*(\d{1,3})/gi)){
      const n=Number(m[1]); if(n>0&&n<100)nums.push(n);
    }
  }
  const latestListNumber=nums.length?Math.max(...nums):null;
  const latestZips=zipEntries.filter(x=>x.pointListNumber===latestListNumber);
  const data={season,latestListNumber,latestZips,source,cachedAt:Date.now()};
  try{
    await caches.default.put(key,new Response(JSON.stringify(data),{
      headers:{"Content-Type":"application/json; charset=utf-8","Cache-Control":"public, max-age=21600"}
    }));
  }catch{}
  return {...data,calendarCacheStatus:"MISS"};
}

function rankingDatasetCacheUrl(season, sex){
  const u=new URL("https://cache.alpine-team-manager.invalid/saj-ranking-dataset");
  u.searchParams.set("v",SAJ_RANKING_CACHE_VERSION);
  u.searchParams.set("season",String(season));
  u.searchParams.set("sex",String(sex));
  return u.toString();
}
async function readRankingDatasetCache(season, sex, {allowStale=false}={}){
  try{
    const cache=caches.default;
    const key=new Request(rankingDatasetCacheUrl(season,sex),{method:"GET"});
    const hit=await cache.match(key);
    if(!hit)return null;
    const data=await hit.json();
    const savedAt=Number(data?.cachedAt)||0;
    if(!savedAt)return null;
    const age=Math.max(0,Date.now()-savedAt);
    const maxAge=(allowStale?SAJ_RANKING_STALE_SECONDS:SAJ_RANKING_CACHE_SECONDS)*1000;
    if(age>maxAge)return null;
    return {...data,cacheAgeSeconds:Math.floor(age/1000)};
  }catch{
    return null;
  }
}
async function writeRankingDatasetCache(season, sex, data){
  try{
    const cache=caches.default;
    const key=new Request(rankingDatasetCacheUrl(season,sex),{method:"GET"});
    const payload={...data,cachedAt:Date.now()};
    const res=new Response(JSON.stringify(payload),{
      headers:{
        "Content-Type":"application/json; charset=utf-8",
        "Cache-Control":`public, max-age=${SAJ_RANKING_STALE_SECONDS}`
      }
    });
    await cache.put(key,res);
  }catch{}
}

const SAJ_ATHLETE_RESULTS_CACHE_SECONDS = 6 * 60 * 60;
const SAJ_ATHLETE_RESULTS_STALE_SECONDS = 24 * 60 * 60;

function athleteResultsCacheUrl(saj){
  const u=new URL("https://cache.alpine-team-manager.invalid/saj-athlete-results");
  u.searchParams.set("v",SAJ_RANKING_CACHE_VERSION);
  u.searchParams.set("saj",String(saj));
  return u.toString();
}
async function readAthleteResultsCache(saj,{allowStale=false}={}){
  try{
    const key=new Request(athleteResultsCacheUrl(saj),{method:"GET"});
    const hit=await caches.default.match(key);
    if(!hit)return null;
    const data=await hit.json();
    const savedAt=Number(data?.cachedAt)||0;
    if(!savedAt)return null;
    const age=Math.max(0,Date.now()-savedAt);
    const maxAge=(allowStale?SAJ_ATHLETE_RESULTS_STALE_SECONDS:SAJ_ATHLETE_RESULTS_CACHE_SECONDS)*1000;
    if(age>maxAge)return null;
    return {...data,cacheAgeSeconds:Math.floor(age/1000)};
  }catch{return null;}
}
async function writeAthleteResultsCache(saj,data){
  try{
    const key=new Request(athleteResultsCacheUrl(saj),{method:"GET"});
    const payload={...data,cachedAt:Date.now()};
    await caches.default.put(key,new Response(JSON.stringify(payload),{
      headers:{
        "Content-Type":"application/json; charset=utf-8",
        "Cache-Control":`public, max-age=${SAJ_ATHLETE_RESULTS_STALE_SECONDS}`
      }
    }));
  }catch{}
}
async function lookupAthleteResultsCached(saj){
  const fresh=await readAthleteResultsCache(saj);
  if(fresh)return {...fresh,cacheStatus:"HIT"};
  try{
    const biography=await lookupBiography(saj);
    if(!biography)throw new Error("SAJバイオグラフィーに該当選手が見つかりません");
    const data={saj,results:Array.isArray(biography.results)?biography.results:[],source:biography.source};
    await writeAthleteResultsCache(saj,data);
    return {...data,cacheStatus:"MISS",cachedAt:Date.now()};
  }catch(e){
    const stale=await readAthleteResultsCache(saj,{allowStale:true});
    if(stale)return {...stale,cacheStatus:"STALE"};
    throw e;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return cors(new Response(null, {status:204}), env, request);
    if (request.method !== "GET") {
      return cors(json({ok:false,error:"Method not allowed"},405), env, request);
    }
    if (url.pathname === "/health") {
      return cors(json({ok:true,service:"snowtech-saj-api",version:"0.13.47"}), env, request);
    }

    if (url.pathname === "/api/debug-competition-calendar") {
      if(env?.ENABLE_DEBUG!=="1") return cors(json({ok:false,error:"Not found"},404),env,request);
      try{
        const debug=await debugCompetitionCalendar();
        return cors(json({ok:true,debug}),env,request);
      }catch(e){
        return cors(json({ok:false,error:String(e?.message||e)},502),env,request);
      }
    }

    if (url.pathname === "/api/debug-competition-js") {
      if(env?.ENABLE_DEBUG!=="1") return cors(json({ok:false,error:"Not found"},404),env,request);
      try{
        const debug=await debugCompetitionJavascript();
        return cors(json({ok:true,debug}),env,request);
      }catch(e){
        return cors(json({ok:false,error:String(e?.message||e)},502),env,request);
      }
    }

    if (url.pathname === "/api/debug-competition-api") {
      if(env?.ENABLE_DEBUG!=="1") return cors(json({ok:false,error:"Not found"},404),env,request);
      try{
        const season=Number((url.searchParams.get("season")||"2026").replace(/\D/g,""))||2026;
        const month=Number((url.searchParams.get("month")||"2").replace(/\D/g,""))||2;
        const debug=await debugCompetitionApi(season,month);
        return cors(json({ok:true,debug}),env,request);
      }catch(e){
        return cors(json({ok:false,error:String(e?.message||e)},502),env,request);
      }
    }

    if (url.pathname === "/api/venue-search") {
      const q=String(url.searchParams.get("q")||"").trim();
      const prefecture=String(url.searchParams.get("prefecture")||"").trim();
      const municipality=String(url.searchParams.get("municipality")||"").trim();
      const fallback=String(url.searchParams.get("fallback")||"").trim();
      if(q.length<2 || q.length>100){
        return cors(json({ok:false,error:"会場名を確認してください"},400),env,request);
      }
      try{
        const results=await searchVenueOfficialWeb(q,{prefecture,municipality,fallback});
        return cors(json({
          ok:true,
          query:q,
          prefecture,
          municipality,
          searchArea:[prefecture,municipality].filter(Boolean).join(" "),
          results
        }),env,request);
      }catch(e){
        return cors(json({
          ok:false,
          error:"会場公式サイト候補の検索に失敗しました",
          detail:String(e?.message||e),
          results:[]
        },502),env,request);
      }
    }

    if (url.pathname === "/api/saj-competitions") {
      try{
        const seasonRaw=(url.searchParams.get("season")||"").replace(/\D/g,"");
        const season=Number(seasonRaw)||getTargetSeasons()[0];
        if(season<2020 || season>2040){
          return cors(json({ok:false,error:"シーズン指定が不正です"},400),env,request);
        }
        const monthRaw=(url.searchParams.get("month")||"").replace(/\D/g,"");
        const month=Number(monthRaw)||0;

        if(month && (month<1 || month>12)){
          return cors(json({ok:false,error:"月指定が不正です"},400),env,request);
        }

        const competitions=await lookupCompetitionsApi(season,month);

        return cors(json({
          ok:true,
          season,
          seasonLabel:`${season-1}/${season}`,
          month:month||null,
          competitions
        }),env,request);
      }catch(e){
        return cors(json({ok:false,error:String(e?.message||e)},502),env,request);
      }
    }



    if (url.pathname === "/api/saj-ranking") {
      const sex=(url.searchParams.get("sex")||"").trim();
      const category=(url.searchParams.get("category")||"").trim().toLowerCase();
      const discipline=(url.searchParams.get("discipline")||"").trim().toUpperCase();

      if(!["男","女"].includes(sex)){
        return cors(json({ok:false,error:"性別は男または女を指定してください"},400),env,request);
      }
      if(!["k2","general"].includes(category)){
        return cors(json({ok:false,error:"カテゴリーはk2またはgeneralを指定してください"},400),env,request);
      }
      if(!["SL","GS","SG"].includes(discipline)){
        return cors(json({ok:false,error:"種目はSL・GS・SGのいずれかを指定してください"},400),env,request);
      }

      try{
        const result=await lookupNationalPointRanking({sex,category,discipline});
        return cors(json({ok:true,...result}),env,request);
      }catch(e){
        return cors(json({
          ok:false,
          error:"SAJ全国ポイントランキングの取得に失敗しました",
          detail:String(e?.message||e)
        },502),env,request);
      }
    }


    if (url.pathname === "/api/saj-athletes") {
      const sex=(url.searchParams.get("sex")||"").trim();
      const organization=(url.searchParams.get("organization")||"").trim();
      if(!["男","女"].includes(sex)){
        return cors(json({ok:false,error:"性別は男または女を指定してください"},400),env,request);
      }
      if(!organization || organization.length>32){
        return cors(json({ok:false,error:"加盟団体を確認してください"},400),env,request);
      }
      try{
        const result=await lookupAthleteListBySexOrganization(sex,organization);
        return cors(json({ok:true,...result}),env,request);
      }catch(e){
        return cors(json({
          ok:false,
          error:"SAJポイントリストの選手一覧取得に失敗しました",
          detail:String(e?.message||e)
        },502),env,request);
      }
    }

    if (url.pathname === "/api/saj-athlete-points") {
      const saj=(url.searchParams.get("saj")||"").replace(/\D/g,"");
      if(!/^\d{8}$/.test(saj)){
        return cors(json({ok:false,error:"SAJ競技者番号を8桁で入力してください"},400),env,request);
      }
      try{
        const points=await lookupOfficialPoints(saj);
        if(!points)return cors(json({ok:false,error:"SAJポイントを取得できませんでした"},404),env,request);
        return cors(json({ok:true,points:{
          saj,dh:points.dh??null,sc:points.sc??null,sg:points.sg??null,gs:points.gs??null,sl:points.sl??null,
          pointSeasonCode:points.seasonCode??null,pointSeasonLabel:points.seasonLabel??null,
          pointListNumber:points.pointListNumber??null,pointSource:points.source??null
        }}),env,request);
      }catch(e){
        return cors(json({ok:false,error:"SAJポイント取得に失敗しました",detail:String(e?.message||e)},502),env,request);
      }
    }

    if (url.pathname === "/api/saj-athlete-results") {
      const saj=(url.searchParams.get("saj")||"").replace(/\D/g,"");
      if(!/^\d{8}$/.test(saj)){
        return cors(json({ok:false,error:"SAJ競技者番号を8桁で入力してください"},400),env,request);
      }
      try{
        const result=await lookupAthleteResultsCached(saj);
        return cors(json({ok:true,saj,results:result.results||[],source:result.source||"",cacheStatus:result.cacheStatus||"",cachedAt:result.cachedAt||null}),env,request);
      }catch(e){
        return cors(json({ok:false,error:"SAJ大会成績の取得に失敗しました",detail:String(e?.message||e)},502),env,request);
      }
    }

    if (url.pathname === "/api/debug-points") {
      if(env?.ENABLE_DEBUG!=="1") return cors(json({ok:false,error:"Not found"},404),env,request);
      const saj=(url.searchParams.get("saj")||"").replace(/\D/g,"");
      if(!/^\d{8}$/.test(saj)){
        return cors(json({ok:false,error:"SAJ競技者番号を8桁で入力してください"},400),env,request);
      }
      try{
        const debug=await debugPoints(saj);
        return cors(json({ok:true,debug}),env,request);
      }catch(e){
        return cors(json({ok:false,error:String(e?.message||e)},502),env,request);
      }
    }

    if (url.pathname !== "/api/saj-athlete") {
      return cors(json({ok:false,error:"Not found"},404), env, request);
    }

    const saj=(url.searchParams.get("saj")||"").replace(/\D/g,"");
    if(!/^\d{8}$/.test(saj)){
      return cors(json({ok:false,error:"SAJ競技者番号を8桁で入力してください"},400),env,request);
    }

    try{
      const biography = await lookupBiography(saj);
      if(!biography){
        return cors(json({ok:false,error:"SAJバイオグラフィーに該当選手が見つかりません"},404),env,request);
      }

      // Official point list values are optional enrichment.
      const points = await lookupOfficialPoints(saj).catch(()=>null);

      const athlete = {
        ...biography,
        dh: points?.dh ?? null,
        sc: points?.sc ?? null,
        sg: points?.sg ?? null,
        gs: points?.gs ?? null,
        sl: points?.sl ?? null,
        pointSeasonCode: points?.seasonCode ?? null,
        pointSeasonLabel: points?.seasonLabel ?? null,
        pointListNumber: points?.pointListNumber ?? null,
        pointSource: points?.source ?? null,
        source: biography.source
      };

      return cors(json({ok:true,athlete}),env,request);
    }catch(e){
      return cors(json({
        ok:false,
        error:"SAJデータ取得に失敗しました",
        detail:String(e?.message||e)
      },502),env,request);
    }
  }
};



function safeVenueSearchUrl(v){
  try{
    const u=new URL(String(v||""));
    if(!["http:","https:"].includes(u.protocol))return "";
    const host=u.hostname.toLowerCase().replace(/^www\./,"");
    const blocked=[
      "duckduckgo.com","google.com","google.co.jp","bing.com",
      "youtube.com","youtu.be","facebook.com","instagram.com",
      "x.com","twitter.com","tiktok.com"
    ];
    if(blocked.some(x=>host===x || host.endsWith("."+x)))return "";
    return u.toString();
  }catch{
    return "";
  }
}
function decodeDuckDuckGoHref(href){
  try{
    const absolute=new URL(decodeHtml(href),"https://duckduckgo.com");
    const uddg=absolute.searchParams.get("uddg");
    return safeVenueSearchUrl(uddg ? decodeURIComponent(uddg) : absolute.toString());
  }catch{
    return "";
  }
}
function normalizeSearchResultTitle(v){
  return strip(v).replace(/\s+/g," ").trim().slice(0,160);
}
function mergeVenueSearchResults(rows){
  const map=new Map();
  for(const row of rows||[]){
    const url=safeVenueSearchUrl(row?.url);
    if(!url)continue;
    let key=url;
    try{
      const u=new URL(url);
      u.hash="";
      key=(u.origin+u.pathname).replace(/\/+$/,"").toLowerCase();
    }catch{}
    if(map.has(key))continue;
    map.set(key,{
      title:normalizeSearchResultTitle(row?.title)||new URL(url).hostname,
      url,
      snippet:strip(row?.snippet||"").slice(0,220),
      source:String(row?.source||"web")
    });
  }
  return [...map.values()];
}
async function fetchSearchHtml(url){
  const r=await fetch(url,{
    method:"GET",
    headers:{
      "User-Agent":"Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
      "Accept":"text/html,application/xhtml+xml",
      "Accept-Language":"ja-JP,ja;q=0.9,en;q=0.6"
    },
    redirect:"follow"
  });
  if(!r.ok)throw new Error(`search HTTP ${r.status}`);
  return await r.text();
}
function parseDuckDuckGoResults(html){
  const source=String(html||"");
  const out=[];
  const anchors=source.match(/<a\b[^>]*class=["'][^"']*result__a[^"']*["'][^>]*>[\s\S]*?<\/a>/gi)||[];
  for(const a of anchors){
    const hrefM=a.match(/\bhref=["']([^"']+)["']/i);
    if(!hrefM)continue;
    const url=decodeDuckDuckGoHref(hrefM[1]);
    if(!url)continue;
    const title=normalizeSearchResultTitle(a.replace(/<a\b[^>]*>/i,"").replace(/<\/a>/i,""));
    out.push({title,url,source:"duckduckgo"});
  }
  return out;
}
function parseBingResults(html){
  const source=String(html||"");
  const out=[];
  const blocks=source.match(/<li\b[^>]*class=["'][^"']*b_algo[^"']*["'][^>]*>[\s\S]*?<\/li>/gi)||[];
  for(const block of blocks){
    const m=block.match(/<h2\b[^>]*>\s*<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
    if(!m)continue;
    const url=safeVenueSearchUrl(decodeHtml(m[1]));
    if(!url)continue;
    const snippetM=block.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i);
    out.push({
      title:normalizeSearchResultTitle(m[2]),
      url,
      snippet:snippetM?strip(snippetM[1]):"",
      source:"bing"
    });
  }
  return out;
}
function scoreVenueSearchResult(row,place,area=""){
  const hay=`${row?.title||""} ${row?.url||""} ${row?.snippet||""} ${row?.searchQuery||""}`.toLowerCase();
  const p=String(place||"").toLowerCase().replace(/\s+/g,"");
  const a=String(area||"").toLowerCase().replace(/\s+/g,"");
  const compact=hay.replace(/\s+/g,"");
  let score=0;
  if(a && compact.includes(a))score+=130;
  if(p && compact.includes(p))score+=100;
  if(/公式|official/.test(hay))score+=40;
  if(/ski|スキー/.test(hay))score+=30;
  if(/resort|リゾート|snow|スノー/.test(hay))score+=10;
  if(/wikipedia|tripadvisor|jalan|じゃらん|rakuten|楽天|navitime|mapion|tenki|weather/.test(hay))score-=30;
  return score;
}
async function searchVenueOfficialWeb(place,location={}){
  const prefecture=String(location?.prefecture||"").trim();
  const municipality=String(location?.municipality||"").trim();
  const fallback=String(location?.fallback||"").trim();
  const area=[prefecture,municipality].filter(Boolean).join(" ").trim();

  // Strict rule:
  // If both are known, search exactly "都道府県名 市町村名 スキー場".
  // Do not append venue/event names that can cause another city to match.
  let queries=[];
  if(fallback==="prefecture" && prefecture){
    queries=[`${prefecture} スキー場`];
  }else if(prefecture && municipality){
    queries=[`${prefecture} ${municipality} スキー場`];
  }else if(prefecture){
    queries=[`${prefecture} スキー場`];
  }else{
    queries=[`${String(place||"").trim()} スキー場`];
  }

  const rows=[];

  for(const query of [...new Set(queries)]){
    try{
      const ddg=`https://html.duckduckgo.com/html/?kl=jp-jp&q=${encodeURIComponent(query)}`;
      rows.push(...parseDuckDuckGoResults(await fetchSearchHtml(ddg)).map(x=>({...x,searchQuery:query})));
    }catch{}

    if(rows.length<10){
      try{
        const bing=`https://www.bing.com/search?setlang=ja-JP&cc=jp&q=${encodeURIComponent(query)}`;
        rows.push(...parseBingResults(await fetchSearchHtml(bing)).map(x=>({...x,searchQuery:query})));
      }catch{}
    }
  }

  return mergeVenueSearchResults(rows)
    .map(row=>({...row,_score:scoreVenueSearchResult(row,place,area)}))
    .sort((a,b)=>b._score-a._score)
    .slice(0,14)
    .map(({_score,...row})=>row);
}
function json(obj,status=200){
  return new Response(JSON.stringify(obj),{
    status,
    headers:{"content-type":"application/json; charset=utf-8"}
  });
}
function cors(resp,env,request){
  const h=new Headers(resp.headers);
  const configured=String(env?.ALLOWED_ORIGIN||"https://m6jm4s654p-lab.github.io").trim();
  const origin=request?.headers?.get("Origin")||"";
  if(configured==="*" || !origin || origin===configured){
    h.set("Access-Control-Allow-Origin",configured==="*"?"*":configured);
  }
  h.set("Access-Control-Allow-Methods","GET,OPTIONS");
  h.set("Access-Control-Allow-Headers","Content-Type,Accept");
  h.set("Vary","Origin");
  h.set("X-Content-Type-Options","nosniff");
  h.set("Referrer-Policy","no-referrer");
  h.set("X-Frame-Options","DENY");
  h.set("Permissions-Policy","geolocation=(), microphone=(), camera=()");
  let sensitivePath=false;
  try{
    const path=new URL(request?.url||"https://invalid/").pathname;
    sensitivePath=(path==="/api/saj-athlete" || path==="/api/saj-athletes");
  }catch{}
  h.set(
    "Cache-Control",
    sensitivePath || !(resp.status>=200 && resp.status<300)
      ? "no-store"
      : "public, max-age=300"
  );
  return new Response(resp.body,{status:resp.status,headers:h});
}
async function getText(url){
  const r=await fetch(url,{headers:{
    "User-Agent":"AlpineTeamManager/0.13.46 (+public SAJ data lookup)",
    "Accept":"text/html,application/xhtml+xml"
  }});
  if(!r.ok) throw new Error(`SAJ HTTP ${r.status}: ${url}`);
  return await r.text();
}
function decodeHtml(s){
  return String(s||"")
    .replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#039;/g,"'")
    .replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&nbsp;/g," ");
}
function strip(s){
  return decodeHtml(String(s||"").replace(/<br\s*\/?>/gi," ").replace(/<[^>]+>/g," "))
    .replace(/\s+/g," ").trim();
}
function numOrNull(v){
  const t=String(v??"").trim();
  if(!t || t==="-" || t==="―" || t==="—") return null;
  const normalized=t.replace(/,/g,"");
  const m=normalized.match(/-?\d+(?:\.\d+)?/);
  if(!m) return null;
  const n=Number(m[0]);
  return Number.isFinite(n)?n:null;
}

async function lookupBiography(saj){
  const url=`${SAJ_ORIGIN}/alpine/biography/${saj}`;
  const html=await getText(url);

  if(!html.includes(saj) || !/バイオグラフィー|Biography/i.test(html)) return null;

  const text=strip(html);
  if(!text.includes(`SAJ競技者番号${saj}`) && !text.includes(`SAJ競技者番号 ${saj}`)) return null;

  let name="", roman="", birth="", sex="", team="";

  // Restrict parsing to the athlete profile block.
  const codePos=text.indexOf(saj);
  const alpinePos=text.indexOf("Alpine", codePos);
  const profile=(alpinePos>codePos ? text.slice(codePos, alpinePos) : text.slice(codePos, codePos+800));

  // Actual SAJ visible-text order:
  // SAJ no -> FIS no -> Japanese name -> Roman name -> birth/sex -> team
  const birthM=profile.match(/(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日生\s*([男女])/);
  if(birthM){
    birth=`${birthM[1]}-${String(birthM[2]).padStart(2,"0")}-${String(birthM[3]).padStart(2,"0")}`;
    sex=birthM[4];

    const beforeBirth=profile.slice(0,birthM.index).trim();

    // Everything after FIS競技者番号 and before birthday contains name + roman name.
    const afterFis=beforeBirth
      .replace(/^.*?FIS競技者番号\s*(?:\d+)?\s*(?:\(登録済\))?\s*/s,"")
      .trim();

    // Romanized name is the final Latin-name block.
    const romanM=afterFis.match(/([A-Za-z][A-Za-z' .-]*[A-Za-z])\s*$/);
    if(romanM){
      roman=romanM[1].replace(/\s+/g," ").trim();
      name=afterFis.slice(0,romanM.index).replace(/\s+/g," ").trim();
    }

    // Team is the text following birth/sex until profile block end.
    team=profile.slice(birthM.index+birthM[0].length)
      .replace(/\s+/g," ")
      .trim();
  }

  // Extra fallback using direct text around known fields.
  if(!name || !roman || !birth || !team){
    const tokens=[...html.matchAll(/>([^<>]+)</g)]
      .map(m=>strip(m[1]))
      .filter(Boolean);

    const idx=tokens.findIndex(x=>x.includes(saj));
    if(idx>=0){
      const window=tokens.slice(idx, idx+15);

      const bidx=window.findIndex(x=>/\d{4}年\d{1,2}月\d{1,2}日生[男女]/.test(x));
      if(bidx>=0){
        const bm=window[bidx].match(/(\d{4})年(\d{1,2})月(\d{1,2})日生([男女])/);
        if(bm){
          birth=birth || `${bm[1]}-${String(bm[2]).padStart(2,"0")}-${String(bm[3]).padStart(2,"0")}`;
          sex=sex || bm[4];
        }

        const prior=window.slice(0,bidx).filter(x=>
          !x.includes("SAJ競技者番号") &&
          !x.includes("FIS競技者番号") &&
          !/登録済/.test(x) &&
          !/^\d+$/.test(x)
        );

        if(!roman){
          const r=prior.findLast ? prior.findLast(x=>/^[A-Za-z][A-Za-z' .-]+$/.test(x))
                                 : [...prior].reverse().find(x=>/^[A-Za-z][A-Za-z' .-]+$/.test(x));
          if(r) roman=r.trim();
        }
        if(!name && roman){
          const ri=prior.lastIndexOf(roman);
          if(ri>0) name=prior[ri-1].trim();
        }
        if(!team && window[bidx+1]){
          team=window[bidx+1].trim();
        }
      }
    }
  }

  const results=parseBiographyResults(html);

  return {
    saj,
    name,
    romanName:roman,
    birth,
    sex,
    team,
    organization:"",
    results,
    source:url
  };
}
function parseBiographyResults(html){
  const results=[];
  const trs=html.match(/<tr\b[\s\S]*?<\/tr>/gi)||[];
  for(const tr of trs){
    const cells=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m=>strip(m[1]));
    if(cells.length<7) continue;
    if(!/^\d{4}\/\d{4}$/.test(cells[0])) continue;
    const point=numOrNull(cells[6]);
    results.push({
      season:cells[0],
      date:cells[1],
      rank:cells[2],
      race:cells[3],
      disc:cells[4],
      category:cells[5],
      point
    });
  }
  return results;
}

function extractAllLinks(html){
  const links=[];
  const re=/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m;
  while((m=re.exec(html))){
    try{
      const href=decodeHtml(m[1]);
      if(/^javascript:/i.test(href) || href==="#") continue;
      links.push(new URL(href,SAJ_ORIGIN).toString());
    }catch{}
  }
  return [...new Set(links)];
}

function extractPointListLinks(html){
  return extractAllLinks(html).filter(link =>
    /\/alpine\/point\/list(?:\?|$)/i.test(link) && !/saj_fis=FIS/i.test(link)
  );
}

function extractPointListEntries(html){
  const entries=[];
  const trs=html.match(/<tr\b[\s\S]*?<\/tr>/gi)||[];
  for(const tr of trs){
    const cells=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m=>strip(m[1]));
    if(!cells.length) continue;
    const noMatch=String(cells[0]||"").match(/\b(\d{1,3})\b/);
    if(!noMatch) continue;
    const pointListNumber=Number(noMatch[1]);
    const links=extractAllLinks(tr).filter(link =>
      /\/alpine\/point\/list(?:\?|$)/i.test(link) && !/saj_fis=FIS/i.test(link)
    );
    for(const link of links) entries.push({link,pointListNumber});
    const downloads=extractDownloadLinks(tr);
    for(const link of downloads) entries.push({link,pointListNumber,download:true});
  }
  return entries;
}

function extractDownloadLinks(html){
  return extractAllLinks(html).filter(link => {
    const low=link.toLowerCase();
    if(/fis/i.test(low) && !/saj/i.test(low)) return false;
    return /\.(csv|txt|zip)(?:\?|$)/i.test(low) ||
           /point|alpine|saj/i.test(low) && /download|static\/media/i.test(low);
  });
}

function parsePointRow(html,saj,source){
  const trs=html.match(/<tr\b[\s\S]*?<\/tr>/gi)||[];
  for(const tr of trs){
    const cells=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m=>strip(m[1]));
    if(cells.length<12) continue;
    const code=(cells[1]||"").replace(/\D/g,"");
    if(code!==saj) continue;
    return {
      saj:code,
      name:cells[2]||"",
      birth:cells[3]||"",
      organization:cells[4]||"",
      team:cells[5]||"",
      group:cells[6]||"",
      dh:numOrNull(cells[7]),
      sc:numOrNull(cells[8]),
      sg:numOrNull(cells[9]),
      gs:numOrNull(cells[10]),
      sl:numOrNull(cells[11]),
      source
    };
  }
  return null;
}

function splitCsvLine(line, delimiter){
  const out=[];
  let cur="", quoted=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      if(quoted && line[i+1]==='"'){ cur+='"'; i++; }
      else quoted=!quoted;
    }else if(ch===delimiter && !quoted){
      out.push(cur.trim());
      cur="";
    }else cur+=ch;
  }
  out.push(cur.trim());
  return out;
}

function parseDelimitedPointFile(text,saj,source){
  const lines=String(text||"").replace(/\r/g,"").split("\n").filter(x=>x.trim());
  if(!lines.length) return null;

  // SAJ downloadable files may be comma/tab/semicolon separated.
  const first=lines.slice(0,8).join("\n");
  const delimiter = first.includes("\t") ? "\t" : (first.includes(";") && !first.includes(",") ? ";" : ",");

  let headerIndex=-1, headers=[];
  for(let i=0;i<Math.min(lines.length,30);i++){
    const cells=splitCsvLine(lines[i],delimiter).map(x=>x.replace(/^"|"$/g,"").trim());
    const joined=cells.join("|").toUpperCase();
    if(/SAJ/.test(joined) && /(GS|SL)/.test(joined)){
      headerIndex=i; headers=cells; break;
    }
  }

  const norm=s=>String(s||"").toUpperCase().replace(/[\s_\-./（）()]/g,"");
  const findCol=(patterns)=>{
    for(let i=0;i<headers.length;i++){
      const h=norm(headers[i]);
      if(patterns.some(p=>h.includes(norm(p)))) return i;
    }
    return -1;
  };

  if(headerIndex>=0){
    const idxSaj=findCol(["SAJNO","SAJ競技者番号","SAJNUMBER"]);
    const idxName=findCol(["氏名","NAME"]);
    const idxBirth=findCol(["BIRTH","生年月日"]);
    const idxOrg=findCol(["加盟団体","県連盟","ORGANIZATION"]);
    const idxTeam=findCol(["チーム名","所属","TEAM"]);
    const idxDH=findCol(["SAJDH"]);
    const idxSC=findCol(["SAJSC"]);
    const idxSG=findCol(["SAJSG"]);
    const idxGS=findCol(["SAJGS"]);
    const idxSL=findCol(["SAJSL"]);

    for(let i=headerIndex+1;i<lines.length;i++){
      const c=splitCsvLine(lines[i],delimiter).map(x=>x.replace(/^"|"$/g,"").trim());
      const code=(idxSaj>=0?c[idxSaj]:"").replace(/\D/g,"");
      if(code!==saj) continue;
      return {
        saj,
        name:idxName>=0?c[idxName]||"":"",
        birth:idxBirth>=0?c[idxBirth]||"":"",
        organization:idxOrg>=0?c[idxOrg]||"":"",
        team:idxTeam>=0?c[idxTeam]||"":"",
        group:"",
        dh:idxDH>=0?numOrNull(c[idxDH]):null,
        sc:idxSC>=0?numOrNull(c[idxSC]):null,
        sg:idxSG>=0?numOrNull(c[idxSG]):null,
        gs:idxGS>=0?numOrNull(c[idxGS]):null,
        sl:idxSL>=0?numOrNull(c[idxSL]):null,
        source
      };
    }
  }

  // Fallback for files without a recognizable header: find the athlete row
  // and infer the final five numeric fields as DH/SL/GS/SG/SC only if plausible.
  for(const line of lines){
    if(!line.includes(saj)) continue;
    const c=splitCsvLine(line,delimiter).map(x=>x.replace(/^"|"$/g,"").trim());
    const codeIdx=c.findIndex(x=>x.replace(/\D/g,"")===saj);
    if(codeIdx<0) continue;

    // Common SAJ raw layout:
    // SAJNO, FISNO, Name, Prefecture, ... SAJ_DH, SAJ_SL, SAJ_GS, SAJ_SG, SAJ_SC, Team, Birth...
    const numeric=c.map((x,i)=>({i,n:numOrNull(x)})).filter(v=>v.n!==null && v.i>codeIdx);
    if(numeric.length>=2){
      return {
        saj,
        name:(/[一-龠々〆ヵヶぁ-ゖァ-ヺ]/.test(String(c[codeIdx+3]||""))?c[codeIdx+3]:(c[codeIdx+2]||c[codeIdx+1]||"")),
        birth:(()=>{
          for(const raw of c){
            const t=String(raw||"").trim();
            let m=t.match(/^((?:19|20)\d{2})(\d{2})(\d{2})$/);
            if(m){const mo=Number(m[2]),d=Number(m[3]);if(mo>=1&&mo<=12&&d>=1&&d<=31)return `${m[1]}-${m[2]}-${m[3]}`;}
            m=t.match(/((?:19|20)\d{2})[\/年.\-](\d{1,2})[\/月.\-](\d{1,2})/);
            if(m)return `${m[1]}-${String(m[2]).padStart(2,"0")}-${String(m[3]).padStart(2,"0")}`;
          }
          return "";
        })(),
        organization:"",
        team:"",
        group:"",
        dh:null, sc:null, sg:null, gs:null, sl:null,
        source,
        rawRow:c
      };
    }
  }
  return null;
}


function decodePointFileBytes(bytes){
  if(!bytes?.length)return "";
  if(bytes.length>=3 && bytes[0]===0xef && bytes[1]===0xbb && bytes[2]===0xbf){
    return new TextDecoder("utf-8").decode(bytes.subarray(3));
  }
  const candidates=[];
  for(const enc of ["utf-8","shift_jis"]){
    try{
      const text=new TextDecoder(enc).decode(bytes);
      const replacement=(text.match(/�/g)||[]).length;
      const headerScore=(/SAJ/i.test(text)?4:0)+(/SAJ[_\s-]*GS/i.test(text)?3:0)+(/SAJ[_\s-]*SL/i.test(text)?3:0)+(/競技者番号|加盟団体|チーム名/.test(text)?3:0);
      candidates.push({text,score:headerScore*100-replacement});
    }catch{}
  }
  candidates.sort((a,b)=>b.score-a.score);
  return candidates[0]?.text||new TextDecoder().decode(bytes);
}

async function inflateZipEntry(bytes, method){
  if(method===0)return bytes;
  if(method!==8)throw new Error(`未対応のZIP圧縮方式です (${method})`);
  const ds=new DecompressionStream("deflate-raw");
  const out=await new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer();
  return new Uint8Array(out);
}

async function fetchZipTextEntries(url){
  const r=await fetch(url,{headers:{
    "User-Agent":"AlpineTeamManager/0.13.46 (+public SAJ point zip lookup)",
    "Accept":"application/zip,application/octet-stream,*/*"
  }});
  if(!r.ok)throw new Error(`SAJ ZIP HTTP ${r.status}: ${url}`);
  const data=new Uint8Array(await r.arrayBuffer());
  const dv=new DataView(data.buffer,data.byteOffset,data.byteLength);
  let eocd=-1;
  for(let i=data.length-22;i>=Math.max(0,data.length-65557);i--){
    if(dv.getUint32(i,true)===0x06054b50){eocd=i;break;}
  }
  if(eocd<0)throw new Error("ZIP終端情報を確認できません");
  const count=dv.getUint16(eocd+10,true);
  let pos=dv.getUint32(eocd+16,true);
  const out=[];
  for(let n=0;n<count && pos+46<=data.length;n++){
    if(dv.getUint32(pos,true)!==0x02014b50)break;
    const method=dv.getUint16(pos+10,true);
    const compSize=dv.getUint32(pos+20,true);
    const nameLen=dv.getUint16(pos+28,true);
    const extraLen=dv.getUint16(pos+30,true);
    const commentLen=dv.getUint16(pos+32,true);
    const localOff=dv.getUint32(pos+42,true);
    const nameBytes=data.subarray(pos+46,pos+46+nameLen);
    let name="";
    try{name=new TextDecoder("utf-8").decode(nameBytes);}catch{}
    if(localOff+30<=data.length && dv.getUint32(localOff,true)===0x04034b50){
      const ln=dv.getUint16(localOff+26,true), le=dv.getUint16(localOff+28,true);
      const start=localOff+30+ln+le;
      const compressed=data.subarray(start,start+compSize);
      if(!name.endsWith('/') && compressed.length===compSize){
        const raw=await inflateZipEntry(compressed,method);
        out.push({name,text:decodePointFileBytes(raw)});
      }
    }
    pos+=46+nameLen+extraLen+commentLen;
  }
  if(!out.length)throw new Error("ZIP内のポイントファイルを展開できませんでした");
  return out;
}

function parseDelimitedPointRows(text,source){
  const lines=String(text||"").replace(/\r/g,"").split("\n").filter(x=>x.trim());
  if(!lines.length)return [];
  const first=lines.slice(0,10).join("\n");
  const delimiter=first.includes("\t")?"\t":(first.includes(";")&&!first.includes(",")?";":",");
  let headerIndex=-1,headers=[];
  for(let i=0;i<Math.min(lines.length,40);i++){
    const cells=splitCsvLine(lines[i],delimiter).map(x=>x.replace(/^"|"$/g,"").trim());
    const joined=cells.join("|").toUpperCase();
    if(/SAJ/.test(joined) && /(GS|SL)/.test(joined)){headerIndex=i;headers=cells;break;}
  }
  const norm=s=>String(s||"").toUpperCase().replace(/[\s_\-./（）()]/g,"");
  const findCol=patterns=>{
    for(let i=0;i<headers.length;i++){
      const h=norm(headers[i]);
      if(patterns.some(p=>h.includes(norm(p))))return i;
    }
    return -1;
  };
  const findJapaneseNameCol=()=>{
    // ZIPには「ローマ字氏名」と「漢字氏名」が共存するため、漢字列を最優先する。
    const strong=["漢字氏名","氏名漢字","漢字名","日本語氏名","選手氏名","氏名"];
    for(const ptn of strong){
      for(let i=0;i<headers.length;i++){
        const h=norm(headers[i]);
        if(h.includes(norm(ptn)) && !/(ROMAN|ローマ字|ENGLISH|ALPHABET)/i.test(String(headers[i]||"")))return i;
      }
    }
    return -1;
  };
  const looksJapaneseName=v=>/[一-龠々〆ヵヶぁ-ゖァ-ヺ]/.test(String(v||""));
  const inferBirth=c=>{
    for(const raw of c){
      const t=String(raw||"").trim();
      let m=t.match(/^(19|20)(\d{2})(\d{2})(\d{2})$/);
      if(m){
        const y=Number(m[1]+m[2]),mo=Number(m[3]),d=Number(m[4]);
        if(y>=1900&&y<=2100&&mo>=1&&mo<=12&&d>=1&&d<=31)return `${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      }
      m=t.match(/((?:19|20)\d{2})[\/年.\-](\d{1,2})[\/月.\-](\d{1,2})/);
      if(m){
        const y=Number(m[1]),mo=Number(m[2]),d=Number(m[3]);
        if(mo>=1&&mo<=12&&d>=1&&d<=31)return `${y}-${String(mo).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
      }
    }
    return "";
  };
  const rows=[];
  if(headerIndex>=0){
    const idxSaj=findCol(["SAJNO","SAJ競技者番号","SAJNUMBER"]);
    const idxFis=findCol(["FISNO","FIS競技者番号","FISNUMBER"]);
    const idxNameJa=findJapaneseNameCol();
    const idxRoman=findCol(["ローマ字氏名","ROMANNAME","ROMAN","ENGLISHNAME"]);
    const idxBirth=findCol(["BIRTH","生年月日","誕生日"]);
    const idxOrg=findCol(["加盟団体","県連盟","ORGANIZATION"]);
    const idxTeam=findCol(["チーム名","所属","TEAM"]);
    const idxGroup=findCol(["G","GROUP","会員区分"]);
    // FISポイント列は絶対に採用しない。SAJ接頭辞を持つ列だけを使用する。
    const idxDH=findCol(["SAJDH"]),idxSC=findCol(["SAJSC"]),idxSG=findCol(["SAJSG"]),idxGS=findCol(["SAJGS"]),idxSL=findCol(["SAJSL"]);
    if(idxSaj>=0){
      for(let i=headerIndex+1;i<lines.length;i++){
        const c=splitCsvLine(lines[i],delimiter).map(x=>x.replace(/^"|"$/g,"").trim());
        const saj=String(c[idxSaj]||"").replace(/\D/g,"").padStart(8,"0");
        if(!/^\d{8}$/.test(saj))continue;
        let name=idxNameJa>=0?String(c[idxNameJa]||"").trim():"";
        // 既知のSAJ ZIP並び: SAJ No., FIS No., ローマ字氏名, 漢字氏名, ...
        // ヘッダー解釈に失敗してもSAJ番号から+3列目の漢字氏名を救済する。
        if(!looksJapaneseName(name) && idxFis===idxSaj+1){
          const positional=String(c[idxSaj+3]||"").trim();
          if(looksJapaneseName(positional))name=positional;
        }
        if(!name){
          const candidate=c.find((v,j)=>j!==idxSaj&&j!==idxFis&&j!==idxRoman&&looksJapaneseName(v));
          name=String(candidate||"").trim();
        }
        const birth=(idxBirth>=0?String(c[idxBirth]||"").trim():"") || inferBirth(c);
        rows.push({
          saj,name,birth,
          organization:idxOrg>=0?c[idxOrg]||"":"",team:idxTeam>=0?c[idxTeam]||"":"",group:idxGroup>=0?c[idxGroup]||"":"",
          dh:idxDH>=0?numOrNull(c[idxDH]):null,sc:idxSC>=0?numOrNull(c[idxSC]):null,sg:idxSG>=0?numOrNull(c[idxSG]):null,
          gs:idxGS>=0?numOrNull(c[idxGS]):null,sl:idxSL>=0?numOrNull(c[idxSL]):null,source
        });
      }
    }
  }
  return rows;
}

async function fetchLatestZipPointRows({season,sex}){
  const calendar=await getLatestPointCalendarMeta(season);
  const listNumber=calendar?.latestListNumber??null;
  const zips=Array.isArray(calendar?.latestZips)?calendar.latestZips:[];
  const zip=zips.find(x=>x.sex===sex && x.pointListNumber===listNumber);
  if(!zip?.url)throw new Error(`SAJ No.${listNumber??'—'} ${sex}子ZIPが見つかりません`);
  const files=await fetchZipTextEntries(zip.url);
  let rows=[];
  for(const f of files){
    rows.push(...parseDelimitedPointRows(f.text,`${zip.url}#${f.name}`));
  }
  rows=mergePointRowsBySaj(rows);
  if(!rows.length)throw new Error(`SAJ No.${listNumber??'—'} ZIPからポイント行を解析できませんでした`);
  return {rows,pointListNumber:listNumber,calendarListNumber:listNumber,source:zip.url,pageCount:files.length,calendarSource:calendar.source};
}

async function getRawText(url){
  const r=await fetch(url,{headers:{
    "User-Agent":"AlpineTeamManager/0.13.46 (+public SAJ data lookup)",
    "Accept":"text/csv,text/plain,text/html,application/octet-stream,*/*"
  }});
  if(!r.ok) throw new Error(`SAJ HTTP ${r.status}: ${url}`);
  return await r.text();
}

function getTargetSeasons(now=new Date()){
  // SAJの「現在シーズン」はアプリ画面で選択されたシーズンではなく、
  // 実際の現在日付（日本時間）から自動判定する。7月1日をシーズン切替日とする。
  const jst=new Date(now.getTime()+9*60*60*1000);
  const y=jst.getUTCFullYear();
  const m=jst.getUTCMonth()+1;
  const current=(m>=7)?y+1:y;
  // 現在シーズンに対象性別の有効なポイントZIPが無い場合のみ1シーズン前へフォールバック。
  return [current,current-1];
}

async function tryPointPage(link,saj,season){
  const variants=[];
  for(const sex of ["1","2",""]){
    const u=new URL(link);
    u.searchParams.set("season_code",String(season));
    u.searchParams.set("sports_code","AL");
    u.searchParams.set("saj_fis","SAJ");
    u.searchParams.set("search_saj_number",saj);
    if(sex) u.searchParams.set("sex",sex);
    variants.push(u.toString());
  }
  for(const url of [...new Set(variants)]){
    try{
      const page=await getText(url);
      const athlete=parsePointRow(page,saj,url);
      if(athlete) return athlete;
    }catch{}
  }
  return null;
}


function parseSelectOptions(html){
  const selects=[];
  const re=/<select\b([^>]*)>([\s\S]*?)<\/select>/gi;
  let m;
  while((m=re.exec(String(html||"")))){
    const attrs=m[1]||"";
    const nameM=attrs.match(/\bname=["']([^"']+)["']/i);
    if(!nameM) continue;
    const name=decodeHtml(nameM[1]);
    const options=[];
    const ore=/<option\b([^>]*)>([\s\S]*?)<\/option>/gi;
    let o;
    while((o=ore.exec(m[2]||""))){
      const om=o[1].match(/\bvalue=["']([^"']*)["']/i);
      options.push({value:om?decodeHtml(om[1]):strip(o[2]),text:strip(o[2])});
    }
    selects.push({name,options});
  }
  return selects;
}

function normalizeJapaneseOrgName(v){
  return String(v||"")
    .replace(/\s+/g,"")
    .replace(/スキー連盟|県スキー連盟|都スキー連盟|道スキー連盟|府スキー連盟/g,"")
    .replace(/[都道府県]$/,"")
    .trim();
}

function findSelectValue(selects, wantedText, preferredNames=[]){
  const wanted=normalizeJapaneseOrgName(wantedText);
  const scored=[];
  for(const s of selects){
    for(const o of s.options){
      const txt=normalizeJapaneseOrgName(o.text);
      if(!txt) continue;
      let score=0;
      if(txt===wanted) score+=100;
      else if(txt.includes(wanted)||wanted.includes(txt)) score+=50;
      if(preferredNames.some(p=>s.name.toLowerCase().includes(p))) score+=20;
      if(score) scored.push({score,name:s.name,value:o.value,text:o.text});
    }
  }
  scored.sort((a,b)=>b.score-a.score);
  return scored[0]||null;
}


function findLatestPointListValue(selects){
  const candidates=[];
  for(const s of selects||[]){
    const name=String(s.name||"");
    const looksLikeList=/list|point|number|no/i.test(name);
    for(const o of s.options||[]){
      const raw=`${o.text||""} ${o.value||""}`.trim();
      if(!raw)continue;
      const nums=[...raw.matchAll(/\d+/g)].map(m=>Number(m[0])).filter(Number.isFinite);
      if(!nums.length)continue;
      const n=Math.max(...nums);
      let score=n;
      if(looksLikeList)score+=10000;
      if(/リスト|LIST|POINT/i.test(String(o.text||"")))score+=5000;
      candidates.push({score,n,name:s.name,value:o.value,text:o.text});
    }
  }
  candidates.sort((a,b)=>b.score-a.score || b.n-a.n);
  return candidates[0]||null;
}

function findSexSelectValue(selects, sex){
  const labels=sex==="男" ? ["男","MAN","MEN","MALE"] : ["女","WOMAN","WOMEN","FEMALE"];
  const scored=[];
  for(const s of selects){
    for(const o of s.options){
      const t=String(o.text||"").trim().toUpperCase();
      let score=0;
      if(labels.some(x=>t===x)) score+=100;
      else if(labels.some(x=>t.includes(x))) score+=50;
      if(/sex|gender/i.test(s.name)) score+=20;
      if(score) scored.push({score,name:s.name,value:o.value,text:o.text});
    }
  }
  scored.sort((a,b)=>b.score-a.score);
  return scored[0]||null;
}

function parsePointRows(html, expectedOrg=""){
  const rows=[];
  const source=String(html||"");
  const trs=source.match(/<tr\b[\s\S]*?<\/tr>/gi)||[];
  const expected=normalizeJapaneseOrgName(expectedOrg);

  // Determine column indexes from the actual SAJ table header instead of
  // assuming fixed positions. Current public header contains:
  // Rank / SAJ競技者番号 / 氏名 / Birth / 加盟団体 / チーム名 / G /
  // SAJ_DH / SAJ_SC / SAJ_SG / SAJ_GS / SAJ_SL
  let headerMap=null;
  for(const tr of trs){
    const hs=[...tr.matchAll(/<th\b[^>]*>([\s\S]*?)<\/th>/gi)].map(m=>strip(m[1]));
    if(!hs.length)continue;
    const norm=hs.map(v=>String(v||"").replace(/\s+/g,"").toUpperCase());
    const sajIdx=norm.findIndex(v=>v.includes("SAJ競技者番号")||v==="SAJNO"||v.includes("SAJNUMBER"));
    if(sajIdx<0)continue;
    const find=(...keys)=>norm.findIndex(v=>keys.some(k=>v.includes(k)));
    headerMap={
      rank:find("RANK","順位"),
      saj:sajIdx,
      name:find("氏名","NAME"),
      birth:find("BIRTH","生年"),
      organization:find("加盟団体","所属加盟団体","ORGANIZATION"),
      team:find("チーム名","TEAM"),
      group:find("G"),
      dh:find("SAJ_DH"),
      sc:find("SAJ_SC"),
      sg:find("SAJ_SG"),
      gs:find("SAJ_GS"),
      sl:find("SAJ_SL")
    };
    break;
  }

  const val=(cells,idx,fallback)=>idx!=null&&idx>=0 ? (cells[idx]||"") : (cells[fallback]||"");

  for(const tr of trs){
    const cells=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m=>strip(m[1]));
    if(cells.length<8) continue;

    const saj=String(val(cells,headerMap?.saj,1)||"").replace(/\D/g,"");
    if(!/^\d{7,9}$/.test(saj)) continue;

    const organization=val(cells,headerMap?.organization,4)||"";
    if(expected && normalizeJapaneseOrgName(organization)!==expected) continue;

    rows.push({
      rank:val(cells,headerMap?.rank,0)||"",
      saj,
      name:val(cells,headerMap?.name,2)||"",
      birth:val(cells,headerMap?.birth,3)||"",
      organization,
      team:val(cells,headerMap?.team,5)||"",
      group:val(cells,headerMap?.group,6)||"",
      dh:numOrNull(val(cells,headerMap?.dh,7)),
      sc:numOrNull(val(cells,headerMap?.sc,8)),
      sg:numOrNull(val(cells,headerMap?.sg,9)),
      gs:numOrNull(val(cells,headerMap?.gs,10)),
      sl:numOrNull(val(cells,headerMap?.sl,11))
    });
  }
  return rows;
}

function extractSelectedPointListNumber(html){
  const selects=parseSelectOptions(html);
  for(const s of selects){
    if(!/list|point/i.test(s.name)) continue;
    const sm=String(html||"").match(new RegExp(`<select\\b[^>]*name=["']${s.name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}["'][^>]*>([\\s\\S]*?)<\\/select>`,"i"));
    if(!sm) continue;
    const selected=sm[1].match(/<option\b[^>]*value=["']([^"']*)["'][^>]*selected[^>]*>([\s\S]*?)<\/option>/i) ||
                   sm[1].match(/<option\b[^>]*selected[^>]*value=["']([^"']*)["'][^>]*>([\s\S]*?)<\/option>/i);
    if(selected){
      const n=Number(String(strip(selected[2])||selected[1]).match(/\d+/)?.[0]);
      if(Number.isFinite(n)) return n;
    }
  }
  return null;
}


function parseBirthDateLoose(v){
  const t=String(v||"").trim();
  let m=t.match(/(\d{4})[\/年.\-](\d{1,2})[\/月.\-](\d{1,2})/);
  if(m)return {y:Number(m[1]),m:Number(m[2]),d:Number(m[3])};
  m=t.match(/^(\d{4})(\d{2})(\d{2})$/);
  if(m)return {y:Number(m[1]),m:Number(m[2]),d:Number(m[3])};
  m=t.match(/\b(\d{4})\b/);
  return m?{y:Number(m[1]),m:7,d:1}:null;
}
function birthOrdinal(b){
  if(!b)return null;
  return b.y*10000+b.m*100+b.d;
}
function isK2BirthForSeason(birth, season){
  const b=parseBirthDateLoose(birth);
  if(!b)return false;
  const schoolYear=Number(season)-1;
  // User-facing definition:
  // K2 = all junior-high students + first-year high-school students born Jan 1-Apr 1.
  // Example 2025/26: 2010-01-01 through 2013-04-01.
  const from=(schoolYear-15)*10000+101;
  const to=(schoolYear-12)*10000+401;
  const n=birthOrdinal(b);
  return n>=from && n<=to;
}
function findDisciplineSelectValue(selects, discipline){
  const aliases={
    SL:["SL","回転","SLALOM"],
    GS:["GS","大回転","GIANT SLALOM"],
    SG:["SG","スーパー大回転","SUPER-G","SUPER G"]
  }[discipline]||[discipline];
  const candidates=[];
  for(const sel of selects){
    for(const opt of sel.options){
      const text=String(opt.text||"").trim().toUpperCase();
      let score=0;
      if(aliases.some(a=>text===String(a).toUpperCase())) score+=100;
      else if(aliases.some(a=>text.includes(String(a).toUpperCase()))) score+=60;
      if(/event|discipline|competition|kyogi|sports/i.test(sel.name)) score+=20;
      if(score)candidates.push({score,name:sel.name,value:opt.value,text:opt.text});
    }
  }
  candidates.sort((a,b)=>b.score-a.score);
  return candidates[0]||null;
}
function findBirthYearSelects(selects){
  return selects.filter(sel=>{
    const years=sel.options.map(o=>Number(String(o.text||o.value).match(/\b(19|20)\d{2}\b/)?.[0])).filter(Number.isFinite);
    return years.length>=5 && (/birth|born|year|seinen/i.test(sel.name)||years.length>=10);
  }).slice(0,2);
}
function optionValueForYear(sel, year){
  if(!sel)return null;
  const y=String(year);
  return sel.options.find(o=>String(o.text||"").includes(y)||String(o.value||"")===y)||null;
}
function rankingPointValue(row, discipline){
  const key=String(discipline||"").toLowerCase();
  const raw=row?.[key];
  if(raw===null || raw===undefined) return null;
  const text=String(raw).trim();
  if(!text || text==="-" || text==="―" || text==="—") return null;
  const n=Number(text);
  return Number.isFinite(n)?n:null;
}
function assignRankingPositions(rows, discipline){
  const sorted=[...rows].sort((a,b)=>{
    const ap=rankingPointValue(a,discipline), bp=rankingPointValue(b,discipline);
    if(ap===null&&bp===null)return 0;
    if(ap===null)return 1;
    if(bp===null)return -1;
    if(ap!==bp)return ap-bp;
    return String(a.name||"").localeCompare(String(b.name||""),"ja");
  }).filter(r=>rankingPointValue(r,discipline)!==null);

  let prev=null, prevRank=0;
  return sorted.slice(0,30).map((r,i)=>{
    const p=rankingPointValue(r,discipline);
    const rank=(prev!==null && p===prev)?prevRank:(i+1);
    prev=p; prevRank=rank;
    return {
      rank,
      saj:r.saj||"",
      name:r.name||"",
      birth:r.birth||"",
      organization:r.organization||"",
      team:r.team||"",
      point:p
    };
  });
}

function mergePointRowsBySaj(rows){
  const map=new Map();
  for(const r of rows||[]){
    const saj=String(r?.saj||"");
    if(!saj)continue;
    const old=map.get(saj);
    if(!old){
      map.set(saj,r);
      continue;
    }
    // Keep the row carrying the most point values.
    const count=x=>["dh","sc","sg","gs","sl"].reduce((n,k)=>{
      const v=x?.[k];
      return n+(v!==null && v!==undefined && String(v).trim()!=="" && Number.isFinite(Number(v))?1:0);
    },0);
    if(count(r)>count(old))map.set(saj,r);
  }
  return [...map.values()];
}
function extractPointPaginationUrls(html, baseUrl){
  const urls=[];
  const seen=new Set();
  for(const m of String(html||"").matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)){
    let u;
    try{u=new URL(decodeHtml(m[1]),baseUrl);}catch{continue;}
    const low=u.toString().toLowerCase();
    const hasPage=[...u.searchParams.keys()].some(k=>/^(page|p|page_no|pageno|page_num|page_number)$/i.test(k));
    if(!hasPage && !/[?&](page|p|page_no|pageno|page_num|page_number)=\d+/i.test(low))continue;
    if(u.origin!==SAJ_ORIGIN)continue;
    const key=u.toString();
    if(seen.has(key))continue;
    seen.add(key);
    urls.push(key);
    if(urls.length>=60)break;
  }
  return urls;
}
async function fetchAllNationalPointRowsForSeasonUncached({season,sex,listNumber=null}){
  const baseUrl=new URL(`${SAJ_ORIGIN}/alpine/point/list`);
  baseUrl.searchParams.set("season_code",String(season));
  baseUrl.searchParams.set("sports_code","AL");
  baseUrl.searchParams.set("saj_fis","SAJ");

  // Read the live form and apply only the sex filter.
  // No organization, birth year or discipline restriction is applied:
  // this endpoint intentionally collects the national point-list dataset.
  const formHtml=await getText(baseUrl.toString());
  const selects=parseSelectOptions(formHtml);
  const sexOpt=findSexSelectValue(selects,sex);
  let listOpt=findLatestPointListValue(selects);
  if(listNumber!=null){
    for(const sel of selects||[]){
      const opt=(sel.options||[]).find(o=>new RegExp(`(?:^|\\D)${Number(listNumber)}(?:\\D|$)`).test(`${o.text||""} ${o.value||""}`));
      if(opt){listOpt={name:sel.name,value:opt.value,text:opt.text,n:Number(listNumber)};break;}
    }
  }

  const u=new URL(baseUrl);
  if(sexOpt)u.searchParams.set(sexOpt.name,sexOpt.value);
  else u.searchParams.set("sex",sex==="男"?"1":"2");

  // SAJ point-list search requires a list number. Without this parameter,
  // rows may be returned without the actual SAJ race points or no valid list at all.
  if(listOpt)u.searchParams.set(listOpt.name,listOpt.value);

  const variants=[u];
  for(const [k,v] of [["search","1"],["submit","1"],["action","search"]]){
    const x=new URL(u); x.searchParams.set(k,v); variants.push(x);
  }

  let bestHtml="", bestUrl=u.toString(), bestRows=[];
  for(const candidate of variants){
    try{
      const html=await getText(candidate.toString());
      const rows=parsePointRows(html,"");
      if(rows.length>bestRows.length){
        bestRows=rows;
        bestHtml=html;
        bestUrl=candidate.toString();
      }
    }catch{}
  }

  // If the point list is paginated, collect every discoverable page.
  let allRows=[...bestRows];
  const pageUrls=extractPointPaginationUrls(bestHtml,bestUrl);
  if(pageUrls.length){
    const chunks=[];
    for(let i=0;i<pageUrls.length;i+=6){
      const batch=pageUrls.slice(i,i+6);
      const got=await Promise.all(batch.map(async pageUrl=>{
        try{
          const h=await getText(pageUrl);
          return parsePointRows(h,"");
        }catch{return [];}
      }));
      chunks.push(...got);
    }
    for(const rows of chunks)allRows.push(...rows);
  }

  allRows=mergePointRowsBySaj(allRows);
  return {
    rows:allRows,
    pointListNumber:extractSelectedPointListNumber(bestHtml||formHtml) ?? (listOpt?.n ?? null),
    source:bestUrl,
    pageCount:1+pageUrls.length
  };
}

async function fetchAllNationalPointRowsForSeason({season,sex}){
  // Fresh cache: no request to SAJ.
  const fresh=await readRankingDatasetCache(season,sex);
  if(fresh?.rows?.length){
    return {
      ...fresh,
      cacheStatus:"HIT",
      cacheTtlSeconds:SAJ_RANKING_CACHE_SECONDS
    };
  }

  // Cache miss/expiry: acquire once from SAJ and cache the full national dataset.
  try{
    const live=await fetchAllNationalPointRowsForSeasonUncached({season,sex});
    if(live?.rows?.length){
      await writeRankingDatasetCache(season,sex,live);
      return {
        ...live,
        cacheStatus:"MISS",
        cacheAgeSeconds:0,
        cacheTtlSeconds:SAJ_RANKING_CACHE_SECONDS
      };
    }
    return live;
  }catch(err){
    // SAJ temporary failure/block: allow up to 24h-old cached data.
    const stale=await readRankingDatasetCache(season,sex,{allowStale:true});
    if(stale?.rows?.length){
      return {
        ...stale,
        cacheStatus:"STALE",
        cacheTtlSeconds:SAJ_RANKING_CACHE_SECONDS
      };
    }
    throw err;
  }
}

async function lookupNationalPointRanking({sex,category,discipline}){
  let lastError=null;
  for(const season of getTargetSeasons()){
    try{
      const fetched=await fetchAllNationalPointRowsForSeason({season,sex});
      if(!fetched.rows.length)continue;

      // Category is derived after the full national dataset is obtained.
      const filtered=fetched.rows.filter(r=>{
        const k2=isK2BirthForSeason(r.birth,season);
        return category==="k2"?k2:!k2;
      });
      const ranking=assignRankingPositions(filtered,discipline);
      if(ranking.length){
        return {
          season,
          seasonLabel:`${season-1}/${season}`,
          pointListNumber:fetched.pointListNumber,
          sex,
          category,
          discipline,
          ranking,
          totalRows:fetched.rows.length,
          categoryRows:filtered.length,
          source:fetched.source,
          sourcePages:fetched.pageCount,
          cacheStatus:fetched.cacheStatus||"MISS",
          cacheAgeSeconds:Number(fetched.cacheAgeSeconds)||0,
          cacheTtlSeconds:Number(fetched.cacheTtlSeconds)||SAJ_RANKING_CACHE_SECONDS,
          k2Definition:"中学生＋高校1年早生まれ"
        };
      }
    }catch(e){lastError=e;}
  }
  if(lastError)throw lastError;
  return {
    season:null,seasonLabel:"",pointListNumber:null,sex,category,discipline,
    ranking:[],totalRows:0,categoryRows:0,source:"",sourcePages:0,
    cacheStatus:"MISS",cacheAgeSeconds:0,cacheTtlSeconds:SAJ_RANKING_CACHE_SECONDS,
    k2Definition:"中学生＋高校1年早生まれ"
  };
}

async function lookupOfficialPoints(saj){
  const target=String(saj||"").replace(/\D/g,"").padStart(8,"0");
  for(const season of getTargetSeasons()){
    try{
      const cal=await getLatestPointCalendarMeta(season);
      const listNumber=cal?.latestListNumber??null;
      for(const sex of ["男","女"]){
        try{
          const dataset=await fetchAllNationalPointRowsForSeason({season,sex});
          const athlete=(dataset.rows||[]).find(r=>String(r.saj||"").padStart(8,"0")===target);
          if(athlete){
            return {...athlete,seasonCode:season,seasonLabel:`${season-1}/${season}`,pointListNumber:listNumber,source:dataset.source};
          }
        }catch{}
      }

      // Compatibility fallback: query SAJ's point-list page directly using the latest list number.
      const base=new URL(`${SAJ_ORIGIN}/alpine/point/list`);
      base.searchParams.set("season_code",String(season));
      base.searchParams.set("sports_code","AL");
      base.searchParams.set("saj_fis","SAJ");
      const formHtml=await getText(base.toString());
      const selects=parseSelectOptions(formHtml);
      let listOpt=null;
      for(const sel of selects||[]){
        const opt=(sel.options||[]).find(o=>new RegExp(`(?:^|\\D)${Number(listNumber)}(?:\\D|$)`).test(`${o.text||""} ${o.value||""}`));
        if(opt){listOpt={name:sel.name,value:opt.value};break;}
      }
      for(const sexValue of ["1","2"]){
        const u=new URL(base);
        u.searchParams.set("search_saj_number",target);
        u.searchParams.set("sex",sexValue);
        if(listOpt)u.searchParams.set(listOpt.name,listOpt.value);
        for(const [k,v] of [["search","1"],["submit","1"],["action","search"]]){
          const x=new URL(u);x.searchParams.set(k,v);
          try{
            const h=await getText(x.toString());
            const athlete=parsePointRow(h,target,x.toString());
            if(athlete)return {...athlete,seasonCode:season,seasonLabel:`${season-1}/${season}`,pointListNumber:listNumber};
          }catch{}
        }
      }
    }catch{}
  }
  return null;
}


function normalizeDateYmd(y,m,d){
  return `${y}-${String(m).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
}

function parseCompetitionDate(text, season){
  const t=String(text||"").replace(/\s+/g," ");
  let m=t.match(/(\d{4})[\/年.-](\d{1,2})[\/月.-](\d{1,2})/);
  if(m){
    const start=normalizeDateYmd(Number(m[1]),Number(m[2]),Number(m[3]));
    const tail=t.slice(m.index+m[0].length);
    let e=tail.match(/(?:\s*[〜~\-–—]\s*)(?:(\d{4})[\/年.-])?(\d{1,2})[\/月.-](\d{1,2})/);
    if(e){
      const ey=Number(e[1]||m[1]);
      return {start,end:normalizeDateYmd(ey,Number(e[2]),Number(e[3]))};
    }
    return {start,end:start};
  }
  m=t.match(/(\d{1,2})[\/月.-](\d{1,2})\s*[〜~\-–—]\s*(\d{1,2})[\/月.-](\d{1,2})/);
  if(m){
    const sy=Number(m[1])>=7 ? season-1 : season;
    const ey=Number(m[3])>=7 ? season-1 : season;
    return {
      start:normalizeDateYmd(sy,Number(m[1]),Number(m[2])),
      end:normalizeDateYmd(ey,Number(m[3]),Number(m[4]))
    };
  }
  m=t.match(/(\d{1,2})[\/月.-](\d{1,2})/);
  if(m){
    const y=Number(m[1])>=7 ? season-1 : season;
    const d=normalizeDateYmd(y,Number(m[1]),Number(m[2]));
    return {start:d,end:d};
  }
  return {start:"",end:""};
}

function competitionDiscs(text){
  const found=[];
  const upper=String(text||"").toUpperCase();
  for(const d of ["DH","SG","GS","SL","AC"]){
    if(new RegExp(`(^|[^A-Z])${d}([^A-Z]|$)`).test(upper)) found.push(d);
  }
  return [...new Set(found)].join(" / ");
}

function decodeAttr(s){
  return decodeHtml(String(s||"").replace(/&#39;/g,"'").replace(/&quot;/g,'"'));
}

function extractFormInfo(html){
  const forms=[...String(html||"").matchAll(/<form\b([^>]*)>([\s\S]*?)<\/form>/gi)];
  let chosen=null;

  // Prefer the exact competition calendar search form.
  // The SAJ page also contains athlete/news search forms, so a broad
  // "シーズン" match can pick the wrong form.
  for(const m of forms){
    const attrs=m[1]||"";
    const body=m[2]||"";
    const names=[...body.matchAll(/\bname=["']([^"']+)["']/gi)].map(x=>x[1]);
    const hasCompetitionFields=
      names.includes("search_season_code") &&
      names.includes("search_month") &&
      names.includes("search_sports_code") &&
      names.includes("search_prefecture");
    if(hasCompetitionFields){
      chosen={attrs,body};
      break;
    }
  }

  if(!chosen){
    for(const m of forms){
      const attrs=m[1]||"";
      const body=m[2]||"";
      const text=strip(body);
      if(/シーズン/i.test(text) && /月/i.test(text) && /競技/i.test(text) && /開催地/i.test(text)){
        chosen={attrs,body};
        break;
      }
    }
  }

  if(!chosen) return null;

  const method=(chosen.attrs.match(/\bmethod=["']?([^"' >]+)/i)?.[1]||"GET").toUpperCase();
  const action=decodeAttr(chosen.attrs.match(/\baction=["']([^"']*)["']/i)?.[1]||"/search_competitions");

  const fields={};
  const inputs=[...chosen.body.matchAll(/<input\b([^>]*)>/gi)];
  for(const im of inputs){
    const a=im[1]||"";
    const name=decodeAttr(a.match(/\bname=["']([^"']+)["']/i)?.[1]||"");
    if(!name)continue;
    const type=(a.match(/\btype=["']?([^"' >]+)/i)?.[1]||"text").toLowerCase();
    if(["submit","button","file","reset"].includes(type))continue;
    const value=decodeAttr(a.match(/\bvalue=["']([^"']*)["']/i)?.[1]||"");
    fields[name]=value;
  }

  const selects=[];
  const selectMatches=[...chosen.body.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi)];
  for(const sm of selectMatches){
    const attrs=sm[1]||"";
    const body=sm[2]||"";
    const name=decodeAttr(attrs.match(/\bname=["']([^"']+)["']/i)?.[1]||"");
    if(!name)continue;
    const options=[];
    for(const om of body.matchAll(/<option\b([^>]*)>([\s\S]*?)<\/option>/gi)){
      const oa=om[1]||"";
      const label=strip(om[2]);
      const hasValue=/\bvalue=["'][^"']*["']/i.test(oa);
      const value=hasValue
        ? decodeAttr(oa.match(/\bvalue=["']([^"']*)["']/i)?.[1]||"")
        : label;
      const selected=/\bselected\b/i.test(oa);
      options.push({value,label,selected,hasValue});
      if(selected) fields[name]=value;
    }
    if(fields[name]===undefined && options.length) fields[name]=options[0].value;
    selects.push({name,options});
  }

  return {method,action,fields,selects};
}

function clearNationwidePrefecture(formInfo){
  const prefSel=formInfo.selects.find(s=>s.name==="search_prefecture" || /prefecture|開催地/i.test(s.name));
  if(!prefSel) return;

  // "すべて" is a UI label. Sending that literal string was producing
  // no results. Nationwide search should leave the prefecture unset.
  const all=prefSel.options.find(o=>/^(すべて|全て|ALL)$/i.test(String(o.label||"").trim()));
  if(all){
    formInfo.fields[prefSel.name]="";
  }else{
    delete formInfo.fields[prefSel.name];
  }
}


const JAPAN_PREFECTURES=[
  "北海道","青森県","岩手県","宮城県","秋田県","山形県","福島県",
  "茨城県","栃木県","群馬県","埼玉県","千葉県","東京都","神奈川県",
  "新潟県","富山県","石川県","福井県","山梨県","長野県",
  "岐阜県","静岡県","愛知県","三重県","滋賀県","京都府","大阪府",
  "兵庫県","奈良県","和歌山県","鳥取県","島根県","岡山県","広島県",
  "山口県","徳島県","香川県","愛媛県","高知県","福岡県","佐賀県",
  "長崎県","熊本県","大分県","宮崎県","鹿児島県","沖縄県"
];

function findPrefectureSelect(formInfo){
  const sel=formInfo.selects.find(s=>s.name==="search_prefecture")
    || formInfo.selects.find(s=>/prefecture|開催地/i.test(s.name));
  if(!sel)return null;
  const options=sel.options.filter(o=>JAPAN_PREFECTURES.includes(String(o.label||"").trim()));
  return {select:sel,options};
}

function findMonthSelect(formInfo){
  // Detect the select that contains visible labels such as 1月, 2月...
  for(const sel of formInfo.selects){
    const monthOpts=sel.options.filter(o=>/^(?:[1-9]|1[0-2])月$/.test(String(o.label||"").trim()));
    if(monthOpts.length>=6){
      return {select:sel,options:monthOpts};
    }
  }
  // Fallback by field name
  const sel=formInfo.selects.find(s=>/month|月/i.test(s.name));
  if(!sel)return null;
  return {
    select:sel,
    options:sel.options.filter(o=>String(o.value||"").trim()!=="" && !/選択|select/i.test(String(o.label||"")))
  };
}

function chooseAlpineField(formInfo){
  // SAJ competition search requires the sport/competition to be selected.
  // Do not assume the option value; select the option whose visible label is アルペン/Alpine.
  for(const sel of formInfo.selects){
    const opt=sel.options.find(o => /アルペン|ALPINE/i.test(String(o.label||"")));
    if(opt){
      formInfo.fields[sel.name]=opt.value;
      return {name:sel.name,value:opt.value,label:opt.label};
    }
  }
  return null;
}

function chooseSeasonField(formInfo, season){
  const label1=`${season-1}/${season}`;
  const label2=String(season);

  for(const sel of formInfo.selects){
    const opt=sel.options.find(o =>
      String(o.label).includes(label1) ||
      String(o.value)===label2 ||
      String(o.label).trim()===label2
    );
    if(opt){
      formInfo.fields[sel.name]=opt.value;
      return {name:sel.name,value:opt.value,label:opt.label};
    }
  }

  // fallback: any select whose name looks season-like
  const seasonSel=formInfo.selects.find(s=>/season|年度|シーズン/i.test(s.name));
  if(seasonSel){
    const opt=seasonSel.options.find(o=>String(o.value).includes(String(season))) || seasonSel.options[0];
    if(opt){
      formInfo.fields[seasonSel.name]=opt.value;
      return {name:seasonSel.name,value:opt.value,label:opt.label};
    }
  }
  return null;
}

function mergeSetCookiesIntoJar(setCookieHeader, jar){
  if(!setCookieHeader)return jar;

  // Set-Cookie may contain commas inside Expires. Split only where a new
  // cookie name=value token begins.
  const parts=String(setCookieHeader).split(/,(?=\s*[^;,=\s]+=[^;,]*)/g);
  for(const part of parts){
    const first=part.split(";")[0].trim();
    const eq=first.indexOf("=");
    if(eq<=0)continue;
    const name=first.slice(0,eq).trim();
    const value=first.slice(eq+1).trim();
    if(name) jar.set(name,value);
  }
  return jar;
}

function cookieJarHeader(jar){
  return [...jar.entries()].map(([k,v])=>`${k}=${v}`).join("; ");
}

async function fetchFollowingSajSession(url, init, maxRedirects=5){
  const jar=new Map();
  let currentUrl=url;
  let currentInit={...init};

  for(let i=0;i<=maxRedirects;i++){
    const headers=new Headers(currentInit.headers||{});
    const cookie=cookieJarHeader(jar);
    if(cookie)headers.set("Cookie",cookie);

    const r=await fetch(currentUrl,{
      ...currentInit,
      headers,
      redirect:"manual"
    });

    // Preserve SAJ session cookies across the redirect chain.
    // Workers fetch() does not provide a browser cookie jar.
    const setCookie=r.headers.get("set-cookie");
    mergeSetCookiesIntoJar(setCookie,jar);

    if([301,302,303,307,308].includes(r.status)){
      const location=r.headers.get("location");
      if(!location)throw new Error(`SAJ redirect ${r.status} without Location`);

      currentUrl=new URL(location,currentUrl).toString();

      // Browser semantics: 301/302/303 after a form request become GET.
      if([301,302,303].includes(r.status)){
        currentInit={method:"GET",headers:{
          "User-Agent":"AlpineTeamManager/0.13.46 (+public SAJ competition calendar lookup)",
          "Accept":"text/html,application/xhtml+xml"
        }};
      }
      continue;
    }

    if(!r.ok)throw new Error(`SAJ calendar HTTP ${r.status}`);

    return {
      html:await r.text(),
      url:r.url||currentUrl,
      redirectCount:i,
      sessionCookieCount:jar.size
    };
  }

  throw new Error("SAJ calendar redirect loop");
}

async function submitCalendarForm(formInfo){
  const target=new URL(formInfo.action,SAJ_ORIGIN);
  const headers={
    "User-Agent":"AlpineTeamManager/0.13.46 (+public SAJ competition calendar lookup)",
    "Accept":"text/html,application/xhtml+xml"
  };

  let init;
  if(formInfo.method==="POST"){
    const body=new URLSearchParams(formInfo.fields);
    headers["Content-Type"]="application/x-www-form-urlencoded";
    init={method:"POST",headers,body:body.toString()};
  }else{
    for(const [k,v] of Object.entries(formInfo.fields)){
      // Preserve empty-string fields such as search_discipline="".
      if(v!==undefined && v!==null)target.searchParams.set(k,String(v));
    }
    init={method:"GET",headers};
  }

  return await fetchFollowingSajSession(target.toString(),init);
}

function parseCompetitionCalendarHtml(html, season){
  const source=String(html||"");
  const rows=source.match(/<tr\b[\s\S]*?<\/tr>/gi)||[];
  const map=new Map();

  // Accept BOTH:
  // /alpine/2026/competition/3990
  // /alpine/competition/108
  const extractCompetitionLink=(fragment)=>{
    const patterns=[
      /href=["']([^"']*\/alpine\/(\d{4})\/competition\/(\d+)[^"']*)["']/i,
      /href=["']([^"']*\/alpine\/competition\/(\d+)[^"']*)["']/i
    ];
    let m=fragment.match(patterns[0]);
    if(m) return {href:m[1],year:m[2],id:m[3]};
    m=fragment.match(patterns[1]);
    if(m) return {href:m[1],year:String(season),id:m[2]};
    return null;
  };

  for(const tr of rows){
    const link=extractCompetitionLink(tr);
    if(!link) continue;

    const url=new URL(decodeHtml(link.href),SAJ_ORIGIN).toString();
    const key=`${season}:${link.id}`;
    const cells=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m=>strip(m[1]));
    const full=strip(tr);

    const aTexts=[...tr.matchAll(/<a\b[^>]*href=["'][^"']*\/alpine\/(?:\d{4}\/)?competition\/\d+[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .map(m=>strip(m[1])).filter(Boolean);
    let title=aTexts.sort((a,b)=>b.length-a.length)[0]||"";

    // Some calendar rows wrap the detail link around an icon/button and keep
    // the title as plain text. Select the most title-like table cell.
    if(!title){
      title=cells
        .filter(c=>c && c.length>=5)
        .filter(c=>!/\d{4}[\/年]\d{1,2}/.test(c))
        .filter(c=>!/^(SAJ|FIS|MAN|WOMAN|GS|SL|SG|DH|AC|PDF)$/i.test(c))
        .sort((a,b)=>b.length-a.length)[0]||"";
    }

    const dates=parseCompetitionDate(full,season);

    let place="";
    const prefPlace=cells.find(c=>/(北海道|青森県|岩手県|宮城県|秋田県|山形県|福島県|茨城県|栃木県|群馬県|埼玉県|千葉県|東京都|神奈川県|新潟県|富山県|石川県|福井県|山梨県|長野県|岐阜県|静岡県|愛知県|三重県|滋賀県|京都府|大阪府|兵庫県|奈良県|和歌山県|鳥取県|島根県|岡山県|広島県|山口県|徳島県|香川県|愛媛県|高知県|福岡県|佐賀県|長崎県|熊本県|大分県|宮崎県|鹿児島県|沖縄県)/.test(c));
    if(prefPlace) place=prefPlace;

    map.set(key,{
      key,
      season:`${season-1}/${season}`,
      title:title||"SAJ公認大会",
      start:dates.start,
      end:dates.end,
      place:place.replace(/\s+/g," ").trim(),
      disc:competitionDiscs(full),
      url
    });
  }

  // Fallback: detail links may not be inside <tr>.
  if(!map.size){
    const re=/<a\b[^>]*href=["']([^"']*\/alpine\/(?:(\d{4})\/)?competition\/(\d+)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let m;
    while((m=re.exec(source))){
      const href=m[1];
      const id=m[3];
      const title=strip(m[4]);
      if(!id) continue;
      const key=`${season}:${id}`;
      map.set(key,{
        key,
        season:`${season-1}/${season}`,
        title:title||"SAJ公認大会",
        start:"",
        end:"",
        place:"",
        disc:"",
        url:new URL(decodeHtml(href),SAJ_ORIGIN).toString()
      });
    }
  }

  return [...map.values()].sort((a,b)=>(a.start||"9999").localeCompare(b.start||"9999") || a.title.localeCompare(b.title,"ja"));
}

function competitionCalendarDiagnostics(html){
  const s=String(html||"");
  const visible=strip(s);
  const links=[...s.matchAll(/href=["']([^"']*\/alpine\/(?:\d{4}\/)?competition\/\d+[^"']*)["']/gi)]
    .map(m=>decodeHtml(m[1])).slice(0,10);
  return {
    htmlLength:s.length,
    hasNoSchedule:/競技スケジュール・結果はありません/.test(visible),
    hasCompetitionText:/大会名|競技日|CODEX/.test(visible),
    competitionLinkCount:links.length,
    sampleCompetitionLinks:links,
    visibleExcerpt:visible.slice(0,1200)
  };
}

async function lookupCompetitions(season, requestedMonth=0, requestedBatch=0){
  const calendarUrl=`${SAJ_ORIGIN}/alpine/competition/calendar`;
  const baseHtml=await getText(calendarUrl);
  const baseForm=extractFormInfo(baseHtml);
  if(!baseForm) throw new Error("SAJ大会カレンダーの検索フォームを解析できません");

  const seasonChoice=chooseSeasonField(baseForm,season);
  if(!seasonChoice) throw new Error(`シーズン ${season-1}/${season} の選択肢を見つけられません`);

  const alpineChoice=chooseAlpineField(baseForm);
  if(!alpineChoice) throw new Error("競技『アルペン』の選択肢を見つけられません");

  const monthInfo=findMonthSelect(baseForm);
  if(!monthInfo || !monthInfo.options.length){
    throw new Error("開催月の選択肢を見つけられません");
  }

  const prefInfo=findPrefectureSelect(baseForm);
  if(!prefInfo || prefInfo.options.length!==47){
    throw new Error(`開催地の都道府県選択肢を正しく取得できません (${prefInfo?.options?.length||0}/47)`);
  }

  const months=requestedMonth
    ? monthInfo.options.filter(o=>Number(o.value)===requestedMonth || Number(String(o.label).replace(/\D/g,""))===requestedMonth)
    : [];

  if(!months.length){
    if(requestedMonth) throw new Error(`${requestedMonth}月の選択肢を見つけられません`);
    throw new Error("全国取得は month=1〜12 を指定して月ごとに呼び出してください");
  }

  if(!requestedBatch){
    throw new Error("全国取得は batch=1〜3 を指定してください");
  }

  // Workers Free: max 50 external subrequests/invocation.
  // Each prefecture search may consume two subrequests because SAJ redirects
  // /search_competitions -> /alpine/competition/calendar.
  // 16 prefectures => approx. 1(base form) + 32(search+redirect) = 33.
  const batchSize=16;
  const batchStart=(requestedBatch-1)*batchSize;
  const batchPrefs=prefInfo.options.slice(batchStart,batchStart+batchSize);
  if(!batchPrefs.length){
    throw new Error(`batch=${requestedBatch} に対象都道府県がありません`);
  }

  const merged=new Map();
  const requestDebug=[];

  for(const monthOpt of months){
    for(const prefOpt of batchPrefs){
      const info=JSON.parse(JSON.stringify(baseForm));
      chooseSeasonField(info,season);
      chooseAlpineField(info);

      const monthSelect=findMonthSelect(info);
      const prefSelect=findPrefectureSelect(info);

      // Competition is always Alpine.
      // Do not depend on the page's current/default selection.
      info.fields.search_sports_code="AL";

      info.fields[monthSelect.select.name]=monthOpt.value;
      info.fields[prefSelect.select.name]=prefOpt.value;

      // Discipline is intentionally blank so all Alpine disciplines
      // (GS/SL/SG/DH/SC etc.) can be returned.
      if(info.fields.search_discipline===undefined || info.fields.search_discipline===null){
        info.fields.search_discipline="";
      }

      // SAJ's search route redirects to the calendar URL with the accepted
      // query parameters. The final response URL is therefore expected to be
      // /alpine/competition/calendar?... after a successful redirect.
      info.method="GET";
      info.action="/search_competitions";

      let resultHtml="";
      let requestUrl="";
      let found=[];
      let redirectCount=0;
      let sessionCookieCount=0;
      try{
        const submitted=await submitCalendarForm(info);
        resultHtml=submitted.html;
        requestUrl=submitted.url;
        redirectCount=submitted.redirectCount||0;
        sessionCookieCount=submitted.sessionCookieCount||0;
        found=parseCompetitionCalendarHtml(resultHtml,season);
      }catch(e){
        requestDebug.push({
          month:String(monthOpt.label||requestedMonth),
          prefecture:prefOpt.label,
          ok:false,
          error:String(e?.message||e)
        });
        continue;
      }

      for(const c of found){
        if(!c.place) c.place=String(prefOpt.label||"");
        const key=c.key || c.url || `${c.title}|${c.start}|${c.place}`;
        if(!merged.has(key)) merged.set(key,c);
      }

      const visible=strip(resultHtml);
      const isKnownProbe=(Number(requestedMonth)===2 && String(prefOpt.label)==="山形県");
      if(found.length || /検索項目に問題があります/.test(visible) || isKnownProbe){
        requestDebug.push({
          month:String(monthOpt.label||requestedMonth),
          prefecture:prefOpt.label,
          sportsCode:"AL",
          ok:true,
          count:found.length,
          requestUrl,
          redirectCount,
          sessionCookieCount,
          validation:/検索項目に問題があります/.test(visible),
          noSchedule:/競技スケジュール・結果はありません/.test(visible)
        });
      }

      globalThis.__lastCompetitionHtml=resultHtml;
    }
  }

  globalThis.__lastCompetitionMonthDebug=requestDebug;
  globalThis.__lastCompetitionBatchDebug={
    batch:requestedBatch,
    prefectures:batchPrefs.map(o=>o.label),
    count:batchPrefs.length
  };

  return [...merged.values()].sort((a,b)=>
    (a.start||"9999").localeCompare(b.start||"9999") ||
    a.title.localeCompare(b.title,"ja")
  );
}


function normalizeSajDate(value){
  if(!value)return "";
  const s=String(value).trim();
  const m=s.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
  if(!m)return s;
  return `${m[1]}-${String(m[2]).padStart(2,"0")}-${String(m[3]).padStart(2,"0")}`;
}

function normalizeDisciplines(races){
  const vals=[];
  for(const r of (Array.isArray(races)?races:[])){
    const d=String(r?.discipline||"").trim();
    if(d && !vals.includes(d)) vals.push(d);
  }
  return vals.join(" / ");
}

function mapSajCompetition(c,season){
  const races=Array.isArray(c?.races)?c.races:[];
  const rawUrl=String(c?.url||"").trim();
  const id=String(c?.id ?? "").trim();
  const competitionUrl=rawUrl
    ? new URL(rawUrl,SAJ_ORIGIN).toString()
    : (id ? `${SAJ_ORIGIN}/alpine/${season}/competition/${encodeURIComponent(id)}` : "");

  const pref=String(c?.prefecture||"").trim();
  const city=String(c?.city||"").trim();
  const place=[pref,city].filter(Boolean).join(" ");

  const key=rawUrl || id || [
    c?.name||"",
    c?.start_date||"",
    c?.end_date||"",
    pref,
    city
  ].join("|");

  return {
    key:`saj:${season}:${key}`,
    id:id||null,
    title:String(c?.name||"").trim(),
    titleEn:String(c?.name_en||"").trim(),
    start:normalizeSajDate(c?.start_date),
    end:normalizeSajDate(c?.end_date),
    place,
    prefecture:pref,
    city,
    disc:normalizeDisciplines(races),
    races:races.map(r=>({
      date:normalizeSajDate(r?.start_date),
      category:r?.category ?? null,
      discipline:r?.discipline ?? null,
      sex:r?.sex ?? null,
      codex:r?.codex ?? null,
      status:r?.status ?? null,
      resultUrl:r?.result_url ? new URL(String(r.result_url),SAJ_ORIGIN).toString() : null
    })),
    state:c?.state ?? null,
    note:c?.note ?? null,
    url:competitionUrl,
    source:"SAJ競技データバンク"
  };
}

async function lookupCompetitionsApi(season,month=0){
  const target=new URL("/api/search_competitions",SAJ_ORIGIN);

  // These parameter names come directly from the public competition
  // calendar's loadCompetitions() JavaScript.
  const params={
    sports_code:"AL",
    season_code:String(season),
    category:"",
    discipline:"",
    sex:"",
    prefecture:"",
    from_date:"",
    to_date:"",
    codex:"",
    month:month ? String(month) : ""
  };
  for(const [k,v] of Object.entries(params)) target.searchParams.set(k,v);

  const r=await fetch(target.toString(),{
    method:"GET",
    headers:{
      "User-Agent":"AlpineTeamManager/0.13.46 (+public SAJ competition calendar lookup)",
      "Accept":"application/json,text/javascript,*/*;q=0.8",
      "Referer":`${SAJ_ORIGIN}/alpine/competition/calendar`
    }
  });

  if(!r.ok) throw new Error(`SAJ competition API HTTP ${r.status}`);

  let data;
  try{
    data=await r.json();
  }catch{
    const text=await r.text();
    throw new Error(`SAJ competition API returned non-JSON: ${String(text).slice(0,160)}`);
  }

  const competitions=Array.isArray(data?.competitions)?data.competitions:[];
  return competitions
    .map(c=>mapSajCompetition(c,season))
    .filter(c=>c.title)
    .sort((a,b)=>
      (a.start||"9999").localeCompare(b.start||"9999") ||
      a.title.localeCompare(b.title,"ja")
    );
}

async function debugCompetitionApi(season=2026,month=2){
  const target=new URL("/api/search_competitions",SAJ_ORIGIN);
  const params={
    sports_code:"AL",
    season_code:String(season),
    category:"",
    discipline:"",
    sex:"",
    prefecture:"",
    from_date:"",
    to_date:"",
    codex:"",
    month:String(month)
  };
  for(const [k,v] of Object.entries(params)) target.searchParams.set(k,v);

  const r=await fetch(target.toString(),{
    method:"GET",
    headers:{
      "User-Agent":"AlpineTeamManager/0.13.46 (+public SAJ competition calendar lookup)",
      "Accept":"application/json,text/javascript,*/*;q=0.8",
      "Referer":`${SAJ_ORIGIN}/alpine/competition/calendar`
    }
  });

  const text=await r.text();
  let parsed=null;
  try{ parsed=JSON.parse(text); }catch{}

  return {
    requestUrl:target.toString(),
    status:r.status,
    contentType:r.headers.get("content-type"),
    json:!!parsed,
    competitionCount:Array.isArray(parsed?.competitions)?parsed.competitions.length:null,
    searchCondition:parsed?.search_condition||null,
    sample:Array.isArray(parsed?.competitions)
      ? parsed.competitions.slice(0,2).map(c=>({
          id:c.id,
          name:c.name,
          start_date:c.start_date,
          end_date:c.end_date,
          prefecture:c.prefecture,
          city:c.city,
          url:c.url,
          races:Array.isArray(c.races)?c.races.slice(0,4).map(r=>({
            start_date:r.start_date,
            discipline:r.discipline,
            sex:r.sex,
            codex:r.codex
          })):[]
        }))
      : [],
    excerpt:parsed?null:String(text).slice(0,500)
  };
}

function uniqueStrings(arr){
  return [...new Set(arr.filter(Boolean))];
}

function clipText(s,n=500){
  s=String(s||"").replace(/\s+/g," ").trim();
  return s.length>n ? s.slice(0,n)+"…" : s;
}

async function debugCompetitionJavascript(){
  const calendarUrl=`${SAJ_ORIGIN}/alpine/competition/calendar`;
  const html=await getText(calendarUrl);

  const scripts=[...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
  const scriptSrcs=[];
  const inlineMatches=[];

  for(const m of scripts){
    const attrs=m[1]||"";
    const body=m[2]||"";
    const src=decodeAttr(attrs.match(/\bsrc=["']([^"']+)["']/i)?.[1]||"");
    if(src) scriptSrcs.push(new URL(src,SAJ_ORIGIN).toString());

    if(!body) continue;

    const patterns=[
      /\$\.ajax\s*\(\s*\{[\s\S]{0,1500}?\}\s*\)/gi,
      /\$\.get(?:JSON)?\s*\([\s\S]{0,700}?\)/gi,
      /\$\.post\s*\([\s\S]{0,700}?\)/gi,
      /fetch\s*\([\s\S]{0,700}?\)/gi,
      /url\s*:\s*["'][^"']+["']/gi,
      /["'][^"']*competition[^"']*["']/gi,
      /["'][^"']*calendar[^"']*["']/gi
    ];

    for(const p of patterns){
      for(const x of body.matchAll(p)){
        inlineMatches.push(clipText(x[0],1500));
      }
    }
  }

  const form=extractFormInfo(html);

  return {
    calendarUrl,
    htmlLength:html.length,
    scriptSrcs:uniqueStrings(scriptSrcs),
    networkFragments:uniqueStrings(inlineMatches).slice(0,100),
    formAction:form?.action||null,
    formMethod:form?.method||null,
    fieldNames:form?Object.keys(form.fields):[],
    note:"大会カレンダーHTML内JavaScriptから通信候補を抽出しています。Cookie値等は出力しません。"
  };
}

async function debugCompetitionCalendar(){
  const calendarUrl=`${SAJ_ORIGIN}/alpine/competition/calendar`;
  const html=await getText(calendarUrl);
  const formInfo=extractFormInfo(html);
  if(!formInfo){
    return {calendarUrl,formFound:false};
  }

  const current=getTargetSeasons()[0];
  const testInfo=JSON.parse(JSON.stringify(formInfo));
  const seasonChoice=chooseSeasonField(testInfo,current);
  const alpineChoice=chooseAlpineField(testInfo);
  const monthInfo=findMonthSelect(testInfo);
  const prefInfo=findPrefectureSelect(testInfo);

  return {
    calendarUrl,
    formFound:true,
    method:formInfo.method,
    action:formInfo.action,
    fieldNames:Object.keys(formInfo.fields),
    detectedSeasonField:seasonChoice,
    detectedAlpineField:alpineChoice,
    detectedPrefectureField:prefInfo?{
      name:prefInfo.select.name,
      count:prefInfo.options.length,
      options:prefInfo.options
    }:null,
    detectedMonthField:monthInfo?{
      name:monthInfo.select.name,
      options:monthInfo.options
    }:null,
    selects:formInfo.selects.map(s=>({
      name:s.name,
      options:s.options.slice(0,30)
    }))
  };
}

async function debugPoints(saj){
  const seasons=[];
  for(const season of getTargetSeasons()){
    const item={season,seasonLabel:`${season-1}/${season}`,calendarUrl:`${SAJ_ORIGIN}/alpine/point/calendar?season_code=${season}`};
    try{
      const cal=await getText(item.calendarUrl);
      const pointLinks=extractPointListLinks(cal);
      const downloads=extractDownloadLinks(cal);
      item.calendarOk=true;
      item.pointLinkCount=pointLinks.length;
      item.downloadLinkCount=downloads.length;
      item.pointLinks=pointLinks.slice(-5);
      item.downloadLinks=downloads.slice(-10);

      item.matches=[];
      for(const link of downloads.slice(-20).reverse()){
        try{
          const raw=await getRawText(link);
          if(raw.includes(saj)){
            const parsed=parseDelimitedPointFile(raw,saj,link);
            item.matches.push({
              link,
              containsSaj:true,
              parsed:parsed ? {
                dh:parsed.dh,sc:parsed.sc,sg:parsed.sg,gs:parsed.gs,sl:parsed.sl,
                rawRow:parsed.rawRow||null
              } : null
            });
            if(item.matches.length>=3) break;
          }
        }catch(e){
          // only surface compact error info
        }
      }
    }catch(e){
      item.calendarOk=false;
      item.error=String(e?.message||e);
    }
    seasons.push(item);
  }
  const resolved=await lookupOfficialPoints(saj).catch(()=>null);
  return {saj,seasons,resolved};
}
