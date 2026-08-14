(() => {
  'use strict';
  const GC_BUILD_VERSION = 'master202608r10z14f25r6m2r13';
  // GC_MASTER_STABLE_2026_08R10Z14F_TARGETED_FINAL_SEAL
  // GC_MASTER_STABLE_2026_08R10Z14F7_CALL_CONFIRM_REVIEW_AND_ADMIN_RECHECK
  // GC_MASTER_STABLE_2026_08R10Z14F9_FAVORITE_PREVIEW_SHEET_AND_CALL_HINT_TONE
  // GC_MASTER_STABLE_2026_08R10Z14F10_FAVORITE_SHEET_SAVE_FLOW
  // GC_MASTER_STABLE_2026_08R10Z14F11_FAVORITE_RESPONSIVE_ADMIN_HINT_AND_PICKUP_ONLY_FLOW
  // GC_MASTER_STABLE_2026_08R10Z14F12_FAVORITE_CROSS_DEVICE_EDIT_AND_SINGLE_POINT_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F13_FAVORITE_STATUS_LIFECYCLE
  // GC_MASTER_STABLE_2026_08R10Z14F14_DRIVER_REVIEW_NORMALIZATION_AND_CONFIRM_INTRO
  // GC_MASTER_STABLE_2026_08R10Z14F15_ADDRESS_EDIT_VIEWPORT_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F16_ALL_INPUT_VIEWPORT_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F17_CALL_DESTINATION_DISPLAY_NORMALIZATION
  // GC_MASTER_STABLE_2026_08R10Z14F18_KEYBOARD_DISMISS_AND_DRIVER_DESTINATION_NORMALIZATION
  // GC_MASTER_STABLE_2026_08R10Z14F21_RIDE_DONE_NATIVE_VIEWPORT_RELEASE
  // GC_MASTER_STABLE_2026_08R10Z14F22_FARE_NUMBER_NATIVE_VIEWPORT_RELEASE
  // GC_MASTER_STABLE_2026_08R10Z14F23_LOCATION_BINDING_INVALIDATION
  // GC_MASTER_STABLE_2026_08R10Z14F24_RESERVE_CURRENT_LOCATION_ADDRESS_ONLY
  // GC_MASTER_STABLE_2026_08R10Z14F25_NO_DOOR_LOCATION_COORDINATE_FALLBACK
  // GC_MASTER_STABLE_2026_08R10Z14F25R4_LOCATION_MODE_ISOLATION_AND_NO_DOOR_SUPPLEMENT
  // GC_MASTER_STABLE_2026_08R10Z14F25R5_FAVORITE_COMPACT_AND_FIRST_EDIT_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R1_RECENT_SINGLE_STAGE_PREMIUM_QUICK_PICKER
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R2_CONFIRMATION_PREMIUM_AND_LOCATION_EDIT_COMPACT_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R3_IOS_RECENT_VIEWPORT_AND_LOCATION_EDIT_NO_SHAKE
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R4_IOS_RECENT_WINDOW_RESIZE_DISCRIMINATION
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R5_SMART_SUGGESTION_SINGLE_STABLE_TRANSACTION_AND_RECENT_GESTURE_LOCK
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R6_CONFIRMATION_COPY_OPTICAL_FINISH
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R7_LOCATION_STATE_MACHINE_NO_DOOR_MANUAL_SWITCH
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R8_EXPLICIT_RELOCATION_GPS_AUTHORITY_AND_MANUAL_DRAFT
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R9_DMS_COORDINATE_AND_DISPATCH_PICKUP_IDENTIFIER
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R10_SAFE_PICKUP_OUTPUT_CANONICALIZATION
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R11_NO_DOOR_DISPATCH_CLUSTER_AND_SURROUNDING_IDENTIFIER
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R12_IOS_DESTINATION_FOCUS_AND_DONE_RACE_ROOT_FIX
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R13_OPTIONAL_COLLAPSE_VISUAL_ANCHOR_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F8_FAVORITE_PICKUP_ONLY_AND_COMPACT_SHEET
  // Scope lock: favorite-trip pickup-only saving and favorite-sheet height only.
  // Scope lock: call confirmation copy hierarchy and post-normalization admin reminder only.
  // Named-scope patch only: shortcut alignment, empty schedule hint tone, fare unit divider, and approved success-page copy.
  // GC_MASTER_STABLE_2026_08R10Z9_ENTERPRISE_POI_PROGRESSIVE_UX
  // GC_MASTER_STABLE_2026_08R10Z9H_NEEDS_GROUPED_REFLOW
  // GC_MASTER_STABLE_2026_08R10Z9I_NEEDS_TITLE_AND_FARE_INNER_CARD
  // GC_MASTER_STABLE_2026_08R10Z9J_FARE_DISCLOSURE_REFINEMENT
  // GC_MASTER_STABLE_2026_08R10Z9K_INLINE_HELP_AND_PLACEHOLDER_TONE
  // GC_MASTER_STABLE_2026_08R10Z9L_MANUAL_ADDRESS_AND_CONFIRMED_SCHEDULE
  // GC_MASTER_STABLE_2026_08R10Z9W_TRUE_IPHONE_FLOW_AND_MOTHER_VISUAL_LOCK
  // GC_MASTER_STABLE_2026_08R10Z9X_CUSTOM_FROSTED_DATE_MODAL
  // GC_MASTER_STABLE_2026_08R10Z9Y_COMPACT_UI_HIERARCHY
  // GC_MASTER_STABLE_2026_08R10Z9Y_SOFT_ADMIN_AMBIGUITY
  // GC_MASTER_STABLE_2026_08R10Z9Z_COMPLETE_ADMIN_GUIDANCE
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
  const LOCATION_PIN_ONLY_LABEL = '📍 已取得目前定位（無法辨識門牌）';
  const LOCATION_AUTO_ACCEPT_ACCURACY_M = 35;
  const LOCATION_REVIEW_ACCURACY_M = 100;
  const LOCATION_SAMPLE_WINDOW_MS = 3200;
  const LOCATION_REVERSE_GEOCODE_TIMEOUT_MS = 3500;
  const ADDRESS_SUGGEST_DEBOUNCE_MS = 320;
  const ADDRESS_SUGGEST_TIMEOUT_MS = 3000;
  const ADDRESS_ADMIN_AMBIGUITY_SCORE_MIN = 95;
  const ADDRESS_ADMIN_LOOKUP_TIMEOUT_MS = 10000;
  const ADDRESS_ADMIN_AMBIGUITY_SUBMIT_WAIT_MS = 1200;
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
  const addressAdminAmbiguityChecks = new Map();
  const addressAdminAmbiguityResults = new Map();
  let addressAdminAmbiguityToken = 0;
  let pendingConfirmAction = null;
  let confirmationBusy = false;
  let pendingRecentClearAction = null;
  let attachedLocation = null;
  let currentLocationUsed = false;
  let locationRequestToken = 0;
  let addressSuggestRequestToken = 0;
  let modalScrollY = 0;
  let modalLockDepth = 0;
  let liffReadyPromise = null;
  // GC_MASTER_STABLE_2026_08R10Z12_LIFF_BOUNDED_FAILURE
  // A stalled CDN or LIFF initialization must end in a recoverable error card,
  // never an indefinitely loading form or an indefinitely pending submit.
  const GC_LIFF_SDK_TIMEOUT_MS = 12000;
  const GC_LIFF_INIT_TIMEOUT_MS = 12000;

  function withTimeout(work, timeoutMs, message) {
    let timer = 0;
    const timeout = new Promise((_, reject) => {
      timer = window.setTimeout(() => reject(new Error(message)), timeoutMs);
    });
    return Promise.race([Promise.resolve(work), timeout]).finally(() => window.clearTimeout(timer));
  }

  function loadLiffSdk() {
    if (window.liff) return Promise.resolve(window.liff);
    return new Promise((resolve, reject) => {
      let settled = false;
      let timer = 0;
      let script = document.querySelector('script[data-gc-liff-sdk="1"]');
      const createdHere = !script;
      const cleanup = () => {
        window.clearTimeout(timer);
        script?.removeEventListener('load', finish);
        script?.removeEventListener('error', fail);
      };
      const settle = (handler, value) => {
        if (settled) return;
        settled = true;
        cleanup();
        handler(value);
      };
      const finish = () => window.liff
        ? settle(resolve, window.liff)
        : settle(reject, new Error('LIFF SDK 載入失敗。'));
      const fail = () => {
        if (createdHere) script?.remove();
        settle(reject, new Error('LIFF SDK 載入失敗，請確認網路後重試。'));
      };
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
        script.async = true;
        script.dataset.gcLiffSdk = '1';
      }
      script.addEventListener('load', finish);
      script.addEventListener('error', fail);
      timer = window.setTimeout(() => {
        if (createdHere) script?.remove();
        settle(reject, new Error('LIFF SDK 載入逾時，請確認網路後重試。'));
      }, GC_LIFF_SDK_TIMEOUT_MS);
      if (createdHere) document.head.appendChild(script);
      // Close the tiny race where an existing SDK tag finishes between the
      // initial window.liff check and listener attachment.
      if (window.liff) finish();
    });
  }

  function ensureLiffReady() {
    if (preview) return Promise.resolve(null);
    if (!liffReadyPromise) {
      liffReadyPromise = loadLiffSdk().then(async sdk => {
        await withTimeout(
          sdk.init({ liffId: CONFIG.liffId }),
          GC_LIFF_INIT_TIMEOUT_MS,
          'LIFF 初始化逾時，請確認網路後重試。'
        );
        return sdk;
      });
      liffReadyPromise.then(
        () => window.dispatchEvent(new CustomEvent('gc:liff-settled', { detail: { ready: true } })),
        () => window.dispatchEvent(new CustomEvent('gc:liff-settled', { detail: { ready: false } }))
      );
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
          </div>
          <div class="location-manual-switch hidden" id="locationManualSwitch" aria-live="polite">
            <span>已知道完整地址？</span>
            <button class="location-manual-address-btn" id="locationManualAddressBtn" type="button">改填地址</button>
          </div>
          <div class="field hidden" id="locationSupplementField">
            <label for="locationSupplement">周邊辨識點（選填）</label>
            <input class="input" id="locationSupplement" name="locationSupplement" type="text" maxlength="80" placeholder="例如：路口、店家、社區、地標" autocomplete="off">
          </div>` : ''}
        ${showRecent ? `
        <div class="recent-address-control hidden" data-target="${id}">
          <button class="recent-toggle" type="button" aria-expanded="false" aria-haspopup="dialog" aria-controls="${id}RecentPanel" aria-label="${escapeHtml(COMMON['最近地址標題'] || '最近地址')}">
            <span class="recent-clock" aria-hidden="true">↺</span>
            <span class="recent-title">${escapeHtml(COMMON['最近地址按鈕'] || '最近地址')}</span>
            <span class="recent-count"></span>
            <span class="recent-chevron" aria-hidden="true">⌄</span>
          </button>
          <div class="recent-panel hidden" id="${id}RecentPanel" role="dialog" aria-label="${escapeHtml(COMMON['最近地址標題'] || '最近地址')}"></div>
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
        <div class="field gc-schedule-field" style="margin-bottom:0">
          <label for="dateShell">${requiredLabel(cfg['日期標題'])}</label>
          <button class="input gc-datetime-control gc-date-control gc-date-shell is-empty" id="dateShell" type="button" aria-haspopup="dialog" aria-controls="gcDatePicker" aria-expanded="false" aria-describedby="dateError" aria-label="選擇用車日期">
            <span class="gc-date-display" id="dateDisplay" aria-hidden="true">請選擇日期</span>
          </button>
          <input class="gc-date-native" id="date" name="date" type="date" autocomplete="off" tabindex="-1" aria-hidden="true" hidden>
          <div class="error-text" id="dateError"></div>
        </div>
        <div class="field gc-schedule-field" style="margin-bottom:0">
          <label id="timeLabel" for="timeTrigger">${requiredLabel(cfg['時間標題'])}</label>
          <input id="time" name="time" type="hidden">
          <button class="input gc-datetime-control gc-time-trigger is-empty" id="timeTrigger" type="button" aria-haspopup="dialog" aria-controls="gcTimePicker" aria-expanded="false" aria-describedby="timeError" aria-label="選擇用車時間">
            <span id="timeDisplay">請選擇時間</span>
          </button>
          <div class="error-text" id="timeError"></div>
        </div>
      </div>`;
  }

  function renderTimeWheelOptions(prefix, count) {
    return Array.from({ length: count }, (_, value) => {
      const label = String(value).padStart(2, '0');
      return `<button id="${prefix}Option${label}" class="gc-time-option" type="button" role="option" aria-selected="false" tabindex="-1" data-value="${label}">${label}</button>`;
    }).join('');
  }

  function renderDatePicker() {
    return `
      <div id="gcDatePickerOverlay" class="gc-time-picker-overlay gc-date-picker-overlay hidden" aria-hidden="true">
        <section id="gcDatePicker" class="gc-time-picker-card gc-date-picker-card" role="dialog" aria-modal="true" aria-labelledby="gcDatePickerTitle" aria-describedby="gcDatePickerHelp" tabindex="-1">
          <header class="gc-time-picker-head gc-date-picker-head">
            <h2 id="gcDatePickerTitle">選擇用車日期</h2>
            <p id="gcDatePickerHelp">點選日期後按完成</p>
          </header>
          <p id="gcDatePickerStatus" class="sr-only" aria-live="polite"></p>
          <div class="gc-date-picker-panel">
            <div class="gc-date-month-bar">
              <button id="gcDatePrev" class="gc-date-month-nav" type="button" aria-label="上一個月"></button>
              <strong id="gcDateMonthLabel" class="gc-date-month-label" aria-live="polite"></strong>
              <button id="gcDateNext" class="gc-date-month-nav gc-date-next" type="button" aria-label="下一個月"></button>
            </div>
            <div class="gc-date-weekdays" aria-hidden="true">
              <span>週日</span><span>週一</span><span>週二</span><span>週三</span><span>週四</span><span>週五</span><span>週六</span>
            </div>
            <div id="gcDateGrid" class="gc-date-grid" role="grid" aria-labelledby="gcDateMonthLabel"></div>
          </div>
          <div class="gc-time-actions gc-date-actions">
            <button class="gc-time-cancel gc-date-cancel" id="gcDateCancel" type="button">取消</button>
            <button class="gc-time-confirm gc-date-confirm" id="gcDateConfirm" type="button">完成</button>
          </div>
        </section>
      </div>`;
  }

  function renderTimePicker() {
    return `
      <div id="gcTimePickerOverlay" class="gc-time-picker-overlay hidden" aria-hidden="true">
        <section id="gcTimePicker" class="gc-time-picker-card" role="dialog" aria-modal="true" aria-labelledby="gcTimePickerTitle" aria-describedby="gcTimePickerHelp" tabindex="-1">
          <header class="gc-time-picker-head">
            <h2 id="gcTimePickerTitle">選擇用車時間</h2>
            <p id="gcTimePickerHelp">上下滑動調整小時與分鐘</p>
          </header>
          <p id="gcTimePickerStatus" class="sr-only" aria-live="polite"></p>
          <div class="gc-time-wheels">
            <div class="gc-time-wheel-frame">
              <div id="gcHourWheel" class="gc-time-wheel" role="listbox" aria-label="小時" tabindex="0">
                ${renderTimeWheelOptions('gcHour', 24)}
              </div>
            </div>
            <span class="gc-time-separator" aria-hidden="true">:</span>
            <div class="gc-time-wheel-frame">
              <div id="gcMinuteWheel" class="gc-time-wheel" role="listbox" aria-label="分鐘" tabindex="0">
                ${renderTimeWheelOptions('gcMinute', 60)}
              </div>
            </div>
          </div>
          <div class="gc-time-actions">
            <button class="gc-time-cancel" id="gcTimeCancel" type="button">取消</button>
            <button class="gc-time-confirm" id="gcTimeConfirm" type="button">完成</button>
          </div>
        </section>
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

  // GC_R10Z14F6_REVIEWED_DISPATCH_ADDRESS_COPY
  // Only the call confirmation / outgoing text copy is normalized. The original input
  // remains the source of truth for validation, map coordinates, navigation and storage.
  const GC_DISPATCH_REGION_COUNTY = Object.freeze({
    TPE: '台北市', NWT: '新北市', TAO: '桃園市', TXG: '台中市', TNN: '台南市', KHH: '高雄市',
    KEE: '基隆市', HSZ: '新竹市', CYI: '嘉義市', HSQ: '新竹縣', MIA: '苗栗縣', CHA: '彰化縣',
    NAN: '南投縣', YUN: '雲林縣', CYQ: '嘉義縣', PIF: '屏東縣', ILA: '宜蘭縣', HUA: '花蓮縣',
    TTT: '台東縣', PEN: '澎湖縣', KIN: '金門縣', LIE: '連江縣'
  });

  function dispatchCountyFromPostal(value) {
    const digits = String(value || '').replace(/[０-９]/g, digit => String(digit.charCodeAt(0) - 0xFEE0));
    const code = Number(digits.slice(0, 3));
    if (!Number.isFinite(code)) return '';
    if (code >= 209 && code <= 212) return '連江縣';
    if (code >= 100 && code <= 116) return '台北市';
    if (code >= 200 && code <= 206) return '基隆市';
    if (code >= 207 && code <= 253) return '新北市';
    if (code >= 260 && code <= 272) return '宜蘭縣';
    if (code === 300) return '新竹市';
    if (code >= 302 && code <= 315) return '新竹縣';
    if (code >= 320 && code <= 338) return '桃園市';
    if (code >= 350 && code <= 369) return '苗栗縣';
    if (code >= 400 && code <= 439) return '台中市';
    if (code >= 500 && code <= 530) return '彰化縣';
    if (code >= 540 && code <= 558) return '南投縣';
    if (code === 600) return '嘉義市';
    if (code >= 602 && code <= 625) return '嘉義縣';
    if (code >= 630 && code <= 655) return '雲林縣';
    if (code >= 700 && code <= 745) return '台南市';
    if (code >= 800 && code <= 852) return '高雄市';
    if (code >= 880 && code <= 885) return '澎湖縣';
    if (code >= 890 && code <= 896) return '金門縣';
    if (code >= 900 && code <= 947) return '屏東縣';
    if (code >= 950 && code <= 966) return '台東縣';
    if (code >= 970 && code <= 983) return '花蓮縣';
    return '';
  }

  function normalizeDispatchAddressForReview(address) {
    const original = normalizeAddress(address);
    if (!original || /^(?:undefined|null)$/i.test(original) || original.includes('�')) return '';
    try {
      let text = typeof window.GC_traditionalizeDispatchAddress === 'function'
        ? window.GC_traditionalizeDispatchAddress(original)
        : original;
      text = normalizeAddress(text).replace(/　/g, ' ').replace(/臺/g, '台').trim();
      if (!text || /^(?:undefined|null)$/i.test(text) || text.includes('�')) return original;

      let inferredCounty = canonicalTaiwanCounty(text);
      let postal = '';
      const postalMatch = text.match(/^([0-9０-９]{3,6})(?=\s|[,，、-]|[A-Za-z])/);
      if (postalMatch) {
        postal = postalMatch[1];
        text = text.slice(postalMatch[0].length).replace(/^[\s,，、-]+/, '');
      }

      let regionCode = '';
      const regionMatch = text.match(/^([A-Za-z]{2,4})(?=\s|[,，、-]|[\u3400-\u9fff])/);
      if (regionMatch) {
        const candidateCode = regionMatch[1].toUpperCase();
        if (GC_DISPATCH_REGION_COUNTY[candidateCode]) {
          regionCode = candidateCode;
          text = text.slice(regionMatch[0].length).replace(/^[\s,，、-]+/, '');
        }
      }

      text = text.replace(/^[\s,，、-]+/, '').replace(/[，,、]+\s*/g, ' ').trim();
      if (!text) return original;
      if (!inferredCounty) inferredCounty = canonicalTaiwanCounty(text)
        || GC_DISPATCH_REGION_COUNTY[regionCode]
        || dispatchCountyFromPostal(postal);
      if (inferredCounty && !canonicalTaiwanCounty(text)) text = `${inferredCounty}${text}`;

      // Normalize the street/door core while preserving an appended POI/store name exactly
      // enough for human recognition (including spaces between English words).
      const doorWithSuffix = text.match(/^(.*?(?:大道|路|街|道|巷|弄)[^,，、]{0,80}?[0-9０-９]+(?:[-之][0-9０-９]+)?號(?:之[0-9０-９]+)?)([\s\S]*)$/);
      const core = doorWithSuffix ? doorWithSuffix[1] : text;
      const rawSuffix = doorWithSuffix ? doorWithSuffix[2] : '';
      const keepSuffixSeparator = /^[\s　,，、-]+/.test(rawSuffix);
      const suffix = normalizeAddress(rawSuffix.replace(/^[\s　,，、-]+/, '')).trim();

      let normalizedCore = '';
      try {
        normalizedCore = window.GC_ADDRESS_GUARD?.canonicalTaiwanAddress?.(core) || '';
      } catch (_) {}
      normalizedCore = normalizedCore || smartNormalizeTaiwanAddress(core);
      normalizedCore = normalizeAddress(normalizedCore).replace(/臺/g, '台').trim();
      if (TAIWAN_ADMIN_START.test(normalizedCore)) normalizedCore = normalizedCore.replace(/[，,、\s]+/g, '');
      ADDRESS_TAIWAN_COUNTIES.forEach(county => {
        while (normalizedCore.startsWith(county + county)) normalizedCore = normalizedCore.slice(county.length);
      });

      const normalized = `${normalizedCore}${suffix ? `${keepSuffixSeparator ? ' ' : ''}${suffix}` : ''}`.trim();
      if (!normalized || /(?:undefined|null|�)/i.test(normalized) || !/[\u3400-\u9fffA-Za-z]/.test(normalized)) return original;
      return normalized;
    } catch (_) {
      return original;
    }
  }

  window.GC_normalizeDispatchAddressForReview = normalizeDispatchAddressForReview;

  // M2R10: pickup-only output sanitizer for provider/AutoFill labels such as
  // "新生路28號 霧峰區 台中市 413004 台灣". The passenger's raw input remains untouched;
  // only the confirmation / LINE dispatch copy is reordered when every component is unambiguous.
  // Unknown/free-form text always falls back to the existing non-blocking review formatter.
  function normalizeReversedTaiwanPickupAddressForReview(address) {
    const original = normalizeAddress(address);
    if (!original) return '';
    try {
      let text = typeof window.GC_traditionalizeDispatchAddress === 'function'
        ? window.GC_traditionalizeDispatchAddress(original)
        : original;
      text = normalizeAddress(text).replace(/臺/g, '台').replace(/　/g, ' ').trim();
      if (!text || /(?:undefined|null|�)/i.test(text)) return '';

      // Remove only terminal standalone provider metadata. "台灣大道" is safe because
      // the country token must be separated from the street text.
      text = text.replace(/[\s,，、-]+(?:台灣|Taiwan|TWN)$/i, '').trim();
      text = text.replace(/[\s,，、-]+[0-9０-９]{3,6}$/, '').trim();
      text = text.replace(/[\s,，、-]+(?:台灣|Taiwan|TWN)$/i, '').trim();
      if (!text) return '';

      const county = canonicalTaiwanCounty(text);
      // This corrective path is intentionally scoped to the fleet's Taichung service area.
      // Other counties keep the existing formatter untouched rather than being guessed.
      if (county !== '台中市') return '';
      const doorMatch = text.match(/^(.+?(?:大道|路|街|道|巷|弄)[^,，、]{0,80}?[0-9０-９]+(?:[-之][0-9０-９]+)?號(?:之[0-9０-９]+)?)(?=\s|[,，、-]|$)/);
      if (!doorMatch) return '';
      const roadDoor = normalizeAddress(doorMatch[1]).replace(/臺/g, '台').trim();
      if (!roadDoor || roadDoor.includes(county)) return '';

      const tail = normalizeAddress(text.slice(doorMatch[0].length).replace(/^[\s,，、-]+/, '')).trim();
      if (!tail) return '';
      const tokens = tail.split(/[\s,，、-]+/).filter(Boolean);
      const districtTokens = tokens.filter(token => ADDRESS_TAICHUNG_DISTRICTS.includes(token));
      if (districtTokens.length !== 1 || !tokens.includes(county)) return '';
      const district = districtTokens[0];
      if (tokens.some(token => token !== county && token !== district)) return '';

      const candidate = `${county}${district}${roadDoor}`;
      let normalized = '';
      try { normalized = window.GC_ADDRESS_GUARD?.canonicalTaiwanAddress?.(candidate) || ''; } catch (_) {}
      normalized = normalized || smartNormalizeTaiwanAddress(candidate);
      normalized = normalizeAddress(normalized).replace(/臺/g, '台').replace(/[，,、\s]+/g, '').trim();
      if (!normalized.startsWith(`${county}${district}`)) return '';
      if (!/(?:大道|路|街|道|巷|弄).*[0-9０-９]+(?:[-之][0-9０-９]+)?號/.test(normalized)) return '';
      return normalized;
    } catch (_) {
      return '';
    }
  }

  function normalizePickupAddressForReview(address) {
    return normalizeReversedTaiwanPickupAddressForReview(address)
      || normalizeDispatchAddressForReview(address);
  }

  // GC_MASTER_STABLE_2026_08R10Z14F17_CALL_DESTINATION_DISPLAY_NORMALIZATION
  // Call destination is reference-only. Normalize only a display copy used by the confirmation
  // and LINE text; raw passenger input remains untouched for validation/navigation/storage.
  // Provider-style reversed Taiwan labels are reordered only when county + district + road/door
  // are all unambiguous. Any uncertain/failed conversion falls back to the existing safe copy.
  function normalizeCallDestinationForDisplay(address) {
    const original = normalizeAddress(address);
    if (!original) return '';
    const fallback = normalizeDispatchAddressForReview(original) || original;
    try {
      let text = typeof window.GC_traditionalizeDispatchAddress === 'function'
        ? window.GC_traditionalizeDispatchAddress(original)
        : original;
      text = normalizeAddress(text).replace(/臺/g, '台').replace(/　/g, ' ').trim();
      if (!text || /(?:undefined|null|�)/i.test(text)) return fallback;

      // Remove provider-only terminal country / postal tokens for this display-only copy.
      // 台灣大道 remains safe because only a standalone terminal token is removed.
      text = text.replace(/[\s,，、-]+(?:台灣|臺灣|Taiwan|TWN)$/i, '').trim();
      text = text.replace(/[\s,，、-]+[0-9０-９]{3,6}$/, '').trim();
      text = text.replace(/[\s,，、-]+(?:台灣|臺灣|Taiwan|TWN)$/i, '').trim();
      if (!text) return fallback;

      const cleaned = normalizeDispatchAddressForReview(text) || text;
      const cleanedCopy = normalizeAddress(cleaned).replace(/臺/g, '台').trim();
      const county = canonicalTaiwanCounty(text) || canonicalTaiwanCounty(cleanedCopy);
      if (!county) return cleanedCopy || fallback;

      const districtCandidates = Array.from(text.matchAll(/([\u3400-\u9fff]{1,8}(?:區|鄉|鎮|市))/g))
        .map(match => match[1])
        .filter(token => token && token !== county && !ADDRESS_TAIWAN_COUNTIES.includes(token));
      const district = districtCandidates[0] || '';
      if (!district) return cleanedCopy || fallback;

      const countyIndex = text.indexOf(county);
      const districtIndex = text.indexOf(district);
      const doorMatch = text.match(/^(.+?(?:大道|路|街|道|巷|弄)[^,，、]{0,80}?[0-9０-９]+(?:[-之][0-9０-９]+)?號(?:之[0-9０-９]+)?)(?=\s|[,，、-]|$)/);
      if (!doorMatch) return cleanedCopy || fallback;
      const roadDoor = normalizeAddress(doorMatch[1]).replace(/臺/g, '台').trim();
      if (!roadDoor || roadDoor.includes(county) || roadDoor.includes(district)) return cleanedCopy || fallback;
      if (countyIndex < 0 || districtIndex < 0 || doorMatch.index > Math.min(countyIndex, districtIndex)) return cleanedCopy || fallback;

      // Do not discard an unknown store / POI suffix: only reorder when all remaining material
      // is exactly the recognized district/county plus punctuation/spacing.
      let remainder = text.slice(doorMatch[0].length);
      remainder = remainder.replace(district, ' ').replace(county, ' ')
        .replace(/[\s,，、-]+/g, ' ').trim();
      if (remainder) return cleanedCopy || fallback;

      const candidate = normalizeDispatchAddressForReview(`${county}${district}${roadDoor}`);
      if (!candidate || /(?:undefined|null|�)/i.test(candidate)) return fallback;
      if (!candidate.includes(county) || !candidate.includes(district)) return fallback;
      if (!/[0-9０-９]+(?:[-之][0-9０-９]+)?號/.test(candidate)) return fallback;
      return candidate;
    } catch (_) {
      return fallback;
    }
  }

  window.GC_normalizeCallDestinationForDisplay = normalizeCallDestinationForDisplay;

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
    if (id === 'pickup' && attachedLocation && normalized) {
      // F23: formatter-only cleanup may preserve a valid GPS binding, but only when the
      // visible value still matches the address that owns the current map pin. Passenger
      // edits fire input and detach first, so they can never silently rebind an old pin.
      const beforeKey = addressConfidenceKey(before);
      const boundKey = attachedLocation.boundAddressKey || addressConfidenceKey(attachedLocation.address || attachedLocation.generatedAddress || '');
      if (beforeKey && boundKey && beforeKey === boundKey) {
        attachedLocation.address = normalized;
        if (attachedLocation.manualAddress) attachedLocation.manualAddress = normalized;
        attachedLocation.boundAddressKey = addressConfidenceKey(normalized);
      }
    }
    return normalized;
  }

  // GC_MASTER_STABLE_2026_08R10Z14F16_ALL_INPUT_VIEWPORT_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F18_KEYBOARD_DISMISS_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F19_SUGGESTION_DONE_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F21_RIDE_DONE_NATIVE_VIEWPORT_RELEASE
  // While a control is actively edited, keep its on-screen top stable against suggestion/guidance
  // DOM mutations. When the virtual keyboard is dismissed (iOS Done / Android hide), preserve the
  // document scroll position rather than repeatedly re-anchoring against visualViewport.offsetTop.
  // The latter changes during keyboard animation and was the remaining one-frame "shake".
  const GC_VIEWPORT_STABLE_IDS = new Set(['pickup', 'destination', 'fareKm', 'fareMinutes']);
  const GC_KEYBOARD_TEXT_TYPES = new Set(['', 'text', 'search', 'tel', 'url', 'email', 'number']);
  let gcBlurViewportSession = null;
  let gcBlurViewportTimer = 0;
  let gcViewportTailSpacer = null;
  let gcKeyboardDismissSession = null;
  let gcKeyboardDismissReleaseTimer = 0;
  let gcKeyboardDismissMaxTimer = 0;
  let gcRideAddressStableTransaction = null;
  // M2R12: one coordinator owns every post-blur layout commit for the active ride address.
  // Smart-suggestion collapse and progressive-flow updates join the same viewport-settle barrier
  // instead of racing each other while iOS/LINE WebView is still restoring the keyboard viewport.
  let gcRideKeyboardSettleCoordinator = null;
  // R10Z14F19: when a visible smart-suggestion list disappears at the exact same moment
  // the mobile keyboard closes, WebKit can clamp scrollY because document height shrinks
  // mid-animation. A hidden tail spacer temporarily carries only that removed height, then
  // shrinks to the minimum still required to preserve the current viewport.
  let gcSuggestionCollapseSpacer = null;
  let gcSuggestionCollapseSettleTimer = 0;
  let gcKeyboardViewportBaseline = Number(
    window.visualViewport?.height || window.innerHeight || document.documentElement?.clientHeight || 0
  );

  function clearViewportTailSpacer() {
    if (!gcViewportTailSpacer) return;
    gcViewportTailSpacer.remove();
    gcViewportTailSpacer = null;
  }

  function ensureSuggestionCollapseSpacer() {
    if (gcSuggestionCollapseSpacer?.isConnected) return gcSuggestionCollapseSpacer;
    gcSuggestionCollapseSpacer = document.createElement('div');
    gcSuggestionCollapseSpacer.id = 'gcSuggestionCollapseSpacer';
    gcSuggestionCollapseSpacer.setAttribute('aria-hidden', 'true');
    gcSuggestionCollapseSpacer.style.cssText = 'display:block;width:1px;min-width:1px;height:0;pointer-events:none;visibility:hidden;';
    document.body.appendChild(gcSuggestionCollapseSpacer);
    return gcSuggestionCollapseSpacer;
  }

  function reserveSuggestionCollapseCapacity(box) {
    if (!box || box.classList.contains('hidden')) return false;
    const rect = box.getBoundingClientRect();
    if (rect.height <= 1) return false;
    const style = getComputedStyle(box);
    const outerHeight = Math.ceil(
      rect.height +
      (Number.parseFloat(style.marginTop) || 0) +
      (Number.parseFloat(style.marginBottom) || 0)
    );
    if (outerHeight <= 1) return false;
    const spacer = ensureSuggestionCollapseSpacer();
    const current = Number.parseFloat(spacer.style.height) || 0;
    spacer.style.height = `${Math.ceil(current + outerHeight)}px`;
    return true;
  }

  function settleSuggestionCollapseSpacer({ force = false } = {}) {
    const spacer = gcSuggestionCollapseSpacer;
    if (!spacer?.isConnected) return;
    if (!force && (gcKeyboardDismissSession || rideKeyboardDismissPending() || document.body?.style.position === 'fixed')) return;
    clearTimeout(gcSuggestionCollapseSettleTimer);
    gcSuggestionCollapseSettleTimer = 0;
    if (force) {
      spacer.remove();
      gcSuggestionCollapseSpacer = null;
      return;
    }
    const spacerHeight = Math.max(0, spacer.getBoundingClientRect().height);
    if (spacerHeight <= 2) {
      spacer.remove();
      gcSuggestionCollapseSpacer = null;
      return;
    }
    const scrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
    const layoutHeight = Math.max(1, window.innerHeight || document.documentElement?.clientHeight || 0);
    const naturalScrollHeight = Math.max(0, document.documentElement.scrollHeight - spacerHeight);
    const minimumNeeded = Math.max(0, Math.ceil(scrollY + layoutHeight - naturalScrollHeight + 2));
    if (minimumNeeded <= 2) {
      spacer.remove();
      gcSuggestionCollapseSpacer = null;
      return;
    }
    spacer.style.height = `${Math.min(Math.ceil(spacerHeight), minimumNeeded)}px`;
  }

  function scheduleSuggestionCollapseSettle(delay = 90) {
    if (!gcSuggestionCollapseSpacer?.isConnected) return;
    clearTimeout(gcSuggestionCollapseSettleTimer);
    gcSuggestionCollapseSettleTimer = setTimeout(() => {
      if (gcKeyboardDismissSession || rideKeyboardDismissPending() || document.body?.style.position === 'fixed') {
        scheduleSuggestionCollapseSettle(90);
        return;
      }
      settleSuggestionCollapseSpacer();
    }, delay);
  }

  function ensureFareNumberViewportCapacity(session) {
    if (!session || !['fareKm', 'fareMinutes'].includes(session.input?.id)) return;
    const viewportHeight = Number(window.visualViewport?.height || window.innerHeight || 0);
    if (!viewportHeight) return;
    const desiredScrollY = Math.max(0, session.docTop - session.anchorTop);
    const maxScrollY = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
    const missing = Math.ceil(desiredScrollY - maxScrollY);
    if (missing <= 1) return;
    if (!gcViewportTailSpacer) {
      gcViewportTailSpacer = document.createElement('div');
      gcViewportTailSpacer.id = 'gcViewportTailSpacer';
      gcViewportTailSpacer.setAttribute('aria-hidden', 'true');
      gcViewportTailSpacer.style.cssText = 'display:block;width:1px;min-width:1px;pointer-events:none;visibility:hidden;';
      document.body.appendChild(gcViewportTailSpacer);
    }
    gcViewportTailSpacer.style.height = `${missing + 2}px`;
  }

  function activeModeForViewportStability() {
    return new URLSearchParams(location.search).get('mode');
  }

  function viewportStableInputEligible(input) {
    if (!input || !GC_VIEWPORT_STABLE_IDS.has(input.id)) return false;
    const activeMode = activeModeForViewportStability();
    // F22: fare number fields sit above the result area, so their own UI updates do not need
    // JavaScript scroll anchoring. Let the mobile browser position them natively; the address
    // fields keep the existing stabilization path.
    if (activeMode === 'fare') return input.id === 'pickup' || input.id === 'destination';
    return ['call', 'driver'].includes(activeMode) && (input.id === 'pickup' || input.id === 'destination');
  }

  function rideAddressKeyboardDismissInputEligible(input) {
    if (!input || !input.isConnected || !input.closest?.('#serviceForm')) return false;
    const activeMode = activeModeForViewportStability();
    return ['call', 'driver'].includes(activeMode) && (input.id === 'pickup' || input.id === 'destination');
  }

  function rideKeyboardDismissPending() {
    const session = gcBlurViewportSession;
    return Boolean(
      session?.passiveRideDismiss &&
      !session.viewportSettled &&
      performance.now() <= session.expiresAt
    );
  }

  function keyboardDismissInputEligible(input) {
    if (!input || !input.isConnected || !input.closest?.('#app')) return false;
    const activeMode = activeModeForViewportStability();
    if (!['call', 'driver', 'fare'].includes(activeMode)) return false;
    if (input.disabled || input.readOnly) return false;
    // F22: do not body-freeze or re-anchor fareMinutes/fareKm on Done/refocus. Native mobile
    // viewport behavior is smoother here; result-height release is handled separately below.
    if (activeMode === 'fare' && (input.id === 'fareKm' || input.id === 'fareMinutes')) return false;
    if (input.tagName === 'TEXTAREA') return true;
    if (input.tagName !== 'INPUT') return false;
    return GC_KEYBOARD_TEXT_TYPES.has(String(input.type || '').toLowerCase());
  }

  function viewportStableTop(input) {
    const viewportOffset = Number(window.visualViewport?.offsetTop || 0);
    return input.getBoundingClientRect().top - viewportOffset;
  }

  function otherEditorHasFocus(input) {
    const active = document.activeElement;
    if (!active || active === input) return false;
    return keyboardDismissInputEligible(active);
  }

  function captureKeyboardViewportBaseline() {
    const current = Number(
      window.visualViewport?.height || window.innerHeight || document.documentElement?.clientHeight || 0
    );
    if (current > gcKeyboardViewportBaseline) gcKeyboardViewportBaseline = current;
  }

  function keyboardAppearsOpen() {
    const viewport = window.visualViewport;
    if (!viewport) return false;
    const current = Number(viewport.height || 0);
    if (!current) return false;
    return gcKeyboardViewportBaseline - current >= 72;
  }

  function restoreBodyInlineStyle(body, snapshot) {
    if (!body || !snapshot) return;
    for (const [key, value] of Object.entries(snapshot)) body.style[key] = value;
  }

  function releaseKeyboardDismissFreeze(session, { immediate = false } = {}) {
    if (!session || gcKeyboardDismissSession !== session) return;
    clearTimeout(gcKeyboardDismissReleaseTimer);
    clearTimeout(gcKeyboardDismissMaxTimer);
    gcKeyboardDismissReleaseTimer = 0;
    gcKeyboardDismissMaxTimer = 0;
    gcKeyboardDismissSession = null;
    if (session.frozen) {
      const body = document.body;
      const modalOwnsViewport = body.classList.contains('modal-open') || body.classList.contains('gc-modal-lock');
      if (!modalOwnsViewport) {
        restoreBodyInlineStyle(body, session.bodyStyle);
        const restoreY = Math.max(0, session.scrollY);
        const restore = () => window.scrollTo(0, restoreY);
        restore();
        requestAnimationFrame(restore);
        if (!immediate) setTimeout(restore, 46);
      }
    }
    captureKeyboardViewportBaseline();
    scheduleSuggestionCollapseSettle(72);
  }

  function scheduleKeyboardDismissRelease(session, delay = 135) {
    if (!session || gcKeyboardDismissSession !== session) return;
    clearTimeout(gcKeyboardDismissReleaseTimer);
    gcKeyboardDismissReleaseTimer = setTimeout(() => releaseKeyboardDismissFreeze(session), delay);
  }

  function activateKeyboardDismissFreeze(session) {
    if (!session || gcBlurViewportSession !== session || gcKeyboardDismissSession) return;
    const active = document.activeElement;
    // Pressing Done leaves focus on body; tapping another field/button transfers focus elsewhere.
    // Do not freeze in that second case, otherwise a same-gesture submit/modal could inherit stale body styles.
    if (otherEditorHasFocus(session.input) || active === session.input) return;
    if (active && active !== document.body && active !== document.documentElement) return;
    if (!keyboardAppearsOpen()) return;
    const body = document.body;
    if (!body || getComputedStyle(body).position === 'fixed' || body.classList.contains('modal-open')) return;
    session.bodyStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow
    };
    session.frozen = true;
    gcKeyboardDismissSession = session;
    body.style.position = 'fixed';
    body.style.top = `-${session.scrollY}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    // Keep overflow untouched: WebKit may still use it while animating the keyboard viewport.
    scheduleKeyboardDismissRelease(session, 420);
    gcKeyboardDismissMaxTimer = setTimeout(() => releaseKeyboardDismissFreeze(session), 900);
  }

  function restoreViewportStableSession(session) {
    if (!session || !session.input?.isConnected) return;
    if (otherEditorHasFocus(session.input)) return;
    // F21: call/driver address Done uses a passive dismissal session. Let WebKit restore the
    // visual viewport natively; do not fix body position and do not issue scroll corrections.
    if (session.passiveRideDismiss) return;
    // During keyboard dismissal the desired invariant is document scrollY. visualViewport.offsetTop
    // changes as the keyboard closes, so using it as an anchor creates the visible one-frame bounce.
    if (session.blurPhase) {
      if (gcKeyboardDismissSession === session && session.frozen) return;
      const currentScrollY = window.scrollY || window.pageYOffset || 0;
      if (Math.abs(currentScrollY - session.scrollY) > 1) window.scrollTo(0, session.scrollY);
      return;
    }
    ensureFareNumberViewportCapacity(session);
    const currentTop = viewportStableTop(session.input);
    const topDelta = currentTop - session.anchorTop;
    if (Math.abs(topDelta) > 1) {
      window.scrollBy(0, topDelta);
      return;
    }
    const currentScrollY = window.scrollY || window.pageYOffset || 0;
    if (Math.abs(currentScrollY - session.scrollY) > 1) window.scrollTo(0, session.scrollY);
  }

  function beginBlurViewportStability(input) {
    if (!keyboardDismissInputEligible(input)) return;
    const passiveRideDismiss = rideAddressKeyboardDismissInputEligible(input);
    const session = {
      input,
      anchorTop: viewportStableTop(input),
      scrollY: window.scrollY || window.pageYOffset || 0,
      docTop: input.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0),
      blurPhase: true,
      expiresAt: performance.now() + (passiveRideDismiss ? 1200 : 980),
      frozen: false,
      passiveRideDismiss,
      viewportSettled: !passiveRideDismiss
    };
    gcBlurViewportSession = session;
    clearTimeout(gcBlurViewportTimer);

    if (passiveRideDismiss) {
      // F21: call/driver address fields must not compete with iOS keyboard dismissal.
      // No body position:fixed, no scrollTo/scrollBy, and no top re-anchoring during blur.
      gcBlurViewportTimer = setTimeout(() => {
        if (gcBlurViewportSession === session) {
          session.viewportSettled = true;
          gcBlurViewportSession = null;
          scheduleSuggestionCollapseSettle(72);
        }
      }, 1220);
      return;
    }

    // Preserve enough document height for fare number fields before the body is temporarily frozen.
    ensureFareNumberViewportCapacity(session);
    // A same-gesture focus transfer completes before this microtask; otherwise the keyboard is
    // dismissing and the current document position is frozen before the next painted frame.
    queueMicrotask(() => activateKeyboardDismissFreeze(session));
    const restore = () => {
      if (gcBlurViewportSession !== session || performance.now() > session.expiresAt) return;
      restoreViewportStableSession(session);
    };
    [0, 70, 180, 360, 620, 880].forEach(delay => setTimeout(restore, delay));
    gcBlurViewportTimer = setTimeout(() => {
      if (gcBlurViewportSession === session) gcBlurViewportSession = null;
    }, 1000);
  }

  document.addEventListener('focusin', event => {
    const input = event.target;
    if (!keyboardDismissInputEligible(input)) return;
    if (gcKeyboardDismissSession) releaseKeyboardDismissFreeze(gcKeyboardDismissSession, { immediate: true });
    clearViewportTailSpacer();
    settleSuggestionCollapseSpacer();
    gcBlurViewportSession = null;
    clearTimeout(gcBlurViewportTimer);
    captureKeyboardViewportBaseline();
  }, true);
  document.addEventListener('focusout', event => beginBlurViewportStability(event.target), true);

  const restoreBlurViewportOnVisualChange = () => {
    const session = gcBlurViewportSession;
    if (!session || performance.now() > session.expiresAt) return;
    if (session.passiveRideDismiss) return;
    if (gcKeyboardDismissSession === session) {
      // Release only after resize/scroll events have stopped, so the keyboard close is one continuous
      // transition rather than a tug-of-war between WebKit and JavaScript scroll corrections.
      scheduleKeyboardDismissRelease(session, 140);
      return;
    }
    requestAnimationFrame(() => restoreViewportStableSession(session));
  };
  window.visualViewport?.addEventListener('resize', restoreBlurViewportOnVisualChange, { passive: true });
  window.visualViewport?.addEventListener('scroll', restoreBlurViewportOnVisualChange, { passive: true });
  window.addEventListener('scroll', () => scheduleSuggestionCollapseSettle(72), { passive: true });

  function runAfterRideKeyboardDismissSettles(input, callback, { minDelay = 320, maxDelay = 1180 } = {}) {
    if (typeof callback !== 'function') return;
    if (!rideAddressKeyboardDismissInputEligible(input)) {
      setTimeout(callback, 180);
      return;
    }

    const now = performance.now();
    const blurSession = gcBlurViewportSession?.input === input ? gcBlurViewportSession : null;
    const existing = gcRideKeyboardSettleCoordinator;
    if (existing && !existing.done && existing.input === input && (now - existing.startedAt) <= 120) {
      existing.callbacks.push(callback);
      existing.minDelay = Math.max(existing.minDelay, Number(minDelay) || 0);
      existing.maxDelay = Math.max(existing.maxDelay, Number(maxDelay) || 0);
      existing.refreshMaxTimer();
      return;
    }

    const viewport = window.visualViewport;
    const initialHeight = Number(viewport?.height || window.innerHeight || document.documentElement?.clientHeight || 0);
    const initialOffsetTop = Number(viewport?.offsetTop || 0);
    const baselineHeight = Math.max(Number(gcKeyboardViewportBaseline || 0), initialHeight);
    const keyboardWasOpen = Boolean(
      viewport && baselineHeight > 0 && initialHeight > 0 &&
      ((baselineHeight - initialHeight) >= 72 || keyboardAppearsOpen())
    );

    const coordinator = {
      input,
      blurSession,
      startedAt: now,
      initialHeight,
      initialOffsetTop,
      baselineHeight,
      keyboardWasOpen,
      callbacks: [callback],
      minDelay: Math.max(260, Number(minDelay) || 0),
      maxDelay: Math.max(820, Number(maxDelay) || 0),
      lastHeight: initialHeight,
      lastOffsetTop: initialOffsetTop,
      stableFrames: 0,
      raf: 0,
      maxTimer: 0,
      done: false,
      refreshMaxTimer: null
    };
    gcRideKeyboardSettleCoordinator = coordinator;

    const cleanup = () => {
      if (coordinator.raf) cancelAnimationFrame(coordinator.raf);
      coordinator.raf = 0;
      clearTimeout(coordinator.maxTimer);
      coordinator.maxTimer = 0;
    };

    const markViewportSettled = () => {
      const session = gcBlurViewportSession?.input === input ? gcBlurViewportSession : coordinator.blurSession;
      if (session?.passiveRideDismiss) session.viewportSettled = true;
    };

    const finish = () => {
      if (coordinator.done) return;
      coordinator.done = true;
      cleanup();
      markViewportSettled();
      if (gcRideKeyboardSettleCoordinator === coordinator) gcRideKeyboardSettleCoordinator = null;
      const callbacks = coordinator.callbacks.splice(0);
      // Commit every waiting mutation in one settled turn. No scrollTo/scrollBy is issued here;
      // WebKit keeps ownership of the native keyboard viewport transition from start to finish.
      callbacks.forEach(fn => {
        try { fn(); } catch (error) { setTimeout(() => { throw error; }, 0); }
      });
      scheduleSuggestionCollapseSettle(96);
    };

    const cancelForRefocus = () => {
      if (coordinator.done) return;
      coordinator.done = true;
      cleanup();
      markViewportSettled();
      if (gcRideKeyboardSettleCoordinator === coordinator) gcRideKeyboardSettleCoordinator = null;
      scheduleSuggestionCollapseSettle(96);
    };

    coordinator.refreshMaxTimer = () => {
      clearTimeout(coordinator.maxTimer);
      const elapsed = performance.now() - coordinator.startedAt;
      coordinator.maxTimer = setTimeout(finish, Math.max(40, coordinator.maxDelay - elapsed + 40));
    };

    const poll = () => {
      if (coordinator.done) return;
      if (document.activeElement === input) { cancelForRefocus(); return; }
      // A direct tap into another editor is a focus transfer, not a keyboard dismissal. The new
      // editor owns the keyboard, so finish the old field's queued mutations without waiting for
      // a nonexistent close animation.
      if (otherEditorHasFocus(input)) { finish(); return; }

      const height = Number(viewport?.height || window.innerHeight || document.documentElement?.clientHeight || 0);
      const offsetTop = Number(viewport?.offsetTop || 0);
      const viewportStable = Math.abs(height - coordinator.lastHeight) <= 0.5 && Math.abs(offsetTop - coordinator.lastOffsetTop) <= 0.5;
      coordinator.stableFrames = viewportStable ? coordinator.stableFrames + 1 : 0;
      coordinator.lastHeight = height;
      coordinator.lastOffsetTop = offsetTop;

      const elapsed = performance.now() - coordinator.startedAt;
      const recoveredByBaseline = !coordinator.keyboardWasOpen || height >= coordinator.baselineHeight - 48;
      const recoveredByGrowth = !coordinator.keyboardWasOpen || height >= coordinator.initialHeight + 64;
      const viewportRecovered = recoveredByBaseline || recoveredByGrowth || !keyboardAppearsOpen();
      const bodyReleased = document.body?.style.position !== 'fixed';

      // Do not mistake the temporarily stable *keyboard-open* viewport for completion. That was
      // the intermittent race: suggestion/progressive DOM height changed first, then iOS restored
      // visualViewport and violently re-clamped scroll. Require real viewport recovery first.
      if (elapsed >= coordinator.minDelay && coordinator.stableFrames >= 4 && viewportRecovered && bodyReleased) {
        finish();
        return;
      }
      if (elapsed >= coordinator.maxDelay) { finish(); return; }
      coordinator.raf = requestAnimationFrame(poll);
    };

    coordinator.refreshMaxTimer();
    coordinator.raf = requestAnimationFrame(poll);
  }
  window.GC_runAfterRideKeyboardDismissSettles = runAfterRideKeyboardDismissSettles;

  function mutateRideAddressUiStable(input, mutator) {
    // M2R5: an explicit smart-suggestion tap is committed as one viewport-stable transaction.
    // Nested UI mutations (suggestion collapse, admin hint, progressive reveal) must not each
    // issue their own scroll correction; the outer transaction restores the anchor once.
    if (gcRideAddressStableTransaction?.input === input) return mutator();
    if (!viewportStableInputEligible(input)) return mutator();
    const activeSession = document.activeElement === input
      ? { input, anchorTop: viewportStableTop(input), scrollY: window.scrollY || window.pageYOffset || 0, docTop: input.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0), blurPhase: false }
      : (gcBlurViewportSession?.input === input && performance.now() <= gcBlurViewportSession.expiresAt
        ? gcBlurViewportSession
        : null);
    if (!activeSession) return mutator();

    const result = mutator();
    const restore = () => {
      if (document.activeElement !== input && gcBlurViewportSession?.input !== input) return;
      restoreViewportStableSession(activeSession);
    };
    requestAnimationFrame(() => { restore(); requestAnimationFrame(restore); });
    setTimeout(restore, 54);
    setTimeout(restore, 148);
    return result;
  }

  function runRideAddressUiStableTransaction(input, mutator) {
    if (gcRideAddressStableTransaction?.input === input || !viewportStableInputEligible(input)) return mutator();
    const activeSession = document.activeElement === input
      ? { input, anchorTop: viewportStableTop(input), scrollY: window.scrollY || window.pageYOffset || 0, docTop: input.getBoundingClientRect().top + (window.scrollY || window.pageYOffset || 0), blurPhase: false }
      : (gcBlurViewportSession?.input === input && performance.now() <= gcBlurViewportSession.expiresAt
        ? gcBlurViewportSession
        : null);
    if (!activeSession) return mutator();

    const transaction = { input, activeSession };
    gcRideAddressStableTransaction = transaction;
    let result;
    try {
      result = mutator();
    } finally {
      if (gcRideAddressStableTransaction === transaction) gcRideAddressStableTransaction = null;
    }
    const restore = () => {
      if (document.activeElement !== input && gcBlurViewportSession?.input !== input) return;
      restoreViewportStableSession(activeSession);
    };
    requestAnimationFrame(() => { restore(); requestAnimationFrame(restore); });
    setTimeout(restore, 58);
    setTimeout(restore, 150);
    return result;
  }
  window.GC_mutateInputViewportStable = mutateRideAddressUiStable;
  window.GC_clearViewportTailSpacer = clearViewportTailSpacer;
  window.addEventListener('pagehide', () => {
    if (gcKeyboardDismissSession) releaseKeyboardDismissFreeze(gcKeyboardDismissSession, { immediate: true });
    clearViewportTailSpacer();
    clearLocationManualSwitchSpacer();
    settleSuggestionCollapseSpacer({ force: true });
  }, { passive: true });

  function hideAddressSuggestions(id) {
    const input = document.getElementById(id);
    const box = document.getElementById(`${id}Suggest`);
    if (!box) return;
    mutateRideAddressUiStable(input, () => {
      box.innerHTML = '';
      box.classList.add('hidden');
    });
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
  function explicitTaiwanDistrictFromLooseAddress(value, county = canonicalTaiwanCounty(value)) {
    const text = normalizeAddress(String(value || '').replace(/臺/g, '台').replace(/　/g, ' '));
    if (!text) return '';
    if (county && county !== '台中市') return '';
    const tokens = text.split(/[\s,，、-]+/).filter(Boolean);
    // Target only real Taichung district names. This prevents POI tokens such as 逢甲夜市／停車區
    // from being mistaken for administrative areas while still recognizing iOS/AutoFill order.
    const districts = tokens.filter(token => ADDRESS_TAICHUNG_DISTRICTS.includes(token));
    return districts.length === 1 ? districts[0] : '';
  }

  function isDoorAddressMissingAdmin(value) {
    const core = dispatchDoorAddressCore(value);
    const county = core.county || canonicalTaiwanCounty(value);
    const district = core.district || explicitTaiwanDistrictFromLooseAddress(value, county);
    return Boolean(core.road && core.house && (!county || !district));
  }

  // R10Z14F11: the non-blocking UI reminder only needs a usable district / township / town.
  // Strict navigation/address validation above is intentionally unchanged. This prevents addresses
  // such as "霧峰區中正路523號" from being nagged only because the county/city text is omitted.
  function isDoorAddressMissingReminderAdmin(value) {
    const core = dispatchDoorAddressCore(value);
    const district = core.district || explicitTaiwanDistrictFromLooseAddress(value, core.county || canonicalTaiwanCounty(value));
    return Boolean(core.road && core.house && !district);
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

  // GC_MASTER_STABLE_2026_08R10Z9Y_SOFT_ADMIN_AMBIGUITY
  // A missing administrative area is advisory, never a validation gate. The quiet first
  // level is local and immediate; the stronger second level appears only when ArcGIS returns
  // two or more high-confidence exact door matches in distinct central-service areas.
  function normalizedDoorIdentityPart(value) {
    return String(value || '')
      .replace(/[\uFF10-\uFF19]/g, digit => String.fromCharCode(digit.charCodeAt(0) - 0xFEE0))
      .replace(/-/g, '之')
      .trim();
  }

  function doorIdentityFromCore(core) {
    if (!core?.road || !core?.house) return '';
    return `${addressConfidenceKey(core.road)}|${normalizedDoorIdentityPart(core.house)}`;
  }

  function adminAmbiguityOptions(query, candidates) {
    const queryCore = dispatchDoorAddressCore(query);
    if (!doorIdentityFromCore(queryCore) || (queryCore.county && queryCore.district)) return [];

    const queryParts = splitTaiwanSuggestionAddress(query);
    const countyHint = explicitTaiwanCountyFromQuery(query) || queryCore.county || '';
    const districtHint = queryParts.district || queryCore.district || '';
    const queryDoor = doorIdentityFromCore(queryCore);
    const centralCounties = new Set(ADDRESS_PRIMARY_REGIONS.map(region => region.name));
    const preciseTypes = new Set(['PointAddress', 'PointAddressInt', 'StreetAddress', 'Subaddress']);
    const seen = new Set();
    const options = [];

    (Array.isArray(candidates) ? candidates : []).forEach(candidate => {
      if (!candidate?.address || Number(candidate.score || 0) < ADDRESS_ADMIN_AMBIGUITY_SCORE_MIN || !preciseTypes.has(candidate.type)) return;
      const core = dispatchDoorAddressCore(candidate.address);
      if (!core.county || !core.district || doorIdentityFromCore(core) !== queryDoor) return;
      const providerRoad = normalizeAddress(candidate.attrs?.StName || '');
      const providerHouse = normalizedDoorIdentityPart(candidate.attrs?.AddNum || '');
      if (providerRoad && addressConfidenceKey(providerRoad) !== addressConfidenceKey(queryCore.road)) return;
      if (providerHouse && providerHouse !== normalizedDoorIdentityPart(queryCore.house)) return;
      if (countyHint && core.county !== countyHint) return;
      if (districtHint && core.district !== districtHint) return;
      // With no county supplied, stay inside the product's existing central-service scope;
      // equally named doors elsewhere in Taiwan must not create a noisy local warning.
      if (!countyHint && !centralCounties.has(core.county)) return;
      const key = `${core.county}|${core.district}`;
      if (seen.has(key)) return;
      seen.add(key);
      options.push({ county: core.county, district: core.district, admin: `${core.county}${core.district}` });
    });

    if (options.length < 2) return [];
    const districtCounts = options.reduce((counts, option) => {
      counts.set(option.district, (counts.get(option.district) || 0) + 1);
      return counts;
    }, new Map());
    return options.slice(0, 3).map(option => ({
      ...option,
      label: districtCounts.get(option.district) > 1 ? option.admin : option.district
    }));
  }

  function adminAreaText(options, separator = 'word') {
    const labels = (Array.isArray(options) ? options : []).map(option => option.label).filter(Boolean);
    if (separator === 'line') return labels.join('／');
    if (labels.length < 2) return labels[0] || '';
    if (labels.length === 2) return `${labels[0]}或${labels[1]}`;
    return `${labels.slice(0, -1).join('、')}或${labels[labels.length - 1]}`;
  }

  async function fetchAdminDoorCandidates(query, maxLocations = 20) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    // This is a non-blocking background lookup. Give the public geocoder enough time to
    // return cross-district matches without extending the independent 1.2s submit budget.
    const timeoutId = setTimeout(() => controller?.abort(), ADDRESS_ADMIN_LOOKUP_TIMEOUT_MS);
    try {
      const params = new URLSearchParams({
        f: 'json',
        SingleLine: query,
        sourceCountry: 'TWN',
        countryCode: 'TWN',
        langCode: 'zh-TW',
        preferredLabelValues: 'localCity',
        outFields: ARCGIS_RESOLVE_OUT_FIELDS,
        maxLocations: String(Math.max(1, Math.min(50, Number(maxLocations || 20)))),
        searchExtent: ADDRESS_TAICHUNG_EXTENT,
        category: 'Address',
        matchOutOfRange: 'false'
      });
      // This lookup intentionally has no location bias. It answers a different question from
      // autocomplete: whether the exact road + door exists in more than one service district.
      const response = await fetch(`https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?${params.toString()}`, {
        method: 'GET', mode: 'cors', credentials: 'omit', cache: 'no-store', signal: controller?.signal
      });
      if (!response.ok) return { ok: false, candidates: [] };
      const data = await response.json();
      const candidates = (Array.isArray(data?.candidates) ? data.candidates : [])
        .map(candidate => resolvedCandidateFromArcgis(candidate, query))
        .filter(Boolean);
      return { ok: true, candidates };
    } catch (_) {
      return { ok: false, candidates: [] };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  function discoveredAdminDistricts(query, candidates) {
    const queryCore = dispatchDoorAddressCore(query);
    const roadKey = addressConfidenceKey(queryCore.road);
    if (!roadKey) return [];
    const seen = new Set();
    const districts = [];
    (Array.isArray(candidates) ? candidates : []).forEach(candidate => {
      const core = dispatchDoorAddressCore(candidate?.address || '');
      if (core.county !== '台中市' || !core.district || addressConfidenceKey(core.road) !== roadKey || seen.has(core.district)) return;
      seen.add(core.district);
      districts.push(core.district);
    });
    return districts.slice(0, 6);
  }

  async function lookupAddressAdminGuidance(query) {
    const normalized = smartNormalizeTaiwanAddress(query);
    const queryKey = addressConfidenceKey(normalized);
    if (!queryKey || !isDoorAddressMissingAdmin(normalized)) {
      return { state: 'none', queryKey, query: normalized, options: [] };
    }

    const cached = addressAdminAmbiguityResults.get(queryKey);
    if (cached && cached.expiresAt > Date.now()) return cached.result;

    const exact = await fetchAdminDoorCandidates(normalized, 20);
    if (!exact.ok) return { state: 'soft', queryKey, query: normalized, options: [], networkUnavailable: true };
    let candidates = exact.candidates;
    let options = adminAmbiguityOptions(normalized, candidates);
    let lookupComplete = true;

    // ArcGIS occasionally collapses same-road results. Discover only the districts in which the
    // same road exists, then verify the exact door in those few districts. This avoids a noisy
    // 29-district sweep while still catching real cross-district duplicates such as 公園路188號.
    if (options.length < 2) {
      const core = dispatchDoorAddressCore(normalized);
      const roadSearch = await fetchAdminDoorCandidates(`台中市${core.road}`, 50);
      if (!roadSearch.ok) lookupComplete = false;
      const districts = roadSearch.ok ? discoveredAdminDistricts(normalized, roadSearch.candidates) : [];
      if (districts.length >= 2) {
        const verifiedSets = await Promise.all(districts.map(district => fetchAdminDoorCandidates(`台中市${district}${core.detail}`, 1)));
        if (verifiedSets.some(result => !result.ok)) lookupComplete = false;
        candidates = candidates.concat(verifiedSets.filter(result => result.ok).flatMap(result => result.candidates));
        options = adminAmbiguityOptions(normalized, candidates);
      }
    }

    const result = options.length >= 2
      ? { state: 'strong', queryKey, query: normalized, options, networkUnavailable: !lookupComplete }
      : { state: 'soft', queryKey, query: normalized, options: [], networkUnavailable: !lookupComplete };
    if (addressAdminAmbiguityResults.size >= 40) {
      const firstKey = addressAdminAmbiguityResults.keys().next().value;
      if (firstKey) addressAdminAmbiguityResults.delete(firstKey);
    }
    // Never cache a partial network result. A later blur/submit should be allowed to retry
    // immediately instead of treating a transient provider failure as evidence of uniqueness.
    if (lookupComplete) {
      addressAdminAmbiguityResults.set(queryKey, {
        result,
        expiresAt: Date.now() + (result.state === 'strong' ? 5 * 60 * 1000 : 30 * 1000)
      });
    }
    return result;
  }

  function pickupStatusElement(input) {
    return input?.id === 'pickup' ? document.getElementById('locationStatus') : null;
  }

  function clearPickupAdminReminder(input) {
    const status = pickupStatusElement(input);
    input._gcAdminAmbiguity = null;
    if (!status || status.dataset.gcStatusOwner !== 'admin-ambiguity') return;
    mutateRideAddressUiStable(input, () => {
      status.textContent = '';
      status.className = 'location-status';
      delete status.dataset.gcStatusOwner;
    });
  }

  function pickupAdminReminderEligible(input, query = input?.value || '') {
    if (!input || input.id !== 'pickup') return false;
    // A live GPS pin owns the single status slot. Once the rider deliberately
    // replaces it with text and the stale pin is no longer sent, the typed
    // address may receive the same non-blocking administrative-area guidance.
    const activeLocation = Boolean(attachedLocation && attachedLocation.sendMap !== false);
    if (activeLocation) return false;
    return isDoorAddressMissingReminderAdmin(query);
  }

  function renderPickupAdminReminder(input, evidence = null) {
    const status = pickupStatusElement(input);
    const query = smartNormalizeTaiwanAddress(input?.value || '');
    if (!status || !pickupAdminReminderEligible(input, query)) {
      clearPickupAdminReminder(input);
      return;
    }

    const queryKey = addressConfidenceKey(query);
    const usableEvidence = evidence?.queryKey === queryKey && evidence.options?.length >= 2 ? evidence : null;
    input._gcAdminAmbiguity = usableEvidence;
    mutateRideAddressUiStable(input, () => {
      // A stale location error/success is replaced when the rider has moved on to typed text.
      // Live GPS and confirmed-location states are protected by attachedLocation above.
      if (status.dataset.gcStatusOwner === 'location') {
        status.textContent = '';
        status.className = 'location-status';
      }
      status.dataset.gcStatusOwner = 'admin-ambiguity';

      if (!usableEvidence) {
        status.className = 'location-status is-address-admin-soft';
        status.textContent = 'ⓘ 建議補上行政區，避免同名路段派錯車';
        return;
      }

      const areaText = adminAreaText(usableEvidence.options);
      status.className = 'location-status is-address-admin-strong';
      status.innerHTML = `<strong>此門牌可能位於${escapeHtml(areaText)}，請確認上車地區。</strong>
        <span class="gc-address-admin-options" role="group" aria-label="選擇上車行政區">
          ${usableEvidence.options.map((option, index) => `<button type="button" data-admin-option="${index}" aria-label="選擇${escapeHtml(option.admin)}">${escapeHtml(option.label)}</button>`).join('')}
        </span>`;
    });
  }

  function lookupPickupAdminAmbiguity(query) {
    const normalized = smartNormalizeTaiwanAddress(query);
    const queryKey = addressConfidenceKey(normalized);
    if (!queryKey || !isDoorAddressMissingAdmin(normalized)) return Promise.resolve(null);
    const existing = addressAdminAmbiguityChecks.get(queryKey);
    if (existing) return existing;

    const promise = lookupAddressAdminGuidance(normalized)
      .then(result => result.state === 'strong' ? result : null)
      .catch(() => null);
    addressAdminAmbiguityChecks.set(queryKey, promise);
    const release = () => {
      if (addressAdminAmbiguityChecks.get(queryKey) === promise) addressAdminAmbiguityChecks.delete(queryKey);
    };
    promise.then(release, release);
    return promise;
  }

  function startPickupAdminAmbiguityLookup(input, query = input?.value || '') {
    const normalized = smartNormalizeTaiwanAddress(query);
    if (!pickupAdminReminderEligible(input, normalized)) {
      clearPickupAdminReminder(input);
      return Promise.resolve(null);
    }

    const queryKey = addressConfidenceKey(normalized);
    const token = String(++addressAdminAmbiguityToken);
    input.dataset.gcAdminAmbiguityToken = token;
    const promise = lookupPickupAdminAmbiguity(normalized);
    input._gcAdminAmbiguityPromise = promise;
    input._gcAdminAmbiguityPromiseKey = queryKey;
    promise.then(evidence => {
      const currentKey = addressConfidenceKey(input.value);
      if (input.dataset.gcAdminAmbiguityToken !== token || currentKey !== queryKey || !pickupAdminReminderEligible(input, input.value)) return;
      renderPickupAdminReminder(input, evidence);
    });
    return promise;
  }

  function queuePickupAdminAmbiguity(input, delay = ADDRESS_SUGGEST_DEBOUNCE_MS) {
    if (!input || input.id !== 'pickup') return;
    clearTimeout(input._gcAdminAmbiguityTimer);
    input.dataset.gcAdminAmbiguityToken = String(++addressAdminAmbiguityToken);
    input._gcAdminAmbiguityPromise = null;
    input._gcAdminAmbiguityPromiseKey = '';
    const status = pickupStatusElement(input);
    if (!attachedLocation && status?.dataset.gcStatusOwner === 'location') {
      status.textContent = '';
      status.className = 'location-status';
      delete status.dataset.gcStatusOwner;
    }
    renderPickupAdminReminder(input);
    if (!pickupAdminReminderEligible(input, input.value)) return;
    input._gcAdminAmbiguityTimer = setTimeout(() => startPickupAdminAmbiguityLookup(input), Math.max(0, delay));
  }

  async function pickupAdminAmbiguityForSubmit(input) {
    if (!input || input.id !== 'pickup') return null;
    clearTimeout(input._gcAdminAmbiguityTimer);
    const query = smartNormalizeTaiwanAddress(input.value);
    const queryKey = addressConfidenceKey(query);
    renderPickupAdminReminder(input, input._gcAdminAmbiguity);
    if (!pickupAdminReminderEligible(input, query)) return null;
    if (input._gcAdminAmbiguity?.queryKey === queryKey) return input._gcAdminAmbiguity;

    const pending = input._gcAdminAmbiguityPromiseKey === queryKey && input._gcAdminAmbiguityPromise
      ? input._gcAdminAmbiguityPromise
      : startPickupAdminAmbiguityLookup(input, query);
    const timedOut = Symbol('admin-ambiguity-timeout');
    let timeoutId = 0;
    const result = await Promise.race([
      pending,
      new Promise(resolve => { timeoutId = setTimeout(() => resolve(timedOut), ADDRESS_ADMIN_AMBIGUITY_SUBMIT_WAIT_MS); })
    ]);
    clearTimeout(timeoutId);
    if (addressConfidenceKey(input.value) !== queryKey || !pickupAdminReminderEligible(input, input.value)) return null;
    if (result !== timedOut) renderPickupAdminReminder(input, result);
    return input._gcAdminAmbiguity?.queryKey === queryKey ? input._gcAdminAmbiguity : null;
  }

  function applyPickupAdminOption(input, optionIndex) {
    const evidence = input?._gcAdminAmbiguity;
    const option = evidence?.options?.[Number(optionIndex)];
    if (!input || !option || evidence.queryKey !== addressConfidenceKey(input.value)) return;
    const core = dispatchDoorAddressCore(input.value);
    if (!core.detail || doorIdentityFromCore(core) === '') return;
    const selected = smartNormalizeTaiwanAddress(`${option.county}${option.district}${core.detail}`);
    if (!selected) return;

    clearTimeout(input._gcAdminAmbiguityTimer);
    input.dataset.gcAdminAmbiguityToken = String(++addressAdminAmbiguityToken);
    input._gcCancelSmartSuggestions?.();
    input.value = selected;
    input.dataset.gcSkipSuggestOnce = '1';
    markAddressVerified(input, 'ambiguity-region-choice', selected);
    clearPickupAdminReminder(input);
    input.classList.remove('invalid', 'gc-address-needs-choice');
    document.getElementById('pickupError')?.classList.remove('show');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function applyAddressAdminOption(inputOrId, evidence, optionIndex, source = 'admin-choice') {
    const input = typeof inputOrId === 'string' ? document.getElementById(inputOrId) : inputOrId;
    const option = evidence?.options?.[Number(optionIndex)];
    if (!input || !option || evidence.queryKey !== addressConfidenceKey(input.value)) return false;
    const core = dispatchDoorAddressCore(input.value);
    if (!core.detail || !doorIdentityFromCore(core)) return false;
    const selected = smartNormalizeTaiwanAddress(`${option.county}${option.district}${core.detail}`);
    if (!selected) return false;
    if (input.id === 'pickup' && attachedLocation) clearAttachedLocation(false);
    input._gcCancelSmartSuggestions?.();
    input.dataset.gcSkipSuggestOnce = '1';
    input.value = selected;
    markAddressVerified(input, source, selected);
    if (input.id === 'pickup') clearPickupAdminReminder(input);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }

  window.GC_addressNeedsAdmin = isDoorAddressMissingAdmin;
  window.GC_getAddressAdminGuidance = lookupAddressAdminGuidance;
  window.GC_applyAddressAdminOption = applyAddressAdminOption;

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
    mutateRideAddressUiStable(input, () => {
      box.innerHTML = suggestions.map((item, index) => renderAddressSuggestion(item, index)).join('');
      box._gcSuggestions = suggestions;
      box.classList.remove('hidden');
    });
  }

  async function verifyAddressField(id, options = {}) {
    const input = document.getElementById(id);
    if (!input) return Boolean(options.allowEmpty);
    const normalized = normalizeAddressInput(id);
    if (!normalized) return Boolean(options.allowEmpty);

    // R10Z9L: in every passenger-facing form, smart address results are assistance only.
    // Once a non-empty value exists, county/district completeness and suggestion selection
    // may not block call, driver, fare, Google Maps, or favorite-trip actions.
    if (options.policy === 'manual-authoritative') {
      hideAddressSuggestions(id);
      input.classList.remove('gc-address-needs-choice');
      clearFieldValidation(id);
      return true;
    }

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
      const invalidateSmartSuggestionRequest = () => {
        clearTimeout(timer);
        localToken = ++addressSuggestRequestToken;
      };
      const cancelSmartSuggestionSession = () => {
        invalidateSmartSuggestionRequest();
        hideAddressSuggestions(id);
      };
      input._gcCancelSmartSuggestions = cancelSmartSuggestionSession;

      const adminStatus = pickupStatusElement(input);
      if (adminStatus && adminStatus.dataset.gcAdminOptionsBound !== '1') {
        adminStatus.dataset.gcAdminOptionsBound = '1';
        adminStatus.addEventListener('click', event => {
          const option = event.target.closest('[data-admin-option]');
          if (!option || !adminStatus.contains(option)) return;
          event.preventDefault();
          event.stopPropagation();
          applyPickupAdminOption(input, option.dataset.adminOption);
        });
      }

      input.addEventListener('input', () => {
        clearTimeout(timer);
        const skipSuggestOnce = input.dataset.gcSkipSuggestOnce === '1';
        queuePickupAdminAmbiguity(input, skipSuggestOnce ? 0 : ADDRESS_SUGGEST_DEBOUNCE_MS);
        if (skipSuggestOnce) {
          delete input.dataset.gcSkipSuggestOnce;
          invalidateSmartSuggestionRequest();
          // During an explicit suggestion-tap transaction the outer commit already owns the
          // suggestion collapse. Avoid a second hide/stability correction from this input event.
          if (input.dataset.gcSuggestionTapCommit !== '1') hideAddressSuggestions(id);
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
          mutateRideAddressUiStable(input, () => {
            box.innerHTML = suggestions.map((item, index) => renderAddressSuggestion(item, index)).join('');
            box._gcSuggestions = suggestions;
            box.classList.remove('hidden');
          });
        }, ADDRESS_SUGGEST_DEBOUNCE_MS);
      });

      input.addEventListener('blur', () => {
        // GC_R10Z3_BLUR_FORMAT_ONLY: restore R10Q's safe tidy-up after typing is finished.
        // F21: call/driver address suggestions stay structurally present while iOS dismisses the
        // keyboard. Let WebKit finish its native viewport animation first, then close the suggestion
        // surface once and allow progressive-flow to commit. Fare mode keeps its existing timing.
        const suggestionCapacityReserved = reserveSuggestionCollapseCapacity(box);
        const finishAddressBlur = () => {
          normalizeAddressInput(id);
          queuePickupAdminAmbiguity(input, 0);
          hideAddressSuggestions(id);
          if (suggestionCapacityReserved) scheduleSuggestionCollapseSettle(120);
        };
        runAfterRideKeyboardDismissSettles(input, finishAddressBlur);
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
        const relaxedDestination = isRelaxedRideDestination(id);
        // R10Z9L: an explicit passenger tap is always an accepted non-empty choice.
        // Provider resolution can improve hidden route metadata, but can no longer create a red blocking state.

        // R10Y explicit-selection rule: only an explicit passenger tap may replace visible text.
        // The replacement is the cleaned canonical candidate; raw provider formatting never becomes UI text.
        const resolvedAddress = resolvedAddressForInput(selected, resolved, selected) || selected;
        const suggestionCapacityReserved = reserveSuggestionCollapseCapacity(box);
        runRideAddressUiStableTransaction(input, () => {
          input.dataset.gcSuggestionTapCommit = '1';
          try {
            input.value = selected;
            input.dataset.gcSkipSuggestOnce = '1';
            invalidateSmartSuggestionRequest();
            markAddressVerified(input, relaxedDestination ? 'suggestion-relaxed-destination' : 'suggestion', resolvedAddress);
            input.classList.remove('invalid', 'gc-address-needs-choice');
            document.getElementById(`${id}Error`)?.classList.remove('show');
            // Collapse exactly once inside the same transaction. input/change listeners may update
            // progressive sections, but nested viewport corrections are suppressed until commit ends.
            box.innerHTML = '';
            box._gcSuggestions = [];
            box.classList.add('hidden');
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
          } finally {
            delete input.dataset.gcSuggestionTapCommit;
          }
        });
        if (suggestionCapacityReserved) scheduleSuggestionCollapseSettle(120);
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
    if (!pickup || pickup === LOCATION_MARKER || isLocationStateDisplayText(pickup)) return null;
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
      </div>
      <div class="favorite-save-overlay favorite-edit-overlay hidden" id="favoriteEditOverlay">
        <section class="favorite-save-card favorite-edit-card" role="dialog" aria-modal="true" aria-labelledby="favoriteEditTitle">
          <h2 id="favoriteEditTitle">編輯行程名稱</h2>
          <label for="favoriteEditNameInput">行程名稱</label>
          <input class="input" id="favoriteEditNameInput" type="text" maxlength="30">
          <div class="favorite-edit-route" id="favoriteEditRoute" aria-label="目前行程地址"></div>
          <div class="favorite-save-actions">
            <button class="favorite-save-cancel" id="favoriteEditCancelBtn" type="button">取消</button>
            <button class="favorite-save-confirm" id="favoriteEditConfirmBtn" type="button">儲存名稱</button>
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
          <div class="favorite-main">
            <button class="favorite-use" type="button" data-index="${index}">
              <strong>${escapeHtml(trip.name)}</strong>
              <span>${escapeHtml(trip.destination ? `${trip.pickup} → ${trip.destination}` : trip.pickup)}</span>
            </button>
            <button class="favorite-edit-name" type="button" data-index="${index}" aria-label="編輯${escapeHtml(trip.name)}名稱" title="編輯名稱">✎</button>
          </div>
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
    // If the save dialog came from the common-trip sheet, close only this dialog and
    // preserve the sheet context. Standalone callers still restore the original viewport.
    const active = document.activeElement;
    if (active && typeof active.blur === 'function') active.blur();
    const openedFromFavoriteSheet = overlay?.dataset.sheetOpen === '1';
    if (overlay) {
      overlay.classList.add('hidden');
      delete overlay.dataset.sheetOpen;
      delete overlay.dataset.pickup;
      delete overlay.dataset.destination;
    }
    if (openedFromFavoriteSheet) return;
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
    if (!pickup) {
      setFavoriteStatus(COMMON['常用行程需地址'] || '請先填寫上車地址。', 'error');
      return;
    }
    if (pickup === LOCATION_MARKER || noDoorBoundLocation() || isLocationStateDisplayText(pickup)) {
      setFavoriteStatus(COMMON['常用行程定位限制'] || '目前定位無法直接儲存，請改填完整地址。', 'error');
      return;
    }
    const pickupReady = await verifyAddressField('pickup', { showError: true, policy: 'manual-authoritative' });
    const destinationReady = !destination || (pickupReady && await verifyAddressField('destination', { showError: true, policy: 'manual-authoritative' }));
    if (!pickupReady || !destinationReady) {
      setFavoriteStatus(COMMON['常用行程需地址'] || '請先填寫上車地址。', 'error');
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
    // Keep the Bottom Sheet visible underneath the centered save dialog so a successful
    // save returns to the common-trip list instead of jumping back to the main form.
    const favoriteSheet = document.getElementById('gcFavoriteSheet');
    const sheetVisible = !!(favoriteSheet && !favoriteSheet.classList.contains('hidden') && !favoriteSheet.hidden);

    const overlay = document.getElementById('favoriteSaveOverlay');
    const input = document.getElementById('favoriteNameInput');
    const route = document.getElementById('favoriteSaveRoute');
    if (!overlay || !input || !route) return;
    input.value = nextFavoriteDefaultName(trips);
    route.classList.toggle('is-pickup-only', !destination);
    route.textContent = destination ? `${pickup} → ${destination}` : pickup;
    overlay.dataset.pickup = pickup;
    overlay.dataset.destination = destination;
    overlay.dataset.sheetOpen = sheetVisible ? '1' : '0';
    overlay.classList.remove('hidden');
    if (!sheetVisible) lockViewport();
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
      if (!pickup) return;
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

  function closeFavoriteEditModal() {
    const overlay = document.getElementById('favoriteEditOverlay');
    const active = document.activeElement;
    if (active && typeof active.blur === 'function') active.blur();
    if (!overlay) return;
    overlay.classList.add('hidden');
    delete overlay.dataset.index;
  }

  function openFavoriteEditModal(index) {
    const trips = loadFavoriteTrips();
    const trip = trips[Number(index)];
    const overlay = document.getElementById('favoriteEditOverlay');
    const input = document.getElementById('favoriteEditNameInput');
    const route = document.getElementById('favoriteEditRoute');
    if (!trip || !overlay || !input || !route) return;
    overlay.dataset.index = String(index);
    input.value = String(trip.name || '').slice(0, 30);
    route.textContent = trip.destination ? `${trip.pickup} → ${trip.destination}` : trip.pickup;
    overlay.classList.remove('hidden');
  }

  function bindFavoriteEditModal() {
    const overlay = document.getElementById('favoriteEditOverlay');
    document.getElementById('favoriteEditCancelBtn')?.addEventListener('click', closeFavoriteEditModal);
    overlay?.addEventListener('click', event => {
      if (event.target === overlay) closeFavoriteEditModal();
    });
    document.getElementById('favoriteEditConfirmBtn')?.addEventListener('click', () => {
      if (!overlay) return;
      const index = Number(overlay.dataset.index);
      const trips = loadFavoriteTrips();
      const trip = trips[index];
      if (!trip) { closeFavoriteEditModal(); return; }
      const input = document.getElementById('favoriteEditNameInput');
      const nextName = String(input?.value || '').trim().slice(0, 30) || trip.name;
      trips[index] = { ...trip, name: nextName };
      saveFavoriteTrips(trips);
      closeFavoriteEditModal();
      refreshFavoriteTrips();
      setFavoriteStatus('行程名稱已更新。', 'success');
    });
  }

  function bindFavoriteTrips() {
    const box = document.getElementById('favoriteTripsBox');
    if (!box) return;
    box.addEventListener('click', event => {
      const editButton = event.target.closest('.favorite-edit-name');
      if (editButton) {
        event.preventDefault();
        event.stopPropagation();
        openFavoriteEditModal(Number(editButton.dataset.index));
        return;
      }
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
        const hasSavedDestination = Boolean(trip.destination);
        if (destinationInput && hasSavedDestination) {
          destinationInput._gcCancelSmartSuggestions?.();
          destinationInput.dataset.gcSkipSuggestOnce = '1';
          destinationInput.value = trip.destination;
          if (isLocallyDispatchReady(trip.destination)) markAddressVerified(destinationInput, 'favorite');
          else clearAddressVerified(destinationInput);
        }
        const appliedAddressIds = hasSavedDestination ? ['pickup', 'destination'] : ['pickup'];
        appliedAddressIds.forEach(id => {
          document.getElementById(id)?.classList.remove('invalid');
          document.getElementById(`${id}Error`)?.classList.remove('show');
        });
        pickupInput?.dispatchEvent(new Event('input', { bubbles: true }));
        // A favorite fill must land in the exact same progressive state as manual input.
        // Keep a pickup-only trip pickup-only, preserve any destination the passenger already typed,
        // and explicitly re-run the existing progressive-flow commit/update path.
        pickupInput?.dispatchEvent(new Event('change', { bubbles: true }));
        document.getElementById('serviceForm')?.dispatchEvent(new CustomEvent('gc:address-verified', { bubbles: true, detail: { id: 'pickup', source: 'favorite' } }));
        if (hasSavedDestination) {
          destinationInput?.dispatchEvent(new Event('input', { bubbles: true }));
          destinationInput?.dispatchEvent(new Event('change', { bubbles: true }));
          document.getElementById('serviceForm')?.dispatchEvent(new CustomEvent('gc:address-verified', { bubbles: true, detail: { id: 'destination', source: 'favorite' } }));
        }
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

  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R7_LOCATION_STATE_MACHINE_NO_DOOR_MANUAL_SWITCH
  // GPS no-door text is a location STATE, not a passenger-editable address.  The same pickup
  // input is reused when the rider explicitly chooses "改填地址", so there is no duplicate field.
  function isLocationStateDisplayText(value) {
    const text = String(value || '').trim();
    if (!text) return false;
    return text.startsWith('📍 已取得目前定位') || /（無門牌）$/.test(text);
  }

  function setNoDoorLocationInputState(active) {
    const input = document.getElementById('pickup');
    const manualSwitch = document.getElementById('locationManualSwitch');
    if (input) {
      input.readOnly = Boolean(active);
      input.classList.toggle('gc-location-no-door-state', Boolean(active));
      if (active) {
        input.setAttribute('aria-readonly', 'true');
        input.dataset.gcLocationState = 'no-door';
      } else {
        input.removeAttribute('aria-readonly');
        delete input.dataset.gcLocationState;
      }
    }
    manualSwitch?.classList.toggle('hidden', !active);
  }

  let gcLocationManualSwitchSpacer = null;

  function clearLocationManualSwitchSpacer() {
    if (!gcLocationManualSwitchSpacer) return;
    gcLocationManualSwitchSpacer.remove();
    gcLocationManualSwitchSpacer = null;
  }

  function reserveLocationManualSwitchScrollCapacity() {
    clearLocationManualSwitchSpacer();
    const spacer = document.createElement('div');
    spacer.id = 'gcLocationManualSwitchSpacer';
    spacer.setAttribute('aria-hidden', 'true');
    spacer.style.cssText = 'display:block;width:1px;min-width:1px;height:0;pointer-events:none;visibility:hidden;';
    // Reserve generously before GPS-only rows disappear so a short iPhone viewport cannot clamp
    // scrollY between synchronous DOM mutations. It is reduced to the exact minimum immediately.
    spacer.style.height = `${Math.max(720, Math.ceil(window.innerHeight || 0))}px`;
    document.body.appendChild(spacer);
    gcLocationManualSwitchSpacer = spacer;
    return spacer;
  }

  function settleLocationManualSwitchSpacer(scrollY) {
    const spacer = gcLocationManualSwitchSpacer;
    if (!spacer?.isConnected) return;
    const reserve = Math.max(0, spacer.getBoundingClientRect().height);
    const viewportHeight = Math.max(1, Number(window.visualViewport?.height || window.innerHeight || document.documentElement?.clientHeight || 0));
    const naturalHeight = Math.max(0, document.documentElement.scrollHeight - reserve);
    const needed = Math.max(0, Math.ceil(scrollY + viewportHeight - naturalHeight + 3));
    if (needed <= 2) clearLocationManualSwitchSpacer();
    else spacer.style.height = `${Math.min(reserve, needed)}px`;
  }

  function switchNoDoorLocationToManualAddress(mode = 'call') {
    const input = document.getElementById('pickup');
    const location = noDoorBoundLocation();
    if (!input || !location) return false;
    const manualDraft = String(location.manualDraft || '').trim();
    const manualDraftVerified = Boolean(manualDraft && location.manualDraftVerified);

    // This is an explicit mode switch. Never leave the GPS status sentence as editable text and
    // never keep an old coordinate/map binding behind a manually entered address. If the rider
    // had typed an address before explicitly re-requesting GPS, restore it only as a manual draft.
    const anchorTop = input.getBoundingClientRect().top;
    const anchorScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
    reserveLocationManualSwitchScrollCapacity();
    currentLocationUsed = false;
    clearAttachedLocation(false);
    input._gcCancelSmartSuggestions?.();
    input.value = manualDraft;
    input.dataset.gcSkipSuggestOnce = '1';
    clearAddressVerified(input);
    clearFieldValidation('pickup');
    clearPickupAdminReminder(input);

    // Focus inside the user's tap gesture BEFORE notifying the progressive flow.  Its existing
    // committed-pickup rule then keeps downstream sections structurally stable while the rider
    // types the replacement address.  Avoid a synthetic change event here: change/blur is the
    // deliberate commit boundary and would collapse the whole form on an empty value.
    try { input.focus({ preventScroll: true }); } catch (_) { input.focus(); }
    input.dispatchEvent(new Event('input', { bubbles: true }));
    if (manualDraftVerified) markAddressVerified(input, 'restored-manual-draft');
    const end = input.value.length;
    try { input.setSelectionRange(end, end); } catch (_) {}

    // Reduce the temporary BODY tail capacity to only what is needed to preserve this viewport.
    // It is never placed inside the form, so the customer never sees the old large blank block.
    settleLocationManualSwitchSpacer(anchorScrollY);
    window.scrollTo(0, anchorScrollY);
    requestAnimationFrame(() => {
      if (!input.isConnected || document.activeElement !== input) return;
      const delta = input.getBoundingClientRect().top - anchorTop;
      if (Math.abs(delta) > 1) window.scrollBy(0, delta);
    });

    const releaseOnRealEdit = event => {
      if (!event.isTrusted) return;
      input.removeEventListener('input', releaseOnRealEdit, true);
      requestAnimationFrame(() => settleLocationManualSwitchSpacer(window.scrollY || window.pageYOffset || 0));
    };
    input.addEventListener('input', releaseOnRealEdit, true);
    input.addEventListener('blur', () => {
      setTimeout(clearLocationManualSwitchSpacer, 420);
    }, { once: true, passive: true });
    return true;
  }

  function clearAttachedLocation(clearMarker = false) {
    locationRequestToken += 1;
    setNoDoorLocationInputState(false);
    resetLocationSupplement();
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
      delete status.dataset.gcStatusOwner;
    }
    const button = document.getElementById('locationBtn');
    if (button) {
      button.disabled = false;
      button.textContent = currentLocationUsed
        ? (COMMON['定位重新取得'] || '📍 重新取得位置')
        : (COMMON['定位按鈕'] || '📍 使用目前位置');
    }
  }

  // GC_R10Z14F23_LOCATION_BINDING_INVALIDATION
  // A LINE map pin is valid only while the visible pickup/driver address is still owned by
  // the same current-location session. Any passenger-driven change (typing/deleting, smart
  // suggestion, recent address, favorite trip, admin-area choice) detaches the old pin.
  // Formatter-only normalization does not fire input and therefore keeps a matching binding.
  function hasCurrentLocationSession() {
    const status = document.getElementById('locationStatus');
    const button = document.getElementById('locationBtn');
    return Boolean(attachedLocation || button?.disabled || status?.dataset.gcStatusOwner === 'location');
  }

  let locationEditLayoutLock = null;
  let locationEditLayoutRevision = 0;

  function clearLocationEditLayoutLock(lock = locationEditLayoutLock) {
    if (!lock) return;
    if (lock.releaseRaf) cancelAnimationFrame(lock.releaseRaf);
    lock.releaseRaf = 0;
    if (lock.releaseTimer) clearTimeout(lock.releaseTimer);
    lock.releaseTimer = 0;
    if (locationEditLayoutLock === lock) locationEditLayoutLock = null;
    const field = lock.field;
    if (!field?.isConnected) return;
    field.classList.remove('gc-location-edit-layout-releasing');
    field.classList.remove('gc-location-edit-layout-lock');
    field.style.removeProperty('--gc-location-edit-lock-height');
  }

  function preserveCurrentLocationEditLayout(input) {
    if (!input || document.activeElement !== input) return null;
    const field = input.closest('.address-field');
    if (!field || locationEditLayoutLock?.field === field) return locationEditLayoutLock || null;
    clearLocationEditLayoutLock();
    const height = Math.ceil(field.getBoundingClientRect().height);
    if (!Number.isFinite(height) || height <= 0) return null;
    const revision = ++locationEditLayoutRevision;
    field.style.setProperty('--gc-location-edit-lock-height', `${height}px`);
    field.classList.add('gc-location-edit-layout-lock');
    const lock = { field, input, revision, releaseRaf: 0, releaseTimer: 0 };
    locationEditLayoutLock = lock;
    input.addEventListener('blur', () => {
      runAfterRideKeyboardDismissSettles(input, () => {
        if (locationEditLayoutLock !== lock || revision !== locationEditLayoutRevision) return;
        requestAnimationFrame(() => clearLocationEditLayoutLock(lock));
      }, { minDelay: 280, maxDelay: 900 });
    }, { once: true, passive: true });
    return lock;
  }

  function releaseCurrentLocationEditLayoutCompact(lock, input) {
    if (!lock || locationEditLayoutLock !== lock) return;
    const field = lock.field;
    if (!field?.isConnected) { clearLocationEditLayoutLock(lock); return; }

    // M2R3: do not remove the F25R5 height guard in one frame. iOS 13-class WebViews can
    // re-pan the focused field when the location-review card disappears and the guarded field
    // collapses instantly. Collapse the guard over a short deterministic interval and re-anchor
    // only this focused input before each paint. This removes the old blank gap and the one-frame
    // shake without changing keyboard/focus state or any other field logic.
    const anchorTop = viewportStableTop(input);
    const startedAt = performance.now();
    const durationMs = 132;
    let lastCorrectionAt = 0;

    const stabilize = () => {
      if (locationEditLayoutLock !== lock || !field.isConnected) return;
      if (document.activeElement === input) {
        const delta = viewportStableTop(input) - anchorTop;
        if (Math.abs(delta) > 0.75 && performance.now() - lastCorrectionAt > 4) {
          lastCorrectionAt = performance.now();
          window.scrollBy(0, delta);
        }
      }
      if (performance.now() - startedAt < durationMs + 34) {
        lock.releaseRaf = requestAnimationFrame(stabilize);
      }
    };

    field.classList.add('gc-location-edit-layout-releasing');
    void field.offsetHeight;
    requestAnimationFrame(() => {
      if (locationEditLayoutLock !== lock) return;
      field.style.setProperty('--gc-location-edit-lock-height', '0px');
      lock.releaseRaf = requestAnimationFrame(stabilize);
    });
    lock.releaseTimer = setTimeout(() => {
      if (locationEditLayoutLock === lock) clearLocationEditLayoutLock(lock);
    }, durationMs + 58);
  }

  function detachCurrentLocationForPassengerEdit({ preserveLayout = false } = {}) {
    if (attachedLocation?.settingInput || !hasCurrentLocationSession()) return false;
    const pickupInput = document.getElementById('pickup');
    const layoutLock = preserveLayout ? preserveCurrentLocationEditLayout(pickupInput) : null;
    const detach = () => clearAttachedLocation(false);
    if (preserveLayout && typeof window.GC_mutateInputViewportStable === 'function') {
      window.GC_mutateInputViewportStable(pickupInput, detach);
      releaseCurrentLocationEditLayoutCompact(layoutLock, pickupInput);
    } else {
      detach();
      if (layoutLock) releaseCurrentLocationEditLayoutCompact(layoutLock, pickupInput);
    }
    return true;
  }

  function boundAttachedLocation() {
    if (!attachedLocation) return null;
    const pickupInput = document.getElementById('pickup');
    const visibleKey = addressConfidenceKey(pickupInput?.value || '');
    const boundKey = attachedLocation.boundAddressKey || addressConfidenceKey(attachedLocation.address || attachedLocation.generatedAddress || '');
    if (!visibleKey || !boundKey || visibleKey !== boundKey) return null;
    return attachedLocation;
  }

  function dispatchableAttachedLocation() {
    const location = boundAttachedLocation();
    if (!location || location.sendMap === false) return null;
    return location;
  }

  function noDoorBoundLocation() {
    const location = boundAttachedLocation();
    if (!location || location.noDoor !== true) return null;
    if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) return null;
    return location;
  }

  function formatDmsCoordinateComponent(value, positiveHemisphere, negativeHemisphere) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return '';
    // Display only: keep the original decimal latitude/longitude untouched for GPS, map pins,
    // signatures and all coordinate logic. Round the human/dispatch text to 0.1 arc-second.
    const totalTenths = Math.round(Math.abs(numeric) * 36000);
    const degrees = Math.floor(totalTenths / 36000);
    const remainder = totalTenths - degrees * 36000;
    const minutes = Math.floor(remainder / 600);
    const secondsTenths = remainder - minutes * 600;
    const seconds = (secondsTenths / 10).toFixed(1).padStart(4, '0');
    const hemisphere = numeric < 0 ? negativeHemisphere : positiveHemisphere;
    return `${degrees}°${String(minutes).padStart(2, '0')}'${seconds}"${hemisphere}`;
  }

  function formatLocationCoordinate(location) {
    if (!location || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) return '';
    const latitude = formatDmsCoordinateComponent(location.latitude, 'N', 'S');
    const longitude = formatDmsCoordinateComponent(location.longitude, 'E', 'W');
    return latitude && longitude ? `${latitude} ${longitude}` : '';
  }

  function resetLocationSupplement() {
    const field = document.getElementById('locationSupplementField');
    const input = document.getElementById('locationSupplement');
    if (input) input.value = '';
    if (field) field.classList.add('hidden');
  }

  function showLocationSupplement() {
    const field = document.getElementById('locationSupplementField');
    if (field) field.classList.remove('hidden');
  }

  function currentLocationSupplement() {
    return meaningfulOptionalText(document.getElementById('locationSupplement')?.value || '');
  }

  function setLocationStatus(message, state = '') {
    const status = document.getElementById('locationStatus');
    if (!status) return;
    status.textContent = message || '';
    status.className = `location-status${state ? ` is-${state}` : ''}`;
    status.dataset.gcStatusOwner = 'location';
  }

  function updateLocationVisibility(mode = 'call') {
    const action = document.getElementById('locationAction');
    if (!action) return;
    const serviceType = checked('serviceType');
    const supported = serviceType === 'instant' || serviceType === 'reserve';
    action.classList.toggle('hidden', !supported);
    if (!supported) {
      if (attachedLocation) clearAttachedLocation(false);
      return;
    }
    // F25R4: only a reliable full address may cross instant/reservation as plain text.
    // GPS/map-pin/no-door-coordinate state always belongs to the service type that requested it.
    if (attachedLocation?.serviceType && attachedLocation.serviceType !== serviceType) {
      const pickupInput = document.getElementById('pickup');
      const previousServiceType = attachedLocation.serviceType;
      const noDoor = attachedLocation.noDoor === true;
      if (noDoor) {
        clearAttachedLocation(true);
        if (pickupInput) {
          pickupInput._gcCancelSmartSuggestions?.();
          clearAddressVerified(pickupInput);
          clearFieldValidation('pickup');
          pickupInput.dispatchEvent(new Event('input', { bubbles: true }));
          pickupInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      } else {
        clearAttachedLocation(false);
        const retained = String(pickupInput?.value || '').trim();
        if (retained) {
          if (previousServiceType === 'instant' && serviceType === 'reserve') {
            const label = mode === 'driver' ? '代駕地址' : '上車地址';
            setLocationStatus(`已沿用${label}，請確認是否為本次預約地點。`, 'success');
          } else if (previousServiceType === 'reserve' && serviceType === 'instant') {
            setLocationStatus('已沿用地址；如需附上目前定位，請重新取得位置。', 'success');
          }
        }
      }
    }
    const button = document.getElementById('locationBtn');
    if (button && !button.disabled) {
      button.textContent = currentLocationUsed
        ? (COMMON['定位重新取得'] || '📍 重新取得位置')
        : (COMMON['定位按鈕'] || '📍 使用目前位置');
    }
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
    // A lane/section number is not a door number. Treat the result as exact only when ArcGIS
    // explicitly returns AddNum or the visible street label itself contains a house-number suffix.
    const hasHouseNumber = Boolean(addNum || /(?:[0-9０-９]+(?:[-－之][0-9０-９]+)?|[一二三四五六七八九十百零〇兩]+)號/.test(street));
    const exactEnough = (type === 'PointAddress' || type === 'Subaddress' || type === 'StreetAddress') && hasHouseNumber;
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

  // F25: when GPS is precise but the reverse geocoder cannot provide a reliable door number,
  // keep the most useful human-readable road/area text for dispatch. The raw GPS coordinates
  // remain the source of truth and are carried separately; this formatter never invents a door.
  function formatReverseGeocodedNoDoorAddress(rawAddress) {
    if (!rawAddress || typeof rawAddress !== 'object') return '';
    const region = compactReverseAddressPart(rawAddress.Region);
    const city = compactReverseAddressPart(rawAddress.City);
    const district = compactReverseAddressPart(rawAddress.District);
    const subregion = compactReverseAddressPart(rawAddress.Subregion);
    const street = compactReverseAddressPart(rawAddress.Address || rawAddress.ShortLabel);

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
    let candidate = cleanLocatedTaiwanAddress(unique.join(' '));
    if (!candidate) {
      candidate = cleanLocatedTaiwanAddress(compactReverseAddressPart(rawAddress.Match_addr || rawAddress.LongLabel).replace(/,\s*/g, ' '));
    }
    return candidate || '';
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
      if (!response.ok) return { address: '', noDoorAddress: '' };
      const data = await response.json();
      if (!data || data.error) return { address: '', noDoorAddress: '' };
      return {
        address: formatReverseGeocodedAddress(data.address),
        noDoorAddress: formatReverseGeocodedNoDoorAddress(data.address)
      };
    } catch (_) {
      return { address: '', noDoorAddress: '' };
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
    const manualAddressButton = document.getElementById('locationManualAddressBtn');
    if (!button || !pickupInput) return;
    // GC_MASTER_STABLE_2026_08R10O_LOCATION_CONFIRMATION_COPY
    const locationAddressLabel = mode === 'driver' ? '代駕地址' : '上車地址';

    manualAddressButton?.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      switchNoDoorLocationToManualAddress(mode);
    });

    pickupInput.addEventListener('input', event => {
      // F23: the passenger changed the address after requesting/receiving GPS. Detach the
      // map pin immediately instead of trying to guess whether the new text is "close enough".
      // This also cancels a still-running geolocation/reverse-geocode request via request token.
      // F25R5: a real first keystroke keeps the active input at the same visual position while
      // the location review/status UI is removed. Programmatic input events keep legacy behavior.
      if (attachedLocation?.settingInput) return;
      detachCurrentLocationForPassengerEdit({
        preserveLayout: Boolean(event?.isTrusted && document.activeElement === pickupInput)
      });
    });

    confirmButton?.addEventListener('click', () => {
      if (checked('serviceType') !== 'instant') return;
      if (!attachedLocation || !normalizeAddress(pickupInput.value)) return;
      attachedLocation.confirmed = true;
      attachedLocation.requiresConfirmation = false;
      attachedLocation.address = String(pickupInput.value || '').trim();
      attachedLocation.boundAddressKey = addressConfidenceKey(pickupInput.value);
      markAddressVerified(pickupInput, 'location-confirmed');
      // GC_R10Z14F25R3_LOCATION_CONFIRM_VALIDATION_CLEAR
      // A successful location confirmation must clear the full validation state, not only hide
      // the review card. This keeps the field border, error copy and aria-invalid in one state.
      clearFieldValidation('pickup');
      setLocationReview('', false);
      setLocationStatus(attachedLocation.noDoor === true
        ? '定位已確認；可補充周邊辨識點，協助更快媒合。'
        : '地址已確認，定位會一併附上。', 'success');
    });

    button.addEventListener('click', async () => {
      const requestedServiceType = checked('serviceType');
      if (requestedServiceType !== 'instant' && requestedServiceType !== 'reserve') return;
      const reserveAddressOnly = requestedServiceType === 'reserve';
      const reserveLocationLabel = mode === 'driver' ? '代駕地點' : '上車地點';
      if (!navigator.geolocation) {
        setLocationStatus(COMMON['定位不支援'] || '此裝置不支援定位，請直接輸入地址。', 'error');
        return;
      }
      const requestToken = ++locationRequestToken;
      const previousPickup = String(pickupInput.value || '').trim();
      const previousPickupVerified = isAddressVerified(pickupInput);
      const previousPickupOwnedByLocation = Boolean(boundAttachedLocation());
      const previousManualDraft = previousPickup && !previousPickupOwnedByLocation && !isLocationStateDisplayText(previousPickup)
        ? previousPickup
        : '';
      const previousManualDraftVerified = Boolean(previousManualDraft && previousPickupVerified);
      resetLocationSupplement();
      pickupInput._gcCancelSmartSuggestions?.();
      button.disabled = true;
      button.textContent = COMMON['定位取得中'] || '正在取得定位…';
      setLocationReview('', false);
      setLocationStatus('正在取得較精準的位置，通常只需要幾秒…');

      try {
        const position = await getBestCurrentPosition();
        if (requestToken !== locationRequestToken || checked('serviceType') !== requestedServiceType) return;
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);
        const accuracy = Number(position.coords.accuracy);
        const finiteAccuracy = Number.isFinite(accuracy) ? accuracy : null;
        const preciseEnough = finiteAccuracy !== null && finiteAccuracy <= LOCATION_REVIEW_ACCURACY_M;
        const canSendMap = !reserveAddressOnly && preciseEnough;

        currentLocationUsed = true;
        attachedLocation = {
          latitude,
          longitude,
          accuracy: finiteAccuracy,
          address: '',
          generatedAddress: '',
          manualAddress: '',
          manualDraft: previousManualDraft,
          manualDraftVerified: previousManualDraftVerified,
          confirmed: reserveAddressOnly,
          requiresConfirmation: false,
          sendMap: canSendMap,
          settingInput: false,
          boundAddressKey: '',
          serviceType: requestedServiceType,
          addressOnly: reserveAddressOnly,
          noDoor: false,
          title: mode === 'driver' ? '代駕車輛目前位置' : '即時叫車上車位置'
        };
        button.disabled = false;
        button.textContent = COMMON['定位重新取得'] || '📍 重新取得位置';

        if (!preciseEnough) {
          if (previousPickupOwnedByLocation && isLocationStateDisplayText(previousPickup)) {
            attachedLocation = null;
            setNoDoorLocationInputState(false);
            pickupInput.value = '';
            clearAddressVerified(pickupInput);
            clearFieldValidation('pickup');
            setLocationReview('', false);
            setLocationStatus(`定位訊號較弱${finiteAccuracy ? `（約 ±${Math.round(finiteAccuracy)}m）` : ''}，請重新取得位置或直接改填地址。`, 'error');
            return;
          }
          if (reserveAddressOnly) {
            attachedLocation = null;
            pickupInput.value = previousPickup || '';
            if (previousPickup) {
              if (previousPickupVerified) markAddressVerified(pickupInput, 'restored');
              else clearAddressVerified(pickupInput);
            }
            setLocationStatus(previousPickup
              ? `定位訊號較弱${finiteAccuracy ? `（約 ±${Math.round(finiteAccuracy)}m）` : ''}，已保留原本輸入的地址；請直接確認或重新取得位置。`
              : `定位訊號較弱${finiteAccuracy ? `（約 ±${Math.round(finiteAccuracy)}m）` : ''}，請再按一次重新取得；若仍無法辨識，再手動輸入${locationAddressLabel}。`, 'error');
            return;
          }
          // Keep the original instant-ride weak-GPS behavior unchanged.
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
        const reverseResult = await reverseGeocodeCurrentLocation(latitude, longitude);
        if (requestToken !== locationRequestToken || checked('serviceType') !== requestedServiceType) return;
        if (!attachedLocation || attachedLocation.latitude !== latitude || attachedLocation.longitude !== longitude) return;
        const address = String(reverseResult?.address || '').trim();
        const noDoorAddress = String(reverseResult?.noDoorAddress || '').trim();

        if (!address) {
          // M2R8: pressing 使用目前位置／重新取得位置 is an explicit request to switch back to GPS.
          // A precise GPS result without a reliable door must therefore become the authoritative
          // no-door location state; an older manual address is kept only as a recoverable draft
          // for a later "改填地址" action and must never masquerade as the current GPS address.
          // F25: precise GPS without a reliable door number is a fallback, not the normal shortcut.
          // Keep any road/area text that ArcGIS can safely identify, mark it clearly as no-door,
          // and preserve the ORIGINAL phone GPS coordinate for confirmation/LINE dispatch context.
          const fallbackAddress = noDoorAddress
            ? `${noDoorAddress.replace(/（無門牌）$/,'')}（無門牌）`
            : LOCATION_PIN_ONLY_LABEL;
          attachedLocation.address = fallbackAddress;
          attachedLocation.generatedAddress = fallbackAddress;
          attachedLocation.boundAddressKey = addressConfidenceKey(fallbackAddress);
          attachedLocation.noDoor = true;
          attachedLocation.settingInput = true;
          pickupInput._gcCancelSmartSuggestions?.();
          pickupInput.dataset.gcSkipSuggestOnce = '1';
          pickupInput.value = fallbackAddress;
          markAddressVerified(pickupInput, 'location-no-door');
          pickupInput.dispatchEvent(new Event('input', { bubbles: true }));
          pickupInput.dispatchEvent(new Event('change', { bubbles: true }));
          attachedLocation.settingInput = false;
          pickupInput.classList.remove('invalid');
          document.getElementById('pickupError')?.classList.remove('show');

          setNoDoorLocationInputState(true);
          showLocationSupplement();
          if (reserveAddressOnly) {
            attachedLocation.sendMap = false;
            attachedLocation.confirmed = true;
            attachedLocation.requiresConfirmation = false;
            clearFieldValidation('pickup');
            setLocationReview('', false);
            setLocationStatus('目前位置無法辨識完整門牌，可補充周邊辨識點。', 'success');
          } else {
            attachedLocation.requiresConfirmation = true;
            setLocationStatus('', 'success');
            setLocationReview('目前位置無法辨識完整門牌，可補充周邊辨識點。', true);
          }
          return;
        }

        setNoDoorLocationInputState(false);
        resetLocationSupplement();
        attachedLocation.noDoor = false;
        attachedLocation.address = address;
        attachedLocation.generatedAddress = address;
        attachedLocation.boundAddressKey = addressConfidenceKey(address);
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

        if (reserveAddressOnly) {
          // Reservation GPS is address-entry assistance only. It never attaches the current map pin
          // to a future booking. A later passenger edit clears this hint but keeps the button as
          // “重新取得位置”, so the rider can explicitly fetch the address again if desired.
          attachedLocation.sendMap = false;
          attachedLocation.confirmed = true;
          attachedLocation.requiresConfirmation = false;
          clearFieldValidation('pickup');
          setLocationReview('', false);
          setLocationStatus(`已帶入目前地址，請確認預約${reserveLocationLabel}。`, 'success');
          return;
        }

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
        setNoDoorLocationInputState(false);
        if (isLocationStateDisplayText(pickupInput.value)) {
          pickupInput.value = '';
          clearAddressVerified(pickupInput);
          clearFieldValidation('pickup');
        }
        const denied = error?.code === 1;
        setLocationReview('', false);
        setLocationStatus(denied
          ? (COMMON['定位拒絕'] || '定位權限未開啟，請改輸入完整地址。')
          : (COMMON['定位失敗'] || '無法取得目前位置，請改輸入完整地址。'), 'error');
        button.disabled = false;
        button.textContent = currentLocationUsed
          ? (COMMON['定位重新取得'] || '📍 重新取得位置')
          : (COMMON['定位按鈕'] || '📍 使用目前位置');
      }
    });
    updateLocationVisibility(mode);
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
      // R10Z9Z: the picker still stores and displays up to five records, but the compact
      // trigger no longer advertises a changing number that makes the three-button row uneven.
      if (count) count.textContent = '';
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
  // M2R4: keep anchored recent-address pickers alive through iOS/LINE browser-chrome
  // height-only window.resize events. Only a real layout-width/orientation change dismisses it.
  let recentQuickPickerLayoutWidth = 0;
  let recentQuickPickerOrientationKey = '';
  let recentQuickPickerTouchLastY = 0;
  let recentQuickPickerTouchActive = false;

  function getRecentQuickPickerLayoutWidth() {
    return Math.round(document.documentElement?.clientWidth || window.innerWidth || 0);
  }

  function getRecentQuickPickerOrientationKey() {
    const screenType = String(window.screen?.orientation?.type || '').trim();
    if (screenType) return screenType;
    // Legacy iOS exposes window.orientation; unlike innerHeight it is not affected by
    // keyboard/browser-chrome height changes, so it cannot create a false landscape signal.
    const legacyAngle = Number(window.orientation);
    return Number.isFinite(legacyAngle) ? `angle-${legacyAngle}` : '';
  }

  function captureRecentQuickPickerViewportSignature() {
    recentQuickPickerLayoutWidth = getRecentQuickPickerLayoutWidth();
    recentQuickPickerOrientationKey = getRecentQuickPickerOrientationKey();
  }

  // GC_MASTER_STABLE_2026_08R10Z14F25R6_RECENT_SHEET_SWIPE_DISMISS
  // Management-sheet only: the handle/header can be dragged downward to dismiss.
  // Address rows, delete/clear controls and all existing recent-address data behavior remain unchanged.
  let recentSheetDragPointerId = null;
  let recentSheetDragStartY = 0;
  let recentSheetDragLastY = 0;
  let recentSheetDragLastTime = 0;
  let recentSheetDragOffsetY = 0;
  let recentSheetDragVelocityY = 0;
  let recentSheetDragTimer = 0;
  let recentSheetSuppressClickUntil = 0;

  function recentSheetElements() {
    const overlay = document.getElementById('gcRecentSheet');
    return { overlay, sheet: overlay?.querySelector('.gc-recent-sheet') || null };
  }

  function clearRecentSheetDragState() {
    const { overlay, sheet } = recentSheetElements();
    if (recentSheetDragTimer) {
      window.clearTimeout(recentSheetDragTimer);
      recentSheetDragTimer = 0;
    }
    recentSheetDragPointerId = null;
    recentSheetDragStartY = 0;
    recentSheetDragLastY = 0;
    recentSheetDragLastTime = 0;
    recentSheetDragOffsetY = 0;
    recentSheetDragVelocityY = 0;
    overlay?.classList.remove('is-dragging', 'is-restoring', 'is-dismissing');
    sheet?.classList.remove('is-dragging', 'is-restoring', 'is-dismissing');
    overlay?.style.removeProperty('--gc-recent-sheet-backdrop-alpha');
    sheet?.style.removeProperty('transform');
  }

  function applyRecentSheetDrag(offsetY) {
    const { overlay, sheet } = recentSheetElements();
    if (!overlay || !sheet) return;
    const offset = Math.max(0, Number(offsetY) || 0);
    const progress = Math.min(1, offset / Math.max(180, sheet.getBoundingClientRect().height * 0.55));
    recentSheetDragOffsetY = offset;
    overlay.classList.add('is-dragging');
    sheet.classList.add('is-dragging');
    sheet.style.setProperty('transform', `translate3d(0, ${Math.round(offset)}px, 0)`);
    overlay.style.setProperty('--gc-recent-sheet-backdrop-alpha', String((0.34 - 0.20 * progress).toFixed(3)));
  }

  function restoreRecentSheetAfterDrag() {
    const { overlay, sheet } = recentSheetElements();
    if (!overlay || !sheet) {
      clearRecentSheetDragState();
      return;
    }
    recentSheetDragPointerId = null;
    overlay.classList.remove('is-dragging');
    sheet.classList.remove('is-dragging');
    overlay.classList.add('is-restoring');
    sheet.classList.add('is-restoring');
    sheet.style.setProperty('transform', 'translate3d(0, 0, 0)');
    overlay.style.setProperty('--gc-recent-sheet-backdrop-alpha', '0.34');
    if (recentSheetDragTimer) window.clearTimeout(recentSheetDragTimer);
    recentSheetDragTimer = window.setTimeout(clearRecentSheetDragState, 230);
  }

  function dismissRecentSheetAfterDrag() {
    const { overlay, sheet } = recentSheetElements();
    if (!overlay || !sheet) {
      closeRecentAddressSheet();
      return;
    }
    recentSheetDragPointerId = null;
    overlay.classList.remove('is-dragging');
    sheet.classList.remove('is-dragging');
    overlay.classList.add('is-dismissing');
    sheet.classList.add('is-dismissing');
    sheet.style.setProperty('transform', 'translate3d(0, calc(100% + 32px), 0)');
    overlay.style.setProperty('--gc-recent-sheet-backdrop-alpha', '0');
    if (recentSheetDragTimer) window.clearTimeout(recentSheetDragTimer);
    recentSheetDragTimer = window.setTimeout(() => closeRecentAddressSheet(), 190);
  }

  function beginRecentSheetDrag(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const { overlay, sheet } = recentSheetElements();
    if (!overlay || !sheet || overlay.hidden || overlay.classList.contains('hidden')) return;
    if (event.target.closest('button')) return;
    recentSheetDragPointerId = event.pointerId;
    recentSheetDragStartY = event.clientY;
    recentSheetDragLastY = event.clientY;
    recentSheetDragLastTime = event.timeStamp || performance.now();
    recentSheetDragOffsetY = 0;
    recentSheetDragVelocityY = 0;
    overlay.classList.remove('is-restoring', 'is-dismissing');
    sheet.classList.remove('is-restoring', 'is-dismissing');
    try { sheet.setPointerCapture?.(event.pointerId); } catch (_) {}
    if (event.cancelable) event.preventDefault();
  }

  function moveRecentSheetDrag(event) {
    if (recentSheetDragPointerId === null || event.pointerId !== recentSheetDragPointerId) return;
    const offset = Math.max(0, event.clientY - recentSheetDragStartY);
    const now = event.timeStamp || performance.now();
    const elapsed = Math.max(1, now - recentSheetDragLastTime);
    const instantVelocity = (event.clientY - recentSheetDragLastY) / elapsed;
    recentSheetDragVelocityY = recentSheetDragVelocityY * 0.45 + instantVelocity * 0.55;
    recentSheetDragLastY = event.clientY;
    recentSheetDragLastTime = now;
    applyRecentSheetDrag(offset);
    if (offset > 0 && event.cancelable) event.preventDefault();
  }

  function endRecentSheetDrag(event, cancelled = false) {
    if (recentSheetDragPointerId === null || event.pointerId !== recentSheetDragPointerId) return;
    const { sheet } = recentSheetElements();
    try { sheet?.releasePointerCapture?.(event.pointerId); } catch (_) {}
    if (recentSheetDragOffsetY > 6) recentSheetSuppressClickUntil = performance.now() + 420;
    if (cancelled || !sheet) {
      restoreRecentSheetAfterDrag();
      return;
    }
    const sheetHeight = Math.max(1, sheet.getBoundingClientRect().height);
    const distanceThreshold = Math.min(132, Math.max(88, sheetHeight * 0.22));
    const fastDownwardFling = recentSheetDragOffsetY >= 24 && recentSheetDragVelocityY >= 0.58;
    if (recentSheetDragOffsetY >= distanceThreshold || fastDownwardFling) dismissRecentSheetAfterDrag();
    else restoreRecentSheetAfterDrag();
  }

  function bindRecentSheetDrag(overlay) {
    if (!overlay || overlay.dataset.gcSwipeDismissBound === '1') return;
    overlay.dataset.gcSwipeDismissBound = '1';
    overlay.addEventListener('pointerdown', event => {
      if (!event.target.closest('.gc-recent-sheet-handle, .gc-recent-sheet-head')) return;
      beginRecentSheetDrag(event);
    });
    overlay.addEventListener('pointermove', moveRecentSheetDrag, { passive: false });
    overlay.addEventListener('pointerup', event => endRecentSheetDrag(event, false));
    overlay.addEventListener('pointercancel', event => endRecentSheetDrag(event, true));
  }

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
      <button class="recent-clear-all" type="button" aria-label="清除全部最近地址">${escapeHtml(COMMON['最近地址清除全部'] || '清除全部')}</button>` : '';
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
    // M2R5 iOS gesture lock: the body-level picker owns vertical gestures that begin inside it.
    // If its own content can scroll, scroll only the panel; at its edges (or when not scrollable),
    // prevent scroll chaining into the page so the fixed popover cannot visually chase the finger.
    panel.addEventListener('touchstart', event => {
      if (event.touches?.length !== 1) return;
      recentQuickPickerTouchActive = true;
      recentQuickPickerTouchLastY = Number(event.touches[0].clientY || 0);
    }, { passive: true });
    panel.addEventListener('touchmove', event => {
      if (!recentQuickPickerTouchActive || event.touches?.length !== 1) return;
      const y = Number(event.touches[0].clientY || 0);
      const delta = recentQuickPickerTouchLastY - y;
      recentQuickPickerTouchLastY = y;
      const maxScrollTop = Math.max(0, panel.scrollHeight - panel.clientHeight);
      const canScroll = maxScrollTop > 1;
      const atTop = panel.scrollTop <= 0.5;
      const atBottom = panel.scrollTop >= maxScrollTop - 0.5;
      const wouldChainToPage = !canScroll || (delta < 0 && atTop) || (delta > 0 && atBottom);
      if (wouldChainToPage && event.cancelable) event.preventDefault();
      event.stopPropagation();
    }, { passive: false });
    const endRecentPortalTouch = () => {
      recentQuickPickerTouchActive = false;
      recentQuickPickerTouchLastY = 0;
    };
    panel.addEventListener('touchend', endRecentPortalTouch, { passive: true });
    panel.addEventListener('touchcancel', endRecentPortalTouch, { passive: true });
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
      if (event.target.closest('.recent-clear-all')) {
        event.preventDefault();
        event.stopPropagation();
        closeRecentQuickPicker();
        openRecentClearModal(clearRecentAddresses);
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
    recentQuickPickerLayoutWidth = 0;
    recentQuickPickerOrientationKey = '';
    recentQuickPickerTouchActive = false;
    recentQuickPickerTouchLastY = 0;
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
    captureRecentQuickPickerViewportSignature();
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
    bindRecentSheetDrag(overlay);

    overlay.addEventListener('click', event => {
      if (performance.now() < recentSheetSuppressClickUntil) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
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
    clearRecentSheetDragState();
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
    clearRecentSheetDragState();
    recentSheetSuppressClickUntil = 0;
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
    // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R1_RECENT_SINGLE_STAGE_PREMIUM_QUICK_PICKER: recent addresses are intentionally single-stage — quick select + clear-all only.
    // Common trips remain the separate long-term, user-managed route feature.
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
        if (event.target.closest('.recent-clear-all')) {
          event.preventDefault();
          event.stopPropagation();
          closeRecentQuickPicker();
          openRecentClearModal(clearRecentAddresses);
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
      // M2R5: once opened, the recent-address popover is a fixed viewport surface. Ordinary page
      // scroll, LINE/Safari chrome movement and visualViewport scroll/resize must NOT continuously
      // re-anchor it; that feedback loop is what made the iPhone 13 popover follow the finger/shake.
      // The touch guard above prevents gestures originating inside the panel from scrolling the page.
      // Only a real layout-width/orientation change is structural enough to dismiss the popover.
      const handleRecentQuickPickerLayoutResize = () => {
        if (recentManagementOpen || !activeRecentControl) return;
        const currentLayoutWidth = getRecentQuickPickerLayoutWidth();
        const currentOrientationKey = getRecentQuickPickerOrientationKey();
        const widthChanged = recentQuickPickerLayoutWidth > 0
          && Math.abs(currentLayoutWidth - recentQuickPickerLayoutWidth) >= 8;
        const orientationChanged = Boolean(recentQuickPickerOrientationKey)
          && currentOrientationKey !== recentQuickPickerOrientationKey;
        if (widthChanged || orientationChanged) closeRecentQuickPicker();
      };
      window.addEventListener('resize', handleRecentQuickPickerLayoutResize, { passive: true });
    }
  }

  function renderConfirmationModal() {
    return `
      <div class="confirm-overlay hidden" id="confirmOverlay">
        <section class="confirm-card" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
          <h2 id="confirmTitle"></h2>
          <div class="confirm-purpose" id="confirmPurpose" role="note">
            <strong class="confirm-purpose-title" id="confirmPurposeTitle">✓ 送出前最後確認</strong>
            <p class="confirm-intro" id="confirmIntro">${escapeHtml(COMMON['確認提醒'] || '請確認上、下車地點與資料是否正確。')}</p>
          </div>
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

  function openConfirmation(title, rows, action, options = {}) {
    const overlay = document.getElementById('confirmOverlay');
    const titleElement = document.getElementById('confirmTitle');
    const introElement = document.getElementById('confirmIntro');
    const purposeTitleElement = document.getElementById('confirmPurposeTitle');
    const sendButton = document.getElementById('confirmSendBtn');
    const summary = document.getElementById('confirmSummary');
    const introPrimary = String(options.introPrimary || '').trim();
    const introSecondary = String(options.introSecondary || '').trim();
    const purposeTitle = String(options.purposeTitle || '✓ 送出前最後確認').trim();
    const sendLabel = String(options.sendLabel || COMMON['確認送出按鈕'] || '確認送出').trim();
    const hasCustomIntro = Boolean(introPrimary || introSecondary);
    const defaultIntro = COMMON['確認提醒'] || '請確認上、下車地點與資料是否正確。';
    if (!overlay || !titleElement || !summary) {
      const fallbackText = rows
        .filter(row => row && row.value !== undefined && row.value !== null && String(row.value).trim() !== '')
        .map(row => `${row.label}：${row.value}`)
        .join('\n');
      const fallbackIntro = hasCustomIntro
        ? [introPrimary, introSecondary].filter(Boolean).join('\n')
        : defaultIntro;
      const fallbackPrompt = hasCustomIntro
        ? `${title}\n\n${fallbackIntro}\n\n${fallbackText}\n\n確定送出嗎？`
        : `${title}\n\n${fallbackText}\n\n確定送出嗎？`;
      if (window.confirm(fallbackPrompt)) {
        Promise.resolve(action()).catch(error => showGlobalError(error?.message || COMMON['傳送失敗文字']));
      }
      return;
    }
    titleElement.textContent = title;
    if (purposeTitleElement) purposeTitleElement.textContent = purposeTitle;
    if (sendButton) {
      sendButton.textContent = sendLabel;
      sendButton.dataset.confirmLabel = sendLabel;
    }
    if (introElement) {
      introElement.classList.toggle('gc-call-review-intro', hasCustomIntro);
      introElement.replaceChildren();
      if (hasCustomIntro) {
        if (introPrimary) {
          const primary = document.createElement('span');
          primary.className = 'confirm-intro-primary';
          primary.textContent = introPrimary;
          introElement.append(primary);
        }
        if (introSecondary) {
          const secondary = document.createElement('span');
          secondary.className = 'confirm-intro-secondary';
          secondary.textContent = introSecondary;
          introElement.append(secondary);
        }
      } else {
        introElement.textContent = defaultIntro;
      }
    }
    summary.innerHTML = rows
      .filter(row => row && row.value !== undefined && row.value !== null && String(row.value).trim() !== '')
      .map(row => row.note
        ? `<div class="confirm-row-note${row.warning ? ' confirm-row-warning' : ''}">${escapeHtml(row.value)}</div>`
        : `<div class="confirm-row${row.emphasis ? ' confirm-row-emphasis' : ''}${row.warning ? ' confirm-row-warning' : ''}">
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
          currentSendButton.textContent = currentSendButton.dataset.confirmLabel || COMMON['確認送出按鈕'] || '確認送出';
        }
        if (currentBackButton) currentBackButton.disabled = false;
        confirmationBusy = false;
      }
    });
  }

  function renderRideLike(mode, cfg) {
    attachedLocation = null;
    document.querySelector('body > #gcDatePickerOverlay')?.remove();
    document.querySelector('body > #gcTimePickerOverlay')?.remove();
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
      </section>
      ${renderDatePicker()}
      ${renderTimePicker()}`;

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

  function emitScheduleState() {
    document.getElementById('serviceForm')?.dispatchEvent(new CustomEvent('gc:schedule-state'));
  }

  function parseReservationTime(rawValue) {
    const match = /^(\d{2}):(\d{2})$/.exec(String(rawValue || ''));
    if (!match) return null;
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
    return { hour, minute };
  }

  function parseReservationDate(rawValue) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(rawValue || ''));
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(Date.UTC(year, month - 1, day, 12));
    if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
    return { year, month, day, date, value: `${match[1]}-${match[2]}-${match[3]}` };
  }

  function reservationDateValue(date) {
    return `${String(date.getUTCFullYear()).padStart(4, '0')}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
  }

  function reservationDateAllowed(rawValue, minValue = '') {
    const parsed = parseReservationDate(rawValue);
    if (!parsed) return false;
    const minimum = parseReservationDate(minValue);
    return !minimum || parsed.value >= minimum.value;
  }

  function formatReservationDate(rawValue) {
    const parsed = parseReservationDate(rawValue);
    if (!parsed) return '';
    try {
      return new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'Asia/Taipei'
      }).format(parsed.date);
    } catch (_) {
      return `${String(parsed.year).padStart(4, '0')}/${String(parsed.month).padStart(2, '0')}/${String(parsed.day).padStart(2, '0')}`;
    }
  }

  function reservationScheduleReady() {
    const date = document.getElementById('date');
    const time = document.getElementById('time');
    return Boolean(
      date?.value
      && reservationDateAllowed(date.value, date.min)
      && date.dataset.gcPickerOpen !== '1'
      && date.dataset.gcConfirmed === '1'
      && date.dataset.gcConfirmedValue === date.value
      && time?.value
      && parseReservationTime(time.value)
      && time.dataset.gcConfirmed === '1'
      && time.dataset.gcConfirmedValue === time.value
      && time.dataset.gcPickerOpen !== '1'
    );
  }
  window.GC_isScheduleConfirmed = reservationScheduleReady;

  function bindScheduleControls() {
    const date = document.getElementById('date');
    const dateShell = document.getElementById('dateShell');
    const dateDisplay = document.getElementById('dateDisplay');
    const dateOverlay = document.getElementById('gcDatePickerOverlay');
    const dateCard = document.getElementById('gcDatePicker');
    const dateMonthLabel = document.getElementById('gcDateMonthLabel');
    const datePrevButton = document.getElementById('gcDatePrev');
    const dateNextButton = document.getElementById('gcDateNext');
    const dateGrid = document.getElementById('gcDateGrid');
    const dateCancelButton = document.getElementById('gcDateCancel');
    const dateConfirmButton = document.getElementById('gcDateConfirm');
    const dateStatus = document.getElementById('gcDatePickerStatus');
    const time = document.getElementById('time');
    const trigger = document.getElementById('timeTrigger');
    const display = document.getElementById('timeDisplay');
    const overlay = document.getElementById('gcTimePickerOverlay');
    const card = document.getElementById('gcTimePicker');
    const hourWheel = document.getElementById('gcHourWheel');
    const minuteWheel = document.getElementById('gcMinuteWheel');
    const cancelButton = document.getElementById('gcTimeCancel');
    const confirmButton = document.getElementById('gcTimeConfirm');
    const status = document.getElementById('gcTimePickerStatus');
    const rideCard = document.querySelector('.gc-ride-card');
    if (!date || !dateShell || !dateDisplay || !dateOverlay || !dateCard || !dateMonthLabel || !datePrevButton || !dateNextButton || !dateGrid || !dateCancelButton || !dateConfirmButton || !time || !trigger || !display || !overlay || !card || !hourWheel || !minuteWheel || !cancelButton || !confirmButton) {
      return { reset() {}, close() {} };
    }

    // Keep the fixed overlay outside every card/flow stacking context. It is removed again
    // when the success screen replaces the form.
    if (dateOverlay.parentElement !== document.body) document.body.appendChild(dateOverlay);
    if (overlay.parentElement !== document.body) document.body.appendChild(overlay);

    let dateEdit = null;
    let edit = null;
    const scrollTimers = new Map();
    const visualViewport = window.visualViewport;
    const clamp = (number, min, max) => Math.min(max, Math.max(min, number));

    const wheelLimit = wheel => wheel === hourWheel ? 23 : 59;
    const wheelDraftKey = wheel => wheel === hourWheel ? 'hour' : 'minute';
    const wheelOptionHeight = wheel => wheel.querySelector('.gc-time-option')?.getBoundingClientRect().height || 48;

    function syncDatePresentation() {
      const formattedDate = reservationDateAllowed(date.value, date.min) ? formatReservationDate(date.value) : '';
      dateDisplay.textContent = formattedDate || '請選擇日期';
      dateShell.classList.toggle('is-empty', !formattedDate);
      dateShell.setAttribute(
        'aria-label',
        formattedDate ? `用車日期 ${formattedDate}，按下可重新選擇` : '選擇用車日期'
      );
    }

    function syncTriggerPresentation() {
      const confirmedTime = parseReservationTime(time.value) ? time.value : '';
      display.textContent = confirmedTime || '請選擇時間';
      trigger.classList.toggle('is-empty', !confirmedTime);
      trigger.classList.toggle('is-waiting', !reservationDateAllowed(date.value, date.min));
      trigger.setAttribute(
        'aria-label',
        confirmedTime ? `用車時間 ${confirmedTime}，按下可重新選擇` : '選擇用車時間'
      );
    }

    function syncDatePickerViewport() {
      const viewport = window.visualViewport;
      dateOverlay.style.setProperty('--gc-vv-left', `${viewport?.offsetLeft || 0}px`);
      dateOverlay.style.setProperty('--gc-vv-top', `${viewport?.offsetTop || 0}px`);
      dateOverlay.style.setProperty('--gc-vv-width', `${viewport?.width || window.innerWidth}px`);
      dateOverlay.style.setProperty('--gc-vv-height', `${viewport?.height || window.innerHeight}px`);
    }

    function stopDateViewportTracking() {
      visualViewport?.removeEventListener('resize', syncDatePickerViewport);
      visualViewport?.removeEventListener('scroll', syncDatePickerViewport);
      window.removeEventListener('resize', syncDatePickerViewport);
    }

    function startDateViewportTracking() {
      syncDatePickerViewport();
      visualViewport?.addEventListener('resize', syncDatePickerViewport, { passive: true });
      visualViewport?.addEventListener('scroll', syncDatePickerViewport, { passive: true });
      window.addEventListener('resize', syncDatePickerViewport, { passive: true });
    }

    function setDatePickerOpen(open) {
      dateOverlay.classList.toggle('hidden', !open);
      dateOverlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      dateShell.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (rideCard) {
        try { rideCard.inert = open; } catch (_) {}
      }
    }

    function dateFromParts(year, month, day) {
      return new Date(Date.UTC(year, month - 1, day, 12));
    }

    function shiftedDateValue(rawValue, days) {
      const parsed = parseReservationDate(rawValue);
      if (!parsed) return '';
      const shifted = new Date(parsed.date.getTime());
      shifted.setUTCDate(shifted.getUTCDate() + days);
      return reservationDateValue(shifted);
    }

    function shiftedMonthValue(rawValue, months) {
      const parsed = parseReservationDate(rawValue);
      if (!parsed) return '';
      const first = new Date(Date.UTC(parsed.year, parsed.month - 1 + months, 1, 12));
      const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0, 12)).getUTCDate();
      return reservationDateValue(new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(parsed.day, lastDay), 12)));
    }

    function dateAriaLabel(parsed) {
      try {
        return new Intl.DateTimeFormat('zh-TW', {
          year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', timeZone: 'Asia/Taipei'
        }).format(parsed.date);
      } catch (_) {
        return `${parsed.year}年${parsed.month}月${parsed.day}日`;
      }
    }

    function renderDateCalendar(options = {}) {
      if (!dateEdit) return;
      const minDate = parseReservationDate(date.min);
      const todayValue = minDate?.value || '';
      const firstOfMonth = dateFromParts(dateEdit.viewYear, dateEdit.viewMonth, 1);
      const gridStart = new Date(firstOfMonth.getTime());
      gridStart.setUTCDate(1 - firstOfMonth.getUTCDay());
      dateMonthLabel.textContent = `${dateEdit.viewYear}年${dateEdit.viewMonth}月`;
      const currentMonthOrdinal = (dateEdit.viewYear * 12) + dateEdit.viewMonth;
      const minimumMonthOrdinal = minDate ? (minDate.year * 12) + minDate.month : Number.NEGATIVE_INFINITY;
      const previousDisabled = currentMonthOrdinal <= minimumMonthOrdinal;
      datePrevButton.disabled = previousDisabled;
      datePrevButton.setAttribute('aria-disabled', previousDisabled ? 'true' : 'false');
      const cells = [];
      for (let index = 0; index < 42; index += 1) {
        const cellDate = new Date(gridStart.getTime());
        cellDate.setUTCDate(gridStart.getUTCDate() + index);
        const value = reservationDateValue(cellDate);
        const parsed = parseReservationDate(value);
        const outside = parsed.month !== dateEdit.viewMonth;
        const disabled = Boolean(minDate && value < minDate.value);
        const selected = value === dateEdit.draftValue;
        const today = value === todayValue;
        const classes = ['gc-date-day'];
        if (outside) classes.push('is-outside');
        if (selected) classes.push('is-selected');
        if (today) classes.push('is-today');
        cells.push(`<button class="${classes.join(' ')}" type="button" role="gridcell" data-date="${value}" aria-label="${dateAriaLabel(parsed)}" aria-selected="${selected ? 'true' : 'false'}" aria-disabled="${disabled ? 'true' : 'false'}" tabindex="${selected ? '0' : '-1'}"${disabled ? ' disabled' : ''}>${parsed.day}</button>`);
      }
      dateGrid.innerHTML = cells.join('');
      dateConfirmButton.disabled = !reservationDateAllowed(dateEdit.draftValue, date.min);
      if (dateStatus) dateStatus.textContent = `目前選擇 ${formatReservationDate(dateEdit.draftValue)}`;
      if (options.focusValue) {
        requestAnimationFrame(() => {
          const target = dateGrid.querySelector(`[data-date="${options.focusValue}"]:not([disabled])`) || dateGrid.querySelector('.gc-date-day:not([disabled])');
          try { target?.focus({ preventScroll: true }); }
          catch (_) { try { target?.focus(); } catch (_) {} }
        });
      }
    }

    function selectDateDraft(nextValue, options = {}) {
      const parsed = parseReservationDate(nextValue);
      if (!dateEdit || !parsed || !reservationDateAllowed(parsed.value, date.min)) return;
      dateEdit.draftValue = parsed.value;
      dateEdit.viewYear = parsed.year;
      dateEdit.viewMonth = parsed.month;
      renderDateCalendar({ focusValue: options.focus === false ? '' : parsed.value });
    }

    function finishDateClose(restorePrevious, options = {}) {
      if (dateOverlay.classList.contains('hidden')) return;
      const previousConfirmed = dateEdit?.previousConfirmed === true;
      const previousValue = dateEdit?.previousValue || '';
      const focusWasInsidePicker = dateOverlay.contains(document.activeElement);
      setDatePickerOpen(false);
      stopDateViewportTracking();
      delete date.dataset.gcPickerOpen;
      if (restorePrevious) {
        date.value = previousValue;
        if (previousConfirmed && reservationDateAllowed(previousValue, date.min)) {
          date.dataset.gcConfirmed = '1';
          date.dataset.gcConfirmedValue = previousValue;
        } else {
          delete date.dataset.gcConfirmed;
          delete date.dataset.gcConfirmedValue;
        }
      }
      syncDatePresentation();
      dateEdit = null;
      unlockViewport();
      emitScheduleState();
      if (options.restoreFocus === false) {
        if (focusWasInsidePicker) try { document.activeElement?.blur(); } catch (_) {}
        return;
      }
      if (document.getElementById('scheduleFields')?.classList.contains('hidden')) return;
      try { dateShell.focus({ preventScroll: true }); }
      catch (_) { try { dateShell.focus(); } catch (_) {} }
    }

    function openDatePicker() {
      if (!dateOverlay.classList.contains('hidden') || !overlay.classList.contains('hidden')) return;
      setDateMinimum();
      const current = parseReservationDate(date.value);
      const minimum = parseReservationDate(date.min);
      const initial = current && reservationDateAllowed(current.value, date.min) ? current : minimum;
      if (!initial) return;
      dateEdit = {
        previousValue: date.value,
        previousConfirmed: date.dataset.gcConfirmed === '1' && date.dataset.gcConfirmedValue === date.value,
        draftValue: initial.value,
        viewYear: initial.year,
        viewMonth: initial.month
      };
      date.dataset.gcPickerOpen = '1';
      delete date.dataset.gcConfirmed;
      delete date.dataset.gcConfirmedValue;
      clearFieldValidation('date');
      lockViewport();
      setDatePickerOpen(true);
      startDateViewportTracking();
      renderDateCalendar({ focusValue: initial.value });
      emitScheduleState();
    }

    function confirmDate() {
      if (!dateEdit || !reservationDateAllowed(dateEdit.draftValue, date.min)) return;
      const nextValue = dateEdit.draftValue;
      date.value = nextValue;
      date.dataset.gcConfirmed = '1';
      date.dataset.gcConfirmedValue = nextValue;
      delete date.dataset.gcPickerOpen;
      clearFieldValidation('date');
      syncDatePresentation();
      finishDateClose(false);
      date.dispatchEvent(new Event('input', { bubbles: true }));
      date.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function changeDateMonth(delta) {
      if (!dateEdit) return;
      const target = new Date(Date.UTC(dateEdit.viewYear, dateEdit.viewMonth - 1 + delta, 1, 12));
      const minimum = parseReservationDate(date.min);
      if (minimum && target < dateFromParts(minimum.year, minimum.month, 1)) return;
      dateEdit.viewYear = target.getUTCFullYear();
      dateEdit.viewMonth = target.getUTCMonth() + 1;
      renderDateCalendar();
    }

    function syncPickerViewport() {
      const viewport = window.visualViewport;
      overlay.style.setProperty('--gc-vv-left', `${viewport?.offsetLeft || 0}px`);
      overlay.style.setProperty('--gc-vv-top', `${viewport?.offsetTop || 0}px`);
      overlay.style.setProperty('--gc-vv-width', `${viewport?.width || window.innerWidth}px`);
      overlay.style.setProperty('--gc-vv-height', `${viewport?.height || window.innerHeight}px`);
    }

    function updateTimeStatus() {
      if (!edit || !status) return;
      status.textContent = `目前選擇 ${String(edit.hour).padStart(2, '0')} 時 ${String(edit.minute).padStart(2, '0')} 分`;
    }

    function selectWheelValue(wheel, nextValue, options = {}) {
      if (!edit) return;
      const value = clamp(Number(nextValue) || 0, 0, wheelLimit(wheel));
      edit[wheelDraftKey(wheel)] = value;
      const label = String(value).padStart(2, '0');
      wheel.querySelectorAll('.gc-time-option').forEach(option => {
        const selected = option.dataset.value === label;
        option.setAttribute('aria-selected', selected ? 'true' : 'false');
        // Focus stays on the listbox; aria-activedescendant exposes its selected option
        // without adding 84 duplicate Tab stops.
        option.tabIndex = -1;
        option.classList.toggle('is-selected', selected);
        if (selected) wheel.setAttribute('aria-activedescendant', option.id);
      });
      if (options.scroll !== false) {
        wheel.scrollTo({ top: value * wheelOptionHeight(wheel), behavior: options.behavior || 'auto' });
      }
      updateTimeStatus();
    }

    function commitWheelPosition(wheel) {
      if (!edit) return;
      const value = clamp(Math.round(wheel.scrollTop / wheelOptionHeight(wheel)), 0, wheelLimit(wheel));
      selectWheelValue(wheel, value, { scroll: false });
    }

    function scheduleWheelCommit(wheel, delay = 90) {
      clearTimeout(scrollTimers.get(wheel));
      scrollTimers.set(wheel, setTimeout(() => commitWheelPosition(wheel), delay));
    }

    function bindWheel(wheel) {
      wheel.addEventListener('scroll', () => scheduleWheelCommit(wheel), { passive: true });
      wheel.addEventListener('pointerup', () => scheduleWheelCommit(wheel, 40), { passive: true });
      wheel.addEventListener('touchend', () => scheduleWheelCommit(wheel, 80), { passive: true });
      wheel.addEventListener('click', event => {
        const option = event.target.closest('.gc-time-option');
        if (!option) return;
        // Synchronous positioning keeps an immediate Done click from reading an
        // intermediate smooth-scroll offset and overwriting the chosen draft.
        selectWheelValue(wheel, Number(option.dataset.value), { behavior: 'auto' });
        try { wheel.focus({ preventScroll: true }); }
        catch (_) { try { wheel.focus(); } catch (_) {} }
      });
      wheel.addEventListener('keydown', event => {
        if (!edit) return;
        const key = wheelDraftKey(wheel);
        let next = edit[key];
        if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next -= 1;
        else if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next += 1;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = wheelLimit(wheel);
        else if (event.key === 'PageUp') next -= 5;
        else if (event.key === 'PageDown') next += 5;
        else return;
        event.preventDefault();
        selectWheelValue(wheel, next, { behavior: 'auto' });
      });
    }

    function setPickerOpen(open) {
      overlay.classList.toggle('hidden', !open);
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (rideCard) {
        try { rideCard.inert = open; } catch (_) {}
      }
    }

    function stopViewportTracking() {
      visualViewport?.removeEventListener('resize', syncPickerViewport);
      visualViewport?.removeEventListener('scroll', syncPickerViewport);
      window.removeEventListener('resize', syncPickerViewport);
    }

    function startViewportTracking() {
      syncPickerViewport();
      visualViewport?.addEventListener('resize', syncPickerViewport, { passive: true });
      visualViewport?.addEventListener('scroll', syncPickerViewport, { passive: true });
      window.addEventListener('resize', syncPickerViewport, { passive: true });
    }

    function finishClose(restorePrevious, options = {}) {
      if (overlay.classList.contains('hidden')) return;
      const previousConfirmed = edit?.previousConfirmed === true;
      const previousValue = edit?.previousValue || '';
      const focusWasInsidePicker = overlay.contains(document.activeElement);
      scrollTimers.forEach(timer => clearTimeout(timer));
      scrollTimers.clear();
      setPickerOpen(false);
      stopViewportTracking();
      delete time.dataset.gcPickerOpen;
      if (restorePrevious) {
        // Wheel movement only changes edit.hour/minute. This assignment is defensive and
        // guarantees that Cancel/backdrop/Escape restore the exact canonical value.
        time.value = previousValue;
        if (previousConfirmed && parseReservationTime(previousValue)) {
          time.dataset.gcConfirmed = '1';
          time.dataset.gcConfirmedValue = previousValue;
        } else {
          delete time.dataset.gcConfirmed;
          delete time.dataset.gcConfirmedValue;
        }
      }
      syncTriggerPresentation();
      edit = null;
      unlockViewport();
      emitScheduleState();
      if (options.restoreFocus === false) {
        if (focusWasInsidePicker) {
          try { document.activeElement?.blur(); } catch (_) {}
        }
        return;
      }
      if (document.getElementById('scheduleFields')?.classList.contains('hidden')) return;
      try { trigger.focus({ preventScroll: true }); }
      catch (_) { try { trigger.focus(); } catch (_) {} }
    }

    function openPicker() {
      if (!overlay.classList.contains('hidden') || !dateOverlay.classList.contains('hidden')) return;
      scrollTimers.forEach(timer => clearTimeout(timer));
      scrollTimers.clear();
      const parsed = parseReservationTime(time.value);
      const now = new Date();
      edit = {
        previousValue: time.value,
        previousConfirmed: time.dataset.gcConfirmed === '1' && time.dataset.gcConfirmedValue === time.value,
        hour: parsed ? parsed.hour : now.getHours(),
        minute: parsed ? parsed.minute : now.getMinutes()
      };
      time.dataset.gcPickerOpen = '1';
      delete time.dataset.gcConfirmed;
      delete time.dataset.gcConfirmedValue;
      clearFieldValidation('time');
      lockViewport();
      setPickerOpen(true);
      startViewportTracking();
      emitScheduleState();
      requestAnimationFrame(() => {
        selectWheelValue(hourWheel, edit.hour, { behavior: 'auto' });
        selectWheelValue(minuteWheel, edit.minute, { behavior: 'auto' });
        try { hourWheel.focus({ preventScroll: true }); }
        catch (_) { try { hourWheel.focus(); } catch (_) {} }
      });
    }

    function confirmTime() {
      if (!edit) return;
      commitWheelPosition(hourWheel);
      commitWheelPosition(minuteWheel);
      const nextValue = `${String(edit.hour).padStart(2, '0')}:${String(edit.minute).padStart(2, '0')}`;
      time.value = nextValue;
      display.textContent = nextValue;
      time.dataset.gcConfirmed = '1';
      time.dataset.gcConfirmedValue = nextValue;
      delete time.dataset.gcPickerOpen;
      syncTriggerPresentation();
      finishClose(false);
      time.dispatchEvent(new Event('input', { bubbles: true }));
      time.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function resetSchedule(options = {}) {
      date.value = '';
      time.value = '';
      delete date.dataset.gcConfirmed;
      delete date.dataset.gcConfirmedValue;
      delete date.dataset.gcPickerOpen;
      delete time.dataset.gcConfirmed;
      delete time.dataset.gcConfirmedValue;
      delete time.dataset.gcPickerOpen;
      syncDatePresentation();
      syncTriggerPresentation();
      if (!dateOverlay.classList.contains('hidden')) finishDateClose(false, { restoreFocus: options.restoreFocus !== false });
      if (!overlay.classList.contains('hidden')) {
        finishClose(false, { restoreFocus: options.restoreFocus !== false });
      }
      emitScheduleState();
    }

    bindWheel(hourWheel);
    bindWheel(minuteWheel);
    syncDatePresentation();
    syncTriggerPresentation();
    dateShell.addEventListener('click', openDatePicker);
    datePrevButton.addEventListener('click', () => changeDateMonth(-1));
    dateNextButton.addEventListener('click', () => changeDateMonth(1));
    dateCancelButton.addEventListener('click', () => finishDateClose(true));
    dateConfirmButton.addEventListener('click', confirmDate);
    dateGrid.addEventListener('click', event => {
      const day = event.target.closest('.gc-date-day[data-date]');
      if (!day || day.disabled || day.getAttribute('aria-disabled') === 'true') return;
      selectDateDraft(day.dataset.date);
    });
    dateGrid.addEventListener('keydown', event => {
      const day = event.target.closest('.gc-date-day[data-date]');
      if (!day || !dateEdit) return;
      let nextValue = day.dataset.date;
      const parsed = parseReservationDate(nextValue);
      if (event.key === 'ArrowLeft') nextValue = shiftedDateValue(nextValue, -1);
      else if (event.key === 'ArrowRight') nextValue = shiftedDateValue(nextValue, 1);
      else if (event.key === 'ArrowUp') nextValue = shiftedDateValue(nextValue, -7);
      else if (event.key === 'ArrowDown') nextValue = shiftedDateValue(nextValue, 7);
      else if (event.key === 'Home') nextValue = shiftedDateValue(nextValue, -parsed.date.getUTCDay());
      else if (event.key === 'End') nextValue = shiftedDateValue(nextValue, 6 - parsed.date.getUTCDay());
      else if (event.key === 'PageUp') nextValue = shiftedMonthValue(nextValue, -1);
      else if (event.key === 'PageDown') nextValue = shiftedMonthValue(nextValue, 1);
      else return;
      event.preventDefault();
      if (reservationDateAllowed(nextValue, date.min)) selectDateDraft(nextValue);
    });
    dateOverlay.addEventListener('click', event => { if (event.target === dateOverlay) finishDateClose(true); });
    dateOverlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        finishDateClose(true);
        return;
      }
      if (event.key !== 'Tab') return;
      const controls = [...dateCard.querySelectorAll('button:not([disabled]):not([tabindex="-1"])')].filter(control => control.offsetParent !== null);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!controls.includes(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    trigger.addEventListener('click', openPicker);
    cancelButton.addEventListener('click', () => finishClose(true));
    confirmButton.addEventListener('click', confirmTime);
    overlay.addEventListener('click', event => { if (event.target === overlay) finishClose(true); });
    overlay.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        finishClose(true);
        return;
      }
      if (event.key !== 'Tab') return;
      const controls = [...card.querySelectorAll('[tabindex="0"],button:not([disabled]):not([tabindex="-1"])')]
        .filter(control => control.offsetParent !== null);
      if (!controls.length) return;
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!controls.includes(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    // Canonical YYYY-MM-DD stays in the hidden native input for validation, LINE output.
    const syncCanonicalDate = () => {
      syncDatePresentation();
      syncTriggerPresentation();
      if (reservationDateAllowed(date.value, date.min) && date.dataset.gcPickerOpen !== '1' && date.value === date.dataset.gcConfirmedValue) {
        date.dataset.gcConfirmed = '1';
      } else {
        delete date.dataset.gcConfirmed;
        if (date.dataset.gcPickerOpen !== '1') delete date.dataset.gcConfirmedValue;
      }
      emitScheduleState();
    };
    date.addEventListener('input', syncCanonicalDate, { passive: true });
    date.addEventListener('change', syncCanonicalDate, { passive: true });

    const resetPersistedSchedule = event => {
      if (!event.persisted) return;
      // A bfcache snapshot can preserve form values, data attributes and expanded DOM.
      // Clear the canonical schedule so returning users must explicitly confirm both
      // controls again; instant service still becomes ready solely from its radio value.
      resetSchedule({ restoreFocus: false });
    };
    window.addEventListener('pagehide', resetPersistedSchedule, { passive: true });
    window.addEventListener('pageshow', resetPersistedSchedule, { passive: true });

    return { reset: resetSchedule, close: () => { finishDateClose(false); finishClose(false); } };
  }

  function clearFieldValidation(id) {
    const input = document.getElementById(id);
    const visualControl = id === 'date'
      ? document.getElementById('dateShell')
      : id === 'time' ? document.getElementById('timeTrigger') : input;
    const accessibleControl = id === 'date' || id === 'time' ? visualControl : input;
    const error = document.getElementById(`${id}Error`);
    if (visualControl) {
      visualControl.classList.remove('invalid');
    }
    accessibleControl?.removeAttribute('aria-invalid');
    visualControl?.closest('.field')?.classList.remove('gc-validation-error');
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
    document.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute('aria-invalid'));
    document.querySelectorAll('.gc-validation-error').forEach(el => el.classList.remove('gc-validation-error'));
    const global = document.getElementById('globalError');
    if (global) {
      global.textContent = '';
      global.classList.remove('show');
    }
  }

  function showFieldError(id, message) {
    const input = document.getElementById(id);
    const visualControl = id === 'date'
      ? document.getElementById('dateShell')
      : id === 'time' ? document.getElementById('timeTrigger') : input;
    const accessibleControl = id === 'date' || id === 'time' ? visualControl : input;
    const error = document.getElementById(`${id}Error`);
    if (visualControl) {
      visualControl.classList.add('invalid');
      visualControl.closest('.field')?.classList.add('gc-validation-error');
    }
    accessibleControl?.setAttribute('aria-invalid', 'true');
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
      const target = field.querySelector('.gc-date-shell:not([disabled]), .gc-time-trigger:not([disabled]), input:not([type="hidden"]):not([type="radio"]), select, textarea, input[type="radio"]');
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

  function addressInteractionOwnsKeyboardLayout(target) {
    const element = target?.closest ? target : target?.parentElement;
    const addressField = element?.closest?.('.address-field');
    const editor = addressField?.querySelector?.(':scope > input.input');
    return Boolean(editor && (editor.id === 'pickup' || editor.id === 'destination'));
  }

  function closeManagedDisclosuresOutside(target) {
    // M2R12: never shrink an unrelated disclosure during the same gesture that focuses an
    // address field (or one of its utility/suggestion controls). iOS may be opening the keyboard
    // at that exact moment; changing document height here is the reproducible jump-to-pickup race.
    if (addressInteractionOwnsKeyboardLayout(target)) return;
    managedDisclosures().forEach(details => {
      if (!details.open || details.contains(target)) return;
      // Smart collapse: explanation-only panels close automatically, but a form section
      // holding actual customer choices stays open so the customer can verify them.
      if (disclosureHasMeaningfulData(details)) return;
      details.open = false;
    });
  }

  // M2R13: a user-initiated collapse of the tall "其他需求" section can remove more
  // document height than remains below the current viewport. iOS/LINE WebView then clamps
  // scrollY immediately and the page appears to jump a large distance upward. Reserve the
  // disappearing height BEFORE the native <details> toggle, then reduce that reserve to the
  // exact minimum tail capacity required to keep the clicked row at the same visual position.
  // No global scrollTo/scrollBy is used; M2R12 remains the sole owner of address-keyboard scrolling.
  let gcUserDisclosureCollapseSpacer = null;
  let gcUserDisclosureCollapseState = null;
  let gcUserDisclosureCollapseScrollRaf = 0;

  function rideOptionalDisclosureEligible(details) {
    if (!(details instanceof HTMLDetailsElement)) return false;
    if (!details.matches('details.optional-box:not(.favorite-box)')) return false;
    if (!details.closest('#serviceForm') || !details.querySelector(':scope > .optional-content')) return false;
    return ['call', 'driver'].includes(activeModeForViewportStability());
  }

  function ensureUserDisclosureCollapseSpacer() {
    if (gcUserDisclosureCollapseSpacer?.isConnected) return gcUserDisclosureCollapseSpacer;
    const spacer = document.createElement('div');
    spacer.id = 'gcUserDisclosureCollapseSpacer';
    spacer.setAttribute('aria-hidden', 'true');
    spacer.style.cssText = 'display:block;width:1px;min-width:1px;height:0;pointer-events:none;visibility:hidden;';
    document.body.appendChild(spacer);
    gcUserDisclosureCollapseSpacer = spacer;
    return spacer;
  }

  function userDisclosureViewportHeight() {
    return Math.max(1, Number(
      window.visualViewport?.height ||
      window.innerHeight ||
      document.documentElement?.clientHeight ||
      0
    ));
  }

  function userDisclosureSpacerHeight() {
    const spacer = gcUserDisclosureCollapseSpacer;
    if (!spacer?.isConnected) return 0;
    return Math.max(0, Number.parseFloat(spacer.style.height) || spacer.getBoundingClientRect().height || 0);
  }

  function removeUserDisclosureCollapseSpacer() {
    gcUserDisclosureCollapseState = null;
    if (!gcUserDisclosureCollapseSpacer) return;
    gcUserDisclosureCollapseSpacer.remove();
    gcUserDisclosureCollapseSpacer = null;
  }

  function settleUserDisclosureCollapseSpacerToCurrentScroll() {
    const spacer = gcUserDisclosureCollapseSpacer;
    if (!spacer?.isConnected) return;
    const reserve = userDisclosureSpacerHeight();
    if (reserve <= 0) {
      removeUserDisclosureCollapseSpacer();
      return;
    }
    const viewportHeight = userDisclosureViewportHeight();
    const naturalHeight = Math.max(0, document.documentElement.scrollHeight - reserve);
    const currentScrollY = Math.max(0, window.scrollY || window.pageYOffset || 0);
    // Keep maxScrollY just beyond the current scroll position. This is the minimum invisible
    // tail needed to prevent WebKit's clamp; scrolling upward naturally shrinks it to zero.
    const needed = Math.max(0, Math.ceil(currentScrollY + viewportHeight - naturalHeight + 3));
    if (needed <= 3) {
      removeUserDisclosureCollapseSpacer();
      return;
    }
    if (needed < reserve - 0.5) spacer.style.height = `${needed}px`;
  }

  function prepareUserDisclosureCollapseAnchor(details, summary) {
    if (!rideOptionalDisclosureEligible(details) || !details.open || !summary?.isConnected) return;
    const detailsRect = details.getBoundingClientRect();
    const summaryRect = summary.getBoundingClientRect();
    const removableHeight = Math.max(0, detailsRect.height - summaryRect.height);
    if (removableHeight <= 2) return;

    const spacer = ensureUserDisclosureCollapseSpacer();
    const existingReserve = userDisclosureSpacerHeight();
    // Reserve before the native <summary> default action closes the details. The reserve lives
    // at BODY tail only; it never changes form geometry or the location of the clicked summary.
    spacer.style.height = `${Math.ceil(existingReserve + removableHeight + 4)}px`;

    const active = document.activeElement;
    gcUserDisclosureCollapseState = {
      details,
      keyboardInput: rideAddressKeyboardDismissInputEligible(active) ? active : null
    };
  }

  function finishUserDisclosureCollapseAnchor(details) {
    const state = gcUserDisclosureCollapseState;
    const spacer = gcUserDisclosureCollapseSpacer;
    if (!state || state.details !== details || !spacer?.isConnected || details.open) return;

    const finalize = () => {
      if (!spacer.isConnected || details.open) return;
      settleUserDisclosureCollapseSpacerToCurrentScroll();
      gcUserDisclosureCollapseState = null;
    };

    // If the same tap also dismissed an address keyboard, wait for the existing M2R12 viewport
    // transaction. Otherwise use two paint frames so native <details> geometry is final first.
    if (state.keyboardInput && typeof runAfterRideKeyboardDismissSettles === 'function') {
      runAfterRideKeyboardDismissSettles(state.keyboardInput, finalize, { minDelay: 280, maxDelay: 1180 });
    } else {
      requestAnimationFrame(() => requestAnimationFrame(finalize));
    }
  }

  function handleUserDisclosureAnchorScroll() {
    if (!gcUserDisclosureCollapseSpacer?.isConnected) return;
    cancelAnimationFrame(gcUserDisclosureCollapseScrollRaf);
    gcUserDisclosureCollapseScrollRaf = requestAnimationFrame(() => {
      gcUserDisclosureCollapseScrollRaf = 0;
      settleUserDisclosureCollapseSpacerToCurrentScroll();
    });
  }

  window.addEventListener('scroll', handleUserDisclosureAnchorScroll, { passive: true });
  window.addEventListener('resize', () => {
    if (!gcUserDisclosureCollapseSpacer?.isConnected) return;
    requestAnimationFrame(settleUserDisclosureCollapseSpacerToCurrentScroll);
  }, { passive: true });

  window.GC_prepareUserDisclosureCollapseAnchor = prepareUserDisclosureCollapseAnchor;
  window.GC_finishUserDisclosureCollapseAnchor = finishUserDisclosureCollapseAnchor;
  window.GC_settleUserDisclosureCollapseSpacer = settleUserDisclosureCollapseSpacerToCurrentScroll;

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
      if (addressInteractionOwnsKeyboardLayout(target)) return;
      setTimeout(() => {
        // Focus is assigned before click in mobile WebViews. Re-check the actual focused address
        // editor so no zero-delay collapse can race the keyboard even if the click target is nested.
        if (addressInteractionOwnsKeyboardLayout(document.activeElement)) return;
        closeManagedDisclosuresOutside(target);
      }, 0);
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
        summary.addEventListener('click', event => {
          if (event.defaultPrevented || !details.open) return;
          if (typeof event.button === 'number' && event.button !== 0) return;
          prepareUserDisclosureCollapseAnchor(details, summary);
        }, true);
        details.addEventListener('toggle', () => {
          sync();
          if (details.open) {
            // Re-opening restores document height, so any tail reserve is no longer needed.
            requestAnimationFrame(settleUserDisclosureCollapseSpacerToCurrentScroll);
          } else {
            finishUserDisclosureCollapseAnchor(details);
          }
        });
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
    const scheduleControls = bindScheduleControls();
    bindRecentAddressControls();
    bindSmallDisclosureTriggers();
    installVerticalOnlyTouchGuard();
    bindFavoriteTrips();
    bindFavoriteSaveModal();
    bindFavoriteEditModal();
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
          scheduleControls.reset();
          clearFieldValidation('date');
          clearFieldValidation('time');
        } else {
          emitScheduleState();
        }
        updateLocationVisibility(mode);
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
      const dateControl = document.getElementById('date');
      const timeControl = document.getElementById('time');
      const dateConfirmed = Boolean(dateControl?.value && reservationDateAllowed(dateControl.value, dateControl.min) && dateControl.dataset.gcConfirmed === '1' && dateControl.dataset.gcConfirmedValue === dateControl.value && dateControl.dataset.gcPickerOpen !== '1');
      const timeConfirmed = Boolean(parseReservationTime(timeControl?.value) && timeControl.dataset.gcConfirmed === '1' && timeControl.dataset.gcConfirmedValue === timeControl.value && timeControl.dataset.gcPickerOpen !== '1');
      if (serviceType === 'reserve' && !dateConfirmed) {
        showFieldError('date', cfg['錯誤_日期']);
        valid = false;
      }
      if (serviceType === 'reserve' && !timeConfirmed) {
        showFieldError('time', cfg['錯誤_時間']);
        valid = false;
      }
      const noDoorLocationForValidation = noDoorBoundLocation();
      if (!pickup || pickup === LOCATION_MARKER) {
        showFieldError('pickup', cfg['錯誤_上車地址']);
        valid = false;
      }
      if ((attachedLocation?.noDoor === true && !noDoorLocationForValidation) || (isLocationStateDisplayText(pickup) && !noDoorLocationForValidation)) {
        showFieldError('pickup', '定位狀態已失效，請重新取得位置或直接改填地址。');
        valid = false;
      }
      if (serviceType === 'instant' && attachedLocation?.requiresConfirmation && !attachedLocation.confirmed) {
        showFieldError('pickup', '請確認定位地址。');
        setLocationReview('請確認門牌是否正確；若不符，請直接修改地址。', true);
        valid = false;
      }
      if (valid && pickup && !noDoorLocationForValidation && !(attachedLocation?.requiresConfirmation && !attachedLocation.confirmed)) {
        if (!(await verifyAddressField('pickup', { showError: true, policy: 'manual-authoritative' }))) valid = false;
      }
      if (valid && destination) {
        // Call / drunk-driver drop-off is descriptive dispatch context, not a Google route input.
        // Keep smart suggestions available, but do not block a valid request just because it is broad.
        if (!(await verifyAddressField('destination', { showError: true, policy: 'manual-authoritative' }))) valid = false;
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
        const latestNoDoorLocation = noDoorBoundLocation();
        let latestValid = Boolean(pickup && pickup !== LOCATION_MARKER && (!(isLocationStateDisplayText(pickup) || attachedLocation?.noDoor === true) || latestNoDoorLocation));
        if (latestValid && !latestNoDoorLocation && !(await verifyAddressField('pickup', { showError: true, policy: 'manual-authoritative' }))) latestValid = false;
        if (latestValid && destination && !(await verifyAddressField('destination', { showError: true, policy: 'manual-authoritative' }))) latestValid = false;
        if (!latestValid) {
          focusFirstValidationError();
          return;
        }
      }

      // Best-effort only: the address remains sendable whether ArcGIS returns two matches,
      // one match, no match, or times out. A short bounded wait lets an in-flight typing check
      // reach the confirmation/LINE warning without turning provider availability into a gate.
      let pickupAdminAmbiguity = noDoorLocationForValidation
        ? null
        : await pickupAdminAmbiguityForSubmit(document.getElementById('pickup'));
      const postAmbiguityPickup = value('pickup');
      const postAmbiguityDestination = value('destination');
      if (postAmbiguityPickup !== pickup || postAmbiguityDestination !== destination) {
        pickup = postAmbiguityPickup;
        destination = postAmbiguityDestination;
        const postAmbiguityNoDoorLocation = noDoorBoundLocation();
        let postAmbiguityValid = Boolean(pickup && pickup !== LOCATION_MARKER && (!(isLocationStateDisplayText(pickup) || attachedLocation?.noDoor === true) || postAmbiguityNoDoorLocation));
        if (postAmbiguityValid && !postAmbiguityNoDoorLocation && !(await verifyAddressField('pickup', { showError: true, policy: 'manual-authoritative' }))) postAmbiguityValid = false;
        if (postAmbiguityValid && destination && !(await verifyAddressField('destination', { showError: true, policy: 'manual-authoritative' }))) postAmbiguityValid = false;
        if (!postAmbiguityValid) {
          focusFirstValidationError();
          return;
        }
        pickupAdminAmbiguity = postAmbiguityNoDoorLocation
          ? null
          : await pickupAdminAmbiguityForSubmit(document.getElementById('pickup'));
      }
      const adminWarningLabel = mode === 'driver' ? '代駕行政區' : '上車行政區';
      const adminWarningValue = pickupAdminAmbiguity
        ? `尚未確認（可能為${adminAreaText(pickupAdminAmbiguity.options, 'line')}）`
        : '';
      // GC_R10Z14F14_DRIVER_REVIEW_NORMALIZATION
      // Call and driver share the same review/send address copy. The raw form value is preserved
      // for navigation, duplicate signatures and recent-address behavior; only the confirmation
      // and LINE message use this normalized display copy.
      const noDoorLocation = noDoorBoundLocation();
      const reviewedPickup = noDoorLocation
        ? (String(pickup || '').trim() || LOCATION_PIN_ONLY_LABEL)
        : normalizePickupAddressForReview(pickup);
      const reviewedPickupLabel = noDoorLocation
        ? (mode === 'driver' ? '代駕位置' : '上車位置')
        : cfg['訊息欄位_上車'];
      // M2R11: a precise GPS no-door state is not a human address. Keep the state text out of
      // confirmation/dispatch and present the useful coordinate directly. Driver mode uses its
      // own semantic label; raw GPS state, map pin and send validation remain unchanged.
      const noDoorCoordinateLabel = mode === 'driver' ? '代駕座標' : '上車座標';
      // GC_R10Z14F18_DRIVER_DESTINATION_DISPLAY_NORMALIZATION
      // Call drop-off and driver delivery are both descriptive reference destinations. Use the
      // same non-blocking Taiwan display formatter; failures fall back to the original value.
      const reviewedDestination = normalizeCallDestinationForDisplay(destination);
      // GC_R10Z14F7_CONFIRM_REVIEWED_ADMIN_RECHECK
      // The form-page hint still evaluates the passenger's visible raw input. The confirmation
      // hint must re-evaluate the normalized copy that the passenger is about to approve and send.
      const pickupAdminReminderSource = reviewedPickup;
      const pickupAdminSoftReminder = !noDoorLocation && !pickupAdminAmbiguity && isDoorAddressMissingReminderAdmin(pickupAdminReminderSource)
        ? 'ⓘ 尚未填寫行政區，建議返回補充'
        : '';
      const destinationAdminSoftReminder = mode === 'call' && reviewedDestination && isDoorAddressMissingReminderAdmin(reviewedDestination)
        ? 'ⓘ 尚未填寫行政區，建議返回補充'
        : '';

      // F23/F25 final safety gate: the visible address must still match the current-location
      // session. Instant service may attach the LINE map pin; all four service variants may carry
      // a text coordinate ONLY for a precise current-location result that has no reliable door.
      const dispatchLocation = serviceType === 'instant' ? dispatchableAttachedLocation() : null;
      const noDoorCoordinate = formatLocationCoordinate(noDoorLocation);
      const noDoorSupplement = noDoorLocation ? currentLocationSupplement() : '';

      const typeText = serviceType === 'reserve' ? cfg['預約選項'] : cfg['即時選項'];
      const lines = [serviceType === 'reserve' ? cfg['訊息標題_預約'] : cfg['訊息標題_即時']];
      if (cfg['訊息分隔線']) lines.push(cfg['訊息分隔線']);
      appendLine(lines, cfg['訊息欄位_用車方式'], typeText);
      if (serviceType === 'reserve') {
        appendLine(lines, cfg['訊息欄位_日期'], value('date'));
        appendLine(lines, cfg['訊息欄位_時間'], value('time'));
      }
      if (noDoorLocation) {
        appendLine(lines, noDoorCoordinateLabel, noDoorCoordinate);
        appendLine(lines, '周邊辨識點', noDoorSupplement);
        if (dispatchLocation) appendLine(lines, '目前定位', '已附上 LINE 地圖定位');
      } else {
        appendLine(lines, reviewedPickupLabel, reviewedPickup);
      }
      if (adminWarningValue) lines.push(`⚠️ ${adminWarningLabel}：${adminWarningValue}`);
      appendLine(lines, cfg['訊息欄位_下車'], reviewedDestination);
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
        locationSupplement: noDoorSupplement,
        location: dispatchLocation
          ? [dispatchLocation.latitude.toFixed(5), dispatchLocation.longitude.toFixed(5)]
          : (noDoorLocation ? [noDoorLocation.latitude.toFixed(6), noDoorLocation.longitude.toFixed(6)] : null)
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
        ...(noDoorLocation
          ? [
              ...(noDoorCoordinate ? [{ label: noDoorCoordinateLabel, value: noDoorCoordinate }] : []),
              ...(noDoorSupplement ? [{ label: '周邊辨識點', value: noDoorSupplement }] : []),
              ...(dispatchLocation ? [{ label: '目前定位', value: '已附上 LINE 地圖定位' }] : [])
            ]
          : [{ label: reviewedPickupLabel, value: reviewedPickup, emphasis: true }]),
        ...(adminWarningValue ? [{ label: `⚠️ ${adminWarningLabel}`, value: adminWarningValue, warning: true }] : []),
        ...(pickupAdminSoftReminder ? [{ label: '', value: pickupAdminSoftReminder, note: true }] : []),
        { label: cfg['訊息欄位_下車'], value: reviewedDestination || (COMMON['選填未填寫'] || '未填寫（選填）'), emphasis: true },
        ...(destinationAdminSoftReminder ? [{ label: '', value: destinationAdminSoftReminder, note: true }] : []),
        ...(mode !== 'driver' && value('passengers') ? [{ label: cfg['訊息欄位_人數'], value: value('passengers') }] : []),
        ...(!noDoorLocation && dispatchLocation ? [{ label: '目前定位', value: '已附上 LINE 地圖定位' }] : [])
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

      const hasReviewedDestination = Boolean(String(reviewedDestination || '').trim());
      const isReservationConfirmation = serviceType === 'reserve';
      const confirmationIntroPrimary = mode === 'driver'
        ? (isReservationConfirmation
          ? (hasReviewedDestination
            ? '請確認日期、時間、代駕地點與送達地點及資料，按下「確認送出」後才會正式送出。'
            : '請確認日期、時間、代駕地點與資料，按下「確認送出」後才會正式送出。')
          : (hasReviewedDestination
            ? '請確認代駕地點、送達地點與資料，按下「確認送出」後才會正式送出。'
            : '請確認代駕地點與資料，按下「確認送出」後才會正式送出。'))
        : (isReservationConfirmation
          ? (hasReviewedDestination
            ? '請確認日期、時間、上車地點與下車地點及資料，按下「確認送出」後才會正式送出。'
            : '請確認日期、時間、上車地點與資料，按下「確認送出」後才會正式送出。')
          : (hasReviewedDestination
            ? '請確認上、下車地點與資料，按下「確認送出」後才會正式送出。'
            : '請確認上車地點與資料，按下「確認送出」後才會正式送出。'));

      openConfirmation(confirmTitle, rows, async () => {
        sending = true;
        setSending(true, cfg);
        try {
          if (isDuplicateSubmission(signature)) throw new Error(duplicateMessage());
          await sendFormMessages(lines.join('\n'), serviceType === 'instant' ? dispatchLocation : null);
          if (!preview) markSubmission(signature);
          const generatedLocationAddress = attachedLocation?.generatedAddress || '';
          rememberRecentAddresses([destination, pickup].filter(address => address && address !== LOCATION_MARKER && address !== generatedLocationAddress));
          renderSuccess(cfg, serviceType === 'reserve');
        } catch (error) {
          sending = false;
          setSending(false, cfg);
          throw error;
        }
      }, {
        purposeTitle: '✓ 送出前最後確認',
        introPrimary: confirmationIntroPrimary
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

    const calculatorInputs = [kmInput, minuteInput];
    let fareNumberBlurToken = 0;
    const clearPreservedEditSpace = () => {
      result.classList.remove('gc-preserve-edit-space');
      result.style.removeProperty('--gc-fare-preserved-height');
    };
    const clearPreservedEditSpaceAfterNativeDismiss = input => {
      const token = ++fareNumberBlurToken;
      const viewport = window.visualViewport;
      const startedAt = performance.now();
      let lastHeight = Number(viewport?.height || window.innerHeight || 0);
      let lastOffsetTop = Number(viewport?.offsetTop || 0);
      let stableFrames = 0;
      let raf = 0;
      let maxTimer = 0;
      let done = false;
      const cleanup = () => {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        clearTimeout(maxTimer);
        maxTimer = 0;
      };
      const finish = () => {
        if (done || token !== fareNumberBlurToken) return;
        done = true;
        cleanup();
        if (calculatorInputs.includes(document.activeElement)) return;
        clearPreservedEditSpace();
      };
      const cancelForRefocus = () => {
        if (done || token !== fareNumberBlurToken) return;
        done = true;
        cleanup();
      };
      const poll = () => {
        if (done || token !== fareNumberBlurToken) return;
        if (document.activeElement === input || calculatorInputs.includes(document.activeElement)) {
          cancelForRefocus();
          return;
        }
        const height = Number(viewport?.height || window.innerHeight || 0);
        const offsetTop = Number(viewport?.offsetTop || 0);
        const viewportStable = Math.abs(height - lastHeight) <= 0.5 && Math.abs(offsetTop - lastOffsetTop) <= 0.5;
        stableFrames = viewportStable ? stableFrames + 1 : 0;
        lastHeight = height;
        lastOffsetTop = offsetTop;
        const elapsed = performance.now() - startedAt;
        if ((elapsed >= 240 && stableFrames >= 3) || elapsed >= 900) { finish(); return; }
        raf = requestAnimationFrame(poll);
      };
      raf = requestAnimationFrame(poll);
      maxTimer = setTimeout(finish, 940);
    };
    const preserveEditSpace = () => {
      if (!calculatorInputs.includes(document.activeElement)) return;
      if (result.classList.contains('gc-preserve-edit-space')) return;
      const height = result.getBoundingClientRect().height;
      if (height > 0) {
        result.style.setProperty('--gc-fare-preserved-height', `${height}px`);
        result.classList.add('gc-preserve-edit-space');
      }
    };

    const reset = (options = {}) => {
      if (options.preserve === true) preserveEditSpace();
      else if (!calculatorInputs.includes(document.activeElement)) clearPreservedEditSpace();
      result.classList.add('is-waiting');
      result.classList.remove('is-invalid', 'is-ready');
      label.textContent = cfg['計算器等待'] || '填完兩格，立即顯示預估車資';
      price.textContent = '';
      basis.textContent = '';
      note1.textContent = '';
      note2.textContent = '';
      longDistance.classList.add('hidden');
    };

    const update = input => mutateRideAddressUiStable(input, () => {
      const kmText = kmInput.value.trim();
      const minuteText = minuteInput.value.trim();
      if (!kmText || !minuteText) {
        reset({ preserve: true });
        return;
      }

      clearPreservedEditSpace();
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
    });

    kmInput.addEventListener('input', () => update(kmInput));
    minuteInput.addEventListener('input', () => update(minuteInput));
    kmInput.addEventListener('change', () => update(kmInput));
    minuteInput.addEventListener('change', () => update(minuteInput));
    calculatorInputs.forEach(input => {
      input.addEventListener('focus', () => {
        // Cancel a pending Done cleanup when the passenger immediately re-enters either number field.
        fareNumberBlurToken += 1;
      });
      input.addEventListener('blur', () => {
        // F22: keep the result area's reserved height until the native virtual-keyboard viewport
        // finishes settling. No body position:fixed, no scrollTo/scrollBy, and no fare-number
        // viewport anchor are involved, so Done and immediate refocus remain native and stable.
        clearPreservedEditSpaceAfterNativeDismiss(input);
      });
    });
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
      if (valid && !(await verifyAddressField('pickup', { showError: true, policy: 'manual-authoritative' }))) valid = false;
      if (valid && !(await verifyAddressField('destination', { showError: true, policy: 'manual-authoritative' }))) valid = false;
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
        if (latestValid && !(await verifyAddressField('pickup', { showError: true, policy: 'manual-authoritative' }))) latestValid = false;
        if (latestValid && !(await verifyAddressField('destination', { showError: true, policy: 'manual-authoritative' }))) latestValid = false;
        if (!latestValid) {
          focusFirstValidationError();
          return;
        }
      }

      // GC_MASTER_STABLE_2026_08R10R_FARE_CHAT_EXPECTATION_COPY
      // Customer-visible LINE message reads as the passenger's request, not an internal command.
      // It encourages assistance while explicitly leaving room for canned trial-estimate information when busy.
      const lines = [cfg['訊息標題'], ''];
      const appendConfiguredLines = text => String(text || '')
        .split(/\\n/)
        .filter(Boolean)
        .forEach(line => lines.push(line));
      appendConfiguredLines(cfg['訊息提醒']);
      appendConfiguredLines(cfg['訊息提醒2']);
      lines.push('');
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
      }, {
        purposeTitle: 'ⓘ 送出前最後確認',
        introPrimary: '請確認估價起點、終點；按下「確認送出估價」後由小編於 LINE 聊天室協助估價，本次不會成立叫車訂單。',
        sendLabel: '確認送出估價'
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
    document.getElementById('gcDatePickerOverlay')?.remove();
    document.getElementById('gcTimePickerOverlay')?.remove();
    window.scrollTo(0, 0);
  }

  function renderSuccess(cfg, reservation = false) {
    resetViewportAfterSubmit();
    pendingConfirmAction = null;
    confirmationBusy = false;

    const useReservation = reservation === true && Boolean(cfg['成功標題_預約']);
    const title = useReservation ? cfg['成功標題_預約'] : cfg['成功標題'];
    app.classList.add('gc-success-mode');
    const lineHtml = successLines(cfg, useReservation).map(line => {
      const text = String(line);
      const parts = text.split(/\\n/);
      if (parts[0] === '取消請主動告知小編') {
        return `<aside class="gc-cancellation-notice" role="note"><strong>${escapeHtml(parts[0])}</strong><span>${parts.slice(1).map(escapeHtml).join('<br>')}</span></aside>`;
      }
      if (text === '本次僅為估價需求，尚未成立即時叫車或預約叫車訂單。') {
        return `<aside class="gc-estimate-notice" role="note"><strong>${escapeHtml(text)}</strong></aside>`;
      }
      return `<p>${escapeHtml(text).replace(/\\n/g, '<br>')}</p>`;
    }).join('');
    app.innerHTML = `
      <main class="gc-success-screen">
        <section class="success-card">
          <div class="success-icon">✓</div>
          <h1>${escapeHtml(title)}</h1>
          <div class="success-lines">
            ${lineHtml}
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
