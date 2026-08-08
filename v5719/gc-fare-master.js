(() => {
  'use strict';
  const MASTER_MARKER = 'GC_MASTER_STABLE_2026_08_FARE_FLOW_MODULE';
  const DRAFT_KEY = 'gc_fare_draft_v1';
  const HANDOFF_KEY = 'gc_fare_to_call_v1';
  const TTL_MS = 30 * 60 * 1000;

  const cfg = () => (window.GC_FORM_CONFIG && window.GC_FORM_CONFIG.fare) || {};
  const qs = id => document.getElementById(id);
  const trim = value => String(value || '').trim();
  const safeStorageGet = key => {
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
  const safeStorageSet = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  const safeStorageRemove = key => { try { localStorage.removeItem(key); } catch (_) {} };
  const escapeHtml = text => String(text ?? '').replace(/[&<>'"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));

  function currentMode() {
    return new URLSearchParams(location.search).get('mode') || '';
  }

  function setFieldError(id, message) {
    const input = qs(id);
    const error = qs(id + 'Error');
    if (input) input.classList.toggle('invalid', Boolean(message));
    if (error) {
      error.textContent = message || '';
      error.classList.toggle('show', Boolean(message));
    }
  }

  function saveDraft() {
    const pickup = trim(qs('pickup')?.value);
    const destination = trim(qs('destination')?.value);
    const km = trim(qs('fareKm')?.value);
    const minutes = trim(qs('fareMinutes')?.value);
    if (!pickup && !destination && !km && !minutes) return;
    safeStorageSet(DRAFT_KEY, { pickup, destination, km, minutes, createdAt: Date.now() });
  }

  function restoreDraft() {
    const draft = safeStorageGet(DRAFT_KEY);
    if (!draft) return;
    [['pickup', draft.pickup], ['destination', draft.destination], ['fareKm', draft.km], ['fareMinutes', draft.minutes]].forEach(([id, value]) => {
      const input = qs(id);
      if (!input || trim(input.value) || !trim(value)) return;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  function googleMapsUrl() {
    const pickup = trim(qs('pickup')?.value);
    const destination = trim(qs('destination')?.value);
    if (!pickup) setFieldError('pickup', cfg()['錯誤_上車地址'] || '請填寫上車地址。');
    else setFieldError('pickup', '');
    if (!destination) setFieldError('destination', cfg()['錯誤_下車地址'] || '請填寫下車地址。');
    else setFieldError('destination', '');
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

  function openMaps() {
    const url = googleMapsUrl();
    if (!url) {
      qs('pickup')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
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
    const hint = qs('gcFareCallHint');
    if (!pickup || !destination) {
      if (!pickup) setFieldError('pickup', cfg()['錯誤_上車地址'] || '請填寫上車地址。');
      if (!destination) setFieldError('destination', cfg()['錯誤_下車地址'] || '請填寫下車地址。');
      if (hint) {
        hint.textContent = cfg()['叫車缺地址提示'] || '要直接叫車，請先填寫上方的上下車地點。';
        hint.classList.remove('hidden');
      }
      qs('gcFareRouteStep')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      (pickup ? qs('destination') : qs('pickup'))?.focus({ preventScroll: true });
      return;
    }
    setFieldError('pickup', '');
    setFieldError('destination', '');
    if (hint) hint.classList.add('hidden');
    saveDraft();
    safeStorageSet(HANDOFF_KEY, { pickup, destination, createdAt: Date.now() });
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
      <div class="gc-fare-step-head">
        <strong>${escapeHtml(cfg()['路線步驟標題'] || '① 先確認較短距離路線')}</strong>
        <p>${escapeHtml(cfg()['路線步驟說明'] || '輸入上下車地點後開啟 Google 地圖；若有多條路線，請選公里數較少的那條。')}</p>
      </div>
      <div class="gc-fare-route-fields" id="gcFareRouteFields"></div>
      <button class="gc-fare-map-btn" id="gcFareMapBtn" type="button">${escapeHtml(cfg()['路線按鈕'] || '開啟 Google 地圖查看路線')}</button>
      <div class="gc-fare-route-rule" role="note">
        <strong>${escapeHtml(cfg()['路線重點標題'] || '試算看公里數，不看預設藍色路線')}</strong>
        <p>${escapeHtml(cfg()['路線重點說明1'] || 'Google 預設建議通常偏向較快，不一定是距離較短。')}</p>
        <div class="gc-fare-route-example">
          <span>${escapeHtml(cfg()['路線範例1'] || '較快：16 分｜10.2 km')}</span>
          <span class="is-selected">${escapeHtml(cfg()['路線範例2'] || '試算：21 分｜7.9 km（公里數較少）')}</span>
        </div>
        <p class="gc-fare-route-return">${escapeHtml(cfg()['路線返回提醒'] || '看完後切回 LINE，只要填入該路線的「公里＋分鐘」。')}</p>
      </div>
      <button class="gc-fare-skip-link" id="gcFareSkipRoute" type="button">${escapeHtml(cfg()['已知數字捷徑'] || '已經知道公里＋分鐘？直接往下試算')}</button>`;
    calc.parentNode.insertBefore(routeStep, calc);
    const routeFields = qs('gcFareRouteFields');
    if (pickupField) routeFields.appendChild(pickupField);
    if (destinationField) routeFields.appendChild(destinationField);

    const manual = document.querySelector('.gc-fare-manual');
    const manualHead = manual?.querySelector('.gc-fare-manual-head');
    if (manual && manualHead) {
      const details = document.createElement('details');
      details.className = 'gc-fare-manual-details';
      const summary = document.createElement('summary');
      summary.innerHTML = `<span><strong>${escapeHtml(cfg()['人工協助標題'] || '還是不方便操作？')}</strong><small>${escapeHtml(cfg()['人工協助提示'] || '客服也可以協助估價；繁忙時回覆可能需要稍候。')}</small></span><b aria-hidden="true">＋</b>`;
      const inner = document.createElement('div');
      inner.className = 'gc-fare-manual-inner';
      const extra = document.createElement('p');
      extra.className = 'gc-fare-manual-extra';
      extra.textContent = cfg()['人工協助補充'] || '若只是想立即知道大概車資，使用上方快速試算會比較快。';
      manualHead.remove();
      manual.parentNode.insertBefore(details, manual);
      details.appendChild(summary);
      details.appendChild(inner);
      inner.appendChild(extra);
      inner.appendChild(form);
      manual.remove();
      details.addEventListener('toggle', () => { const b = summary.querySelector('b'); if (b) b.textContent = details.open ? '－' : '＋'; });
    }

    const result = qs('fareCalcResult');
    if (result) {
      const reminder = document.createElement('section');
      reminder.className = 'gc-fare-ride-reminder';
      reminder.id = 'gcFareRideReminder';
      reminder.innerHTML = `
        <strong>${escapeHtml(cfg()['乘車提醒標題'] || '希望實際車資接近本次預估？')}</strong>
        <p class="gc-fare-ride-script">${escapeHtml(cfg()['乘車提醒主句'] || '上車時可直接告知司機：「麻煩走較短距離路線，謝謝。」')}</p>
        <p>${escapeHtml(cfg()['乘車提醒補充1'] || '若有指定路線，也可於上車時直接告知司機。')}</p>
        <p>${escapeHtml(cfg()['乘車提醒補充2'] || '若以時間為優先，可請司機走較快路線；距離較長時車資可能增加。')}</p>`;
      result.appendChild(reminder);

      const actionWrap = document.createElement('div');
      actionWrap.className = 'gc-fare-result-actions hidden';
      actionWrap.id = 'gcFareCallAction';
      actionWrap.innerHTML = `<button type="button" class="gc-fare-call-btn" id="gcFareCallBtn">${escapeHtml(cfg()['叫車按鈕'] || '價格可以・立即叫車')}</button><p class="gc-fare-call-hint hidden" id="gcFareCallHint"></p>`;
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
    qs('gcFareSkipRoute')?.addEventListener('click', () => calc.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    qs('gcFareCallBtn')?.addEventListener('click', toCall);
    [pickup, destination, qs('fareKm'), qs('fareMinutes')].filter(Boolean).forEach(input => {
      input.addEventListener('input', () => { saveDraft(); if (input === pickup) setFieldError('pickup', ''); if (input === destination) setFieldError('destination', ''); });
      input.addEventListener('change', saveDraft);
    });
    ['fareKm', 'fareMinutes'].forEach(id => {
      qs(id)?.addEventListener('input', () => setTimeout(refreshFareAction, 0));
      qs(id)?.addEventListener('change', () => setTimeout(refreshFareAction, 0));
    });
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
    const handoff = safeStorageGet(HANDOFF_KEY);
    if (!handoff) return true;
    if (!trim(pickup.value) && trim(handoff.pickup)) {
      pickup.value = handoff.pickup;
      pickup.dispatchEvent(new Event('input', { bubbles: true }));
      pickup.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (!trim(destination.value) && trim(handoff.destination)) {
      destination.value = handoff.destination;
      destination.dispatchEvent(new Event('input', { bubbles: true }));
      destination.dispatchEvent(new Event('change', { bubbles: true }));
    }
    safeStorageRemove(HANDOFF_KEY);
    safeStorageRemove(DRAFT_KEY);
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
