(() => {
  'use strict';

  // GC_ADDRESS_GUARD_R10W
  // Boundary hardening for Taiwan address data returned by ArcGIS; R10W keeps passenger text authoritative.
  // Goals:
  // 1) never let provider label order (e.g. "43 自由路二段, 東區, 台中市")
  //    become a malformed dispatch string;
  // 2) keep county/district in canonical Taiwan order;
  // 3) reject obviously corrupted programmatic address values before they spread to LINE,
  //    recent addresses, favorites, or Google Maps.

  const VERSION = 'r10w-address-guard-20260810';
  const COUNTIES = [
    '台北市','新北市','桃園市','台中市','台南市','高雄市','基隆市','新竹市','嘉義市',
    '新竹縣','苗栗縣','彰化縣','南投縣','雲林縣','嘉義縣','屏東縣','宜蘭縣','花蓮縣',
    '台東縣','澎湖縣','金門縣','連江縣'
  ];
  const COUNTY_RE = new RegExp(`(${COUNTIES.join('|')})`, 'g');
  const POSTAL_RE = /^[0-9０-９]{3}(?:[0-9０-９]{2,3})?$/;
  const COUNTRY_RE = /^(?:台灣|臺灣|Taiwan|TWN)$/i;
  const DISTRICT_RE = /^[\u3400-\u9fff]{1,8}(?:區|鄉|鎮|市)$/;
  const ROAD_RE = /(?:路|街|道|大道|巷|弄)/;
  const ARCGIS_HOST_RE = /(?:^|\.)geocode(?:-api)?\.arcgis\.com$/i;

  const compact = value => String(value ?? '')
    .replace(/臺/g, '台')
    .replace(/号/g, '號')
    .replace(/　/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const noSpace = value => compact(value).replace(/[，,、\s]+/g, '');

  function samePart(a, b) {
    const x = noSpace(a);
    const y = noSpace(b);
    return Boolean(x && y && x === y);
  }

  function countyFrom(value) {
    const text = compact(value);
    return COUNTIES.find(county => text.includes(county)) || '';
  }

  function cleanToken(value) {
    return compact(value)
      .replace(/^(?:台灣|臺灣)\s*/i, '')
      .replace(/\s*(?:台灣|臺灣|Taiwan|TWN)$/i, '')
      .trim();
  }

  function normalizeStreetToken(value) {
    let text = cleanToken(value);
    if (!text) return '';

    // ArcGIS may localize Taiwan labels as "43 自由路二段". Taiwan dispatch/navigation
    // expects "自由路二段43號". Only reorder when a street token is clearly present.
    const leadingHouse = text.match(/^([0-9０-９]+(?:[-之][0-9０-９]+)?)\s+(.+)$/);
    if (leadingHouse && ROAD_RE.test(leadingHouse[2])) {
      const house = leadingHouse[1].replace(/-/g, '之');
      const street = compact(leadingHouse[2]);
      text = `${street}${house}${/號$/.test(house) ? '' : '號'}`;
    }

    // Also handle compact provider labels such as "43自由路二段" without spaces.
    const compactLeadingHouse = text.match(/^([0-9０-９]+(?:[-之][0-9０-９]+)?)([^0-9０-９].*)$/);
    if (compactLeadingHouse && ROAD_RE.test(compactLeadingHouse[2])) {
      const house = compactLeadingHouse[1].replace(/-/g, '之');
      const street = compact(compactLeadingHouse[2]);
      text = `${street}${house}號`;
    }

    // Normalize a trailing house number only when it follows a road/street/alley token.
    const trailingHouse = text.match(/^(.*(?:路|街|道|大道|巷|弄))\s*([0-9０-９]+(?:[-之][0-9０-９]+)?)$/);
    if (trailingHouse) text = `${compact(trailingHouse[1])}${trailingHouse[2].replace(/-/g, '之')}號`;

    return compact(text);
  }

  function parseCommaLabel(value) {
    const raw = compact(value);
    if (!raw) return null;
    const tokens = raw.split(/[,，、]+/).map(cleanToken).filter(Boolean);
    if (tokens.length < 2) return null;

    let county = '';
    let district = '';
    const detailTokens = [];

    for (const token of tokens) {
      if (!token || COUNTRY_RE.test(token) || POSTAL_RE.test(noSpace(token))) continue;
      const tokenCounty = countyFrom(token);
      if (tokenCounty && (samePart(token, tokenCounty) || noSpace(token).endsWith(noSpace(tokenCounty)))) {
        if (!county) county = tokenCounty;
        const leftover = compact(token.replace(tokenCounty, ''));
        if (leftover && !POSTAL_RE.test(noSpace(leftover))) detailTokens.push(leftover);
        continue;
      }
      if (!district && DISTRICT_RE.test(token) && !samePart(token, county)) {
        district = token;
        continue;
      }
      detailTokens.push(token);
    }

    if (!county) county = countyFrom(raw);
    if (!county || !detailTokens.length) return null;

    // A district may be embedded in a detail token. Pull it out only when it is a clean prefix.
    if (!district) {
      for (let i = 0; i < detailTokens.length; i += 1) {
        const match = detailTokens[i].match(/^([\u3400-\u9fff]{1,8}(?:區|鄉|鎮|市))\s*(.*)$/);
        if (match && !samePart(match[1], county)) {
          district = match[1];
          detailTokens[i] = compact(match[2]);
          break;
        }
      }
    }

    const detail = detailTokens.map(normalizeStreetToken).filter(Boolean).join('');
    if (!detail) return null;
    return { county, district, detail };
  }

  function structuredParts(attrs = {}, fallback = '') {
    if (!attrs || typeof attrs !== 'object') attrs = {};
    const values = [attrs.Region, attrs.City, attrs.Subregion, attrs.District, fallback].map(compact);
    let county = '';
    for (const value of values) {
      county = countyFrom(value);
      if (county) break;
    }

    let district = '';
    for (const value of [attrs.District, attrs.City, attrs.Subregion]) {
      const token = compact(value);
      if (token && DISTRICT_RE.test(token) && !samePart(token, county)) {
        district = token;
        break;
      }
    }

    let detail = '';
    const place = compact(attrs.PlaceName);
    const streetName = compact(attrs.StName);
    const addNum = compact(attrs.AddNum).replace(/號$/, '');
    const addressField = compact(attrs.Address);
    const shortLabel = compact(attrs.ShortLabel);

    if (place && !samePart(place, county) && !samePart(place, district)) detail = place;
    if (!detail && streetName) detail = addNum ? `${streetName}${addNum}號` : streetName;
    if (!detail && addressField && !samePart(addressField, county) && !samePart(addressField, district)) detail = normalizeStreetToken(addressField);
    if (!detail && shortLabel && !samePart(shortLabel, county) && !samePart(shortLabel, district)) detail = normalizeStreetToken(shortLabel);

    if ((!county || !detail) && fallback) {
      const parsed = parseCommaLabel(fallback);
      if (parsed) {
        if (!county) county = parsed.county;
        if (!district) district = parsed.district;
        if (!detail) detail = parsed.detail;
      }
    }
    return { county, district, detail };
  }

  function countOccurrences(text, needle) {
    if (!text || !needle) return 0;
    return text.split(needle).length - 1;
  }

  function isStructurallyCorruptAddress(value) {
    const text = noSpace(value);
    if (!text) return false;

    // Same county repeated is never a valid dispatch address.
    for (const county of COUNTIES) {
      if (countOccurrences(text, county) > 1) return true;
    }

    const countyMatches = text.match(COUNTY_RE) || [];
    if (new Set(countyMatches).size > 1) return true;

    // Provider-order leak: road/house first, then district/county afterwards.
    const roadIndex = text.search(ROAD_RE);
    if (roadIndex >= 0) {
      const afterRoad = text.slice(roadIndex + 1);
      if (COUNTIES.some(county => afterRoad.includes(county))) return true;
      if (/[0-9０-９]號?.{0,12}[\u3400-\u9fff]{1,8}(?:區|鄉|鎮|市)$/.test(text)) return true;
    }

    return false;
  }

  function canonicalTaiwanAddress(value, attrs = {}) {
    const raw = compact(value);
    if (!raw) return '';

    const structured = structuredParts(attrs, raw);
    let { county, district, detail } = structured;

    if (!county || !detail) {
      const parsed = parseCommaLabel(raw);
      if (parsed) ({ county, district, detail } = parsed);
    }

    if (!county || !detail) {
      // Do not aggressively rewrite already compact labels. The guard is for provider-order
      // corruption, not for inventing administrative data that the geocoder did not return.
      return isStructurallyCorruptAddress(raw) ? '' : compact(raw);
    }

    detail = normalizeStreetToken(detail)
      .replace(new RegExp(COUNTIES.join('|'), 'g'), '')
      .trim();
    if (district) detail = detail.replace(new RegExp(`^${district}`), '').trim();
    if (!detail) return '';

    const result = noSpace(`${county}${district || ''}${detail}`);
    return isStructurallyCorruptAddress(result) ? '' : result;
  }

  function normalizeSuggestPayload(data) {
    if (!data || !Array.isArray(data.suggestions)) return data;
    data.suggestions = data.suggestions.map(item => {
      if (!item || typeof item !== 'object' || !item.text) return item;
      const safe = canonicalTaiwanAddress(item.text);
      return safe ? { ...item, text: safe } : item;
    });
    return data;
  }

  function normalizeCandidatePayload(data) {
    if (!data || !Array.isArray(data.candidates)) return data;
    data.candidates = data.candidates.map(candidate => {
      if (!candidate || typeof candidate !== 'object') return candidate;
      const attrs = candidate.attributes && typeof candidate.attributes === 'object' ? { ...candidate.attributes } : {};
      const raw = attrs.Match_addr || candidate.address || attrs.LongLabel || attrs.ShortLabel || '';
      const safe = canonicalTaiwanAddress(raw, attrs);
      if (!safe) return candidate;
      attrs.Match_addr = safe;
      attrs.LongLabel = safe;
      // ShortLabel is allowed to stay short for UI, but keeping it safe avoids a fallback leak.
      attrs.ShortLabel = safe;
      return { ...candidate, address: safe, attributes: attrs };
    });
    return data;
  }

  function enhanceArcgisRequest(input, init) {
    try {
      const rawUrl = typeof input === 'string' ? input : input?.url;
      if (!rawUrl) return { input, init, kind: '' };
      const url = new URL(rawUrl, location.href);
      if (!ARCGIS_HOST_RE.test(url.hostname)) return { input, init, kind: '' };
      const path = url.pathname.toLowerCase();
      let kind = '';
      if (path.endsWith('/suggest')) kind = 'suggest';
      else if (path.endsWith('/findaddresscandidates')) kind = 'candidate';
      else return { input, init, kind: '' };

      if (kind === 'candidate') {
        const requested = new Set((url.searchParams.get('outFields') || '').split(',').map(v => v.trim()).filter(Boolean));
        ['Addr_type','Match_addr','ShortLabel','LongLabel','MatchID','City','District','Region','Subregion','StName','AddNum','Address','PlaceName']
          .forEach(field => requested.add(field));
        url.searchParams.set('outFields', [...requested].join(','));
      }

      if (typeof input === 'string') return { input: url.toString(), init, kind };
      // Request objects are uncommon in this app. Avoid reconstructing one unless needed.
      return { input, init, kind };
    } catch (_) {
      return { input, init, kind: '' };
    }
  }

  const nativeFetch = window.fetch?.bind(window);
  if (nativeFetch) {
    window.fetch = async function gcAddressGuardFetch(input, init) {
      const enhanced = enhanceArcgisRequest(input, init);
      const response = await nativeFetch(enhanced.input, enhanced.init);
      if (!enhanced.kind || !response?.ok) return response;

      try {
        const data = await response.clone().json();
        const transformed = enhanced.kind === 'suggest'
          ? normalizeSuggestPayload(data)
          : normalizeCandidatePayload(data);
        const headers = new Headers(response.headers);
        headers.set('content-type', 'application/json; charset=utf-8');
        return new Response(JSON.stringify(transformed), {
          status: response.status,
          statusText: response.statusText,
          headers
        });
      } catch (_) {
        return response;
      }
    };
  }

  function purgeKnownCorruption() {
    try {
      const raw = localStorage.getItem('gc_recent_addresses_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(item => !isStructurallyCorruptAddress(item));
          if (clean.length !== parsed.length) localStorage.setItem('gc_recent_addresses_v1', JSON.stringify(clean));
        }
      }
    } catch (_) {}

    try {
      const raw = localStorage.getItem('gc_favorite_trips_v1');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter(item => item && !isStructurallyCorruptAddress(item.pickup) && !isStructurallyCorruptAddress(item.destination));
          if (clean.length !== parsed.length) localStorage.setItem('gc_favorite_trips_v1', JSON.stringify(clean));
        }
      }
    } catch (_) {}
  }

  const lastGood = new WeakMap();
  document.addEventListener('focusin', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !['pickup', 'destination'].includes(input.id)) return;
    if (!isStructurallyCorruptAddress(input.value)) lastGood.set(input, input.value);
  }, true);

  document.addEventListener('input', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !['pickup', 'destination'].includes(input.id)) return;
    const current = input.value;
    if (!isStructurallyCorruptAddress(current)) {
      lastGood.set(input, current);
      return;
    }

    // Never alter a trusted user's keystroke. This branch only blocks programmatic corruption
    // introduced by provider data / old saved data / app transformations.
    if (event.isTrusted) return;
    const fallback = lastGood.get(input);
    if (typeof fallback === 'string') {
      input.value = fallback;
      input.dataset.gcSkipSuggestOnce = '1';
      delete input.dataset.gcAddressVerified;
      delete input.dataset.gcAddressVerifiedKey;
      delete input.dataset.gcAddressVerifiedSource;
      delete input.dataset.gcResolvedAddress;
      input.classList.remove('gc-address-verified');
    }
  }, true);

  purgeKnownCorruption();

  // Exposed only for regression diagnostics. No customer data is stored or transmitted.
  window.GC_ADDRESS_GUARD = Object.freeze({
    version: VERSION,
    canonicalTaiwanAddress,
    isStructurallyCorruptAddress
  });
})();
