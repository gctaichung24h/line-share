(() => {
  'use strict';
  // GC_ADDRESS_GUARD_R10V — ArcGIS Taiwan label order / corruption firewall.
  const V='r10v-address-guard-20260810';
  const C=['台北市','新北市','桃園市','台中市','台南市','高雄市','基隆市','新竹市','嘉義市','新竹縣','苗栗縣','彰化縣','南投縣','雲林縣','嘉義縣','屏東縣','宜蘭縣','花蓮縣','台東縣','澎湖縣','金門縣','連江縣'];
  const road=/(?:路|街|道|大道|巷|弄)/, district=/^[\u3400-\u9fff]{1,8}(?:區|鄉|鎮|市)$/;
  const clean=v=>String(v??'').replace(/臺/g,'台').replace(/号/g,'號').replace(/　/g,' ').replace(/\s+/g,' ').trim();
  const compact=v=>clean(v).replace(/[，,、\s]+/g,'');
  const county=v=>C.find(x=>clean(v).includes(x))||'';
  const same=(a,b)=>!!compact(a)&&compact(a)===compact(b);
  const bad=v=>{
    const t=compact(v); if(!t)return false;
    if(C.some(x=>t.split(x).length-1>1))return true;
    const found=C.filter(x=>t.includes(x)); if(found.length>1)return true;
    const i=t.search(road); if(i>=0&&C.some(x=>t.slice(i+1).includes(x)))return true;
    if(i>=0&&/[0-9０-９]號?.{0,12}[\u3400-\u9fff]{1,8}(?:區|鄉|鎮|市)$/.test(t))return true;
    return false;
  };
  function street(v){
    let t=clean(v); if(!t)return'';
    let m=t.match(/^([0-9０-９]+(?:[-之][0-9０-９]+)?)\s*(.+)$/);
    if(m&&road.test(m[2]))t=`${clean(m[2])}${m[1].replace(/-/g,'之')}號`;
    m=t.match(/^(.*(?:路|街|道|大道|巷|弄))\s*([0-9０-９]+(?:[-之][0-9０-９]+)?)$/);
    if(m)t=`${clean(m[1])}${m[2].replace(/-/g,'之')}號`;
    return clean(t);
  }
  function fromComma(raw){
    const tokens=clean(raw).split(/[,，、]+/).map(clean).filter(Boolean);
    if(tokens.length<2)return null;
    let c='',d='',detail='';
    for(const t0 of tokens){
      const t=t0.replace(/^(?:台灣|Taiwan|TWN)$/i,'').trim(); if(!t||/^[0-9０-９]{3}(?:[0-9０-９]{2,3})?$/.test(t))continue;
      const cc=county(t); if(cc&&same(t,cc)){if(!c)c=cc;continue;}
      if(!d&&district.test(t)&&!same(t,c)){d=t;continue;}
      if(!detail)detail=t;
    }
    if(!c)c=county(raw); if(!c||!detail)return null;
    return {c,d,detail:street(detail)};
  }
  function canonical(raw,attrs={}){
    raw=clean(raw); if(!raw)return'';
    let c=county(attrs.Region)||county(attrs.City)||county(attrs.Subregion)||county(raw), d='';
    for(const x of [attrs.District,attrs.City,attrs.Subregion]){const t=clean(x);if(t&&district.test(t)&&!same(t,c)){d=t;break;}}
    let detail='';
    const place=clean(attrs.PlaceName), st=clean(attrs.StName), num=clean(attrs.AddNum).replace(/號$/,'');
    if(place&&!same(place,c)&&!same(place,d))detail=place;
    else if(st)detail=num?`${st}${num}號`:st;
    else if(clean(attrs.Address)&&!same(attrs.Address,c)&&!same(attrs.Address,d))detail=street(attrs.Address);
    if(!detail){const p=fromComma(raw);if(p){c=c||p.c;d=d||p.d;detail=p.detail;}}
    if(!c||!detail)return bad(raw)?'':raw;
    detail=street(detail); for(const x of C)detail=detail.replaceAll(x,''); if(d&&detail.startsWith(d))detail=detail.slice(d.length);
    const out=compact(`${c}${d}${detail}`); return bad(out)?'':out;
  }
  const nativeFetch=window.fetch?.bind(window);
  if(nativeFetch)window.fetch=async(input,init)=>{
    let url,kind='';
    try{
      const raw=typeof input==='string'?input:input?.url; if(!raw)return nativeFetch(input,init);
      url=new URL(raw,location.href); if(!/(?:^|\.)geocode(?:-api)?\.arcgis\.com$/i.test(url.hostname))return nativeFetch(input,init);
      const p=url.pathname.toLowerCase(); if(p.endsWith('/suggest'))kind='s'; else if(p.endsWith('/findaddresscandidates'))kind='c'; else return nativeFetch(input,init);
      if(kind==='c'&&typeof input==='string'){
        const f=new Set((url.searchParams.get('outFields')||'').split(',').filter(Boolean));
        ['Addr_type','Match_addr','ShortLabel','LongLabel','MatchID','City','District','Region','Subregion','StName','AddNum','Address','PlaceName'].forEach(x=>f.add(x));
        url.searchParams.set('outFields',[...f].join(',')); input=url.toString();
      }
    }catch(_){return nativeFetch(input,init)}
    const r=await nativeFetch(input,init); if(!r?.ok)return r;
    try{
      const data=await r.clone().json();
      if(kind==='s'&&Array.isArray(data.suggestions))data.suggestions=data.suggestions.map(x=>{const v=canonical(x?.text);return v?{...x,text:v}:x});
      if(kind==='c'&&Array.isArray(data.candidates))data.candidates=data.candidates.map(x=>{
        if(!x||typeof x!=='object')return x; const a={...(x.attributes||{})}, raw=a.Match_addr||x.address||a.LongLabel||a.ShortLabel||'', v=canonical(raw,a); if(!v)return x;
        a.Match_addr=v;a.LongLabel=v;a.ShortLabel=v;return {...x,address:v,attributes:a};
      });
      const h=new Headers(r.headers);h.set('content-type','application/json; charset=utf-8');return new Response(JSON.stringify(data),{status:r.status,statusText:r.statusText,headers:h});
    }catch(_){return r}
  };
  // Remove only unmistakably corrupted old saved addresses; never rewrite customer history by guesswork.
  for(const key of ['gc_recent_addresses_v1','gc_favorite_trips_v1'])try{
    const a=JSON.parse(localStorage.getItem(key)||'null'); if(!Array.isArray(a))continue;
    const b=key.includes('favorite')?a.filter(x=>x&&!bad(x.pickup)&&!bad(x.destination)):a.filter(x=>!bad(x));
    if(b.length!==a.length)localStorage.setItem(key,JSON.stringify(b));
  }catch(_){}
  // Last line of defense: a programmatic malformed value cannot overwrite a sane visible address.
  const last=new WeakMap();
  document.addEventListener('focusin',e=>{const x=e.target;if(x instanceof HTMLInputElement&&['pickup','destination'].includes(x.id)&&!bad(x.value))last.set(x,x.value)},true);
  document.addEventListener('input',e=>{const x=e.target;if(!(x instanceof HTMLInputElement)||!['pickup','destination'].includes(x.id))return;if(!bad(x.value)){last.set(x,x.value);return}if(e.isTrusted)return;const v=last.get(x);if(typeof v==='string'){x.value=v;x.dataset.gcSkipSuggestOnce='1';for(const k of ['gcAddressVerified','gcAddressVerifiedKey','gcAddressVerifiedSource','gcResolvedAddress'])delete x.dataset[k];x.classList.remove('gc-address-verified')}},true);
  window.GC_ADDRESS_GUARD=Object.freeze({version:V,canonicalTaiwanAddress:canonical,isStructurallyCorruptAddress:bad});
})();
