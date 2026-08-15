(() => {
  'use strict';
  const MASTER_MARKER = 'GC_MASTER_STABLE_2026_08_FARE_FLOW_MODULE';
  // GC_MASTER_STABLE_2026_08R3_FARE_CONTINUITY
  // GC_MASTER_STABLE_2026_08R5_OPTIONAL_CONTEXT_GUIDANCE
  // GC_MASTER_STABLE_2026_08R6_FIELD_VALIDATION_VISUAL
  // GC_MASTER_STABLE_2026_08R8_QUICK_SELF_FARE
  // GC_MASTER_STABLE_2026_08R10J_FARE_PRIMARY_FLOW
  // GC_MASTER_STABLE_2026_08R10Q_FARE_ADDRESS_CONFIDENCE
  // GC_MASTER_STABLE_2026_08R10Y_TYPED_ADDRESS_ROUTE_RESOLUTION
  // GC_MASTER_STABLE_2026_08R10Z1_ADDRESS_ROOT_FIX
  // GC_MASTER_STABLE_2026_08R10Z3_ADDRESS_HANDOFF_SANITIZER
  // GC_MASTER_STABLE_2026_08R10Z9Z_FARE_ADMIN_GUIDANCE_HANDOFF
  // GC_ADDRESS_CONTRACT_TW_GROUND_V1
  // Manual full addresses may resolve directly; Google Maps still receives hidden canonical route data.
  // GC_MASTER_STABLE_2026_08R10U_STRICT_MAP_ADDRESS_HANDOFF
  // GC_MASTER_STABLE_2026_08R10T_FARE_TO_CALL_HANDOFF_FIX
  // GC_FARE_FLOW_SNAPSHOT_20M / GC_FARE_MANUAL_SCROLL_GUARD
  const LEGACY_DRAFT_KEY = 'gc_fare_draft_v1';
  const LEGACY_HANDOFF_KEY = 'gc_fare_to_call_v1';
  const HANDOFF_KEY = 'gc_fare_to_call_v2';
  const SNAPSHOT_PREFIX = 'gc_fare_flow_v2_';
  const FLOW_STATE_KEY = 'gcFareFlowId';
  const FLOW_RETURN_KEY = 'gcFareReturnFromCall';
  const TTL_MS = 20 * 60 * 1000;

  const cfg = () => (window.GC_FORM_CONFIG && window.GC_FORM_CONFIG.fare) || {};
  const qs = id => document.getElementById(id);
  const trim = value => String(value || '').trim();
  const safeSessionGet = key => {
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.createdAt || Date.now() - parsed.createdAt > TTL_MS) {
        sessionStorage.removeItem(key);
        return null;
      }
      return parsed;
    } catch (_) { return null; }
  };
  const safeSessionSet = (key, value) => { try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  const safeSessionRemove = key => { try { sessionStorage.removeItem(key); } catch (_) {} };
  const safeLocalGet = key => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.createdAt || Date.now() - parsed.createdAt > TTL_MS) {
        localStorage.removeItem(key);
        return null;
      }
      return parsed;
    } catch (_) { return null; }
  };
  const safeLocalSet = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  const safeLocalRemove = key => { try { localStorage.removeItem(key); } catch (_) {} };
  const clearLegacyFareStorage = () => {
    try { localStorage.removeItem(LEGACY_DRAFT_KEY); localStorage.removeItem(LEGACY_HANDOFF_KEY); } catch (_) {}
  };
  const newFlowId = () => `f${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
  function currentFareFlow(create = false) {
    const state = history.state && typeof history.state === 'object' ? history.state : {};
    let id = trim(state[FLOW_STATE_KEY]);
    if (!id && create) {
      id = newFlowId();
      history.replaceState({ ...state, [FLOW_STATE_KEY]: id, [FLOW_RETURN_KEY]: false }, '', location.href);
    }
    return id;
  }
  const snapshotKey = flowId => SNAPSHOT_PREFIX + flowId;
  function markFareContinuity() {
    const state = history.state && typeof history.state === 'object' ? history.state : {};
    const flowId = currentFareFlow(true);
    if (state[FLOW_RETURN_KEY] === true && trim(state[FLOW_STATE_KEY]) === flowId) return flowId;
    history.replaceState({ ...state, [FLOW_STATE_KEY]: flowId, [FLOW_RETURN_KEY]: true }, '', location.href);
    return flowId;
  }
  const escapeHtml = text => String(text ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));


  // GC_R10K_MAP_ADDRESS_GUARD: sanitize map addresses exactly like dispatch and compare canonical forms before opening Google Maps.
  function cleanMapAddress(value) {
    const raw = trim(value);
    if (!raw) return '';
    try {
      if (typeof window.GC_cleanAddressForExternalUse === 'function') return trim(window.GC_cleanAddressForExternalUse(raw));
    } catch (_) {}
    return raw.replace(/臺/g, '台').replace(/[，,、\s]+/g, '');
  }

  function addressComparisonKey(value) {
    return cleanMapAddress(value)
      .replace(/[\s,，、。．·・\-—_()（）]/g, '')
      .toLocaleLowerCase();
  }

  function currentMode() {
    return new URLSearchParams(location.search).get('mode') || '';
  }

  function setFieldError(id, message) {
    const input = qs(id);
    const error = qs(id + 'Error');
    const active = Boolean(message);
    if (input) {
      input.classList.toggle('invalid', active);
      if (active) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
      input.closest('.field')?.classList.toggle('gc-validation-error', active);
    }
    if (error) {
      error.textContent = message || '';
      error.classList.toggle('show', active);
      if (active) error.setAttribute('role', 'alert');
      else error.removeAttribute('role');
    }
  }

  function saveDraft() {
    const flowId = markFareContinuity();
    const pickup = cleanMapAddress(qs('pickup')?.value);
    const destination = cleanMapAddress(qs('destination')?.value);
    const km = trim(qs('fareKm')?.value);
    const minutes = trim(qs('fareMinutes')?.value);
    if (!pickup && !destination && !km && !minutes) { safeSessionRemove(snapshotKey(flowId)); return; }
    safeSessionSet(snapshotKey(flowId), { pickup, destination, km, minutes, createdAt: Date.now() });
  }

  function hideLocalSuggestionBox(id) {
    const box = qs(id + 'Suggest');
    if (!box) return;
    box.innerHTML = '';
    box.classList.add('hidden');
  }

  function setAddressValueSilently(input, value) {
    const cleaned = trim(value);
    if (!input || !cleaned) return false;
    input.value = cleaned;
    // app-v5719.js 的智慧地址監聽器會讀這個一次性旗標；
    // 程式帶入/草稿恢復不是新的使用者輸入，不應再次彈出候選清單。
    input.dataset.gcSkipSuggestOnce = '1';
    hideLocalSuggestionBox(input.id);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    hideLocalSuggestionBox(input.id);
    return true;
  }

  // GC_MASTER_STABLE_2026_08R10Z14F16_FARE_VIEWPORT_STABILITY
  // Reuse the core input anchor around fare-only guidance/action mutations. When no eligible
  // input is focused (or in the short keyboard-dismiss grace), this is a no-op.
  function mutateFareViewportStable(input, mutator) {
    const helper = window.GC_mutateInputViewportStable;
    return typeof helper === 'function' ? helper(input, mutator) : mutator();
  }
  function fareEditingInput(preferred = null) {
    const active = document.activeElement;
    if (active && ['pickup', 'destination', 'fareKm', 'fareMinutes'].includes(active.id)) return active;
    return preferred;
  }
  function iphoneLineKeyboardTarget(input) {
    try { return window.GC_isIphoneLineKeyboardTarget?.(input) === true; }
    catch (_) { return false; }
  }
  function iphoneLineFareKeyboardEnvironment() {
    return iphoneLineKeyboardTarget(qs('pickup')) || iphoneLineKeyboardTarget(qs('destination'));
  }

  let fareAdminGuidanceToken = 0;
  let fareAdminGuidanceTimer = 0;
  let fareKeyboardFocusRevision = 0;
  let deferredFareAdminGuidance = null;
  function fareAdminTargetLabel(id) {
    return id === 'destination' ? '下車' : '上車';
  }

  function fareAdminAreaText(options) {
    return (Array.isArray(options) ? options : []).map(option => option?.label).filter(Boolean).join('／');
  }

  function renderFareAdminGuidance(results = []) {
    const slot = qs('gcFareAdminGuidance');
    if (!slot) return;
    if (iphoneLineFareKeyboardEnvironment()) {
      const activeTarget = fareEditingInput();
      // Guidance is positioned above the number controls. Never insert or resize it while a
      // number keyboard is open; keep the provider result non-visible instead of moving the field.
      if (activeTarget && (activeTarget.id === 'fareKm' || activeTarget.id === 'fareMinutes')) return;
    }
    const preferred = results.map(result => qs(result?.targetId)).find(Boolean) || null;
    return mutateFareViewportStable(fareEditingInput(preferred), () => {
      const active = results.filter(result => result && result.state !== 'none');
      if (!active.length) {
        slot.className = 'gc-fare-admin-guidance hidden';
        slot.dataset.state = 'none';
        slot.innerHTML = '';
        return;
      }

      const strong = active.filter(result => result.state === 'strong' && result.options?.length >= 2);
      slot.className = 'gc-fare-admin-guidance';
      slot.dataset.state = strong.length ? 'strong' : 'soft';
      if (!strong.length) {
        slot.innerHTML = `<strong>⚠️ 先確認行政區，試算才準確</strong>
          <p>Google 可能自動選到同名路段，請確認地圖顯示的上、下車地點。</p>`;
        return;
      }

      slot.innerHTML = `<strong>⚠️ 找到同名地址，請確認行政區</strong>
        <div class="gc-fare-admin-items">
          ${strong.map(result => {
            const input = qs(result.targetId);
            const visible = trim(input?.value);
            const areas = fareAdminAreaText(result.options);
            return `<section class="gc-fare-admin-item" data-target="${escapeHtml(result.targetId)}">
              <p>${escapeHtml(fareAdminTargetLabel(result.targetId))}「${escapeHtml(visible)}」可能位於${escapeHtml(areas)}</p>
              <div class="gc-fare-admin-options" role="group" aria-label="選擇${escapeHtml(fareAdminTargetLabel(result.targetId))}行政區">
                ${result.options.map((option, index) => `<button type="button" data-target="${escapeHtml(result.targetId)}" data-admin-option="${index}">${escapeHtml(option.label)}</button>`).join('')}
              </div>
            </section>`;
          }).join('')}
        </div>`;
    });
  }

  function refreshFareAdminGuidance(originInput = null, recoveredLayoutCommit = false) {
    clearTimeout(fareAdminGuidanceTimer);
    const inputs = [qs('pickup'), qs('destination')].filter(Boolean);
    const needsAdmin = typeof window.GC_addressNeedsAdmin === 'function'
      ? input => window.GC_addressNeedsAdmin(input.value)
      : () => false;
    const token = ++fareAdminGuidanceToken;
    const r3KeyboardEnvironment = iphoneLineFareKeyboardEnvironment();
    const focusRevision = fareKeyboardFocusRevision;
    const originWasActive = Boolean(r3KeyboardEnvironment && originInput && document.activeElement === originInput && originInput._gcFareKeyboardEditing === true);
    if (r3KeyboardEnvironment && deferredFareAdminGuidance) {
      const cached = deferredFareAdminGuidance;
      const cacheStillCurrent = cached.results.every(result => trim(qs(result.targetId)?.value) === result.query);
      if (!cacheStillCurrent) deferredFareAdminGuidance = null;
      else if ((recoveredLayoutCommit || !originInput) && !fareEditingInput()) {
        deferredFareAdminGuidance = null;
        renderFareAdminGuidance(cached.results);
        return Promise.resolve(cached.results);
      }
    }
    const pending = inputs.filter(needsAdmin).map(input => ({
      state: 'soft', targetId: input.id, query: trim(input.value), options: []
    }));
    if (!r3KeyboardEnvironment || !originInput || originWasActive || recoveredLayoutCommit) renderFareAdminGuidance(pending);
    if (!pending.length || typeof window.GC_getAddressAdminGuidance !== 'function') return Promise.resolve(pending);

    return Promise.all(pending.map(async initial => {
      try {
        const result = await window.GC_getAddressAdminGuidance(initial.query);
        return { ...result, targetId: initial.targetId };
      } catch (_) {
        return initial;
      }
    })).then(results => {
      if (token !== fareAdminGuidanceToken) return results;
      const stillCurrent = results.every(result => trim(qs(result.targetId)?.value) === result.query);
      if (!stillCurrent) return results;
      if (r3KeyboardEnvironment) {
        const active = fareEditingInput();
        const originStillActive = !originInput || (originWasActive && document.activeElement === originInput && originInput._gcFareKeyboardEditing === true);
        if (!originStillActive || fareKeyboardFocusRevision !== focusRevision || (active && active !== originInput)) {
          // Preserve the provider's strong evidence without changing visible height during/after
          // a keyboard transaction. A recovered address commit or later explicit closed action
          // replays it once, provided both address queries are still identical.
          deferredFareAdminGuidance = { results };
          return results;
        }
      }
      renderFareAdminGuidance(results);
      return results;
    });
  }

  function queueFareAdminGuidance(delay = 380, originInput = null) {
    clearTimeout(fareAdminGuidanceTimer);
    const inputs = [qs('pickup'), qs('destination')].filter(Boolean);
    const needsAdmin = typeof window.GC_addressNeedsAdmin === 'function'
      ? input => window.GC_addressNeedsAdmin(input.value)
      : () => false;
    renderFareAdminGuidance(inputs.filter(needsAdmin).map(input => ({
      state: 'soft', targetId: input.id, query: trim(input.value), options: []
    })));
    fareAdminGuidanceTimer = setTimeout(() => refreshFareAdminGuidance(originInput), Math.max(0, delay));
  }

  function restoreDraft() {
    const state = history.state && typeof history.state === 'object' ? history.state : {};
    const flowId = trim(state[FLOW_STATE_KEY]);
    // 同一個車資流程內（含看 Google 地圖、轉叫車後返回）可恢復 20 分鐘。
    // 從 LINE 選單重新進入車資試算會建立新 flow，不讀舊快照，因此保持空白。
    if (!flowId || state[FLOW_RETURN_KEY] !== true) return false;
    const draft = safeSessionGet(snapshotKey(flowId));
    if (!draft) return false;
    [['pickup', draft.pickup], ['destination', draft.destination], ['fareKm', draft.km], ['fareMinutes', draft.minutes]].forEach(([id, value]) => {
      const input = qs(id);
      if (!input || trim(input.value) || !trim(value)) return;
      if (id === 'pickup' || id === 'destination') setAddressValueSilently(input, value);
      else {
        input.value = value;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    // GC_R10Z2_FARE_RETURN_SCROLL_STABLE:
    // When the passenger returns from the call page, let the LINE/iOS WebView restore
    // its own history scroll position. Do NOT auto-center the fare result here; that
    // second programmatic scroll was racing the browser's native restoration and caused
    // the visible one-frame/two-frame jump reported on iPhone.
    return true;
  }

  function mapAddressFromInput(input) {
    if (!input) return '';
    const visible = cleanMapAddress(input.value);
    const resolved = cleanMapAddress(input.dataset?.gcResolvedAddress || '');
    if (input.dataset?.gcAddressVerified === '1' && resolved) return resolved;
    return visible;
  }

  function googleMapsUrl(pickupValue = '', destinationValue = '') {
    const pickup = trim(pickupValue || qs('pickup')?.value);
    const destination = trim(destinationValue || qs('destination')?.value);
    if (!pickup || !destination) return '';

    const base = trim(cfg()['Google地圖路線網址']) || 'https://www.google.com/maps/dir/?api=1';
    let url;
    try { url = new URL(base); }
    catch (_) { url = new URL('https://www.google.com/maps/dir/?api=1'); }
    url.searchParams.set('api', '1');
    url.searchParams.set('travelmode', 'driving');
    url.searchParams.set('origin', pickup);
    url.searchParams.set('destination', destination);
    return url.toString();
  }

  function clearRouteAddressGuidance() {
    // R6：不再顯示大面積提示框；缺哪一格就直接在該欄位紅框提示。
    const note = qs('gcFareActionNote');
    if (note) note.remove();
  }

  function showRouteAddressGuidance(kind, missingPickup, missingDestination) {
    const message = cfg()['錯誤_情境缺資料'] || '請填寫資料。';
    setFieldError('pickup', missingPickup ? message : '');
    setFieldError('destination', missingDestination ? message : '');
    if (!missingPickup && !missingDestination) return;
    const firstMissing = missingPickup ? qs('pickup') : qs('destination');
    requestAnimationFrame(() => {
      firstMissing?.closest('.field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        try { firstMissing?.focus({ preventScroll: true }); }
        catch (_) { try { firstMissing?.focus(); } catch (_) {} }
        setFieldError('pickup', missingPickup ? message : '');
        setFieldError('destination', missingDestination ? message : '');
      }, 280);
    });
  }

  async function openMaps() {
    const pickupInput = qs('pickup');
    const destinationInput = qs('destination');
    const pickup = trim(pickupInput?.value);
    const destination = trim(destinationInput?.value);
    // Opening Google Maps must not visibly replace what the passenger typed. The stricter
    // canonical result is carried separately and is used only for map routing.

    const missingPickup = !pickup;
    const missingDestination = !destination;
    // 地址在自助試算不是強制欄位；只有按「開啟 Google 地圖」時才需要。
    if (missingPickup || missingDestination) {
      showRouteAddressGuidance('map', missingPickup, missingDestination);
      return;
    }
    // Advisory only: update the shared card, but never wait for or block route opening.
    refreshFareAdminGuidance();

    const verify = typeof window.GC_verifyAddressField === 'function' ? window.GC_verifyAddressField : null;
    if (verify) {
      const pickupReady = await verify('pickup', { showError: true, policy: 'manual-authoritative' });
      const destinationReady = pickupReady ? await verify('destination', { showError: true, policy: 'manual-authoritative' }) : false;
      if (!pickupReady || !destinationReady) return;
    }

    // R10Z9L: Google Maps receives exactly the passenger-visible, non-empty text.
    // Smart-resolution metadata remains advisory and must never block or redirect the route.
    const verifiedPickup = pickup;
    const verifiedDestination = destination;
    const sameAddress = addressComparisonKey(verifiedPickup) && addressComparisonKey(verifiedPickup) === addressComparisonKey(verifiedDestination);
    if (sameAddress) {
      setFieldError('pickup', '');
      setFieldError('destination', cfg()['錯誤_相同地址'] || '上下車地址不能相同，請確認目的地。');
      clearRouteAddressGuidance();
      requestAnimationFrame(() => {
        destinationInput?.closest('.field')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          try { destinationInput?.focus({ preventScroll: true }); }
          catch (_) { try { destinationInput?.focus(); } catch (_) {} }
          setFieldError('destination', cfg()['錯誤_相同地址'] || '上下車地址不能相同，請確認目的地。');
        }, 220);
      });
      return;
    }

    setFieldError('pickup', '');
    setFieldError('destination', '');
    clearRouteAddressGuidance();
    const url = googleMapsUrl(verifiedPickup, verifiedDestination);
    if (!url) return;
    // GC_R10J_FARE_DO_NOT_WRITE_RECENTS: 車資試算查看 Google 路線不寫入最近使用地址。
    saveDraft();
    try {
      if (window.liff && typeof window.liff.isInClient === 'function' && window.liff.isInClient() && typeof window.liff.openWindow === 'function') {
        window.liff.openWindow({ url, external: true });
        return;
      }
    } catch (_) {}
    const opened = window.open(url, '_blank', 'noopener,noreferrer');
    if (!opened) location.href = url;
  }

  function refreshFareAction() {
    const result = qs('fareCalcResult');
    const action = qs('gcFareCallAction');
    const mapsAgain = qs('gcFareMapsAgain');
    if (!result || !action || !mapsAgain) return;
    const ready = result.classList.contains('is-ready');
    action.classList.toggle('hidden', !ready);
    mapsAgain.classList.toggle('hidden', !ready);
  }

  function toCall() {
    const pickupInput = qs('pickup');
    const destinationInput = qs('destination');
    const pickup = trim(pickupInput?.value);
    const destination = trim(destinationInput?.value);
    setFieldError('pickup', '');
    setFieldError('destination', '');
    saveDraft();
    const state = history.state && typeof history.state === 'object' ? history.state : {};
    const flowId = currentFareFlow(true);
    history.replaceState({ ...state, [FLOW_STATE_KEY]: flowId, [FLOW_RETURN_KEY]: true }, '', location.href);
    const handoff = {
      pickup,
      destination,
      pickupVerified: pickupInput?.dataset.gcAddressVerified === '1',
      destinationVerified: destinationInput?.dataset.gcAddressVerified === '1',
      flowId,
      createdAt: Date.now()
    };
    safeSessionSet(HANDOFF_KEY, handoff);
    safeLocalSet(HANDOFF_KEY, handoff);
    const url = new URL(location.href);
    url.searchParams.set('mode', 'call');
    url.searchParams.delete('_r');
    location.assign(url.toString());
  }

  function enhanceFare() {
    if (document.documentElement.dataset.gcFareMasterReady === '1') return true;
    const fareCard = document.querySelector('.gc-fare-card');
    const calc = document.querySelector('.gc-fare-calc');
    const form = qs('serviceForm');
    const pickup = qs('pickup');
    const destination = qs('destination');
    if (!fareCard || !calc || !form || !pickup || !destination) return false;
    document.documentElement.dataset.gcFareMasterReady = '1';

    const pickupField = pickup.closest('.field');
    const destinationField = destination.closest('.field');
    const routeStep = document.createElement('section');
    routeStep.className = 'gc-fare-route-step';
    routeStep.id = 'gcFareRouteStep';
    routeStep.innerHTML = `
      <div class="gc-fare-step-kicker">
        <strong>${escapeHtml(cfg()['路線步驟標題'] || '查 Google 路線')}</strong>
        <span>${escapeHtml(cfg()['路線步驟說明'] || '先看路線時間與公里')}</span>
      </div>
      <div class="gc-fare-route-fields" id="gcFareRouteFields"></div>
      <div class="gc-fare-route-inline" aria-label="路線選擇提示">
        <span><b>${escapeHtml(cfg()['乘車偏好_省標題'] || '省車資')}</b> → ${escapeHtml(cfg()['路線重點說明1'] || '看公里數較少')}</span>
        <i aria-hidden="true">｜</i>
        <span><b>${escapeHtml(cfg()['乘車偏好_快標題'] || '趕時間')}</b> → ${escapeHtml(cfg()['路線快速_快內容'] || '看時間較短')}</span>
      </div>
      <div class="gc-fare-admin-guidance hidden" id="gcFareAdminGuidance" data-state="none" aria-live="polite"></div>
      <button class="gc-fare-map-btn" id="gcFareMapBtn" type="button">${escapeHtml(cfg()['路線按鈕'] || '開啟 Google 地圖')}</button>`;
    calc.parentNode.insertBefore(routeStep, calc);
    const routeFields = qs('gcFareRouteFields');
    if (pickupField) routeFields.appendChild(pickupField);
    if (destinationField) routeFields.appendChild(destinationField);

    // 車資自助試算可直接填「分鐘＋公里」，不強迫先輸入地址。
    // 只有按 Google 地圖或估價協助時才需要地址；這裡只改 fare 模式，叫車/代駕欄位規則不動。
    [
      [pickup, cfg()['自助上車標題'] || '上車地點'],
      [destination, cfg()['自助下車標題'] || '下車地點']
    ].forEach(([input, labelText]) => {
      input.required = false;
      const label = input.closest('.field')?.querySelector(`label[for="${input.id}"]`);
      if (label) label.textContent = labelText;
    });

    const manual = document.querySelector('.gc-fare-manual');
    const manualHead = manual?.querySelector('.gc-fare-manual-head');
    if (manual && manualHead) {
      const details = document.createElement('details');
      details.className = 'gc-fare-manual-details';
      const summary = document.createElement('summary');
      const manualTitle = String(cfg()['人工協助標題'] || 'ⓘ 其他估價協助').replace(/^ⓘ\s*/, '');
      summary.innerHTML = `<strong class="gc-fare-manual-label"><span aria-hidden="true">ⓘ</span>${escapeHtml(manualTitle)}</strong>`;
      const inner = document.createElement('div');
      inner.className = 'gc-fare-manual-inner';
      // GC_MASTER_STABLE_2026_08R10Z9Y_FARE_HELP_DEDUPLICATED
      // The closed summary already names this section. Only render an additional
      // expanded heading when copy explicitly supplies one, avoiding three repeated
      // variants of「估價協助」before the actionable explanation.
      const panelTitleText = String(cfg()['人工協助展開標題'] ?? '').trim();
      const panelTitle = panelTitleText ? document.createElement('strong') : null;
      if (panelTitle) {
        panelTitle.className = 'gc-manual-panel-title';
        panelTitle.textContent = panelTitleText;
      }
      const warning = document.createElement('div');
      warning.className = 'gc-fare-manual-warning';
      const warningTitle = cfg()['人工協助警示標題'] || '已嘗試試算仍無法完成？';
      const warningBusy = cfg()['人工協助警示說明'] || '可直接送出估價需求，由小編協助估算。';
      const warningAssist = cfg()['人工協助補充'] || '送出後由小編於 LINE 聊天室協助估價。';
      warning.innerHTML = `<strong>${escapeHtml(warningTitle)}</strong><p>${escapeHtml(warningBusy)}</p><small>${escapeHtml(warningAssist)}</small>`;
      const extra = document.createElement('div');
      extra.className = 'gc-fare-manual-extra hidden';
      extra.innerHTML = '';
      manualHead.remove();
      manual.parentNode.insertBefore(details, manual);
      details.appendChild(summary);
      details.appendChild(inner);
      if (panelTitle) inner.appendChild(panelTitle);
      inner.appendChild(warning);
      inner.appendChild(extra);
      inner.appendChild(form);
      manual.remove();
      window.GC_installManagedDisclosureBehavior?.();

      // 估價協助按鈕在頁面底部；地址在上方。缺地址時不能像「沒反應」，
      // 必須直接把畫面帶到第一個缺少的地址並顯示原本錯誤提示。
      form.addEventListener('submit', event => {
        const missingPickup = !trim(pickup.value);
        const missingDestination = !trim(destination.value);
        if (!missingPickup && !missingDestination) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        details.open = true;
        // 自助試算時地址不是強制欄位；估價協助這個動作需要上下車地址。
        // 缺哪一格就直接紅框＋短提示，並帶到第一個缺少欄位。
        showRouteAddressGuidance('manual', missingPickup, missingDestination);
      }, true);
    }

    const result = qs('fareCalcResult');
    if (result) {
      const reminder = document.createElement('section');
      reminder.className = 'gc-fare-ride-reminder';
      reminder.id = 'gcFareRideReminder';
      reminder.innerHTML = `
        <strong>${escapeHtml(cfg()['乘車提醒標題'] || '路線有偏好？上車告知司機即可')}</strong>
        <div class="gc-fare-preference-list">
          <div class="gc-fare-preference-row"><b>${escapeHtml(cfg()['乘車偏好_省標題'] || '省車資')}</b><i aria-hidden="true">→</i><span>${escapeHtml(cfg()['乘車偏好_省內容'] || '較短距離')}</span></div>
          <div class="gc-fare-preference-row"><b>${escapeHtml(cfg()['乘車偏好_快標題'] || '趕時間')}</b><i aria-hidden="true">→</i><span>${escapeHtml(cfg()['乘車偏好_快內容'] || '較快路線')}</span></div>
        </div>
        <p class="gc-fare-preference-note">${escapeHtml(cfg()['乘車偏好_補充'] || '較快路線若里程較長，車資可能增加。')}</p>`;
      result.appendChild(reminder);

      const actionWrap = document.createElement('div');
      actionWrap.className = 'gc-fare-result-actions hidden';
      actionWrap.id = 'gcFareCallAction';
      actionWrap.innerHTML = `<button type="button" class="gc-fare-call-btn" id="gcFareCallBtn">${escapeHtml(cfg()['叫車按鈕'] || '價格可以・立即叫車')}</button>`;
      result.appendChild(actionWrap);

      const mapsAgain = document.createElement('button');
      mapsAgain.type = 'button';
      mapsAgain.className = 'gc-fare-maps-again hidden';
      mapsAgain.id = 'gcFareMapsAgain';
      mapsAgain.textContent = cfg()['重新查看路線按鈕'] || '重新查看 Google 地圖路線';
      result.appendChild(mapsAgain);
    }

    qs('gcFareMapBtn')?.addEventListener('click', openMaps);
    qs('gcFareMapsAgain')?.addEventListener('click', openMaps);
    qs('gcFareCallBtn')?.addEventListener('click', toCall);
    qs('gcFareAdminGuidance')?.addEventListener('click', event => {
      const button = event.target.closest('button[data-target][data-admin-option]');
      if (!button || typeof window.GC_getAddressAdminGuidance !== 'function' || typeof window.GC_applyAddressAdminOption !== 'function') return;
      const targetId = button.dataset.target;
      const input = qs(targetId);
      const visible = trim(input?.value);
      window.GC_getAddressAdminGuidance(visible).then(evidence => {
        if (trim(input?.value) !== visible || evidence.state !== 'strong') return;
        if (window.GC_applyAddressAdminOption(input, evidence, button.dataset.adminOption, 'fare-admin-choice')) {
          setFieldError(targetId, '');
          saveDraft();
          refreshFareAdminGuidance();
        }
      }).catch(() => {});
    });
    [pickup, destination, qs('fareKm'), qs('fareMinutes')].filter(Boolean).forEach(input => {
      input.addEventListener('focus', () => {
        if (!iphoneLineKeyboardTarget(input)) return;
        fareKeyboardFocusRevision += 1;
        input._gcFareKeyboardEditing = true;
      }, { passive: true });
      input.addEventListener('blur', () => {
        if (iphoneLineKeyboardTarget(input)) input._gcFareKeyboardEditing = false;
      }, { passive: true });
      input.addEventListener('input', () => {
        saveDraft();
        mutateFareViewportStable(input, () => {
          if (input === pickup && trim(pickup.value)) setFieldError('pickup', '');
          if (input === destination && trim(destination.value)) setFieldError('destination', '');
          if (input === pickup || input === destination) {
            if (iphoneLineKeyboardTarget(input)) queueFareAdminGuidance(380, input);
            else queueFareAdminGuidance();
          }
        });
      });
      input.addEventListener('change', () => {
        saveDraft();
        if (input === pickup || input === destination) {
          if (iphoneLineKeyboardTarget(input) && typeof window.GC_runAfterRideKeyboardDismissSettles === 'function') {
            window.GC_runAfterRideKeyboardDismissSettles(input, () => refreshFareAdminGuidance(input, true));
          } else {
            mutateFareViewportStable(input, refreshFareAdminGuidance);
          }
        }
      });
    });
    ['fareKm', 'fareMinutes'].forEach(id => {
      const input = qs(id);
      input?.addEventListener('input', () => {
        if (iphoneLineKeyboardTarget(input)) mutateFareViewportStable(input, refreshFareAction);
        else setTimeout(() => mutateFareViewportStable(input, refreshFareAction), 0);
      });
      input?.addEventListener('change', () => {
        if (iphoneLineKeyboardTarget(input)) mutateFareViewportStable(input, refreshFareAction);
        else setTimeout(() => mutateFareViewportStable(input, refreshFareAction), 0);
      });
    });
    clearLegacyFareStorage();
    currentFareFlow(true);
    restoreDraft();
    refreshFareAdminGuidance();
    refreshFareAction();
    return true;
  }

  function consumeCallHandoff() {
    if (document.documentElement.dataset.gcFareHandoffDone === '1') return true;
    const pickup = qs('pickup');
    const destination = qs('destination');
    if (!pickup || !destination || !document.querySelector('#serviceForm')) return false;
    const handoff = safeSessionGet(HANDOFF_KEY) || safeLocalGet(HANDOFF_KEY);
    document.documentElement.dataset.gcFareHandoffDone = '1';
    if (!handoff) {
      safeSessionRemove(HANDOFF_KEY);
      safeLocalRemove(HANDOFF_KEY);
      return true;
    }
    const hasPickupHandoff = !trim(pickup.value) && Boolean(trim(handoff.pickup));
    // The passenger explicitly accepted this route on the fare page.  Mark the
    // pickup step as committed before its input events fire so the progressive
    // call flow reveals the carried destination immediately.  Verification is
    // still preserved independently below; an unresolved admin-area reminder
    // therefore remains advisory and is never bypassed.
    if (hasPickupHandoff) pickup.dataset.gcFlowCommitted = '1';
    const pickupApplied = hasPickupHandoff ? setAddressValueSilently(pickup, handoff.pickup) : false;
    const destinationApplied = !trim(destination.value) && trim(handoff.destination) ? setAddressValueSilently(destination, handoff.destination) : false;
    if (pickupApplied && handoff.pickupVerified && typeof window.GC_markAddressVerified === 'function') window.GC_markAddressVerified('pickup', 'fare-handoff');
    if (destinationApplied && handoff.destinationVerified && typeof window.GC_markAddressVerified === 'function') window.GC_markAddressVerified('destination', 'fare-handoff');
    // GC_MASTER_STABLE_2026_08R10Z9C_FARE_HANDOFF_INSTANT_INTENT
    // This is not a fresh Rich Menu visit: the passenger explicitly pressed "立即叫車" on the fare result.
    // Preserve that intent while fresh call/driver entry remains unselected.
    const instant = document.querySelector('input[name="serviceType"][value="instant"]');
    if (instant) {
      instant.checked = true;
      document.documentElement.dataset.gcFareHandoffApplied = '1';
      instant.dispatchEvent(new Event('change', { bubbles: true }));
    }
    safeSessionRemove(HANDOFF_KEY);
    safeLocalRemove(HANDOFF_KEY);
    return true;
  }

  function boot() {
    const mode = currentMode();
    const run = mode === 'fare' ? enhanceFare : mode === 'call' ? consumeCallHandoff : () => true;
    if (run()) return;
    const observer = new MutationObserver(() => { if (run()) observer.disconnect(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 12000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
