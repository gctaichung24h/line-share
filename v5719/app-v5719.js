(() => {
  'use strict';
  const GC_BUILD_VERSION = 'master202608r10z9i';
  // GC_MASTER_STABLE_2026_08R10Z9_ENTERPRISE_POI_PROGRESSIVE_UX
  // GC_MASTER_STABLE_2026_08R10Z9H_NEEDS_GROUPED_REFLOW
  // GC_MASTER_STABLE_2026_08R10Z9I_NEEDS_TITLE_AND_FARE_INNER_CARD
  // Enterprise POI discovery, progressive first-screen UX, responsive polish and parallel LIFF boot.
  // GC_R10Z2_FARE_RETURN_SCROLL_STABLE: fare return scroll is owned by browser history; no result auto-centering.
  // GC_MASTER_STABLE_2026_08R10Z8_FIRST_PAINT_VERSION_COHERENCE
  // Never paint a stale form and then replace it. First-paint waits behind the existing loading card
  // until version.json confirms the bundle, while recent same-session bfcache returns stay instant.
  // GC_MASTER_STABLE_2026_08R10Z3_ADDRESS_BEHAVIOR_RESTORE
  // GC_MASTER_STABLE_2026_08R10Z4_ADDRESS_PROVIDER_LABEL_FIX
  // GC_MASTER_STABLE_2026_08R10Z5_EXPLICIT_SUGGESTION_VISIBLE_SOURCE_LOCK
  // GC_MASTER_STABLE_2026_08R10Z6_ADDRESS_MATRIX_AND_ROMANIZED_PROVIDER_BLOCK
  // Explicit suggestion tap keeps the cleaned suggestion label as passenger-visible truth;
  // candidate resolution is validation/route metadata only and may never replace it with transliterated provider fields.
  // Address-only repair: restore R10Q-style autocomplete availability; keep format sanitation and mode-aware submit gates separate.
  // GC_MASTER_STABLE_2026_08R10V_ADDRESS_CORRUPTION_FIREWALL
  // GC_MASTER_STABLE_2026_08R10Y_LARGE_FLEET_ADDRESS_RESOLUTION
  // GC_MASTER_STABLE_2026_08R10Z_DISPATCH_CORE_FINAL
  // GC_MASTER_STABLE_2026_08R10Z1_ADDRESS_ROOT_FIX
  // GC_ADDRESS_CONTRACT_TW_GROUND_V1
  // Preserve provider identity (text + magicKey), clean only display/route copies, and direct-geocode manual full addresses.
  // GC_MASTER_STABLE_2026_08R10X_PROVIDER_POSTAL_LABEL_SANITIZER
  // Provider-only cleanup: remove Taiwan postal-code prefixes/commas from explicit suggestions; never rewrite manual typing.
  // GC_MASTER_STABLE_2026_08R10W_USER_ADDRESS_CONTROL_LOCK
  // Customer controls address meaning; after typing ends, format-only sanitation may remove provider noise without changing the place.
  // GC_MASTER_STABLE_2026_08R10U_MODE_AWARE_ADDRESS_POLICY
  // GC_MASTER_STABLE_2026_08R10T_FARE_TO_CALL_HANDOFF_FIX
  // GC_MASTER_STABLE_2026_08R10S_FINAL_SMART_LOCATION_AND_POLISH_SEAL
  // GC_MASTER_STABLE_2026_08R10R_VISUAL_SYSTEM_FINAL_SEAL
  // GC_MASTER_STABLE_2026_08R10Q_TEN_POINT_FINAL_SEAL
  // GC_MASTER_STABLE_2026_08R10P_DEFERRED_VERSION_CHECK
  // R10Z8: version safety is now first-paint coherent. A stale page may show the loading surface,
  // but it may never show an old usable form for ~1 second and then jump to the new build.
  let gcLastVersionCheck = 0;
  let gcVersionRedirecting = false;
  const GC_VERSION_CHECK_INTERVAL_MS = 2 * 60 * 1000;
  const GC_FIRST_BUILD_CHECK_TIMEOUT_MS = 1500;
  async function ensureLatestBuild(force = false, options = {}) {
    const now = Date.now();
    if (!force && now - gcLastVersionCheck < GC_VERSION_CHECK_INTERVAL_MS) return 'recent';
    gcLastVersionCheck = now;
    const timeoutMs = Number(options.timeoutMs || 0);
    const controller = timeoutMs > 0 && typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    try {
      const res = await fetch('version.json?t=' + now, {
        cache: 'no-store',
        signal: controller?.signal
      });
      if (!res.ok) return 'unknown';
      const info = await res.json();
      if (info && info.version && info.version !== GC_BUILD_VERSION) {
        gcVersionRedirecting = true;
        document.documentElement.classList.add('gc-version-hold');
        const url = new URL(location.href);
        url.searchParams.set('gcver', info.version);
        url.searchParams.set('_r', String(now));
        location.replace(url.toString());
        return 'stale';
      }
      return 'current';
    } catch (_) {
      return 'unknown';
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
  function releaseVersionHold(status) {
    if (status === 'stale' || gcVersionRedirecting) return;
    document.documentElement.classList.remove('gc-version-hold');
  }
  function scheduleLatestBuildCheck(force = false) {
    const run = () => ensureLatestBuild(force).then(releaseVersionHold);
    if (typeof requestIdleCallback === 'function') requestIdleCallback(run, { timeout: 2200 });
    else setTimeout(run, 900);
  }
  window.addEventListener('pagehide', event => {
    // Only freeze a bfcache snapshot when its last version proof is old. Normal Google Maps
    // round-trips within the same two-minute window remain immediate and do not flash a loader.
    if (event.persisted && Date.now() - gcLastVersionCheck >= GC_VERSION_CHECK_INTERVAL_MS) {
      document.documentElement.classList.add('gc-version-hold');
    }
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted && document.documentElement.classList.contains('gc-version-hold')) {
      ensureLatestBuild(true, { timeoutMs: GC_FIRST_BUILD_CHECK_TIMEOUT_MS }).then(releaseVersionHold);
      return;
    }
    scheduleLatestBuildCheck(false);
  });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) scheduleLatestBuildCheck(false); });


  const CONFIG = window.GC_FORM_CONFIG || {};
  const COMMON = CONFIG.common || {};
  const app = document.getElementById('app');
  const preview = new URLSearchParams(location.search).get('preview') === '1';
  const brandAvatarUrl = document.querySelector('.loading-card .brand-avatar')?.getAttribute('src') || '表格頭像_直接更換.png';
  const RELEASE_MARKER = 'GC_MASTER_STABLE_2026_08R10_FINAL_ENTERPRISE_UX_LOCKED_SAFE';
  const RECENT_STORAGE_KEY = 'gc_recent_addresses_v1';
  const RECENT_LIMIT = 5;
  const FAVORITE_STORAGE_KEY = 'gc_favorite_trips_v1';
  const FAVORITE_LIMIT = 5;
  const LAST_SUBMISSION_STORAGE_KEY = 'gc_last_submission_v1';
  const DUPLICATE_WINDOW_MS = 60 * 1000;
  const LOCATION_MARKER = '📍 已附上目前定位';
  const LOCATION_PIN_ONLY_LABEL = '📍 目前定位（無門牌）';
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
  // R10Z9: Taichung district context + common-chain aliases are used only to improve POI discovery/ranking.
  // They never rewrite passenger typing. Explicit candidate selection remains the only UI replacement path.
  const ADDRESS_TAICHUNG_DISTRICTS = ['中區','東區','南區','西區','北區','西屯區','南屯區','北屯區','豐原區','東勢區','大甲區','清水區','沙鹿區','梧棲區','后里區','神岡區','潭子區','大雅區','新社區','石岡區','外埔區','大安區','烏日區','大肚區','龍井區','霧峰區','太平區','大里區','和平區'];
  const ADDRESS_TAICHUNG_EXTENT = '120.42,23.90,121.62,24.50';
  const POI_BRAND_ALIASES = [
    { re: /(?:7\s*[-－]?\s*11|711|7\s*[-－]?\s*ELEVEN|統一超商)/i, canonical: '7-ELEVEN', label: '7-ELEVEN' },
    { re: /(?:全家便利商店|全家|Family\s*Mart)/i, canonical: '全家便利商店', label: '全家' },
    { re: /(?:萊爾富|Hi\s*[-－]?\s*Life)/i, canonical: '萊爾富', label: '萊爾富' },
    { re: /(?:OK\s*(?:超商|便利商店|Mart)?)/i, canonical: 'OK超商', label: 'OK超商' },
    { re: /(?:麥當勞|McDonald'?s?)/i, canonical: "麥當勞", label: '麥當勞' },
    { re: /(?:寶雅|POYA)/i, canonical: '寶雅', label: '寶雅' },
    { re: /(?:屈臣氏|Watsons?)/i, canonical: '屈臣氏', label: '屈臣氏' },
    { re: /(?:振宇五金)/i, canonical: '振宇五金', label: '振宇五金' },
    { re: /(?:星巴克|Starbucks)/i, canonical: '星巴克', label: '星巴克' },
    { re: /(?:全聯福利中心|全聯|PX\s*Mart)/i, canonical: '全聯福利中心', label: '全聯' },
    { re: /(?:家樂福|Carrefour)/i, canonical: '家樂福', label: '家樂福' },
    { re: /(?:康是美|COSMED)/i, canonical: '康是美', label: '康是美' },
    { re: /(?:小北百貨)/i, canonical: '小北百貨', label: '小北百貨' },
    { re: /(?:肯德基|KFC)/i, canonical: '肯德基', label: '肯德基' },
    { re: /(?:摩斯漢堡|MOS\s*Burger)/i, canonical: '摩斯漢堡', label: '摩斯漢堡' }
  ];
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
            <div class="location-review-copy">
              <strong>定位地址確認</strong>
              <span id="locationReviewText"></span>
            </div>
            <button class="location-confirm-btn" id="locationConfirmBtn" type="button">✓ 確認地址</button>
          </div>` : ''}
        ${showRecent ? `
        <div class="recent-address-control hidden" data-target="${id}">
          <button class="recent-toggle" type="button" aria-expanded="false" aria-label="${escapeHtml(COMMON['最近地址標題'] || '最近地址')}">
            <span class="recent-clock" aria-hidden="true">↺</span>
            <span class="recent-title">${escapeHtml(COMMON['最近地址按鈕'] || '最近地址')}</span>
            <span class="recent-count"></span>
            <span class="recent-chevron" aria-hidden="true">⌄</span>
          </button>
          <div class="recent-panel hidden" role="dialog" aria-label="${escapeHtml(COMMON['最近地址標題'] || '最近地址')}"></div>
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

  // GC_MASTER_STABLE_2026_08R10M_GROUND_ADDRESS_ONLY
  // Dispatch/navigation addresses stop at the street-level house number. Indoor floor/room
  // information is intentionally removed because drivers navigate to the ground address;
  // meeting-point details still belong in the optional note field.
  function stripIndoorAddressInfo(address) {
    let text = normalizeAddress(address).replace(/　/g, ' ').replace(/臺/g, '台').trim();
    if (!text || !/[路街道段巷弄]/.test(text) || !text.includes('號')) return text;

    const houseIndex = text.indexOf('號');
    const base = text.slice(0, houseIndex + 1);
    let suffix = text.slice(houseIndex + 1);
    let houseSub = '';
    const houseSubMatch = suffix.match(/^之[0-9０-９]+/);
    if (houseSubMatch) {
      houseSub = houseSubMatch[0];
      suffix = suffix.slice(houseSub.length);
    }

    const indoor = /^\s*[,，、-]?\s*(?:地下\s*[0-9０-９]+\s*樓|[Bb]\s*[0-9０-９]+\s*(?:F|樓)?|[0-9０-９]+\s*(?:樓(?:之[0-9０-９]+)?|F|樓層|室))(?:\s*[-之]?\s*[A-Za-z0-9０-９]+\s*室?)?.*$/i;
    if (indoor.test(suffix)) return `${base}${houseSub}`;
    return text;
  }

  // GC_MASTER_STABLE_2026_08R10J_DISPATCH_ADDRESS_SANITIZER
  // Final outbound address cleanup: strip Taiwan postal codes only when the remaining
  // text clearly starts with a Taiwan city/county, then compact structured Chinese addresses.
  // This prevents 420015 / 40674 and provider commas/spaces from reaching LINE while
  // preserving rider-entered landmarks and house-number digits.
  const TAIWAN_ADMIN_START = /^(?:台北市|新北市|桃園市|台中市|台南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣)/;

  function cleanTaiwanAddressForUse(address) {
    let text = normalizeAddress(address)
      .replace(/　/g, ' ')
      .replace(/臺/g, '台')
      .replace(/号/g, '號')
      .trim();
    if (!text) return '';

    // Taiwan postal codes can be 3, 5, or 6 digits. Remove only when a recognized
    // Taiwan city/county immediately follows, avoiding accidental deletion of door numbers.
    text = text.replace(/^(?:[0-9０-９]{6}|[0-9０-９]{5}|[0-9０-９]{3})\s*[,，、]?\s*(?=(?:台北市|新北市|桃園市|台中市|台南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣))/, '');
    // Final address-only safety net for historical/provider pollution such as
    // 台中市北區公園路188號404007號. Never remove a normal 1-4 digit house number.
    text = text.replace(/^((?:台北市|新北市|桃園市|台中市|台南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣).*(?:大道|路|街|道|巷|弄).*[0-9０-９]+(?:[-之][0-9０-９]+)?號.*?)[0-9０-９]{5,6}號$/, '$1');

    text = stripIndoorAddressInfo(text);
    const structuredTaiwanAddress = TAIWAN_ADMIN_START.test(text) && /[市縣區鄉鎮村里路街道段巷弄號樓室]/.test(text);
    if (structuredTaiwanAddress) {
      text = text
        .replace(/[，,、]+/g, '')
        .replace(/\s+/g, '');
    }
    return text;
  }

  function smartNormalizeTaiwanAddress(address) {
    let text = cleanTaiwanAddressForUse(address);
    if (!text || /號(?:之[0-9０-９]+)?$/.test(text) || /[樓室]$/.test(text)) return text;
    const match = text.match(/([0-9０-９]+(?:[-之][0-9０-９]+)?)$/);
    if (!match || !/[路街道巷弄]/.test(text)) return text;
    const mainDigits = match[1].split(/[-之]/)[0];
    const prefix = text.slice(0, match.index);
    const looksLikeHouseNumber = mainDigits.length >= 2 || /[段巷弄]$/.test(prefix) || /[段巷弄].*$/.test(prefix);
    if (looksLikeHouseNumber) text += '號';
    return text;
  }

  // GC_MASTER_STABLE_2026_08R4_LOCATION_ADDRESS_CLEAN
  // Reverse-geocoder output uses the same dispatch-safe cleanup as every other address source.
  function cleanLocatedTaiwanAddress(address) {
    return smartNormalizeTaiwanAddress(address);
  }

  // GC_R10Z3_SAFE_VISIBLE_ADDRESS_SANITIZER
  // Restore the pre-regression behavior only for unambiguous formatting cleanup.
  // This may remove Taiwan postal-code prefixes / provider commas / extra spaces / indoor floors,
  // but it never invents a county, district, road or POI and never runs while the passenger is typing.
  function normalizeAddressInput(id) {
    const input = document.getElementById(id);
    if (!input) return '';
    const before = String(input.value || '').trim();
    const normalized = smartNormalizeTaiwanAddress(before);
    if (normalized && normalized !== before) {
      input.value = normalized;
    }
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
    let raw = String(value || '').replace(/臺/g, '台');
    try {
      raw = window.GC_ADDRESS_GUARD?.stripLeadingTaiwanPostalPrefix?.(raw) || raw;
      raw = window.GC_ADDRESS_GUARD?.stripTrailingPostalHouseArtifact?.(raw) || raw;
    } catch (_) {}
    return normalizeAddress(raw
      .replace(/(?:,|\s)+(?:Taiwan|TWN|台灣|臺灣)$/i, '')
      .replace(/^(?:[0-9０-９]{6}|[0-9０-９]{5})\s+(?=.*(?:台北市|新北市|桃園市|台中市|台南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣))/, '')
      .replace(/^(?:[0-9０-９]{3})\s*[,，、]?\s*(?=(?:台北市|新北市|桃園市|台中市|台南市|高雄市|基隆市|新竹市|嘉義市|新竹縣|苗栗縣|彰化縣|南投縣|雲林縣|嘉義縣|屏東縣|宜蘭縣|花蓮縣|台東縣|澎湖縣|金門縣|連江縣))/, '')
      .replace(/,\s*/g, ' ')
      .replace(/\s+\d{3}(?:\d{2,3})?$/, ''));
  }

  // GC_R10Z6_ROMANIZED_PROVIDER_ROAD_BLOCK
  // Reject only provider-style romanized street+door tokens; English business names remain allowed.
  function isRomanizedProviderRoad(value) {
    const text = String(value || '').replace(/臺/g, '台');
    if (!canonicalTaiwanCounty(text)) return false;
    try {
      if (window.GC_ADDRESS_GUARD?.isRomanizedRoadProviderLabel?.(text)) return true;
    } catch (_) {}
    const after = /(?:^|[^A-Za-z])(?:[A-Za-z][A-Za-z .'-]{1,48}?)(?:Rd|Road|St|Street|Ave|Avenue|Blvd|Boulevard|Ln|Lane|Alley)\s*[0-9０-９]+(?:[-之][0-9０-９]+)?(?:號)?/i;
    const before = /(?:^|[^A-Za-z0-9０-９])[0-9０-９]+(?:[-之][0-9０-９]+)?\s*(?:[A-Za-z][A-Za-z .'-]{1,48}?)(?:Rd|Road|St|Street|Ave|Avenue|Blvd|Boulevard|Ln|Lane|Alley)(?:$|[^A-Za-z])/i;
    return after.test(text) || before.test(text);
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

  // GC_MASTER_STABLE_2026_08R10M_DISTRICT_SAFE_SUGGESTIONS
  // ArcGIS can return duplicated municipality labels such as "台中市 台中市 公園路188號".
  // Treat the second identical city as provider noise, never as a district, and require a
  // real 區／鄉／鎮／市 for road-level suggestions so dispatch staff are not misled.
  function splitTaiwanSuggestionAddress(value) {
    const text = cleanSuggestedAddress(value).replace(/臺/g, '台');
    const county = canonicalTaiwanCounty(text);
    let remainder = text;

    if (county) {
      const countyIndex = text.indexOf(county);
      remainder = countyIndex >= 0 ? text.slice(countyIndex + county.length).trim() : text;
      while (remainder.startsWith(county)) remainder = remainder.slice(county.length).trim();
    }

    const pullDistrict = (source) => {
      let chunk = normalizeAddress(source);
      if (!chunk) return { district: '', remainder: '' };

      let match = chunk.match(/^([\u3400-\u9fff]{1,7}?(?:區|鄉|鎮|市))(?=\s|[\u3400-\u9fff0-9０-９]|$)/);
      if (match && sameAddressPart(match[1], county)) {
        chunk = chunk.slice(match[1].length).trim();
        match = chunk.match(/^([\u3400-\u9fff]{1,7}?(?:區|鄉|鎮|市))(?=\s|[\u3400-\u9fff0-9０-９]|$)/);
      }
      if (match && !sameAddressPart(match[1], county)) {
        return { district: match[1], remainder: chunk.slice(match[1].length).trim() };
      }

      const tokens = chunk.split(/\s+/).filter(Boolean);
      const token = tokens.find(item => /(?:區|鄉|鎮|市)$/.test(item) && !sameAddressPart(item, county));
      if (token) {
        const idx = chunk.indexOf(token);
        const left = chunk.slice(0, idx).trim();
        const right = chunk.slice(idx + token.length).trim();
        return { district: token, remainder: normalizeAddress(`${left} ${right}`) };
      }
      return { district: '', remainder: chunk };
    };

    const districtInfo = pullDistrict(remainder);
    const district = districtInfo.district;
    remainder = districtInfo.remainder;
    remainder = stripIndoorAddressInfo(remainder || '').trim();
    if (!remainder) remainder = stripIndoorAddressInfo(text);
    return { county, district, detail: remainder, full: text };
  }

  function isTaiwanSuggestion(value) {
    if (!value || isClearlyOutsideTaiwanSuggestion(value)) return false;
    return Boolean(canonicalTaiwanCounty(value) || /(台灣|臺灣|Taiwan|TWN)/i.test(String(value)));
  }


  function canonicalizeSuggestedAddress(value, attrs = {}) {
    // R10Y: provider data is canonicalized from structured fields when possible, but the
    // original /suggest text is never mutated because ArcGIS magicKey is tied to that text.
    try {
      const guarded = window.GC_ADDRESS_GUARD?.canonicalTaiwanAddress?.(value, attrs);
      if (guarded && !isRomanizedProviderRoad(guarded)) return smartNormalizeTaiwanAddress(guarded);
    } catch (_) {}
    const cleaned = cleanSuggestedAddress(value);
    const parts = splitTaiwanSuggestionAddress(cleaned);
    if (!parts.county) {
      const plain = smartNormalizeTaiwanAddress(cleaned);
      return isRomanizedProviderRoad(plain) ? '' : plain;
    }
    const admin = `${parts.county}${parts.district || ''}`;
    const detail = normalizeAddress(parts.detail || '');
    const result = smartNormalizeTaiwanAddress(`${admin}${detail}`);
    return isRomanizedProviderRoad(result) ? '' : result;
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

  // GC_R10Z4_SUGGESTION_ADMIN_AND_POSTAL_CLEAN
  // GC_MASTER_STABLE_2026_08R10Z9_POI_SUGGESTION_CARD
  // Candidate UI always keeps county + district visible. POIs additionally show the business/landmark
  // name as a first-class label so riders can distinguish branches without asking staff for a street number.
  function renderAddressSuggestion(item, index) {
    const parts = splitTaiwanSuggestionAddress(item.text);
    const adminParts = [parts.county, parts.district].filter((part, idx, list) => part && !list.slice(0, idx).some(prev => sameAddressPart(prev, part)));
    const admin = adminParts.join('｜');
    let detail = item?.streetAddress
      ? (splitTaiwanSuggestionAddress(item.streetAddress).detail || stripIndoorAddressInfo(item.streetAddress))
      : (parts.detail && !sameAddressPart(parts.detail, parts.full) ? parts.detail : stripIndoorAddressInfo(parts.full));
    const placeName = normalizeAddress(item?.placeName || '');
    if (placeName && detail) {
      const placeKey = addressConfidenceKey(placeName);
      const detailKey = addressConfidenceKey(detail);
      if (placeKey && detailKey.endsWith(placeKey)) {
        const placeCompact = normalizeAddress(placeName).replace(/\s+/g, '');
        const detailCompact = normalizeAddress(detail).replace(/\s+/g, '');
        if (placeCompact && detailCompact.endsWith(placeCompact)) detail = detailCompact.slice(0, -placeCompact.length).trim();
      }
    }
    const place = placeName ? `<strong class="gc-address-suggest-name">${escapeHtml(placeName)}</strong>` : '';
    const adminHtml = admin ? `<span class="gc-address-suggest-admin">${escapeHtml(admin)}</span>` : '';
    const detailHtml = detail ? `<span class="gc-address-suggest-detail">${escapeHtml(detail)}</span>` : '';
    return `<button type="button" class="gc-address-suggest-item${placeName ? ' is-poi' : ''}" data-index="${index}" role="option">
      <span class="gc-address-suggest-top">${place}${adminHtml}</span>
      ${detailHtml}
    </button>`;
  }

  async function fetchArcgisSuggest(text, locationBias, controller, options = {}) {
    const params = new URLSearchParams({
      f: 'json',
      text,
      countryCode: 'TWN',
      langCode: 'zh-TW',
      location: locationBias || ADDRESS_BIAS_LOCATION,
      searchExtent: options.searchExtent || ADDRESS_TAIWAN_MAIN_ISLAND_EXTENT,
      preferredLabelValues: 'localCity',
      returnCollections: options.returnCollections === true ? 'true' : 'false',
      maxSuggestions: String(Math.max(1, Math.min(15, Number(options.maxSuggestions || 8))))
    });
    const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?${params.toString()}`, {
      method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', signal: controller?.signal
    });
    if (!response.ok) return [];
    const data = await response.json();
    if (!data || data.error || !Array.isArray(data.suggestions)) return [];
    return data.suggestions;
  }

  // GC_MASTER_STABLE_2026_08R10Z9_POI_DISCOVERY
  // GC_MASTER_STABLE_2026_08R10Z9C_BRANCH_POI_ROOT_FIX
  // GC_MASTER_STABLE_2026_08R10Z9D_CHAIN_BRANCH_DISCOVERY_PARALLEL
  function poiContextFromQuery(value) {
    const raw = normalizeAddress(value).replace(/臺/g, '台');
    const compact = raw.replace(/[\s,，、。．·・_()（）]/g, '');
    const district = [...ADDRESS_TAICHUNG_DISTRICTS].sort((a,b) => b.length - a.length).find(name => {
      const short = name.replace(/區$/, '');
      return compact.includes(name) || (short.length >= 2 && compact.includes(short));
    }) || '';
    const county = explicitTaiwanCountyFromQuery(raw) || (district ? '台中市' : '');
    const brand = POI_BRAND_ALIASES.find(item => item.re.test(raw)) || null;
    let remainder = raw;
    if (county) remainder = remainder.replace(county, ' ');
    if (district) remainder = remainder.replace(district, ' ').replace(district.replace(/區$/, ''), ' ');
    if (brand) remainder = remainder.replace(brand.re, ' ');
    remainder = normalizeAddress(remainder).replace(/^(?:店|分店|門市)+|(?:店|分店|門市)+$/g, '').trim();
    const placeWords = /(?:站|車站|高鐵|捷運|機場|醫院|診所|飯店|酒店|旅館|百貨|商場|夜市|學校|大學|高中|國中|國小|公園|市場|餐廳|咖啡|銀行|郵局|門市|分店|商圈|公司|工廠|中心|超商|便利商店|五金|藥局|藥妝|賣場|影城|球場|館)/;
    const roadLike = /(?:大道|路|街|道|巷|弄).{0,30}[0-9０-９]*|[0-9０-９]+(?:[-之][0-9０-９]+)?號/;
    const isLikelyPoi = Boolean(brand) || (!roadLike.test(raw) && (placeWords.test(raw) || raw.replace(/\s/g,'').length >= 3));
    const branchSpecific = Boolean(district || remainder || /(?:店|分店|門市)/.test(raw));
    return { raw, compact, county, district, brand, remainder, isLikelyPoi, isBroadChain: Boolean(brand && !branchSpecific) };
  }

  function buildPoiQueryVariants(value) {
    const ctx = poiContextFromQuery(value);
    if (!ctx.isLikelyPoi) return [];
    const zone = [ctx.district, ctx.county || (!attachedLocation ? '台中市' : '')].filter(Boolean).join(' ');
    const name = ctx.brand?.canonical || ctx.raw;
    const extra = ctx.remainder;
    const variants = [];
    const push = text => { text = normalizeAddress(text); if (text && !variants.some(v => addressConfidenceKey(v) === addressConfidenceKey(text))) variants.push(text); };
    push(ctx.raw);
    if (ctx.brand) {
      push(`${name} ${extra} ${zone}`);
      push(`${zone} ${name} ${extra}`);
      if (ctx.district) {
        push(`${name} ${ctx.district}`);
        push(`${ctx.district} ${name}`);
      }
    } else if (zone) {
      push(`${ctx.raw} ${zone}`);
      push(`${zone} ${ctx.raw}`);
    }
    return variants.slice(0, 4);
  }

  function hasImplausibleProviderHouse(value) {
    return /[0-9０-９]{5,}號/.test(String(value || ''));
  }


  // GC_MASTER_STABLE_2026_08R10Z9D_PROVIDER_ADMIN_LOCALIZATION
  // ArcGIS structured POI attributes are sometimes returned with English administrative names
  // even when zh-TW labels are requested. Translate only provider-owned admin fields; never alter
  // passenger typing. This lets a real branch keep its street address without inventing a district.
  const PROVIDER_TAICHUNG_DISTRICT_ALIASES = [
    ['中區', /(?:^|\b)(?:Central|Zhong)\s*District(?:$|\b)/i],
    ['東區', /(?:^|\b)(?:East|Dong)\s*District(?:$|\b)/i],
    ['南區', /(?:^|\b)(?:South|Nan)\s*District(?:$|\b)/i],
    ['西區', /(?:^|\b)(?:West|Xi)\s*District(?:$|\b)/i],
    ['北區', /(?:^|\b)(?:North|Bei)\s*District(?:$|\b)/i],
    ['西屯區', /(?:Xitun|Situn)\s*District/i],
    ['南屯區', /(?:Nantun)\s*District/i],
    ['北屯區', /(?:Beitun)\s*District/i],
    ['豐原區', /(?:Fengyuan)\s*District/i],
    ['東勢區', /(?:Dongshi|Tungshih)\s*District/i],
    ['大甲區', /(?:Dajia|Tachia)\s*District/i],
    ['清水區', /(?:Qingshui|Chingshui)\s*District/i],
    ['沙鹿區', /(?:Shalu)\s*District/i],
    ['梧棲區', /(?:Wuqi|Wuchi)\s*District/i],
    ['后里區', /(?:Houli)\s*District/i],
    ['神岡區', /(?:Shengang|Shenkang)\s*District/i],
    ['潭子區', /(?:Tanzi|Tantzu)\s*District/i],
    ['大雅區', /(?:Daya)\s*District/i],
    ['新社區', /(?:Xinshe|Hinshe)\s*District/i],
    ['石岡區', /(?:Shigang|Shihkang)\s*District/i],
    ['外埔區', /(?:Waipu)\s*District/i],
    ['大安區', /(?:Daan|Da'an)\s*District/i],
    ['烏日區', /(?:Wuri|Wujih)\s*District/i],
    ['大肚區', /(?:Dadu)\s*District/i],
    ['龍井區', /(?:Longjing|Lungching)\s*District/i],
    ['霧峰區', /(?:Wufeng)\s*District/i],
    ['太平區', /(?:Taiping)\s*District/i],
    ['大里區', /(?:Dali)\s*District/i],
    ['和平區', /(?:Heping|Ho-Ping)\s*District/i]
  ];

  function canonicalProviderCounty(value) {
    const direct = canonicalTaiwanCounty(value);
    if (direct) return direct;
    const text = String(value || '');
    if (/Taichung/i.test(text)) return '台中市';
    if (/Changhua/i.test(text)) return '彰化縣';
    if (/Nantou/i.test(text)) return '南投縣';
    return '';
  }

  function canonicalProviderTaichungDistrict(value) {
    const text = String(value || '').replace(/臺/g, '台');
    const direct = ADDRESS_TAICHUNG_DISTRICTS.find(name => text.includes(name));
    if (direct) return direct;
    return PROVIDER_TAICHUNG_DISTRICT_ALIASES.find(([, re]) => re.test(text))?.[0] || '';
  }

  // GC_MASTER_STABLE_2026_08R10Z9C_CHAIN_COLLECTION_BRANCH_EXPANSION
  // Chain names such as 7-ELEVEN / FamilyMart are collections, not dispatchable places by themselves.
  // A selectable chain suggestion must resolve to a concrete branch and an actual street-level address.
  function chainBranchQualifier(value, brand) {
    if (!brand) return '';
    let text = normalizeAddress(value).replace(/臺/g, '台');
    text = text.replace(brand.re, ' ');
    ADDRESS_TAIWAN_COUNTIES.forEach(name => { text = text.split(name).join(' '); });
    ADDRESS_TAICHUNG_DISTRICTS.forEach(name => {
      text = text.split(name).join(' ');
      const short = name.replace(/區$/, '');
      if (short.length >= 2) text = text.split(short).join(' ');
    });
    text = text
      .replace(/(?:便利商店|超商|分店|門市|門巿|店舖|店鋪|店)+/gi, ' ')
      .replace(/(?:台灣|Taiwan|TWN)/gi, ' ')
      .replace(/\b\d{3}(?:\d{2,3})?\b/g, ' ')
      .replace(/(?:大道|路|街|道|巷|弄)\s*[0-9０-９]*(?:[-之][0-9０-９]+)?(?:號)?(?:.*)$/g, ' ')
      .replace(/[|｜,，、。．·・_()（）\-—]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text;
  }

  function poiStreetAddress(resolved) {
    if (!resolved) return '';
    const attrs = resolved.attrs && typeof resolved.attrs === 'object' ? resolved.attrs : {};
    const districtRaw = normalizeAddress(attrs.District || attrs.Subregion || attrs.City || resolved.address || '').replace(/臺/g, '台');
    const district = canonicalProviderTaichungDistrict(districtRaw) || districtRaw.match(/([\u3400-\u9fff]{1,7}(?:區|鄉|鎮|市))/)?.[1] || '';
    const admin = `${canonicalProviderCounty(attrs.Region || attrs.City || resolved.address || '') || ''}${district}`;
    const sources = [attrs.Place_addr, attrs.StAddr, attrs.Address, attrs.LongLabel, resolved.address].filter(Boolean);
    let fallback = '';
    for (const raw of sources) {
      let cleaned = canonicalizeSuggestedAddress(raw, attrs);
      if (!cleaned || hasImplausibleProviderHouse(cleaned) || isRomanizedProviderRoad(cleaned)) continue;
      if (!canonicalTaiwanCounty(cleaned) && admin && /(?:大道|路|街|道|巷|弄)/.test(cleaned)) cleaned = smartNormalizeTaiwanAddress(`${admin}${cleaned}`);
      const place = normalizeAddress(resolved.placeName || '');
      if (place) {
        const placeCompact = place.replace(/\s+/g, '');
        const compact = cleaned.replace(/\s+/g, '');
        if (placeCompact && compact.endsWith(placeCompact)) cleaned = compact.slice(0, -placeCompact.length).trim();
      }
      if (hasImplausibleProviderHouse(cleaned) || isRomanizedProviderRoad(cleaned)) continue;
      if (/(?:大道|路|街|道|巷|弄)\s*[0-9０-９]+(?:[-之][0-9０-９]+)?號/.test(cleaned)) return cleaned;
      if (!fallback && /(?:大道|路|街|道|巷|弄)/.test(cleaned)) fallback = cleaned;
    }
    return fallback;
  }

  function isConcreteChainCandidate(resolved, ctx) {
    if (!ctx?.brand || !resolved) return true;
    const street = poiStreetAddress(resolved);
    const qualifier = chainBranchQualifier(resolved.placeName || resolved.shortLabel || '', ctx.brand);
    // Actual branch results should expose a street address. A branch qualifier is useful for ranking,
    // but a generic "7-Eleven | 霧峰區" row is never dispatchable and must be dropped.
    return Boolean(street && /(?:大道|路|街|道|巷|弄)/.test(street) && (/[0-9０-９]+(?:[-之][0-9０-９]+)?號/.test(street) || qualifier.length >= 2));
  }

  function isGenericChainSuggestion(raw, ctx) {
    if (!ctx?.brand || !raw?.text) return false;
    if (raw.isCollection === true) return true;
    const cleaned = canonicalizeSuggestedAddress(raw.text);
    const qualifier = chainBranchQualifier(raw.text, ctx.brand);
    const hasStreet = /(?:大道|路|街|道|巷|弄)\s*[0-9０-９]+(?:[-之][0-9０-９]+)?號/.test(cleaned);
    return !hasStreet && qualifier.length < 2;
  }

  function safePoiDisplayAddress(resolved) {
    if (!resolved) return '';
    const street = poiStreetAddress(resolved);
    let source = street || resolved.address || '';
    if (!source || hasImplausibleProviderHouse(source) || isRomanizedProviderRoad(source)) return '';
    let base = smartNormalizeTaiwanAddress(source);
    if (!base || isClearlyOutsideTaiwanSuggestion(base)) return '';
    return base;
  }

  function poiCandidateScore(resolved, query, sourceRegion = '') {
    if (!resolved) return -99999;
    const ctx = poiContextFromQuery(query);
    const text = safePoiDisplayAddress(resolved);
    const parts = splitTaiwanSuggestionAddress(text || resolved.address);
    const placeKey = addressConfidenceKey(resolved.placeName || '');
    const qKey = addressConfidenceKey(ctx.brand?.canonical || ctx.raw);
    const remainderKey = addressConfidenceKey(ctx.remainder || '');
    const candidateKey = addressConfidenceKey(`${resolved.placeName || ''}${text || resolved.address || ''}`);
    let score = Number(resolved.score || 0) * 4;
    if (resolved.type === 'POI' || resolved.type === 'POIExt' || resolved.type === 'BuildingName') score += 320;
    if (placeKey && qKey && (placeKey.includes(qKey) || qKey.includes(placeKey))) score += 260;
    if (ctx.brand && POI_BRAND_ALIASES.some(item => item.re.test(resolved.placeName || ''))) score += 120;
    // Branch/landmark words (e.g. 一中、林森、霧峰店) must influence ranking, not just the brand name.
    if (remainderKey) {
      if (candidateKey.includes(remainderKey)) score += 620;
      else score -= 120;
    }
    if (ctx.district) {
      if (parts.district === ctx.district) score += 1000;
      else if (parts.district) score -= 900;
    }
    if (ctx.county) {
      if (parts.county === ctx.county) score += 500;
      else if (parts.county) score -= 700;
    } else if (parts.county === '台中市') score += 260;
    if (sourceRegion && parts.county === sourceRegion) score += 120;
    return score;
  }

  async function fetchArcgisPoiCandidates(query, locationBias, controller, searchExtent = '', maxLocations = 12) {
    const params = new URLSearchParams({
      f: 'json',
      SingleLine: query,
      countryCode: 'TWN',
      langCode: 'zh-TW',
      preferredLabelValues: 'localCity',
      outFields: ARCGIS_RESOLVE_OUT_FIELDS,
      maxLocations: String(Math.max(1, Math.min(30, Number(maxLocations || 12)))),
      location: locationBias || ADDRESS_BIAS_LOCATION
    });
    if (searchExtent) params.set('searchExtent', searchExtent);
    const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params.toString()}`, {
      method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', signal: controller?.signal
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data?.candidates) ? data.candidates : [];
  }

  async function fetchArcgisSuggestionCandidates(item, locationBias, controller, searchExtent = '') {
    if (!item?.text || !item?.magicKey) return [];
    const params = new URLSearchParams({
      f: 'json',
      SingleLine: item.text,
      magicKey: item.magicKey,
      countryCode: 'TWN',
      langCode: 'zh-TW',
      preferredLabelValues: 'localCity',
      outFields: ARCGIS_RESOLVE_OUT_FIELDS,
      maxLocations: item.isCollection === true ? '20' : '4',
      location: locationBias || ADDRESS_BIAS_LOCATION
    });
    if (searchExtent) params.set('searchExtent', searchExtent);
    const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params.toString()}`, {
      method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', signal: controller?.signal
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data?.candidates) ? data.candidates : [];
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

  function isExplicitIntersectionQuery(value) {
    const text = smartNormalizeTaiwanAddress(value);
    if (!text || !/(?:交叉路口|交叉口|路口)/.test(text)) return false;
    return /(?:路|街|道|巷|弄).{0,28}(?:跟|與|和|及|×|X|x|&|／|\/).{0,28}(?:路|街|道|巷|弄)/.test(text);
  }

  function isExplicitAlleyMouthQuery(value) {
    const text = smartNormalizeTaiwanAddress(value);
    if (!text) return false;
    return /(?:路|街|道)\s*\d+\s*巷(?:\s*\d+\s*弄)?(?:巷口|弄口|口)$/.test(text) || /(?:巷|弄)(?:口)$/.test(text);
  }

  function geocoderQueryForAddress(value) {
    let text = smartNormalizeTaiwanAddress(value);
    if (!text) return '';
    if (isExplicitIntersectionQuery(text)) {
      text = text
        .replace(/(?:交叉路口|交叉口|路口)/g, '')
        .replace(/\s*(?:跟|與|和|及|×|X|x|&|／|\/)\s*/, ' & ')
        .replace(/\s+/g, ' ')
        .trim();
    } else if (isExplicitAlleyMouthQuery(text)) {
      text = text.replace(/巷口$/,'巷').replace(/弄口$/,'弄').replace(/口$/,'');
    }
    return text;
  }

  async function fetchAddressSuggestions(query) {
    const cacheKey = normalizeAddress(query).replace(/臺/g, '台').toLocaleLowerCase();
    if (addressSuggestionCache.has(cacheKey)) return addressSuggestionCache.get(cacheKey);

    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = setTimeout(() => controller?.abort(), ADDRESS_SUGGEST_TIMEOUT_MS + 1100);
    try {
      const explicitCounty = explicitTaiwanCountyFromQuery(query);
      const poiCtx = poiContextFromQuery(query);
      const geocoderQuery = geocoderQueryForAddress(query) || query;
      const currentLocationBias = attachedLocation &&
        Number.isFinite(attachedLocation.longitude) &&
        Number.isFinite(attachedLocation.latitude) &&
        Number(attachedLocation.accuracy) <= LOCATION_REVIEW_ACCURACY_M
          ? `${attachedLocation.longitude},${attachedLocation.latitude}`
          : ADDRESS_BIAS_LOCATION;

      const seen = new Set();
      const merged = [];
      const addSuggestionResults = (items, sourceRegion = '', lookupLocation = '') => {
        items.forEach((raw, order) => {
          if (!raw?.text || isClearlyOutsideTaiwanSuggestion(raw.text)) return;
          // R10Z9C: chain collection/generic brand rows are navigation terms, not actual pickup locations.
          if (poiCtx.brand && isGenericChainSuggestion(raw, poiCtx)) return;
          const cleaned = canonicalizeSuggestedAddress(raw.text);
          if (!cleaned || !isTaiwanSuggestion(cleaned) || hasImplausibleProviderHouse(cleaned)) return;

          const county = canonicalTaiwanCounty(cleaned);
          if (explicitCounty && county !== explicitCounty) return;
          if (sourceRegion && county && county !== sourceRegion) return;

          const parts = splitTaiwanSuggestionAddress(cleaned);
          const roadLevel = /[路街道巷弄]/.test(cleaned) || /[路街道巷弄]/.test(String(query || ''));
          if (roadLevel && county && !parts.district) return;

          const dedupeKey = cleaned.replace(/\s+/g, '').toLocaleLowerCase();
          if (seen.has(dedupeKey)) return;
          seen.add(dedupeKey);
          merged.push({
            text: cleaned,
            lookupText: raw.text,
            magicKey: raw.magicKey || '',
            lookupLocation,
            sourceRegion,
            isCollection: raw.isCollection === true,
            _order: order,
            _score: taiwanSuggestionScore(cleaned, query, sourceRegion)
          });
        });
      };

      const addPoiCandidates = (candidates, sourceRegion = '', lookupLocation = '') => {
        candidates.forEach((candidate, order) => {
          const resolved = resolvedCandidateFromArcgis(candidate, query);
          if (!resolved) return;
          const precise = new Set(['POI','POIExt','BuildingName','PointAddress','PointAddressInt','StreetAddress','Subaddress']);
          if (!precise.has(resolved.type)) return;
          const streetAddress = poiStreetAddress(resolved);
          const display = streetAddress || safePoiDisplayAddress(resolved);
          if (!display || hasImplausibleProviderHouse(display)) return;
          const parts = splitTaiwanSuggestionAddress(display);
          if (!parts.county || !parts.district) return;
          if (poiCtx.county && parts.county !== poiCtx.county) return;
          if (poiCtx.district && parts.district !== poiCtx.district) return;
          if (poiCtx.brand && !isConcreteChainCandidate(resolved, poiCtx)) return;
          const dedupeKey = addressConfidenceKey(`${resolved.placeName || ''}${streetAddress || display}`);
          if (!dedupeKey || seen.has(dedupeKey)) return;
          seen.add(dedupeKey);
          merged.push({
            text: display,
            lookupText: '',
            magicKey: '',
            lookupLocation,
            sourceRegion,
            resolved,
            placeName: normalizeAddress(resolved.placeName || ''),
            streetAddress,
            kind: 'poi',
            _order: order,
            _score: poiCandidateScore(resolved, query, sourceRegion) + (streetAddress ? 180 : 0)
          });
        });
      };

      const primaryLocation = explicitCounty
        ? ADDRESS_PRIMARY_REGIONS.find(item => item.name === explicitCounty)?.location || currentLocationBias
        : currentLocationBias;
      const primarySourceRegion = explicitCounty || (currentLocationBias === ADDRESS_BIAS_LOCATION ? '台中市' : '');
      const poiExtent = poiCtx.county && poiCtx.county !== '台中市' ? ADDRESS_TAIWAN_MAIN_ISLAND_EXTENT : ADDRESS_TAICHUNG_EXTENT;

      // R10Z9D: chain searches must not serialize suggest -> direct geocode on mobile WebViews.
      // Start concrete POI searches at the same time as /suggest, then use text+magicKey only as
      // a second source. This both lowers latency and follows ArcGIS collection semantics.
      let collectionSuggest = [];
      if (poiCtx.brand) {
        const variants = buildPoiQueryVariants(query);
        const suggestPromise = fetchArcgisSuggest(geocoderQuery, primaryLocation, controller, {
          returnCollections: true, maxSuggestions: 12, searchExtent: poiExtent
        }).catch(() => []);
        const directPromise = Promise.all(variants.slice(0, 4).map(async variant => {
          try { return await fetchArcgisPoiCandidates(variant, primaryLocation, controller, poiExtent, 18); }
          catch (_) { return []; }
        }));
        const [suggestItems, directSets] = await Promise.all([suggestPromise, directPromise]);
        collectionSuggest = Array.isArray(suggestItems) ? suggestItems : [];
        // Keep any already-discrete suggestion rows that carry useful address/branch information.
        addSuggestionResults(collectionSuggest.filter(item => item.isCollection !== true), primarySourceRegion, primaryLocation);
        directSets.forEach(items => addPoiCandidates(items, poiCtx.county || primarySourceRegion, primaryLocation));

        const concreteCount = merged.filter(item => item.kind === 'poi').length;
        if (concreteCount < 6) {
          // Both collection and discrete magicKey suggestions may resolve to a concrete branch.
          // ArcGIS requires the untouched text+magicKey pair and the same location/search extent.
          const magicItems = collectionSuggest.filter(item => item?.magicKey).slice(0, 8);
          const expandedSets = await Promise.all(magicItems.map(async item => {
            try { return await fetchArcgisSuggestionCandidates(item, primaryLocation, controller, poiExtent); }
            catch (_) { return []; }
          }));
          expandedSets.forEach(items => addPoiCandidates(items, poiCtx.county || primarySourceRegion, primaryLocation));
        }
      } else {
        addSuggestionResults(await fetchArcgisSuggest(geocoderQuery, primaryLocation, controller, {
          returnCollections: false, maxSuggestions: 8, searchExtent: ADDRESS_TAIWAN_MAIN_ISLAND_EXTENT
        }).catch(() => []), primarySourceRegion, primaryLocation);

        const centralDistrictCount = merged.filter(item => {
          const parts = splitTaiwanSuggestionAddress(item.text);
          return Boolean(parts.district && ADDRESS_PRIMARY_REGIONS.some(region => region.name === parts.county));
        }).length;
        if (poiCtx.isLikelyPoi && centralDistrictCount < 7) {
          const variants = buildPoiQueryVariants(query);
          const directSets = await Promise.all(variants.slice(0, 2).map(async variant => {
            try { return await fetchArcgisPoiCandidates(variant, primaryLocation, controller, poiExtent, 9); }
            catch (_) { return []; }
          }));
          directSets.forEach(items => addPoiCandidates(items, poiCtx.county || primarySourceRegion, primaryLocation));
        }
      }

      const centralDistrictCount = merged.filter(item => {
        const parts = splitTaiwanSuggestionAddress(item.text);
        return Boolean(parts.district && ADDRESS_PRIMARY_REGIONS.some(region => region.name === parts.county));
      }).length;
      const addressLikeQuery = /[路街道巷弄]|[0-9０-９]/.test(String(query || ''));

      if (!explicitCounty && !poiCtx.district && (centralDistrictCount < 4 || addressLikeQuery) && !poiCtx.brand) {
        const enrichmentRegions = centralDistrictCount < 4
          ? ADDRESS_PRIMARY_REGIONS
          : ADDRESS_PRIMARY_REGIONS.filter(region => region.name === '台中市');
        const enrichedSets = await Promise.all(enrichmentRegions.map(async region => {
          try {
            const items = await fetchArcgisSuggest(`${region.name} ${geocoderQuery}`, region.location, controller, { returnCollections:false, maxSuggestions:8 });
            return { items, region: region.name, location: region.location };
          } catch (_) {
            return { items: [], region: region.name, location: region.location };
          }
        }));
        enrichedSets.forEach(result => addSuggestionResults(result.items, result.region, result.location));
      }

      // GC_MASTER_STABLE_2026_08R10Z9D_CONCRETE_BRANCH_ONLY_GATE
      const suggestions = merged
        // Chain searches only surface concrete resolved POIs with a real street-level branch address.
        // Discrete provider labels without an address may still be expanded via magicKey above, but
        // they are never shown as the final selectable row by themselves.
        .filter(item => !hasImplausibleProviderHouse(item.text) && (!poiCtx.brand || item.kind === 'poi'))
        .sort((a, b) => (b._score - a._score) || (a._order - b._order))
        .slice(0, 8)
        .map(({ text, lookupText, magicKey, lookupLocation, resolved, placeName, streetAddress, kind, isCollection }) => ({ text, lookupText, magicKey, lookupLocation, resolved, placeName, streetAddress, kind, isCollection }));

      return cacheAddressSuggestions(cacheKey, suggestions);
    } catch (_) {
      return cacheAddressSuggestions(cacheKey, []);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // GC_MASTER_STABLE_2026_08R10S_ADDRESS_CONFIDENCE_GATE
  // Large-fleet rule: the text does not need a house number, but the pickup/drop-off must resolve
  // to one dispatchable location. Broad roads/areas are never treated as a finished address.
  function addressConfidenceKey(value) {
    return smartNormalizeTaiwanAddress(value)
      .replace(/[\s,，、。．·・\-—_()（）]/g, '')
      .replace(/臺/g, '台')
      .toLocaleLowerCase();
  }

  // GC_R10Z1_TAIWAN_AVENUE_SAFE
  // Do not strip the leading characters of real roads such as 台灣大道.
  function addressDetailOnly(value) {
    const normalized = smartNormalizeTaiwanAddress(value);
    const parts = splitTaiwanSuggestionAddress(normalized);
    return normalizeAddress(parts.detail || normalized)
      .replace(/(?:附近|這邊|那邊|周邊|一帶)$/g, '')
      .trim();
  }

  // GC_MASTER_STABLE_2026_08R10Z_DISPATCH_ADDRESS_CORE
  // Ground-address completeness is based on the fields a driver actually needs:
  // 縣市 + 行政區 + 路/街/道名 + (段/巷/弄 when present) + 門牌號.
  // 巷/弄 are preserved when present but are NOT mandatory for roads that have direct door numbers.
  // Floor/room data is intentionally excluded from routing/verification.
  function dispatchDoorAddressCore(value) {
    const normalized = smartNormalizeTaiwanAddress(value);
    if (!normalized) return { normalized: '', county: '', district: '', detail: '', road: '', house: '' };
    const parts = splitTaiwanSuggestionAddress(normalized);
    const detail = normalizeAddress(parts.detail || normalized).replace(/\s+/g, '');
    const road = detail.match(/^(.{1,42}?(?:大道|路|街|道)(?:[一二三四五六七八九十百0-9０-９]+段)?)/)?.[1] || '';
    const house = detail.match(/([0-9０-９]+(?:[-之][0-9０-９]+)?)號/)?.[1]?.replace(/-/g, '之') || '';
    return { normalized, county: parts.county || '', district: parts.district || '', detail, road, house };
  }

  function isStructuredDoorAddress(value) {
    const core = dispatchDoorAddressCore(value);
    return Boolean(core.county && core.district && core.road && core.house);
  }

  // GC_MASTER_STABLE_2026_08R10Z9G_FIXED_LANDMARK_FAST_PASS
  // Only explicit, operationally unique aliases are allowed. Never treat generic words such as
  // 「高鐵」「高鐵站」「機場」「清泉崗」alone as a verified pickup point.
  const FIXED_DISPATCH_LANDMARKS = [
    { id: 'thsr-taichung', label: '高鐵台中站', aliases: ['台中高鐵','臺中高鐵','台中高鐵站','臺中高鐵站','高鐵台中','高鐵臺中','高鐵台中站','高鐵臺中站'] },
    { id: 'taichung-airport', label: '臺中國際機場', aliases: ['台中機場','臺中機場','台中國際機場','臺中國際機場','清泉崗機場','台中清泉崗機場','臺中清泉崗機場'] }
  ];
  const FIXED_DISPATCH_LANDMARK_KEYS = new Map(
    FIXED_DISPATCH_LANDMARKS.flatMap(item => item.aliases.map(alias => [
      normalizeAddress(alias).replace(/[\s　,，、。．.・·／/\-]/g, '').toLowerCase(), item
    ]))
  );
  function fixedDispatchLandmark(value) {
    const key = normalizeAddress(value).replace(/[\s　,，、。．.・·／/\-]/g, '').toLowerCase();
    return key ? (FIXED_DISPATCH_LANDMARK_KEYS.get(key) || null) : null;
  }

  function isBroadRoadOnlyAddress(value) {
    const detail = addressDetailOnly(value);
    if (!detail) return true;
    if (/\d+(?:[-之]\d+)?號/.test(detail)) return false;
    if (isExplicitIntersectionQuery(detail) || isExplicitAlleyMouthQuery(detail)) return false;
    // GC_R10Z3_PICKUP_PRECISION_GATE: a generic “XX路口” is still ambiguous unless two roads
    // form an explicit intersection. Bare roads/streets/avenues/lanes are search areas, not pickup points.
    if (/(?:路口|交叉口|巷口|弄口)$/.test(detail)) return true;
    return /^(?:[^,，、]{1,36})(?:路|街|大道|道)(?:[一二三四五六七八九十百]+段)?$/.test(detail)
      || /^(?:[^,，、]{1,36})(?:巷|弄)$/.test(detail);
  }

  function isGenericAreaText(value) {
    const detail = addressDetailOnly(value);
    if (!detail) return true;
    return /(?:附近|這邊|那邊|周邊|一帶)$/.test(normalizeAddress(value))
      || /^(?:[^,，、]{1,20})(?:區|鄉|鎮|里|村)$/.test(detail);
  }

  function isLocallyDispatchReady(value) {
    const normalized = smartNormalizeTaiwanAddress(value);
    if (fixedDispatchLandmark(normalized)) return true;
    if (!normalized || isBroadRoadOnlyAddress(normalized) || isGenericAreaText(normalized)) return false;
    // Local syntax may self-validate only when it is objectively precise. POIs/shops/stations are
    // validated by ArcGIS or by an explicit suggestion selection, not by a broad text-shape guess.
    return isStructuredDoorAddress(normalized) || isExplicitIntersectionQuery(normalized) || isExplicitAlleyMouthQuery(normalized);
  }

  function markAddressVerified(input, source = 'confirmed', resolvedAddress = '') {
    if (!input) return;
    const normalized = smartNormalizeTaiwanAddress(input.value);
    if (!normalized) return;
    input.dataset.gcAddressVerified = '1';
    input.dataset.gcAddressVerifiedKey = addressConfidenceKey(normalized);
    input.dataset.gcAddressVerifiedSource = source;
    const resolved = smartNormalizeTaiwanAddress(resolvedAddress);
    if (resolved) input.dataset.gcResolvedAddress = resolved;
    else delete input.dataset.gcResolvedAddress;
    input.classList.add('gc-address-verified');
    input.classList.remove('gc-address-needs-choice');
  }

  function clearAddressVerified(input) {
    if (!input) return;
    delete input.dataset.gcAddressVerified;
    delete input.dataset.gcAddressVerifiedKey;
    delete input.dataset.gcAddressVerifiedSource;
    delete input.dataset.gcResolvedAddress;
    input.classList.remove('gc-address-verified');
  }

  function isAddressVerified(input) {
    if (!input || input.dataset.gcAddressVerified !== '1') return false;
    const key = addressConfidenceKey(input.value);
    return Boolean(key && key === input.dataset.gcAddressVerifiedKey);
  }

  function exactStructuredSuggestion(query, suggestions) {
    if (!isStructuredDoorAddress(query) || !Array.isArray(suggestions) || !suggestions.length) return null;
    const key = addressConfidenceKey(query);
    const exact = suggestions.filter(item => addressConfidenceKey(canonicalizeSuggestedAddress(item?.text || '')) === key);
    return exact.length === 1 ? exact[0] : null;
  }

  const ADDRESS_RESOLVE_CACHE_LIMIT = 60;
  const addressResolveCache = new Map();
  const typedAddressResolveCache = new Map();
  const ARCGIS_RESOLVE_OUT_FIELDS = 'Addr_type,Match_addr,ShortLabel,LongLabel,MatchID,City,District,Region,Subregion,StName,AddNum,Address,StAddr,PlaceName,Place_addr,Postal,CountryCode';

  function resolvedCandidateFromArcgis(candidate, fallback = '', options = {}) {
    if (!candidate) return null;
    const attrs = candidate.attributes && typeof candidate.attributes === 'object' ? candidate.attributes : {};
    const candidateTypeForScore = String(attrs.Addr_type || '');
    const minimumScore = /^(?:POI|POIExt|BuildingName)$/.test(candidateTypeForScore) ? 65 : 80;
    if (Number(candidate.score || 0) < minimumScore) return null;
    // GC_MASTER_STABLE_2026_08R10Z9C_POI_PLACE_ADDRESS_PRIORITY
    // ArcGIS POI candidate.address / Match_addr may be only the brand name. For POIs, Place_addr is
    // the actual branch street address and must drive dispatchability; passenger-selected fallback still wins when localized.
    const candidateType = String(attrs.Addr_type || '');
    const rawAddress = /^(?:POI|POIExt|BuildingName)$/.test(candidateType)
      ? (attrs.Place_addr || attrs.StAddr || attrs.Address || attrs.Match_addr || candidate.address || attrs.LongLabel || attrs.ShortLabel || fallback)
      : (attrs.Match_addr || candidate.address || attrs.LongLabel || attrs.ShortLabel || fallback);
    const candidateAddress = canonicalizeSuggestedAddress(rawAddress, attrs);
    const fallbackAddress = canonicalizeSuggestedAddress(fallback);
    // GC_R10Z5_EXPLICIT_SUGGESTION_RESOLVED_FALLBACK_LOCK
    // When this candidate came from an explicit suggestion tap, the cleaned suggestion text is
    // the stable localized label the passenger actually chose. Do not let a later ArcGIS candidate
    // response replace it with transliterated fields such as TaiPingRd22-4.
    const preferLocalizedFallback = fallbackAddress && canonicalTaiwanCounty(fallbackAddress) && !isRomanizedProviderRoad(fallbackAddress)
      && (!candidateAddress || isRomanizedProviderRoad(candidateAddress));
    const address = (options.preferFallback === true && fallbackAddress && canonicalTaiwanCounty(fallbackAddress)) || preferLocalizedFallback
      ? fallbackAddress
      : (candidateAddress || fallbackAddress);
    if (!address || isClearlyOutsideTaiwanSuggestion(address)) return null;
    return {
      type: String(attrs.Addr_type || ''),
      score: Number(candidate.score || 0),
      address,
      matchId: String(attrs.MatchID || ''),
      location: candidate.location || null,
      placeName: String(attrs.PlaceName || ''),
      shortLabel: String(attrs.ShortLabel || ''),
      longLabel: String(attrs.LongLabel || ''),
      attrs
    };
  }

  function currentAddressLocationBias(query = '') {
    const explicitCounty = explicitTaiwanCountyFromQuery(query);
    if (explicitCounty) {
      const regional = ADDRESS_PRIMARY_REGIONS.find(item => item.name === explicitCounty)?.location;
      if (regional) return regional;
    }
    if (attachedLocation && Number.isFinite(attachedLocation.longitude) && Number.isFinite(attachedLocation.latitude) && Number(attachedLocation.accuracy) <= LOCATION_REVIEW_ACCURACY_M) {
      return `${attachedLocation.longitude},${attachedLocation.latitude}`;
    }
    return ADDRESS_BIAS_LOCATION;
  }

  async function resolveAddressSuggestion(item) {
    if (!item?.text) return null;
    if (item.resolved && item.resolved.address) return item.resolved;
    const cacheKey = item.magicKey || `text:${addressConfidenceKey(item.lookupText || item.text)}`;
    if (cacheKey && addressResolveCache.has(cacheKey)) return addressResolveCache.get(cacheKey);
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = setTimeout(() => controller?.abort(), ADDRESS_SUGGEST_TIMEOUT_MS);
    try {
      const params = new URLSearchParams({
        f: 'json',
        // ArcGIS requires the untouched suggest text together with its magicKey.
        SingleLine: item.lookupText || item.text,
        countryCode: 'TWN',
        langCode: 'zh-TW',
        preferredLabelValues: 'localCity',
        outFields: ARCGIS_RESOLVE_OUT_FIELDS,
        maxLocations: '1',
        searchExtent: ADDRESS_TAIWAN_MAIN_ISLAND_EXTENT
      });
      if (item.magicKey) params.set('magicKey', item.magicKey);
      // Keep the suggest context intact as well: ArcGIS recommends reusing the same location/search extent.
      params.set('location', item.lookupLocation || currentAddressLocationBias(item.lookupText || item.text));
      const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params.toString()}`, {
        method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', signal: controller?.signal
      });
      if (!response.ok) return null;
      const data = await response.json();
      const candidate = Array.isArray(data?.candidates) ? data.candidates[0] : null;
      const resolved = resolvedCandidateFromArcgis(candidate, item.text, { preferFallback: true });
      if (!resolved) return null;
      if (addressResolveCache.size >= ADDRESS_RESOLVE_CACHE_LIMIT) {
        const firstKey = addressResolveCache.keys().next().value;
        if (firstKey) addressResolveCache.delete(firstKey);
      }
      if (cacheKey) addressResolveCache.set(cacheKey, resolved);
      return resolved;
    } catch (_) {
      return null;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async function resolveTypedAddress(query) {
    const normalized = smartNormalizeTaiwanAddress(query);
    const cacheKey = `typed:${addressConfidenceKey(normalized)}`;
    if (!normalized) return [];
    if (typedAddressResolveCache.has(cacheKey)) return typedAddressResolveCache.get(cacheKey);
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = setTimeout(() => controller?.abort(), ADDRESS_SUGGEST_TIMEOUT_MS + 900);
    try {
      const ctx = poiContextFromQuery(normalized);
      const queries = ctx.isLikelyPoi ? buildPoiQueryVariants(normalized).slice(0, 3) : [geocoderQueryForAddress(normalized) || normalized];
      const location = currentAddressLocationBias(normalized);
      const extent = ctx.isLikelyPoi && (!ctx.county || ctx.county === '台中市') ? ADDRESS_TAICHUNG_EXTENT : ADDRESS_TAIWAN_MAIN_ISLAND_EXTENT;
      const responses = await Promise.all(queries.map(async q => {
        const params = new URLSearchParams({
          f: 'json', SingleLine: q, countryCode: 'TWN', langCode: 'zh-TW', preferredLabelValues: 'localCity',
          outFields: ARCGIS_RESOLVE_OUT_FIELDS, maxLocations: ctx.isLikelyPoi ? '6' : '3', location
        });
        if (extent) params.set('searchExtent', extent);
        try {
          const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params.toString()}`, {
            method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', signal: controller?.signal
          });
          if (!response.ok) return [];
          const data = await response.json();
          return Array.isArray(data?.candidates) ? data.candidates : [];
        } catch (_) { return []; }
      }));
      const seen = new Set();
      const resolved = responses.flat()
        .map(candidate => resolvedCandidateFromArcgis(candidate, normalized))
        .filter(Boolean)
        .filter(item => {
          if (hasImplausibleProviderHouse(item.address)) return false;
          const key = `${addressConfidenceKey(item.address)}|${addressConfidenceKey(item.placeName || '')}`;
          if (seen.has(key)) return false;
          seen.add(key); return true;
        })
        .sort((a, b) => poiCandidateScore(b, normalized) - poiCandidateScore(a, normalized));
      if (typedAddressResolveCache.size >= ADDRESS_RESOLVE_CACHE_LIMIT) {
        const firstKey = typedAddressResolveCache.keys().next().value;
        if (firstKey) typedAddressResolveCache.delete(firstKey);
      }
      typedAddressResolveCache.set(cacheKey, resolved);
      return resolved;
    } catch (_) {
      return [];
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function houseNumberToken(value) {
    return smartNormalizeTaiwanAddress(value).match(/([0-9０-９]+(?:[-之][0-9０-９]+)?)號/)?.[1]?.replace(/-/g, '之') || '';
  }

  function normalizedLabelKey(value) {
    return addressConfidenceKey(value).replace(/火車/g, '');
  }

  // GC_R10Z4_AMBIGUOUS_DOOR_REQUIRES_ADMIN
  // A street + door number without county/district is still ambiguous (e.g. 公園路188號 can
  // exist in multiple districts). Strict pickup/fare fields must require a suggestion selection
  // or explicit county+district instead of silently choosing the proximity-biased top result.
  function isDoorAddressMissingAdmin(value) {
    const core = dispatchDoorAddressCore(value);
    return Boolean(core.road && core.house && (!core.county || !core.district));
  }

  function chooseConfidentTypedResolution(query, candidates) {
    if (!Array.isArray(candidates) || !candidates.length) return null;
    const normalized = smartNormalizeTaiwanAddress(query);
    if (!normalized || isBroadRoadOnlyAddress(normalized) || isGenericAreaText(normalized) || isDoorAddressMissingAdmin(normalized)) return null;
    const top = candidates[0];
    const second = candidates[1] || null;
    if (!top || top.score < 88) return null;
    const preciseTypes = new Set(['PointAddress','PointAddressInt','StreetAddress','Subaddress','POI','POIExt','BuildingName','DistanceMarker','StreetMidBlock','StreetBetween','StreetInt']);
    if (!preciseTypes.has(top.type)) return null;
    if (top.type === 'StreetInt' && !isExplicitIntersectionQuery(normalized)) return null;

    const queryKey = normalizedLabelKey(normalized);
    const addressKey = normalizedLabelKey(top.address);
    const detailKey = normalizedLabelKey(addressDetailOnly(top.address));
    const labelKeys = [top.placeName, top.shortLabel, top.longLabel].map(normalizedLabelKey).filter(Boolean);
    const queryHouse = houseNumberToken(normalized);
    const candidateHouse = houseNumberToken(top.address);
    const doorLike = /(?:路|街|道|巷|弄).{0,40}[0-9０-９]+(?:[-之][0-9０-９]+)?號/.test(normalized);

    if (doorLike) {
      if (queryHouse && candidateHouse && queryHouse !== candidateHouse) return null;
      const textualMatch = Boolean(queryKey && (addressKey.includes(queryKey) || detailKey.includes(queryKey) || queryKey.includes(detailKey)));
      if (textualMatch && top.score >= 88) return top;
      // Full door numbers are accepted when the geocoder is very confident and the house number agrees.
      if (queryHouse && candidateHouse === queryHouse && top.score >= 95) return top;
      return null;
    }

    if (isExplicitIntersectionQuery(normalized) || isExplicitAlleyMouthQuery(normalized)) {
      return top.score >= 93 ? top : null;
    }

    const labelMatch = labelKeys.some(key => key.length >= 3 && (key.includes(queryKey) || queryKey.includes(key)))
      || (queryKey.length >= 4 && (addressKey.includes(queryKey) || detailKey.includes(queryKey)));
    if (labelMatch && top.score >= 90) return top;
    const scoreGap = second ? top.score - second.score : 100;
    if (queryKey.length >= 4 && top.score >= 95 && scoreGap >= 5) return top;
    if (!second && queryKey.length >= 4 && top.score >= 93) return top;
    return null;
  }

  function isResolvedCandidateDispatchReady(query, resolved, options = {}) {
    if (!resolved || resolved.score < 80 || !resolved.address) return false;
    const type = resolved.type;
    const fromSelection = options.fromSelection === true;
    if (isBroadRoadOnlyAddress(query) || isGenericAreaText(query)) return false;
    if (type === 'StreetName' || type === 'Locality' || type === 'District' || type === 'Region' || type === 'Postal') {
      return Boolean(isExplicitAlleyMouthQuery(query) && type === 'StreetName' && resolved.score >= 90);
    }
    if (type === 'StreetInt') return isExplicitIntersectionQuery(query) || fromSelection;
    const preciseTypes = new Set(['PointAddress','PointAddressInt','StreetAddress','Subaddress','POI','POIExt','BuildingName','DistanceMarker','StreetMidBlock','StreetBetween']);
    if (!preciseTypes.has(type)) return false;
    if (fromSelection) return true;
    if (isStructuredDoorAddress(query) || isExplicitIntersectionQuery(query) || isExplicitAlleyMouthQuery(query)) return true;
    const detail = addressDetailOnly(query);
    // Manual POI/place text may auto-confirm only when it is specific enough and ArcGIS returns one unique precise result.
    return detail.replace(/\s/g,'').length >= 4 && !isGenericAreaText(detail);
  }

  function resolvedAddressForInput(query, resolved, fallback = '') {
    const normalizedQuery = smartNormalizeTaiwanAddress(query);
    const base = resolved?.address || canonicalizeSuggestedAddress(fallback) || normalizedQuery;
    if (!resolved || (!isExplicitIntersectionQuery(normalizedQuery) && !isExplicitAlleyMouthQuery(normalizedQuery))) return base;
    const parts = splitTaiwanSuggestionAddress(base);
    const admin = `${parts.county || ''}${parts.district || ''}`;
    let detail = addressDetailOnly(normalizedQuery);
    if (isExplicitIntersectionQuery(normalizedQuery)) {
      detail = detail.replace(/(?:跟|與|和|及|×|X|x|&|／|\/)/, '與');
      if (!/(?:交叉口|交叉路口|路口)$/.test(detail)) detail += '交叉口';
    }
    return smartNormalizeTaiwanAddress(`${admin}${detail}`) || base;
  }

  async function uniqueDispatchSuggestion(query, suggestions, options = {}) {
    if (!Array.isArray(suggestions) || suggestions.length !== 1) return null;
    const resolved = await resolveAddressSuggestion(suggestions[0]);
    return isResolvedCandidateDispatchReady(query, resolved, options) ? { item: suggestions[0], resolved } : null;
  }

  function isRelaxedRideDestination(id) {
    if (id !== 'destination') return false;
    const activeMode = new URLSearchParams(location.search).get('mode');
    return activeMode === 'call' || activeMode === 'driver';
  }

  function addressValidationMessage(query, suggestions = []) {
    const normalized = smartNormalizeTaiwanAddress(query);
    const poiCtx = poiContextFromQuery(normalized);
    if (poiCtx.isBroadChain) return suggestions.length ? '請從智慧建議選擇正確分店。' : '請加上區域或分店名稱，再選擇正確分店。';
    if (poiCtx.isLikelyPoi && suggestions.length) return '請從智慧建議選擇正確店家／地標。';
    if (isDoorAddressMissingAdmin(normalized)) {
      return '此門牌在不同區域可能重複，請補上縣市／區域或從建議中選擇正確地點。';
    }
    if (isBroadRoadOnlyAddress(normalized)) {
      const detail = addressDetailOnly(normalized) || '此道路';
      return `「${detail}」範圍較大，請補充門牌、路口、巷口或附近明確地標。`;
    }
    if (isExplicitIntersectionQuery(normalized) || isExplicitAlleyMouthQuery(normalized)) {
      return '目前無法確認這個路口／巷口，請從建議中選擇或補充附近明確地標。';
    }
    if (/(?:路|街|道|巷|弄).{0,40}[0-9０-９]+(?:[-之][0-9０-９]+)?號/.test(normalized)) {
      return suggestions.length
        ? '找到相近門牌，請點選最符合的一筆。'
        : '暫時無法定位此門牌，請確認縣市／行政區／路名／門牌號是否完整。';
    }
    if (suggestions.length) return '請從建議地址中選擇明確地點。';
    return '地點還不夠明確，請補充門牌、路口、巷口或附近明確地標。';
  }

  function showAddressChoiceSuggestions(id, suggestions) {
    const input = document.getElementById(id);
    const box = document.getElementById(`${id}Suggest`);
    if (!input || !box || !Array.isArray(suggestions) || !suggestions.length) return;
    box.innerHTML = suggestions.map((item, index) => renderAddressSuggestion(item, index)).join('');
    box._gcSuggestions = suggestions;
    box.classList.remove('hidden');
  }

  async function verifyAddressField(id, options = {}) {
    const input = document.getElementById(id);
    if (!input) return Boolean(options.allowEmpty);
    const normalized = normalizeAddressInput(id);
    if (!normalized) return Boolean(options.allowEmpty);

    // R10U: pickup/driver-location stays strict; ride/driver drop-off can remain a broad
    // human-readable destination. Fare keeps strict verification on both ends for Google Maps.
    if (options.policy === 'relaxed') {
      hideAddressSuggestions(id);
      clearFieldValidation(id);
      return true;
    }

    if (isAddressVerified(input)) return true;

    const fixedLandmark = fixedDispatchLandmark(normalized);
    if (fixedLandmark) {
      markAddressVerified(input, `fixed-landmark:${fixedLandmark.id}`, fixedLandmark.label);
      hideAddressSuggestions(id);
      clearFieldValidation(id);
      return true;
    }

    // GC_MASTER_STABLE_2026_08R10Z1_MANUAL_COMPLETE_FIRST
    // A complete Taiwan ground address is accepted LOCALLY before any network call.
    // Contract: county/city + district/township + road/street/avenue + door number.
    // Section/alley/lane are preserved when present; floor/room is excluded only from the
    // private routing copy. Autocomplete/geocoding remains assistance and can never block
    // a passenger who already typed a complete ground address.
    if (isStructuredDoorAddress(normalized)) {
      markAddressVerified(input, 'structured-manual', normalized);
      hideAddressSuggestions(id);
      clearFieldValidation(id);
      return true;
    }

    // GC_R10Z4_AMBIGUOUS_DOOR_SELECTION_GATE
    // A road+door without county/district is not allowed to auto-pick a nearby district.
    // Fetch suggestions and let the passenger choose the correct administrative area.
    if (!isRelaxedRideDestination(id) && isDoorAddressMissingAdmin(normalized)) {
      const suggestions = await fetchAddressSuggestions(normalized);
      clearAddressVerified(input);
      input.classList.add('gc-address-needs-choice');
      if (options.showError !== false) {
        showFieldError(id, suggestions.length ? '此門牌在不同區域可能重複，請從建議地址選擇正確縣市／區域。' : '請補上縣市與區域，或從建議地址選擇正確地點。');
        if (suggestions.length) showAddressChoiceSuggestions(id, suggestions);
        else hideAddressSuggestions(id);
      }
      return false;
    }

    // GC_MASTER_STABLE_2026_08R10Z9_CHAIN_BRANCH_SELECTION_GATE
    // A brand-only chain query (7-11 / 全家 / 萊爾富 / OK / etc.) represents many real places.
    // Never auto-pick one branch. Offer concrete district-labelled candidates and require one tap.
    const poiCtx = poiContextFromQuery(normalized);
    if (!isRelaxedRideDestination(id) && poiCtx.isBroadChain) {
      const suggestions = await fetchAddressSuggestions(normalized);
      clearAddressVerified(input);
      input.classList.add('gc-address-needs-choice');
      if (options.showError !== false) {
        showFieldError(id, suggestions.length ? '請從智慧建議選擇正確分店。' : '請加上區域或分店名稱，例如「霧峰 7-11」，再選擇正確分店。');
        if (suggestions.length) showAddressChoiceSuggestions(id, suggestions);
        else hideAddressSuggestions(id);
      }
      return false;
    }

    // GC_MASTER_STABLE_2026_08R10Y_TYPED_ADDRESS_FALLBACK
    // Incomplete addresses / POIs may still be resolved by the provider without forcing a tap.
    // Passenger-visible text remains authoritative; only hidden route metadata may be canonicalized.
    const typedCandidates = await resolveTypedAddress(normalized);
    const typedResolved = chooseConfidentTypedResolution(normalized, typedCandidates);
    if (typedResolved && isResolvedCandidateDispatchReady(normalized, typedResolved, { fromSelection: false })) {
      markAddressVerified(input, 'typed-geocode', resolvedAddressForInput(normalized, typedResolved, typedResolved.address));
      hideAddressSuggestions(id);
      clearFieldValidation(id);
      return true;
    }

    const suggestions = await fetchAddressSuggestions(normalized);
    const exact = exactStructuredSuggestion(normalized, suggestions);
    if (exact) {
      const selected = canonicalizeSuggestedAddress(exact.text);
      markAddressVerified(input, 'auto-exact', selected);
      hideAddressSuggestions(id);
      clearFieldValidation(id);
      return true;
    }

    const unique = await uniqueDispatchSuggestion(normalized, suggestions);
    if (unique) {
      const resolvedAddress = resolvedAddressForInput(normalized, unique.resolved, unique.item.text);
      markAddressVerified(input, 'auto-resolved', resolvedAddress);
      hideAddressSuggestions(id);
      clearFieldValidation(id);
      return true;
    }

    // If the network/geocoder is temporarily unavailable, only a strict full door address may fail open.
    // Intersections, alley mouths, roads and place names still require a real resolved location.
    if (!suggestions.length && isStructuredDoorAddress(normalized)) {
      markAddressVerified(input, 'structured-fallback');
      hideAddressSuggestions(id);
      clearFieldValidation(id);
      return true;
    }

    clearAddressVerified(input);
    input.classList.add('gc-address-needs-choice');
    if (options.showError !== false) {
      showFieldError(id, options.message || addressValidationMessage(normalized, suggestions));
      if (suggestions.length) showAddressChoiceSuggestions(id, suggestions);
      else hideAddressSuggestions(id);
    }
    return false;
  }

  window.GC_verifyAddressField = verifyAddressField;
  window.GC_markAddressVerified = (id, source = 'external') => {
    const input = typeof id === 'string' ? document.getElementById(id) : id;
    markAddressVerified(input, source);
  };

  let gcAddressServiceWarmed = false;
  function warmAddressService() {
    if (gcAddressServiceWarmed) return;
    gcAddressServiceWarmed = true;
    // GC_MASTER_STABLE_2026_08R10P_ADDRESS_SERVICE_WARMUP
    // Do not spend a connection during startup; warm it only when an address field is actually used.
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://geocode.arcgis.com';
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);
    const dns = document.createElement('link');
    dns.rel = 'dns-prefetch';
    dns.href = '//geocode.arcgis.com';
    document.head.appendChild(dns);
  }

  function bindSmartAddressInputs() {
    ['pickup', 'destination'].forEach(id => {
      const input = document.getElementById(id);
      const box = document.getElementById(`${id}Suggest`);
      if (!input || !box || input.dataset.gcSmartAddressBound === '1') return;
      input.dataset.gcSmartAddressBound = '1';
      input.addEventListener('focus', warmAddressService, { passive: true });
      input.addEventListener('pointerdown', warmAddressService, { passive: true });
      let timer = 0;
      let localToken = 0;

      // GC_MASTER_STABLE_2026_08R10N_PROGRAMMATIC_ADDRESS_SUGGEST_GUARD
      // Recent/favorite/location fills are already confirmed choices. They must invalidate any
      // pending async lookup and must never reopen the smart-suggestion card. Manual edits still do.
      const cancelSmartSuggestionSession = () => {
        clearTimeout(timer);
        localToken = ++addressSuggestRequestToken;
        hideAddressSuggestions(id);
      };
      input._gcCancelSmartSuggestions = cancelSmartSuggestionSession;

      input.addEventListener('input', () => {
        clearTimeout(timer);
        if (input.dataset.gcSkipSuggestOnce === '1') {
          delete input.dataset.gcSkipSuggestOnce;
          cancelSmartSuggestionSession();
          return;
        }
        clearAddressVerified(input);
        input.classList.remove('gc-address-needs-choice');
        const query = normalizeAddress(input.value);
        if (query.length < 2 || query === LOCATION_MARKER) {
          hideAddressSuggestions(id);
          return;
        }

        // R10Z9G: exact Taichung HSR / Taichung Airport aliases are already dispatch-unique.
        // Verify immediately and skip ArcGIS entirely so daily orders are never blocked by network/POI availability.
        const fixedLandmark = fixedDispatchLandmark(query);
        if (fixedLandmark) {
          markAddressVerified(input, `fixed-landmark:${fixedLandmark.id}`, fixedLandmark.label);
          clearFieldValidation(id);
          hideAddressSuggestions(id);
          return;
        }

        // GC_R10Z3_R10Q_AUTOCOMPLETE_RESTORED
        // Do not use address-completeness as an autocomplete gate. While the passenger is typing,
        // suggestions remain available exactly as assistance. Validation happens only on action/submit.
        const token = ++addressSuggestRequestToken;
        localToken = token;
        timer = setTimeout(async () => {
          const suggestions = await fetchAddressSuggestions(query);
          if (localToken !== token || normalizeAddress(input.value) !== query) return;

          // Exact/unique results may pre-verify a hidden route copy, but they must not close the
          // suggestion UI or rewrite the passenger's text. The passenger can still choose a candidate.
          const exact = exactStructuredSuggestion(query, suggestions);
          if (exact) {
            const selected = canonicalizeSuggestedAddress(exact.text);
            if (selected) markAddressVerified(input, 'auto-exact', selected);
            clearFieldValidation(id);
          }

          // Keep the R10Q typing path fast: do not perform a second candidate-resolution request
          // before showing the list. Resolve only after an explicit tap or when the user submits.
          if (!suggestions.length) { hideAddressSuggestions(id); return; }
          if (document.activeElement !== input) { hideAddressSuggestions(id); return; }
          box.innerHTML = suggestions.map((item, index) => renderAddressSuggestion(item, index)).join('');
          box._gcSuggestions = suggestions;
          box.classList.remove('hidden');
        }, ADDRESS_SUGGEST_DEBOUNCE_MS);
      });

      input.addEventListener('blur', () => {
        // GC_R10Z3_BLUR_FORMAT_ONLY: restore R10Q's safe tidy-up after typing is finished.
        // This is format sanitation only (postal prefix / comma / whitespace / floor), not geocoder replacement.
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
        const initialSelected = canonicalizeSuggestedAddress(item.text);
        if (!initialSelected) return;

        const resolved = await resolveAddressSuggestion(item);
        // GC_R10Z5_EXPLICIT_SUGGESTION_VISIBLE_SOURCE_LOCK
        // The passenger tapped the rendered suggestion. That cleaned suggestion label is therefore
        // the visible source of truth. ArcGIS candidate resolution may validate/route it in the
        // background, but must never rewrite the field to transliterated provider output.
        const selected = smartNormalizeTaiwanAddress(initialSelected);
        const broad = isBroadRoadOnlyAddress(selected) || isGenericAreaText(selected);
        const relaxedDestination = isRelaxedRideDestination(id);
        const ready = relaxedDestination || (resolved
          ? isResolvedCandidateDispatchReady(selected, resolved, { fromSelection: true })
          : (!broad && isLocallyDispatchReady(selected)));

        // R10Y explicit-selection rule: only an explicit passenger tap may replace visible text.
        // The replacement is the cleaned canonical candidate; raw provider formatting never becomes UI text.
        const resolvedAddress = resolvedAddressForInput(selected, resolved, selected) || selected;
        input.value = selected;
        input.dataset.gcSkipSuggestOnce = '1';
        input._gcCancelSmartSuggestions?.();
        if (!ready) {
          clearAddressVerified(input);
          input.classList.add('gc-address-needs-choice');
          hideAddressSuggestions(id);
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
          // General input handlers clear stale errors; show the guidance after those handlers run.
          showFieldError(id, addressValidationMessage(input.value, []));
          return;
        }

        markAddressVerified(input, relaxedDestination ? 'suggestion-relaxed-destination' : 'suggestion', resolvedAddress);
        input.classList.remove('invalid', 'gc-address-needs-choice');
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
        const address = smartNormalizeTaiwanAddress(item);
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
      const address = smartNormalizeTaiwanAddress(item);
      if (!address) continue;
      if (!next.some(existing => existing.toLocaleLowerCase() === address.toLocaleLowerCase())) {
        next.push(address);
      }
      if (next.length >= RECENT_LIMIT) break;
    }
    saveRecentAddresses(next);
    refreshRecentAddressControls();
  }

  // R10J: keep the normalized recent-address writer exposed for compatibility; fare mode itself does not read/write recents.
  window.GC_rememberRecentAddresses = rememberRecentAddresses;
  // GC_R10K_EXTERNAL_ADDRESS_SANITIZER: every external map handoff uses the exact same clean Taiwan address rule as LINE dispatch.
  window.GC_cleanAddressForExternalUse = smartNormalizeTaiwanAddress;

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
    const pickup = smartNormalizeTaiwanAddress(item.pickup);
    const destination = smartNormalizeTaiwanAddress(item.destination);
    const name = String(item.name || '').trim().slice(0, 30);
    if (!pickup || !destination || pickup === LOCATION_MARKER) return null;
    return { name: name || '常用行程', pickup, destination };
  }

  function loadFavoriteTrips() {
    try {
      const parsed = JSON.parse(localStorage.getItem(FAVORITE_STORAGE_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      const trips = [];
      const seenRoutes = new Set();
      for (const item of parsed) {
        const trip = normalizeFavoriteTrip(item);
        if (!trip) continue;
        const routeKey = `${addressConfidenceKey(trip.pickup)}→${addressConfidenceKey(trip.destination)}`;
        if (!routeKey || seenRoutes.has(routeKey)) continue;
        seenRoutes.add(routeKey);
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
        <summary>${escapeHtml(COMMON['常用行程標題'] || '常用行程')}</summary>
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

  function nextFavoriteDefaultName(trips = loadFavoriteTrips()) {
    const used = new Set((Array.isArray(trips) ? trips : []).map(trip => String(trip?.name || '').trim()));
    for (let index = 1; index <= FAVORITE_LIMIT; index += 1) {
      const candidate = `常用行程 ${index}`;
      if (!used.has(candidate)) return candidate;
    }
    return `常用行程 ${Math.min(FAVORITE_LIMIT, (Array.isArray(trips) ? trips.length : 0) + 1)}`;
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
      ? (COMMON['常用行程已滿按鈕'] || '已達 5 組上限')
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

  async function openFavoriteSaveModal() {
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
    const pickupReady = await verifyAddressField('pickup', { showError: true });
    const destinationReady = pickupReady ? await verifyAddressField('destination', { showError: true }) : false;
    if (!pickupReady || !destinationReady) {
      setFavoriteStatus(COMMON['常用行程需地址'] || '請先填寫完整上下車地址。', 'error');
      document.querySelector('#gcFavoriteSheet .gc-sheet-close')?.click();
      focusFirstValidationError();
      return;
    }
    const trips = loadFavoriteTrips();
    const routeKey = `${addressConfidenceKey(pickup)}→${addressConfidenceKey(destination)}`;
    if (trips.some(trip => `${addressConfidenceKey(trip.pickup)}→${addressConfidenceKey(trip.destination)}` === routeKey)) {
      setFavoriteStatus(COMMON['常用行程重複'] || '此行程已儲存於常用行程。', 'error');
      return;
    }
    if (trips.length >= FAVORITE_LIMIT) {
      setFavoriteStatus(COMMON['常用行程已滿'] || '最多可儲存 5 組，請先刪除一組。', 'error');
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
    input.value = nextFavoriteDefaultName(trips);
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
      const name = String(input?.value || '').trim() || nextFavoriteDefaultName();
      if (!pickup || !destination) return;
      const trips = loadFavoriteTrips();
      const routeKey = `${addressConfidenceKey(pickup)}→${addressConfidenceKey(destination)}`;
      if (trips.some(trip => `${addressConfidenceKey(trip.pickup)}→${addressConfidenceKey(trip.destination)}` === routeKey)) {
        closeFavoriteSaveModal();
        refreshFavoriteTrips();
        setFavoriteStatus(COMMON['常用行程重複'] || '此行程已儲存於常用行程。', 'error');
        return;
      }
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
        if (pickupInput) {
          pickupInput._gcCancelSmartSuggestions?.();
          pickupInput.dataset.gcSkipSuggestOnce = '1';
          pickupInput.value = trip.pickup;
          if (isLocallyDispatchReady(trip.pickup)) markAddressVerified(pickupInput, 'favorite');
          else clearAddressVerified(pickupInput);
        }
        if (destinationInput) {
          destinationInput._gcCancelSmartSuggestions?.();
          destinationInput.dataset.gcSkipSuggestOnce = '1';
          destinationInput.value = trip.destination;
          if (isLocallyDispatchReady(trip.destination)) markAddressVerified(destinationInput, 'favorite');
          else clearAddressVerified(destinationInput);
        }
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
    // GC_MASTER_STABLE_2026_08R10O_LOCATION_CONFIRMATION_COPY
    const locationAddressLabel = mode === 'driver' ? '代駕地址' : '上車地址';

    pickupInput.addEventListener('input', () => {
      if (!attachedLocation || attachedLocation.settingInput) return;
      const current = normalizeAddress(pickupInput.value);
      if (!current || current === LOCATION_MARKER) {
        attachedLocation.confirmed = false;
        return;
      }
      const generatedAddress = normalizeAddress(attachedLocation.generatedAddress || '');
      if (!generatedAddress || current !== generatedAddress) {
        attachedLocation.address = String(pickupInput.value || '').trim();
        attachedLocation.manualAddress = attachedLocation.address;
        attachedLocation.confirmed = false;
        attachedLocation.requiresConfirmation = false;
        const keepMap = generatedAddress && manualAddressLikelyMatchesGenerated(current, generatedAddress) && attachedLocation.accuracy <= LOCATION_REVIEW_ACCURACY_M;
        attachedLocation.sendMap = Boolean(keepMap);
        setLocationReview('', false);
        setLocationStatus(keepMap
          ? '已修正文字地址，定位仍會一併附上。'
          : `已改用你輸入的文字${locationAddressLabel}，避免舊定位與地址不一致。`, 'success');
      }
    });

    confirmButton?.addEventListener('click', () => {
      if (!attachedLocation || !normalizeAddress(pickupInput.value)) return;
      attachedLocation.confirmed = true;
      attachedLocation.requiresConfirmation = false;
      attachedLocation.address = String(pickupInput.value || '').trim();
      markAddressVerified(pickupInput, 'location-confirmed');
      setLocationReview('', false);
      setLocationStatus('地址已確認，定位會一併附上。', 'success');
    });

    button.addEventListener('click', async () => {
      if (!navigator.geolocation) {
        setLocationStatus(COMMON['定位不支援'] || '此裝置不支援定位，請直接輸入地址。', 'error');
        return;
      }
      const requestToken = ++locationRequestToken;
      const previousPickup = String(pickupInput.value || '').trim();
      const previousPickupVerified = isAddressVerified(pickupInput);
      pickupInput._gcCancelSmartSuggestions?.();
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
            attachedLocation.confirmed = previousPickupVerified;
            if (previousPickupVerified) markAddressVerified(pickupInput, 'restored');
            else clearAddressVerified(pickupInput);
          }
          setLocationStatus(previousPickup
            ? `定位訊號較弱${finiteAccuracy ? `（約 ±${Math.round(finiteAccuracy)}m）` : ''}，已保留原本輸入的地址；為避免跑錯地點，本次不附上不精準定位。`
            : `定位訊號較弱${finiteAccuracy ? `（約 ±${Math.round(finiteAccuracy)}m）` : ''}，請再按一次重新取得；若仍無法辨識，再手動輸入${locationAddressLabel}。`, 'error');
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
            attachedLocation.confirmed = previousPickupVerified;
            if (previousPickupVerified) markAddressVerified(pickupInput, 'restored');
            else clearAddressVerified(pickupInput);
            attachedLocation.sendMap = false;
            setLocationStatus('定位已取得但無法確認門牌，已保留你原本輸入的地址；為避免地址與定位不一致，本次不附上定位。', 'success');
          } else {
            // GC_MASTER_STABLE_2026_08R10S_PRECISE_PIN_FALLBACK
            // R10S: a precise GPS pin is itself a dispatchable pickup point even when no formal
            // street number exists. Keep the map pin, show a neutral label, and require one-tap
            // rider confirmation instead of forcing a fake door number.
            attachedLocation.address = LOCATION_PIN_ONLY_LABEL;
            attachedLocation.generatedAddress = LOCATION_PIN_ONLY_LABEL;
            attachedLocation.settingInput = true;
            pickupInput._gcCancelSmartSuggestions?.();
            pickupInput.dataset.gcSkipSuggestOnce = '1';
            pickupInput.value = LOCATION_PIN_ONLY_LABEL;
            markAddressVerified(pickupInput, 'location-pin-only');
            pickupInput.dispatchEvent(new Event('input', { bubbles: true }));
            pickupInput.dispatchEvent(new Event('change', { bubbles: true }));
            attachedLocation.settingInput = false;
            attachedLocation.requiresConfirmation = true;
            setLocationStatus('', 'success');
            setLocationReview('已取得精準定位；此位置沒有明確門牌，請確認定位點是否正確。', true);
          }
          return;
        }

        attachedLocation.address = address;
        attachedLocation.generatedAddress = address;
        attachedLocation.settingInput = true;
        pickupInput._gcCancelSmartSuggestions?.();
        pickupInput.dataset.gcSkipSuggestOnce = '1';
        pickupInput.value = address;
        markAddressVerified(pickupInput, 'location-geocode');
        pickupInput.classList.remove('invalid');
        document.getElementById('pickupError')?.classList.remove('show');
        pickupInput.dispatchEvent(new Event('input', { bubbles: true }));
        pickupInput.dispatchEvent(new Event('change', { bubbles: true }));
        attachedLocation.settingInput = false;

        // V9.5.3 safety: GPS-generated text is always shown to the rider for one-tap confirmation.
        // This keeps current-location convenient while preventing a plausible-but-wrong door number
        // from becoming the dispatch address without the rider seeing it first.
        attachedLocation.requiresConfirmation = true;
        setLocationStatus('', 'success');
        // GC_MASTER_STABLE_2026_08R10P_CONCISE_LOCATION_REVIEW
        setLocationReview(`請確認門牌是否正確；若不符，請直接修改${locationAddressLabel}。`, true);
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
      const count = control.querySelector('.recent-count');
      if (!addresses.length) {
        control.classList.add('hidden');
        control.classList.remove('is-open');
        control.querySelector('.recent-toggle')?.setAttribute('aria-expanded', 'false');
        return;
      }
      control.classList.remove('hidden');
      if (count) count.textContent = `(${addresses.length})`;
    });
    if (!addresses.length) {
      if (recentManagementOpen) closeRecentAddressSheet();
      else closeRecentQuickPicker();
    }
  }

  let activeRecentTargetId = '';
  let activeRecentControl = null;
  let activeRecentPanel = null;
  let recentManagementOpen = false;

  // GC_MASTER_STABLE_2026_08R10M_RECENT_QUICK_PICKER
  // Normal selection is a lightweight anchored popover. Destructive management remains
  // separated in a locked sheet so choosing a recent address never feels like a new flow.
  function fillRecentAddress(address, targetId) {
    const input = document.getElementById(targetId);
    const cleaned = String(address || '').trim();
    if (!input || !cleaned) return false;
    if (targetId === 'pickup' && attachedLocation) clearAttachedLocation(false);
    input._gcCancelSmartSuggestions?.();
    input.dataset.gcSkipSuggestOnce = '1';
    input.value = cleaned;
    if (isLocallyDispatchReady(cleaned)) markAddressVerified(input, 'recent');
    else clearAddressVerified(input);
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    input.closest('.field')?.classList.remove('gc-validation-error');
    const error = document.getElementById(`${targetId}Error`);
    if (error) {
      error.textContent = '';
      error.classList.remove('show');
      error.removeAttribute('role');
    }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  function renderRecentQuickPanel(control) {
    const panel = control?.querySelector('.recent-panel');
    if (!panel) return;
    const addresses = loadRecentAddresses().slice(0, RECENT_LIMIT);
    panel.innerHTML = addresses.length ? `
      <div class="recent-helper"><strong>快速選取最近地址</strong><small>點一下即可帶入</small></div>
      <div class="recent-list">${addresses.map((address, index) => `
        <button class="recent-use" type="button" data-index="${index}" title="${escapeHtml(address)}">
          <span>${escapeHtml(address)}</span>
        </button>`).join('')}</div>
      <button class="recent-manage" type="button">管理地址紀錄</button>` : '';
  }

  // GC_MASTER_STABLE_2026_08R10Z9D_RECENT_VIEWPORT_SAFE_POPOVER
  // GC_MASTER_STABLE_2026_08R10Z9E_RECENT_BODY_PORTAL_POPOVER
  // The quick recent-address picker is temporarily portaled to <body> and positioned against
  // the visual viewport. This avoids every form/card stacking context (including progressive
  // reveal transforms) so later sections and the submit button can never paint over the list.
  function clearRecentQuickPanelInlinePosition(panel) {
    if (!panel) return;
    ['position','left','right','top','bottom','width','max-width','max-height','z-index'].forEach(prop => panel.style.removeProperty(prop));
    panel.classList.remove('gc-recent-portal','is-upward');
  }

  function bindRecentPortalPanel(panel) {
    if (!panel || panel.dataset.gcPortalBound === '1') return;
    panel.dataset.gcPortalBound = '1';
    panel.addEventListener('click', event => {
      const useButton = event.target.closest('.recent-use');
      if (useButton) {
        event.preventDefault();
        event.stopPropagation();
        const address = loadRecentAddresses()[Number(useButton.dataset.index)];
        if (address && activeRecentTargetId) fillRecentAddress(address, activeRecentTargetId);
        closeRecentQuickPicker();
        return;
      }
      if (event.target.closest('.recent-manage')) {
        event.preventDefault();
        event.stopPropagation();
        const control = activeRecentControl;
        const targetId = activeRecentTargetId;
        closeRecentQuickPicker();
        if (control && targetId) openRecentAddressManagement(control, targetId);
      }
    });
  }

  function positionRecentQuickPanel(control) {
    const panel = activeRecentPanel || control?.querySelector('.recent-panel');
    if (!panel || panel.classList.contains('hidden') || !control) return;
    const host = control.closest('.address-field');
    if (!host) return;
    const viewport = window.visualViewport;
    const viewportLeft = viewport?.offsetLeft || 0;
    const viewportTop = viewport?.offsetTop || 0;
    const viewportWidth = viewport?.width || window.innerWidth;
    const viewportHeight = viewport?.height || window.innerHeight;
    const viewportRight = viewportLeft + viewportWidth;
    const viewportBottom = viewportTop + viewportHeight;
    const anchorRect = control.getBoundingClientRect();
    const hostRect = host.getBoundingClientRect();
    const safe = 8;
    const gap = 8;
    const sideInset = Math.max(8, Math.min(12, hostRect.width * 0.035));
    const width = Math.min(360, Math.max(210, hostRect.width - sideInset * 2), Math.max(0, viewportWidth - safe * 2));
    const minLeft = viewportLeft + safe;
    const maxLeft = Math.max(minLeft, viewportRight - safe - width);
    const preferredLeft = hostRect.left + sideInset;
    const left = Math.min(maxLeft, Math.max(minLeft, preferredLeft));

    panel.classList.add('gc-recent-portal');
    panel.style.setProperty('position', 'fixed', 'important');
    panel.style.setProperty('left', `${Math.round(left)}px`, 'important');
    panel.style.setProperty('right', 'auto', 'important');
    panel.style.setProperty('width', `${Math.round(width)}px`, 'important');
    panel.style.setProperty('max-width', `${Math.round(Math.max(0, viewportWidth - safe * 2))}px`, 'important');
    panel.style.setProperty('z-index', '2147483000', 'important');
    panel.style.setProperty('top', `${Math.round(viewportTop + safe)}px`, 'important');
    panel.style.setProperty('bottom', 'auto', 'important');
    panel.style.setProperty('max-height', `${Math.round(Math.max(116, viewportHeight - safe * 2))}px`, 'important');

    // Measure only after the final width is applied, so long addresses wrap before we choose
    // direction. The visual viewport is authoritative when the iOS/Android keyboard changes size.
    const naturalHeight = Math.min(Math.max(panel.scrollHeight || 0, 150), 380);
    const below = Math.max(0, viewportBottom - anchorRect.bottom - gap - safe);
    const above = Math.max(0, anchorRect.top - viewportTop - gap - safe);
    const openUpward = below < Math.min(naturalHeight, 190) && above > below;
    const available = Math.max(116, (openUpward ? above : below));
    const maxHeight = Math.min(360, available);
    panel.classList.toggle('is-upward', openUpward);
    panel.style.setProperty('max-height', `${Math.round(maxHeight)}px`, 'important');

    // clientHeight reflects max-height clipping. Use it rather than scrollHeight when opening upward.
    const renderedHeight = Math.min(panel.scrollHeight || naturalHeight, maxHeight);
    let top = openUpward
      ? anchorRect.top - gap - renderedHeight
      : anchorRect.bottom + gap;
    const minTop = viewportTop + safe;
    const maxTop = Math.max(minTop, viewportBottom - safe - Math.min(renderedHeight, maxHeight));
    top = Math.min(maxTop, Math.max(minTop, top));
    panel.style.setProperty('top', `${Math.round(top)}px`, 'important');
  }

  function closeRecentQuickPicker() {
    if (!activeRecentControl || recentManagementOpen) return;
    const control = activeRecentControl;
    const panel = activeRecentPanel || control.querySelector('.recent-panel');
    control.classList.remove('is-open');
    control.querySelector('.recent-toggle')?.setAttribute('aria-expanded', 'false');
    panel?.classList.add('hidden');
    clearRecentQuickPanelInlinePosition(panel);
    // Restore the original DOM shape after closing so legacy refresh/management code remains intact.
    if (panel && panel.parentElement !== control) control.appendChild(panel);
    activeRecentPanel = null;
    activeRecentControl = null;
    activeRecentTargetId = '';
  }

  function openRecentQuickPicker(control, targetId) {
    const addresses = loadRecentAddresses();
    if (!addresses.length || !control || !targetId) return;
    if (activeRecentControl === control && control.classList.contains('is-open')) {
      closeRecentQuickPicker();
      return;
    }
    closeRecentQuickPicker();
    recentManagementOpen = false;
    activeRecentControl = control;
    activeRecentTargetId = targetId;
    renderRecentQuickPanel(control);
    control.classList.add('is-open');
    control.querySelector('.recent-toggle')?.setAttribute('aria-expanded', 'true');
    const panel = control.querySelector('.recent-panel');
    if (!panel) return;
    bindRecentPortalPanel(panel);
    activeRecentPanel = panel;
    document.body.appendChild(panel);
    panel.classList.remove('hidden');
    requestAnimationFrame(() => positionRecentQuickPanel(control));
  }

  function ensureRecentAddressSheet() {
    let overlay = document.getElementById('gcRecentSheet');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'gcRecentSheet';
    overlay.className = 'gc-recent-sheet-overlay hidden';
    overlay.hidden = true;
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <section class="gc-recent-sheet" role="dialog" aria-modal="true" aria-labelledby="gcRecentSheetTitle">
        <div class="gc-recent-sheet-handle" aria-hidden="true"></div>
        <div class="gc-recent-sheet-head">
          <div>
            <strong id="gcRecentSheetTitle">${escapeHtml(COMMON['最近地址標題'] || '最近使用地址')}</strong>
            <small>管理已儲存的最近地址</small>
          </div>
          <button type="button" class="gc-recent-sheet-close" aria-label="關閉">✕</button>
        </div>
        <div class="gc-recent-sheet-list"></div>
        <button class="gc-recent-sheet-clear" type="button">${escapeHtml(COMMON['最近地址清除全部'] || '清除全部')}</button>
      </section>`;
    document.body.appendChild(overlay);

    overlay.addEventListener('click', event => {
      if (event.target === overlay || event.target.closest('.gc-recent-sheet-close')) {
        closeRecentAddressSheet();
        return;
      }
      const useButton = event.target.closest('.gc-recent-sheet-use');
      if (useButton) {
        const address = loadRecentAddresses()[Number(useButton.dataset.index)];
        if (address && activeRecentTargetId) fillRecentAddress(address, activeRecentTargetId);
        closeRecentAddressSheet();
        return;
      }
      const deleteButton = event.target.closest('.gc-recent-sheet-delete');
      if (deleteButton) {
        deleteRecentAddress(Number(deleteButton.dataset.index));
        renderRecentAddressSheetList();
        if (!loadRecentAddresses().length) closeRecentAddressSheet();
        return;
      }
      if (event.target.closest('.gc-recent-sheet-clear')) {
        closeRecentAddressSheet();
        openRecentClearModal(clearRecentAddresses);
      }
    });
    return overlay;
  }

  function renderRecentAddressSheetList() {
    const overlay = document.getElementById('gcRecentSheet');
    const list = overlay?.querySelector('.gc-recent-sheet-list');
    if (!list) return;
    const addresses = loadRecentAddresses();
    list.innerHTML = addresses.map((address, index) => `
      <div class="gc-recent-sheet-row">
        <button class="gc-recent-sheet-use" type="button" data-index="${index}" title="${escapeHtml(address)}">
          <span>${escapeHtml(address)}</span>
        </button>
        <button class="gc-recent-sheet-delete" type="button" data-index="${index}">${escapeHtml(COMMON['最近地址刪除'] || '刪除')}</button>
      </div>`).join('');
  }

  function closeRecentAddressSheet() {
    const overlay = document.getElementById('gcRecentSheet');
    if (overlay) {
      overlay.classList.add('hidden');
      overlay.hidden = true;
      overlay.setAttribute('aria-hidden', 'true');
    }
    if (recentManagementOpen) unlockViewport();
    recentManagementOpen = false;
    document.body.classList.remove('gc-recent-sheet-open');
    if (activeRecentControl) {
      activeRecentControl.classList.remove('is-open');
      activeRecentControl.querySelector('.recent-toggle')?.setAttribute('aria-expanded', 'false');
      activeRecentControl.querySelector('.recent-panel')?.classList.add('hidden');
    }
    activeRecentControl = null;
    activeRecentTargetId = '';
  }

  function openRecentAddressManagement(control, targetId) {
    const addresses = loadRecentAddresses();
    if (!addresses.length || !control || !targetId) return;
    if (activeRecentControl && activeRecentControl !== control) closeRecentQuickPicker();
    activeRecentControl = control;
    activeRecentTargetId = targetId;
    control.classList.remove('is-open');
    control.querySelector('.recent-toggle')?.setAttribute('aria-expanded', 'false');
    control.querySelector('.recent-panel')?.classList.add('hidden');
    const overlay = ensureRecentAddressSheet();
    renderRecentAddressSheetList();
    recentManagementOpen = true;
    lockViewport();
    overlay.hidden = false;
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gc-recent-sheet-open');
  }

  function waitForKeyboardToSettle(callback) {
    const viewport = window.visualViewport;
    if (!viewport) {
      setTimeout(callback, 260);
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
      if ((now - stableSince >= 90 && now - startedAt >= 180) || now - startedAt >= 460) {
        finish();
        return;
      }
      requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }

  function bindRecentAddressControls() {
    // GC_R10J_RECENT_POPOVER_AUTO_CLOSE compatibility marker.
    // GC_R10K_RECENT_BOTTOM_SHEET remains as the management-only sheet.
    // GC_MASTER_STABLE_2026_08R10M_RECENT_QUICK_PICKER is the normal selection flow.
    ensureRecentAddressSheet();
    document.querySelectorAll('.recent-address-control').forEach(control => {
      if (control.dataset.gcRecentBound === '1') return;
      control.dataset.gcRecentBound = '1';
      const targetId = control.dataset.target;
      const toggle = control.querySelector('.recent-toggle');
      toggle?.addEventListener('click', event => {
        event.preventDefault();
        event.stopPropagation();
        if (toggle.getAttribute('aria-expanded') === 'true' && !recentManagementOpen) {
          closeRecentQuickPicker();
          return;
        }
        const keyboardWasOpen = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName || '');
        blurActiveEditor();
        if (keyboardWasOpen) waitForKeyboardToSettle(() => openRecentQuickPicker(control, targetId));
        else openRecentQuickPicker(control, targetId);
      });
      control.addEventListener('click', event => {
        const useButton = event.target.closest('.recent-use');
        if (useButton) {
          event.preventDefault();
          event.stopPropagation();
          const address = loadRecentAddresses()[Number(useButton.dataset.index)];
          if (address) fillRecentAddress(address, targetId);
          closeRecentQuickPicker();
          return;
        }
        if (event.target.closest('.recent-manage')) {
          event.preventDefault();
          event.stopPropagation();
          openRecentAddressManagement(control, targetId);
        }
      });
    });
    refreshRecentAddressControls();

    if (!document.documentElement.dataset.gcRecentEscapeBound) {
      document.documentElement.dataset.gcRecentEscapeBound = '1';
      document.addEventListener('keydown', event => {
        if (event.key !== 'Escape') return;
        if (recentManagementOpen) closeRecentAddressSheet();
        else closeRecentQuickPicker();
      });
      document.addEventListener('click', event => {
        if (recentManagementOpen || !activeRecentControl) return;
        if (activeRecentControl.contains(event.target) || activeRecentPanel?.contains(event.target)) return;
        closeRecentQuickPicker();
      });
      // R10Q: scrolling/dragging inside the recent list is a browse gesture, not a close gesture.
      // The anchored panel naturally moves with its control during page scroll, so keep it open.
      window.addEventListener('scroll', () => {
        if (!recentManagementOpen && activeRecentControl) requestAnimationFrame(() => positionRecentQuickPanel(activeRecentControl));
      }, { passive: true });
      window.addEventListener('resize', () => {
        if (!recentManagementOpen) closeRecentQuickPicker();
      }, { passive: true });
      window.visualViewport?.addEventListener('resize', () => {
        if (!recentManagementOpen) closeRecentQuickPicker();
      }, { passive: true });
    }
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
      <section class="form-card gc-ride-card gc-${mode}-card">
        <div class="form-head gc-task-head">
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
      <section class="gc-fare-calc" aria-label="填入分鐘與公里">
        <div class="gc-fare-calc-kicker">
          <strong>${escapeHtml(cfg['計算器標題'] || '回來填 2 個數字')}</strong>
          <span>${escapeHtml(cfg['計算器說明'] || '照 Google 地圖顯示填入即可')}</span>
        </div>
        <div class="gc-fare-calc-grid">
          <label class="gc-fare-calc-field" for="fareMinutes">
            <span>${escapeHtml(cfg['時間標題'] || '預估時間')}</span>
            <div class="gc-fare-calc-input-wrap">
              <input id="fareMinutes" class="gc-fare-calc-input" type="number" min="1" max="1440" step="1" inputmode="numeric" placeholder="${escapeHtml(cfg['時間提示'] || '例如 21')}" autocomplete="off">
              <b>分鐘</b>
            </div>
          </label>
          <label class="gc-fare-calc-field" for="fareKm">
            <span>${escapeHtml(cfg['公里標題'] || '公里數')}</span>
            <div class="gc-fare-calc-input-wrap">
              <input id="fareKm" class="gc-fare-calc-input" type="number" min="0.1" max="999" step="0.1" inputmode="decimal" placeholder="${escapeHtml(cfg['公里提示'] || '例如 7.9')}" autocomplete="off">
              <b>公里</b>
            </div>
          </label>
        </div>
        <div class="gc-fare-calc-result is-waiting" id="fareCalcResult" aria-live="polite">
          <span class="gc-fare-result-label" id="fareResultLabel">${escapeHtml(cfg['計算器等待'] || '填完兩格，立即顯示預估車資')}</span>
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
    const allDayParts = allDay.split('｜').map(item => item.trim()).filter(Boolean);
    const allDayShort = allDayParts[0] || '24H同一費率';
    const longText = `長途超過 ${formatFareRuleValue(rules.longDistanceKm)} 公里另有直收優惠價`;
    const baseRows = [
      ['起跳', `$${formatFareRuleValue(rules.start)}`],
      ['每分鐘', `$${formatFareRuleValue(rules.perMinute)}`],
      ['每公里', `$${formatFareRuleValue(rules.perKm)}`],
      [`第 ${formatFareRuleValue(rules.extraFromKm)} 公里起`, `每公里 +$${formatFareRuleValue(rules.extraPerKm)}`],
      ['最低消費', `$${formatFareRuleValue(rules.minimum)}`]
    ];
    const noteRows = [...allDayParts];
    return `
      <details class="gc-fare-rates">
        <summary class="gc-fare-rates-summary">
          <span>${escapeHtml(cfg['費率標題'] || '中部地區費率')}</span>
          <small class="gc-fare-rates-meta">
            <span class="gc-fare-rates-meta-line">${escapeHtml(allDayShort)}</span>
            <span class="gc-fare-rates-meta-line">最低 $${escapeHtml(formatFareRuleValue(rules.minimum))}</span>
          </small>
        </summary>
        <div class="gc-fare-rates-content">
          <section class="gc-rate-section" aria-label="基本計費">
            <strong class="gc-rate-section-title">基本計費</strong>
            <div class="gc-rate-grid">${baseRows.map(([label,value]) => `<div class="gc-rate-row"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b></div>`).join('')}</div>
          </section>
          <section class="gc-rate-section" aria-label="費率說明">
            <strong class="gc-rate-section-title">費率說明</strong>
            <div class="gc-rate-note-list">${noteRows.map(line => `<div class="gc-rate-note-row"><i aria-hidden="true"></i><span>${escapeHtml(line)}</span></div>`).join('')}</div>
            <div class="gc-rate-long-benefit"><span>長途優惠</span><strong>${escapeHtml(`超過 ${formatFareRuleValue(rules.longDistanceKm)} 公里，可享直收優惠價`)}</strong></div>
          </section>
        </div>
      </details>`;
  }

  function renderFare(cfg) {
    // GC_R10J_FARE_NO_RECENT_ADDRESS: 車資試算不顯示最近使用地址；最近地址只保留給叫車／代駕。
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
              <strong>${escapeHtml(cfg['人工協助標題'] || '需要客服協助？')}</strong>
              <span>${escapeHtml(cfg['人工協助提示'] ?? '')}</span>
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

  function clearFieldValidation(id) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);
    if (input) {
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
    }
    input?.closest('.field')?.classList.remove('gc-validation-error');
    if (error) {
      error.textContent = '';
      error.classList.remove('show');
      error.removeAttribute('role');
    }
  }

  function clearNamedValidation(id) {
    const error = document.getElementById(id);
    if (!error) return;
    error.textContent = '';
    error.classList.remove('show');
    error.removeAttribute('role');
    error.closest('.field')?.classList.remove('gc-validation-error');
  }

  function clearErrors() {
    document.querySelectorAll('.error-text').forEach(el => {
      el.textContent = '';
      el.classList.remove('show');
      el.removeAttribute('role');
    });
    document.querySelectorAll('.invalid').forEach(el => {
      el.classList.remove('invalid');
      el.removeAttribute('aria-invalid');
    });
    document.querySelectorAll('.gc-validation-error').forEach(el => el.classList.remove('gc-validation-error'));
    const global = document.getElementById('globalError');
    if (global) {
      global.textContent = '';
      global.classList.remove('show');
    }
  }

  function showFieldError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);
    if (input) {
      input.classList.add('invalid');
      input.setAttribute('aria-invalid', 'true');
      input.closest('.field')?.classList.add('gc-validation-error');
    }
    if (error) {
      error.textContent = message;
      error.classList.add('show');
      error.setAttribute('role', 'alert');
    }
  }

  function showNamedError(id, message) {
    const error = document.getElementById(id);
    if (error) {
      error.textContent = message;
      error.classList.add('show');
      error.setAttribute('role', 'alert');
      error.closest('.field')?.classList.add('gc-validation-error');
    }
  }

  function focusFirstValidationError() {
    const field = document.querySelector('.field.gc-validation-error');
    if (!field) return;
    requestAnimationFrame(() => {
      field.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const target = field.querySelector('input:not([type="radio"]), select, textarea, input[type="radio"]');
      setTimeout(() => {
        try { target?.focus({ preventScroll: true }); }
        catch (_) { try { target?.focus(); } catch (_) {} }
      }, 260);
    });
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

  const managedDisclosureSelector = [
    'details.optional-box:not(.favorite-box)',
    'details.gc-info-disclosure',
    'details.gc-fare-rates',
    'details.gc-fare-manual-details'
  ].join(',');

  function managedDisclosures() {
    return [...document.querySelectorAll(managedDisclosureSelector)];
  }

  function disclosureHasMeaningfulData(details) {
    if (!details?.matches('details.optional-box:not(.favorite-box)')) return false;
    const emptyTokens = new Set(['', '0', '無', 'none', 'null', 'undefined', '-', '－']);
    return [...details.querySelectorAll('input, select, textarea')].some(control => {
      if (control.disabled) return false;
      const type = String(control.type || '').toLowerCase();
      if (type === 'radio' || type === 'checkbox') {
        if (!control.checked) return false;
        const v = String(control.value || '').trim().toLowerCase();
        return !emptyTokens.has(v);
      }
      const v = String(control.value || '').trim();
      if (!v) return false;
      return !emptyTokens.has(v.toLowerCase());
    });
  }

  function closeManagedDisclosuresOutside(target) {
    managedDisclosures().forEach(details => {
      if (!details.open || details.contains(target)) return;
      // Smart collapse: explanation-only panels close automatically, but a form section
      // holding actual customer choices stays open so the customer can verify them.
      if (disclosureHasMeaningfulData(details)) return;
      details.open = false;
    });
  }

  function installManagedDisclosureBehavior() {
    if (document.documentElement.dataset.gcDisclosureManager === '1') return;
    document.documentElement.dataset.gcDisclosureManager = '1';

    // If another disclosure is opened, close peers. Ancestor/child disclosures may coexist
    // so the vehicle-price details can stay inside the expanded special-needs section.
    document.addEventListener('toggle', event => {
      const current = event.target;
      if (!(current instanceof HTMLDetailsElement) || !current.matches(managedDisclosureSelector) || !current.open) return;
      managedDisclosures().forEach(details => {
        if (details === current || !details.open) return;
        if (details.contains(current) || current.contains(details)) return;
        details.open = false;
      });
    }, true);

    // Tapping elsewhere returns the page to its compact state. Defer the collapse
    // until after the clicked control has completed its native action (important for
    // submit buttons and neighboring disclosure summaries in mobile WebViews).
    document.addEventListener('click', event => {
      const target = event.target;
      setTimeout(() => closeManagedDisclosuresOutside(target), 0);
    });
  }

  function bindSmallDisclosureTriggers() {
    installManagedDisclosureBehavior();
    document.querySelectorAll('details.optional-box:not(.favorite-box)').forEach(details => {
      const summary = details.querySelector(':scope > summary');
      if (!summary) return;
      let trigger = summary.querySelector('.gc-small-disclosure-trigger');
      if (!trigger) {
        trigger = document.createElement('span');
        trigger.className = 'gc-small-disclosure-trigger';
        trigger.setAttribute('aria-hidden', 'true');
        trigger.innerHTML = '<span class="gc-small-trigger-label">展開</span><span>⌄</span>';
        summary.appendChild(trigger);
      }
      const sync = () => {
        const currentTrigger = summary.querySelector('.gc-small-disclosure-trigger');
        if (!currentTrigger) return;
        const label = currentTrigger.querySelector('.gc-small-trigger-label');
        if (label) label.textContent = details.open ? '收合' : '展開';
        const arrow = currentTrigger.lastElementChild;
        if (arrow) arrow.textContent = details.open ? '⌃' : '⌄';
      };
      sync();
      if (summary.dataset.gcSmallTriggerBound !== '1') {
        summary.dataset.gcSmallTriggerBound = '1';
        details.addEventListener('toggle', sync);
      }
    });
  }
  window.GC_bindSmallDisclosureTriggers = bindSmallDisclosureTriggers;
  window.GC_installManagedDisclosureBehavior = installManagedDisclosureBehavior;

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
        clearNamedValidation('serviceTypeError');
        const reserve = checked('serviceType') === 'reserve';
        document.getElementById('scheduleFields').classList.toggle('hidden', !reserve);
        if (!reserve) {
          document.getElementById('date').value = '';
          document.getElementById('time').value = '';
          clearFieldValidation('date');
          clearFieldValidation('time');
        }
        updateLocationVisibility();
      });
    });
    ['date', 'time', 'pickup'].forEach(id => {
      const input = document.getElementById(id);
      if (!input) return;
      const clear = () => { if (String(input.value || '').trim()) clearFieldValidation(id); };
      input.addEventListener('input', clear);
      input.addEventListener('change', clear);
    });

    let sending = false;
    document.getElementById('serviceForm').addEventListener('submit', async event => {
      event.preventDefault();
      if (sending) return;
      clearErrors();
      normalizeAddressInput('pickup');
      normalizeAddressInput('destination');

      const serviceType = checked('serviceType');
      let pickup = value('pickup');
      let destination = value('destination');
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
        showFieldError('pickup', '請確認定位地址。');
        setLocationReview('請確認門牌是否正確；若不符，請直接修改地址。', true);
        valid = false;
      }
      if (valid && pickup && !(attachedLocation?.requiresConfirmation && !attachedLocation.confirmed)) {
        if (!(await verifyAddressField('pickup', { showError: true }))) valid = false;
      }
      if (valid && destination) {
        // Call / drunk-driver drop-off is descriptive dispatch context, not a Google route input.
        // Keep smart suggestions available, but do not block a valid request just because it is broad.
        if (!(await verifyAddressField('destination', { showError: true, policy: 'relaxed' }))) valid = false;
      }
      if (!valid) {
        focusFirstValidationError();
        return;
      }

      // R10W race guard: if the passenger edits an address while async verification is running,
      // never send the older snapshot. Re-read and verify the final visible text once more.
      const latestPickup = value('pickup');
      const latestDestination = value('destination');
      if (latestPickup !== pickup || latestDestination !== destination) {
        pickup = latestPickup;
        destination = latestDestination;
        let latestValid = Boolean(pickup && pickup !== LOCATION_MARKER);
        if (latestValid && !(await verifyAddressField('pickup', { showError: true }))) latestValid = false;
        if (latestValid && destination && !(await verifyAddressField('destination', { showError: true, policy: 'relaxed' }))) latestValid = false;
        if (!latestValid) {
          focusFirstValidationError();
          return;
        }
      }

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
      label.textContent = cfg['計算器等待'] || '填完兩格，立即顯示預估車資';
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
      basis.textContent = `${cfg['結果依據標題'] || '本次試算'}｜${estimate.minutes} 分鐘・${estimate.km} 公里`;
      note1.textContent = String(cfg['結果說明1'] ?? '').trim();
      note2.textContent = fareTextTemplate(cfg['結果說明2'] || '預估與實際車資可能約有 ±NT${浮動} 元差異。', { 浮動: formatFareMoney(estimate.rules.range) });
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
    document.getElementById('serviceForm').addEventListener('submit', async event => {
      event.preventDefault();
      if (sending) return;
      clearErrors();
      normalizeAddressInput('pickup');
      normalizeAddressInput('destination');

      let pickup = value('pickup');
      let destination = value('destination');
      const estimateMethod = cfg['訊息內容_估價方式'] || 'LINE 聊天室';
      let valid = true;
      if (!pickup) {
        showFieldError('pickup', cfg['錯誤_上車地址']);
        valid = false;
      }
      if (!destination) {
        showFieldError('destination', cfg['錯誤_下車地址']);
        valid = false;
      }
      if (valid && !(await verifyAddressField('pickup', { showError: true }))) valid = false;
      if (valid && !(await verifyAddressField('destination', { showError: true }))) valid = false;
      if (!valid) {
        focusFirstValidationError();
        return;
      }

      // R10W fare race guard: Google-routing verification and the outgoing LINE text must
      // refer to the same final visible addresses. If the passenger edited during lookup,
      // verify the new values rather than sending the stale pre-lookup snapshot.
      const latestPickup = value('pickup');
      const latestDestination = value('destination');
      if (latestPickup !== pickup || latestDestination !== destination) {
        pickup = latestPickup;
        destination = latestDestination;
        let latestValid = Boolean(pickup && destination);
        if (latestValid && !(await verifyAddressField('pickup', { showError: true }))) latestValid = false;
        if (latestValid && !(await verifyAddressField('destination', { showError: true }))) latestValid = false;
        if (!latestValid) {
          focusFirstValidationError();
          return;
        }
      }

      // GC_MASTER_STABLE_2026_08R10R_FARE_CHAT_EXPECTATION_COPY
      // Customer-visible LINE message reads as the passenger's request, not an internal command.
      // It encourages assistance while explicitly leaving room for canned trial-estimate information when busy.
      const lines = [cfg['訊息標題']];
      if (cfg['訊息分隔線']) lines.push(cfg['訊息分隔線']);
      if (cfg['訊息提醒']) lines.push(cfg['訊息提醒']);
      if (cfg['訊息提醒2']) lines.push(cfg['訊息提醒2']);
      appendLine(lines, cfg['訊息欄位_上車'], pickup);
      appendLine(lines, cfg['訊息欄位_下車'], destination);

      const signature = submissionSignature({ mode: 'fare', estimateMethod, pickup, destination });
      if (isDuplicateSubmission(signature)) {
        showGlobalError(duplicateMessage());
        return;
      }

      const rows = [
        { label: cfg['訊息欄位_估價方式'] || '回覆管道', value: estimateMethod },
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
          // GC_R10J_FARE_DO_NOT_WRITE_RECENTS: 車資試算不讀寫最近使用地址，避免污染叫車／代駕的最近地址。
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

  function renderRequestedMode(mode) {
    if (mode === 'call') {
      renderRideLike('call', CONFIG.call || {});
      return true;
    }
    if (mode === 'driver') {
      renderRideLike('driver', CONFIG.driver || {});
      return true;
    }
    if (mode === 'fare') {
      renderFare(CONFIG.fare || {});
      return true;
    }
    return false;
  }

  async function initialize() {
    // GC_MASTER_STABLE_2026_08R10Z9_PARALLEL_SAFE_BOOT
    // Version proof and LIFF SDK initialization run in parallel behind the single loading surface.
    // A stale form is still never painted; sendFormMessages continues to await the same LIFF promise.
    const initialParams = new URLSearchParams(location.search);
    const initialMode = initialParams.get('mode');
    const mightBeLiff = !preview && (initialParams.has('liff.state') || Boolean(initialMode));
    const liffBoot = mightBeLiff ? ensureLiffReady().then(sdk => ({ sdk, error: null })).catch(error => ({ sdk: null, error })) : null;

    const firstBuildStatus = await ensureLatestBuild(true, { timeoutMs: GC_FIRST_BUILD_CHECK_TIMEOUT_MS });
    if (firstBuildStatus === 'stale' || gcVersionRedirecting) return;
    releaseVersionHold(firstBuildStatus);

    const initialModeRendered = Boolean(initialMode && renderRequestedMode(initialMode));
    if (preview) {
      if (!initialModeRendered) renderQr();
      return;
    }

    if (mightBeLiff) {
      const result = await liffBoot;
      if (result?.error) {
        renderFatal('表格無法開啟', result.error?.message || 'LIFF 初始化失敗。');
        return;
      }
      if (!result?.sdk || !result.sdk.isInClient()) {
        renderFatal('請從 LINE 開啟', COMMON['非LINE開啟提醒']);
        return;
      }
    }

    const finalMode = new URLSearchParams(location.search).get('mode');
    if (!finalMode) {
      if (!initialModeRendered) renderQr();
      return;
    }
    if (!initialModeRendered || finalMode !== initialMode) {
      if (!renderRequestedMode(finalMode)) renderQr();
    }
  }

  const loadingText = document.getElementById('loadingText');
  if (loadingText && COMMON['初始化文字']) loadingText.textContent = COMMON['初始化文字'];
  initialize();
})();
