const SETTER_TOOL_URL='https://m6jm4s654p-lab.github.io/snowtech/';

function openSetterTool(){
  window.location.href=SETTER_TOOL_URL;
}
function enterManagerTool(){
  const p=document.getElementById('toolPortal');
  if(p)p.classList.add('hidden');
  sessionStorage.setItem('snowtech_selected_tool','manager');
  openTab('home');
  startDeferredSajRefresh();
}
function showToolPortal(){
  const p=document.getElementById('toolPortal');
  if(p)p.classList.remove('hidden');
  sessionStorage.removeItem('snowtech_selected_tool');
  window.scrollTo(0,0);
}
function initToolPortal(){
  const p=document.getElementById('toolPortal');
  if(!p)return;
  // A page reload intentionally returns to the title selector.
  p.classList.remove('hidden');
}


const VENUE_OFFICIAL_REGISTRY=[
  {keys:['岩手高原'],name:'岩手高原スノーパーク',region:'東北',url:'https://iwatekogen.jp/'},
  {keys:['雫石'],name:'雫石スキー場',region:'東北',url:'https://www.princehotels.co.jp/ski/shizukuishi/'},
  {keys:['安比'],name:'安比高原スキー場',region:'東北',url:'https://www.appi.co.jp/snow-mountain-resort/'},
  {keys:['花輪','アルパス'],name:'花輪スキー場（アルパス）',region:'東北',prefecture:'秋田県',municipality:'鹿角市',url:'https://r.goope.jp/alpas/'},
  {keys:['たざわ湖','田沢湖'],name:'たざわ湖スキー場',region:'東北',url:'https://www.tazawako-ski.com/'},
  {keys:['赤倉温泉','最上'],name:'赤倉温泉スキー場',region:'東北',url:'https://kanko-mogami.jp/spot/akakuraski/'},
  {keys:['蔵王ライザ','ライザ'],name:'蔵王ライザワールド',region:'東北',url:'https://www.zaoliza.co.jp/wntr/'},
  {keys:['猪苗代'],name:'猪苗代スキー場',region:'東北',url:'https://inawashiro-ski.com/'},
  {keys:['フェアリーランドかねやま','かねやま','金山'],name:'フェアリーランドかねやまスキー場',region:'東北',prefecture:'福島県',municipality:'金山町',url:'https://www.aizukaneyama.co.jp/ski/skitop.html'},

  {keys:['カムイスキーリンクス','カムイ'],name:'カムイスキーリンクス',region:'北海道',url:'https://www.kamui-skilinks.com/'},
  {keys:['ぬかびら'],name:'ぬかびら源泉郷スキー場',region:'北海道',url:'https://ichida54.wixsite.com/nukabiraskijyo'},
  {keys:['サッポロテイネ','テイネ'],name:'サッポロテイネ',region:'北海道',url:'https://sapporo-teine.com/snow/'},
  {keys:['富良野'],name:'富良野スキー場',region:'北海道',url:'https://www.princehotels.co.jp/ski/furano/'},
  {keys:['ルスツ'],name:'ルスツリゾート',region:'北海道',url:'https://rusutsu.com/winter/'},

  {keys:['尾瀬戸倉','戸倉'],name:'スノーパーク尾瀬戸倉',region:'関東',url:'https://www.ozetokura.co.jp/'},
  {keys:['丸沼'],name:'丸沼高原スキー場',region:'関東',url:'https://www.marunuma.jp/winter/'},
  {keys:['川場'],name:'川場スキー場',region:'関東',url:'https://www.kawaba.co.jp/snow/'},

  {keys:['菅平','パインビーク'],name:'菅平高原パインビークスキー場',region:'甲信越',url:'https://pinebeak.jp/'},
  {keys:['野沢温泉'],name:'野沢温泉スキー場',region:'甲信越',url:'https://nozawaski.com/'},
  {keys:['西舘山','志賀高原'],name:'志賀高原スキー場',region:'甲信越',url:'https://www.shigakogen-ski.or.jp/'},
  {keys:['戸隠'],name:'戸隠スキー場',region:'甲信越',url:'https://www.togakusi.com/ski/'},
  {keys:['八方尾根','白馬八方'],name:'白馬八方尾根スキー場',region:'甲信越',url:'https://www.happo-one.jp/'},
  {keys:['よませ'],name:'よませ温泉スキー場',region:'甲信越',url:'https://x-jam.jp/yomase/'},
  {keys:['アライ','ARAI'],name:'ロッテアライリゾート',region:'甲信越',url:'https://www.lottehotel.com/arai-resort/ja'},
  {keys:['赤倉観光'],name:'赤倉観光リゾートスキー場',region:'甲信越',url:'https://akr-ski.com/'},
  {keys:['苗場'],name:'苗場スキー場',region:'甲信越',url:'https://www.princehotels.co.jp/ski/naeba/'},

  {keys:['あわすの'],name:'あわすのスキー場',region:'北陸',url:'https://awasuno.com/'},
  {keys:['白峰'],name:'白峰アルペン競技場',region:'北陸',url:'https://shiramine-ss.com/'},
  {keys:['たいら'],name:'たいらスキー場',region:'北陸',url:'https://gokayama-taira.com/'},
  {keys:['IOX','イオックス'],name:'IOX-AROSA',region:'北陸',url:'https://iox-arosa.jp/'},

  {keys:['ほおのき'],name:'ほおのき平スキー場',region:'東海',url:'https://hounoki-daira.com/'},
  {keys:['モンデウス','位山'],name:'モンデウス飛騨位山スノーパーク',region:'東海',url:'https://www.montdeus.jp/'},
  {keys:['高鷲'],name:'高鷲スノーパーク',region:'東海',url:'https://www.takasu.gr.jp/'},
  {keys:['ダイナランド'],name:'ダイナランド',region:'東海',url:'https://www.dynaland.co.jp/'},

  {keys:['ハチ北','ハチ・ハチ北','ハチ高原'],name:'ハチ・ハチ北スキー場',region:'近畿',url:'https://www.hachi-hachikita.co.jp/'},
  {keys:['奥伊吹'],name:'グランスノー奥伊吹',region:'近畿',url:'https://www.okuibuki.co.jp/'},

  {keys:['だいせん','大山'],name:'だいせんホワイトリゾート',region:'中国',url:'https://www.daisen-resort.jp/'},
  {keys:['若桜氷ノ山','氷ノ山'],name:'若桜氷ノ山スキー場',region:'中国',url:'https://www.hyounosen.co.jp/'},
  {keys:['サイオト'],name:'ユートピアサイオト',region:'中国',url:'https://www.saioto.co.jp/'},

  {keys:['石鎚'],name:'石鎚スキー場',region:'四国',url:'https://www.ishizuchi.com/ski/'},
  {keys:['井川','腕山'],name:'井川スキー場 腕山',region:'四国',url:'https://www.ikawaski.jp/'},
  {keys:['九重'],name:'九重森林公園スキー場',region:'九州・沖縄',url:'https://www.kujyuski.co.jp/'}
];

function eventSeasonStartYear(e){
  const explicit=Number(e?.seasonStartYear);
  if(Number.isFinite(explicit) && explicit>2000)return explicit;

  const sajSeason=String(e?.sajSeason||'').match(/(\d{4})/g);
  if(sajSeason?.length){
    const years=sajSeason.map(Number).filter(Number.isFinite);
    if(years.length){
      const max=Math.max(...years);
      const min=Math.min(...years);
      if(max-min===1)return min;
      if(max>2000)return max-1;
    }
  }

  const date=String(e?.start||'');
  const m=date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(m){
    const y=Number(m[1]),mon=Number(m[2]);
    // App's season rollover is July.
    return mon>=7?y:y-1;
  }
  return selectedGlobalSeasonYear();
}
function normalizeVenueLookupText(v){
  return String(v||'')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ \t\r\n　・･,，.．\/／\\()（）\[\]【】「」『』"'：:;；_\-‐‑‒–—―]/g,'')
    .replace(/skiresort/g,'')
    .replace(/skiarea/g,'');
}
function findVenueRegistry(place){
  const p=normalizeVenueLookupText(place);
  if(!p)return null;

  let best=null;
  let bestScore=0;

  VENUE_OFFICIAL_REGISTRY.forEach(v=>{
    const candidates=[v.name,...(v.keys||[])];
    candidates.forEach(raw=>{
      const k=normalizeVenueLookupText(raw);
      if(!k)return;

      let score=0;
      if(p===k){
        score=10000+k.length;
      }else if(p.includes(k)){
        score=1000+k.length;
      }else if(p.length>=4 && k.includes(p)){
        score=500+p.length;
      }

      if(score>bestScore){
        best=v;
        bestScore=score;
      }
    });
  });

  return best;
}
function guessVenueRegion(place){
  const p=String(place||'');
  const groups=[
    ['北海道',['北海道']],
    ['東北',['青森','岩手','宮城','秋田','山形','福島']],
    ['関東',['茨城','栃木','群馬','埼玉','千葉','東京','神奈川']],
    ['甲信越',['新潟','山梨','長野']],
    ['北陸',['富山','石川','福井']],
    ['東海',['岐阜','静岡','愛知','三重']],
    ['近畿',['滋賀','京都','大阪','兵庫','奈良','和歌山']],
    ['中国',['鳥取','島根','岡山','広島','山口']],
    ['四国',['徳島','香川','愛媛','高知']],
    ['九州・沖縄',['福岡','佐賀','長崎','熊本','大分','宮崎','鹿児島','沖縄']]
  ];
  for(const [name,prefs] of groups) if(prefs.some(x=>p.includes(x))) return name;
  return 'その他';
}
function registeredVenueName(place,reg){
  // Preserve the exact SAJ/registered place text so yearly changes are visible.
  return String(place||'会場未設定').trim();
}
function renderVenues(){
  const list=document.getElementById('venueRegisteredList');
  const info=document.getElementById('venueSeasonInfo');
  if(!list||!info)return;

  const selected=selectedGlobalSeasonYear();

  info.textContent=`表示対象：${selected}/${selected+1}シーズン（アプリ全体のシーズン設定と連動）`;

  const events=(db.events||[]).filter(e=>{
    return !!String(e.place||'').trim() && eventSeasonStartYear(e)===selected;
  });

  if(!events.length){
    list.innerHTML='<div class="venue-season-empty">このシーズンに登録された大会会場はありません。<br>大会管理で大会を登録すると、ここへ自動表示されます。</div>';
    return;
  }

  const map=new Map();
  events.forEach(e=>{
    const place=String(e.place||'').trim();
    const key=place.replace(/\s+/g,' ').toLowerCase();
    if(!map.has(key)) map.set(key,{place,events:[]});
    map.get(key).events.push(e);
  });

  const venues=[...map.values()].map(v=>{
    const reg=findVenueRegistry(v.place);
    return {
      ...v,
      reg,
      region:reg?.region||guessVenueRegion(v.place),
      display:registeredVenueName(v.place,reg)
    };
  });

  const regionOrder=['北海道','東北','関東','甲信越','北陸','東海','近畿','中国','四国','九州・沖縄','その他'];
  venues.sort((a,b)=>{
    const ra=regionOrder.indexOf(a.region), rb=regionOrder.indexOf(b.region);
    return (ra-rb)||a.display.localeCompare(b.display,'ja');
  });

  const grouped=new Map();
  venues.forEach(v=>{
    if(!grouped.has(v.region)) grouped.set(v.region,[]);
    grouped.get(v.region).push(v);
  });

  list.innerHTML=regionOrder.filter(r=>grouped.has(r)).map(region=>{
    const cards=grouped.get(region).map(v=>{
      const titles=[...new Set(v.events.map(e=>e.title).filter(Boolean))];
      const urls=[...new Set([
        safeExternalUrl(v.reg?.url),
        ...cachedVenueOfficialUrls(v.place)
      ].filter(Boolean))];

      const official=urls.length
        ? `<div class="venue-official-links">
            ${urls.map((url,i)=>`<button class="btn primary venue-official" onclick="openVenueOfficial(decodeURIComponent('${encodeURIComponent(v.place)}'),decodeURIComponent('${encodeURIComponent(url)}'))">${urls.length===1?'公式':`公式${i+1}`}</button>`).join('')}
            <button class="btn venue-official-search" onclick="openVenueLinkModal(decodeURIComponent('${encodeURIComponent(v.place)}'))">編集</button>
          </div>`
        : `<button class="btn venue-official venue-official-search" onclick="openVenueLinkModal(decodeURIComponent('${encodeURIComponent(v.place)}'))">公式を探す</button>`;
      return `<div class="venue-item">
        <div class="venue-item-name">${esc(v.display)}
          <span class="venue-item-pref">${v.events.length}大会登録</span>
          <div class="venue-event-titles">${titles.map(esc).join('<br>')}</div>
        </div>
        ${official}
      </div>`;
    }).join('');
    return `<div class="venue-region"><h3>${region}</h3><div class="venue-grid">${cards}</div></div>`;
  }).join('');
}

const KEY='snowtech_alpine_team_v1';
let db=JSON.parse(localStorage.getItem(KEY)||'null')||{
  team:{
    name:'',
    sajApiUrl:'',
    scheduleSeasonLocked:false,
    scheduleSeasonYear:null,
    globalSeasonYear:null,
    lastBackupAt:'',
    scheduleOffSeason:false,
    sajAutoRefreshDate:''
  },
  coaches:[],
  athletes:[],
  schedules:[],
  events:[]
};

// v0.13.39 compatibility: normalize only known sex labels.
// Existing athlete records and point values are never removed here.
(db.athletes||[]).forEach(a=>{
  const normalized=normalizeAthleteSex(a.sex);
  if(normalized)a.sex=normalized;
});
function uid(){return Math.random().toString(36).slice(2,10)}
function persistDb({silent=false}={}){
  try{
    localStorage.setItem(KEY,JSON.stringify(db));
    const sync=document.getElementById('syncState');
    if(sync)sync.textContent='● ローカル保存済み';
    return true;
  }catch(e){
    const sync=document.getElementById('syncState');
    if(sync)sync.textContent='● 保存エラー';
    if(!silent){
      alert('端末への保存に失敗しました。空き容量やブラウザの保存設定を確認し、必要に応じてバックアップを書き出してください。');
    }
    return false;
  }
}
function save(){
  if(persistDb())renderAll();
}
function fmt(d){if(!d)return'-';return d.replaceAll('-','/')}
function selectedValues(sel){return [...sel.selectedOptions].map(o=>o.value)}
function textOrDash(v){return v===undefined||v===null||v===''?'-':v}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function safeSajUrl(v){
  try{
    const u=new URL(String(v||''));
    return u.protocol==='https:' && u.hostname==='sajdb.shikuminet.jp' ? u.toString() : '';
  }catch{return ''}
}
function safeExternalUrl(v){
  try{
    const u=new URL(String(v||''));
    return (u.protocol==='https:' || u.protocol==='http:') ? u.toString() : '';
  }catch{return ''}
}

const VENUE_LINK_CACHE_KEY='alpine_team_manager_venue_links_v1';

function readVenueLinkCache(){
  try{
    const parsed=JSON.parse(localStorage.getItem(VENUE_LINK_CACHE_KEY)||'{}');
    return parsed && typeof parsed==='object' ? parsed : {};
  }catch{
    return {};
  }
}
function writeVenueLinkCache(cache){
  try{
    localStorage.setItem(VENUE_LINK_CACHE_KEY,JSON.stringify(cache||{}));
  }catch{}
}
function venueLinkCacheKey(place){
  return normalizeVenueLookupText(place);
}
function cachedVenueOfficialUrls(place){
  const key=venueLinkCacheKey(place);
  if(!key)return [];
  const row=readVenueLinkCache()[key]||{};
  const legacy=safeExternalUrl(row?.url);
  const arr=Array.isArray(row?.urls)?row.urls:[];
  return [...new Set([legacy,...arr].map(safeExternalUrl).filter(Boolean))];
}
function cachedVenueOfficialUrl(place){
  return cachedVenueOfficialUrls(place)[0]||'';
}
function cacheVenueOfficialUrls(place,urls){
  const key=venueLinkCacheKey(place);
  if(!key)return;
  const clean=[...new Set((urls||[]).map(safeExternalUrl).filter(Boolean))];
  const cache=readVenueLinkCache();
  if(clean.length){
    cache[key]={url:clean[0],urls:clean,updatedAt:new Date().toISOString()};
  }else{
    delete cache[key];
  }
  writeVenueLinkCache(cache);
}
function cacheVenueOfficialUrl(place,url){
  const current=cachedVenueOfficialUrls(place);
  const safe=safeExternalUrl(url);
  if(!safe)return;
  cacheVenueOfficialUrls(place,[...current,safe]);
}
let venueLinkModalPlaceValue='';
let venueLinkCandidates=[];

function venueCandidateTitleFromUrl(url){
  try{
    const u=new URL(url);
    return u.hostname.replace(/^www\./,'');
  }catch{
    return '公式サイト候補';
  }
}
function mergeVenueLinkCandidates(rows){
  const map=new Map();
  (rows||[]).forEach(row=>{
    const url=safeExternalUrl(row?.url);
    if(!url)return;
    const key=url.replace(/\/+$/,'');
    if(!map.has(key)){
      map.set(key,{
        url,
        title:String(row?.title||venueCandidateTitleFromUrl(url)),
        place:String(row?.place||''),
        source:String(row?.source||'')
      });
    }
  });
  return [...map.values()];
}

function prefectureWithSuffix(v){
  const raw=String(v||'').trim();
  if(!raw)return '';
  return /[都道府県]$/.test(raw) ? raw : `${raw}県`;
}
function extractPrefectureFromText(v){
  const text=String(v||'');
  const m=text.match(/(北海道|東京都|大阪府|京都府|[^\s,、，]{2,4}県)/);
  return m?m[1]:'';
}
function extractMunicipalityFromText(v){
  const text=String(v||'')
    .replace(/北海道|東京都|大阪府|京都府|[^\s,、，]{2,4}県/g,' ')
    .replace(/[、,，／/()（）【】\[\]]/g,' ');
  const matches=text.match(/[^\s]{1,12}(?:市|区|町|村)/g)||[];
  return matches.find(x=>!/スキー場|大会|競技場/.test(x))||'';
}
function municipalityFromAddress(address,displayName=''){
  const a=address||{};
  const direct=[
    a.city,
    a.town,
    a.village,
    a.municipality,
    a.city_district
  ].map(v=>String(v||'').trim()).find(Boolean);
  if(direct)return direct;

  const parts=String(displayName||'').split(',').map(x=>x.trim()).filter(Boolean);
  return parts.find(x=>/[市区町村]$/.test(x))||'';
}
function venueEventAdmin(place){
  const key=normalizeVenueLookupText(place);
  const e=(db.events||[]).find(x=>normalizeVenueLookupText(x?.place)===key)||null;
  if(!e)return {prefecture:'',municipality:''};

  const text=[
    e.place,
    e.prefecture,
    e.municipality,
    e.city,
    e.town,
    e.address
  ].filter(Boolean).join(' ');

  const pref=prefectureWithSuffix(e.prefecture||extractPrefectureFromText(text));
  const municipality=String(
    e.municipality||e.city||e.town||extractMunicipalityFromText(text)||''
  ).trim();

  return {prefecture:pref,municipality};
}
function venueAreaFromRegistry(place){
  const reg=findVenueRegistry(place);
  if(!reg)return null;
  const prefecture=prefectureWithSuffix(reg.prefecture||WEATHER_VENUE_PREF[reg.name]||'');
  const municipality=String(reg.municipality||'').trim();
  if(!prefecture && !municipality)return null;
  return {
    prefecture,
    municipality,
    label:[prefecture,municipality].filter(Boolean).join(' '),
    source:'registry'
  };
}
function venueAreaFromWeatherCache(place,prefecture=''){
  const p=normalizeVenueLookupText(place);
  if(!p)return null;

  const cache=weatherGeoCache();
  const wantedPref=normalizePrefecture(prefecture);
  let best=null;

  Object.entries(cache||{}).forEach(([key,row])=>{
    const name=String(row?.geocodeName||row?.resolvedName||key.split('|')[0]||'');
    const n=normalizeVenueLookupText(name);

    // Exact venue-name match only. Never reuse a fuzzy municipality cache.
    if(n!==p)return;

    const label=String(row?.geocodeLabel||'');
    const pref=extractPrefectureFromText(label);
    const municipality=extractMunicipalityFromText(label);
    if(wantedPref && pref && normalizePrefecture(pref)!==wantedPref)return;

    if(pref||municipality){
      best={
        prefecture:pref||prefecture,
        municipality,
        label:[pref||prefecture,municipality].filter(Boolean).join(' '),
        source:'weather-cache'
      };
    }
  });

  return best;
}
function normalizeAreaInputs(prefecture,municipality){
  const pref=prefectureWithSuffix(prefecture);
  const muni=String(municipality||'').trim();
  return {
    prefecture:pref,
    municipality:muni,
    label:[pref,muni].filter(Boolean).join(' ')
  };
}
async function resolveVenueSearchArea(place){
  // 1. Exact administrative text already in the event/place data.
  const eventAdmin=venueEventAdmin(place);
  if(eventAdmin.municipality){
    return {...normalizeAreaInputs(eventAdmin.prefecture,eventAdmin.municipality),source:'event'};
  }

  // 2. High-confidence static registry hints.
  const registry=venueAreaFromRegistry(place);
  if(registry?.municipality){
    return registry;
  }

  // 3. Weather cache only when venue name matches exactly.
  const cached=venueAreaFromWeatherCache(
    place,
    eventAdmin.prefecture||registry?.prefecture||''
  );
  if(cached?.municipality){
    return cached;
  }

  // 4. Geocode only matching venue results.
  // Never take list[0] merely because it is in the same prefecture.
  const knownPref=eventAdmin.prefecture||registry?.prefecture||'';
  const queries=[
    knownPref ? `${String(place||'').trim()}, ${knownPref}` : '',
    String(place||'').trim()
  ].filter(Boolean);
  const wantedVenue=normalizeVenueLookupText(place);
  const reg=findVenueRegistry(place);

  for(const q of queries){
    try{
      const url='https://nominatim.openstreetmap.org/search'
        +`?format=jsonv2&limit=12&countrycodes=jp&addressdetails=1&accept-language=ja&q=${encodeURIComponent(q)}`;
      const r=await fetch(url,{
        method:'GET',
        headers:{'Accept':'application/json'},
        cache:'no-store'
      });
      if(!r.ok)continue;

      const list=await r.json();
      if(!Array.isArray(list)||!list.length)continue;

      const wantedPref=normalizePrefecture(knownPref);
      const hit=list
        .map(row=>{
          const address=row?.address||{};
          const state=normalizePrefecture(address.state||address.province||'');
          if(wantedPref && state!==wantedPref && !String(row?.display_name||'').includes(wantedPref+'県')){
            return null;
          }

          const candidateName=normalizeVenueLookupText(
            [row?.name,row?.display_name].filter(Boolean).join(' ')
          );

          let score=0;
          if(wantedVenue && candidateName.includes(wantedVenue))score=1000;
          for(const key of (reg?.keys||[])){
            const nk=normalizeVenueLookupText(key);
            if(nk && candidateName.includes(nk))score=Math.max(score,100+nk.length);
          }

          return score>0 ? {row,score} : null;
        })
        .filter(Boolean)
        .sort((a,b)=>b.score-a.score)[0]?.row;

      if(!hit)continue;

      const address=hit.address||{};
      const pref=String(address.state||address.province||knownPref||'').trim();
      const municipality=municipalityFromAddress(address,hit.display_name||'');

      if(municipality){
        return {
          ...normalizeAreaInputs(pref,municipality),
          geocodeLabel:String(hit.display_name||''),
          source:'geocode'
        };
      }
    }catch{}
  }

  return normalizeAreaInputs(knownPref,'');
}

let venueForcedSearchArea=null;

