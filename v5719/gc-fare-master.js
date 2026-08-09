(() => {
  'use strict';
  const MASTER_MARKER = 'GC_MASTER_STABLE_2026_08_FARE_FLOW_MODULE';
  // GC_MASTER_STABLE_2026_08R3_FARE_CONTINUITY
  // GC_MASTER_STABLE_2026_08R5_OPTIONAL_CONTEXT_GUIDANCE
  // GC_MASTER_STABLE_2026_08R6_FIELD_VALIDATION_VISUAL
  // GC_MASTER_STABLE_2026_08R8_QUICK_SELF_FARE
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
    const pickup = trim(qs('pickup')?.value);
    const destination = trim(qs('destination')?.value);
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
    if (!input || !trim(value)) return false;
    input.value = value;
    // app-v5719.js 的智慧地址監聽器會讀這個一次性旗標；
    // 程式帶入/草稿恢復不是新的使用者輸入，不應再次彈出候選清單。
    input.dataset.gcSkipSuggestOnce = '1';
    hideLocalSuggestionBox(input.id);
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    hideLocalSuggestionBox(input.id);
    return true;
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
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const target = qs('fareCalcResult');
      if (target?.classList.contains('is-ready')) target.scrollIntoView({ behavior: 'auto', block: 'center' });
    }));
    return true;
  }

  function googleMapsUrl() {
    const pickup = trim(qs('pickup')?.value);
    const destination = trim(qs('destination')?.value);
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

  function openMaps() {
    const missingPickup = !trim(qs('pickup')?.value);
    const missingDestination = !trim(qs('destination')?.value);
    // 地址在自助試算不是強制欄位；只有按「查看 Google 地圖」這個動作時才需要。
    // R6 直接把缺少欄位紅框並顯示短提示，不再占用大面積提示區。
    if (missingPickup || missingDestination) {
      showRouteAddressGuidance('map', missingPickup, missingDestination);
      return;
    }
    setFieldError('pickup', '');
    setFieldError('destination', '');
    clearRouteAddressGuidance();
    const url = googleMapsUrl();
    if (!url) return;
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
    const pickup = trim(qs('pickup')?.value);
    const destination = trim(qs('destination')?.value);
    // 自助試算只需要分鐘＋公里；地址是「開 Google 地圖」的便利資料，不是進叫車頁的門檻。
    // 有填就安全帶入，沒填就讓既有叫車表格照原規則由客人補填；下車地址仍維持叫車端選填。
    setFieldError('pickup', '');
    setFieldError('destination', '');
    saveDraft();
    const state = history.state && typeof history.state === 'object' ? history.state : {};
    const flowId = currentFareFlow(true);
    history.replaceState({ ...state, [FLOW_STATE_KEY]: flowId, [FLOW_RETURN_KEY]: true }, '', location.href);
    safeSessionSet(HANDOFF_KEY, { pickup, destination, flowId, createdAt: Date.now() });
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
      <div class="gc-fare-route-fields" id="gcFareRouteFields"></div>
      <div class="gc-fare-route-inline" aria-label="路線選擇提示">
        <span><b>${escapeHtml(cfg()['乘車偏好_省標題'] || '省車資')}</b> → ${escapeHtml(cfg()['路線重點說明1'] || '看公里數較少')}</span>
        <i aria-hidden="true">｜</i>
        <span><b>${escapeHtml(cfg()['乘車偏好_快標題'] || '趕時間')}</b> → ${escapeHtml(cfg()['路線快速_快內容'] || '看時間較短')}</span>
      </div>
      <button class="gc-fare-map-btn" id="gcFareMapBtn" type="button">${escapeHtml(cfg()['路線按鈕'] || '開啟 Google 地圖')}</button>`;
    calc.parentNode.insertBefore(routeStep, calc);
    const routeFields = qs('gcFareRouteFields');
    if (pickupField) routeFields.appendChild(pickupField);
    if (destinationField) routeFields.appendChild(destinationField);

    // 車資自助試算可直接填「分鐘＋公里」，不強迫先輸入地址。
    // 只有按 Google 地圖或人工估價時才需要地址；這裡只改 fare 模式，叫車/代駕欄位規則不動。
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
      summary.innerHTML = `<span><strong>${escapeHtml(cfg()['人工協助標題'] || '其他估價方式')}</strong><small>${escapeHtml(cfg()['人工協助提示'] ?? '')}</small></span><b aria-hidden="true">⌄</b>`;
      const inner = document.createElement('div');
      inner.className = 'gc-fare-manual-inner';
      const panelTitle = document.createElement('strong');
      panelTitle.className = 'gc-manual-panel-title';
      panelTitle.textContent = cfg()['人工協助展開標題'] || '客服協助估價';
      const extra = document.createElement('div');
      extra.className = 'gc-fare-manual-extra';
      const manualCopy = cfg()['人工協助補充'] || '請填寫上下車地址。客服繁忙時可能先提供快速試算；如需人工估價，請稍候小編協助。';
      const manualLines = String(manualCopy).split(/[。；]/).map(line => line.trim()).filter(Boolean);
      extra.innerHTML = manualLines.map(line => `<div class="gc-manual-note-row"><i aria-hidden="true"></i><span>${escapeHtml(line)}</span></div>`).join('');
      manualHead.remove();
      manual.parentNode.insertBefore(details, manual);
      details.appendChild(summary);
      details.appendChild(inner);
      inner.appendChild(panelTitle);
      inner.appendChild(extra);
      inner.appendChild(form);
      manual.remove();
      details.addEventListener('toggle', () => { const b = summary.querySelector('b'); if (b) b.textContent = details.open ? '⌃' : '⌄'; });
      window.GC_installManagedDisclosureBehavior?.();

      // 人工估價按鈕在頁面底部；地址在上方。缺地址時不能像「沒反應」，
      // 必須直接把畫面帶到第一個缺少的地址並顯示原本錯誤提示。
      form.addEventListener('submit', event => {
        const missingPickup = !trim(pickup.value);
        const missingDestination = !trim(destination.value);
        if (!missingPickup && !missingDestination) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        details.open = true;
        // 自助試算時地址不是強制欄位；人工估價這個動作需要上下車地址。
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
    [pickup, destination, qs('fareKm'), qs('fareMinutes')].filter(Boolean).forEach(input => {
      input.addEventListener('input', () => {
        saveDraft();
        if (input === pickup && trim(pickup.value)) setFieldError('pickup', '');
        if (input === destination && trim(destination.value)) setFieldError('destination', '');
      });
      input.addEventListener('change', saveDraft);
    });
    ['fareKm', 'fareMinutes'].forEach(id => {
      qs(id)?.addEventListener('input', () => setTimeout(refreshFareAction, 0));
      qs(id)?.addEventListener('change', () => setTimeout(refreshFareAction, 0));
    });
    clearLegacyFareStorage();
    currentFareFlow(true);
    restoreDraft();
    refreshFareAction();
    return true;
  }

  function consumeCallHandoff() {
    if (document.documentElement.dataset.gcFareHandoffDone === '1') return true;
    const pickup = qs('pickup');
    const destination = qs('destination');
    if (!pickup || !destination || !document.querySelector('#serviceForm')) return false;
    document.documentElement.dataset.gcFareHandoffDone = '1';
    const handoff = safeSessionGet(HANDOFF_KEY);
    if (!handoff) return true;
    if (!trim(pickup.value) && trim(handoff.pickup)) setAddressValueSilently(pickup, handoff.pickup);
    if (!trim(destination.value) && trim(handoff.destination)) setAddressValueSilently(destination, handoff.destination);
    // 只消耗「帶入叫車」資料；原車資快照保留 20 分鐘，供瀏覽器返回查看。
    safeSessionRemove(HANDOFF_KEY);
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
