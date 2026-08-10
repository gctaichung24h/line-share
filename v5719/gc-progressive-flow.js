(() => {
  'use strict';
  // GC_MASTER_STABLE_2026_08R10Z9_ENTERPRISE_PROGRESSIVE_FLOW
  // GC_MASTER_STABLE_2026_08R10Z9C_PROGRESSIVE_STABLE_COMMIT
  // GC_MASTER_STABLE_2026_08R10Z9N_IOS_SCHEDULE_CONFIRM_GATE
  // GC_MASTER_STABLE_2026_08R10Z9P_TIME_PICKER_ANCHOR_CONFIRM_GATE
  // First-screen clean, no service preselection on fresh Rich Menu entry. Existing functions remain in DOM.
  // Destination/advanced content opens only after the pickup is selected/verified or the user commits typed text.
  // No auto-scroll, auto-focus, forced viewport movement, or mid-typing layout expansion.

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
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const pickup = document.getElementById('pickup');
    const destination = document.getElementById('destination');
    const pickupField = pickup?.closest('.field');
    const destinationField = destination?.closest('.field');
    const favorite = document.getElementById('favoriteTripsBox');
    const passenger = document.getElementById('passengers')?.closest('.field');
    const optional = [...form.querySelectorAll(':scope > details.optional-box')].filter(el => el !== favorite);
    const notices = [...form.querySelectorAll(':scope > .notice:not(.preview-notice)')];
    const submit = document.getElementById('submitBtn');
    const fromFareHandoff = document.documentElement.dataset.gcFareHandoffApplied === '1';
    let serviceInteracted = false;

    serviceField?.classList.add('gc-flow-service');
    schedule?.classList.add('gc-flow-schedule');
    pickupField?.classList.add('gc-flow-pickup');
    destinationField?.classList.add('gc-flow-destination');
    [passenger, ...optional, ...notices, submit].filter(Boolean).forEach(node => node.classList.add('gc-flow-advanced'));

    const clearBrowserRestoredService = () => {
      if (fromFareHandoff || serviceInteracted) return;
      radios.forEach(radio => { radio.checked = false; });
    };
    radios.forEach(radio => {
      radio.addEventListener('pointerdown', () => { serviceInteracted = true; }, { passive:true });
      radio.addEventListener('keydown', () => { serviceInteracted = true; }, { passive:true });
      radio.addEventListener('change', () => { serviceInteracted = true; }, { passive:true });
    });
    clearBrowserRestoredService();

    const commitPickup = () => {
      if (!pickup) return;
      if (pickup.dataset.gcAddressVerified === '1' || value('pickup').length >= 2) pickup.dataset.gcFlowCommitted = '1';
      else delete pickup.dataset.gcFlowCommitted;
    };
    pickup?.addEventListener('input', () => {
      if (pickup.dataset.gcAddressVerified !== '1') delete pickup.dataset.gcFlowCommitted;
    }, { passive:true });
    pickup?.addEventListener('blur', commitPickup, { passive:true });
    pickup?.addEventListener('change', commitPickup, { passive:true });

    function update() {
      const service = serviceValue();
      const chosen = Boolean(service);
      const reserve = service === 'reserve';
      // iOS/WKWebView mutates date/time values while the native wheel is still open.
      // Treat the schedule as confirmed only after both values exist AND neither picker input is focused.
      // The blur handler below re-checks on the next animation frame, matching the native 「完成」 close.
      const scheduleEditing = reserve && (
        document.activeElement === dateInput ||
        document.activeElement === timeInput ||
        dateInput?.dataset.gcPickerOpen === '1' ||
        timeInput?.dataset.gcPickerOpen === '1'
      );
      const scheduleConfirmed = !reserve || (Boolean(value('date')) && Boolean(value('time')) && !scheduleEditing);
      const serviceReady = chosen && scheduleConfirmed;
      const pickupHasText = value('pickup').length >= 2;
      const pickupReady = pickupHasText && Boolean(pickup?.dataset.gcAddressVerified === '1' || pickup?.dataset.gcFlowCommitted === '1');

      form.dataset.gcFlowServiceChosen = chosen ? '1' : '0';
      form.dataset.gcFlowScheduleEditing = scheduleEditing ? '1' : '0';
      form.dataset.gcFlowScheduleConfirmed = scheduleConfirmed ? '1' : '0';
      form.dataset.gcFlowServiceReady = serviceReady ? '1' : '0';
      form.dataset.gcFlowPickupReady = pickupReady ? '1' : '0';
      serviceField?.classList.toggle('gc-flow-complete', chosen);
      serviceField?.classList.toggle('gc-flow-current', !chosen);
      schedule?.classList.toggle('gc-flow-current', reserve && !serviceReady);
      pickupField?.classList.toggle('gc-flow-current', serviceReady && !pickupReady);
      pickupField?.classList.toggle('gc-flow-complete', pickupReady);
      destinationField?.classList.toggle('gc-flow-current', serviceReady && pickupReady && !value('destination'));

      if (pickupField) setCollapsed(pickupField, !serviceReady);
      if (destinationField) setCollapsed(destinationField, !(serviceReady && pickupReady));
      [passenger, ...optional, ...notices, submit].filter(Boolean).forEach(node => setCollapsed(node, !(serviceReady && pickupReady)));
      // Favorite trips intentionally stay available in the pickup utility sheet; they can fill both endpoints in one tap.
      if (favorite) setCollapsed(favorite, false);
    }

    [...radios, dateInput, timeInput, pickup, destination].filter(Boolean).forEach(control => {
      control.addEventListener('input', update, { passive: true });
      control.addEventListener('change', update, { passive: true });
      control.addEventListener('focus', update, { passive: true });
      control.addEventListener('blur', () => requestAnimationFrame(update), { passive: true });
    });
    [dateInput, timeInput].filter(Boolean).forEach(control => {
      control.addEventListener('gc:schedule-picker-state', update, { passive: true });
    });
    if (dateInput) {
      const markDateOpen = () => { dateInput.dataset.gcPickerOpen = '1'; update(); };
      const markDateClosed = () => requestAnimationFrame(() => {
        if (document.activeElement === dateInput) return;
        delete dateInput.dataset.gcPickerOpen;
        update();
      });
      dateInput.addEventListener('pointerdown', markDateOpen, { passive: true });
      dateInput.addEventListener('focus', markDateOpen, { passive: true });
      dateInput.addEventListener('change', markDateClosed, { passive: true });
      dateInput.addEventListener('blur', markDateClosed, { passive: true });
    }
    form.addEventListener('gc:address-verified', () => { commitPickup(); update(); });
    update();
    requestAnimationFrame(() => { clearBrowserRestoredService(); update(); });
    setTimeout(() => { clearBrowserRestoredService(); update(); }, 120);
    return true;
  }

  function setupFare() {
    const card = document.querySelector('.gc-fare-card');
    if (!card || card.dataset.gcEnterpriseProgressive === '1') return Boolean(card);
    card.dataset.gcEnterpriseProgressive = '1';
    card.classList.add('gc-enterprise-fare');
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