async function searchVenueOfficialCandidates(place,forcedArea=null){
  const rows=[];

  const reg=findVenueRegistry(place);
  const regUrl=safeExternalUrl(reg?.url);
  if(regUrl){
    rows.push({
      url:regUrl,
      title:`登録済み候補：${reg?.name||place}`,
      place:reg?.region||'',
      source:'registry'
    });
  }

  cachedVenueOfficialUrls(place).forEach(url=>{
    rows.push({
      url,
      title:`端末登録済み：${venueCandidateTitleFromUrl(url)}`,
      place:place,
      source:'cache'
    });
  });

  const area=forcedArea
    ? normalizeAreaInputs(forcedArea.prefecture,forcedArea.municipality)
    : await resolveVenueSearchArea(place);

  venueForcedSearchArea=area;

  const prefInput=document.getElementById('venueLinkPrefectureInput');
  const muniInput=document.getElementById('venueLinkMunicipalityInput');
  const editor=document.getElementById('venueLinkAreaEditor');
  if(prefInput)prefInput.value=area.prefecture||'';
  if(muniInput)muniInput.value=area.municipality||'';
  if(editor)editor.classList.remove('hidden');

  const areaEl=document.getElementById('venueLinkSearchArea');
  const strictQuery=(area.prefecture&&area.municipality)
    ? `${area.prefecture} ${area.municipality} スキー場`
    : '';

  if(areaEl){
    areaEl.textContent=strictQuery
      ? `検索語：「${strictQuery}」`
      : '市町村名を特定できませんでした。都道府県名・市町村名を入力して再検索してください。';
  }

  // If the municipality is unknown, do not guess another city.
  if(!area.prefecture || !area.municipality){
    return mergeVenueLinkCandidates(rows);
  }

  try{
    const params=new URLSearchParams();
    params.set('q',String(place||'').trim());
    params.set('prefecture',area.prefecture);
    params.set('municipality',area.municipality);

    const workerUrl=`${apiBase()}/api/venue-search?${params.toString()}`;
    const r=await fetch(workerUrl,{
      method:'GET',
      headers:{'Accept':'application/json'},
      cache:'no-store'
    });

    if(r.ok){
      const data=await r.json();
      let webResults=Array.isArray(data?.results)?data.results:[];

      // 市町村検索で候補0件なら、都道府県名＋スキー場へ自動フォールバック。
      if(!webResults.length && area.prefecture){
        const fallbackParams=new URLSearchParams();
        fallbackParams.set('q',String(place||'').trim());
        fallbackParams.set('prefecture',area.prefecture);
        fallbackParams.set('fallback','prefecture');
        try{
          const fr=await fetch(`${apiBase()}/api/venue-search?${fallbackParams.toString()}`,{
            method:'GET',
            headers:{'Accept':'application/json'},
            cache:'no-store'
          });
          if(fr.ok){
            const fd=await fr.json();
            webResults=Array.isArray(fd?.results)?fd.results:[];
            if(webResults.length && areaEl){
              areaEl.textContent=`市町村検索で候補なし → 検索語：「${area.prefecture} スキー場」`;
            }
          }
        }catch{}
      }

      webResults.forEach(row=>{
        const url=safeExternalUrl(row?.url);
        if(!url)return;
        rows.push({
          url,
          title:String(row?.title||venueCandidateTitleFromUrl(url)),
          place:String(row?.snippet||row?.source||strictQuery),
          source:'web-search'
        });
      });
    }
  }catch{}

  // Secondary source uses exactly the same query.
  try{
    const url='https://nominatim.openstreetmap.org/search'
      +`?format=jsonv2&limit=12&countrycodes=jp&addressdetails=1&extratags=1&accept-language=ja&q=${encodeURIComponent(strictQuery)}`;
    const res=await fetch(url,{
      method:'GET',
      headers:{'Accept':'application/json'},
      cache:'no-store'
    });

    if(res.ok){
      const list=await res.json();
      (Array.isArray(list)?list:[]).forEach(row=>{
        const tags=row?.extratags||{};
        const urls=[
          tags.website,
          tags['contact:website'],
          tags.url,
          tags['contact:url']
        ].map(safeExternalUrl).filter(Boolean);

        urls.forEach(url=>{
          rows.push({
            url,
            title:row?.name||row?.display_name?.split(',')?.[0]||venueCandidateTitleFromUrl(url),
            place:row?.display_name||strictQuery,
            source:'nominatim'
          });
        });
      });
    }
  }catch{}

  return mergeVenueLinkCandidates(rows).slice(0,16);
}
function renderVenueLinkCandidates(){
  const box=document.getElementById('venueLinkCandidateList');
  const status=document.getElementById('venueLinkSearchStatus');
  if(!box)return;

  const selected=new Set(cachedVenueOfficialUrls(venueLinkModalPlaceValue));

  if(!venueLinkCandidates.length){
    box.innerHTML='<div class="muted">公式URL候補を取得できませんでした。都道府県名・市町村名を確認して再検索してください。候補にないURLは下の欄から手動追加できます。</div>';
    if(status)status.textContent='候補 0件';
    return;
  }

  if(status)status.textContent=`候補 ${venueLinkCandidates.length}件（複数選択できます）`;

  box.innerHTML=venueLinkCandidates.map((row,i)=>{
    const checked=selected.has(row.url)?' checked':'';
    return `<label class="venue-link-candidate">
      <input type="checkbox" data-venue-link-index="${i}"${checked}>
      <span>
        <div class="venue-link-candidate-title">${esc(row.title||'公式サイト候補')}</div>
        <div class="venue-link-candidate-url">${esc(row.url)}</div>
        ${row.place?`<div class="venue-link-candidate-place">${esc(row.place)}</div>`:''}
      </span>
    </label>`;
  }).join('');
}
async function openVenueLinkModal(place){
  venueLinkModalPlaceValue=String(place||'').trim();
  venueLinkCandidates=[];

  const modal=document.getElementById('venueLinkModal');
  const placeEl=document.getElementById('venueLinkModalPlace');
  const status=document.getElementById('venueLinkSearchStatus');
  const areaEl=document.getElementById('venueLinkSearchArea');
  const editor=document.getElementById('venueLinkAreaEditor');
  const box=document.getElementById('venueLinkCandidateList');
  const manual=document.getElementById('venueLinkManualUrl');

  if(!modal)return;
  if(placeEl)placeEl.textContent=venueLinkModalPlaceValue;
  if(status)status.textContent='候補を検索しています…';
  if(areaEl)areaEl.textContent='所在地を確認しています…';
  if(editor)editor.classList.add('hidden');
  venueForcedSearchArea=null;
  if(box)box.innerHTML='';
  if(manual)manual.value='';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');

  try{
    venueLinkCandidates=await searchVenueOfficialCandidates(venueLinkModalPlaceValue);
  }catch{
    venueLinkCandidates=[];
  }
  renderVenueLinkCandidates();
}
async function rerunVenueSearchWithArea(){
  const pref=String(document.getElementById('venueLinkPrefectureInput')?.value||'').trim();
  const municipality=String(document.getElementById('venueLinkMunicipalityInput')?.value||'').trim();

  if(!pref || !municipality){
    alert('都道府県名と市町村名の両方を入力してください。');
    return;
  }

  const status=document.getElementById('venueLinkSearchStatus');
  const box=document.getElementById('venueLinkCandidateList');
  if(status)status.textContent='指定した地域で候補を再検索しています…';
  if(box)box.innerHTML='';

  try{
    venueLinkCandidates=await searchVenueOfficialCandidates(
      venueLinkModalPlaceValue,
      {prefecture:pref,municipality}
    );
  }catch{
    venueLinkCandidates=[];
  }
  renderVenueLinkCandidates();
}

function closeVenueLinkModal(){
  const modal=document.getElementById('venueLinkModal');
  if(!modal)return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}
function addManualVenueLinkCandidate(){
  const input=document.getElementById('venueLinkManualUrl');
  if(!input)return;
  const url=safeExternalUrl(input.value);
  if(!url){
    alert('http:// または https:// で始まるURLを入力してください。');
    input.focus();
    return;
  }

  venueLinkCandidates=mergeVenueLinkCandidates([
    ...venueLinkCandidates,
    {
      url,
      title:`手動追加：${venueCandidateTitleFromUrl(url)}`,
      place:venueLinkModalPlaceValue,
      source:'manual'
    }
  ]);
  input.value='';
  renderVenueLinkCandidates();

  requestAnimationFrame(()=>{
    const i=venueLinkCandidates.findIndex(x=>x.url===url);
    const cb=document.querySelector(`input[data-venue-link-index="${i}"]`);
    if(cb)cb.checked=true;
  });
}
function saveSelectedVenueLinks(){
  const checked=[...document.querySelectorAll('#venueLinkCandidateList input[data-venue-link-index]:checked')];
  const urls=checked.map(el=>{
    const i=Number(el.dataset.venueLinkIndex);
    return venueLinkCandidates[i]?.url||'';
  }).map(safeExternalUrl).filter(Boolean);

  cacheVenueOfficialUrls(venueLinkModalPlaceValue,urls);
  closeVenueLinkModal();
  renderVenues();

  alert(urls.length
    ? `${urls.length}件の公式リンクを登録しました。`
    : '公式リンクの登録を解除しました。');
}
function openVenueOfficial(place,directUrl){
  const direct=safeExternalUrl(directUrl);
  if(direct){
    window.open(direct,'_blank','noopener,noreferrer');
    return;
  }
  openVenueLinkModal(place);
}

