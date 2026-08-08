(() => {
  'use strict';
  const GC_BUILD_VERSION = 'master202608r5';
  let gcLastVersionCheck = 0;
  async function ensureLatestBuild(force = false) {
    const now = Date.now();
    if (!force && now - gcLastVersionCheck < 30000) return;
    gcLastVersionCheck = now;
    try {
      const res = await fetch('version.json?t=' + now, { cache: 'no-store' });
      if (!res.ok) return;
      const info = await res.json();
      if (info && info.version && info.version !== GC_BUILD_VERSION) {
        const url = new URL(location.href);
        url.searchParams.set('gcver', info.version);
        url.searchParams.set('_r', String(now));
        location.replace(url.toString());
      }
    } catch (_) {}
  }
  window.addEventListener('pageshow', () => ensureLatestBuild(true));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) ensureLatestBuild(true); });


  const CONFIG = window.GC_FORM_CONFIG || {};
  const COMMON = CONFIG.common || {};
  const app = document.getElementById('app');
  const preview = new URLSearchParams(location.search).get('preview') === '1';
  const brandAvatarUrl = document.querySelector('.loading-card .brand-avatar')?.getAttribute('src') || '表格頭像_直接更換.png';
  const RELEASE_MARKER = 'GC_MASTER_STABLE_2026_08R5_OPTIONAL_CONTEXT_GUIDANCE_SAFE';
  const RECENT_STORAGE_KEY = 'gc_recent_addresses_v1';
  const RECENT_LIMIT = 3;
  const FAVORITE_STORAGE_KEY = 'gc_favorite_trips_v1';
  const FAVORITE_LIMIT = 3;
  const LAST_SUBMISSION_STORAGE_KEY = 'gc_last_submission_v1';
  const DUPLICATE_WINDOW_MS = 60 * 1000;
  const LOCATION_MARKER = '📍 已附上目前定位';
  const LOCATION_AUTO_ACCEPT_ACCURACY_M = 35;
  const LOCATION_REVIEW_ACCURACY_M = 100;
  const LOCATION_SAMPLE_WINDOW_MS = 3200;
  const LOCATION_REVERSE_GEOCODE_TIMEOUT_MS = 3500;
  const ADDRESS_SUGGEST_DEBOUNCE_MS = 320;
  const ADDRESS_SUGGEST_TIMEOUT_MS = 3000;
  const ADDRESS_BIAS_LOCATION = '120.6736,24.1477';
  const ADDRESS_TAIWAN_MAIN_ISLAND_EXTENT = '119.85,21.75,122.15,25.45';
  const ADDRESS_PRIMARY_REGIONS = [
    { name: '台中市', location: '120.6736,24.1477', score: 400 },
    { name: '彰化縣', location: '120.5440,24.0756', score: 330 },
    { name: '南投縣', location: '120.6850,23.9157', score: 310 }
  ];
  const ADDRESS_TAIWAN_COUNTIES = ['台北市','新北市','桃園市','台中市','台南市','高雄市','基隆市','新竹市','嘉義市','新竹縣','苗栗縣','彰化縣','南投縣','雲林縣','嘉義縣','屏東縣','宜蘭縣','花蓮縣','台東縣','澎湖縣','金門縣','連江縣'];
  const ADDRESS_SUGGEST_CACHE_LIMIT = 40;
  const addressSuggestionCache = new Map();
  let pendingConfirmAction = null;
  let confirmationBusy = false;
  let pendingRecentClearAction = null;
  let attachedLocation = null;
  let locationRequestToken = 0;
  let addressSuggestRequestToken = 0;
  let modalScrollY = 0;
  let modalLockDepth = 0;
  let liffReadyPromise = null;

  function loadLiffSdk() {
    if (window.liff) return Promise.resolve(window.liff);
    return new Promise((resolve, reject) => {
      const finish = () => window.liff ? resolve(window.liff) : reject(new Error('LIFF SDK 載入失敗。'));
      const fail = () => reject(new Error('LIFF SDK 載入失敗，請確認網路後重試。'));
      const existing = document.querySelector('script[data-gc-liff-sdk="1"]');
      if (existing) {
        existing.addEventListener('load', finish, { once: true });
        existing.addEventListener('error', fail, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
      script.async = true;
      script.dataset.gcLiffSdk = '1';
      script.addEventListener('load', finish, { once: true });
      script.addEventListener('error', fail, { once: true });
      document.head.appendChild(script);
    });
  }

  function ensureLiffReady() {
    if (preview) return Promise.resolve(null);
    if (!liffReadyPromise) {
      liffReadyPromise = loadLiffSdk().then(async sdk => {
        await sdk.init({ liffId: CONFIG.liffId });
        return sdk;
      });
    }
    return liffReadyPromise;
  }

  function lockViewport() {
    modalLockDepth += 1;
    if (modalLockDepth > 1) return;
    modalScrollY = window.scrollY || window.pageYOffset || 0;
    document.documentElement.classList.add('gc-modal-lock');
    document.body.classList.add('modal-open', 'gc-modal-lock');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${modalScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockViewport(force = false) {
    if (force) modalLockDepth = 0;
    else modalLockDepth = Math.max(0, modalLockDepth - 1);
    if (modalLockDepth > 0) return;
    const y = modalScrollY;
    document.documentElement.classList.remove('gc-modal-lock');
    document.body.classList.remove('modal-open', 'gc-modal-lock');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    requestAnimationFrame(() => window.scrollTo(0, y));
  }

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const requiredLabel = (text) => `<span class="required">${escapeHtml(text)}</span>`;

  function renderBrand() {
    return `
      <header class="brand-header" data-release="${RELEASE_MARKER}">
        <img class="brand-avatar" src="${brandAvatarUrl}" alt="GC 車隊頭像">
        <div class="brand-copy">
          <strong>${escapeHtml(COMMON['品牌名稱'] || 'GC 台中白牌車隊 24H')}</strong>
          <span>安全｜專業｜可靠｜貼心</span>
        </div>
      </header>`;
  }

  function renderQr() {
    document.title = COMMON['品牌名稱'] || 'GC 台中白牌車隊 24H';
    app.innerHTML = `<section class="qr-page"><img src="IMG_1323.jpeg" alt="GC 官方 QR Code"></section>`;
  }

  function renderFatal(title, message) {
    app.innerHTML = `
      ${renderBrand()}
      <section class="error-card">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(message)}</p>
      </section>`;
  }

  function fieldText(id, label, placeholder, required = false, type = 'text') {
    return `
      <div class="field">
        <label for="${id}">${required ? requiredLabel(label) : escapeHtml(label)}</label>
        <input class="input" id="${id}" name="${id}" type="${type}" placeholder="${escapeHtml(placeholder || '')}" ${required ? 'required' : ''} autocomplete="off">
        <div class="error-text" id="${id}Error"></div>
      </div>`;
  }

  function fieldAddress(id, label, placeholder, required = false, allowLocation = false, showRecent = true) {
    return `
      <div class="field address-field">
        <label for="${id}">${required ? requiredLabel(label) : escapeHtml(label)}</label>
        <input class="input" id="${id}" name="${id}" type="text" placeholder="${escapeHtml(placeholder || '')}" ${required ? 'required' : ''} autocomplete="street-address">
        <div class="gc-address-suggest hidden" id="${id}Suggest" role="listbox" aria-label="地址建議"></div>
        ${allowLocation ? `
          <div class="location-action hidden" id="locationAction">
            <button class="location-btn" id="locationBtn" type="button">${escapeHtml(COMMON['定位按鈕'] || '📍 使用目前位置')}</button>
            <div class="location-status" id="locationStatus" aria-live="polite"></div>
          </div>
          <div class="location-review hidden" id="locationReview">
            <span id="locationReviewText"></span>
            <button class="location-confirm-btn" id="locationConfirmBtn" type="button">✓ 地址正確</button>
          </div>` : ''}
        ${showRecent ? `
        <div class="recent-address-control hidden" data-target="${id}">
          <button class="recent-toggle" type="button" aria-expanded="false">
            <span>🕘 ${escapeHtml(COMMON['最近地址標題'] || '最近使用地址')}</span>
            <span class="recent-count"></span>
            <span class="recent-chevron" aria-hidden="true">⌄</span>
          </button>
          <div class="recent-panel hidden"></div>
        </div>` : ''}
        <div class="error-text" id="${id}Error"></div>
      </div>`;
  }

  function fieldTextarea(id, label, placeholder) {
    return `
      <div class="field">
        ${label ? `<label for="${id}">${escapeHtml(label)}</label>` : ''}
        <textarea id="${id}" name="${id}" placeholder="${escapeHtml(placeholder || '')}"></textarea>
      </div>`;
  }

  function modeChoices(cfg) {
    return `
      <div class="field">
        <div class="field-label required">服務類型</div>
        <div class="segmented">
          <label class="choice">
            <input type="radio" name="serviceType" value="instant">
            <span>${escapeHtml(cfg['即時選項'])}</span>
          </label>
          <label class="choice">
            <input type="radio" name="serviceType" value="reserve">
            <span>${escapeHtml(cfg['預約選項'])}</span>
          </label>
        </div>
        <div class="error-text" id="serviceTypeError"></div>
      </div>`;
  }

  function scheduleFields(cfg) {
    return `
      <div id="scheduleFields" class="schedule-grid hidden">
        <div class="field" style="margin-bottom:0">
          <label for="date">${requiredLabel(cfg['日期標題'])}</label>
          <input class="input" id="date" name="date" type="date">
          <div class="error-text" id="dateError"></div>
        </div>
        <div class="field" style="margin-bottom:0">
          <label for="time">${requiredLabel(cfg['時間標題'])}</label>
          <input class="input" id="time" name="time" type="time">
          <div class="error-text" id="timeError"></div>
        </div>
      </div>`;
  }

  function renderReminderNotice(cfg, extraClass = '') {
    const reminderLines = [];
    for (let i = 1; i <= 12; i += 1) {
      const text = cfg[`表格提醒${i}`];
      if (text) reminderLines.push(`<p>${escapeHtml(text).replace(/\n/g, '<br>')}</p>`);
    }
    const className = ['notice', extraClass].filter(Boolean).join(' ');
    return reminderLines.length ? `<div class="${className}">${reminderLines.join('')}</div>` : '';
  }


  function normalizeAddress(address) {
    return String(address || '').replace(/\s+/g, ' ').trim();
  }

  function smartNormalizeTaiwanAddress(address) {
    let text = normalizeAddress(address).replace(/号/g, '號');
    if (!text || /[號樓室]$/.test(text)) return text;
    const match = text.match(/([0-9０-９]+(?:[-之][0-9０-９]+)?)$/);
    if (!match || !/[路街道巷弄]/.test(text)) return text;
    const mainDigits = match[1].split(/[-之]/)[0];
    const prefix = text.slice(0, match.index);
    const looksLikeHouseNumber = mainDigits.length >= 2 || /[段巷弄]$/.test(prefix) || /[段巷弄].*$/.test(prefix);
    if (looksLikeHouseNumber) text += '號';
    return text;
  }

  // GC_MASTER_STABLE_2026_08R4_LOCATION_ADDRESS_CLEAN
  // Only normalize addresses generated by the current-location reverse geocoder.
  // Do not apply this globally to rider-entered text, so house numbers and custom landmarks stay untouched.
  function cleanLocatedTaiwanAddress(address) {
    let text = String(address || '')
      .replace(/　/g, ' ')
      .replace(/臺/g, '台')
      .replace(/号/g, '號')
      .trim();
    if (!text) return '';

    // Taiwan reverse-geocode output may start with a 3-digit or 3+3 postal code.
    // It has no dispatch value, so remove it only in this location-generated path.
    text = text.replace(/^[0-9０-９]{3}(?:[0-9０-９]{3})?\s*(?=(?:台|臺)(?:北|中|南|東)市|新北市|桃園市|高雄市|基隆市|新竹(?:市|縣)|嘉義(?:市|縣)|苗栗縣|彰化縣|南投縣|雲林縣|屏東縣|宜蘭縣|花蓮縣|(?:台|臺)東縣|澎湖縣|金門縣|連江縣)/, '');

    // Chinese Taiwan addresses read more cleanly without separator spaces.
    // If a provider ever returns a non-Chinese address, keep normal word spacing instead.
    if (/[市縣區鄉鎮村里路街道段巷弄號]/.test(text)) {
      text = text.replace(/\s+/g, '');
    } else {
      text = normalizeAddress(text);
    }
    return smartNormalizeTaiwanAddress(text);
  }

  function normalizeAddressInput(id) {
    const input = document.getElementById(id);
    if (!input) return '';
    const normalized = smartNormalizeTaiwanAddress(input.value);
    if (normalized && normalized !== input.value.trim()) input.value = normalized;
    if (id === 'pickup' && attachedLocation && attachedLocation.manualAddress && normalized) {
      attachedLocation.manualAddress = normalized;
      attachedLocation.address = normalized;
    }
    return normalized;
  }

  function hideAddressSuggestions(id) {
    const box = document.getElementById(`${id}Suggest`);
    if (!box) return;
    box.innerHTML = '';
    box.classList.add('hidden');
  }

  function cleanSuggestedAddress(value) {
    return normalizeAddress(String(value || '')
      .replace(/臺/g, '台')
      .replace(/(?:,|\s)+(?:Taiwan|TWN|台灣|臺灣)$/i, '')
      .replace(/,\s*/g, ' ')
      .replace(/\s+\d{3}(?:\d{2,3})?$/, ''));
  }

  function isClearlyOutsideTaiwanSuggestion(value) {
    const text = String(value || '');
    return /(中國|中国|中華人民共和國|中华人民共和国|福建省|廣東省|广东省|浙江省|江蘇省|江苏省|江西省|安徽省|山東省|山东省|河南省|河北省|湖北省|湖南省|四川省|貴州省|贵州省|雲南省|云南省|海南省|遼寧省|辽宁省|吉林省|黑龍江省|黑龙江省|陝西省|陕西省|山西省|甘肅省|甘肃省|青海省|北京市|上海市|天津市|重慶市|重庆市|香港|澳門|澳门|Xiamen|Fujian|Guangdong|Zhejiang|Jiangsu|Shanghai|Beijing|China)/i.test(text);
  }

  function canonicalTaiwanCounty(value) {
    const text = String(value || '').replace(/臺/g, '台');
    return ADDRESS_TAIWAN_COUNTIES.find(county => text.includes(county)) || '';
  }

  function explicitTaiwanCountyFromQuery(value) {
    const text = String(value || '').replace(/臺/g, '台');
    const direct = canonicalTaiwanCounty(text);
    if (direct) return direct;
    const aliases = [
      ['台北市', /(?:^|\s)台北(?:市)?/], ['新北市', /新北(?:市)?/], ['桃園市', /桃園(?:市)?/],
      ['台中市', /台中(?:市)?/], ['台南市', /台南(?:市)?/], ['高雄市', /高雄(?:市)?/],
      ['新竹縣', /新竹縣/], ['新竹市', /新竹市/], ['苗栗縣', /苗栗(?:縣)?/],
      ['彰化縣', /彰化(?:縣)?/], ['南投縣', /南投(?:縣)?/], ['雲林縣', /雲林(?:縣)?/],
      ['嘉義縣', /嘉義縣/], ['嘉義市', /嘉義市/], ['屏東縣', /屏東(?:縣)?/],
      ['宜蘭縣', /宜蘭(?:縣)?/], ['花蓮縣', /花蓮(?:縣)?/], ['台東縣', /台東(?:縣)?/],
      ['基隆市', /基隆(?:市)?/], ['澎湖縣', /澎湖(?:縣)?/], ['金門縣', /金門(?:縣)?/], ['連江縣', /連江(?:縣)?/]
    ];
    return aliases.find(([, pattern]) => pattern.test(text))?.[0] || '';
  }

  function splitTaiwanSuggestionAddress(value) {
    const text = cleanSuggestedAddress(value).replace(/臺/g, '台');
    const county = canonicalTaiwanCounty(text);
    let remainder = text;
    if (county) remainder = remainder.replace(county, ' ').replace(/\s+/g, ' ').trim();

    let district = '';
    const districtMatch = remainder.match(/(?:^|\s)([\u3400-\u9fff]{1,7}?(?:區|鄉|鎮|市))(?:\s|$)/) ||
      remainder.match(/^([\u3400-\u9fff]{1,7}?(?:區|鄉|鎮|市))/);
    if (districtMatch) {
      district = districtMatch[1];
      remainder = remainder.replace(districtMatch[0], ' ').replace(/\s+/g, ' ').trim();
    } else if (county) {
      const countyIndex = text.indexOf(county);
      const afterCounty = text.slice(countyIndex + county.length).trim();
      const compactMatch = afterCounty.match(/^([\u3400-\u9fff]{1,7}?(?:區|鄉|鎮|市))/);
      if (compactMatch) {
        district = compactMatch[1];
        remainder = afterCounty.slice(district.length).trim();
      }
    }

    if (!remainder) remainder = text;
    return { county, district, detail: remainder, full: text };
  }

  function isTaiwanSuggestion(value) {
    if (!value || isClearlyOutsideTaiwanSuggestion(value)) return false;
    return Boolean(canonicalTaiwanCounty(value) || /(台灣|臺灣|Taiwan|TWN)/i.test(String(value)));
  }


  function canonicalizeSuggestedAddress(value) {
    const parts = splitTaiwanSuggestionAddress(value);
    if (!parts.county) return smartNormalizeTaiwanAddress(cleanSuggestedAddress(value));
    const admin = `${parts.county}${parts.district || ''}`;
    const detail = normalizeAddress(parts.detail || '');
    return smartNormalizeTaiwanAddress(`${admin}${detail}`);
  }

  function taiwanSuggestionScore(value, query, sourceRegion = '') {
    const text = String(value || '').replace(/臺/g, '台');
    const q = String(query || '').replace(/臺/g, '台');
    const parts = splitTaiwanSuggestionAddress(text);
    const explicitCounty = explicitTaiwanCountyFromQuery(q);
    let score = 0;

    const region = ADDRESS_PRIMARY_REGIONS.find(item => item.name === parts.county);
    if (region) score += region.score;
    else if (parts.county) score += 100;

    if (sourceRegion && parts.county === sourceRegion) score += 80;
    if (parts.district) score += 90;
    if (/[路街道巷弄]\s*\d+(?:[-之]\d+)?號/.test(text)) score += 25;
    if (q && text.includes(q)) score += 25;
    if (explicitCounty && parts.county === explicitCounty) score += 600;
    if (explicitCounty && parts.county && parts.county !== explicitCounty) score -= 600;

    const qDistrict = q.match(/([\u3400-\u9fff]{1,7}?(?:區|鄉|鎮|市))/)?.[1] || '';
    if (qDistrict && parts.district === qDistrict) score += 140;
    if (/[路街道巷弄]/.test(q) && !parts.district) score -= 70;
    return score;
  }

  function renderAddressSuggestion(item, index) {
    const parts = splitTaiwanSuggestionAddress(item.text);
    const admin = [parts.county, parts.district].filter(Boolean).join('｜');
    const detail = parts.detail && parts.detail !== parts.full ? parts.detail : parts.full;
    if (!admin) {
      return `<button type="button" class="gc-address-suggest-item" data-index="${index}" role="option"><span class="gc-address-suggest-detail">${escapeHtml(detail)}</span></button>`;
    }
    return `<button type="button" class="gc-address-suggest-item" data-index="${index}" role="option">
      <span class="gc-address-suggest-admin">${escapeHtml(admin)}</span>
      <span class="gc-address-suggest-detail">${escapeHtml(detail)}</span>
    </button>`;
  }

  async function fetchArcgisSuggest(text, locationBias, controller) {
    const params = new URLSearchParams({
      f: 'json',
      text,
      countryCode: 'TWN',
      langCode: 'zh-TW',
      location: locationBias || ADDRESS_BIAS_LOCATION,
      searchExtent: ADDRESS_TAIWAN_MAIN_ISLAND_EXTENT,
      preferredLabelValues: 'localCity',
      returnCollections: 'false',
      maxSuggestions: '6'
    });
    const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?${params.toString()}`, {
      method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', signal: controller?.signal
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (!data || data.error || !Array.isArray(data.suggestions)) return [];
    return data.suggestions;
  }

  function cacheAddressSuggestions(key, suggestions) {
    if (!key) return suggestions;
    if (addressSuggestionCache.size >= ADDRESS_SUGGEST_CACHE_LIMIT) {
      const firstKey = addressSuggestionCache.keys().next().value;
      if (firstKey) addressSuggestionCache.delete(firstKey);
    }
    addressSuggestionCache.set(key, suggestions);
    return suggestions;
  }

  async function fetchAddressSuggestions(query) {
    const cacheKey = normalizeAddress(query).replace(/臺/g, '台').toLocaleLowerCase();
    if (addressSuggestionCache.has(cacheKey)) return addressSuggestionCache.get(cacheKey);

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = setTimeout(() => controller?.abort(), ADDRESS_SUGGEST_TIMEOUT_MS);
    try {
      const explicitCounty = explicitTaiwanCountyFromQuery(query);
      const currentLocationBias = attachedLocation &&
        Number.isFinite(attachedLocation.longitude) &&
        Number.isFinite(attachedLocation.latitude) &&
        Number(attachedLocation.accuracy) <= LOCATION_REVIEW_ACCURACY_M
          ? `${attachedLocation.longitude},${attachedLocation.latitude}`
          : ADDRESS_BIAS_LOCATION;

      const seen = new Set();
      const merged = [];
      const addResults = (items, sourceRegion = '') => {
        items.forEach((raw, order) => {
          if (!raw?.text || isClearlyOutsideTaiwanSuggestion(raw.text)) return;
          const cleaned = canonicalizeSuggestedAddress(raw.text);
          if (!cleaned || !isTaiwanSuggestion(cleaned)) return;

          const county = canonicalTaiwanCounty(cleaned);
          if (explicitCounty && county !== explicitCounty) return;
          if (sourceRegion && county && county !== sourceRegion) return;

          const dedupeKey = cleaned.replace(/\s+/g, '').toLocaleLowerCase();
          if (seen.has(dedupeKey)) return;
          seen.add(dedupeKey);

          merged.push({
            text: cleaned,
            magicKey: raw.magicKey || '',
            sourceRegion,
            _order: order,
            _score: taiwanSuggestionScore(cleaned, query, sourceRegion)
          });
        });
      };

      // Fast path: one Taiwan-only request with a Taichung/current-location bias.
      // Most normal road/landmark searches finish here, keeping typing responsive.
      const primaryLocation = explicitCounty
        ? ADDRESS_PRIMARY_REGIONS.find(item => item.name === explicitCounty)?.location || currentLocationBias
        : currentLocationBias;
      addResults(await fetchArcgisSuggest(query, primaryLocation, controller), explicitCounty || '');

      // Only enrich when the first response did not already give enough safe,
      // district-labelled Central Taiwan choices. This keeps 中彰投 prominent
      // without making every keystroke fire four network requests.
      const centralDistrictCount = merged.filter(item => {
        const parts = splitTaiwanSuggestionAddress(item.text);
        return Boolean(parts.district && ADDRESS_PRIMARY_REGIONS.some(region => region.name === parts.county));
      }).length;

      if (!explicitCounty && centralDistrictCount < 4) {
        const enrichedSets = await Promise.all(ADDRESS_PRIMARY_REGIONS.map(async region => {
          try {
            const items = await fetchArcgisSuggest(`${region.name} ${query}`, region.location, controller);
            return { items, region: region.name };
          } catch (_) {
            return { items: [], region: region.name };
          }
        }));
        enrichedSets.forEach(result => addResults(result.items, result.region));
      }

      const suggestions = merged
        .sort((a, b) => (b._score - a._score) || (a._order - b._order))
        .slice(0, 6)
        .map(({ text, magicKey }) => ({ text, magicKey }));

      return cacheAddressSuggestions(cacheKey, suggestions);
    } catch (_) {
      return cacheAddressSuggestions(cacheKey, []);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function bindSmartAddressInputs() {
    ['pickup', 'destination'].forEach(id => {
      const input = document.getElementById(id);
      const box = document.getElementById(`${id}Suggest`);
      if (!input || !box || input.dataset.gcSmartAddressBound === '1') return;
      input.dataset.gcSmartAddressBound = '1';
      let timer = 0;
      let localToken = 0;

      input.addEventListener('input', () => {
        clearTimeout(timer);
        if (input.dataset.gcSkipSuggestOnce === '1') {
          delete input.dataset.gcSkipSuggestOnce;
          hideAddressSuggestions(id);
          return;
        }
        const query = normalizeAddress(input.value);
        if (query.length < 2 || query === LOCATION_MARKER) {
          hideAddressSuggestions(id);
          return;
        }
        const token = ++addressSuggestRequestToken;
        localToken = token;
        timer = setTimeout(async () => {
          const suggestions = await fetchAddressSuggestions(query);
          if (localToken !== token || normalizeAddress(input.value) !== query) return;
          if (!suggestions.length) { hideAddressSuggestions(id); return; }
          box.innerHTML = suggestions.map((item, index) => renderAddressSuggestion(item, index)).join('');
          box._gcSuggestions = suggestions;
          box.classList.remove('hidden');
        }, ADDRESS_SUGGEST_DEBOUNCE_MS);
      });

      input.addEventListener('blur', () => {
        setTimeout(() => {
          normalizeAddressInput(id);
          hideAddressSuggestions(id);
        }, 180);
      });

      box.addEventListener('mousedown', event => event.preventDefault());
      box.addEventListener('click', async event => {
        const button = event.target.closest('.gc-address-suggest-item');
        if (!button) return;
        const item = box._gcSuggestions?.[Number(button.dataset.index)];
        if (!item) return;
        const selected = smartNormalizeTaiwanAddress(cleanSuggestedAddress(item.text));
        if (!selected) return;
        input.value = selected;
        input.dataset.gcSkipSuggestOnce = '1';
        input.classList.remove('invalid');
        document.getElementById(`${id}Error`)?.classList.remove('show');
        hideAddressSuggestions(id);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }

  function loadRecentAddresses() {
    try {
      const parsed = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      const unique = [];
      for (const item of parsed) {
        const address = normalizeAddress(item);
        if (!address) continue;
        if (!unique.some(existing => existing.toLocaleLowerCase() === address.toLocaleLowerCase())) {
          unique.push(address);
        }
        if (unique.length >= RECENT_LIMIT) break;
      }
      return unique;
    } catch (_) {
      return [];
    }
  }

  function saveRecentAddresses(addresses) {
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(addresses.slice(0, RECENT_LIMIT)));
      return true;
    } catch (_) {
      return false;
    }
  }

  function rememberRecentAddresses(addresses) {
    const next = [];
    const candidates = [...addresses, ...loadRecentAddresses()];
    for (const item of candidates) {
      const address = normalizeAddress(item);
      if (!address) continue;
      if (!next.some(existing => existing.toLocaleLowerCase() === address.toLocaleLowerCase())) {
        next.push(address);
      }
      if (next.length >= RECENT_LIMIT) break;
    }
    saveRecentAddresses(next);
    refreshRecentAddressControls();
  }

  function deleteRecentAddress(index) {
    const addresses = loadRecentAddresses();
    if (index < 0 || index >= addresses.length) return;
    addresses.splice(index, 1);
    saveRecentAddresses(addresses);
    refreshRecentAddressControls();
  }

  function clearRecentAddresses() {
    try { localStorage.removeItem(RECENT_STORAGE_KEY); } catch (_) {}
    refreshRecentAddressControls();
  }


  function normalizeFavoriteTrip(item) {
    if (!item || typeof item !== 'object') return null;
    const pickup = normalizeAddress(item.pickup);
    const destination = normalizeAddress(item.destination);
    const name = String(item.name || '').trim().slice(0, 30);
    if (!pickup || !destination || pickup === LOCATION_MARKER) return null;
    return { name: name || '常用行程', pickup, destination };
  }

  function loadFavoriteTrips() {
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      const trips = [];
      for (const item of parsed) {
        const trip = normalizeFavoriteTrip(item);
        if (!trip) continue;
        // V8.5: 常用行程以「每筆命名」為獨立項目；即使上下車地址相同，也允許保存不同名稱。
        trips.push(trip);
        if (trips.length >= FAVORITE_LIMIT) break;
      }
      return trips;
    } catch (_) {
      return [];
    }
  }

  function saveFavoriteTrips(trips) {
    try {
      localStorage.setItem(FAVORITE_STORAGE_KEY, JSON.stringify(trips.slice(0, FAVORITE_LIMIT)));
      return true;
    } catch (_) {
      return false;
    }
  }

  function clearFavoriteTrips() {
    try { localStorage.removeItem(FAVORITE_STORAGE_KEY); } catch (_) {}
    refreshFavoriteTrips();
  }

  function renderFavoriteTripsBox() {
    return `
      <details class="optional-box favorite-box" id="favoriteTripsBox">
        <summary>${escapeHtml(COMMON['常用行程標題'] || '⭐ 常用行程')}</summary>
        <div class="favorite-content">
          <div class="favorite-list-viewport">
            <div class="favorite-list" id="favoriteTripsList"></div>
          </div>
          <div class="favorite-actions">
            <button class="favorite-clear" id="favoriteClearBtn" type="button">${escapeHtml(COMMON['最近地址清除全部'] || '清除全部')}</button>
            <button class="favorite-save-btn" id="favoriteSaveBtn" type="button">＋ ${escapeHtml(COMMON['常用行程儲存'] || '儲存目前行程')}</button>
          </div>
          <div class="favorite-status" id="favoriteStatus" aria-live="polite"></div>
        </div>
      </details>`;
  }

  function renderFavoriteSaveModal() {
    return `
      <div class="favorite-save-overlay hidden" id="favoriteSaveOverlay">
        <section class="favorite-save-card" role="dialog" aria-modal="true" aria-labelledby="favoriteSaveTitle">
          <div class="favorite-save-brand">
            <img src="${brandAvatarUrl}" alt="" aria-hidden="true">
            <strong>${escapeHtml(COMMON['品牌名稱'] || 'GC 台中白牌車隊 24H')}</strong>
          </div>
          <h2 id="favoriteSaveTitle">${escapeHtml(COMMON['常用行程儲存標題'] || '儲存常用行程')}</h2>
          <label for="favoriteNameInput">${escapeHtml(COMMON['常用行程名稱標題'] || '行程名稱')}</label>
          <input class="input" id="favoriteNameInput" type="text" maxlength="30" placeholder="${escapeHtml(COMMON['常用行程名稱提示'] || '例如：住家 → 公司')}">
          <div class="favorite-save-route" id="favoriteSaveRoute"></div>
          <div class="favorite-save-actions">
            <button class="favorite-save-cancel" id="favoriteSaveCancelBtn" type="button">取消</button>
            <button class="favorite-save-confirm" id="favoriteSaveConfirmBtn" type="button">確定儲存</button>
          </div>
        </section>
      </div>`;
  }

  function setFavoriteStatus(message, state = '') {
    const status = document.getElementById('favoriteStatus');
    if (!status) return;
    status.textContent = message || '';
    status.classList.toggle('is-error', state === 'error');
    status.classList.toggle('is-success', state === 'success');
  }

  function refreshFavoriteTrips() {
    const list = document.getElementById('favoriteTripsList');
    const saveButton = document.getElementById('favoriteSaveBtn');
    const clearButton = document.getElementById('favoriteClearBtn');
    if (!list || !saveButton) return;
    const trips = loadFavoriteTrips();
    if (!trips.length) {
      list.innerHTML = `<p class="favorite-empty">${escapeHtml(COMMON['常用行程空白'] || '尚未儲存常用行程。')}</p>`;
    } else {
      list.innerHTML = trips.map((trip, index) => `
        <div class="favorite-row">
          <button class="favorite-use" type="button" data-index="${index}">
            <strong>${escapeHtml(trip.name)}</strong>
            <span>${escapeHtml(trip.pickup)} → ${escapeHtml(trip.destination)}</span>
          </button>
          <button class="favorite-delete" type="button" data-index="${index}">${escapeHtml(COMMON['最近地址刪除'] || '刪除')}</button>
        </div>`).join('');
    }
    if (clearButton) {
      clearButton.disabled = trips.length === 0;
      clearButton.classList.toggle('is-empty', trips.length === 0);
    }
    const full = trips.length >= FAVORITE_LIMIT;
    saveButton.disabled = full;
    saveButton.textContent = full
      ? (COMMON['常用行程已滿按鈕'] || '已達 3 組上限')
      : `＋ ${COMMON['常用行程儲存'] || '儲存目前行程'}`;
  }

  function closeFavoriteSaveModal() {
    const overlay = document.getElementById('favoriteSaveOverlay');
    // iOS LIFF: close the keyboard/focus first, then restore the exact pre-modal viewport.
    const active = document.activeElement;
    if (active && typeof active.blur === 'function') active.blur();
    if (overlay) overlay.classList.add('hidden');
    const restoreY = modalScrollY;
    unlockViewport();
    const normalizeViewport = () => {
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
      window.scrollTo(0, restoreY);
    };
    requestAnimationFrame(normalizeViewport);
    setTimeout(normalizeViewport, 80);
    setTimeout(normalizeViewport, 320);
  }

  function openFavoriteSaveModal() {
    const pickup = value('pickup');
    const destination = value('destination');
    if (!pickup || !destination) {
      setFavoriteStatus(COMMON['常用行程需地址'] || '請先填寫完整上下車地址。', 'error');
      return;
    }
    if (pickup === LOCATION_MARKER) {
      setFavoriteStatus(COMMON['常用行程定位限制'] || '目前定位無法直接儲存，請改填完整地址。', 'error');
      return;
    }
    const trips = loadFavoriteTrips();
    if (trips.length >= FAVORITE_LIMIT) {
      setFavoriteStatus(COMMON['常用行程已滿'] || '最多可儲存 3 組，請先刪除一組。', 'error');
      return;
    }
    // V8.1: 儲存常用行程時強制關閉 Bottom Sheet，中央 Dialog 是唯一焦點。
    const favoriteSheet = document.getElementById('gcFavoriteSheet');
    if (favoriteSheet) {
      favoriteSheet.classList.add('hidden');
      favoriteSheet.hidden = true;
      favoriteSheet.setAttribute('aria-hidden', 'true');
      favoriteSheet.style.setProperty('display', 'none', 'important');
    }
    document.body.classList.remove('gc-sheet-open');
    document.getElementById('gcFavoriteToggle')?.setAttribute('aria-expanded', 'false');
    document.getElementById('gcFavoriteToggle')?.setAttribute('aria-expanded', 'false');

    const overlay = document.getElementById('favoriteSaveOverlay');
    const input = document.getElementById('favoriteNameInput');
    const route = document.getElementById('favoriteSaveRoute');
    if (!overlay || !input || !route) return;
    input.value = `常用行程 ${trips.length + 1}`;
    route.textContent = `${pickup} → ${destination}`;
    overlay.dataset.pickup = pickup;
    overlay.dataset.destination = destination;
    overlay.classList.remove('hidden');
    lockViewport();
    // V8.1: 不自動叫出鍵盤，Dialog 開啟時保持正中央；使用者點名稱欄才進入編輯。
  }

  function bindFavoriteSaveModal() {
    const overlay = document.getElementById('favoriteSaveOverlay');
    document.getElementById('favoriteSaveCancelBtn')?.addEventListener('click', closeFavoriteSaveModal);
    overlay?.addEventListener('click', event => {
      if (event.target === overlay) closeFavoriteSaveModal();
    });
    document.getElementById('favoriteSaveConfirmBtn')?.addEventListener('click', () => {
      if (!overlay) return;
      const pickup = normalizeAddress(overlay.dataset.pickup);
      const destination = normalizeAddress(overlay.dataset.destination);
      const input = document.getElementById('favoriteNameInput');
      const name = String(input?.value || '').trim() || `常用行程 ${loadFavoriteTrips().length + 1}`;
      if (!pickup || !destination) return;
      const trips = loadFavoriteTrips();
      // V8.5: 新增即新增，不再因相同路線覆蓋舊的常用行程。
      trips.unshift({ name: name.slice(0, 30), pickup, destination });
      saveFavoriteTrips(trips);
      closeFavoriteSaveModal();
      refreshFavoriteTrips();
      setFavoriteStatus(COMMON['常用行程儲存成功'] || '常用行程已儲存。', 'success');
    });
  }

  function bindFavoriteTrips() {
    const box = document.getElementById('favoriteTripsBox');
    if (!box) return;
    box.addEventListener('click', event => {
      const useButton = event.target.closest('.favorite-use');
      if (useButton) {
        const trip = loadFavoriteTrips()[Number(useButton.dataset.index)];
        if (!trip) return;
        clearAttachedLocation(false);
        const pickupInput = document.getElementById('pickup');
        const destinationInput = document.getElementById('destination');
        if (attachedLocation) clearAttachedLocation(false);
        if (pickupInput) pickupInput.value = trip.pickup;
        if (destinationInput) destinationInput.value = trip.destination;
        ['pickup', 'destination'].forEach(id => {
          document.getElementById(id)?.classList.remove('invalid');
          document.getElementById(`${id}Error`)?.classList.remove('show');
        });
        pickupInput?.dispatchEvent(new Event('input', { bubbles: true }));
        destinationInput?.dispatchEvent(new Event('input', { bubbles: true }));
        box.open = false;
        setFavoriteStatus('', '');
        return;
      }
      const deleteButton = event.target.closest('.favorite-delete');
      if (deleteButton) {
        const trips = loadFavoriteTrips();
        trips.splice(Number(deleteButton.dataset.index), 1);
        saveFavoriteTrips(trips);
        refreshFavoriteTrips();
        setFavoriteStatus('', '');
        return;
      }
      if (event.target.closest('#favoriteClearBtn')) {
        // V8.7: 清除常用行程前先完整收起 Bottom Sheet，確認視窗成為唯一焦點。
        const sheet = document.getElementById('gcFavoriteSheet');
        if (sheet) {
          sheet.classList.add('hidden');
          sheet.hidden = true;
          sheet.setAttribute('aria-hidden', 'true');
          sheet.style.setProperty('display', 'none', 'important');
        }
        document.body.classList.remove('gc-sheet-open');
        document.getElementById('gcFavoriteToggle')?.setAttribute('aria-expanded', 'false');
        openRecentClearModal(clearFavoriteTrips, COMMON['常用行程清除確認'] || '確定要清除全部常用行程嗎？');
        return;
      }
      if (event.target.closest('#favoriteSaveBtn')) openFavoriteSaveModal();
    });
    refreshFavoriteTrips();
  }

  function clearAttachedLocation(clearMarker = false) {
    locationRequestToken += 1;
    const pickupInput = document.getElementById('pickup');
    const generatedAddress = attachedLocation?.address || '';
    if (clearMarker && pickupInput && (pickupInput.value === LOCATION_MARKER || (generatedAddress && pickupInput.value === generatedAddress))) {
      pickupInput.value = '';
    }
    attachedLocation = null;
    const review = document.getElementById('locationReview');
    if (review) review.classList.add('hidden');
    const status = document.getElementById('locationStatus');
    if (status) {
      status.textContent = '';
      status.className = 'location-status';
    }
    const button = document.getElementById('locationBtn');
    if (button) {
      button.disabled = false;
      button.textContent = COMMON['定位按鈕'] || '📍 使用目前位置';
    }
  }

  function setLocationStatus(message, state = '') {
    const status = document.getElementById('locationStatus');
    if (!status) return;
    status.textContent = message || '';
    status.className = `location-status${state ? ` is-${state}` : ''}`;
  }

  function updateLocationVisibility() {
    const action = document.getElementById('locationAction');
    if (!action) return;
    const instant = checked('serviceType') === 'instant';
    action.classList.toggle('hidden', !instant);
    if (!instant) clearAttachedLocation(true);
  }

  function compactReverseAddressPart(value) {
    return String(value || '').trim().replace(/\s+/g, ' ');
  }

  function sameAddressPart(a, b) {
    const normalize = value => compactReverseAddressPart(value).replace(/臺/g, '台').replace(/\s/g, '');
    return normalize(a) && normalize(a) === normalize(b);
  }

  function formatReverseGeocodedAddress(rawAddress) {
    if (!rawAddress || typeof rawAddress !== 'object') return '';
    const type = compactReverseAddressPart(rawAddress.Addr_type);
    const street = compactReverseAddressPart(rawAddress.Address || rawAddress.ShortLabel);
    const addNum = compactReverseAddressPart(rawAddress.AddNum);
    const hasHouseNumber = Boolean(addNum || /\d/.test(street));
    const exactEnough = type === 'PointAddress' || type === 'Subaddress' || (type === 'StreetAddress' && hasHouseNumber);
    if (!exactEnough || !street) return '';

    const region = compactReverseAddressPart(rawAddress.Region);
    const city = compactReverseAddressPart(rawAddress.City);
    const district = compactReverseAddressPart(rawAddress.District);
    const subregion = compactReverseAddressPart(rawAddress.Subregion);

    let topAdmin = '';
    if (/[市縣]$/.test(region) && !/台灣省|臺灣省/.test(region)) topAdmin = region;
    if (!topAdmin && /[市縣]$/.test(city)) topAdmin = city;
    if (!topAdmin && /[市縣]$/.test(subregion)) topAdmin = subregion;

    let localAdmin = '';
    for (const candidate of [district, city, subregion]) {
      if (!candidate || sameAddressPart(candidate, topAdmin)) continue;
      if (/[區鄉鎮市]$/.test(candidate)) {
        localAdmin = candidate;
        break;
      }
    }

    const parts = [topAdmin, localAdmin, street].filter(Boolean);
    const unique = parts.filter((part, index, list) => !list.slice(0, index).some(prev => sameAddressPart(prev, part)));
    if (unique.length >= 2) return cleanLocatedTaiwanAddress(unique.join(' '));

    return cleanLocatedTaiwanAddress(compactReverseAddressPart(rawAddress.Match_addr || rawAddress.LongLabel).replace(/,\s*/g, ' '));
  }

  function getBestCurrentPosition() {
    return new Promise((resolve, reject) => {
      let best = null;
      let finished = false;
      let watchId = null;
      const finish = (position, error) => {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        if (watchId !== null) {
          try { navigator.geolocation.clearWatch(watchId); } catch (_) {}
        }
        if (position) resolve(position);
        else reject(error || new Error('無法取得目前位置'));
      };
      const timer = setTimeout(() => finish(best), LOCATION_SAMPLE_WINDOW_MS);
      const onPosition = position => {
        const accuracy = Number(position?.coords?.accuracy);
        if (!Number.isFinite(Number(position?.coords?.latitude)) || !Number.isFinite(Number(position?.coords?.longitude))) return;
        if (!best || (Number.isFinite(accuracy) && accuracy < Number(best.coords.accuracy || Infinity))) best = position;
        if (Number.isFinite(accuracy) && accuracy <= LOCATION_AUTO_ACCEPT_ACCURACY_M) finish(position);
      };
      const onError = error => {
        if (best) finish(best);
        else if (error?.code === 1) finish(null, error);
      };
      try {
        watchId = navigator.geolocation.watchPosition(onPosition, onError, {
          enableHighAccuracy: true, timeout: 8000, maximumAge: 0
        });
      } catch (error) {
        try {
          navigator.geolocation.getCurrentPosition(onPosition, onError, { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 });
        } catch (fallbackError) {
          finish(null, fallbackError || error);
        }
      }
    });
  }

  function setLocationReview(message = '', visible = false) {
    const review = document.getElementById('locationReview');
    const text = document.getElementById('locationReviewText');
    if (text) text.textContent = message;
    if (review) review.classList.toggle('hidden', !visible);
  }

  async function reverseGeocodeCurrentLocation(latitude, longitude) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = setTimeout(() => controller?.abort(), LOCATION_REVERSE_GEOCODE_TIMEOUT_MS);
    try {
      const params = new URLSearchParams({
        f: 'json',
        location: `${longitude},${latitude}`,
        langCode: 'zh-TW',
        featureTypes: 'PointAddress,StreetAddress',
        locationType: 'street',
        forStorage: 'false',
        outFields: 'Match_addr,LongLabel,ShortLabel,Addr_type,AddNum,Address,District,City,Subregion,Region,Postal,CountryCode'
      });
      const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/reverseGeocode?${params.toString()}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        signal: controller?.signal
      });
      if (!response.ok) return '';
      const data = await response.json();
      if (!data || data.error) return '';
      return formatReverseGeocodedAddress(data.address);
    } catch (_) {
      return '';
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function addressAreaSkeleton(value) {
    return normalizeAddress(value)
      .replace(/臺/g, '台')
      .replace(/[0-9０-９號之\-\s]/g, '')
      .replace(/^\d{3,5}/, '');
  }

  function manualAddressLikelyMatchesGenerated(manual, generated) {
    const a = addressAreaSkeleton(manual);
    const b = addressAreaSkeleton(generated);
    if (!a || !b || Math.min(a.length, b.length) < 3) return false;
    return a.includes(b) || b.includes(a);
  }

  function bindCurrentLocation(mode) {
    const button = document.getElementById('locationBtn');
    const pickupInput = document.getElementById('pickup');
    const confirmButton = document.getElementById('locationConfirmBtn');
    if (!button || !pickupInput) return;

    pickupInput.addEventListener('input', () => {
      if (!attachedLocation || attachedLocation.settingInput) return;
      const current = normalizeAddress(pickupInput.value);
      if (!current || current === LOCATION_MARKER) {
        attachedLocation.confirmed = false;
        return;
      }
      const generatedAddress = normalizeAddress(attachedLocation.generatedAddress || '');
      if (!generatedAddress || current !== generatedAddress) {
        attachedLocation.address = smartNormalizeTaiwanAddress(current);
        attachedLocation.manualAddress = attachedLocation.address;
        attachedLocation.confirmed = true;
        attachedLocation.requiresConfirmation = false;
        const keepMap = generatedAddress && manualAddressLikelyMatchesGenerated(current, generatedAddress) && attachedLocation.accuracy <= LOCATION_REVIEW_ACCURACY_M;
        attachedLocation.sendMap = Boolean(keepMap);
        setLocationReview('', false);
        setLocationStatus(keepMap
          ? '已修正文字地址，定位仍會一併附上。'
          : '已改用你輸入的文字上車地址，避免舊定位與地址不一致。', 'success');
      }
    });

    confirmButton?.addEventListener('click', () => {
      if (!attachedLocation || !normalizeAddress(pickupInput.value)) return;
      attachedLocation.confirmed = true;
      attachedLocation.requiresConfirmation = false;
      attachedLocation.address = smartNormalizeTaiwanAddress(pickupInput.value);
      setLocationReview('', false);
      setLocationStatus('地址已確認，定位會一併附上。', 'success');
    });

    button.addEventListener('click', async () => {
      if (!navigator.geolocation) {
        setLocationStatus(COMMON['定位不支援'] || '此裝置不支援定位，請直接輸入地址。', 'error');
        return;
      }
      const requestToken = ++locationRequestToken;
      const previousPickup = smartNormalizeTaiwanAddress(pickupInput.value);
      button.disabled = true;
      button.textContent = COMMON['定位取得中'] || '正在取得定位…';
      setLocationReview('', false);
      setLocationStatus('正在取得較精準的位置，通常只需要幾秒…');

      try {
        const position = await getBestCurrentPosition();
        if (requestToken !== locationRequestToken || checked('serviceType') !== 'instant') return;
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);
        const accuracy = Number(position.coords.accuracy);
        const finiteAccuracy = Number.isFinite(accuracy) ? accuracy : null;
        const canSendMap = finiteAccuracy !== null && finiteAccuracy <= LOCATION_REVIEW_ACCURACY_M;

        attachedLocation = {
          latitude,
          longitude,
          accuracy: finiteAccuracy,
          address: '',
          generatedAddress: '',
          manualAddress: '',
          confirmed: false,
          requiresConfirmation: false,
          sendMap: canSendMap,
          settingInput: false,
          title: mode === 'driver' ? '代駕車輛目前位置' : '即時叫車上車位置'
        };
        button.disabled = false;
        button.textContent = COMMON['定位重新取得'] || '📍 重新取得位置';

        if (!canSendMap) {
          attachedLocation.settingInput = true;
          pickupInput.value = previousPickup || '';
          attachedLocation.settingInput = false;
          if (previousPickup) {
            attachedLocation.address = previousPickup;
            attachedLocation.manualAddress = previousPickup;
            attachedLocation.confirmed = true;
          }
          setLocationStatus(previousPickup
            ? `定位訊號較弱${finiteAccuracy ? `（約 ±${Math.round(finiteAccuracy)}m）` : ''}，已保留原本輸入的地址；為避免跑錯地點，本次不附上不精準定位。`
            : `定位訊號較弱${finiteAccuracy ? `（約 ±${Math.round(finiteAccuracy)}m）` : ''}，請再按一次重新取得；若仍無法辨識，再手動輸入上車地址。`, 'error');
          return;
        }

        setLocationStatus('定位已取得，正在辨識文字地址…', 'success');
        const address = await reverseGeocodeCurrentLocation(latitude, longitude);
        if (requestToken !== locationRequestToken || checked('serviceType') !== 'instant') return;
        if (!attachedLocation || attachedLocation.latitude !== latitude || attachedLocation.longitude !== longitude) return;

        if (!address) {
          attachedLocation.settingInput = true;
          pickupInput.value = previousPickup || '';
          attachedLocation.settingInput = false;
          if (previousPickup) {
            attachedLocation.address = previousPickup;
            attachedLocation.manualAddress = previousPickup;
            attachedLocation.confirmed = true;
            attachedLocation.sendMap = false;
            setLocationStatus('定位已取得但無法確認門牌，已保留你原本輸入的地址；為避免地址與定位不一致，本次不附上定位。', 'success');
          } else {
            setLocationStatus('已取得定位，但無法確認正確門牌。請再按一次重新取得，或手動輸入實際上車地址。', 'error');
          }
          return;
        }

        attachedLocation.address = address;
        attachedLocation.generatedAddress = address;
        attachedLocation.settingInput = true;
        pickupInput.value = address;
        pickupInput.classList.remove('invalid');
        document.getElementById('pickupError')?.classList.remove('show');
        pickupInput.dispatchEvent(new Event('change', { bubbles: true }));
        attachedLocation.settingInput = false;

        // V9.5.3 safety: GPS-generated text is always shown to the rider for one-tap confirmation.
        // This keeps current-location convenient while preventing a plausible-but-wrong door number
        // from becoming the dispatch address without the rider seeing it first.
        attachedLocation.requiresConfirmation = true;
        if (finiteAccuracy <= LOCATION_AUTO_ACCEPT_ACCURACY_M) {
          setLocationStatus('已取得定位與文字地址，請確認門牌是否正確。', 'success');
        } else {
          setLocationStatus(`已辨識到附近地址（定位約 ±${Math.round(finiteAccuracy)}m）。`, 'success');
        }
        setLocationReview('正確只要按一下「✓ 地址正確」；不對可直接修改上車地址。', true);
      } catch (error) {
        if (requestToken !== locationRequestToken) return;
        attachedLocation = null;
        const denied = error?.code === 1;
        setLocationReview('', false);
        setLocationStatus(denied
          ? (COMMON['定位拒絕'] || '定位權限未開啟，請改輸入完整地址。')
          : (COMMON['定位失敗'] || '無法取得目前位置，請改輸入完整地址。'), 'error');
        button.disabled = false;
        button.textContent = COMMON['定位按鈕'] || '📍 使用目前位置';
      }
    });
    updateLocationVisibility();
  }

  function submissionSignature(payload) {
    return JSON.stringify(payload);
  }

  function loadRecentSubmissions() {
    try {
      const parsed = JSON.parse(localStorage.getItem(LAST_SUBMISSION_STORAGE_KEY) || '[]');
      const list = Array.isArray(parsed) ? parsed : (parsed ? [parsed] : []);
      const now = Date.now();
      return list.filter(item => item && item.signature && now - Number(item.timestamp || 0) < DUPLICATE_WINDOW_MS);
    } catch (_) {
      return [];
    }
  }

  function isDuplicateSubmission(signature) {
    return loadRecentSubmissions().some(item => item.signature === signature);
  }

  function markSubmission(signature) {
    try {
      const recent = loadRecentSubmissions().filter(item => item.signature !== signature);
      recent.unshift({ signature, timestamp: Date.now() });
      localStorage.setItem(LAST_SUBMISSION_STORAGE_KEY, JSON.stringify(recent.slice(0, 10)));
    } catch (_) {}
  }

  function duplicateMessage() {
    return COMMON['重複送出提醒'] || '相同資料剛剛已送出，請稍候小編回覆。';
  }

  function blurActiveEditor() {
    const active = document.activeElement;
    if (!active) return;
    const tag = active.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      try { active.blur(); } catch (_) {}
    }
  }

  function keepViewportStable(anchor, mutate, preservedTop = null) {
    const measuredTop = anchor?.getBoundingClientRect().top;
    const startTop = Number.isFinite(preservedTop) ? preservedTop : measuredTop;
    blurActiveEditor();
    mutate();
    if (!anchor || !Number.isFinite(startTop)) return;

    const restore = () => {
      const currentTop = anchor.getBoundingClientRect().top;
      const delta = currentTop - startTop;
      if (Math.abs(delta) > 1) {
        window.scrollBy({ top: delta, left: 0, behavior: 'auto' });
      }
    };

    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(restore);
    });
    setTimeout(restore, 120);
    setTimeout(restore, 280);
  }

  function refreshRecentAddressControls() {
    const addresses = loadRecentAddresses();
    document.querySelectorAll('.recent-address-control').forEach(control => {
      const panel = control.querySelector('.recent-panel');
      const count = control.querySelector('.recent-count');
      if (!addresses.length) {
        control.classList.add('hidden');
        if (panel) panel.classList.add('hidden');
        return;
      }

      control.classList.remove('hidden');
      if (count) count.textContent = `（${addresses.length}）`;
      if (!panel) return;
      panel.innerHTML = `
        <div class="recent-helper">點選地址即可自動帶入</div>
        <div class="recent-list">
          ${addresses.map((address, index) => `
            <div class="recent-row">
              <button class="recent-use" type="button" data-index="${index}" title="${escapeHtml(address)}">
                <span>${escapeHtml(address)}</span>
              </button>
              <button class="recent-delete" type="button" data-index="${index}">${escapeHtml(COMMON['最近地址刪除'] || '刪除')}</button>
            </div>`).join('')}
        </div>
        <button class="recent-clear" type="button">${escapeHtml(COMMON['最近地址清除全部'] || '清除全部')}</button>`;
    });
  }

  function waitForKeyboardToSettle(callback) {
    const viewport = window.visualViewport;
    if (!viewport) {
      setTimeout(callback, 320);
      return;
    }

    const startedAt = performance.now();
    let lastHeight = viewport.height;
    let stableSince = startedAt;
    let completed = false;

    const finish = () => {
      if (completed) return;
      completed = true;
      callback();
    };

    const check = () => {
      if (completed) return;
      const now = performance.now();
      const currentHeight = viewport.height;
      if (Math.abs(currentHeight - lastHeight) > 1) {
        lastHeight = currentHeight;
        stableSince = now;
      }

      if ((now - stableSince >= 110 && now - startedAt >= 220) || now - startedAt >= 520) {
        finish();
        return;
      }
      requestAnimationFrame(check);
    };

    requestAnimationFrame(check);
  }

  function bindRecentAddressControls() {
    document.querySelectorAll('.recent-address-control').forEach(control => {
      const targetId = control.dataset.target;
      const toggle = control.querySelector('.recent-toggle');
      const trigger = control.querySelector('.recent-chevron');
      const panel = control.querySelector('.recent-panel');

      let lastTouchToggleAt = 0;
      let touchOpening = false;

      const togglePanel = () => {
        const willOpen = panel.classList.contains('hidden');
        document.querySelectorAll('.recent-panel').forEach(other => other.classList.add('hidden'));
        document.querySelectorAll('.recent-toggle').forEach(other => other.setAttribute('aria-expanded', 'false'));
        panel.classList.toggle('hidden', !willOpen);
        toggle.setAttribute('aria-expanded', String(willOpen));
      };

      trigger?.addEventListener('touchstart', event => {
        event.preventDefault();
      }, { passive: false });

      trigger?.addEventListener('touchend', event => {
        event.preventDefault();
        event.stopPropagation();
        if (touchOpening) return;

        lastTouchToggleAt = Date.now();
        const keyboardWasOpen = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '');
        if (!keyboardWasOpen) {
          togglePanel();
          return;
        }

        touchOpening = true;
        blurActiveEditor();
        waitForKeyboardToSettle(() => {
          togglePanel();
          touchOpening = false;
        });
      }, { passive: false });

      trigger?.addEventListener('click', event => {
        if (Date.now() - lastTouchToggleAt < 700) {
          event.preventDefault();
          return;
        }
        blurActiveEditor();
        togglePanel();
      });

      control.addEventListener('click', event => {
        const useButton = event.target.closest('.recent-use');
        if (useButton) {
          const address = loadRecentAddresses()[Number(useButton.dataset.index)];
          const input = document.getElementById(targetId);
          if (address && input) {
            if (targetId === 'pickup' && attachedLocation) clearAttachedLocation(false);
            input.value = address;
            input.classList.remove('invalid');
            const error = document.getElementById(`${targetId}Error`);
            if (error) error.classList.remove('show');
            panel.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          }
          return;
        }

        const deleteButton = event.target.closest('.recent-delete');
        if (deleteButton) {
          deleteRecentAddress(Number(deleteButton.dataset.index));
          return;
        }

        if (event.target.closest('.recent-clear')) {
          openRecentClearModal(clearRecentAddresses);
        }
      });
    });
    refreshRecentAddressControls();
  }

  function renderConfirmationModal() {
    return `
      <div class="confirm-overlay hidden" id="confirmOverlay">
        <section class="confirm-card" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
          <h2 id="confirmTitle"></h2>
          <p class="confirm-intro">${escapeHtml(COMMON['確認提醒'] || '請確認上、下車地點與資料是否正確。')}</p>
          <div class="confirm-summary" id="confirmSummary"></div>
          <div class="confirm-actions">
            <button class="confirm-back" id="confirmBackBtn" type="button">${escapeHtml(COMMON['確認返回按鈕'] || '返回修改')}</button>
            <button class="confirm-send" id="confirmSendBtn" type="button">${escapeHtml(COMMON['確認送出按鈕'] || '確認送出')}</button>
          </div>
        </section>
      </div>`;
  }


  function renderRecentClearModal() {
    return `
      <div class="recent-clear-overlay hidden" id="recentClearOverlay">
        <section class="recent-clear-card" role="dialog" aria-modal="true" aria-labelledby="recentClearBrand" aria-describedby="recentClearMessage">
          <div class="recent-clear-brand">
            <img src="${brandAvatarUrl}" alt="" aria-hidden="true">
            <strong id="recentClearBrand">${escapeHtml(COMMON['品牌名稱'] || 'GC 台中白牌車隊 24H')}</strong>
          </div>
          <p id="recentClearMessage">${escapeHtml(COMMON['最近地址清除確認'] || '確定要清除全部最近使用地址嗎？')}</p>
          <div class="recent-clear-actions">
            <button class="recent-clear-cancel" id="recentClearCancelBtn" type="button">取消</button>
            <button class="recent-clear-confirm" id="recentClearConfirmBtn" type="button">確定清除</button>
          </div>
        </section>
      </div>`;
  }

  function closeRecentClearModal() {
    const overlay = document.getElementById('recentClearOverlay');
    if (overlay) overlay.classList.add('hidden');
    unlockViewport();
    pendingRecentClearAction = null;
  }

  function openRecentClearModal(action, message = '') {
    const overlay = document.getElementById('recentClearOverlay');
    if (!overlay) return;
    pendingRecentClearAction = action;
    const messageElement = document.getElementById('recentClearMessage');
    if (messageElement) messageElement.textContent = message || (COMMON['最近地址清除確認'] || '確定要清除全部最近使用地址嗎？');
    overlay.classList.remove('hidden');
    lockViewport();
    document.getElementById('recentClearCancelBtn')?.focus({ preventScroll: true });
  }

  function bindRecentClearModal() {
    const overlay = document.getElementById('recentClearOverlay');
    document.getElementById('recentClearCancelBtn')?.addEventListener('click', closeRecentClearModal);
    document.getElementById('recentClearConfirmBtn')?.addEventListener('click', () => {
      const action = pendingRecentClearAction;
      closeRecentClearModal();
      if (typeof action === 'function') action();
    });
    overlay?.addEventListener('click', event => {
      if (event.target === overlay) closeRecentClearModal();
    });
  }

  function closeConfirmation() {
    const overlay = document.getElementById('confirmOverlay');
    if (overlay) overlay.classList.add('hidden');
    unlockViewport();
    pendingConfirmAction = null;
    confirmationBusy = false;
  }

  function openConfirmation(title, rows, action) {
    const overlay = document.getElementById('confirmOverlay');
    const titleElement = document.getElementById('confirmTitle');
    const summary = document.getElementById('confirmSummary');
    if (!overlay || !titleElement || !summary) {
      const fallbackText = rows
        .filter(row => row && row.value !== undefined && row.value !== null && String(row.value).trim() !== '')
        .map(row => `${row.label}：${row.value}`)
        .join('\n');
      if (window.confirm(`${title}\n\n${fallbackText}\n\n確定送出嗎？`)) {
        Promise.resolve(action()).catch(error => showGlobalError(error?.message || COMMON['傳送失敗文字']));
      }
      return;
    }
    titleElement.textContent = title;
    summary.innerHTML = rows
      .filter(row => row && row.value !== undefined && row.value !== null && String(row.value).trim() !== '')
      .map(row => `
        <div class="confirm-row${row.emphasis ? ' confirm-row-emphasis' : ''}">
          <span>${escapeHtml(row.label)}</span>
          <strong>${escapeHtml(row.value)}</strong>
        </div>`).join('');

    pendingConfirmAction = action;
    confirmationBusy = false;
    overlay.classList.remove('hidden');
    lockViewport();
    document.querySelector('.confirm-card')?.scrollTo(0, 0);
    document.getElementById('confirmSendBtn')?.focus({ preventScroll: true });
  }

  function bindConfirmationModal() {
    document.getElementById('confirmBackBtn')?.addEventListener('click', closeConfirmation);
    document.getElementById('confirmSendBtn')?.addEventListener('click', async () => {
      if (confirmationBusy || !pendingConfirmAction) return;
      confirmationBusy = true;
      const sendButton = document.getElementById('confirmSendBtn');
      const backButton = document.getElementById('confirmBackBtn');
      if (sendButton) {
        sendButton.disabled = true;
        sendButton.textContent = COMMON['傳送中文字'] || '傳送中…';
      }
      if (backButton) backButton.disabled = true;

      try {
        await pendingConfirmAction();
      } catch (error) {
        closeConfirmation();
        showGlobalError(error?.message || COMMON['傳送失敗文字']);
      } finally {
        const currentSendButton = document.getElementById('confirmSendBtn');
        const currentBackButton = document.getElementById('confirmBackBtn');
        if (currentSendButton) {
          currentSendButton.disabled = false;
          currentSendButton.textContent = COMMON['確認送出按鈕'] || '確認送出';
        }
        if (currentBackButton) currentBackButton.disabled = false;
        confirmationBusy = false;
      }
    });
  }

  function renderRideLike(mode, cfg) {
    attachedLocation = null;
    const isDriver = mode === 'driver';
    const extraFields = isDriver
      ? `${fieldText('vehicle', cfg['車輛資訊標題'], cfg['車輛資訊提示'])}
         ${fieldText('parking', cfg['停車位置標題'], cfg['停車位置提示'])}
         ${fieldTextarea('notes', cfg['備註標題'], cfg['備註提示'])}`
      : `${fieldText('baggage', cfg['行李標題'], cfg['行李提示'])}
         ${fieldText('requirements', cfg['需求標題'], cfg['需求提示'])}
         ${fieldTextarea('notes', cfg['備註標題'], cfg['備註提示'])}`;

    document.title = cfg['頁面標題'];
    app.innerHTML = `
      ${renderBrand()}
      <section class="form-card">
        <div class="form-head">
          <h1>${escapeHtml(cfg['頁面標題'])}</h1>
          <p>${escapeHtml(cfg['頁面說明'])}</p>
        </div>
        <form class="form-body" id="serviceForm" novalidate>
          ${preview ? `<div class="notice preview-notice"><p>${escapeHtml(COMMON['預覽模式提醒'])}</p></div>` : ''}
          <div id="globalError" class="global-error"></div>
          ${modeChoices(cfg)}
          ${scheduleFields(cfg)}
          ${fieldAddress('pickup', cfg['上車標題'], cfg['上車提示'], true, true)}
          ${fieldAddress('destination', cfg['下車標題'], cfg['下車提示'])}
          ${renderFavoriteTripsBox()}
          ${isDriver ? '' : fieldText('passengers', cfg['人數標題'], cfg['人數提示'])}
          <details class="optional-box">
            <summary>${escapeHtml(cfg['更多資訊標題'])}</summary>
            <div class="optional-content">${extraFields}</div>
          </details>
          ${renderReminderNotice(cfg)}
          <button class="submit-btn" id="submitBtn" type="submit">${escapeHtml(cfg['送出按鈕'])}</button>
        </form>
        ${renderConfirmationModal()}
        ${renderRecentClearModal()}
        ${renderFavoriteSaveModal()}
      </section>`;

    bindRideLike(mode, cfg);
  }

  function fareNumber(cfg, key, fallback) {
    const parsed = Number(String(cfg[key] ?? '').replace(/,/g, '').trim());
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  function fareRules(cfg) {
    return {
      start: fareNumber(cfg, '計價_起跳', 70),
      perMinute: fareNumber(cfg, '計價_每分鐘', 3),
      perKm: fareNumber(cfg, '計價_每公里', 15),
      extraFromKm: fareNumber(cfg, '計價_加成起始公里', 21),
      extraPerKm: fareNumber(cfg, '計價_加成每公里', 10),
      minimum: fareNumber(cfg, '計價_最低消費', 100),
      range: fareNumber(cfg, '計價_預估浮動', 30),
      longDistanceKm: fareNumber(cfg, '計價_長途門檻', 45)
    };
  }

  function calculateFareEstimate(distanceKm, durationMinutes, cfg) {
    const km = Number(distanceKm);
    const minutes = Number(durationMinutes);
    if (!Number.isFinite(km) || !Number.isFinite(minutes) || km <= 0 || minutes <= 0) return null;
    if (km > 999 || minutes > 1440) return { invalid: true };

    const rules = fareRules(cfg);
    const extraDistance = Math.max(km - (rules.extraFromKm - 1), 0);
    const raw = rules.start + (km * rules.perKm) + (extraDistance * rules.extraPerKm) + (minutes * rules.perMinute);
    // GC actual collection rule: discard the ones digit (e.g. 149→140), then apply the NT$100 minimum.
    const settledRaw = Math.floor(raw / 10) * 10;
    const baseline = Math.max(rules.minimum, settledRaw);
    const minimumApplied = settledRaw <= rules.minimum;
    const lower = Math.max(rules.minimum, baseline - rules.range);
    const upper = baseline + rules.range;

    return {
      invalid: false,
      km,
      minutes,
      baseline,
      minimumApplied,
      lower,
      upper,
      longDistance: km >= rules.longDistanceKm,
      rules
    };
  }

  function formatFareMoney(value) {
    return Math.round(Number(value) || 0).toLocaleString('en-US');
  }

  function formatFareRuleValue(value) {
    const number = Number(value) || 0;
    return Number.isInteger(number) ? String(number) : String(Math.round(number * 100) / 100);
  }

  function fareTextTemplate(text, values = {}) {
    return String(text || '').replace(/\{([^}]+)\}/g, (_, key) => Object.prototype.hasOwnProperty.call(values, key) ? String(values[key]) : `{${key}}`);
  }

  function renderFareCalculator(cfg) {
    return `
      <section class="gc-fare-calc" aria-labelledby="fareCalcTitle">
        <div class="gc-fare-calc-topline">
          <div class="gc-fare-calc-title" id="fareCalcTitle">${escapeHtml(cfg['計算器標題'] || '🚕 10秒快速試算')}</div>
          <span class="gc-fare-fast-badge">${escapeHtml(cfg['計算器徽章'] || '立即試算')}</span>
        </div>
        <div class="gc-fare-calc-help">${escapeHtml(cfg['計算器說明'] || '照 Google 地圖顯示順序：先填分鐘，再填公里')}</div>
        <div class="gc-fare-calc-grid">
          <label class="gc-fare-calc-field" for="fareMinutes">
            <span><em class="gc-fare-input-order">先填</em>${escapeHtml(cfg['時間標題'] || '預估時間')}</span>
            <div class="gc-fare-calc-input-wrap">
              <input id="fareMinutes" class="gc-fare-calc-input" type="number" min="1" max="1440" step="1" inputmode="numeric" placeholder="${escapeHtml(cfg['時間提示'] || '例如 21')}" autocomplete="off">
              <b>分鐘</b>
            </div>
          </label>
          <label class="gc-fare-calc-field" for="fareKm">
            <span><em class="gc-fare-input-order is-second">再填</em>${escapeHtml(cfg['公里標題'] || '公里數')}</span>
            <div class="gc-fare-calc-input-wrap">
              <input id="fareKm" class="gc-fare-calc-input" type="number" min="0.1" max="999" step="0.1" inputmode="decimal" placeholder="${escapeHtml(cfg['公里提示'] || '例如 7.9')}" autocomplete="off">
              <b>公里</b>
            </div>
          </label>
        </div>
        <div class="gc-fare-calc-result is-waiting" id="fareCalcResult" aria-live="polite">
          <span class="gc-fare-result-label" id="fareResultLabel">${escapeHtml(cfg['計算器等待'] || '先填分鐘，再填公里，立即顯示預估車資')}</span>
          <strong class="gc-fare-result-price" id="fareResultPrice"></strong>
          <p class="gc-fare-result-basis" id="fareResultBasis"></p>
          <p class="gc-fare-result-note" id="fareResultNote1"></p>
          <p class="gc-fare-result-note" id="fareResultNote2"></p>
          <p class="gc-fare-long-distance hidden" id="fareLongDistance">${escapeHtml(cfg['長途提示'] || '🚕 45公里以上另有直收優惠價')}</p>
        </div>
      </section>`;
  }

  function renderFareRateSummary(cfg) {
    const rules = fareRules(cfg);
    const allDay = cfg['費率_全天同價文案'] || '24H同一費率｜無夜間加成';
    const allDayShort = allDay.split('｜')[0] || allDay;
    const rateLines = [
      `起跳 $${formatFareRuleValue(rules.start)}`,
      `每分鐘 $${formatFareRuleValue(rules.perMinute)}`,
      `每公里 $${formatFareRuleValue(rules.perKm)}`,
      `第${formatFareRuleValue(rules.extraFromKm)}公里起 每公里+$${formatFareRuleValue(rules.extraPerKm)}`,
      `最低消費 $${formatFareRuleValue(rules.minimum)}`,
      allDay
    ];
    const longText = fareTextTemplate(cfg['長途提示格式'] || '🚕 {公里}公里以上另有直收優惠價', { 公里: formatFareRuleValue(rules.longDistanceKm) });
    return `
      <details class="gc-fare-rates">
        <summary class="gc-fare-rates-summary">
          <span>${escapeHtml(cfg['費率標題'] || '中部地區費率')}</span>
          <small>${escapeHtml(allDayShort)}｜最低 $${escapeHtml(formatFareRuleValue(rules.minimum))}</small>
        </summary>
        <div class="gc-fare-rates-content">
          <div class="gc-fare-rates-lines">${rateLines.map(line => `<span>${escapeHtml(line)}</span>`).join('')}</div>
          <div class="gc-fare-rates-long">${escapeHtml(longText)}</div>
        </div>
      </details>`;
  }

  function renderFare(cfg) {
    attachedLocation = null;
    document.title = cfg['頁面標題'];
    app.innerHTML = `
      ${renderBrand()}
      <section class="form-card gc-fare-card">
        <div class="form-head gc-fare-head">
          <h1>${escapeHtml(cfg['頁面標題'])}</h1>
          <p class="gc-fare-guide-copy">${escapeHtml(cfg['頁面說明'])}</p>
        </div>
        <div class="form-body gc-fare-body">
          ${preview ? `<div class="notice preview-notice"><p>${escapeHtml(COMMON['預覽模式提醒'])}</p></div>` : ''}
          ${renderFareCalculator(cfg)}
          ${renderFareRateSummary(cfg)}
          <div class="gc-fare-or" aria-hidden="true"><span>或</span></div>
          <section class="gc-fare-manual">
            <div class="gc-fare-manual-head">
              <strong>${escapeHtml(cfg['人工協助標題'] || '不方便自行試算？')}</strong>
              <span>${escapeHtml(cfg['人工協助提示'] || '填寫上下車地址，由客服協助估價。')}</span>
            </div>
            <form class="gc-fare-manual-form" id="serviceForm" novalidate>
              <div id="globalError" class="global-error"></div>
              ${fieldAddress('pickup', cfg['上車標題'], cfg['上車提示'], true, false, false)}
              ${fieldAddress('destination', cfg['下車標題'], cfg['下車提示'], true, false, false)}
              <button class="submit-btn" id="submitBtn" type="submit">${escapeHtml(cfg['送出按鈕'])}</button>
            </form>
          </section>
        </div>
        ${renderConfirmationModal()}
        ${renderRecentClearModal()}
      </section>`;

    bindFare(cfg);
  }

  function setDateMinimum() {
    const input = document.getElementById('date');
    if (!input) return;
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    input.min = local;
  }

  function clearErrors() {
    document.querySelectorAll('.error-text').forEach(el => {
      el.textContent = '';
      el.classList.remove('show');
    });
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    const global = document.getElementById('globalError');
    if (global) {
      global.textContent = '';
      global.classList.remove('show');
    }
  }

  function showFieldError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);
    if (input) input.classList.add('invalid');
    if (error) {
      error.textContent = message;
      error.classList.add('show');
    }
  }

  function showNamedError(id, message) {
    const error = document.getElementById(id);
    if (error) {
      error.textContent = message;
      error.classList.add('show');
    }
  }

  function showGlobalError(message) {
    const global = document.getElementById('globalError');
    if (global) {
      global.textContent = message;
      global.classList.add('show');
      global.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function value(id) {
    return (document.getElementById(id)?.value || '').trim();
  }

  function baggageValue() {
    const raw = value('baggage');
    const compact = raw.replace(/\s+/g, '');
    if (!compact || /^[0０]+(?:(?:件|個)(?:行李)?|行李)?$/.test(compact)) return '';
    return raw;
  }

  function checked(name) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
  }

  function meaningfulOptionalText(data) {
    const raw = String(data ?? '').trim();
    if (!raw) return '';
    const normalized = raw.replace(/\s+/g, '').toLowerCase();
    if (['0', '無', 'なし', 'none', 'null', 'undefined', '-', '－'].includes(normalized)) return '';
    return raw;
  }

  function appendLine(lines, label, data) {
    const symbol = COMMON['訊息欄位符號'] || '•';
    const safe = meaningfulOptionalText(data);
    if (safe) lines.push(`${symbol} ${label}：${safe}`);
  }

  async function sendFormMessages(text, location = null) {
    if (preview) return;
    const sdk = await ensureLiffReady();
    if (!sdk || !sdk.isInClient()) {
      throw new Error(COMMON['非LINE開啟提醒'] || '請從 LINE 聊天室開啟。');
    }
    const messages = [{ type: 'text', text }];
    if (location && Number.isFinite(location.latitude) && Number.isFinite(location.longitude)) {
      messages.push({
        type: 'location',
        title: location.title || '目前位置',
        address: location.address || '由 GC 表單傳送的目前定位',
        latitude: location.latitude,
        longitude: location.longitude
      });
    }
    await sdk.sendMessages(messages);
  }

  function setSending(sending, cfg) {
    const btn = document.getElementById('submitBtn');
    if (!btn) return;
    btn.disabled = sending;
    btn.textContent = sending ? (COMMON['傳送中文字'] || '傳送中…') : cfg['送出按鈕'];
  }

  function bindSmallDisclosureTriggers() {
    document.querySelectorAll('details.optional-box:not(.favorite-box)').forEach(details => {
      const summary = details.querySelector(':scope > summary');
      if (!summary) return;
      const alreadyBound = summary.dataset.gcSmallTriggerBound === '1';

      // Keep the row readable, but only the compact control at the far right opens it.
      // This function is intentionally re-entrant because the visual refinement script may rewrite summary text.
      let trigger = summary.querySelector('.gc-small-disclosure-trigger');
      if (!trigger) {
        trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'gc-small-disclosure-trigger';
        trigger.setAttribute('aria-label', '展開或收合');
        trigger.innerHTML = '<span class="gc-small-trigger-label">展開</span><span aria-hidden="true">⌄</span>';
        summary.appendChild(trigger);
      }

      const sync = () => {
        const currentTrigger = summary.querySelector('.gc-small-disclosure-trigger');
        if (!currentTrigger) return;
        currentTrigger.setAttribute('aria-expanded', String(details.open));
        const label = currentTrigger.querySelector('.gc-small-trigger-label');
        if (label) label.textContent = details.open ? '收合' : '展開';
        const arrow = currentTrigger.lastElementChild;
        if (arrow) arrow.textContent = details.open ? '⌃' : '⌄';
      };
      sync();

      if (!alreadyBound) {
        summary.dataset.gcSmallTriggerBound = '1';
        summary.addEventListener('click', event => {
          if (!event.target.closest('.gc-small-disclosure-trigger')) {
            event.preventDefault();
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          details.open = !details.open;
          sync();
        });
        details.addEventListener('toggle', sync);
      }
    });
  }
  window.GC_bindSmallDisclosureTriggers = bindSmallDisclosureTriggers;

  function installVerticalOnlyTouchGuard() {
    if (document.documentElement.dataset.gcVerticalGuard === '1') return;
    document.documentElement.dataset.gcVerticalGuard = '1';
    let startX = 0, startY = 0, axis = '';
    document.addEventListener('touchstart', event => {
      if (event.touches.length !== 1) return;
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      axis = '';
    }, { passive: true, capture: true });
    document.addEventListener('touchmove', event => {
      if (event.touches.length !== 1) return;
      const dx = event.touches[0].clientX - startX;
      const dy = event.touches[0].clientY - startY;
      if (!axis && (Math.abs(dx) > 6 || Math.abs(dy) > 6)) axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (axis === 'x') event.preventDefault();
    }, { passive: false, capture: true });
  }

  function bindRideLike(mode, cfg) {
    setDateMinimum();
    bindRecentAddressControls();
    bindSmallDisclosureTriggers();
    installVerticalOnlyTouchGuard();
    bindFavoriteTrips();
    bindFavoriteSaveModal();
    bindCurrentLocation(mode);
    bindSmartAddressInputs();
    bindConfirmationModal();
    bindRecentClearModal();

    document.querySelectorAll('input[name="serviceType"]').forEach(input => {
      input.addEventListener('change', () => {
        const reserve = checked('serviceType') === 'reserve';
        document.getElementById('scheduleFields').classList.toggle('hidden', !reserve);
        if (!reserve) {
          document.getElementById('date').value = '';
          document.getElementById('time').value = '';
        }
        updateLocationVisibility();
      });
    });

    let sending = false;
    document.getElementById('serviceForm').addEventListener('submit', event => {
      event.preventDefault();
      if (sending) return;
      clearErrors();
      normalizeAddressInput('pickup');
      normalizeAddressInput('destination');

      const serviceType = checked('serviceType');
      const pickup = value('pickup');
      const destination = value('destination');
      let valid = true;

      if (!serviceType) {
        showNamedError('serviceTypeError', cfg['錯誤_用車方式']);
        valid = false;
      }
      if (serviceType === 'reserve' && !value('date')) {
        showFieldError('date', cfg['錯誤_日期']);
        valid = false;
      }
      if (serviceType === 'reserve' && !value('time')) {
        showFieldError('time', cfg['錯誤_時間']);
        valid = false;
      }
      if (!pickup || pickup === LOCATION_MARKER) {
        showFieldError('pickup', cfg['錯誤_上車地址']);
        valid = false;
      }
      if (serviceType === 'instant' && attachedLocation?.requiresConfirmation && !attachedLocation.confirmed) {
        showFieldError('pickup', '請先確認定位地址是否正確，或直接修改上車地址。');
        setLocationReview('請確認門牌是否為實際上車地點；不對可直接修改。', true);
        valid = false;
      }
      if (!valid) return;

      const typeText = serviceType === 'reserve' ? cfg['預約選項'] : cfg['即時選項'];
      const lines = [serviceType === 'reserve' ? cfg['訊息標題_預約'] : cfg['訊息標題_即時']];
      if (cfg['訊息分隔線']) lines.push(cfg['訊息分隔線']);
      appendLine(lines, cfg['訊息欄位_用車方式'], typeText);
      if (serviceType === 'reserve') {
        appendLine(lines, cfg['訊息欄位_日期'], value('date'));
        appendLine(lines, cfg['訊息欄位_時間'], value('time'));
      }
      appendLine(lines, cfg['訊息欄位_上車'], pickup);
      appendLine(lines, cfg['訊息欄位_下車'], destination);
      if (mode !== 'driver') appendLine(lines, cfg['訊息欄位_人數'], value('passengers'));

      if (mode === 'driver') {
        appendLine(lines, cfg['訊息欄位_車輛'], value('vehicle'));
        appendLine(lines, cfg['訊息欄位_停車'], value('parking'));
      } else {
        appendLine(lines, cfg['訊息欄位_行李'], baggageValue());
        appendLine(lines, cfg['訊息欄位_需求'], value('requirements'));
      }
      appendLine(lines, cfg['訊息欄位_備註'], value('notes'));

      const signature = submissionSignature({
        mode,
        serviceType,
        date: value('date'),
        time: value('time'),
        pickup,
        destination,
        passengers: mode === 'driver' ? '' : value('passengers'),
        baggage: baggageValue(),
        requirements: value('requirements'),
        vehicle: value('vehicle'),
        parking: value('parking'),
        notes: value('notes'),
        location: attachedLocation?.sendMap !== false && attachedLocation ? [attachedLocation.latitude.toFixed(5), attachedLocation.longitude.toFixed(5)] : null
      });
      if (isDuplicateSubmission(signature)) {
        showGlobalError(duplicateMessage());
        return;
      }

      const rows = [
        { label: cfg['訊息欄位_用車方式'], value: typeText },
        ...(serviceType === 'reserve' ? [
          { label: cfg['訊息欄位_日期'], value: value('date') },
          { label: cfg['訊息欄位_時間'], value: value('time') }
        ] : []),
        { label: cfg['訊息欄位_上車'], value: pickup, emphasis: true },
        { label: cfg['訊息欄位_下車'], value: destination || (COMMON['選填未填寫'] || '未填寫（選填）'), emphasis: true },
        ...(mode !== 'driver' && value('passengers') ? [{ label: cfg['訊息欄位_人數'], value: value('passengers') }] : []),
        ...(attachedLocation?.sendMap !== false && attachedLocation ? [{ label: '目前定位', value: '已附上 LINE 地圖定位' }] : [])
      ];

      if (mode === 'driver') {
        if (value('vehicle')) rows.push({ label: cfg['訊息欄位_車輛'], value: value('vehicle') });
        if (value('parking')) rows.push({ label: cfg['訊息欄位_停車'], value: value('parking') });
      } else {
        if (baggageValue()) rows.push({ label: cfg['訊息欄位_行李'], value: baggageValue() });
        if (value('requirements')) rows.push({ label: cfg['訊息欄位_需求'], value: value('requirements') });
      }
      if (meaningfulOptionalText(value('notes'))) rows.push({ label: cfg['訊息欄位_備註'], value: meaningfulOptionalText(value('notes')) });

      const confirmTitle = mode === 'driver'
        ? (COMMON['確認標題_代駕'] || '請確認代駕資料')
        : (COMMON['確認標題_叫車'] || '請確認叫車資料');

      openConfirmation(confirmTitle, rows, async () => {
        sending = true;
        setSending(true, cfg);
        try {
          if (isDuplicateSubmission(signature)) throw new Error(duplicateMessage());
          await sendFormMessages(lines.join('\n'), serviceType === 'instant' && attachedLocation?.sendMap !== false ? attachedLocation : null);
          if (!preview) markSubmission(signature);
          const generatedLocationAddress = attachedLocation?.generatedAddress || '';
          rememberRecentAddresses([destination, pickup].filter(address => address && address !== LOCATION_MARKER && address !== generatedLocationAddress));
          renderSuccess(cfg, serviceType === 'reserve');
        } catch (error) {
          sending = false;
          setSending(false, cfg);
          throw error;
        }
      });
    });
  }

  function bindFareCalculator(cfg) {
    const kmInput = document.getElementById('fareKm');
    const minuteInput = document.getElementById('fareMinutes');
    const result = document.getElementById('fareCalcResult');
    const label = document.getElementById('fareResultLabel');
    const price = document.getElementById('fareResultPrice');
    const basis = document.getElementById('fareResultBasis');
    const note1 = document.getElementById('fareResultNote1');
    const note2 = document.getElementById('fareResultNote2');
    const longDistance = document.getElementById('fareLongDistance');
    if (!kmInput || !minuteInput || !result || !label || !price || !basis || !note1 || !note2 || !longDistance) return;

    const reset = () => {
      result.classList.add('is-waiting');
      result.classList.remove('is-invalid', 'is-ready');
      label.textContent = cfg['計算器等待'] || '先填分鐘，再填公里，立即顯示預估車資';
      price.textContent = '';
      basis.textContent = '';
      note1.textContent = '';
      note2.textContent = '';
      longDistance.classList.add('hidden');
    };

    const update = () => {
      const kmText = kmInput.value.trim();
      const minuteText = minuteInput.value.trim();
      if (!kmText || !minuteText) {
        reset();
        return;
      }

      const estimate = calculateFareEstimate(kmText, minuteText, cfg);
      if (!estimate || estimate.invalid) {
        result.classList.remove('is-waiting', 'is-ready');
        result.classList.add('is-invalid');
        label.textContent = '請確認公里數與預估時間。';
        price.textContent = '';
        basis.textContent = '';
        note1.textContent = '';
        note2.textContent = '';
        longDistance.classList.add('hidden');
        return;
      }

      result.classList.remove('is-waiting', 'is-invalid');
      result.classList.add('is-ready');
      label.textContent = cfg['結果標題'] || '預估車資';
      // GC_MASTER_FARE_BASELINE_PRIMARY
      price.textContent = `約 NT$${formatFareMoney(estimate.baseline)}`;
      basis.textContent = `${cfg['結果依據標題'] || '本次試算依據'}｜${estimate.minutes} 分鐘・${estimate.km} 公里`;
      note1.textContent = cfg['結果說明1'] || '依較短距離路線試算；實際依路況、等候時間及跳錶為準。';
      note2.textContent = fareTextTemplate(cfg['結果說明2'] || '實際車資可能約有 ±NT${浮動} 元差異。', { 浮動: formatFareMoney(estimate.rules.range) });
      longDistance.textContent = fareTextTemplate(cfg['長途提示格式'] || '🚕 {公里}公里以上另有直收優惠價', { 公里: formatFareRuleValue(estimate.rules.longDistanceKm) });
      longDistance.classList.toggle('hidden', !estimate.longDistance);
    };

    kmInput.addEventListener('input', update);
    minuteInput.addEventListener('input', update);
    kmInput.addEventListener('change', update);
    minuteInput.addEventListener('change', update);
    reset();
  }

  function bindFare(cfg) {
    bindFareCalculator(cfg);
    bindRecentAddressControls();
    bindSmallDisclosureTriggers();
    installVerticalOnlyTouchGuard();
    bindSmartAddressInputs();
    bindConfirmationModal();
    bindRecentClearModal();

    let sending = false;
    document.getElementById('serviceForm').addEventListener('submit', event => {
      event.preventDefault();
      if (sending) return;
      clearErrors();
      normalizeAddressInput('pickup');
      normalizeAddressInput('destination');

      const pickup = value('pickup');
      const destination = value('destination');
      const estimateMethod = cfg['訊息內容_估價方式'] || '請客服協助估價';
      let valid = true;
      if (!pickup) {
        showFieldError('pickup', cfg['錯誤_上車地址']);
        valid = false;
      }
      if (!destination) {
        showFieldError('destination', cfg['錯誤_下車地址']);
        valid = false;
      }
      if (!valid) return;

      const lines = [cfg['訊息標題']];
      if (cfg['訊息分隔線']) lines.push(cfg['訊息分隔線']);
      appendLine(lines, cfg['訊息欄位_估價方式'] || '估價方式', estimateMethod);
      appendLine(lines, cfg['訊息欄位_上車'], pickup);
      appendLine(lines, cfg['訊息欄位_下車'], destination);

      const signature = submissionSignature({ mode: 'fare', estimateMethod, pickup, destination });
      if (isDuplicateSubmission(signature)) {
        showGlobalError(duplicateMessage());
        return;
      }

      const rows = [
        { label: cfg['訊息欄位_估價方式'] || '估價方式', value: estimateMethod },
        { label: cfg['訊息欄位_上車'], value: pickup, emphasis: true },
        { label: cfg['訊息欄位_下車'], value: destination, emphasis: true }
      ];

      openConfirmation(COMMON['確認標題_估價'] || '請確認估價資料', rows, async () => {
        sending = true;
        setSending(true, cfg);
        try {
          if (isDuplicateSubmission(signature)) throw new Error(duplicateMessage());
          await sendFormMessages(lines.join('\n'));
          if (!preview) markSubmission(signature);
          renderSuccess(cfg);
        } catch (error) {
          sending = false;
          setSending(false, cfg);
          throw error;
        }
      });
    });
  }

  function successLines(cfg, reservation = false) {
    const prefix = reservation ? '成功內容_預約' : '成功內容';
    return Object.keys(cfg)
      .filter(key => key.startsWith(prefix) && /^\d+$/.test(key.slice(prefix.length)))
      .sort((a, b) => Number(a.slice(prefix.length)) - Number(b.slice(prefix.length)))
      .map(key => cfg[key])
      .filter(Boolean);
  }

  function resetViewportAfterSubmit() {
    // Submission may complete while the confirmation modal has the page locked
    // with body{position:fixed; top:-scrollY}.  If that state survives a render,
    // the new success page can be translated completely off-screen (blank page).
    modalLockDepth = 0;
    modalScrollY = 0;
    document.documentElement.classList.remove('gc-modal-lock');
    document.body.classList.remove('modal-open', 'gc-modal-lock', 'gc-sheet-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    document.body.style.height = '';
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
  }

  function renderSuccess(cfg, reservation = false) {
    resetViewportAfterSubmit();
    pendingConfirmAction = null;
    confirmationBusy = false;

    const useReservation = reservation === true && Boolean(cfg['成功標題_預約']);
    const title = useReservation ? cfg['成功標題_預約'] : cfg['成功標題'];
    app.classList.add('gc-success-mode');
    app.innerHTML = `
      <main class="gc-success-screen">
        <section class="success-card">
          <div class="success-icon">✓</div>
          <h1>${escapeHtml(title)}</h1>
          <div class="success-lines">
            ${successLines(cfg, useReservation).map(line => `<p>${escapeHtml(line).replace(/\\n/g, '<br>')}</p>`).join('')}
          </div>
          <button type="button" class="back-btn" id="closeBtn">${escapeHtml(cfg['返回按鈕'])}</button>
        </section>
      </main>`;

    // iOS WKWebView can restore the old scroll position one frame later.
    // Force the completed state to remain at the top/center for two frames.
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      requestAnimationFrame(() => window.scrollTo(0, 0));
    });

    document.getElementById('closeBtn').addEventListener('click', () => {
      if (preview) {
        history.back();
        return;
      }
      if (window.liff && liff.isInClient()) {
        liff.closeWindow();
      } else {
        history.back();
      }
    });
  }

  async function initialize() {
    const initialParams = new URLSearchParams(location.search);
    const mightBeLiff = initialParams.has('liff.state') || initialParams.has('mode');

    if (!preview && mightBeLiff) {
      try {
        // Keep LINE's required primary/secondary redirect flow unchanged.
        // The SDK file itself is fetched without blocking HTML parsing, then init
        // still completes before we read the final mode and render the form.
        await ensureLiffReady();
      } catch (error) {
        renderFatal('表格無法開啟', error?.message || 'LIFF 初始化失敗。');
        return;
      }
    }

    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');

    if (!mode) {
      renderQr();
      return;
    }

    if (!preview && (!window.liff || !liff.isInClient())) {
      renderFatal('請從 LINE 開啟', COMMON['非LINE開啟提醒']);
      return;
    }

    if (mode === 'call') {
      renderRideLike('call', CONFIG.call || {});
    } else if (mode === 'driver') {
      renderRideLike('driver', CONFIG.driver || {});
    } else if (mode === 'fare') {
      renderFare(CONFIG.fare || {});
    } else {
      renderQr();
    }
  }

  const loadingText = document.getElementById('loadingText');
  if (loadingText && COMMON['初始化文字']) loadingText.textContent = COMMON['初始化文字'];
  initialize();
})();
