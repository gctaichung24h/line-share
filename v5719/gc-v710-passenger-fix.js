(() => {
  'use strict';
  // GC_MASTER_STABLE_2026_08R10_5PLUS_PASSENGER_UX
  const params = new URLSearchParams(location.search);
  if (params.get('mode') !== 'call') return;
  let tries = 0;
  const placePassenger = () => {
    tries += 1;
    const passengerInput = document.getElementById('passengers');
    const destinationInput = document.getElementById('destination');
    const vehicleInput = document.getElementById('gcVehicle');
    const passengerField = passengerInput?.closest('.field');
    const destinationField = destinationInput?.closest('.field');
    const vehicleField = vehicleInput?.closest('.field');
    const anchor = vehicleField || destinationField;
    if (!passengerField || !anchor) {
      if (tries < 120) setTimeout(placePassenger, 50);
      return;
    }
    passengerField.classList.add('gc-passenger-public');
    passengerField.style.display = 'block';
    passengerField.style.visibility = 'visible';
    if (anchor.nextElementSibling !== passengerField) anchor.after(passengerField);
    const label = passengerField.querySelector(':scope > label');
    if (label) label.textContent = '5人以上請選人數';
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', placePassenger, { once: true });
  else placePassenger();
})();