function pad2(n){return String(n).padStart(2,'0')}
const JP_WD=['日','月','火','水','木','金','土'];
const JP_HOLIDAYS=new Set([
  // 2026 official holidays relevant to Alpine Team Manager season display
  '2026-01-01','2026-01-12','2026-02-11','2026-02-23','2026-03-20','2026-04-29',
  '2026-05-03','2026-05-04','2026-05-05','2026-05-06','2026-07-20','2026-08-11',
  '2026-09-21','2026-09-22','2026-09-23','2026-10-12','2026-11-03','2026-11-23',
  // 2027 official holidays relevant to Alpine Team Manager season display
  '2027-01-01','2027-01-11','2027-02-11','2027-02-23','2027-03-21','2027-03-22','2027-04-29',
  '2027-05-03','2027-05-04','2027-05-05','2027-07-19','2027-08-11','2027-09-20','2027-09-23',
  '2027-10-11','2027-11-03','2027-11-23',
  // 2028 holidays used when future seasons are displayed
  '2028-01-01','2028-01-10','2028-02-11','2028-02-23','2028-03-20','2028-04-29',
  '2028-05-03','2028-05-04','2028-05-05','2028-07-17','2028-08-11','2028-09-18','2028-09-22',
  '2028-10-09','2028-11-03','2028-11-23'
]);
function dayClass(dateStr,y,m,d){
  const dow=new Date(y,m-1,d).getDay();
  if(JP_HOLIDAYS.has(dateStr)) return 'day-holiday';
  if(dow===0) return 'day-sun';
  if(dow===6) return 'day-sat';
  return '';
}
function currentSeasonStartYear(){const t=new Date(),y=t.getFullYear(),m=t.getMonth()+1;return m>=7?y:y-1}
function seasonStartYearFromDate(dateStr){
  if(!dateStr)return null;
  const p=String(dateStr).split('-').map(Number);
  if(p.length<2 || !p[0] || !p[1]) return null;
  const y=p[0],m=p[1];
  if(m>=11) return y;
  if(m<=4) return y-1;
  return y;
}
function validDateParts(y,m,d){
  const dt=new Date(y,m-1,d);
  return dt.getFullYear()===y && dt.getMonth()===(m-1) && dt.getDate()===d;
}
function ymd(y,m,d){return `${y}-${pad2(m)}-${pad2(d)}`}
function enumerateDates(start,end){
  if(!start) return [];
  const a=new Date(start),b=new Date(end||start);
  if(Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return [];
  if(b<a) return [start];
  const rows=[];
  const cur=new Date(a);
  let guard=0;
  while(cur<=b && guard<40){
    rows.push(cur.toISOString().slice(0,10));
    cur.setDate(cur.getDate()+1);
    guard++;
  }
  return rows;
}
function collectScheduleSeasonYears(){
  const cur=currentSeasonStartYear();
  const set=new Set([cur-1,cur,cur+1]);
  [...db.schedules.map(x=>x.date),...db.events.map(x=>x.start),...db.events.map(x=>x.end)].forEach(d=>{
    const y=seasonStartYearFromDate(d);
    if(y) set.add(y);
  });
  const g=Number(db.team?.globalSeasonYear);
  const legacy=Number(db.team?.scheduleSeasonYear);
  if(Number.isFinite(g) && g>2000)set.add(g);
  if(Number.isFinite(legacy) && legacy>2000)set.add(legacy);
  return [...set].sort((a,b)=>a-b);
}
function selectedGlobalSeasonYear(){
  const g=Number(db.team?.globalSeasonYear);
  if(Number.isFinite(g) && g>2000)return g;
  const legacy=Number(db.team?.scheduleSeasonYear);
  if(Number.isFinite(legacy) && legacy>2000)return legacy;
  return currentSeasonStartYear();
}
function seasonOptionLabel(y){
  return `${y}/${y+1}`;
}
function globalSeasonOptionsHtml(selected){
  return collectScheduleSeasonYears().map(y=>
    `<option value="${y}" ${y===selected?'selected':''}>${seasonOptionLabel(y)}</option>`
  ).join('');
}
function syncSeasonSelectors(){
  db.team=db.team||{};
  const selected=selectedGlobalSeasonYear();
  const years=collectScheduleSeasonYears();

  const top=document.getElementById('globalSeasonSelect');
  if(top){
    top.innerHTML=globalSeasonOptionsHtml(selected);
    top.value=String(selected);
  }

  const schedule=document.getElementById('scheduleSeason');
  if(schedule){
    schedule.innerHTML=years.map(y=>`<option value="${y}">${seasonOptionLabel(y)}</option>`).join('');
    schedule.value=String(selected);
    schedule.disabled=false;
  }

  const saj=document.getElementById('sajCompetitionSeason');
  if(saj){
    // SAJ season code is the ending year: 2026/2027 -> 2027.
    saj.innerHTML=years.map(y=>`<option value="${y+1}">${seasonOptionLabel(y)}</option>`).join('');
    saj.value=String(selected+1);
  }
}
function applyGlobalSeason(year,{saveValue=true}={}){
  const y=Number(year);
  if(!Number.isFinite(y) || y<2000)return;

  db.team=db.team||{};
  db.team.globalSeasonYear=y;
  // Keep the legacy annual-calendar field synchronized for old data/code paths.
  db.team.scheduleSeasonYear=y;
  db.team.scheduleSeasonLocked=false;

  syncSeasonSelectors();

  if(saveValue)persistDb({silent:true});

  renderScheduleBoard();
  renderVenues();
  renderWeatherVenues();
  if(typeof renderOperationGuide==='function' && document.getElementById('operationGuide')?.classList.contains('active')){
    renderOperationGuide();
  }
}
function onGlobalSeasonChange(value){
  applyGlobalSeason(Number(value));
}
function initGlobalSeason(){
  db.team=db.team||{};
  syncSeasonSelectors();
  renderTopTeamName();
}
function initScheduleSeason(){
  const off=document.getElementById('scheduleOffSeason');
  db.team=db.team||{};
  syncSeasonSelectors();
  if(off)off.checked=!!db.team.scheduleOffSeason;
  renderScheduleBoard();
  renderVenues();
}
function onScheduleSeasonChange(){
  const sel=document.getElementById('scheduleSeason');
  if(!sel)return;
  applyGlobalSeason(Number(sel.value));
}
function toggleScheduleSeasonLock(){
  // Kept only for backward compatibility with older saved data.
  db.team=db.team||{};
  db.team.scheduleSeasonLocked=false;
  persistDb({silent:true});
}
function toggleScheduleOffSeason(){
  const off=document.getElementById('scheduleOffSeason');
  if(!off)return;
  db.team=db.team||{};
  db.team.scheduleOffSeason=!!off.checked;
  persistDb({silent:true});
  renderScheduleBoard();
}

const SCHEDULE_TYPES=['大会','練習','合宿','移動','休養'];
const SCHEDULE_TYPE_META={
  '大会':{cls:'type-race',color:'#d84a4a'},
  '練習':{cls:'type-training',color:'#3d86d9'},
  '合宿':{cls:'type-camp',color:'#31a36f'},
  '移動':{cls:'type-travel',color:'#dc8a2f'},
  '休養':{cls:'type-rest',color:'#75808a'}
};
function normalizedScheduleType(type){
  return SCHEDULE_TYPES.includes(type)?type:'練習';
}
function scheduleTypeClass(type){
  return (SCHEDULE_TYPE_META[normalizedScheduleType(type)]||SCHEDULE_TYPE_META['練習']).cls;
}
function scheduleTypeColor(type){
  return (SCHEDULE_TYPE_META[normalizedScheduleType(type)]||SCHEDULE_TYPE_META['練習']).color;
}
function scheduleSortPriority(type){
  const i=SCHEDULE_TYPES.indexOf(normalizedScheduleType(type));
  return i<0?99:i;
}
function scheduleBoardItemPriority(item){
  // Registered race is always top. Dedicated training day is next.
  if(item?.source==='event')return -100;
  if(item?.source==='trainingDay')return -50;
  return scheduleSortPriority(item?.type);
}
function buildSeasonBoardItems(){
  const rows=[];
  const schedules=db.schedules||[];

  const overrideKeys=new Set(
    schedules
      .filter(x=>x.quick && x.overrideOfRangeId && x.date && x.overrideSlot)
      .map(x=>`${x.date}|${x.overrideOfRangeId}|${Number(x.overrideSlot)}`)
  );

  schedules.forEach(s=>{
    if(s.quick && s.overrideDelete)return;

    if(s.quick && s.rangeId && s.date){
      const slot=Number(s.slot)||1;
      if(overrideKeys.has(`${s.date}|${s.rangeId}|${slot}`))return;
    }

    rows.push({
      source:s.trainingDay?'trainingDay':'schedule',
      dates:[s.date],
      type:normalizedScheduleType(s.type),
      title:s.title||'',
      place:s.place||'',
      note:s.note||'',
      coach:s.coach||'',
      quick:!!s.quick,
      slot:Number(s.slot||s.overrideSlot)||0
    });
  });

  db.events.forEach(e=>{
    const coachNames=(e.coachIds||[])
      .map(id=>db.coaches.find(c=>c.id===id)?.name)
      .filter(Boolean)
      .join('・');
    rows.push({
      source:'event',
      dates:enumerateDates(e.start,e.end||e.start),
      type:'大会',
      title:e.title||'大会',
      place:e.place||'',
      note:e.disc||'',
      coach:coachNames
    });
  });
  return rows;
}
function seasonBoardLabel(item){
  if(item.source==='event') return item.note ? `${item.title} (${item.note})` : item.title;
  if(item.source==='trainingDay'){
    return String(item.place||item.note||item.title||db.team?.mainSkiArea||'').trim();
  }
  const memo=String(item.note||item.title||'').trim();
  return memo || item.type;
}
function renderScheduleBoard(){
  const box=document.getElementById('scheduleBoard');
  const cap=document.getElementById('scheduleBoardCaption');
  const heading=document.getElementById('scheduleBoardHeading');
  const sel=document.getElementById('scheduleSeason');
  if(!box || !cap || !sel) return;

  const startYear=Number(sel.value)||currentSeasonStartYear();
  const showOff=!!document.getElementById('scheduleOffSeason')?.checked;

  const offMonths=[
    {y:startYear,m:5,label:'5月'},
    {y:startYear,m:6,label:'6月'},
    {y:startYear,m:7,label:'7月'},
    {y:startYear,m:8,label:'8月'},
    {y:startYear,m:9,label:'9月'},
    {y:startYear,m:10,label:'10月'}
  ];
  const winterMonths=[
    {y:startYear,m:11,label:'11月'},
    {y:startYear,m:12,label:'12月'},
    {y:startYear+1,m:1,label:'1月'},
    {y:startYear+1,m:2,label:'2月'},
    {y:startYear+1,m:3,label:'3月'},
    {y:startYear+1,m:4,label:'4月'}
  ];
  // With off-season enabled the annual activity year is May -> April.
  const allMonths=showOff ? [...offMonths,...winterMonths] : winterMonths;

  const printPages=showOff
    ? [
        offMonths.slice(0,3),       // 5-7
        offMonths.slice(3,6),       // 8-10
        winterMonths.slice(0,3),    // 11-1
        winterMonths.slice(3,6)     // 2-4
      ]
    : [
        winterMonths.slice(0,3),
        winterMonths.slice(3,6)
      ];

  const startDate=showOff ? ymd(startYear,5,1) : ymd(startYear,11,1);
  const endDate=ymd(startYear+1,4,30);
  const map=new Map();

  buildSeasonBoardItems().forEach(item=>{
    item.dates.forEach(d=>{
      if(!d || d<startDate || d>endDate) return;
      if(!map.has(d)) map.set(d,[]);
      map.get(d).push({label:seasonBoardLabel(item),coach:item.coach||'',type:item.type||'練習',source:item.source||'schedule'});
    });
  });

  if(showOff){
    cap.textContent=`${startYear}/${startYear+1}シーズン　画面：5月〜翌4月を横スクロール / PDF：A4縦4枚`;
    if(heading)heading.textContent='年間予定表（オフシーズン含む / PDF：A4縦4枚）';
  }else{
    cap.textContent=`${startYear}/${startYear+1}シーズン　画面：11月〜4月を横スクロール / PDF：A4縦2枚`;
    if(heading)heading.textContent='年間予定表（画面：横スクロール / PDF：A4縦2枚）';
  }

  function tableHtml(months,klass='',monthCount=3){
    let rows='';
    for(let day=1;day<=31;day++){
      rows += `<tr>`;
      months.forEach(meta=>{
        if(!validDateParts(meta.y,meta.m,day)){
          rows += `<td class="empty"></td>`;
          return;
        }
        const dateStr=ymd(meta.y,meta.m,day);
        const wd=JP_WD[new Date(meta.y,meta.m-1,day).getDay()];
        const cls=dayClass(dateStr,meta.y,meta.m,day);
        const dayItems=[...(map.get(dateStr)||[])].sort((a,b)=>{
          const pa=scheduleBoardItemPriority(a),pb=scheduleBoardItemPriority(b);
          if(pa!==pb)return pa-pb;
          return 0;
        });
        const visibleItems=dayItems.slice(0,2).map(v=>{
          const coach=v.coach ? `<span class="board-coach">引率：${esc(v.coach)}</span>` : '';
          if(v.source==='trainingDay'){
            return `<span class="board-item ${scheduleTypeClass('練習')}"><span class="board-type">練習</span>${v.label?` ${esc(v.label)}`:''}</span>`;
          }
          return `<span class="board-item ${scheduleTypeClass(v.type)}"><span class="board-type">${esc(v.type)}</span>${v.label&&v.label!==v.type?` ${esc(v.label)}`:''}${coach}</span>`;
        }).join('');
        const more=dayItems.length>2?`<span class="board-more">＋${dayItems.length-2}件</span>`:'';
        rows += `<td class="month-col" data-schedule-date="${dateStr}"><div class="board-day ${cls}">${day}日(${wd})</div>${visibleItems}${more}</td>`;
      });
      rows += `</tr>`;
    }
    const screenStyle=klass.includes('screen-season-board')
      ? ` style="--month-count:${monthCount};min-width:${Math.max(1180,Math.round(monthCount*196.7))}px"`
      : '';
    return `<table class="season-board ${klass}"${screenStyle}>
      <thead><tr>${months.map(x=>`<th class="month-col">${x.label}</th>`).join('')}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  }

  const screen=tableHtml(allMonths,'screen-season-board',allMonths.length);
  const teamTitle=esc(db.team.name||'Alpine Team Manager');

  const pageSubtitle=(months)=>{
    const first=months[0],last=months[months.length-1];
    const firstText=`${first.y}年${first.m}月`;
    const lastText=(last.y===first.y)?`${last.m}月`:`${last.y}年${last.m}月`;
    return `${startYear}/${startYear+1}シーズン　${firstText}〜${lastText}`;
  };

  const print=`<div class="print-season-pages">
    ${printPages.map((months,i)=>`<div class="season-page">
      <div class="season-page-head">
        <div class="season-page-title">${teamTitle} 年間予定表</div>
        <div class="season-page-subtitle">${pageSubtitle(months)}</div>
      </div>
      ${tableHtml(months)}
    </div>`).join('')}
  </div>`;

  box.innerHTML=screen+print;
}
function openSeikoSportsLink(){
  window.open(
    'https://seikosportslink.com/seiko/ssl/sportslink?a=portal&s=as',
    '_blank',
    'noopener,noreferrer'
  );
}

const ALGE_HTTP_URL='http://116.58.169.162/alge/';

async function copyAlgeUrl(){
  try{
    await navigator.clipboard.writeText(ALGE_HTTP_URL);
    return true;
  }catch{
    try{
      const ta=document.createElement('textarea');
      ta.value=ALGE_HTTP_URL;
      ta.setAttribute('readonly','');
      ta.style.position='fixed';
      ta.style.opacity='0';
      document.body.appendChild(ta);
      ta.select();
      const ok=document.execCommand('copy');
      ta.remove();
      return !!ok;
    }catch{
      return false;
    }
  }
}

function openAlgeExternalBrowser(){
  const ua=navigator.userAgent||'';
  const isIOS=/iPad|iPhone|iPod/.test(ua) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  const isAndroid=/Android/i.test(ua);

  // iOS: Chrome has a documented custom URL scheme.
  // This escapes standalone PWA HTTPS-only navigation because Chrome handles the HTTP URL.
  if(isIOS){
    const chromeUrl='googlechrome://116.58.169.162/alge/';
    window.location.href=chromeUrl;

    // If Chrome is not installed, iOS cannot reliably force-open Safari to an arbitrary HTTP URL
    // from a standalone HTTPS PWA. Copy the URL and show a concise fallback.
    setTimeout(async()=>{
      const copied=await copyAlgeUrl();
      alert(
        copied
          ? 'Chromeが起動しない場合は、コピーしたALGE URLをSafariまたはChromeのアドレス欄へ貼り付けて開いてください。'
          : `Chromeが起動しない場合は、SafariまたはChromeで次のURLを開いてください。\\n${ALGE_HTTP_URL}`
      );
    },900);
    return;
  }

  // Android: use an intent URL to request Chrome directly.
  if(isAndroid){
    const intent='intent://116.58.169.162/alge/#Intent;scheme=http;package=com.android.chrome;end';
    window.location.href=intent;
    return;
  }

  // Desktop/other browsers can use the normal HTTP URL.
  window.open(ALGE_HTTP_URL,'_blank','noopener,noreferrer');
}


const ITEM_HELP_ITEMS=[
  {
    title:'HOME',
    body:'選択中のチーム名・シーズンを確認し、年間予定、大会管理、ランキング、選手・チーム設定、会場情報、天気・積雪、レース速報、スキー連盟リンク、全国ポイントランキング、ツール切り替えへ移動できます。直近1週間の予定も確認できます。'
  },
  {
    title:'操作ナビ',
    body:'シーズン設定、チーム設定、選手登録、コーチ登録、大会登録、年間予定の進捗を確認し、未設定の項目へ順番に移動できます。'
  },
  {
    title:'年間予定',
    body:'セルをタップすると「ホームで練習」「ホーム以外で練習」「その他予定設定」を選べます。ホーム練習はチーム設定のメインのスキー場を自動使用し、ホーム以外の練習は練習場所を入力して確定します。その他予定設定では大会・練習・合宿・移動・休養の期間登録や個別編集ができます。大会管理で登録した大会は同日の最上段に表示されます。'
  },
  {
    title:'大会管理',
    body:'SAJ公認大会を取得して登録できるほか、「その他大会追加」から手入力の大会も登録できます。大会ごとに出場選手を所属選手一覧から選択できます。大会名をダブルタップすると確認後に削除できます。登録大会は年間予定にも自動反映されます。'
  },
  {
    title:'チームランキング',
    body:'登録選手の最新SAJポイントを基準に、男子・女子それぞれSL・GS・SGのチーム内ランキングを表示します。シーズン選択には影響されません。選手名から選手詳細へ移動できます。'
  },
  {
    title:'所属選手登録',
    body:'SAJ競技者番号から選手情報を取得して登録できます。加盟団体・性別を指定してSAJポイントリストから複数選手を選択登録することもできます。登録選手の基本情報、最新ポイント、大会履歴を確認・編集できます。'
  },
  {
    title:'チーム設定',
    body:'チーム名、メインのスキー場、所属コーチ、役割を管理できます。チーム名とメインのスキー場は入力すると自動保存されます。メインのスキー場は年間予定の「ホームで練習」で使用します。バックアップ書き出し・読込、全データ削除もここで行います。'
  },
  {
    title:'会場情報',
    body:'選択中シーズンの登録大会をもとに開催会場を一覧表示します。未登録会場は「都道府県名 市町村名 スキー場」で検索し、アプリ内に候補URLを表示します。所在地は修正して再検索でき、複数URL登録にも対応します。'
  },
  {
    title:'天気・積雪',
    body:'登録大会の会場から対応するスキー場候補を選び、天気情報を取得できます。利用にはインターネット接続が必要です。'
  },
  {
    title:'レース速報',
    body:'SEIKO SPORTSLINKとTHA&KS ALGE Timingを開けます。ALGEはiPhone・Androidのホーム画面アプリから外部ブラウザへ渡して表示します。'
  },
  {
    title:'スキー連盟リンク',
    body:'全日本スキー連盟（SAJ）を先頭に、その下を「地域 → 都道府県 → 団体リンク」の順で表示します。市町村・地域スキー連盟／協会は、該当する都道府県の中に階層表示します。'
  },
  {
    title:'全国ポイントランキング TOP30',
    body:'SAJアルペンポイントリストの全国データを取得し、K2／一般、男子／女子、SL／GS／SGごとに上位30名を自動抽出します。シーズン・生年の入力は不要です。'
  },
  {
    title:'ツール切り替え',
    body:'マネージメントツールと、別途用意したセッター向けツールを切り替えるための入口です。'
  },
  {
    title:'バックアップ',
    body:'選手・コーチ・大会・年間予定・チーム設定など、この端末内に保存しているデータをJSONファイルとして書き出せます。別端末への移行時はバックアップ読込で復元できます。'
  }
];

let openedItemHelpIndex=-1;

function renderItemHelp(){
  const box=document.getElementById('itemHelpList');
  if(!box)return;
  box.innerHTML=ITEM_HELP_ITEMS.map((item,i)=>`
    <div class="item-help-item ${openedItemHelpIndex===i?'open':''}">
      <button class="item-help-title" type="button" onclick="toggleItemHelp(${i})">${esc(item.title)}</button>
      <div class="item-help-body">${esc(item.body)}</div>
    </div>
  `).join('');
}

function toggleItemHelp(index){
  openedItemHelpIndex=(openedItemHelpIndex===index)?-1:index;
  renderItemHelp();
}


// ===== v0.13.40 National SAJ point ranking (latest SAJ calendar ZIP) =====
let nationalRankingState={category:'k2',sex:'男',discipline:'SL'};
const nationalRankingCache=new Map();

function nationalRankingKey(){
  const s=nationalRankingState;
  return `${s.category}|${s.sex}|${s.discipline}`;
}

function syncNationalRankingButtons(){
  document.querySelectorAll('[data-ranking-category]').forEach(b=>b.classList.toggle('active',b.dataset.rankingCategory===nationalRankingState.category));
  document.querySelectorAll('[data-ranking-sex]').forEach(b=>b.classList.toggle('active',b.dataset.rankingSex===nationalRankingState.sex));
  document.querySelectorAll('[data-ranking-discipline]').forEach(b=>b.classList.toggle('active',b.dataset.rankingDiscipline===nationalRankingState.discipline));
}
function setNationalRankingCategory(v){
  nationalRankingState.category=v==='general'?'general':'k2';
  syncNationalRankingButtons();
  loadNationalRanking();
}
function setNationalRankingSex(v){
  nationalRankingState.sex=v==='女'?'女':'男';
  syncNationalRankingButtons();
  loadNationalRanking();
}
function setNationalRankingDiscipline(v){
  nationalRankingState.discipline=['SL','GS','SG'].includes(v)?v:'SL';
  syncNationalRankingButtons();
  loadNationalRanking();
}
function nationalRankingAthleteUrl(saj){
  const n=String(saj||'').replace(/\D/g,'');
  return /^\d{7,9}$/.test(n)?`https://sajdb.shikuminet.jp/alpine/biography/${encodeURIComponent(n)}`:'';
}
function openNationalRankingAthlete(saj){
  const u=nationalRankingAthleteUrl(saj);
  if(u)window.open(u,'_blank','noopener,noreferrer');
}
function renderNationalRanking(data){
  const body=document.getElementById('nationalRankingBody');
  const meta=document.getElementById('nationalRankingMeta');
  const status=document.getElementById('nationalRankingStatus');
  if(!body||!meta||!status)return;

  const rows=Array.isArray(data?.ranking)?data.ranking:[];
  const cat=nationalRankingState.category==='k2'?'K2':'一般';
  const sex=nationalRankingState.sex==='男'?'男子':'女子';
  meta.textContent=`${data?.seasonLabel||'シーズン—'} / ${data?.pointListNumber!=null?`SAJポイントリスト No.${data.pointListNumber}`:'ポイントリスト番号—'} / ${cat} / ${sex} / ${nationalRankingState.discipline}${data?.sourceMode==='CALENDAR_LIST_FALLBACK'?' / カレンダー同一No.補完':''}`;
  status.textContent=rows.length?`${rows.length}名を表示（ポイント未取得はランキング対象外）`:'該当するランキングデータがありません。';

  body.innerHTML=rows.map(r=>{
    const saj=String(r.saj||'');
    const safeSaj=encodeURIComponent(saj);
    const birth=r.birth?`Birth ${esc(r.birth)}`:'';
    return `<tr>
      <td class="rank">${esc(String(r.rank??'—'))}</td>
      <td>
        <button class="national-ranking-athlete" type="button" onclick="openNationalRankingAthlete(decodeURIComponent('${safeSaj}'))">${esc(r.name||'氏名不明')}</button>
        <div class="national-ranking-athlete-meta">SAJ ${esc(saj||'—')}${birth?` / ${birth}`:''}</div>
      </td>
      <td>${esc(r.organization||'—')}</td>
      <td>${esc(r.team||'—')}</td>
      <td class="point">${r.point!==null && r.point!==undefined && String(r.point).trim()!=='' && Number.isFinite(Number(r.point))?Number(r.point).toFixed(2):'—'}</td>
    </tr>`;
  }).join('');
}
async function loadNationalRanking(force=false){
  const body=document.getElementById('nationalRankingBody');
  const meta=document.getElementById('nationalRankingMeta');
  const status=document.getElementById('nationalRankingStatus');
  if(!body||!meta||!status)return;
  syncNationalRankingButtons();

  const key=nationalRankingKey();
  if(!force && nationalRankingCache.has(key)){
    renderNationalRanking(nationalRankingCache.get(key));
    return;
  }

  status.textContent='SAJポイントランキングを取得しています…';
  if(!body.children.length)body.innerHTML='<tr><td colspan="5" class="muted">読込中…</td></tr>';

  try{
    const q=new URLSearchParams({
      category:nationalRankingState.category,
      sex:nationalRankingState.sex,
      discipline:nationalRankingState.discipline
    });
    const r=await fetch(`${apiBase()}/api/saj-ranking?${q.toString()}`,{cache:'no-store'});
    const data=await r.json().catch(()=>({}));
    if(!r.ok||!data?.ok)throw new Error(data?.detail?`${data.error||'取得失敗'}：${data.detail}`:(data?.error||`HTTP ${r.status}`));
    nationalRankingCache.set(key,data);
    renderNationalRanking(data);
  }catch(e){
    body.innerHTML='';
    meta.textContent='全国ポイントランキング';
    status.textContent=`取得できませんでした：${String(e?.message||e)}`;
  }
}

function openTab(tabId){
  document.querySelectorAll('nav button[data-tab], .top-action-btn[data-tab]').forEach(x=>x.classList.remove('active'));
  document.querySelectorAll('section').forEach(x=>x.classList.remove('active'));
  const btn=document.querySelector(`nav button[data-tab="${tabId}"], .top-action-btn[data-tab="${tabId}"]`);
  const sec=document.getElementById(tabId);
  if(btn)btn.classList.add('active');
  if(sec)sec.classList.add('active');
  if(tabId==='home')renderHome();
  if(tabId==='operationGuide')renderOperationGuide();
  if(tabId==='itemHelp')renderItemHelp();
  if(tabId==='venues')renderVenues();
  if(tabId==='weather')renderWeatherVenues();
  if(tabId==='nationalRanking')loadNationalRanking();
  window.scrollTo(0,0);
}
document.querySelectorAll('nav button[data-tab]').forEach(b=>b.onclick=()=>openTab(b.dataset.tab));


// ===== v0.13.39 Weather / Team Board =====
const PREF_REGION={
  '北海道':'北海道',
  '青森':'東北','岩手':'東北','宮城':'東北','秋田':'東北','山形':'東北','福島':'東北',
  '茨城':'関東','栃木':'関東','群馬':'関東','埼玉':'関東','千葉':'関東','東京':'関東','神奈川':'関東',
  '新潟':'甲信越','山梨':'甲信越','長野':'甲信越',
  '富山':'北陸','石川':'北陸','福井':'北陸',
  '岐阜':'東海','静岡':'東海','愛知':'東海','三重':'東海',
  '滋賀':'近畿','京都':'近畿','大阪':'近畿','兵庫':'近畿','奈良':'近畿','和歌山':'近畿',
  '鳥取':'中国','島根':'中国','岡山':'中国','広島':'中国','山口':'中国',
  '徳島':'四国','香川':'四国','愛媛':'四国','高知':'四国',
  '福岡':'九州・沖縄','佐賀':'九州・沖縄','長崎':'九州・沖縄','熊本':'九州・沖縄','大分':'九州・沖縄','宮崎':'九州・沖縄','鹿児島':'九州・沖縄','沖縄':'九州・沖縄'
};
const WEATHER_VENUE_PREF={
  '岩手高原スノーパーク':'岩手','雫石スキー場':'岩手','安比高原スキー場':'岩手','花輪スキー場（アルパス）':'秋田','たざわ湖スキー場':'秋田',
  '赤倉温泉スキー場':'山形','蔵王ライザワールド':'山形','猪苗代スキー場':'福島','フェアリーランドかねやまスキー場':'福島',
  'カムイスキーリンクス':'北海道','ぬかびら源泉郷スキー場':'北海道','サッポロテイネ':'北海道','富良野スキー場':'北海道','ルスツリゾート':'北海道',
  'スノーパーク尾瀬戸倉':'群馬','丸沼高原スキー場':'群馬','川場スキー場':'群馬',
  '菅平高原パインビークスキー場':'長野','野沢温泉スキー場':'長野','志賀高原スキー場':'長野','戸隠スキー場':'長野','白馬八方尾根スキー場':'長野','よませ温泉スキー場':'長野',
  'ロッテアライリゾート':'新潟','赤倉観光リゾートスキー場':'新潟','苗場スキー場':'新潟',
  'あわすのスキー場':'富山','白峰アルペン競技場':'石川','たいらスキー場':'富山','IOX-AROSA':'富山',
  'ほおのき平スキー場':'岐阜','モンデウス飛騨位山スノーパーク':'岐阜','高鷲スノーパーク':'岐阜','ダイナランド':'岐阜',
  'ハチ・ハチ北スキー場':'兵庫','グランスノー奥伊吹':'滋賀',
  'だいせんホワイトリゾート':'鳥取','若桜氷ノ山スキー場':'鳥取','ユートピアサイオト':'広島',
  '石鎚スキー場':'愛媛'
};
function normalizePrefecture(v){
  return String(v||'').replace(/\s/g,'').replace(/[都道府県]$/,'');
}
function matchOfficialVenue(place){
  const text=String(place||'').toLowerCase();
  return VENUE_OFFICIAL_REGISTRY.find(v=>(v.keys||[]).some(k=>text.includes(String(k).toLowerCase())))||null;
}
function uniqueRegisteredVenues(){
  const start=Number(db.team?.scheduleSeasonYear)||currentSeasonStartYear();
  const seen=new Set(), out=[];
  (db.events||[]).forEach(e=>{
    if(eventSeasonStartYear(e)!==start || !e.place)return;
    const key=String(e.place).trim().toLowerCase();
    if(seen.has(key))return;
    seen.add(key);
    const matched=matchOfficialVenue(e.place);
    const pref=normalizePrefecture(e.prefecture||WEATHER_VENUE_PREF[matched?.name]||'');
    const region=PREF_REGION[pref]||matched?.region||'';
    out.push({place:String(e.place).trim(),prefecture:pref,region,title:e.title||'',matchedName:matched?.name||''});
  });
  return out;
}
const WEATHER_GEO_CACHE_KEY='alpine_team_manager_weather_geo_v1';

function weatherGeoCache(){
  try{return JSON.parse(localStorage.getItem(WEATHER_GEO_CACHE_KEY)||'{}')||{};}
  catch{return{};}
}
function saveWeatherGeoCache(cache){
  try{localStorage.setItem(WEATHER_GEO_CACHE_KEY,JSON.stringify(cache));}catch{}
}
function weatherCandidateAliases(x){
  const out=[x.name,...(x.keys||[])];
  const stripped=String(x.name||'')
    .replace(/（.*?）/g,'')
    .replace(/スキー場/g,'')
    .replace(/スノーパーク/g,'')
    .replace(/スキーリンクス/g,'')
    .replace(/リゾート/g,'')
    .trim();
  if(stripped)out.push(stripped);
  return [...new Set(out.map(v=>String(v||'').trim()).filter(Boolean))];
}
function weatherCandidatesForVenue(v){
  if(!v)return[];
  const pref=normalizePrefecture(v.prefecture);
  let arr=VENUE_OFFICIAL_REGISTRY.map(x=>({
    name:x.name,
    region:x.region||'',
    prefecture:normalizePrefecture(WEATHER_VENUE_PREF[x.name]||''),
    keys:x.keys||[]
  }));
  if(pref){
    const byPref=arr.filter(x=>x.prefecture===pref);
    if(byPref.length)arr=byPref;
    else if(v.region)arr=arr.filter(x=>x.region===v.region);
  }else if(v.region){
    arr=arr.filter(x=>x.region===v.region);
  }
  const matched=matchOfficialVenue(v.place);
  if(matched && !arr.some(x=>x.name===matched.name)){
    arr.unshift({name:matched.name,region:matched.region||v.region,prefecture:normalizePrefecture(WEATHER_VENUE_PREF[matched.name]||pref),keys:matched.keys||[]});
  }
  arr.sort((a,b)=>{
    const am=matched&&a.name===matched.name?0:1, bm=matched&&b.name===matched.name?0:1;
    return am-bm||a.name.localeCompare(b.name,'ja');
  });
  return arr;
}
function waitWeatherGeo(ms){return new Promise(r=>setTimeout(r,ms));}

async function resolveWeatherCandidate(candidate,venue){
  const pref=normalizePrefecture(candidate.prefecture||venue?.prefecture||'');
  const cache=weatherGeoCache();
  const cacheKey=`${candidate.name}|${pref}`;
  const cached=cache[cacheKey];
  if(cached && Number.isFinite(cached.latitude) && Number.isFinite(cached.longitude)){
    return {...candidate,...cached};
  }

  const aliases=weatherCandidateAliases(candidate);
  const queries=[];
  for(const alias of aliases){
    if(pref)queries.push(`${alias}, ${pref}県`);
    queries.push(alias);
  }

  // Prefer OpenStreetMap/Nominatim because resort/facility names are indexed
  // more reliably than city-only geocoders. Limit attempts to avoid excess traffic.
  for(const q of [...new Set(queries)].slice(0,4)){
    try{
      const url=`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&countrycodes=jp&accept-language=ja&q=${encodeURIComponent(q)}`;
      const r=await fetch(url,{headers:{'Accept':'application/json'}});
      if(r.ok){
        const list=await r.json();
        if(Array.isArray(list) && list.length){
          const wantedPref=pref;
          const hit=list.find(n=>{
            const dn=String(n.display_name||'');
            if(!wantedPref)return true;
            return dn.includes(wantedPref) || dn.includes(wantedPref+'県');
          }) || list[0];
          const latitude=Number(hit.lat), longitude=Number(hit.lon);
          if(Number.isFinite(latitude)&&Number.isFinite(longitude)){
            const resolved={
              latitude,longitude,
              resolvedName:candidate.name,
              geocodeName:String(hit.name||candidate.name),
              geocodeLabel:String(hit.display_name||'')
            };
            cache[cacheKey]=resolved;
            saveWeatherGeoCache(cache);
            return {...candidate,...resolved};
          }
        }
      }
    }catch{}
    await waitWeatherGeo(250);
  }

  // Final fallback: Open-Meteo GeoNames geocoding using short aliases.
  // Only accept Japanese results and, where possible, the requested prefecture.
  for(const alias of aliases.slice(0,3)){
    try{
      const q=pref?`${alias}, ${pref}県`:alias;
      const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&language=ja&countryCode=JP&format=json`);
      if(!r.ok)continue;
      const j=await r.json(), results=j.results||[];
      const hit=results.find(x=>!pref || normalizePrefecture(x.admin1)===pref);
      if(hit && Number.isFinite(Number(hit.latitude)) && Number.isFinite(Number(hit.longitude))){
        const resolved={
          latitude:Number(hit.latitude),longitude:Number(hit.longitude),
          resolvedName:candidate.name,
          geocodeName:String(hit.name||candidate.name),
          geocodeLabel:[hit.name,hit.admin1].filter(Boolean).join(' / ')
        };
        cache[cacheKey]=resolved;
        saveWeatherGeoCache(cache);
        return {...candidate,...resolved};
      }
    }catch{}
  }
  return null;
}

let weatherCandidateRequestId=0;
async function renderWeatherSkiAreas(v){
  const ski=document.getElementById('weatherSkiArea');
  const info=document.getElementById('weatherFilterInfo');
  const status=document.getElementById('weatherStatus');
  if(!ski)return;

  const requestId=++weatherCandidateRequestId;
  if(!v){
    ski.innerHTML='<option value="">大会会場を先に選択</option>';
    ski.dataset.candidates='[]';
    if(info)info.textContent='';
    return;
  }

  const raw=weatherCandidatesForVenue(v);
  ski.disabled=true;
  ski.innerHTML='<option value="">取得可能なスキー場を確認中…</option>';
  ski.dataset.candidates='[]';
  if(status)status.textContent='スキー場候補の位置情報を確認しています…';
  if(info){
    const scope=v.prefecture?`${v.prefecture}県`:(v.region||'登録会場周辺');
    info.textContent=`${scope} の候補 ${raw.length}件から、天気取得可能なスキー場だけを確認しています。`;
  }

  const resolved=[];
  // Sequential resolution keeps requests modest and avoids temporary rate limiting.
  for(let i=0;i<raw.length;i++){
    if(requestId!==weatherCandidateRequestId)return;
    if(status)status.textContent=`スキー場候補を確認中… ${i+1}/${raw.length}`;
    const hit=await resolveWeatherCandidate(raw[i],v);
    if(hit)resolved.push(hit);
  }

  if(requestId!==weatherCandidateRequestId)return;
  ski.disabled=false;
  ski.dataset.candidates=JSON.stringify(resolved);

  if(!resolved.length){
    ski.innerHTML='<option value="">取得可能な候補が見つかりません</option>';
    if(info)info.textContent='この会場周辺では位置情報を確認できるスキー場候補が見つかりませんでした。';
    if(status)status.textContent='大会会場名の登録内容を確認してください。';
    return;
  }

  ski.innerHTML='<option value="">スキー場を選択</option>'+resolved.map((x,i)=>
    `<option value="${i}">${esc(x.name)}${x.prefecture?'（'+esc(x.prefecture)+'）':''}</option>`
  ).join('');

  const matched=matchOfficialVenue(v.place);
  if(matched){
    const idx=resolved.findIndex(x=>x.name===matched.name);
    if(idx>=0)ski.value=String(idx);
  }else if(resolved.length===1){
    ski.value='0';
  }

  if(info){
    info.textContent=`${raw.length}候補のうち、位置情報を確認できた ${resolved.length}件だけを表示しています。`;
  }
  if(status){
    status.textContent='候補一覧は位置情報確認済みです。スキー場を選択して「天気を取得」を押してください。';
  }
}

function renderWeatherVenues(){
  const sel=document.getElementById('weatherVenue'); if(!sel)return;
  const current=sel.value;
  const venues=uniqueRegisteredVenues();
  sel.innerHTML='<option value="">会場を選択</option>'+venues.map((v,i)=>`<option value="${i}">${esc(v.place)}${v.prefecture?'（'+esc(v.prefecture)+'）':''}</option>`).join('');
  sel.dataset.venues=JSON.stringify(venues);
  if(current && [...sel.options].some(o=>o.value===current))sel.value=current;

  sel.onchange=async()=>{
    const list=JSON.parse(sel.dataset.venues||'[]');
    const v=list[Number(sel.value)];
    await renderWeatherSkiAreas(v||null);
  };

  if(sel.value){
    const list=JSON.parse(sel.dataset.venues||'[]');
    renderWeatherSkiAreas(list[Number(sel.value)]||null);
  }else renderWeatherSkiAreas(null);
}

function weatherLabel(code){
  if(code===0)return'快晴'; if([1,2].includes(code))return'晴れ・薄曇り'; if(code===3)return'曇り';
  if([45,48].includes(code))return'霧'; if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return'雨';
  if([71,73,75,77,85,86].includes(code))return'雪'; if([95,96,99].includes(code))return'雷'; return'—';
}

async function loadVenueWeather(){
  const status=document.getElementById('weatherStatus'), cards=document.getElementById('weatherCards');
  const venueSel=document.getElementById('weatherVenue');
  const skiSel=document.getElementById('weatherSkiArea');
  let venues=[]; try{venues=JSON.parse(venueSel?.dataset.venues||'[]')}catch{}
  let candidates=[]; try{candidates=JSON.parse(skiSel?.dataset.candidates||'[]')}catch{}
  const venue=venues[Number(venueSel?.value)];
  const ski=candidates[Number(skiSel?.value)];

  if(!venue){status.textContent='登録大会の会場を選択してください。';return;}
  if(!ski){status.textContent='位置情報確認済みの候補からスキー場を選択してください。';return;}
  if(!Number.isFinite(Number(ski.latitude))||!Number.isFinite(Number(ski.longitude))){
    status.textContent='この候補の位置情報がありません。会場を選び直してください。';return;
  }

  status.textContent=`${ski.name} の天気予報を取得しています…`;
  cards.innerHTML='';
  try{
    const u=`https://api.open-meteo.com/v1/forecast?latitude=${ski.latitude}&longitude=${ski.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,snowfall_sum,wind_speed_10m_max,wind_gusts_10m_max&wind_speed_unit=ms&timezone=Asia%2FTokyo&forecast_days=7`;
    const wr=await fetch(u), w=await wr.json();
    if(!wr.ok||!w.daily)throw new Error('天気予報を取得できませんでした。');

    status.textContent=`${ski.name}${ski.geocodeName&&ski.geocodeName!==ski.name?' / '+ski.geocodeName:''}　7日間予報`;
    cards.innerHTML=w.daily.time.map((d,i)=>`<div class="card" style="margin:0">
      <strong>${esc(d)}</strong><div style="font-size:20px;margin:7px 0">${weatherLabel(w.daily.weather_code[i])}</div>
      <div>気温 ${w.daily.temperature_2m_min[i]}〜${w.daily.temperature_2m_max[i]}℃</div>
      <div>降水確率 ${w.daily.precipitation_probability_max[i]??'—'}%</div>
      <div>予想降雪 ${w.daily.snowfall_sum[i]??0} cm</div>
      <div>最大風速 ${w.daily.wind_speed_10m_max[i]??'—'} m/s</div>
      <div class="muted">最大瞬間風速 ${w.daily.wind_gusts_10m_max[i]??'—'} m/s</div>
    </div>`).join('');
  }catch(e){
    status.textContent=e.message||'天気情報の取得に失敗しました。';
  }
}

function homeYmd(d){
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function homeDateLabel(ds){
  const d=new Date(ds+'T00:00:00');
  if(Number.isNaN(d.getTime()))return ds;
  const w=['日','月','火','水','木','金','土'][d.getDay()];
  return `${d.getMonth()+1}/${d.getDate()}（${w}）`;
}
function homeDateColor(ds){
  const d=new Date(ds+'T00:00:00');
  if(Number.isNaN(d.getTime()))return'inherit';
  if(JP_HOLIDAYS.has(ds) || d.getDay()===0)return'#d40000';
  if(d.getDay()===6)return'#0066cc';
  return'inherit';
}
function renderHome(){
  const wrap=document.getElementById('homeWeekSchedule');
  if(!wrap)return;
  const today=new Date();
  today.setHours(0,0,0,0);
  const end=new Date(today);
  end.setDate(end.getDate()+6);
  const from=homeYmd(today), to=homeYmd(end);

  const map=new Map();
  const add=(date,title,sub='')=>{
    if(!date || date<from || date>to)return;
    if(!map.has(date))map.set(date,[]);
    map.get(date).push({title,sub});
  };

  (db.schedules||[]).forEach(x=>{
    add(x.date,x.title||x.type||'予定',[x.place,x.coach?`コーチ：${x.coach}`:''].filter(Boolean).join(' / '));
  });

  (db.events||[]).forEach(x=>{
    const s=x.start||'', e=x.end||s;
    if(!s)return;
    let d=new Date(s+'T00:00:00');
    const last=new Date((e||s)+'T00:00:00');
    if(Number.isNaN(d.getTime())||Number.isNaN(last.getTime()))return;
    while(d<=last){
      add(homeYmd(d),x.title||'大会',x.place||'');
      d.setDate(d.getDate()+1);
    }
  });

  const rows=[];
  for(let i=0;i<7;i++){
    const d=new Date(today); d.setDate(d.getDate()+i);
    const ds=homeYmd(d);
    const items=map.get(ds)||[];
    rows.push(`<div class="home-week-row">
      <div class="home-week-date" style="color:${homeDateColor(ds)}">${homeDateLabel(ds)}</div>
      <div>${items.length
        ? items.map(x=>`<div style="margin-bottom:5px"><strong>${esc(x.title)}</strong>${x.sub?`<div class="muted">${esc(x.sub)}</div>`:''}</div>`).join('')
        : '<span class="home-week-empty">予定なし</span>'}
      </div>
    </div>`);
  }
  wrap.innerHTML=rows.join('');
}


function renderOperationGuide(){
  const box=document.getElementById('operationGuideStatus');
  if(!box)return;

  db.team=db.team||{};
  const selected=selectedGlobalSeasonYear();
  const seasonConfirmed=Number.isFinite(Number(db.team.globalSeasonYear)) && Number(db.team.globalSeasonYear)>2000;
  const teamDone=!!String(db.team?.name||'').trim();
  const athleteCount=(db.athletes||[]).length;
  const coachCount=(db.coaches||[]).length;
  const eventCount=(db.events||[]).filter(e=>eventSeasonStartYear(e)===selected).length;
  const scheduleCount=(db.schedules||[]).filter(x=>seasonStartYearFromDate(x.date)===selected).length+eventCount;

  const items=[
    {
      title:'シーズン設定',
      sub:seasonConfirmed?`${selected}/${selected+1}シーズン`:'最初に使用するシーズンを選択してください',
      done:seasonConfirmed,
      target:'operationGuide'
    },
    {
      title:'チーム設定',
      sub:teamDone?`チーム名：${db.team.name}`:'チーム名が未設定です',
      done:teamDone,
      target:'settings'
    },
    {
      title:'選手登録',
      sub:athleteCount?`${athleteCount}名登録済み`:'選手がまだ登録されていません',
      done:athleteCount>0,
      target:'athletes'
    },
    {
      title:'コーチ登録',
      sub:coachCount?`${coachCount}名登録済み`:'コーチがまだ登録されていません',
      done:coachCount>0,
      target:'settings'
    },
    {
      title:'大会登録',
      sub:eventCount?`${eventCount}大会登録済み`:'このシーズンの大会がまだ登録されていません',
      done:eventCount>0,
      target:'events'
    },
    {
      title:'年間予定',
      sub:scheduleCount?`${scheduleCount}件の予定があります`:'このシーズンの年間予定がまだ登録されていません',
      done:scheduleCount>0,
      target:'schedule'
    }
  ];

  const next=items.find(x=>!x.done);
  const completed=items.filter(x=>x.done).length;

  box.innerHTML=`
    <div class="operation-guide-season">
      <div class="operation-guide-season-title">STEP 1　シーズンを選択</div>
      <div class="muted">ここで選んだシーズンを、年間予定・大会管理・会場情報などアプリ全体の基準シーズンにします。</div>
      <div class="operation-guide-season-controls">
        <select id="guideSeasonSelect">${globalSeasonOptionsHtml(selected)}</select>
        <button class="btn primary" type="button" onclick="confirmGuideSeason()">このシーズンを使用</button>
      </div>
    </div>

    <div class="operation-guide-next">
      <div class="operation-guide-next-title">次におすすめの操作</div>
      <strong>${next?esc(next.title):'基本設定は完了しています'}</strong>
      <div class="muted" style="margin-top:4px">${next?esc(next.sub):'必要に応じて各設定を確認してください。'}</div>
      ${next && next.target!=='operationGuide'?`<button class="btn primary" type="button" style="margin-top:10px" onclick="openTab('${next.target}')">${esc(next.title)}へ</button>`:''}
    </div>

    <div style="font-weight:900;margin-bottom:9px">設定進捗 ${completed}/6</div>
    <div class="operation-guide-list">
      ${items.map(x=>`
        <div class="operation-guide-row">
          <div>
            <div class="operation-guide-row-title">${esc(x.title)}</div>
            <div class="operation-guide-row-sub">${esc(x.sub)}</div>
            ${x.target!=='operationGuide'?`<button class="btn" type="button" onclick="openTab('${x.target}')">開く</button>`:''}
          </div>
          <div class="operation-guide-state ${x.done?'done':'todo'}">${x.done?'✓ 完了':'△ 未設定'}</div>
        </div>
      `).join('')}
    </div>`;
}
function confirmGuideSeason(){
  const sel=document.getElementById('guideSeasonSelect');
  if(!sel)return;
  applyGlobalSeason(Number(sel.value));
}

function renderAll(){
  
  document.getElementById('teamName').value=db.team.name||'';
  const mainSkiAreaInput=document.getElementById('mainSkiArea');
  if(mainSkiAreaInput)mainSkiAreaInput.value=db.team.mainSkiArea||'';
  initGlobalSeason();renderCoaches();renderAthletes();renderSchedule();renderEvents();renderRanking();refreshSelects();initSajCompetitionSeason();initScheduleSeason();renderSajRegionFilters();renderSajCategoryFilters();renderSajDisciplineFilters();renderVenues();renderWeatherVenues();renderHome();renderBackupStatus();
}

function openScheduleForm(){scheduleForm.classList.remove('hidden')} function closeScheduleForm(){scheduleForm.classList.add('hidden')}
function saveSchedule(){
  db.schedules.push({id:uid(),date:sDate.value,type:sType.value,title:sTitle.value,place:sPlace.value,target:sTarget.value,coach:sCoach.value,note:sNote.value});
  closeScheduleForm();save();
}
function renderSchedule(){ renderScheduleBoard(); }

function openEventForm(){setEventMode('other')} function closeEventForm(){setEventMode(null)}
function saveEvent(){
  db.events.push({id:uid(),title:eTitle.value,start:eStart.value,end:eEnd.value,place:ePlace.value,disc:eDisc.value,deadline:eDeadline.value,
    athleteIds:[],coachIds:[],note:''});
  closeEventForm();save();
}
function renderEvents(){
  eventList.innerHTML=db.events.sort((a,b)=>a.start.localeCompare(b.start)).map(e=>{
    const names=e.athleteIds.map(id=>db.athletes.find(a=>a.id===id)?.name).filter(Boolean);
    const coaches=e.coachIds.map(id=>db.coaches.find(c=>c.id===id)?.name).filter(Boolean);
    return `<div class="card" style="margin:10px 0"><h3>${esc(e.title||'大会')}</h3>
      <div>${fmt(e.start)}${e.end&&e.end!==e.start?'〜'+fmt(e.end):''} / ${esc(e.place||'-')} / ${esc(e.disc||'-')}</div>
      <div class="muted">締切: ${fmt(e.deadline)} / 出場: ${names.join('・')||'未設定'} / 引率: ${coaches.join('・')||'未設定'}</div>
      ${e.sajKey?'<div class="muted">SAJ公認大会カレンダー取得</div>':''}
      <div style="margin-top:8px">${checks}</div></div>`;
  }).join('')||'<div class="muted">大会なし</div>';
}



const SAJ_REGION_STORAGE='snowtech_saj_regions_v2';
const SAJ_COMP_FILTER_STORAGE='alpine_team_manager_saj_comp_filters_v1';
const SAJ_CATEGORIES=[
  {id:'A',name:'A'},
  {id:'B',name:'B'},
  {id:'A_YH',name:'A(YH)'},
  {id:'B_YH',name:'B(YH)'},
  {id:'FIS',name:'FIS'}
];
const SAJ_DISCIPLINES=[
  {id:'SL',name:'SL'},
  {id:'GS',name:'GS'},
  {id:'SG',name:'SG'}
];
const SAJ_REGIONS=[
  {id:'hokkaido',name:'北海道',prefs:['北海道']},
  {id:'tohoku',name:'東北',prefs:['青森県','岩手県','宮城県','秋田県','山形県','福島県']},
  {id:'kanto',name:'関東',prefs:['茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県']},
  {id:'koshinetsu',name:'甲信越',prefs:['新潟県','山梨県','長野県']},
  {id:'hokuriku',name:'北陸',prefs:['富山県','石川県','福井県']},
  {id:'tokai',name:'東海',prefs:['岐阜県','静岡県','愛知県','三重県']},
  {id:'kinki',name:'近畿',prefs:['滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県']},
  {id:'chugoku',name:'中国',prefs:['鳥取県','島根県','岡山県','広島県','山口県']},
  {id:'shikoku',name:'四国',prefs:['徳島県','香川県','愛媛県','高知県']},
  {id:'kyushu',name:'九州・沖縄',prefs:['福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県']}
];

function loadSajRegionState(){
  try{
    const raw=localStorage.getItem(SAJ_REGION_STORAGE);
    if(!raw) return Object.fromEntries(SAJ_REGIONS.map(r=>[r.id,false]));
    const saved=JSON.parse(raw||'{}');
    const state={};
    SAJ_REGIONS.forEach(r=>state[r.id]=saved[r.id]===true);
    return state;
  }catch{
    return Object.fromEntries(SAJ_REGIONS.map(r=>[r.id,false]));
  }
}

let sajRegionState=loadSajRegionState();

function loadSajCompetitionFilterState(){
  const defaults={
    categories:Object.fromEntries(SAJ_CATEGORIES.map(x=>[x.id,true])),
    disciplines:Object.fromEntries(SAJ_DISCIPLINES.map(x=>[x.id,true]))
  };
  try{
    const raw=localStorage.getItem(SAJ_COMP_FILTER_STORAGE);
    if(!raw)return defaults;
    const saved=JSON.parse(raw||'{}');
    for(const x of SAJ_CATEGORIES){
      if(saved?.categories?.[x.id]===false)defaults.categories[x.id]=false;
    }
    for(const x of SAJ_DISCIPLINES){
      if(saved?.disciplines?.[x.id]===false)defaults.disciplines[x.id]=false;
    }
  }catch{}
  return defaults;
}

let sajCompetitionFilterState=loadSajCompetitionFilterState();

function saveSajCompetitionFilterState(){
  localStorage.setItem(SAJ_COMP_FILTER_STORAGE,JSON.stringify(sajCompetitionFilterState));
}

function renderSajCategoryFilters(){
  const el=document.getElementById('sajCategoryFilters');
  if(!el)return;
  el.innerHTML=SAJ_CATEGORIES.map(x=>`
    <label class="check">
      <input type="checkbox" ${sajCompetitionFilterState.categories[x.id]?'checked':''}
        onchange="toggleSajCategory('${x.id}',this.checked)">
      ${x.name}
    </label>`).join('');
}

function renderSajDisciplineFilters(){
  const el=document.getElementById('sajDisciplineFilters');
  if(!el)return;
  el.innerHTML=SAJ_DISCIPLINES.map(x=>`
    <label class="check">
      <input type="checkbox" ${sajCompetitionFilterState.disciplines[x.id]?'checked':''}
        onchange="toggleSajDiscipline('${x.id}',this.checked)">
      ${x.name}
    </label>`).join('');
}

function toggleSajCategory(id,checked){
  if(!(id in sajCompetitionFilterState.categories))return;
  sajCompetitionFilterState.categories[id]=!!checked;
  saveSajCompetitionFilterState();
  renderSajCompetitionCandidates();
}

function toggleSajDiscipline(id,checked){
  if(!(id in sajCompetitionFilterState.disciplines))return;
  sajCompetitionFilterState.disciplines[id]=!!checked;
  saveSajCompetitionFilterState();
  renderSajCompetitionCandidates();
}

function setAllSajCategories(on){
  SAJ_CATEGORIES.forEach(x=>sajCompetitionFilterState.categories[x.id]=!!on);
  saveSajCompetitionFilterState();
  renderSajCategoryFilters();
  renderSajCompetitionCandidates();
}

function setAllSajDisciplines(on){
  SAJ_DISCIPLINES.forEach(x=>sajCompetitionFilterState.disciplines[x.id]=!!on);
  saveSajCompetitionFilterState();
  renderSajDisciplineFilters();
  renderSajCompetitionCandidates();
}

function saveSajRegionState(){
  localStorage.setItem(SAJ_REGION_STORAGE,JSON.stringify(sajRegionState));
}

function renderSajRegionFilters(){
  const el=document.getElementById('sajRegionFilters');
  if(!el)return;
  el.innerHTML=SAJ_REGIONS.map(r=>`
    <label class="check">
      <input type="checkbox" ${sajRegionState[r.id]?'checked':''}
        onchange="toggleSajRegion('${r.id}',this.checked)">
      ${r.name}
    </label>`).join('');
}

function toggleSajRegion(id,checked){
  sajRegionState[id]=!!checked;
  saveSajRegionState();
  renderSajCompetitionCandidates();
}

function setAllSajRegions(on){
  SAJ_REGIONS.forEach(r=>sajRegionState[r.id]=!!on);
  saveSajRegionState();
  renderSajRegionFilters();
  renderSajCompetitionCandidates();
}

function detectSajRegion(place){
  const text=String(place||'');
  for(const r of SAJ_REGIONS){
    if(r.prefs.some(p=>text.includes(p))) return r.id;
  }
  return '';
}

function sajCompetitionVisibleByRegion(c){
  const id=detectSajRegion(c.prefecture||c.place);
  return !!id && sajRegionState[id]===true;
}

function sajCompetitionFieldText(value){
  if(value && typeof value==='object'){
    value=value.name ?? value.label ?? value.code ?? value.value ?? value.id ?? '';
  }
  return String(value??'').trim();
}

function normalizeSajCompetitionCategory(value){
  const raw=sajCompetitionFieldText(value)
    .toUpperCase().replace(/\s+/g,'').replace(/[（]/g,'(').replace(/[）]/g,')');
  if(!raw)return 'OTHER';
  if(/FIS/.test(raw))return 'FIS';
  const baseMatch=raw.match(/(?:^|SAJ-?)(A|B)(?:\(|$)/) || raw.match(/^(A|B)/);
  if(!baseMatch)return 'OTHER';
  const base=baseMatch[1];
  const yhExcluded=/YH(?:除く|除外|以外)|EXCLUD/.test(raw);
  const yh=!yhExcluded && /YH|ユース/.test(raw);
  return yh ? `${base}_YH` : base;
}

function normalizeSajCompetitionDiscipline(value){
  const raw=sajCompetitionFieldText(value).toUpperCase().replace(/[^A-Z]/g,'');
  if(['SL','GS','SG','DH','AC','SC'].includes(raw))return raw;
  if(raw.includes('GIANTSLALOM'))return 'GS';
  if(raw==='SLALOM')return 'SL';
  if(raw.includes('SUPERG'))return 'SG';
  if(raw.includes('DOWNHILL'))return 'DH';
  if(raw.includes('ALPINECOMBINED'))return 'AC';
  if(raw.includes('SUPERCOMBINED'))return 'SC';
  return 'OTHER';
}

function sajCompetitionRaceRows(c){
  if(Array.isArray(c?.races) && c.races.length)return c.races;
  const discs=String(c?.disc||'').split(/[\/・,，\s]+/).map(x=>x.trim()).filter(Boolean);
  return discs.length?discs.map(d=>({category:c?.category||'',discipline:d})):[{category:c?.category||'',discipline:''}];
}

function sajCompetitionVisibleByRaceFilters(c){
  const rows=sajCompetitionRaceRows(c);
  return rows.some(r=>{
    const cat=normalizeSajCompetitionCategory(r?.category);
    const disc=normalizeSajCompetitionDiscipline(r?.discipline);
    return sajCompetitionFilterState.categories[cat]===true &&
           sajCompetitionFilterState.disciplines[disc]===true;
  });
}

function sajCompetitionCategoryLabel(c){
  const ids=[];
  for(const r of sajCompetitionRaceRows(c)){
    const id=normalizeSajCompetitionCategory(r?.category);
    if(!ids.includes(id))ids.push(id);
  }
  const labels=ids.map(id=>SAJ_CATEGORIES.find(x=>x.id===id)?.name||id);
  return labels.join(' / ');
}

let sajCompetitionCache=[];

function currentSkiSeasonCode(){
  const now=new Date();
  return (now.getMonth()+1)>=7 ? now.getFullYear()+1 : now.getFullYear();
}

function initSajCompetitionSeason(){
  const el=document.getElementById('sajCompetitionSeason');
  if(!el)return;
  syncSeasonSelectors();
}
function onSajCompetitionSeasonChange(){
  const el=document.getElementById('sajCompetitionSeason');
  if(!el)return;
  const seasonCode=Number(el.value);
  if(Number.isFinite(seasonCode))applyGlobalSeason(seasonCode-1);
}

function setEventMode(mode){
  const sajBtn=document.getElementById('sajCompetitionToggleBtn');
  const otherBtn=document.getElementById('otherEventToggleBtn');

  if(mode==='saj'){
    initSajCompetitionSeason();
    renderSajRegionFilters();
    renderSajCategoryFilters();
    renderSajDisciplineFilters();
    sajCompetitionPanel.classList.remove('hidden');
    eventForm.classList.add('hidden');
    if(sajBtn)sajBtn.classList.add('primary');
    if(otherBtn)otherBtn.classList.remove('primary');
    editingEventId=null;
    return;
  }

  if(mode==='other'){
    sajCompetitionPanel.classList.add('hidden');
    resetOtherEventForm();
    eventForm.classList.remove('hidden');
    if(sajBtn)sajBtn.classList.remove('primary');
    if(otherBtn)otherBtn.classList.add('primary');
    return;
  }

  sajCompetitionPanel.classList.add('hidden');
  eventForm.classList.add('hidden');
  if(sajBtn)sajBtn.classList.remove('primary');
  if(otherBtn)otherBtn.classList.remove('primary');
  editingEventId=null;
}

function toggleSajCompetitions(){
  const isOpen=!sajCompetitionPanel.classList.contains('hidden');
  setEventMode(isOpen?null:'saj');
}

async function loadSajCompetitions(){
  initSajCompetitionSeason();
  const base=apiBase();
  const season=sajCompetitionSeason.value;
  if(!base){
    alert('SAJ連携サービスを利用できません');
    return;
  }

  sajCompetitionStatus.textContent='SAJ公認アルペン大会を全国から取得中... 0/12月';
  sajCompetitionList.innerHTML='';
  sajCompetitionActions.style.display='none';
  const sajCompetitionActionsTop=document.getElementById('sajCompetitionActionsTop');
  if(sajCompetitionActionsTop)sajCompetitionActionsTop.style.display='none';

  const merged=new Map();
  const failed=[];
  let completed=0;

  try{
    const months=Array.from({length:12},(_,i)=>i+1);
    const concurrency=4;

    for(let i=0;i<months.length;i+=concurrency){
      const batch=months.slice(i,i+concurrency);
      const results=await Promise.all(batch.map(async month=>{
        try{
          const r=await fetch(
            `${base}/api/saj-competitions?season=${encodeURIComponent(season)}&month=${month}`
          );
          const j=await r.json();
          return {month,ok:r.ok&&j.ok,data:j};
        }catch(error){
          return {month,ok:false,error};
        }finally{
          completed++;
          sajCompetitionStatus.textContent=
            `SAJ公認アルペン大会を全国から取得中... ${completed}/12月`;
        }
      }));

      results.forEach(({month,ok,data})=>{
        if(!ok){
          failed.push(`${month}月`);
          return;
        }
        for(const c of (data.competitions||[])){
          const key=c.key||c.url||`${c.title}|${c.start}|${c.place}`;
          if(!merged.has(key))merged.set(key,c);
        }
      });

      sajCompetitionCache=[...merged.values()].sort((a,b)=>
        (a.start||'9999').localeCompare(b.start||'9999') ||
        String(a.title||'').localeCompare(String(b.title||''),'ja')
      );
      renderSajCompetitionCandidates();
    }

    const suffix=failed.length?` / 取得失敗: ${failed.join('・')}`:'';
    sajCompetitionStatus.textContent=
      `${Number(season)-1}/${season}：全国 ${sajCompetitionCache.length}大会を取得${suffix}`;
    sajCompetitionActions.style.display=sajCompetitionCache.length?'flex':'none';
    if(sajCompetitionActionsTop)sajCompetitionActionsTop.style.display=sajCompetitionCache.length?'flex':'none';
  }catch(e){
    sajCompetitionStatus.textContent=`取得失敗：${e.message}`;
  }
}
function renderSajCompetitionCandidates(){
  const filtered=sajCompetitionCache
    .map((c,i)=>({c,i}))
    .filter(x=>sajCompetitionVisibleByRegion(x.c) && sajCompetitionVisibleByRaceFilters(x.c));

  if(!sajCompetitionCache.length){
    sajCompetitionList.innerHTML='<div class="muted">大会情報はありません</div>';
    return;
  }
  if(!filtered.length){
    sajCompetitionList.innerHTML='<div class="muted">現在の地域・カテゴリー・種目条件に該当する大会はありません。</div>';
    return;
  }

  sajCompetitionList.innerHTML=`<div class="muted" style="margin-bottom:6px">表示 ${filtered.length} / 全国取得 ${sajCompetitionCache.length} 大会</div>
  <div style="overflow:auto"><table>
    <thead><tr><th>選択</th><th>詳細</th><th>日程</th><th>大会名</th><th>開催地</th><th>カテゴリー</th><th>種目</th></tr></thead>
    <tbody>${filtered.map(({c,i})=>{
      const exists=db.events.some(e=>e.sajKey && e.sajKey===c.key);
      return `<tr>
        <td><input class="saj-comp-check" type="checkbox" value="${i}" ${exists?'disabled':''}></td>
        <td>${safeSajUrl(c.url)?`<button class="btn primary btn-compact" type="button" onclick="openCompetitionDetail(decodeURIComponent('${encodeURIComponent(safeSajUrl(c.url))}'))">詳細</button>`:'-'}</td>
        <td>${c.end&&c.end!==c.start?`<div>${fmt(c.start)}～</div><div>${fmt(c.end)}</div>`:`<div>${fmt(c.start)}</div>`}</td>
        <td><b>${esc(c.title||'-')}</b>${exists?'<br><span class="status-ok">登録済み</span>':''}</td>
        <td>${esc(c.prefecture||String(c.place||'-').slice(0,3))}</td>
        <td>${esc(sajCompetitionCategoryLabel(c)||'-')}</td>
        <td>${esc(c.disc||'-')}</td>
      </tr>`;
    }).join('')}</tbody>
  </table></div>`;
}
function openCompetitionDetail(url){
  const safe=safeSajUrl(url);
  if(!safe){alert('安全性を確認できないURLのため開けません。');return;}
  window.open(safe,'_blank','noopener,noreferrer');
}

function importSelectedSajCompetitions(){
  const idxs=[...document.querySelectorAll('.saj-comp-check:checked')].map(x=>Number(x.value));
  if(!idxs.length){
    alert('参加希望の大会にチェックを入れてください');
    return;
  }
  let added=0;
  idxs.forEach(i=>{
    const c=sajCompetitionCache[i];
    if(!c)return;
    if(db.events.some(e=>e.sajKey===c.key))return;
    db.events.push({
      id:uid(),
      title:c.title||'SAJ公認大会',
      start:c.start||'',
      end:c.end||c.start||'',
      place:c.place||'',
      prefecture:c.prefecture||'',
      disc:c.disc||'',
      category:sajCompetitionCategoryLabel(c)||'',
      deadline:'',
      athleteIds:[],
      coachIds:[],
      note:'SAJ公認大会カレンダーから取得',
      sajKey:c.key,
      sajUrl:c.url||'',
      sajSeason:c.season||''
    });
    added++;
  });
  save();
  renderSajCompetitionCandidates();
  sajCompetitionStatus.textContent=added>0
    ? `年間予定に反映いたしました（${added}大会）`
    : '選択した大会はすでに登録済みです';
  if(added>0){
    alert('年間予定に反映いたしました');
    sajCompetitionList.innerHTML='';
    sajCompetitionActions.style.display='none';
    const top=document.getElementById('sajCompetitionActionsTop');
    if(top)top.style.display='none';
    setEventMode(null);
  }
}

function openAthleteForm(){athleteForm.classList.remove('hidden')}
function closeAthleteForm(){
  editingAthleteId=null;
  athleteForm.classList.remove('hidden');
  if(document.getElementById('athleteRegisterSimple')) athleteRegisterSimple.classList.remove('hidden');
  if(document.getElementById('athleteEditFields')) athleteEditFields.classList.add('hidden');
}
function saveAthlete(){
  db.athletes.push({id:uid(),saj:aSaj.value,name:aName.value,school:aSchool.value,grade:aGrade.value,
    sl:num(aSL.value),gs:num(aGS.value),sg:num(aSG.value),updated:new Date().toISOString().slice(0,10),results:[]});
  closeAthleteForm();save();
}
function num(v){return v===''?null:Number(v)}
function renderAthletes(){ /* overridden below */ }
let athleteDetailReturnTarget='athletes';

function showAthlete(id,source='athletes'){
  const a=db.athletes.find(x=>x.id===id);
  if(!a)return;

  athleteDetailReturnTarget=source==='ranking'?'ranking':'athletes';

  const backBtn=document.getElementById('athleteDetailBackBtn');
  if(backBtn){
    backBtn.textContent=athleteDetailReturnTarget==='ranking'
      ? '← 選手一覧・チームランキングへ戻る'
      : '← 所属選手一覧へ戻る';
  }

  athleteDetailPage.innerHTML=`<h2>${esc(a.name)}</h2>
    <div class="grid g3">
      <div><b>SAJ No.</b><br>${esc(a.saj||'—')}</div>
      <div><b>生年月日</b><br>${a.birth?fmt(a.birth):'—'}</div>
      <div><b>性別</b><br>${esc(a.sex||'—')}</div>
      <div><b>所属</b><br>${esc(a.school||'—')} ${esc(a.grade||'')}</div>
      <div><b>SL</b><br>${textOrDash(a.sl)}</div>
      <div><b>GS</b><br>${textOrDash(a.gs)}</div>
      <div><b>SG</b><br>${textOrDash(a.sg)}</div>
      <div><b>取得日</b><br>${a.updated?fmt(a.updated):'—'}</div>
      <div><b>PL No.</b><br>${a.pointListNumber!=null?`No.${a.pointListNumber}`:'—'}${a.pointSeasonLabel?`<br><span class="muted">${esc(a.pointSeasonLabel)}</span>`:''}</div>
    </div>
    <div style="margin-top:18px">
      <h3>過去大会成績</h3>

      <div class="athlete-results-desktop">
        <div class="athlete-table-wrap">
          <table>
            <thead><tr><th>日付</th><th>大会</th><th>種目</th><th>順位</th><th>獲得P</th></tr></thead>
            <tbody>${(a.results||[]).map(r=>`<tr>
              <td>${r.date?fmt(r.date):'—'}</td>
              <td>${esc(r.race||r.title||'—')}</td>
              <td>${esc(r.disc||'—')}</td>
              <td>${esc(String(r.rank??'—'))}</td>
              <td>${esc(String(r.point??'—'))}</td>
            </tr>`).join('')||'<tr><td colspan="5">成績データなし</td></tr>'}</tbody>
          </table>
        </div>
      </div>

      <div class="athlete-results-mobile">
        ${(a.results||[]).length
          ? (a.results||[]).map(r=>`
            <div class="athlete-result-card">
              <div class="athlete-result-card-head">
                <div class="athlete-result-date">${r.date?fmt(r.date):'—'}</div>
                <div class="athlete-result-disc">${esc(r.disc||'—')}</div>
              </div>
              <div class="athlete-result-race">${esc(r.race||r.title||'—')}</div>
              <div class="athlete-result-main">
                <div>
                  <div class="athlete-result-label">順位</div>
                  <div class="athlete-result-value rank">${esc(String(r.rank??'—'))}</div>
                </div>
                <div>
                  <div class="athlete-result-label">獲得P</div>
                  <div class="athlete-result-value point">${esc(String(r.point??'—'))}</div>
                </div>
              </div>
            </div>`).join('')
          : '<div class="athlete-results-empty">成績データなし</div>'}
      </div>
    </div>`;

  document.querySelectorAll('main > section').forEach(sec=>sec.classList.remove('active'));
  document.getElementById('athleteDetailScreen').classList.add('active');
  window.scrollTo({top:0,behavior:'smooth'});

  // 大会履歴は選手詳細を開いた時だけ軽量同期する。保存済み履歴は先に表示済み。
  void refreshAthleteResultsOnDetail(id);
}

function backFromAthleteDetail(){
  document.querySelectorAll('main > section').forEach(sec=>sec.classList.remove('active'));
  const target=document.getElementById(athleteDetailReturnTarget==='ranking'?'ranking':'athletes');
  if(target)target.classList.add('active');

  document.querySelectorAll('[data-tab]').forEach(btn=>btn.classList.remove('active'));
  if(athleteDetailReturnTarget==='ranking'){
    const rankingBtn=document.querySelector('[data-tab="ranking"]');
    if(rankingBtn)rankingBtn.classList.add('active');
    renderRanking();
  }

  window.scrollTo({top:0,behavior:'smooth'});
}

function backToAthletes(){
  athleteDetailReturnTarget='athletes';
  backFromAthleteDetail();
}
function mockSajRefresh(){
  db.athletes.forEach(a=>a.updated=new Date().toISOString().slice(0,10));
  alert('モック更新です。実運用ではSAJ公開データ取得API/スクレイパーへ接続します。');save();
}


function athleteAgeYears(birth){
  const m=String(birth||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if(!m)return null;
  const y=Number(m[1]),mo=Number(m[2]),d=Number(m[3]);
  const now=new Date();
  let age=now.getFullYear()-y;
  const beforeBirthday=(now.getMonth()+1<mo)||((now.getMonth()+1===mo)&&now.getDate()<d);
  if(beforeBirthday)age--;
  return Number.isFinite(age) && age>=0 ? age : null;
}

const rankingAthleteNationalRankCache=new Map();
let rankingAthleteNationalRankRequestSeq=0;
const NATIONAL_RANK_CACHE_KEY='alpine_team_manager_national_rank_cache_v1';

function normalizeSajNumberForRank(v){
  const n=String(v||'').replace(/\D/g,'');
  return n? n.padStart(8,'0') : '';
}
function loadNationalRankCacheFromStorage(){
  try{
    const stored=JSON.parse(localStorage.getItem(NATIONAL_RANK_CACHE_KEY)||'null');
    const ranks=stored?.ranks&&typeof stored.ranks==='object'?stored.ranks:{};
    rankingAthleteNationalRankCache.clear();
    Object.entries(ranks).forEach(([saj,info])=>{
      const key=normalizeSajNumberForRank(saj);
      if(key&&info)rankingAthleteNationalRankCache.set(key,info);
    });
    return stored&&typeof stored==='object'?stored:null;
  }catch(e){
    console.warn('全国ランク端末キャッシュ読込失敗',e);
    return null;
  }
}
function nationalRankLatestThursdayStart(now=new Date()){
  const d=new Date(now.getFullYear(),now.getMonth(),now.getDate());
  const diff=(d.getDay()-4+7)%7; // 4 = Thursday
  d.setDate(d.getDate()-diff);
  return d;
}
function currentRegisteredRankSajs(){
  return [...new Set((db.athletes||[]).map(a=>normalizeSajNumberForRank(a?.saj)).filter(Boolean))];
}
function nationalRankCacheNeedsRefresh(stored){
  const sajs=currentRegisteredRankSajs();
  if(!sajs.length)return false;
  if(!stored?.updatedAt)return true;
  if(sajs.some(saj=>!rankingAthleteNationalRankCache.has(saj)))return true;
  const updatedAt=new Date(stored.updatedAt);
  if(Number.isNaN(updatedAt.getTime()))return true;
  return updatedAt<nationalRankLatestThursdayStart();
}
function persistNationalRankCache(updatedAt=new Date().toISOString()){
  const ranks={};
  rankingAthleteNationalRankCache.forEach((info,saj)=>{ranks[saj]=info;});
  try{
    localStorage.setItem(NATIONAL_RANK_CACHE_KEY,JSON.stringify({updatedAt,ranks}));
  }catch(e){
    console.warn('全国ランク端末キャッシュ保存失敗',e);
  }
}
function rankingAthleteRankText(a){
  const saj=normalizeSajNumberForRank(a?.saj);
  const info=rankingAthleteNationalRankCache.get(saj);
  if(!saj)return '全国ランク —';
  if(!info)return '全国ランク 取得中…';
  const cat=info.categoryLabel||'—';
  const r=info.ranks||{};
  const f=v=>Number.isFinite(Number(v))?`${Number(v)}位`:'—';
  return `全国ランク（${cat}）　SL ${f(r.SL)}　GS ${f(r.GS)}　SG ${f(r.SG)}`;
}

async function loadRankingAthleteNationalRanks(force=false){
  const stored=loadNationalRankCacheFromStorage();
  if(!force && !nationalRankCacheNeedsRefresh(stored)){
    renderRankingAthleteList(false);
    return true;
  }
  if(!navigator.onLine || !apiBase()){
    renderRankingAthleteList(false);
    return false;
  }

  const seq=++rankingAthleteNationalRankRequestSeq;
  const groups=[
    ['男',(db.athletes||[]).filter(a=>normalizeAthleteSex(a.sex)==='男')],
    ['女',(db.athletes||[]).filter(a=>normalizeAthleteSex(a.sex)==='女')]
  ];
  const nextCache=new Map(rankingAthleteNationalRankCache);
  let allOk=true;

  for(const [sex,athletes] of groups){
    const sajs=[...new Set(athletes.map(a=>normalizeSajNumberForRank(a.saj)).filter(Boolean))];
    if(!sajs.length)continue;
    try{
      const q=new URLSearchParams({sex,sajs:sajs.join(',')});
      const r=await fetch(`${apiBase()}/api/saj-athlete-ranks?${q.toString()}`,{cache:'no-store'});
      const data=await r.json().catch(()=>({}));
      if(!r.ok||!data?.ok)throw new Error(data?.detail||data?.error||`HTTP ${r.status}`);
      if(seq!==rankingAthleteNationalRankRequestSeq)return false;
      const returned=new Set();
      (data.athletes||[]).forEach(x=>{
        const saj=normalizeSajNumberForRank(x.saj);
        if(!saj)return;
        returned.add(saj);
        nextCache.set(saj,x);
      });
      // APIで順位対象外の選手も「取得済み」として保持し、毎起動時の再通信を防ぐ。
      sajs.filter(saj=>!returned.has(saj)).forEach(saj=>nextCache.set(saj,{categoryLabel:'—',ranks:{SL:null,GS:null,SG:null}}));
    }catch(e){
      allOk=false;
      console.warn('所属選手全国ランク取得失敗',sex,e);
    }
  }

  if(seq!==rankingAthleteNationalRankRequestSeq)return false;
  if(allOk){
    rankingAthleteNationalRankCache.clear();
    nextCache.forEach((info,saj)=>rankingAthleteNationalRankCache.set(saj,info));
    persistNationalRankCache();
  }else{
    // 取得失敗時は端末保存済みの前回データを維持し、次回起動時に再試行する。
    loadNationalRankCacheFromStorage();
  }
  renderRankingAthleteList(false);
  return allOk;
}

function renderRankingAthleteList(loadRanks=true){
  const box=document.getElementById('rankingAthleteList');
  if(!box)return;

  const athletes=[...(db.athletes||[])];

  const ageSort=(a,b)=>{
    const ab=String(a.birth||'9999-12-31');
    const bb=String(b.birth||'9999-12-31');
    const birthDiff=ab.localeCompare(bb);
    if(birthDiff)return birthDiff; // 年長 -> 年少
    return String(a.name||'').localeCompare(String(b.name||''),'ja');
  };

  const renderRows=(arr)=>arr.sort(ageSort).map(a=>{
    const age=athleteAgeYears(a.birth);
    const id=encodeURIComponent(String(a.id||''));
    const school=[a.school||'',a.grade||''].filter(Boolean).join(' ');
    return `<div class="ranking-athlete-overview-row">
      <div class="ranking-athlete-overview-name">
        <div class="ranking-athlete-name-line">
          <button type="button" onclick="showAthlete(decodeURIComponent('${id}'),'ranking')">${esc(a.name||'氏名未設定')}</button>
          <span class="ranking-athlete-national-rank">${esc(rankingAthleteRankText(a))}</span>
        </div>
      </div>
      <div class="ranking-athlete-overview-age">${age===null?'年齢—':`${age}歳`}</div>
      <div class="ranking-athlete-overview-meta">
        ${a.birth?fmt(a.birth):'生年月日—'}${school?` / ${esc(school)}`:''}<br>
        SAJ No. ${esc(a.saj||'—')}
      </div>
    </div>`;
  }).join('');

  const male=athletes.filter(a=>normalizeAthleteSex(a.sex)==='男');
  const female=athletes.filter(a=>normalizeAthleteSex(a.sex)==='女');
  const other=athletes.filter(a=>!['男','女'].includes(normalizeAthleteSex(a.sex)));

  if(!athletes.length){
    box.innerHTML='<div class="muted">所属選手が登録されていません</div>';
    return;
  }

  let html='';
  if(male.length){
    html+=`<div class="ranking-athlete-group-title">男子</div>${renderRows(male)}`;
  }
  if(female.length){
    html+=`<div class="ranking-athlete-group-title">女子</div>${renderRows(female)}`;
  }
  if(other.length){
    html+=`<div class="ranking-athlete-group-title">性別未設定</div>${renderRows(other)}`;
  }
  box.innerHTML=html;
  if(loadRanks)loadRankingAthleteNationalRanks();
}

function renderRanking(){
  renderRankingAthleteList();
  const renderGroup=(sex,prefix)=>{
    ['SL','GS','SG'].forEach(d=>{
      const key=d.toLowerCase();

      // Keep every registered athlete of this sex visible.
      // Athletes with a valid point are ranked first; missing points stay visible at the bottom.
      const arr=(db.athletes||[])
        .filter(a=>normalizeAthleteSex(a.sex)===sex)
        .sort((a,b)=>{
          const ap=rankingPointNumber(a[key]);
          const bp=rankingPointNumber(b[key]);
          if(ap!==bp)return ap-bp;
          return String(a.name||'').localeCompare(String(b.name||''),'ja');
        });

      const el=document.getElementById(prefix+d);
      if(!el)return;

      let rank=0;
      el.innerHTML=arr.map(a=>{
        const hasPoint=validRankingPoint(a[key]);
        const pointText=hasPoint ? String(a[key]) : '—';
        const rankText=hasPoint ? `${++rank}.` : '—';
        return `<div class="list-item"><b>${rankText} <button class="ranking-athlete-link" type="button" onclick='showAthlete(${JSON.stringify(a.id)},"ranking")'>${esc(a.name||'氏名未設定')}</button></b><span class="muted" style="margin-left:8px">${a.birth?fmt(a.birth):'—'}</span><span style="float:right;font-weight:800">${esc(pointText)}</span><br><span class="muted">SAJ No. ${esc(a.saj||'—')} / ${esc(a.school||'')} ${esc(a.grade||'')}${hasPoint?'':' / ポイント未取得'}</span></div>`;
      }).join('')||'<span class="muted">登録選手なし</span>';
    });
  };
  renderGroup('男','rankMale');
  renderGroup('女','rankFemale');
}

function renderCoaches(){
  coachList.innerHTML=db.coaches.map(c=>`<div class="list-item"><b>${esc(c.name||'—')}</b><br><span class="muted">${esc(c.role||'')}</span></div>`).join('')||'<span class="muted">未登録</span>';
}
function addCoach(){if(!coachName.value)return;db.coaches.push({id:uid(),name:coachName.value,role:coachRole.value});coachName.value='';coachRole.value='';save()}
function saveTeam(){db.team.name=teamName.value;save();alert('設定を保存しました')}

let teamNameSaveTimer=null;
function autoSaveTeamName(immediate=false){
  if(teamNameSaveTimer){
    clearTimeout(teamNameSaveTimer);
    teamNameSaveTimer=null;
  }
  const run=()=>{
    const input=document.getElementById('teamName');
    if(!input)return;
    const value=String(input.value||'').trim();
    if((db.team?.name||'')===value)return;
    db.team.name=value;
    persistDb({silent:true});
    renderTopTeamName();
    renderHome();
    renderScheduleBoard();
  };
  if(immediate){
    run();
  }else{
    teamNameSaveTimer=setTimeout(run,350);
  }
}


let mainSkiAreaSaveTimer=null;
function autoSaveMainSkiArea(immediate=false){
  if(mainSkiAreaSaveTimer){
    clearTimeout(mainSkiAreaSaveTimer);
    mainSkiAreaSaveTimer=null;
  }
  const run=()=>{
    const input=document.getElementById('mainSkiArea');
    if(!input)return;
    db.team=db.team||{};
    const value=String(input.value||'').trim();
    if((db.team.mainSkiArea||'')===value)return;
    db.team.mainSkiArea=value;
    persistDb({silent:true});

    // Existing dedicated training-day rows should follow the team's current main ski area.
    (db.schedules||[]).forEach(row=>{
      if(row?.trainingDay && row.trainingLocationType!=='away'){
        row.trainingLocationType='home';
        row.title=value;
        row.place=value;
        row.note=value;
      }
    });
    persistDb({silent:true});
    renderScheduleBoard();
    renderHome();
  };
  if(immediate){
    run();
  }else{
    mainSkiAreaSaveTimer=setTimeout(run,350);
  }
}

function refreshSelects(){
  sCoach.innerHTML='<option value="">未設定</option>'+db.coaches.map(c=>`<option>${esc(c.name||'')}</option>`).join('');
}
const SUPPORTER_UPDATE_SCHEMA='alpine-team-supporter-update-v1';
function supporterEmptyNationalRank(){
  return {categoryLabel:'—',SL:null,GS:null,SG:null};
}
async function fetchSupporterNationalRanks(){
  // Supporter更新ファイルでは、起動時の週次更新で端末に保持した全国ランクを再利用する。
  loadNationalRankCacheFromStorage();
  const result=new Map();
  currentRegisteredRankSajs().forEach(saj=>{
    const info=rankingAthleteNationalRankCache.get(saj);
    if(!info)return;
    const ranks=info.ranks||{};
    result.set(saj,{
      categoryLabel:info.categoryLabel||'—',
      SL:Number.isFinite(Number(ranks.SL))?Number(ranks.SL):null,
      GS:Number.isFinite(Number(ranks.GS))?Number(ranks.GS):null,
      SG:Number.isFinite(Number(ranks.SG))?Number(ranks.SG):null
    });
  });
  return result;
}
function buildSupporterAnnualCalendar(){
  const startYear=selectedGlobalSeasonYear();
  const rangeStart=ymd(startYear,4,1);
  const rangeEnd=ymd(startYear+1,3,31);
  const dayMap=new Map();
  buildSeasonBoardItems().forEach(item=>{
    (item.dates||[]).forEach(date=>{
      if(!date || date<rangeStart || date>rangeEnd)return;
      if(!dayMap.has(date))dayMap.set(date,[]);
      dayMap.get(date).push({
        type:item.type||'練習',
        title:seasonBoardLabel(item)||'',
        place:item.place||'',
        note:item.note||'',
        coach:item.coach||'',
        source:item.source||'schedule'
      });
    });
  });
  const days=[...dayMap.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([date,items])=>({date,items}));
  return {
    seasonStartYear:startYear,
    seasonLabel:`${startYear}/${startYear+1}`,
    rangeStart,
    rangeEnd,
    firstHalf:{start:ymd(startYear,4,1),end:ymd(startYear,9,30),months:[4,5,6,7,8,9]},
    secondHalf:{start:ymd(startYear,10,1),end:ymd(startYear+1,3,31),months:[10,11,12,1,2,3]},
    days
  };
}
async function buildSupporterUpdateEnvelope(){
  // 週次更新が必要な状態なら、最新ランク取得を試してから更新ファイルを作る。
  // 更新済みの週は端末キャッシュだけを使うため追加通信しない。
  await loadRankingAthleteNationalRanks(false);
  const rankMap=await fetchSupporterNationalRanks();
  const storedRankCache=loadNationalRankCacheFromStorage();
  const rankFetchedAt=storedRankCache?.updatedAt||'';
  const athletes=(Array.isArray(db.athletes)?db.athletes:[]).map(a=>{
    const saj=normalizeSajNumberForRank(a?.saj);
    const nr=saj?(rankMap.get(saj)||supporterEmptyNationalRank()):supporterEmptyNationalRank();
    return {
      ...a,
      nationalRank:{
        categoryLabel:nr.categoryLabel,
        SL:nr.SL,
        GS:nr.GS,
        SG:nr.SG,
        fetchedAt:rankFetchedAt
      },
      nationalRanks:{SL:nr.SL,GS:nr.GS,SG:nr.SG},
      nationalRankCategory:nr.categoryLabel
    };
  });
  const annualCalendar=buildSupporterAnnualCalendar();
  return {
    schema:SUPPORTER_UPDATE_SCHEMA,
    version:2,
    exportedAt:new Date().toISOString(),
    teamName:String(db.team?.name||''),
    data:{
      team:db.team||{},
      athletes,
      schedules:Array.isArray(db.schedules)?db.schedules:[],
      events:Array.isArray(db.events)?db.events:[],
      annualCalendar,
      calendar:annualCalendar,
      nationalRankUpdatedAt:rankFetchedAt
    }
  };
}
function supporterUpdateFilename(){
  const stamp=new Date().toISOString().slice(0,10).replaceAll('-','');
  const safe=String(db.team?.name||'AlpineTeam').replace(/[\\/:*?"<>|]/g,'_').trim()||'AlpineTeam';
  return `${safe}_Supporter_Update_${stamp}.txt`;
}
function downloadSupporterUpdateFile(file){
  const url=URL.createObjectURL(file);
  const a=document.createElement('a');
  a.href=url;a.download=file.name;document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
async function shareSupporterUpdateFile(){
  const envelope=await buildSupporterUpdateEnvelope();
  const file=new File([JSON.stringify(envelope)],supporterUpdateFilename(),{type:'text/plain;charset=utf-8'});
  try{
    if(navigator.share && navigator.canShare?.({files:[file]})){
      await navigator.share({
        title:'Alpine Team Supporter データ更新',
        text:'Alpine Team Supporter用のデータ更新ファイルです。\n\nアプリはこちらから開けます。\nhttps://m6jm4s654p-lab.github.io/Alpine-Team-Supporter/',
        files:[file]
      });
      return;
    }
    downloadSupporterUpdateFile(file);
    alert('データ更新ファイルを書き出しました。LINEでこのファイルを送信してください。');
  }catch(e){
    if(e?.name==='AbortError')return;
    downloadSupporterUpdateFile(file);
    alert('共有メニューを使用できなかったため、データ更新ファイルを書き出しました。LINEで送信してください。');
  }
}

function exportJson(){
  db.team=db.team||{};
  db.team.lastBackupAt=new Date().toISOString();
  persistDb({silent:true});

  const stamp=new Date().toISOString().slice(0,10).replaceAll('-','');
  const blob=new Blob([JSON.stringify(db,null,2)],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download=`alpine-team-manager-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  renderBackupStatus();
}
function sanitizeImportedValue(v,depth=0){
  if(depth>12)return null;
  if(v===null || typeof v==='boolean')return v;
  if(typeof v==='number')return Number.isFinite(v)?v:null;
  if(typeof v==='string')return v.slice(0,5000).replace(/\u0000/g,'');
  if(Array.isArray(v))return v.slice(0,5000).map(x=>sanitizeImportedValue(x,depth+1));
  if(typeof v==='object'){
    const out={};
    for(const [k,val] of Object.entries(v)){
      if(k==='__proto__' || k==='prototype' || k==='constructor')continue;
      out[String(k).slice(0,100)]=sanitizeImportedValue(val,depth+1);
    }
    return out;
  }
  return null;
}

const BACKUP_SHARE_PREFIX='atm-share=';
const BACKUP_SHARE_SCHEMA='atm-backup-share-v1';
const BACKUP_SHARE_QUERY='atmShare';

function normalizeImportedDb(parsed){
  if(!parsed || typeof parsed!=='object' || Array.isArray(parsed))throw new Error('形式不正');
  const clean=sanitizeImportedValue(parsed);
  clean.team=(clean.team && typeof clean.team==='object' && !Array.isArray(clean.team))?clean.team:{};
  clean.coaches=Array.isArray(clean.coaches)?clean.coaches:[];
  clean.athletes=Array.isArray(clean.athletes)?clean.athletes:[];
  clean.schedules=Array.isArray(clean.schedules)?clean.schedules:[];
  clean.events=Array.isArray(clean.events)?clean.events:[];
  return clean;
}

function bytesToBase64Url(bytes){
  let binary='';
  const chunk=0x8000;
  for(let i=0;i<bytes.length;i+=chunk){
    binary+=String.fromCharCode(...bytes.subarray(i,i+chunk));
  }
  return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
}
function base64UrlToBytes(text){
  let b64=String(text||'').replace(/-/g,'+').replace(/_/g,'/');
  while(b64.length%4)b64+='=';
  const binary=atob(b64);
  const out=new Uint8Array(binary.length);
  for(let i=0;i<binary.length;i++)out[i]=binary.charCodeAt(i);
  return out;
}
async function compressBackupText(text){
  const raw=new TextEncoder().encode(text);
  if(typeof CompressionStream==='undefined')return `j.${bytesToBase64Url(raw)}`;
  const stream=new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip'));
  const bytes=new Uint8Array(await new Response(stream).arrayBuffer());
  return `g.${bytesToBase64Url(bytes)}`;
}
async function decompressBackupText(encoded){
  const value=String(encoded||'');
  const dot=value.indexOf('.');
  if(dot<1)throw new Error('共有データ形式不正');
  const mode=value.slice(0,dot);
  const bytes=base64UrlToBytes(value.slice(dot+1));
  if(mode==='j')return new TextDecoder().decode(bytes);
  if(mode!=='g' || typeof DecompressionStream==='undefined')throw new Error('このブラウザでは圧縮共有データを展開できません');
  const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  return new TextDecoder().decode(await new Response(stream).arrayBuffer());
}
async function createShortBackupShare(){
  const envelope={schema:BACKUP_SHARE_SCHEMA,exportedAt:new Date().toISOString(),data:db};
  const payload=await compressBackupText(JSON.stringify(envelope));
  const r=await fetch(`${apiBase()}/api/backup-share`,{
    method:'POST',
    headers:{'Content-Type':'application/json','Accept':'application/json'},
    body:JSON.stringify({payload})
  });
  let data={}; try{data=await r.json()}catch{}
  if(!r.ok || !data.ok || !data.id)throw new Error(data.error||`共有リンク作成エラー (${r.status})`);
  return data.id;
}
async function makeBackupShareUrl(){
  const id=await createShortBackupShare();
  const url=new URL(location.href);
  url.searchParams.set(BACKUP_SHARE_QUERY,id);
  url.hash='';
  return url.toString();
}
async function shareBackupLink(){
  try{
    const url=await makeBackupShareUrl();
    const team=(db.team?.name||'Alpine Team Manager').trim();
    const text=`${team} のAlpine Team Managerバックアップです。リンクは7日間有効です。開いて内容を確認後、取り込んでください。`;
    if(navigator.share){
      await navigator.share({title:'Alpine Team Manager バックアップ',text,url});
      return;
    }
    if(navigator.clipboard?.writeText){
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert('共有リンクをコピーしました。LINEに貼り付けて送信してください。');
      return;
    }
    prompt('この共有リンクをコピーしてLINEに貼り付けてください。',url);
  }catch(e){
    if(e?.name==='AbortError')return;
    alert(`共有リンクを作成できませんでした。${e?.message?'\n'+e.message:''}`);
  }
}
function clearBackupShareLocation(){
  const url=new URL(location.href);
  let changed=false;
  if(url.searchParams.has(BACKUP_SHARE_QUERY)){
    url.searchParams.delete(BACKUP_SHARE_QUERY);
    changed=true;
  }
  if(url.hash.startsWith(`#${BACKUP_SHARE_PREFIX}`)){
    url.hash='';
    changed=true;
  }
  if(changed)history.replaceState(null,'',url.pathname+(url.search?url.search:'')+(url.hash?url.hash:''));
}
async function fetchSharedBackupPayload(id){
  const r=await fetch(`${apiBase()}/api/backup-share?id=${encodeURIComponent(id)}`,{headers:{'Accept':'application/json'},cache:'no-store'});
  let data={}; try{data=await r.json()}catch{}
  if(!r.ok || !data.ok || !data.payload)throw new Error(data.error||`共有データ取得エラー (${r.status})`);
  return data.payload;
}
async function importBackupFromShareLink(){
  const current=new URL(location.href);
  const shortId=current.searchParams.get(BACKUP_SHARE_QUERY)||'';
  const legacyEncoded=current.hash.startsWith(`#${BACKUP_SHARE_PREFIX}`)?current.hash.slice(1+BACKUP_SHARE_PREFIX.length):'';
  if(!shortId && !legacyEncoded)return;
  try{
    const encoded=shortId ? await fetchSharedBackupPayload(shortId) : legacyEncoded;
    const raw=await decompressBackupText(encoded);
    if(raw.length>5*1024*1024)throw new Error('バックアップデータが大きすぎます');
    const envelope=JSON.parse(raw);
    if(!envelope || envelope.schema!==BACKUP_SHARE_SCHEMA || !envelope.data)throw new Error('共有リンク形式不正');
    const clean=normalizeImportedDb(envelope.data);
    const team=(clean.team?.name||'名称未設定').trim();
    const athletes=clean.athletes.length;
    const coaches=clean.coaches.length;
    const events=clean.events.length;
    const schedules=clean.schedules.length;
    const ok=confirm(`LINE共有バックアップを検出しました。\n\nチーム：${team}\n選手：${athletes}名\nコーチ：${coaches}名\n大会：${events}件\n年間予定：${schedules}件\n\nこの端末の現在データを置き換えて取り込みますか？`);
    if(!ok){clearBackupShareLocation();return;}
    db=clean;
    if(!persistDb())throw new Error('端末への保存に失敗しました');
    clearBackupShareLocation();
    renderAll();
    alert('共有バックアップの取り込みが完了しました。');
  }catch(e){
    clearBackupShareLocation();
    alert(`共有バックアップを読み込めませんでした。${e?.message?'\n'+e.message:''}`);
  }
}
function importJson(ev){
  const f=ev.target.files[0];if(!f)return;
  if(f.size>5*1024*1024){alert('バックアップファイルが大きすぎます（上限5MB）。');ev.target.value='';return;}
  const r=new FileReader();
  r.onload=()=>{
    try{
      const parsed=JSON.parse(r.result);
      db=normalizeImportedDb(parsed);
      save();
      alert('読込完了');
    }catch{
      alert('バックアップJSONの形式を確認してください');
    }finally{
      ev.target.value='';
    }
  };
  r.readAsText(f);
}

function renderBackupStatus(){
  const el=document.getElementById('backupStatus');
  if(!el)return;
  const raw=db.team?.lastBackupAt||'';
  if(!raw){
    el.className='backup-status danger';
    el.innerHTML='<b>バックアップ書き出し操作：未実施</b><br>端末内のみで管理するため、初回設定後のバックアップを推奨します。';
    return;
  }
  const t=new Date(raw);
  if(Number.isNaN(t.getTime())){
    el.className='backup-status warn';
    el.textContent='バックアップ書き出し操作の日時を確認できません。再度バックアップを書き出してください。';
    return;
  }
  const days=Math.floor((Date.now()-t.getTime())/86400000);
  const date=t.toLocaleDateString('ja-JP');
  if(days>=30){
    el.className='backup-status warn';
    el.innerHTML=`<b>最終バックアップ書き出し操作：${esc(date)}（${days}日前）</b><br>30日以上経過しています。バックアップを推奨します。`;
  }else{
    el.className='backup-status ok';
    el.innerHTML=`<b>最終バックアップ書き出し操作：${esc(date)}</b>`;
  }
}

async function resetAll(){
  if(!confirm('選手・予定・大会・チーム設定をこの端末から削除しますか？'))return;
  if(!confirm('この操作は取り消せません。バックアップ済みであることを確認してから「OK」を押してください。'))return;

  localStorage.removeItem(KEY);
  localStorage.removeItem(NATIONAL_RANK_CACHE_KEY);
  localStorage.removeItem(WEATHER_GEO_CACHE_KEY);
  localStorage.removeItem(SAJ_REGION_STORAGE);
  sessionStorage.removeItem('snowtech_selected_tool');

  if('caches' in window){
    try{
      const keys=await caches.keys();
      await Promise.all(keys.filter(k=>k.startsWith('snowtech-alpine-')).map(k=>caches.delete(k)));
    }catch{}
  }
  location.reload();
}

// ===== v0.2 enhancements =====
let editingScheduleId=null, editingEventId=null, editingAthleteId=null;

function onlineState(){
  const el=document.getElementById('syncState');
  if(!el)return;
  el.textContent=navigator.onLine?'● オンライン / 端末保存':'○ オフライン / 端末保存';
  el.className='sync '+(navigator.onLine?'status-ok':'status-warn');
}
window.addEventListener('online',onlineState);
window.addEventListener('pageshow',()=>{snowtechPrintBusy=false;});
window.addEventListener('offline',onlineState);

function openSajPointList(){
  window.open('https://sajdb.shikuminet.jp/alpine/point/list','_blank','noopener');
}

const _oldRenderAll = renderAll;
renderAll = function(){
  _oldRenderAll();
  onlineState();
};

openScheduleForm = function(){
  editingScheduleId=null;
  sDate.value='';sType.value='大会';sTitle.value='';sPlace.value='';sTarget.value='';sCoach.value='';sNote.value='';
  scheduleForm.classList.remove('hidden');
};
function editSchedule(id){
  const s=db.schedules.find(x=>x.id===id); if(!s)return;
  editingScheduleId=id;
  sDate.value=s.date||'';sType.value=s.type||'その他';sTitle.value=s.title||'';sPlace.value=s.place||'';
  sTarget.value=s.target||'';sCoach.value=s.coach||'';sNote.value=s.note||'';
  scheduleForm.classList.remove('hidden'); scheduleForm.scrollIntoView({behavior:'smooth',block:'start'});
}
saveSchedule = function(){
  const item={date:sDate.value,type:sType.value,title:sTitle.value,place:sPlace.value,target:sTarget.value,coach:sCoach.value,note:sNote.value};
  if(!item.date || !item.title){alert('日付と名称を入力してください');return}
  if(editingScheduleId){
    const i=db.schedules.findIndex(x=>x.id===editingScheduleId);
    if(i>=0) db.schedules[i]={...db.schedules[i],...item};
  }else db.schedules.push({id:uid(),...item});
  editingScheduleId=null; closeScheduleForm(); save();
};
function deleteSchedule(id){
  if(!confirm('この予定を削除しますか？'))return;
  db.schedules=db.schedules.filter(x=>x.id!==id);save();
}
renderSchedule = function(){
  renderScheduleBoard();
};

function resetOtherEventForm(){
  editingEventId=null;
  eTitle.value='';eStart.value='';eEnd.value='';ePlace.value='';eDisc.value='';eDeadline.value='';
}
function toggleOtherEventForm(){
  const isOpen=!eventForm.classList.contains('hidden');
  if(isOpen){
    setEventMode(null);
  }else{
    setEventMode('other');
    eventForm.scrollIntoView({behavior:'smooth',block:'start'});
  }
}
openEventForm = function(){
  setEventMode('other');
};
function editEvent(id){
  const e=db.events.find(x=>x.id===id); if(!e)return;
  editingEventId=id;
  eTitle.value=e.title||'';eStart.value=e.start||'';eEnd.value=e.end||'';ePlace.value=e.place||'';eDisc.value=e.disc||'';eDeadline.value=e.deadline||'';
  eventForm.classList.remove('hidden'); eventForm.scrollIntoView({behavior:'smooth',block:'start'});
}
saveEvent = function(){
  const start=eStart.value;
  const end=eEnd.value||eStart.value;
  const item={
    title:eTitle.value.trim(),
    start,
    end,
    place:ePlace.value.trim(),
    disc:eDisc.value.trim(),
    deadline:eDeadline.value,
    athleteIds:[],
    coachIds:[],
    note:'',
    manualEvent:true,
    seasonStartYear:selectedGlobalSeasonYear()
  };

  if(!item.title || !item.start){
    alert('大会名と開始日を入力してください');
    return;
  }
  if(item.end && item.end<item.start){
    alert('終了日は開始日以降を指定してください');
    return;
  }

  if(editingEventId){
    const i=db.events.findIndex(x=>x.id===editingEventId);
    if(i>=0){
      item.athleteIds=[...(db.events[i].athleteIds||[])];
      item.coachIds=[...(db.events[i].coachIds||[])];
      db.events[i]={...db.events[i],...item};
    }
  }else{
    db.events.push({id:uid(),...item});
  }

  editingEventId=null;
  setEventMode(null);
  persistDb({silent:true});

  // Manual competition must appear immediately everywhere the same as imported SAJ events.
  renderEvents();
  renderScheduleBoard();
  renderHome();
  renderVenueRegisteredList?.();
  renderWeatherVenues?.();

  alert('大会を追加しました。大会一覧と年間予定に反映しました。');
};

let eventAthleteEditingId='';

function sortedTeamAthletes(){
  return [...(db.athletes||[])].sort((a,b)=>{
    const sexOrder=v=>v==='男'?0:v==='女'?1:2;
    const sd=sexOrder(a.sex)-sexOrder(b.sex);
    if(sd)return sd;
    const ad=a.birth||'9999-12-31';
    const bd=b.birth||'9999-12-31';
    const dd=String(ad).localeCompare(String(bd));
    if(dd)return dd;
    return String(a.name||'').localeCompare(String(b.name||''),'ja');
  });
}

function openEventAthleteModal(eventId){
  const e=db.events.find(x=>x.id===eventId);
  if(!e)return;
  eventAthleteEditingId=eventId;

  const modal=document.getElementById('eventAthleteModal');
  const name=document.getElementById('eventAthleteEventName');
  const list=document.getElementById('eventAthleteList');
  if(!modal||!list)return;

  if(name){
    const slashDate=v=>{
      const m=String(v||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);
      return m?`${m[1]}/${m[2]}/${m[3]}`:fmt(v);
    };
    const period=e.end&&e.end!==e.start
      ? `${slashDate(e.start)}～${slashDate(e.end)}`
      : slashDate(e.start);
    name.innerHTML=`<div>${esc(period)}</div><div style="margin-top:3px;font-weight:800;color:#fff">${esc(e.title||'大会')}</div>`;
  }

  const selected=new Set(e.athleteIds||[]);
  const athletes=sortedTeamAthletes();

  list.innerHTML=athletes.length
    ? athletes.map(a=>{
        const id=encodeURIComponent(String(a.id||''));
        return `<label class="event-athlete-item">
          <input class="event-athlete-check" type="checkbox" value="${id}" ${selected.has(a.id)?'checked':''}>
          <span>
            <span class="event-athlete-item-name">${esc(a.name||'—')}</span>
            <span class="event-athlete-item-sub">${esc(a.sex||'—')} / ${esc(a.school||'所属未設定')} ${esc(a.grade||'')}</span>
          </span>
        </label>`;
      }).join('')
    : '<div class="muted">所属選手が登録されていません。先に「選手・チーム設定」から選手を登録してください。</div>';

  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}

function closeEventAthleteModal(){
  const modal=document.getElementById('eventAthleteModal');
  if(!modal)return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  eventAthleteEditingId='';
}

function toggleEventAthletes(on){
  document.querySelectorAll('#eventAthleteList .event-athlete-check')
    .forEach(x=>x.checked=!!on);
}

function saveEventAthleteSelection(){
  const e=db.events.find(x=>x.id===eventAthleteEditingId);
  if(!e)return;

  e.athleteIds=[...document.querySelectorAll('#eventAthleteList .event-athlete-check:checked')]
    .map(x=>decodeURIComponent(x.value))
    .filter(id=>db.athletes.some(a=>a.id===id));

  persistDb({silent:true});
  closeEventAthleteModal();
  renderEvents();
}


const eventTitleTapState=new Map();
const eventTitleDeleteGuard=new Map();
function onEventTitleTap(eventId){
  const now=Date.now();
  const guard=eventTitleDeleteGuard.get(eventId)||0;
  if(now-guard<700)return;

  const prev=eventTitleTapState.get(eventId)||0;
  eventTitleTapState.set(eventId,now);

  if(now-prev<=450){
    eventTitleTapState.delete(eventId);
    eventTitleDeleteGuard.set(eventId,now);
    const e=db.events.find(x=>x.id===eventId);
    if(!e)return;
    if(confirm(`${e.title||'この大会'} を削除しますか？`)){
      db.events=db.events.filter(x=>x.id!==eventId);
      persistDb({silent:true});
      renderAll();
      renderScheduleBoard();
    }
  }
}
function deleteEvent(id){
  if(!confirm('この大会を削除しますか？'))return;
  db.events=db.events.filter(x=>x.id!==id);
  persistDb({silent:true});
  renderAll();
  renderScheduleBoard();
}
renderEvents = function(){
  const season=selectedGlobalSeasonYear();
  const all=[...db.events].sort((a,b)=>(a.start||'').localeCompare(b.start||''));
  const events=all.filter(e=>eventSeasonStartYear(e)===season);

  const info=document.getElementById('eventSeasonInfo');
  if(info)info.textContent=`表示対象：${season}/${season+1}シーズン　${events.length}大会`;

  const md=dateStr=>{
    if(!dateStr)return '—';
    const m=String(dateStr).match(/^\d{4}-(\d{2})-(\d{2})$/);
    return m?`${m[1]}/${m[2]}`:fmt(dateStr);
  };

  let maxChars=0;
  events.forEach(e=>{maxChars=Math.max(maxChars,[...(e.title||'大会')].length);});
  const titleWidth=Math.min(720,Math.max(280,maxChars*14+28));

  const rows=events.map(e=>{
    const period=e.end&&e.end!==e.start
      ? `${md(e.start)}～${md(e.end)}`
      : `${md(e.start)}`;

    const selectedAthletes=(e.athleteIds||[])
      .map(id=>db.athletes.find(a=>a.id===id))
      .filter(Boolean);

    const maleCount=selectedAthletes.filter(a=>a.sex==='男').length;
    const femaleCount=selectedAthletes.filter(a=>a.sex==='女').length;
    const id=encodeURIComponent(String(e.id||''));

    return `<div class="event-simple-row event-two-line-row" style="--event-title-width:min(${titleWidth}px, calc(100vw - 190px))">
      <div class="event-two-detail">${
        safeSajUrl(e.sajUrl)
          ? `<button class="btn primary event-two-btn no-print" onclick="openCompetitionDetail(decodeURIComponent('${encodeURIComponent(safeSajUrl(e.sajUrl))}'))"><span class="stack">詳</span><span class="stack">細</span></button>`
          : `<span class="muted" style="align-self:center;text-align:center">—</span>`
      }</div>

      <div class="event-two-athletes no-print">
        <button class="btn primary event-two-btn" onclick="openEventAthleteModal(decodeURIComponent('${id}'))">
          <span class="stack">選</span><span class="stack">手</span>
        </button>
      </div>

      <div class="event-two-male">男${maleCount}</div>
      <div class="event-two-female">女${femaleCount}</div>

      <div class="event-two-date">${period}</div>

      <div class="event-two-title"
           role="button"
           tabindex="0"
           title="ダブルタップで削除"
           ondblclick="onEventTitleTap(decodeURIComponent('${id}'))"
           ontouchend="onEventTitleTap(decodeURIComponent('${id}'))">
        <div class="event-two-title-name">${esc(e.title||'大会')}</div>
      </div>
    </div>`;
  }).join('');

  eventList.innerHTML=events.length
    ? `<div class="event-list-inner">${rows}</div>`
    : `<div class="muted">${season}/${season+1}シーズンの大会はありません</div>`;

  if(eventPrintList){
    eventPrintList.innerHTML=events.map(e=>{
      const names=(e.athleteIds||[]).map(id=>db.athletes.find(a=>a.id===id)?.name).filter(Boolean);
      const coaches=(e.coachIds||[]).map(id=>db.coaches.find(c=>c.id===id)?.name).filter(Boolean);
      return `<div class="card" style="margin:10px 0">
        <h3>${esc(e.title||'大会')}</h3>
        <div>${fmt(e.start)}${e.end&&e.end!==e.start?'〜'+fmt(e.end):''} / ${esc(e.place||'-')} / ${esc(e.disc||'-')}</div>
        <div class="muted">締切: ${fmt(e.deadline)} / 出場: ${esc(names.join('・')||'未設定')} / 引率: ${esc(coaches.join('・')||'未設定')}</div>
        ${e.note?`<div class="muted" style="margin-top:4px">備考: ${esc(e.note)}</div>`:''}
      </div>`;
    }).join('')||`<div class="muted">${season}/${season+1}シーズンの大会はありません</div>`;
  }
};

openAthleteForm = function(){
  editingAthleteId=null;
  aSaj.value='';aName.value='';aSchool.value='';aGrade.value='';aSL.value='';aGS.value='';aSG.value='';
  athleteForm.classList.remove('hidden');
};
function editAthlete(id){
  const a=db.athletes.find(x=>x.id===id); if(!a)return;
  editingAthleteId=id;
  aSaj.value=a.saj||'';aName.value=a.name||'';aSchool.value=a.school||'';aGrade.value=a.grade||'';
  aBirth.value=a.birth||'';aSex.value=a.sex||'';
  aSL.value=a.sl??'';aGS.value=a.gs??'';aSG.value=a.sg??'';
  athleteForm.classList.remove('hidden');athleteForm.scrollIntoView({behavior:'smooth',block:'start'});
}
saveAthlete = function(){
  const item={saj:aSaj.value.trim(),name:aName.value.trim(),school:aSchool.value.trim(),grade:aGrade.value.trim(),birth:(typeof aBirth!=='undefined'?aBirth.value:''),sex:(typeof aSex!=='undefined'?aSex.value:''),
    sl:num(aSL.value),gs:num(aGS.value),sg:num(aSG.value),updated:new Date().toISOString().slice(0,10)};
  if(!item.saj || !item.name){alert('SAJ登録番号と氏名を入力してください');return}
  const duplicate=db.athletes.find(a=>a.saj===item.saj && a.id!==editingAthleteId);
  if(duplicate){alert('同じSAJ登録番号の選手が登録されています');return}
  if(editingAthleteId){
    const i=db.athletes.findIndex(x=>x.id===editingAthleteId);
    if(i>=0) db.athletes[i]={...db.athletes[i],...item};
  }else db.athletes.push({id:uid(),...item,results:[]});
  editingAthleteId=null;closeAthleteForm();save();
};
function deleteAthlete(id){
  const a=db.athletes.find(x=>x.id===id);if(!a)return;
  if(!confirm(`${a.name} を削除しますか？`))return;
  db.athletes=db.athletes.filter(x=>x.id!==id);
  db.events.forEach(e=>e.athleteIds=e.athleteIds.filter(x=>x!==id));
  save();
}
renderAthletes = function(){
  const rowHtml = a => {
    const id=encodeURIComponent(String(a.id||''));
    return `<tr>
    <td><span class="click" onclick="showAthlete(decodeURIComponent('${id}'))">${esc(a.name||'—')}</span></td>
    <td>${esc(a.sex||'—')}</td>
    <td>${a.birth?fmt(a.birth):'—'}</td>
    <td>${esc(a.school||'—')} ${esc(a.grade||'')}</td>
    <td>${esc(a.saj||'—')}</td>
    <td>${textOrDash(a.sl)}</td><td>${textOrDash(a.gs)}</td><td>${textOrDash(a.sg)}</td>
    <td>${a.updated?fmt(a.updated):'—'}</td>
    <td>${a.pointListNumber!=null?`No.${esc(a.pointListNumber)}`:'—'}${a.pointSeasonLabel?`<br><span class="muted">${esc(a.pointSeasonLabel)}</span>`:''}</td>
    <td><div class="no-print"><button class="btn" onclick="editAthlete(decodeURIComponent('${id}'))">編集</button> <button class="btn danger" onclick="deleteAthlete(decodeURIComponent('${id}'))">削除</button></div></td>
  </tr>`;
  };
  const arr=[...db.athletes].sort((a,b)=>{
    const sexOrder=s=>s==='男'?0:s==='女'?1:2;
    const sexDiff=sexOrder(a.sex)-sexOrder(b.sex);
    if(sexDiff) return sexDiff;

    const ab=a.birth||'9999-12-31';
    const bb=b.birth||'9999-12-31';
    const birthDiff=String(ab).localeCompare(String(bb));
    if(birthDiff) return birthDiff;

    return String(a.name||'').localeCompare(String(b.name||''),'ja');
  });
  athleteRowsAll.innerHTML=arr.map(rowHtml).join('')||'<tr><td colspan="11" class="muted">未登録</td></tr>';
};

function deleteCoach(id){
  const c=db.coaches.find(x=>x.id===id);if(!c)return;
  if(!confirm(`${c.name} を削除しますか？`))return;
  db.coaches=db.coaches.filter(x=>x.id!==id);
  db.events.forEach(e=>e.coachIds=e.coachIds.filter(x=>x!==id));
  save();
}
renderCoaches = function(){
  coachList.innerHTML=db.coaches.map(c=>{
    const id=encodeURIComponent(String(c.id||''));
    return `<div class="list-item">
      <div class="coach-main">
        <span class="coach-name">${esc(c.name||'—')}</span>
        <span class="coach-role">${esc(c.role||'')}</span>
      </div>
      <button class="btn danger no-print coach-delete" onclick="deleteCoach(decodeURIComponent('${id}'))">削除</button>
    </div>`;
  }).join('')||'<span class="muted">未登録</span>';
};

let alpinePdfBusy=false;
function pdfSafeName(v){return String(v||'Alpine_Team_Manager').replace(/[\\/:*?"<>|]/g,'_').trim()||'Alpine_Team_Manager';}
function bytesFromBase64(b64){const bin=atob(b64),out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out;}
function asciiBytes(s){return new TextEncoder().encode(s);}
function joinBytes(parts){const total=parts.reduce((n,p)=>n+p.length,0),out=new Uint8Array(total);let off=0;for(const p of parts){out.set(p,off);off+=p.length;}return out;}
function buildJpegPdf(images){
  const objects=[];const add=(n,parts)=>objects.push({n,bytes:Array.isArray(parts)?joinBytes(parts):asciiBytes(parts)});
  const kids=images.map((_,i)=>`${3+i*3} 0 R`).join(' ');add(1,'<< /Type /Catalog /Pages 2 0 R >>');add(2,`<< /Type /Pages /Count ${images.length} /Kids [${kids}] >>`);
  images.forEach((img,i)=>{const page=3+i*3,image=page+1,content=page+2;add(page,`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /XObject << /Im1 ${image} 0 R >> >> /Contents ${content} 0 R >>`);add(image,[asciiBytes(`<< /Type /XObject /Subtype /Image /Width ${img.width} /Height ${img.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${img.bytes.length} >>\nstream\n`),img.bytes,asciiBytes('\nendstream')]);const cs='q\n595.28 0 0 841.89 0 0 cm\n/Im1 Do\nQ\n';add(content,`<< /Length ${asciiBytes(cs).length} >>\nstream\n${cs}endstream`);});
  objects.sort((a,b)=>a.n-b.n);const parts=[asciiBytes('%PDF-1.4\n%PDF\n')],offsets=[0];let len=parts[0].length;for(const o of objects){offsets[o.n]=len;const pre=asciiBytes(`${o.n} 0 obj\n`),post=asciiBytes('\nendobj\n');parts.push(pre,o.bytes,post);len+=pre.length+o.bytes.length+post.length;}const xo=len,max=objects[objects.length-1].n;let x=`xref\n0 ${max+1}\n0000000000 65535 f \n`;for(let i=1;i<=max;i++)x+=`${String(offsets[i]||0).padStart(10,'0')} 00000 n \n`;x+=`trailer\n<< /Size ${max+1} /Root 1 0 R >>\nstartxref\n${xo}\n%%EOF`;parts.push(asciiBytes(x));return new Blob([joinBytes(parts)],{type:'application/pdf'});
}
const PDF_FONT='"Noto Sans JP","Yu Gothic",Meiryo,sans-serif';
async function canvasToPdfImage(canvas,quality=0.86){
  let blob=null;
  try{
    blob=await new Promise(resolve=>{
      try{canvas.toBlob(b=>resolve(b),'image/jpeg',quality);}
      catch(e){resolve(null);}
    });
  }catch(e){blob=null;}

  // Some PWA/browser combinations can return null from canvas.toBlob().
  // Fall back to dataURL only for that page.
  if(!blob){
    let data='';
    try{data=canvas.toDataURL('image/jpeg',quality);}
    catch(e){throw new Error('PDFページ画像の作成に失敗しました');}
    const b64=(data.split(',')[1]||'');
    if(!b64)throw new Error('PDFページ画像の作成に失敗しました');
    const bytes=bytesFromBase64(b64);
    if(bytes.length<4)throw new Error('PDFページ画像が空です');
    return{width:canvas.width,height:canvas.height,bytes};
  }

  const bytes=new Uint8Array(await blob.arrayBuffer());
  if(bytes.length<4)throw new Error('PDFページ画像が空です');
  return{width:canvas.width,height:canvas.height,bytes};
}
function drawFitText(ctx,text,x,y,maxWidth,fontSize=18,maxLines=2,lineHeight=22){
  ctx.font=`${fontSize}px ${PDF_FONT}`;const chars=[...String(text||'')];let line='',lines=[];for(const ch of chars){const t=line+ch;if(ctx.measureText(t).width>maxWidth&&line){lines.push(line);line=ch;if(lines.length>=maxLines)break;}else line=t;}if(lines.length<maxLines&&line)lines.push(line);if(lines.length===maxLines&&chars.length&&lines.join('').length<String(text||'').length){let l=lines[maxLines-1];while(l&&ctx.measureText(l+'…').width>maxWidth)l=l.slice(0,-1);lines[maxLines-1]=l+'…';}lines.forEach((l,i)=>ctx.fillText(l,x,y+i*lineHeight));return lines.length;
}
function schedulePdfSpec(){
  const startYear=Number(document.getElementById('scheduleSeason')?.value)||currentSeasonStartYear();const showOff=!!document.getElementById('scheduleOffSeason')?.checked;
  const off=[{y:startYear,m:5,label:'5月'},{y:startYear,m:6,label:'6月'},{y:startYear,m:7,label:'7月'},{y:startYear,m:8,label:'8月'},{y:startYear,m:9,label:'9月'},{y:startYear,m:10,label:'10月'}];
  const winter=[{y:startYear,m:11,label:'11月'},{y:startYear,m:12,label:'12月'},{y:startYear+1,m:1,label:'1月'},{y:startYear+1,m:2,label:'2月'},{y:startYear+1,m:3,label:'3月'},{y:startYear+1,m:4,label:'4月'}];
  return{startYear,pages:showOff?[off.slice(0,3),off.slice(3),winter.slice(0,3),winter.slice(3)]:[winter.slice(0,3),winter.slice(3)]};
}
function schedulePdfMap(startYear){
  const map=new Map();buildSeasonBoardItems().forEach(item=>item.dates.forEach(d=>{if(!d)return;const yr=Number(d.slice(0,4));if(yr<startYear||yr>startYear+1)return;if(!map.has(d))map.set(d,[]);map.get(d).push({label:seasonBoardLabel(item),coach:item.coach||'',type:item.type||'練習'});}));return map;
}
async function makeSchedulePdfImages(compact=false){
  const {startYear,pages}=schedulePdfSpec();
  if(!Array.isArray(pages) || !pages.length) throw new Error('年間予定PDFの対象月を作成できません');
  const map=schedulePdfMap(startYear);
  const images=[];

  // Annual schedule has many cells/text elements. Use a smaller canvas than
  // the event PDF to reduce PWA/mobile browser memory usage.
  const W=compact?720:900;
  const H=compact?1018:1273;
  const M=compact?24:30;
  const top=compact?70:86;
  const headH=compact?26:32;
  const rowH=(H-top-M-headH)/31;
  const colW=(W-M*2)/3;
  const scale=W/900;

  for(let pageIndex=0;pageIndex<pages.length;pageIndex++){
    const months=pages[pageIndex];
    const c=document.createElement('canvas');
    c.width=W;c.height=H;
    const ctx=c.getContext('2d',{alpha:false});
    if(!ctx)throw new Error(`年間予定PDF ${pageIndex+1}ページ目の描画領域を作成できません`);

    ctx.fillStyle='#fff';
    ctx.fillRect(0,0,W,H);
    ctx.textBaseline='top';
    ctx.textAlign='left';

    ctx.fillStyle='#111';
    ctx.font=`bold ${Math.max(15,Math.round(18*scale))}px ${PDF_FONT}`;
    ctx.fillText(`${db.team.name||'Alpine Team Manager'} 年間予定表`,M,Math.round(24*scale));

    ctx.font=`${Math.max(10,Math.round(12*scale))}px ${PDF_FONT}`;
    const last=months[months.length-1];
    const sub=`${startYear}/${startYear+1}シーズン　${months[0].y}年${months[0].m}月〜${last.y===months[0].y?'':last.y+'年'}${last.m}月`;
    ctx.fillText(sub,M,Math.round(48*scale));

    ctx.lineWidth=1;
    ctx.strokeStyle='#9a9a9a';

    months.forEach((mo,ci)=>{
      const x=M+ci*colW;
      ctx.fillStyle='#f1f3f5';
      ctx.fillRect(x,top,colW,headH);
      ctx.strokeRect(x,top,colW,headH);
      ctx.fillStyle='#111';
      ctx.font=`bold ${Math.max(11,Math.round(13*scale))}px ${PDF_FONT}`;
      ctx.textAlign='center';
      ctx.fillText(mo.label,x+colW/2,top+Math.round(7*scale));
      ctx.textAlign='left';
    });

    for(let day=1;day<=31;day++){
      const y=top+headH+(day-1)*rowH;
      for(let ci=0;ci<months.length;ci++){
        const mo=months[ci],x=M+ci*colW;

        ctx.fillStyle='#fff';
        ctx.fillRect(x,y,colW,rowH);
        ctx.strokeStyle='#aaa';
        ctx.strokeRect(x,y,colW,rowH);

        if(!validDateParts(mo.y,mo.m,day))continue;

        const ds=ymd(mo.y,mo.m,day);
        const dow=new Date(mo.y,mo.m-1,day).getDay();
        const holiday=JP_HOLIDAYS.has(ds);

        ctx.fillStyle=holiday||dow===0?'#c40000':dow===6?'#005dcc':'#222';
        ctx.font=`bold ${Math.max(8,Math.round(9.5*scale))}px ${PDF_FONT}`;
        ctx.fillText(`${day}日(${JP_WD[dow]})`,x+4,y+3);

        const items=[...(map.get(ds)||[])].sort((a,b)=>scheduleSortPriority(a.type)-scheduleSortPriority(b.type));
        let yy=y+Math.max(14,Math.round(16*scale));
        ctx.fillStyle='#111';

        for(const it of items.slice(0,2)){
          const fs=Math.max(7,Math.round(8*scale));
          ctx.fillStyle=scheduleTypeColor(it.type);
          const pdfLabel=`${it.type}${it.label&&it.label!==it.type?' '+it.label:''}`;
          drawFitText(ctx,pdfLabel,x+4,yy,colW-8,fs,1,Math.max(9,Math.round(10*scale)));
          yy+=Math.max(9,Math.round(10*scale));
          ctx.fillStyle='#111';

          if(it.coach && yy<y+rowH-7){
            ctx.font=`${Math.max(6,Math.round(7*scale))}px ${PDF_FONT}`;
            drawFitText(ctx,`引率：${it.coach}`,x+7,yy,colW-11,Math.max(6,Math.round(7*scale)),1,Math.max(8,Math.round(9*scale)));
            yy+=Math.max(8,Math.round(9*scale));
          }
        }

        if(items.length>2){
          ctx.font=`${Math.max(6,Math.round(7*scale))}px ${PDF_FONT}`;
          ctx.fillText(`ほか${items.length-2}件`,x+6,Math.min(yy,y+rowH-8));
        }
      }
    }

    const img=await canvasToPdfImage(c,compact?0.76:0.82);
    images.push(img);

    // Release canvas backing memory before making the next page.
    c.width=1;c.height=1;
    await new Promise(resolve=>requestAnimationFrame(()=>resolve()));
  }

  return images;
}
async function makeEventPdfImages(){
  const season=selectedGlobalSeasonYear();
  const events=[...db.events]
    .filter(e=>eventSeasonStartYear(e)===season)
    .sort((a,b)=>(a.start||'').localeCompare(b.start||''));

  const pages=[];
  for(let i=0;i<events.length;i+=6)pages.push(events.slice(i,i+6));
  if(!pages.length)pages.push([]);

  const images=[];
  for(let pi=0;pi<pages.length;pi++){
    const chunk=pages[pi],W=1240,H=1754,M=60,c=document.createElement('canvas');
    c.width=W;c.height=H;
    const ctx=c.getContext('2d');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#111';ctx.textBaseline='top';
    ctx.font=`bold 26px ${PDF_FONT}`;
    ctx.fillText(`${db.team.name||'Alpine Team Manager'} 大会スケジュール`,M,45);
    ctx.font=`14px ${PDF_FONT}`;
    ctx.fillText(`${season}/${season+1}シーズン　${pi+1} / ${pages.length}ページ`,M,82);
    let y=120;

    if(!chunk.length){
      ctx.font=`18px ${PDF_FONT}`;
      ctx.fillText(`${season}/${season+1}シーズンの大会なし`,M,y);
    }

    chunk.forEach(e=>{
      const h=230;
      ctx.strokeStyle='#aaa';ctx.strokeRect(M,y,W-M*2,h);
      ctx.font=`bold 20px ${PDF_FONT}`;ctx.fillStyle='#111';
      drawFitText(ctx,e.title||'大会',M+16,y+14,W-M*2-32,20,2,24);
      ctx.font=`15px ${PDF_FONT}`;
      ctx.fillText(`${fmt(e.start)}${e.end&&e.end!==e.start?'〜'+fmt(e.end):''}`,M+16,y+70);
      drawFitText(ctx,`会場：${e.place||'-'}　種目：${e.disc||'-'}`,M+16,y+98,W-M*2-32,14,2,19);
      const names=(e.athleteIds||[]).map(id=>db.athletes.find(a=>a.id===id)?.name).filter(Boolean);
      const coaches=(e.coachIds||[]).map(id=>db.coaches.find(c=>c.id===id)?.name).filter(Boolean);
      ctx.font=`13px ${PDF_FONT}`;
      drawFitText(ctx,`締切：${fmt(e.deadline)}　出場：${names.join('・')||'未設定'}`,M+16,y+142,W-M*2-32,13,2,18);
      drawFitText(ctx,`引率：${coaches.join('・')||'未設定'}${e.note?'　備考：'+e.note:''}`,M+16,y+180,W-M*2-32,13,2,18);
      y+=250;
    });
    images.push(await canvasToPdfImage(c));
  }
  return images;
}
async function validatePdfBlob(blob){
  if(!(blob instanceof Blob) || blob.size<1000)throw new Error('生成されたPDFデータが不完全です');
  const head=new Uint8Array(await blob.slice(0,5).arrayBuffer());
  const sig=String.fromCharCode(...head);
  if(sig!=='%PDF-')throw new Error('PDF形式の生成に失敗しました');
}
function triggerPdfSave(blob,fileName){
  const url=URL.createObjectURL(blob);
  try{
    if(navigator.msSaveOrOpenBlob){
      navigator.msSaveOrOpenBlob(blob,fileName);
      setTimeout(()=>URL.revokeObjectURL(url),3000);
      return;
    }
    const a=document.createElement('a');
    if('download' in a){
      a.href=url;
      a.download=fileName;
      a.style.display='none';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),30000);
      return;
    }
    const w=window.open(url,'_blank','noopener');
    if(!w)location.href=url;
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }catch(e){
    URL.revokeObjectURL(url);
    throw e;
  }
}
async function directPdfDownload(id){
  if(alpinePdfBusy)return;
  alpinePdfBusy=true;
  const buttons=[...document.querySelectorAll(`button[onclick="printSection('${id}')"]`)];
  const old=buttons.map(b=>b.textContent);
  buttons.forEach(b=>{b.disabled=true;b.textContent='PDF作成中…';});
  let stage='初期化';
  try{
    stage='フォント準備';
    if(document.fonts?.ready)await document.fonts.ready;

    stage='PDFページ作成';
    let images=[];
    if(id==='schedule'){
      try{
        images=await makeSchedulePdfImages(false);
      }catch(firstErr){
        console.warn('Annual schedule PDF normal render failed. Retrying compact mode.',firstErr);
        stage='年間予定PDFを軽量モードで再作成';
        images=await makeSchedulePdfImages(true);
      }
    }else if(id==='events'){
      images=await makeEventPdfImages();
    }
    if(!images.length)throw new Error(id==='schedule'?'年間予定PDFのページを作成できませんでした':'PDFに出力する内容がありません');

    stage='PDF変換';
    const pdf=buildJpegPdf(images);
    await validatePdfBlob(pdf);

    stage='ファイル保存';
    const fileName=pdfSafeName(db.team.name||'Alpine_Team_Manager')+'_'+(id==='schedule'?'年間予定表':'大会スケジュール')+'.pdf';
    triggerPdfSave(pdf,fileName);
  }catch(err){
    console.error('PDF generation error',stage,err);
    alert(`PDFの作成に失敗しました\n処理：${stage}\n${err?.message||err}`);
  }finally{
    buttons.forEach((b,i)=>{b.disabled=false;b.textContent=old[i]||'PDF';});
    alpinePdfBusy=false;
  }
}
function printSection(id){return directPdfDownload(id);}

// ===== v0.13.40 SAJ athlete registration =====
let sajAthleteListCache=[];

function setAthleteRegisterMode(mode){
  const byNo=document.getElementById('athleteRegisterByNumber');
  const byList=document.getElementById('athleteRegisterByList');
  byNo?.classList.remove('hidden');
  byList?.classList.remove('hidden');
}

function setSajListStatus(msg,kind='muted'){
  const el=document.getElementById('sajListStatus');
  if(!el)return;
  el.className=kind;
  el.textContent=msg;
}

function normalizeOrgName(v){
  return String(v||'').replace(/[都道府県府県]$/,'').trim();
}

async function fetchSajAthleteList(){
  const sex=document.getElementById('sajListSex')?.value||'';
  const organization=document.getElementById('sajListOrg')?.value||'';
  if(!sex || !organization){
    setSajListStatus('加盟団体と性別を選択してください。','status-warn');
    return;
  }
  const btn=document.getElementById('sajListFetchBtn');
  if(btn){btn.disabled=true;btn.textContent='取得中…';}
  setSajListStatus(`SAJポイントリストから ${organization}・${sex} の選手を取得しています…`);
  document.getElementById('sajListResultsWrap')?.classList.add('hidden');

  try{
    const base=apiBase();
    const r=await fetch(`${base}/api/saj-athletes?sex=${encodeURIComponent(sex)}&organization=${encodeURIComponent(organization)}`,{
      headers:{'Accept':'application/json'}
    });
    let data={}; try{data=await r.json()}catch{}
    if(!r.ok || !data.ok) throw new Error(data.error||`SAJ一覧取得エラー (${r.status})`);

    sajAthleteListCache=Array.isArray(data.athletes)?data.athletes:[];
    renderSajAthleteList();
    document.getElementById('sajListResultsWrap')?.classList.remove('hidden');
    setSajListStatus(`${organization}・${sex}：${sajAthleteListCache.length}名を取得しました。${data.pointListNumber!=null?` ポイントリスト No.${data.pointListNumber}`:''}`);
  }catch(e){
    sajAthleteListCache=[];
    renderSajAthleteList();
    setSajListStatus(e.message||'SAJ選手一覧を取得できませんでした。','status-danger');
  }finally{
    if(btn){btn.disabled=false;btn.textContent='一覧取得';}
  }
}

function renderSajAthleteList(){
  const tbody=document.getElementById('sajListRows');
  if(!tbody)return;
  const registered=new Set(db.athletes.map(a=>normalizedSaj(a.saj)));
  tbody.innerHTML=sajAthleteListCache.map((a,i)=>{
    const saj=normalizedSaj(a.saj);
    const exists=registered.has(saj);
    return `<tr class="${exists?'saj-list-registered':''}">
      <td><input type="checkbox" class="saj-list-check" data-index="${i}" ${exists?'disabled':''}></td>
      <td>${esc(a.name||'—')}${exists?'<br><span class="muted">登録済み</span>':''}</td>
      <td>${esc(a.birth||'—')}</td>
      <td>${esc(saj||'—')}</td>
      <td>${esc(a.organization||'—')}</td>
      <td>${esc(a.team||'—')}</td>
      <td>${a.sl??'—'}</td>
      <td>${a.gs??'—'}</td>
      <td>${a.sg??'—'}</td>
    </tr>`;
  }).join('') || '<tr><td colspan="9" class="muted">該当選手はいません</td></tr>';
}

function toggleAllSajList(on){
  document.querySelectorAll('.saj-list-check:not(:disabled)').forEach(c=>c.checked=!!on);
}

function clearSajAthleteList(){
  sajAthleteListCache=[];
  const tbody=document.getElementById('sajListRows');
  if(tbody) tbody.innerHTML='';
  document.getElementById('sajListResultsWrap')?.classList.add('hidden');
  setSajListStatus('リストをクリアしました。性別と加盟団体を選択して、一覧を再取得できます。');
}

async function registerSelectedSajAthletes(){
  const checks=[...document.querySelectorAll('.saj-list-check:checked:not(:disabled)')];
  if(!checks.length){
    setSajListStatus('登録する選手をチェックしてください。','status-warn');
    return;
  }

  const btn=document.getElementById('sajListRegisterBtn');
  if(btn){btn.disabled=true;btn.textContent='登録中…';}
  let ok=0,ng=0,skip=0;
  const errors=[];

  for(let n=0;n<checks.length;n++){
    const idx=Number(checks[n].dataset.index);
    const row=sajAthleteListCache[idx];
    const saj=normalizedSaj(row?.saj);
    if(!saj){ng++;continue;}
    if(db.athletes.some(a=>normalizedSaj(a.saj)===saj)){skip++;continue;}

    setSajListStatus(`${n+1}/${checks.length} ${row?.name||saj} の詳細情報を取得しています…`);
    try{
      const a=await fetchSajAthlete(saj);
      const item={
        id:uid(),saj:a.saj||saj,name:a.name||row?.name||'',school:a.team||a.organization||row?.team||'',
        organization:a.organization||row?.organization||'',birth:a.birth||row?.birth||'',sex:normalizeAthleteSex(a.sex)||normalizeAthleteSex(row?.sex)||'',
        grade:inferGradeFromBirth(a.birth||row?.birth),
        dh:a.dh??row?.dh??null,sc:a.sc??row?.sc??null,sg:a.sg??row?.sg??null,gs:a.gs??row?.gs??null,sl:a.sl??row?.sl??null,
        updated:new Date().toISOString().slice(0,10),
        pointListNumber:a.pointListNumber??null,
        pointSeasonLabel:a.pointSeasonLabel||'',
        sajSource:a.source||'',
        results:(a.results||[]).map(r=>({date:r.date,race:r.race,disc:r.disc,rank:r.rank,time:'',point:r.point??'-',season:r.season,category:r.category}))
      };
      if(!item.name) throw new Error('氏名を取得できませんでした');
      db.athletes.push(item);
      ok++;
    }catch(e){
      ng++;
      errors.push(`${row?.name||saj}: ${e.message||'取得失敗'}`);
    }
  }

  save();
  renderSajAthleteList();
  if(btn){btn.disabled=false;btn.textContent='選択した選手を登録';}
  let msg=`一括登録完了：成功 ${ok}名`;
  if(skip) msg+=` / 登録済み ${skip}名`;
  if(ng) msg+=` / 失敗 ${ng}名`;

  if(ok>0){
    sajAthleteListCache=[];
    const tbody=document.getElementById('sajListRows');
    if(tbody) tbody.innerHTML='';
    document.getElementById('sajListResultsWrap')?.classList.add('hidden');
  }

  setSajListStatus(msg,ng?'status-warn':'muted');
  alert(msg+(errors.length?`\n\n${errors.slice(0,5).join('\n')}`:''));
}

// ===== v0.3 SAJ one-touch athlete registration =====
function normalizedSaj(v){ return String(v||'').replace(/\D/g,''); }

function normalizeAthleteSex(v){
  const raw=String(v??'').trim();
  if(!raw)return '';
  const compact=raw.toLowerCase().replace(/\s+/g,'');
  if(['男','男子','男性','m','male','man','men'].includes(compact))return '男';
  if(['女','女子','女性','f','female','woman','women'].includes(compact))return '女';
  return '';
}
function validRankingPoint(v){
  if(v===null || v===undefined || v==='')return false;
  const normalized=String(v).replace(/,/g,'').trim();
  if(!normalized)return false;
  const n=Number(normalized);
  return Number.isFinite(n);
}
function rankingPointNumber(v){
  return validRankingPoint(v) ? Number(String(v).replace(/,/g,'').trim()) : Infinity;
}

function inferGradeFromBirth(birth){
  // 学年はSAJ公開ポイントリストのBirthだけでは年度境界を正確に断定できないため自動確定しない。
  // 表示は空欄にし、必要な場合のみコーチが補正。
  return '';
}
const DEFAULT_SAJ_API_URL='https://snowtech-saj-api.take6583.workers.dev';
function apiBase(){
  return DEFAULT_SAJ_API_URL.replace(/\/$/,'');
}
openAthleteForm = function(){
  editingAthleteId=null;
  setAthleteRegisterMode('number');
  if(document.getElementById('athleteRegisterSimple')) athleteRegisterSimple.classList.remove('hidden');
  if(document.getElementById('athleteEditFields')) athleteEditFields.classList.add('hidden');
  if(document.getElementById('sajRegisterStatus')){
    sajRegisterStatus.textContent='SAJ番号だけ入力してください。氏名・生年月日・性別・所属・ポイント・大会履歴を自動取得します。';
  }
  athleteForm.classList.remove('hidden');
};
function setSajStatus(msg,kind='muted'){
  sajRegisterStatus.className=kind;
  sajRegisterStatus.textContent=msg;
}
async function fetchSajAthlete(saj){
  const base=apiBase();
  if(!base) throw new Error('SAJ連携サービスを利用できません');
  const r=await fetch(`${base}/api/saj-athlete?saj=${encodeURIComponent(saj)}`,{headers:{'Accept':'application/json'}});
  let data={}; try{data=await r.json()}catch{}
  if(!r.ok || !data.ok) throw new Error(data.error||`SAJ取得エラー (${r.status})`);
  return data.athlete;
}
async function fetchSajAthletePoints(saj){
  const base=apiBase();
  if(!base) throw new Error('SAJ連携サービスを利用できません');
  const r=await fetch(`${base}/api/saj-athlete-points?saj=${encodeURIComponent(saj)}`,{headers:{'Accept':'application/json'}});
  let data={}; try{data=await r.json()}catch{}
  if(!r.ok || !data.ok) throw new Error(data.error||`SAJポイント取得エラー (${r.status})`);
  return data.points||{};
}
async function fetchSajAthleteResults(saj){
  const base=apiBase();
  if(!base) throw new Error('SAJ連携サービスを利用できません');
  const r=await fetch(`${base}/api/saj-athlete-results?saj=${encodeURIComponent(saj)}`,{headers:{'Accept':'application/json'}});
  let data={}; try{data=await r.json()}catch{}
  if(!r.ok || !data.ok) throw new Error(data.error||`SAJ大会成績取得エラー (${r.status})`);
  return data;
}
const ATHLETE_RESULTS_CLIENT_TTL_MS=6*60*60*1000;
function athleteResultsCheckedRecently(a){
  const t=Date.parse(a?.resultsCheckedAt||'');
  return Number.isFinite(t) && (Date.now()-t)>=0 && (Date.now()-t)<ATHLETE_RESULTS_CLIENT_TTL_MS;
}
async function refreshAthleteResultsOnDetail(id){
  const a=db.athletes.find(x=>x.id===id);
  if(!a || !navigator.onLine || !apiBase() || !normalizedSaj(a.saj))return;
  if(athleteResultsCheckedRecently(a))return;

  // 同じ選手を短時間に連打しても重複通信しない。
  if(a._resultsSyncing)return;
  a._resultsSyncing=true;
  try{
    const data=await fetchSajAthleteResults(normalizedSaj(a.saj));
    const before=(a.results||[]).length;
    const merged=mergeSajResults(a.results||[],data.results||[]);
    a.results=merged;
    a.resultsCheckedAt=new Date().toISOString();
    if(data.source)a.sajResultsSource=data.source;
    persistDb({silent:true});

    // 新規成績が追加された時だけ詳細画面を再描画。
    if(merged.length!==before && document.getElementById('athleteDetailScreen')?.classList.contains('active')){
      showAthlete(id,athleteDetailReturnTarget);
    }
  }catch(e){
    // 通信失敗でも保存済み履歴はそのまま表示し続ける。
    console.warn('SAJ athlete results sync failed',e);
  }finally{
    delete a._resultsSyncing;
  }
}
async function registerAthleteFromSaj(){
  const saj=normalizedSaj(aSaj.value);
  if(!/^0?\d{7,9}$/.test(saj)){setSajStatus('SAJ競技者番号を確認してください。','status-danger');return}
  if(db.athletes.some(a=>normalizedSaj(a.saj)===saj)){setSajStatus('このSAJ番号はすでに登録済みです。','status-warn');return}
  sajRegisterBtn.disabled=true;sajRegisterBtn.textContent='SAJ取得中…';
  setSajStatus('SAJ競技データバンクを検索しています…');
  try{
    const a=await fetchSajAthlete(saj);
    const item={
      id:uid(),saj:a.saj||saj,name:a.name||'',school:a.team||a.organization||'',
      organization:a.organization||'',birth:a.birth||'',sex:normalizeAthleteSex(a.sex)||'',grade:inferGradeFromBirth(a.birth),
      dh:a.dh,sc:a.sc,sg:a.sg,gs:a.gs,sl:a.sl,
      updated:new Date().toISOString().slice(0,10),
      pointListNumber:a.pointListNumber??null,
      pointSeasonLabel:a.pointSeasonLabel||'',
      pointSource:a.pointSource||'',sajSource:a.source||'',results:(a.results||[]).map(r=>({...normalizeSajResult(r)}))
    };
    if(!item.name) throw new Error('SAJデータから氏名を取得できませんでした');
    db.athletes.push(item);
    save();
    aSaj.value='';
    closeAthleteForm();
    alert(`${item.name} をSAJデータから登録しました`);
  }catch(e){
    setSajStatus(e.message||'SAJデータを取得できませんでした。','status-danger');
  }finally{
    sajRegisterBtn.disabled=false;sajRegisterBtn.textContent='選手登録';
  }
}
editAthlete = function(id){
  const a=db.athletes.find(x=>x.id===id); if(!a)return;
  editingAthleteId=id;
  aSaj.value=a.saj||'';aName.value=a.name||'';aSchool.value=a.school||'';aGrade.value=a.grade||'';
  aBirth.value=a.birth||'';aSex.value=a.sex||'';
  aSL.value=a.sl??'';aGS.value=a.gs??'';aSG.value=a.sg??'';
  athleteRegisterSimple.classList.remove('hidden');athleteEditFields.classList.remove('hidden');
  athleteForm.classList.remove('hidden');athleteEditFields.scrollIntoView({behavior:'smooth',block:'start'});
}
function saveAthleteEdit(){
  const a=db.athletes.find(x=>x.id===editingAthleteId);if(!a)return;
  a.name=aName.value.trim();a.school=aSchool.value.trim();a.grade=aGrade.value.trim();
  a.birth=aBirth.value||'';a.sex=normalizeAthleteSex(aSex.value)||a.sex||'';
  a.sl=num(aSL.value);a.gs=num(aGS.value);a.sg=num(aSG.value);
  editingAthleteId=null;closeAthleteForm();save();
}
function sajResultIdentity(r){
  const norm=v=>String(v??'').replace(/\s+/g,' ').trim().toLowerCase();
  return [norm(r.season),norm(r.date),norm(r.race),norm(r.disc),norm(r.category)].join('|');
}
function normalizeSajResult(r){
  return {
    date:r?.date||'',race:r?.race||'',disc:r?.disc||'',rank:r?.rank||'',
    time:r?.time||'',point:r?.point??'-',season:r?.season||'',category:r?.category||'',
    source:'saj'
  };
}
function mergeSajResults(existing,incoming){
  // Existing records are authoritative locally. Never delete or overwrite them.
  // Only append SAJ results that are not already present.
  const out=Array.isArray(existing)?existing.map(r=>({...r})):[];
  const keys=new Set(out.map(sajResultIdentity));
  for(const raw of (Array.isArray(incoming)?incoming:[])){
    const r=normalizeSajResult(raw);
    const key=sajResultIdentity(r);
    if(!key || keys.has(key))continue;
    out.push(r);
    keys.add(key);
  }
  // Newest result first where an ISO-like or yyyy/mm/dd date is available.
  const dateValue=v=>{
    const t=String(v||'').replace(/年|月/g,'/').replace(/日/g,'').replace(/-/g,'/');
    const m=t.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
    return m ? Number(`${m[1]}${String(m[2]).padStart(2,'0')}${String(m[3]).padStart(2,'0')}`) : 0;
  };
  return out.sort((a,b)=>dateValue(b.date)-dateValue(a.date));
}
async function refreshAthleteFromSaj(id,quiet=false){
  const old=db.athletes.find(x=>x.id===id);if(!old)return false;
  try{
    const a=await fetchSajAthletePoints(normalizedSaj(old.saj));

    const keepPoint=(fresh,current)=>{
      if(fresh===undefined || fresh===null || fresh==='') return current??null;
      const normalized=String(fresh).replace(/,/g,'').trim();
      const n=Number(normalized);
      return Number.isFinite(n)?n:(current??null);
    };

    // 起動時・一括同期はポイントだけを軽量取得する。大会履歴は選手詳細を開いた時だけ取得。
    // Profile fields entered/adjusted by the team are intentionally left untouched.
    Object.assign(old,{
      dh:keepPoint(a.dh,old.dh),
      sc:keepPoint(a.sc,old.sc),
      sg:keepPoint(a.sg,old.sg),
      gs:keepPoint(a.gs,old.gs),
      sl:keepPoint(a.sl,old.sl),

      updated:new Date().toISOString().slice(0,10),
      pointListNumber:a.pointListNumber??old.pointListNumber??null,
      pointSeasonLabel:a.pointSeasonLabel||old.pointSeasonLabel||'',
      pointSource:a.pointSource||old.pointSource||'',
      sajSource:a.pointSource||old.sajSource||''
    });

    // Persist each successful refresh immediately so an app close during launch refresh
    // cannot lose the latest valid point/history data.
    persistDb({silent:true});

    if(!quiet) renderAll();
    return true;
  }catch(e){
    if(!quiet) alert(`${old.name}: ${e.message}`);
    return false;
  }
}
async function refreshAllSaj(){
  if(!db.athletes.length){alert('登録選手がいません');return}
  if(!apiBase()){alert('SAJ連携サービスを利用できません');return}
  let ok=0,ng=0;
  for(const a of db.athletes){
    (await refreshAthleteFromSaj(a.id,true))?ok++:ng++;
  }
  if(ng===0)persistSajPointsWeeklyMeta();
  save();alert(`SAJ同期完了：成功 ${ok}名 / 失敗 ${ng}名\n最新ポイントを反映しました。大会履歴は選手詳細を開いた時に差分同期します。`);
}



let calendarEditDateValue='';
let calendarEditRangeId='';
let calendarEditScope='day';
let calendarEditOriginalRange=null;

function calendarDateDisplay(dateStr){
  const d=new Date(dateStr+'T00:00:00');
  if(Number.isNaN(d.getTime()))return fmt(dateStr);
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${JP_WD[d.getDay()]}）`;
}
function calendarRangeDates(start,end){
  const out=[];
  if(!start||!end||end<start)return out;
  let d=new Date(start+'T00:00:00');
  const last=new Date(end+'T00:00:00');
  if(Number.isNaN(d.getTime())||Number.isNaN(last.getTime()))return out;
  while(d<=last){
    out.push(homeYmd(d));
    d.setDate(d.getDate()+1);
  }
  return out;
}
function updateCalendarPeriodSummary(){
  const start=document.getElementById('calendarStartDate')?.value||'';
  const end=document.getElementById('calendarEndDate')?.value||'';
  const summary=document.getElementById('calendarPeriodSummary');
  if(!summary)return;
  if(!start||!end){
    summary.textContent='開始日と終了日を選択してください';
    return;
  }
  if(end<start){
    summary.textContent='終了日は開始日以降を選択してください';
    return;
  }
  const dates=calendarRangeDates(start,end);
  if(calendarEditScope==='day'){
    summary.textContent='この日だけに追記・編集します';
    return;
  }
  summary.textContent=dates.length<=1
    ? 'この日の予定を編集します'
    : `${fmt(start)} ～ ${fmt(end)} の ${dates.length}日間に同じ内容を反映します`;
}
function onCalendarPeriodChange(){
  const startEl=document.getElementById('calendarStartDate');
  const endEl=document.getElementById('calendarEndDate');
  if(!startEl||!endEl)return;
  if(startEl.value && endEl.value && endEl.value<startEl.value){
    endEl.value=startEl.value;
  }
  updateCalendarPeriodSummary();
  renderCalendarImportedEventsForRange();
}
function renderCalendarImportedEventsForRange(){
  const imported=document.getElementById('calendarImportedEvents');
  if(!imported)return;
  const start=document.getElementById('calendarStartDate')?.value||calendarEditDateValue;
  const end=document.getElementById('calendarEndDate')?.value||start;
  if(!start||!end||end<start){ imported.innerHTML=''; return; }

  const eventItems=(db.events||[]).filter(e=>{
    if(!e.start)return false;
    const eventEnd=e.end||e.start;
    return !(eventEnd<start || e.start>end);
  });

  imported.innerHTML=eventItems.length
    ? `<div class="muted" style="font-size:11px;margin-bottom:4px">選択期間内の大会管理データ（自動反映）</div>${eventItems.map(e=>`<div class="calendar-imported-row"><strong>大会</strong> ${esc(e.title||'大会')} <span class="muted">${fmt(e.start)}${e.end&&e.end!==e.start?'～'+fmt(e.end):''}</span></div>`).join('')}`
    : '';
}
function setCalendarEditScope(scope){
  calendarEditScope=scope==='range'?'range':'day';

  const dayBtn=document.getElementById('calendarScopeDayBtn');
  const rangeBtn=document.getElementById('calendarScopeRangeBtn');
  const help=document.getElementById('calendarEditScopeHelp');
  const startEl=document.getElementById('calendarStartDate');
  const endEl=document.getElementById('calendarEndDate');

  dayBtn?.classList.toggle('primary',calendarEditScope==='day');
  rangeBtn?.classList.toggle('primary',calendarEditScope==='range');

  if(calendarEditScope==='day'){
    if(startEl)startEl.value=calendarEditDateValue;
    if(endEl)endEl.value=calendarEditDateValue;
    if(startEl)startEl.disabled=true;
    if(endEl)endEl.disabled=true;
    if(help)help.textContent='期間登録はそのまま残し、この日だけの予定を追加・変更できます。';
    loadCalendarDayEntries();
  }else{
    if(startEl)startEl.disabled=false;
    if(endEl)endEl.disabled=false;
    if(calendarEditOriginalRange){
      if(startEl)startEl.value=calendarEditOriginalRange.start;
      if(endEl)endEl.value=calendarEditOriginalRange.end;
    }
    if(help)help.textContent='期間全体の内容・開始日・終了日をまとめて変更します。';
    loadCalendarRangeEntries();
  }
  updateCalendarPeriodSummary();
  renderCalendarImportedEventsForRange();
}
function calendarRangeRowsForDate(rangeId,dateStr){
  return (db.schedules||[])
    .filter(x=>x.quick && x.rangeId===rangeId && x.date===dateStr)
    .sort((a,b)=>(Number(a.slot)||1)-(Number(b.slot)||1));
}
function calendarRangeTemplateRows(rangeId){
  return (db.schedules||[])
    .filter(x=>x.quick && x.rangeId===rangeId)
    .sort((a,b)=>{
      const sd=String(a.date||'').localeCompare(String(b.date||''));
      return sd || ((Number(a.slot)||1)-(Number(b.slot)||1));
    });
}
function calendarDayOverrides(rangeId,dateStr){
  return (db.schedules||[])
    .filter(x=>x.quick && x.overrideOfRangeId===rangeId && x.date===dateStr)
    .sort((a,b)=>(Number(a.overrideSlot)||1)-(Number(b.overrideSlot)||1));
}
function loadCalendarDayEntries(){
  const rangeId=calendarEditRangeId;
  if(!rangeId)return;

  const todayRange=calendarRangeRowsForDate(rangeId,calendarEditDateValue);
  const template=calendarRangeTemplateRows(rangeId);
  const baseBySlot=new Map();
  [...template,...todayRange].forEach(x=>{
    const slot=Number(x.slot)||1;
    if(!baseBySlot.has(slot))baseBySlot.set(slot,x);
  });

  const overrides=calendarDayOverrides(rangeId,calendarEditDateValue);
  const overrideBySlot=new Map(overrides.map(x=>[Number(x.overrideSlot)||1,x]));

  for(let slot=1;slot<=2;slot++){
    const override=overrideBySlot.get(slot);
    const base=baseBySlot.get(slot);
    const item=override ? (override.overrideDelete?null:override) : base;
    const typeEl=document.getElementById(`calendarType${slot}`);
    const memoEl=document.getElementById(`calendarMemo${slot}`);
    if(typeEl)typeEl.value=item?normalizedScheduleType(item.type):'';
    if(memoEl)memoEl.value=item?String(item.note||item.title||'').slice(0,20):'';
  }
}
function loadCalendarRangeEntries(){
  const items=calendarEditRangeId
    ? calendarRangeTemplateRows(calendarEditRangeId)
    : [];
  const bySlot=new Map();
  items.forEach(x=>{
    const slot=Number(x.slot)||1;
    if(!bySlot.has(slot))bySlot.set(slot,x);
  });
  for(let slot=1;slot<=2;slot++){
    const item=bySlot.get(slot)||null;
    const typeEl=document.getElementById(`calendarType${slot}`);
    const memoEl=document.getElementById(`calendarMemo${slot}`);
    if(typeEl)typeEl.value=item?normalizedScheduleType(item.type):'';
    if(memoEl)memoEl.value=item?String(item.note||item.title||'').slice(0,20):'';
  }
}

let calendarActionDateValue='';

function trainingDayRowForDate(dateStr){
  return (db.schedules||[]).find(x=>x?.trainingDay && x.date===dateStr) || null;
}

function officialEventsForCalendarDate(dateStr){
  return (db.events||[]).filter(e=>{
    if(!e?.sajKey)return false;
    const start=String(e.start||'');
    const end=String(e.end||e.start||'');
    return !!start && dateStr>=start && dateStr<=end;
  });
}

function renderCalendarOfficialEventActions(dateStr){
  const box=document.getElementById('calendarOfficialEventActions');
  if(!box)return;

  const events=officialEventsForCalendarDate(dateStr);
  if(!events.length){
    box.innerHTML='';
    box.classList.add('hidden');
    return;
  }

  box.innerHTML=events.map(e=>{
    const safe=safeSajUrl(e.sajUrl);
    const button=safe
      ? `<button class="btn primary" type="button" onclick="openCalendarOfficialEventDetail('${esc(String(e.id||''))}')">大会詳細</button>`
      : `<button class="btn" type="button" disabled>大会詳細</button>`;
    return `<div class="calendar-official-event-row">
      <div class="calendar-official-event-name">${esc(e.title||'SAJ公認大会')}</div>
      ${button}
      ${safe?'':'<div class="muted" style="margin-top:6px;font-size:11px">大会詳細URLを取得できていません。</div>'}
    </div>`;
  }).join('');

  box.classList.remove('hidden');
}

function openCalendarOfficialEventDetail(eventId){
  const e=(db.events||[]).find(x=>String(x.id||'')===String(eventId||''));
  if(!e)return;
  const safe=safeSajUrl(e.sajUrl);
  if(!safe){
    alert('この大会の詳細URLを取得できていません。');
    return;
  }
  closeCalendarActionModal();
  openCompetitionDetail(safe);
}

function editScheduleCell(dateStr){
  if(!dateStr)return;
  calendarActionDateValue=dateStr;

  const modal=document.getElementById('calendarActionModal');
  const dateEl=document.getElementById('calendarActionDate');
  const awayPanel=document.getElementById('calendarAwayTrainingPanel');
  const awayInput=document.getElementById('calendarAwayTrainingPlace');
  const removeWrap=document.getElementById('calendarTrainingRemoveWrap');
  if(!modal)return;

  if(dateEl)dateEl.textContent=calendarDateDisplay(dateStr);

  if(awayPanel)awayPanel.classList.add('hidden');
  if(awayInput)awayInput.value='';

  const existing=trainingDayRowForDate(dateStr);
  if(removeWrap)removeWrap.classList.toggle('hidden',!existing);

  renderCalendarOfficialEventActions(dateStr);

  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}

function closeCalendarActionModal(){
  const modal=document.getElementById('calendarActionModal');
  const awayPanel=document.getElementById('calendarAwayTrainingPanel');
  const officialBox=document.getElementById('calendarOfficialEventActions');
  if(awayPanel)awayPanel.classList.add('hidden');
  if(officialBox){
    officialBox.innerHTML='';
    officialBox.classList.add('hidden');
  }
  if(!modal)return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
}

function refreshCalendarViewsAfterQuickEdit(){
  renderScheduleBoard();
  renderHome();

  const overlay=document.getElementById('calendarFullscreen');
  if(overlay && overlay.classList.contains('open')){
    requestAnimationFrame(()=>{
      const viewport=document.getElementById('calendarFullscreenViewport');
      const oldLeft=viewport?viewport.scrollLeft:0;
      const oldTop=viewport?viewport.scrollTop:0;
      const oldScale=calendarFsScale;
      openCalendarFullscreen();
      requestAnimationFrame(()=>{
        updateCalendarFullscreenScale(oldScale);
        if(viewport){
          viewport.scrollLeft=oldLeft;
          viewport.scrollTop=oldTop;
        }
      });
    });
  }
}

function upsertTrainingForDate(dateStr,venue,locationType){
  db.schedules=db.schedules||[];
  const existing=trainingDayRowForDate(dateStr);

  const row={
    id:existing?.id||uid(),
    date:dateStr,
    type:'練習',
    title:venue,
    place:venue,
    target:'',
    coach:'',
    note:venue,
    quick:true,
    trainingDay:true,
    trainingLocationType:locationType
  };

  if(existing){
    const idx=db.schedules.findIndex(x=>x.id===existing.id);
    if(idx>=0)db.schedules[idx]={...db.schedules[idx],...row};
  }else{
    db.schedules.push(row);
  }

  persistDb({silent:true});
  closeCalendarActionModal();
  refreshCalendarViewsAfterQuickEdit();
}

function setHomeTrainingFromCalendar(){
  const dateStr=calendarActionDateValue;
  if(!dateStr)return;

  db.team=db.team||{};
  const venue=String(db.team.mainSkiArea||'').trim();
  if(!venue){
    alert('チーム設定で「メインのスキー場」を入力してください。');
    return;
  }

  upsertTrainingForDate(dateStr,venue,'home');
}

function openAwayTrainingInput(){
  const panel=document.getElementById('calendarAwayTrainingPanel');
  const input=document.getElementById('calendarAwayTrainingPlace');
  if(!panel||!input)return;

  const existing=trainingDayRowForDate(calendarActionDateValue);
  input.value=existing?.trainingLocationType==='away' ? String(existing.place||'') : '';
  panel.classList.remove('hidden');

  setTimeout(()=>{
    input.focus();
    input.select?.();
  },30);
}

function cancelAwayTrainingInput(){
  const panel=document.getElementById('calendarAwayTrainingPanel');
  const input=document.getElementById('calendarAwayTrainingPlace');
  if(panel)panel.classList.add('hidden');
  if(input)input.value='';
}

function confirmAwayTraining(){
  const dateStr=calendarActionDateValue;
  const input=document.getElementById('calendarAwayTrainingPlace');
  if(!dateStr||!input)return;

  const venue=String(input.value||'').trim();
  if(!venue){
    alert('練習場所を入力してください。');
    input.focus();
    return;
  }

  upsertTrainingForDate(dateStr,venue,'away');
}

function removeTrainingFromCalendar(){
  const dateStr=calendarActionDateValue;
  if(!dateStr)return;

  const existing=trainingDayRowForDate(dateStr);
  if(!existing)return;

  if(!confirm(`${calendarDateDisplay(dateStr)} の練習設定を解除しますか？`))return;

  db.schedules=(db.schedules||[]).filter(x=>x.id!==existing.id);
  persistDb({silent:true});
  closeCalendarActionModal();
  refreshCalendarViewsAfterQuickEdit();
}

function openOtherScheduleSettings(){
  const dateStr=calendarActionDateValue;
  closeCalendarActionModal();
  if(dateStr)openCalendarOtherSettings(dateStr);
}

function openCalendarOtherSettings(dateStr){
  if(!dateStr)return;
  calendarEditDateValue=dateStr;

  const modal=document.getElementById('calendarEditModal');
  const dateEl=document.getElementById('calendarEditDate');
  const startEl=document.getElementById('calendarStartDate');
  const endEl=document.getElementById('calendarEndDate');
  const scopePanel=document.getElementById('calendarEditScopePanel');
  if(!modal)return;

  if(dateEl)dateEl.textContent=calendarDateDisplay(dateStr);

  const sameDayQuick=(db.schedules||[]).filter(x=>x.date===dateStr && x.quick);
  let ranged=sameDayQuick.find(x=>x.rangeId && x.rangeStart && x.rangeEnd) || null;

  // Backward compatibility: an older day override may have removed the range row for this date.
  if(!ranged){
    const oldOverride=sameDayQuick.find(x=>x.overrideOfRangeId);
    if(oldOverride){
      ranged=(db.schedules||[]).find(
        x=>x.quick && x.rangeId===oldOverride.overrideOfRangeId && x.rangeStart && x.rangeEnd
      )||null;
    }
  }

  calendarEditRangeId=ranged?.rangeId||'';
  calendarEditOriginalRange=ranged?{start:ranged.rangeStart,end:ranged.rangeEnd}:null;

  if(ranged){
    scopePanel?.classList.remove('hidden');
    calendarEditScope='day';
    setCalendarEditScope('day');
  }else{
    scopePanel?.classList.add('hidden');
    calendarEditScope='range';
    if(startEl){startEl.disabled=false;startEl.value=dateStr;}
    if(endEl){endEl.disabled=false;endEl.value=dateStr;}

    const direct=sameDayQuick
      .filter(x=>!x.rangeId && !x.overrideOfRangeId && !x.overrideDelete && !x.trainingDay)
      .slice(0,2);

    for(let i=0;i<2;i++){
      const item=direct[i]||null;
      const typeEl=document.getElementById(`calendarType${i+1}`);
      const memoEl=document.getElementById(`calendarMemo${i+1}`);
      if(typeEl)typeEl.value=item?normalizedScheduleType(item.type):'';
      if(memoEl)memoEl.value=item?String(item.note||item.title||'').slice(0,20):'';
    }
    updateCalendarPeriodSummary();
    renderCalendarImportedEventsForRange();
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
}
function closeCalendarEdit(){
  const modal=document.getElementById('calendarEditModal');
  if(!modal)return;
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  calendarEditDateValue='';
  calendarEditRangeId='';
  calendarEditScope='day';
  calendarEditOriginalRange=null;
}
function saveCalendarEdit(){
  const start=document.getElementById('calendarStartDate')?.value||'';
  const end=document.getElementById('calendarEndDate')?.value||'';
  if(!start||!end){
    alert('開始日と終了日を選択してください。');
    return;
  }
  if(end<start){
    alert('終了日は開始日以降を選択してください。');
    return;
  }

  const slotEntries=[];
  for(let slot=1;slot<=2;slot++){
    const type=String(document.getElementById(`calendarType${slot}`)?.value||'').trim();
    const memo=String(document.getElementById(`calendarMemo${slot}`)?.value||'').trim().slice(0,20);
    slotEntries.push(type?{slot,type:normalizedScheduleType(type),memo}:null);
  }

  if(calendarEditScope==='day' && calendarEditRangeId){
    const rangeId=calendarEditRangeId;
    const template=calendarRangeTemplateRows(rangeId);
    const baseBySlot=new Map();
    template.forEach(x=>{
      const slot=Number(x.slot)||1;
      if(!baseBySlot.has(slot))baseBySlot.set(slot,x);
    });

    // Replace only this day's overrides. Baseline range rows stay intact.
    db.schedules=(db.schedules||[]).filter(
      x=>!(x.quick && x.date===calendarEditDateValue && x.overrideOfRangeId===rangeId)
    );

    // Remove legacy local-only quick entries on this ranged date, because slots 1/2 now fully represent the day.
    db.schedules=(db.schedules||[]).filter(
      x=>!(x.quick && x.date===calendarEditDateValue && !x.rangeId && !x.overrideOfRangeId && !x.trainingDay)
    );

    for(let slot=1;slot<=2;slot++){
      const entered=slotEntries[slot-1];
      const base=baseBySlot.get(slot)||null;

      const baseType=base?normalizedScheduleType(base.type):'';
      const baseMemo=base?String(base.note||base.title||'').slice(0,20):'';
      const enteredType=entered?.type||'';
      const enteredMemo=entered?.memo||'';

      const sameAsBase=!!base && enteredType===baseType && enteredMemo===baseMemo;
      if(sameAsBase)continue;
      if(!base && !entered)continue;

      if(!entered && base){
        db.schedules.push({
          id:uid(),
          date:calendarEditDateValue,
          type:base.type||'練習',
          title:'',
          place:'',
          target:'',
          coach:'',
          note:'',
          quick:true,
          overrideOfRangeId:rangeId,
          overrideSlot:slot,
          overrideDelete:true
        });
      }else if(entered){
        db.schedules.push({
          id:uid(),
          date:calendarEditDateValue,
          type:entered.type,
          title:entered.memo,
          place:'',
          target:'',
          coach:'',
          note:entered.memo,
          quick:true,
          overrideOfRangeId:rangeId,
          overrideSlot:slot
        });
      }
    }
  }else{
    const dates=calendarRangeDates(start,end);
    if(!dates.length){
      alert('期間を確認してください。');
      return;
    }

    const oldRangeId=calendarEditRangeId||'';
    const newRangeId=oldRangeId || `range_${uid()}`;

    if(oldRangeId){
      // Full-range edit means all previous day-specific exceptions for that range are cleared.
      db.schedules=(db.schedules||[]).filter(
        x=>!(x.quick && (x.rangeId===oldRangeId || x.overrideOfRangeId===oldRangeId))
      );
    }

    // New range registration replaces direct non-range quick entries inside the target dates.
    const dateSet=new Set(dates);
    db.schedules=(db.schedules||[]).filter(
      x=>!(x.quick && dateSet.has(x.date) && !x.rangeId && !x.overrideOfRangeId && !x.trainingDay)
    );

    dates.forEach(date=>{
      slotEntries.filter(Boolean).forEach(entry=>{
        db.schedules.push({
          id:uid(),
          date,
          type:entry.type,
          title:entry.memo,
          place:'',
          target:'',
          coach:'',
          note:entry.memo,
          quick:true,
          slot:entry.slot,
          rangeId:newRangeId,
          rangeStart:start,
          rangeEnd:end
        });
      });
    });
  }

  persistDb({silent:true});
  closeCalendarEdit();
  renderScheduleBoard();
  renderHome();

  const overlay=document.getElementById('calendarFullscreen');
  if(overlay && overlay.classList.contains('open')){
    requestAnimationFrame(()=>{
      const viewport=document.getElementById('calendarFullscreenViewport');
      const oldLeft=viewport?viewport.scrollLeft:0;
      const oldTop=viewport?viewport.scrollTop:0;
      const oldScale=calendarFsScale;
      openCalendarFullscreen();
      requestAnimationFrame(()=>{
        updateCalendarFullscreenScale(oldScale);
        if(viewport){
          viewport.scrollLeft=oldLeft;
          viewport.scrollTop=oldTop;
        }
      });
    });
  }
}

let calendarFsScale=1;
let calendarFsBaseW=0;
let calendarFsBaseH=0;
let calendarPinchStartDistance=0;
let calendarPinchStartScale=1;

function clamp(v,min,max){return Math.max(min,Math.min(max,v))}
function touchDistance(t1,t2){
  const dx=t1.clientX-t2.clientX,dy=t1.clientY-t2.clientY;
  return Math.hypot(dx,dy);
}
function updateCalendarFullscreenScale(nextScale){
  const content=document.getElementById('calendarFullscreenContent');
  const stage=document.getElementById('calendarFullscreenStage');
  const label=document.getElementById('calendarZoomLabel');
  if(!content||!stage)return;
  calendarFsScale=clamp(nextScale,.7,2);
  content.style.transform=`scale(${calendarFsScale})`;
  stage.style.width=`${Math.ceil(calendarFsBaseW*calendarFsScale)}px`;
  stage.style.height=`${Math.ceil(calendarFsBaseH*calendarFsScale)}px`;
  if(label) label.textContent=`${Math.round(calendarFsScale*100)}%`;
}
function openCalendarFullscreen(){
  const source=document.querySelector('#scheduleBoard .screen-season-board');
  const overlay=document.getElementById('calendarFullscreen');
  const content=document.getElementById('calendarFullscreenContent');
  const viewport=document.getElementById('calendarFullscreenViewport');
  if(!source||!overlay||!content||!viewport)return;

  content.innerHTML='';
  const clone=source.cloneNode(true);
  clone.classList.remove('screen-season-board');
  clone.style.minWidth=source.style.minWidth||'1180px';
  content.appendChild(clone);

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  document.body.classList.add('calendar-open');

  content.style.transform='scale(1)';
  requestAnimationFrame(()=>{
    calendarFsBaseW=content.scrollWidth;
    calendarFsBaseH=content.scrollHeight;
    updateCalendarFullscreenScale(1);
    viewport.scrollLeft=0;
    viewport.scrollTop=0;
  });
}
function closeCalendarFullscreen(){
  const overlay=document.getElementById('calendarFullscreen');
  if(!overlay)return;
  if(document.getElementById('scheduleForm')) scheduleForm.classList.add('hidden');
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  document.body.classList.remove('calendar-open');
}

function initCalendarFullscreen(){
  const wrap=document.getElementById('scheduleBoardWrap');
  const overlay=document.getElementById('calendarFullscreen');
  const viewport=document.getElementById('calendarFullscreenViewport');
  const back=document.getElementById('calendarBackBtn');
  if(!wrap||!overlay||!viewport||!back)return;

  let downX=0,downY=0,moved=false;
  wrap.addEventListener('pointerdown',e=>{downX=e.clientX;downY=e.clientY;moved=false});
  wrap.addEventListener('pointermove',e=>{
    if(Math.abs(e.clientX-downX)>8||Math.abs(e.clientY-downY)>8)moved=true;
  });
  wrap.addEventListener('pointerup',e=>{
    if(moved)return;
    const cell=e.target.closest('td[data-schedule-date]');
    if(cell) editScheduleCell(cell.dataset.scheduleDate);
  });

  back.addEventListener('click',e=>{e.stopPropagation();closeCalendarFullscreen()});

  viewport.addEventListener('click',e=>{
    const cell=e.target.closest('td[data-schedule-date]');
    if(cell) editScheduleCell(cell.dataset.scheduleDate);
  });

  viewport.addEventListener('touchstart',e=>{
    if(e.touches.length===2){
      calendarPinchStartDistance=touchDistance(e.touches[0],e.touches[1]);
      calendarPinchStartScale=calendarFsScale;
      e.preventDefault();
    }
  },{passive:false});

  viewport.addEventListener('touchmove',e=>{
    if(e.touches.length===2 && calendarPinchStartDistance>0){
      const d=touchDistance(e.touches[0],e.touches[1]);
      updateCalendarFullscreenScale(calendarPinchStartScale*(d/calendarPinchStartDistance));
      e.preventDefault();
    }
  },{passive:false});

  viewport.addEventListener('touchend',e=>{
    if(e.touches.length<2)calendarPinchStartDistance=0;
  },{passive:true});
}

function localTodayYmd(){
  const d=new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
}
let sajLaunchRefreshStarted=false;
const SAJ_POINTS_WEEKLY_CACHE_KEY='alpine_team_manager_saj_points_weekly_v1';

function loadSajPointsWeeklyMeta(){
  try{
    const stored=JSON.parse(localStorage.getItem(SAJ_POINTS_WEEKLY_CACHE_KEY)||'null');
    return stored&&typeof stored==='object'?stored:null;
  }catch(e){
    console.warn('SAJポイント週次更新情報の読込失敗',e);
    return null;
  }
}
function currentRegisteredPointSajs(){
  return [...new Set((db.athletes||[]).map(a=>normalizeSajNumberForRank(a?.saj)).filter(Boolean))];
}
function sajPointsWeeklyNeedsRefresh(stored){
  const sajs=currentRegisteredPointSajs();
  if(!sajs.length)return false;
  if(!stored?.updatedAt)return true;
  const synced=new Set(Array.isArray(stored.syncedSajs)?stored.syncedSajs.map(normalizeSajNumberForRank).filter(Boolean):[]);
  if(sajs.some(saj=>!synced.has(saj)))return true;
  const updatedAt=new Date(stored.updatedAt);
  if(Number.isNaN(updatedAt.getTime()))return true;
  return updatedAt<nationalRankLatestThursdayStart();
}
function persistSajPointsWeeklyMeta(updatedAt=new Date().toISOString()){
  try{
    localStorage.setItem(SAJ_POINTS_WEEKLY_CACHE_KEY,JSON.stringify({
      updatedAt,
      syncedSajs:currentRegisteredPointSajs()
    }));
  }catch(e){
    console.warn('SAJポイント週次更新情報の保存失敗',e);
  }
}
function startDeferredSajRefresh(){
  if(sajLaunchRefreshStarted)return;
  sajLaunchRefreshStarted=true;

  // Keep the title/tool selector completely local and responsive.
  // SAJ network access begins only after the manager is actually opened.
  setTimeout(()=>{
    if(!navigator.onLine)return;
    autoRefreshSajOnLaunch().catch(()=>{});
  },800);
}

async function autoRefreshSajOnLaunch(){
  if(!db.athletes.length || !apiBase()) return;

  const weeklyMeta=loadSajPointsWeeklyMeta();
  if(!sajPointsWeeklyNeedsRefresh(weeklyMeta))return;

  const sync=document.getElementById('syncState');
  if(sync)sync.textContent='● SAJ週次同期中';

  let changed=false;
  let successCount=0;
  let cursor=0;
  const total=db.athletes.length;
  const concurrency=Math.min(3,total);

  async function worker(){
    while(true){
      const idx=cursor++;
      if(idx>=total)return;
      const a=db.athletes[idx];
      if(sync)sync.textContent=`● SAJ週次同期中 ${Math.min(idx+1,total)}/${total}`;
      if(await refreshAthleteFromSaj(a.id,true)){
        changed=true;
        successCount++;
      }
    }
  }

  await Promise.all(Array.from({length:concurrency},()=>worker()));

  // 全登録選手の取得に成功した時だけ「今週更新済み」とする。
  // 一人でも失敗した場合は前回データを保持し、次回起動時に再試行する。
  if(successCount===total)persistSajPointsWeeklyMeta();

  if(changed)renderAll();
  if(sync)sync.textContent=successCount===total?'● ローカル保存済み':'● SAJ同期一部失敗・次回再試行';
}

async function refreshAppCacheOnLaunch(){
  if(!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;

  try{
    const reg=await navigator.serviceWorker.register('./sw.js?ver=01361',{updateViaCache:'none'});

    if(reg.waiting){
      reg.waiting.postMessage({type:'SKIP_WAITING'});
    }

    reg.addEventListener('updatefound',()=>{
      const nw=reg.installing;
      if(!nw)return;
      nw.addEventListener('statechange',()=>{
        if(nw.state==='installed' && navigator.serviceWorker.controller){
          nw.postMessage({type:'SKIP_WAITING'});
        }
      });
    });

    // Do not compete with first paint/title screen on a weak connection.
    setTimeout(()=>{
      if(navigator.onLine)reg.update().catch(()=>{});
    },8000);
  }catch{}
}

refreshAppCacheOnLaunch().catch(()=>{});

renderAll();
importBackupFromShareLink().catch(()=>{});
initCalendarFullscreen();
initToolPortal();
const _startupPortal=document.getElementById('toolPortal');
if(_startupPortal && _startupPortal.classList.contains('hidden')){
  startDeferredSajRefresh();
}
// SAJ refresh is started after the user enters the manager.

function renderTopTeamName(){
  const el=document.getElementById('topTeamName');
  if(el)el.textContent=(db?.team?.name||'').trim();
  const season=document.getElementById('globalSeasonSelect');
  if(season){
    const selected=selectedGlobalSeasonYear();
    if(!season.options.length)season.innerHTML=globalSeasonOptionsHtml(selected);
    season.value=String(selected);
  }
}


function toggleHomeCategory(head){
  const block=head?.closest?.('.home-category-block');
  if(!block)return;
  const collapsed=block.classList.toggle('collapsed');
  head.setAttribute('aria-expanded',collapsed?'false':'true');
}
function handleHomeCategoryKey(event,head){
  if(event.key==='Enter' || event.key===' '){
    event.preventDefault();
    toggleHomeCategory(head);
  }
}

function goHome(){
  document.querySelectorAll('main section').forEach(sec=>sec.classList.remove('active'));
  const home=document.getElementById('home');
  if(home)home.classList.add('active');

  document.querySelectorAll('[data-tab]').forEach(btn=>btn.classList.remove('active'));
  const homeBtn=document.getElementById('homeButton');
  if(homeBtn)homeBtn.classList.add('active');

  try{
    window.scrollTo({top:0,left:0,behavior:'smooth'});
  }catch{
    window.scrollTo(0,0);
  }

  if(typeof renderTopTeamName==='function')renderTopTeamName();
  if(typeof renderHome==='function')renderHome();
}



// v0.13.63: check the published app version once per calendar day.
const APP_VERSION='0.13.63';
const APP_PUBLIC_URL='https://m6jm4s654p-lab.github.io/snowtech-team-manager/';
const APP_VERSION_CHECK_KEY='alpine_team_manager_version_check_date_v1';
function appLocalDateKey(d=new Date()){
  const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function compareAppVersions(a,b){
  const aa=String(a||'').replace(/^v/i,'').split('.').map(n=>parseInt(n,10)||0);
  const bb=String(b||'').replace(/^v/i,'').split('.').map(n=>parseInt(n,10)||0);
  const len=Math.max(aa.length,bb.length);
  for(let i=0;i<len;i++){const x=aa[i]||0,y=bb[i]||0;if(x!==y)return x>y?1:-1;}
  return 0;
}
async function checkLatestAppVersionOnceDaily(){
  const today=appLocalDateKey();
  if(localStorage.getItem(APP_VERSION_CHECK_KEY)===today)return;
  try{
    const r=await fetch(`./version.json?t=${Date.now()}`,{cache:'no-store'});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    const data=await r.json();
    const latest=String(data?.version||'').replace(/^v/i,'').trim();
    if(!latest)throw new Error('version missing');
    localStorage.setItem(APP_VERSION_CHECK_KEY,today);
    if(compareAppVersions(latest,APP_VERSION)>0)showAppUpdateNotice(latest);
  }catch(e){
    console.warn('最新バージョン確認失敗',e);
    // Do not record a successful check; retry on the next launch.
  }
}
function showAppUpdateNotice(latest){
  const modal=document.getElementById('appUpdateModal');
  const cur=document.getElementById('appUpdateCurrent');
  const lat=document.getElementById('appUpdateLatest');
  if(cur)cur.textContent=`v${APP_VERSION}`;
  if(lat)lat.textContent=`v${latest}`;
  if(modal)modal.classList.add('show');
}
function dismissAppUpdateNotice(){
  document.getElementById('appUpdateModal')?.classList.remove('show');
}
function toggleAppUpdateGuide(){
  document.getElementById('appUpdateGuide')?.classList.toggle('show');
}
async function copyManagerAppUrl(){
  try{
    await navigator.clipboard.writeText(APP_PUBLIC_URL);
    alert('アプリURLをコピーしました。');
  }catch(e){
    const ta=document.createElement('textarea');
    ta.value=APP_PUBLIC_URL;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();
    try{document.execCommand('copy');alert('アプリURLをコピーしました。');}
    catch(_){prompt('このURLをコピーしてください。',APP_PUBLIC_URL);}
    ta.remove();
  }
}
setTimeout(()=>checkLatestAppVersionOnceDaily(),1200);
