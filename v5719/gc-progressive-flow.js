(() => {
  'use strict';
  // GC_MASTER_STABLE_2026_08R10Z9_ENTERPRISE_PROGRESSIVE_FLOW
  // GC_MASTER_STABLE_2026_08R10Z9C_PROGRESSIVE_STABLE_COMMIT
  // GC_MASTER_STABLE_2026_08R10Z9L_CONFIRMED_RESERVATION_GATE
  // GC_MASTER_STABLE_2026_08R10Z9W_SERVICE_SCOPED_SCHEDULE_VISIBILITY
  // GC_MASTER_STABLE_2026_08R10Z14F15_ADDRESS_EDIT_VIEWPORT_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F16_ALL_INPUT_VIEWPORT_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F20_RIDE_PROGRESSIVE_DONE_STABILITY
  // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R12_IOS_DESTINATION_FOCUS_AND_DONE_RACE_ROOT_FIX
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
      // While the passenger is actively editing an already-committed pickup, keep downstream
      // sections structurally stable. Re-evaluate/collapse only after editing finishes (blur/change).
      if (document.activeElement !== pickup && pickup.dataset.gcAddressVerified !== '1') {
        delete pickup.dataset.gcFlowCommitted;
      }
    }, { passive:true });
    pickup?.addEventListener('blur', commitPickup, { passive:true });
    pickup?.addEventListener('change', commitPickup, { passive:true });

    function update() {
      const service = serviceValue();
      const chosen = Boolean(service);
      const reserve = service === 'reserve';
      const scheduleReady = typeof window.GC_isScheduleConfirmed === 'function' && window.GC_isScheduleConfirmed();
      const serviceReady = chosen && (!reserve || scheduleReady);
      const pickupReady = Boolean(pickup?.dataset.gcAddressVerified === '1' || pickup?.dataset.gcFlowCommitted === '1');

      // Visibility is derived from the current radio on every update, including
      // browser-restored/bfcache DOM. No selection and instant must never show it.
      schedule?.classList.toggle('hidden', !reserve);
      form.dataset.gcFlowServiceChosen = chosen ? '1' : '0';
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
      // Reservation mode may not reveal any downstream information until both schedule controls are confirmed.
      if (favorite) setCollapsed(favorite, !serviceReady);
    }

    // F20: call/driver address fields have progressive-flow layout changes that fare mode does not.
    // When iOS "Done" dismisses the keyboard, a synchronous blur/change update races WebKit's
    // visualViewport restoration and the smart-suggestion collapse, producing a one-frame shake.
    // Keep the already-visible ride layout frozen during that dismissal window, then commit the
    // progressive state exactly once after the viewport and suggestion surface have settled.
    let rideBlurRevision = 0;
    let rideBlurRaf = 0;
    let rideBlurTimer = 0;
    const addressControls = new Set([pickup, destination].filter(Boolean));

    function cancelRideBlurUpdate() {
      rideBlurRevision += 1;
      if (rideBlurRaf) cancelAnimationFrame(rideBlurRaf);
      rideBlurRaf = 0;
      clearTimeout(rideBlurTimer);
      rideBlurTimer = 0;
    }

    function anotherInteractiveTargetHasFocus(control) {
      const active = window.GC_keyboardTargetInteractionElement?.() || document.activeElement;
      if (!active || active === control || active === document.body || active === document.documentElement) return false;
      return /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(active.tagName || '');
    }

    function scheduleRideBlurUpdate(control) {
      if (!addressControls.has(control)) { update(); return; }
      cancelRideBlurUpdate();
      const revision = rideBlurRevision;

      const finish = () => {
        if (revision !== rideBlurRevision) return;
        if (anotherInteractiveTargetHasFocus(control)) return;
        if (rideBlurRaf) cancelAnimationFrame(rideBlurRaf);
        rideBlurRaf = 0;
        clearTimeout(rideBlurTimer);
        rideBlurTimer = 0;
        update();
      };

      const sharedSettler = window.GC_runAfterRideKeyboardDismissSettles;
      if (typeof sharedSettler === 'function') {
        // M2R12: join the exact same post-keyboard transaction used by smart-suggestion cleanup.
        // This guarantees one settled layout commit instead of two independent polls that can finish
        // on different animation frames and intermittently fight iOS visualViewport restoration.
        sharedSettler(control, finish, { minDelay: 320, maxDelay: 1180 });
        return;
      }

      // Defensive fallback for an incomplete/legacy bundle only. Current production bundles always
      // provide GC_runAfterRideKeyboardDismissSettles before this module is evaluated.
      rideBlurTimer = setTimeout(finish, 880);
    }

    [...radios, document.getElementById('date'), document.getElementById('time')].filter(Boolean).forEach(control => {
      control.addEventListener('input', update, { passive: true });
      control.addEventListener('change', update, { passive: true });
      control.addEventListener('focus', update, { passive: true });
      control.addEventListener('blur', update, { passive: true });
    });
    [pickup, destination].filter(Boolean).forEach(control => {
      control.addEventListener('input', () => { cancelRideBlurUpdate(); update(); }, { passive: true });
      // Programmatic address fills already emit input before change. Avoid a second synchronous
      // progressive update on the native change event that accompanies keyboard Done.
      control.addEventListener('change', event => {
        // Native change is part of the Done/blur sequence and must share the deferred commit.
        // Programmatic fills already emit input first, so keep their established immediate behavior.
        if (event.isTrusted) scheduleRideBlurUpdate(control);
        else update();
      }, { passive: true });
      control.addEventListener('focus', () => { cancelRideBlurUpdate(); update(); }, { passive: true });
      control.addEventListener('blur', () => scheduleRideBlurUpdate(control), { passive: true });
    });
    form.addEventListener('gc:address-verified', () => { commitPickup(); update(); });
    form.addEventListener('gc:schedule-state', update);
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
