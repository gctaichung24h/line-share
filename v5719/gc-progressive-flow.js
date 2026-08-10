(() => {
  'use strict';
  // GC_MASTER_STABLE_2026_08R10Z7_PROGRESSIVE_COMPLETION_UX
  // Conversion-first progressive guidance for call/driver only.
  // Contract: no existing field, function, copy block, shortcut or confirmation data is removed.
  // Fare already has its own explicit route -> numbers -> result progression and is intentionally untouched.

  const mode = new URLSearchParams(location.search).get('mode');
  if (mode !== 'call' && mode !== 'driver') return;

  let installedForm = null;
  let observer = null;

  const trim = value => String(value ?? '').trim();
  const inputValue = id => trim(document.getElementById(id)?.value);
  const serviceValue = () => document.querySelector('input[name="serviceType"]:checked')?.value || '';

  function addressLabel(field, id) {
    return field?.querySelector(`label[for="${id}"]`) || field?.querySelector(':scope > label') || null;
  }

  function ensureCue(field, id) {
    const label = addressLabel(field, id);
    if (!label) return null;
    label.classList.add('gc-flow-cue-label');
    let cue = label.querySelector(':scope > .gc-flow-cue');
    if (!cue) {
      cue = document.createElement('span');
      cue.className = 'gc-flow-cue';
      cue.setAttribute('aria-hidden', 'true');
      label.appendChild(cue);
    }
    return cue;
  }

  function setCue(field, id, text, state = '') {
    const cue = ensureCue(field, id);
    if (!cue) return;
    cue.textContent = text;
    cue.className = `gc-flow-cue${state ? ` is-${state}` : ''}`;
    cue.classList.toggle('hidden', !text);
  }

  function ensureRail(form) {
    let rail = form.querySelector(':scope > .gc-flow-rail');
    if (rail) return rail;
    rail = document.createElement('div');
    rail.className = 'gc-flow-rail';
    rail.setAttribute('role', 'progressbar');
    rail.setAttribute('aria-label', mode === 'driver' ? '代駕填寫進度' : '叫車填寫進度');
    rail.setAttribute('aria-valuemin', '1');
    rail.setAttribute('aria-valuemax', '3');
    rail.innerHTML = `
      <span class="gc-flow-step" data-step="1"><i></i><b>服務</b></span>
      <span class="gc-flow-step" data-step="2"><i></i><b>地點</b></span>
      <span class="gc-flow-step" data-step="3"><i></i><b>確認</b></span>`;
    const globalError = form.querySelector(':scope > #globalError');
    if (globalError) globalError.after(rail);
    else form.prepend(rail);
    return rail;
  }

  function setRail(rail, serviceReady, pickupReady) {
    if (!rail) return;
    const stage = !serviceReady ? 1 : !pickupReady ? 2 : 3;
    rail.setAttribute('aria-valuenow', String(stage));
    rail.querySelectorAll('.gc-flow-step').forEach(step => {
      const n = Number(step.dataset.step || 0);
      step.classList.toggle('is-done', n < stage);
      step.classList.toggle('is-active', n === stage);
    });
  }

  function installDefaultInstant(form) {
    if (form.dataset.gcDefaultInstantApplied === '1') return;
    form.dataset.gcDefaultInstantApplied = '1';
    if (serviceValue()) return;
    const instant = form.querySelector('input[name="serviceType"][value="instant"]');
    if (!instant) return;
    instant.checked = true;
    // Reuse the existing production handler so schedule/location behavior remains one source of truth.
    instant.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function update(form) {
    if (!form?.isConnected) return;
    const service = serviceValue();
    const reserve = service === 'reserve';
    const dateReady = !reserve || Boolean(inputValue('date'));
    const timeReady = !reserve || Boolean(inputValue('time'));
    const serviceReady = Boolean(service) && dateReady && timeReady;
    const pickupReady = Boolean(inputValue('pickup'));
    const destinationReady = Boolean(inputValue('destination'));
    const pickupField = document.getElementById('pickup')?.closest('.field');
    const destinationField = document.getElementById('destination')?.closest('.field');
    const schedule = document.getElementById('scheduleFields');
    const submit = document.getElementById('submitBtn');
    const rail = ensureRail(form);

    form.classList.add('gc-progressive-flow');
    setRail(rail, serviceReady, pickupReady);

    if (schedule) {
      const scheduleNeedsAttention = reserve && (!dateReady || !timeReady);
      schedule.classList.toggle('gc-flow-current', scheduleNeedsAttention);
      schedule.classList.toggle('gc-flow-complete', reserve && dateReady && timeReady);
    }

    if (pickupField) {
      pickupField.classList.toggle('gc-flow-current', serviceReady && !pickupReady);
      pickupField.classList.toggle('gc-flow-complete', pickupReady);
      if (pickupReady) setCue(pickupField, 'pickup', '✓ 已填', 'complete');
      else if (serviceReady) setCue(pickupField, 'pickup', '先填這裡', 'current');
      else setCue(pickupField, 'pickup', '');
    }

    if (destinationField) {
      destinationField.classList.toggle('gc-flow-current', serviceReady && pickupReady && !destinationReady);
      destinationField.classList.toggle('gc-flow-complete', destinationReady);
      if (destinationReady) setCue(destinationField, 'destination', '✓ 已填', 'complete');
      else if (serviceReady && pickupReady) setCue(destinationField, 'destination', '接著填', 'current');
      else setCue(destinationField, 'destination', '');
    }

    if (submit) submit.classList.toggle('gc-flow-ready', serviceReady && pickupReady);
  }

  function install(form) {
    if (!form || form === installedForm || form.dataset.gcProgressiveCompletion === '1') return false;
    installedForm = form;
    form.dataset.gcProgressiveCompletion = '1';
    installDefaultInstant(form);
    ensureRail(form);

    const watched = [
      ...form.querySelectorAll('input[name="serviceType"]'),
      document.getElementById('date'),
      document.getElementById('time'),
      document.getElementById('pickup'),
      document.getElementById('destination')
    ].filter(Boolean);
    watched.forEach(control => {
      control.addEventListener('input', () => update(form), { passive: true });
      control.addEventListener('change', () => update(form), { passive: true });
      control.addEventListener('focus', () => update(form), { passive: true });
      control.addEventListener('blur', () => update(form), { passive: true });
    });

    // Existing suggestion / GPS / recent / favorite flows dispatch input/change. Two frames also
    // cover late DOM restructuring without changing their data or behavior.
    update(form);
    requestAnimationFrame(() => update(form));
    setTimeout(() => update(form), 180);
    return true;
  }

  function tryInstall() {
    const form = document.getElementById('serviceForm');
    if (form) return install(form);
    return false;
  }

  if (!tryInstall()) {
    observer = new MutationObserver(() => {
      if (tryInstall()) {
        observer?.disconnect();
        observer = null;
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => { observer?.disconnect(); observer = null; }, 12000);
  }
})();
