/**
 * SnowTech SAJ API v0.3.5
 * GET /api/saj-athlete?saj=03028493
 *
 * Strategy:
 * 1) Biography page is the primary identity source.
 * 2) Current-season point list is preferred for official SAJ points.
 * 3) Previous-season point list is fallback.
 * Public SAJ pages only.
 */
const SAJ_ORIGIN = "https://sajdb.shikuminet.jp";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") return cors(new Response(null, {status:204}), env, request);
    if (request.method !== "GET") {
      return cors(json({ok:false,error:"Method not allowed"},405), env, request);
    }
    if (url.pathname === "/health") {
      return cors(json({ok:true,service:"snowtech-saj-api",version:"0.13.17"}), env, request);
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
    "User-Agent":"AlpineTeamManager/0.13.17 (+public SAJ data lookup)",
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
  const t=String(v||"").trim();
  if(!t || t==="-" || t==="―") return null;
  const n=Number(t);
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
        name:c[codeIdx+2]||c[codeIdx+1]||"",
        birth:"",
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

async function getRawText(url){
  const r=await fetch(url,{headers:{
    "User-Agent":"AlpineTeamManager/0.13.17 (+public SAJ data lookup)",
    "Accept":"text/csv,text/plain,text/html,application/octet-stream,*/*"
  }});
  if(!r.ok) throw new Error(`SAJ HTTP ${r.status}: ${url}`);
  return await r.text();
}

function getTargetSeasons(now=new Date()){
  const y=now.getUTCFullYear();
  const m=now.getUTCMonth()+1;
  const current=(m>=7)?y+1:y;
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
  const trs=String(html||"").match(/<tr\b[\s\S]*?<\/tr>/gi)||[];
  const expected=normalizeJapaneseOrgName(expectedOrg);
  for(const tr of trs){
    const cells=[...tr.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m=>strip(m[1]));
    if(cells.length<12) continue;
    const saj=String(cells[1]||"").replace(/\D/g,"");
    if(!/^\d{7,9}$/.test(saj)) continue;
    const organization=cells[4]||"";
    if(expected && normalizeJapaneseOrgName(organization)!==expected) continue;
    rows.push({
      rank:cells[0]||"",
      saj,
      name:cells[2]||"",
      birth:cells[3]||"",
      organization,
      team:cells[5]||"",
      group:cells[6]||"",
      dh:numOrNull(cells[7]),
      sc:numOrNull(cells[8]),
      sg:numOrNull(cells[9]),
      gs:numOrNull(cells[10]),
      sl:numOrNull(cells[11])
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

async function lookupAthleteListBySexOrganization(sex, organization){
  const seasons=getTargetSeasons();
  let lastError=null;

  for(const season of seasons){
    try{
      const baseUrl=new URL(`${SAJ_ORIGIN}/alpine/point/list`);
      baseUrl.searchParams.set("season_code",String(season));
      baseUrl.searchParams.set("sports_code","AL");
      baseUrl.searchParams.set("saj_fis","SAJ");

      // Read the live form first, so SnowTech uses SAJ's actual option values
      // rather than hard-coded federation codes.
      const formHtml=await getText(baseUrl.toString());
      const selects=parseSelectOptions(formHtml);

      const sexOpt=findSexSelectValue(selects,sex);
      const orgOpt=findSelectValue(selects,organization,["organization","pref","member","association","group"]);

      const u=new URL(baseUrl);
      if(sexOpt) u.searchParams.set(sexOpt.name,sexOpt.value);
      else u.searchParams.set("sex",sex==="男"?"1":"2");

      if(orgOpt) u.searchParams.set(orgOpt.name,orgOpt.value);
      else{
        // Compatibility aliases. The visible-name filter below prevents
        // incorrect rows if SAJ ignores an unknown query key.
        u.searchParams.set("organization",organization);
      }

      const resultHtml=await getText(u.toString());
      let athletes=parsePointRows(resultHtml,organization);

      // Some SAJ forms require one additional "search" submit field.
      // If no rows are returned, retry common submit styles without assuming
      // that any one of them is permanently required.
      if(!athletes.length){
        for(const [k,v] of [["search","1"],["submit","1"],["action","search"]]){
          const retry=new URL(u);
          retry.searchParams.set(k,v);
          try{
            const h=await getText(retry.toString());
            athletes=parsePointRows(h,organization);
            if(athletes.length){
              return {
                season,
                seasonLabel:`${season-1}/${season}`,
                pointListNumber:extractSelectedPointListNumber(h),
                sex,
                organization,
                athletes,
                source:retry.toString()
              };
            }
          }catch{}
        }
      }

      if(athletes.length){
        return {
          season,
          seasonLabel:`${season-1}/${season}`,
          pointListNumber:extractSelectedPointListNumber(resultHtml),
          sex,
          organization,
          athletes,
          source:u.toString()
        };
      }
    }catch(e){
      lastError=e;
    }
  }
  if(lastError) throw lastError;
  return {season:null,seasonLabel:"",pointListNumber:null,sex,organization,athletes:[],source:""};
}


async function lookupOfficialPoints(saj){
  for(const season of getTargetSeasons()){
    const calUrl=`${SAJ_ORIGIN}/alpine/point/calendar?season_code=${season}`;
    let cal="";
    try{ cal=await getText(calUrl); }catch{ continue; }

    // Prefer calendar rows because they carry the official SAJ point-list number.
    const entries=extractPointListEntries(cal).reverse();
    for(const entry of entries){
      try{
        let athlete=null;
        if(entry.download){
          const raw=await getRawText(entry.link);
          if(raw.includes(saj)) athlete=parseDelimitedPointFile(raw,saj,entry.link);
        }else{
          athlete=await tryPointPage(entry.link,saj,season);
        }
        if(athlete){
          athlete.seasonCode=season;
          athlete.seasonLabel=`${season-1}/${season}`;
          athlete.pointListNumber=entry.pointListNumber;
          return athlete;
        }
      }catch{}
    }

    // Compatibility fallback for calendar layouts not recognized above.
    const pointLinks=extractPointListLinks(cal).slice(-50).reverse();
    for(const link of pointLinks){
      const athlete=await tryPointPage(link,saj,season);
      if(athlete){
        athlete.seasonCode=season;
        athlete.seasonLabel=`${season-1}/${season}`;
        athlete.pointListNumber=null;
        return athlete;
      }
    }

    const downloads=extractDownloadLinks(cal).slice(-80).reverse();
    for(const link of downloads){
      try{
        const raw=await getRawText(link);
        if(!raw.includes(saj)) continue;
        const athlete=parseDelimitedPointFile(raw,saj,link);
        if(athlete){
          athlete.seasonCode=season;
          athlete.seasonLabel=`${season-1}/${season}`;
          athlete.pointListNumber=null;
          return athlete;
        }
      }catch{}
    }

    const generic=`${SAJ_ORIGIN}/alpine/point/list`;
    const athlete=await tryPointPage(generic,saj,season);
    if(athlete){
      athlete.seasonCode=season;
      athlete.seasonLabel=`${season-1}/${season}`;
      athlete.pointListNumber=null;
      return athlete;
    }
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
          "User-Agent":"AlpineTeamManager/0.13.17 (+public SAJ competition calendar lookup)",
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
    "User-Agent":"AlpineTeamManager/0.13.17 (+public SAJ competition calendar lookup)",
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
      "User-Agent":"AlpineTeamManager/0.13.17 (+public SAJ competition calendar lookup)",
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
      "User-Agent":"AlpineTeamManager/0.13.17 (+public SAJ competition calendar lookup)",
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
