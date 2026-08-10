(() => {
  'use strict';
  // GC_MASTER_STABLE_2026_08R10Z9_ENTERPRISE_PROGRESSIVE_FLOW
  // First-screen clean, no service preselection. Existing fields/functions stay in the DOM and are
  // revealed in context. No auto-scroll, auto-focus or forced viewport movement is introduced.

  const mode = new URLSearchParams(location.search).get('mode');
  if (!['call','driver','fare'].includes(mode)) return;

  const trim = value => String(value ?? '').trim();
  const serviceValue = () => document.querySelector('input[name="serviceType"]:checked')?.value || '';
  const value = id => trim(document.getElementById(id)?.value);
  let observer = null;

  function setCollapsed(node, collapsed) {
    if (!node) return;
    node.classList.toggle('gc-flow-collapsed', collapsed);
    if (collapsed) {
      node.setAttribute('aria-hidden', 'true');
      try { node.inert = true; } catch (_) {}
    } else {
      node.removeAttribute('aria-hidden');
      try { node.inert = false; } catch (_) {}
    }
  }

  function setupRide(form) {
    if (!form) return false;
    if (form.dataset.gcEnterpriseProgressive === '1') return true;
    form.dataset.gcEnterpriseProgressive = '1';
    form.classList.add('gc-enterprise-flow');

    const radios = [...form.querySelectorAll('input[name="serviceType"]')];
    const serviceField = radios[0]?.closest('.field');
    const schedule = document.getElementById('scheduleFields');
    const pickup = document.getElementById('pickup');
    const destination = document.getElementById('destination');
    const pickupField = pickup?.closest('.field');
    const destinationField = destination?.closest('.field');
    const favorite = document.getElementById('favoriteTripsBox');
    const passenger = document.getElementById('passengers')?.closest('.field');
    const optional = [...form.querySelectorAll(':scope > details.optional-box')].filter(el => el !== favorite);
    const notices = [...form.querySelectorAll(':scope > .notice:not(.preview-notice)')];
    const submit = document.getElementById('submitBtn');

    serviceField?.classList.add('gc-flow-service');
    schedule?.classList.add('gc-flow-schedule');
    pickupField?.classList.add('gc-flow-pickup');
    destinationField?.classList.add('gc-flow-destination');
    [favorite, passenger, ...optional, ...notices, submit].filter(Boolean).forEach(node => node.classList.add('gc-flow-advanced'));

    function update() {
      const service = serviceValue();
      const chosen = Boolean(service);
      const reserve = service === 'reserve';
      const serviceReady = chosen && (!reserve || (Boolean(value('date')) && Boolean(value('time'))));
      const pickupReady = Boolean(pickup?.dataset.gcAddressVerified === '1' || value('pickup').length >= 2);

      form.dataset.gcFlowServiceChosen = chosen ? '1' : '0';
      form.dataset.gcFlowServiceReady = serviceReady ? '1' : '0';
      form.dataset.gcFlowPickupReady = pickupReady ? '1' : '0';
      serviceField?.classList.toggle('gc-flow-complete', chosen);
      serviceField?.classList.toggle('gc-flow-current', !chosen);
      schedule?.classList.toggle('gc-flow-current', reserve && !serviceReady);
      pickupField?.classList.toggle('gc-flow-current', serviceReady && !pickupReady);
      pickupField?.classList.toggle('gc-flow-complete', pickupReady);
      destinationField?.classList.toggle('gc-flow-current', serviceReady && pickupReady && !value('destination'));

      // Initial screen: only service decision. Reserve then asks date/time. Once that is ready,
      // pickup becomes the task. Destination + complete feature set appears after pickup has begun.
      if (pickupField) setCollapsed(pickupField, !serviceReady);
      if (destinationField) setCollapsed(destinationField, !(serviceReady && pickupReady));
      [favorite, passenger, ...optional, ...notices, submit].filter(Boolean).forEach(node => setCollapsed(node, !(serviceReady && pickupReady)));
    }

    [...radios, document.getElementById('date'), document.getElementById('time'), pickup, destination].filter(Boolean).forEach(control => {
      control.addEventListener('input', update, { passive: true });
      control.addEventListener('change', update, { passive: true });
      control.addEventListener('focus', update, { passive: true });
      control.addEventListener('blur', update, { passive: true });
    });
    form.addEventListener('gc:address-verified', update);
    update();
    requestAnimationFrame(update);
    setTimeout(update, 180);
    return true;
  }

  function setupFare() {
    const card = document.querySelector('.gc-fare-card');
    if (!card || card.dataset.gcEnterpriseProgressive === '1') return Boolean(card);
    card.dataset.gcEnterpriseProgressive = '1';
    card.classList.add('gc-enterprise-fare');
    const form = document.getElementById('serviceForm');
    const pickup = document.getElementById('pickup');
    const destination = document.getElementById('destination');
    const minutes = document.getElementById('fareMinutes');
    const km = document.getElementById('fareKm');
    const update = () => {
      const routeReady = Boolean(value('pickup') && value('destination'));
      const numbersReady = Boolean(value('fareMinutes') && value('fareKm'));
      card.dataset.gcFareRouteReady = routeReady ? '1' : '0';
      card.dataset.gcFareNumbersReady = numbersReady ? '1' : '0';
    };
    [pickup,destination,minutes,km].filter(Boolean).forEach(control => {
      control.addEventListener('input', update, { passive:true });
      control.addEventListener('change', update, { passive:true });
    });
    update();
    return true;
  }

  function tryInstall() {
    if (mode === 'fare') return setupFare();
    return setupRide(document.getElementById('serviceForm'));
  }

  if (!tryInstall()) {
    observer = new MutationObserver(() => { if (tryInstall()) { observer?.disconnect(); observer = null; } });
    observer.observe(document.documentElement, { childList:true, subtree:true });
    setTimeout(() => { observer?.disconnect(); observer = null; }, 12000);
  }
})();
