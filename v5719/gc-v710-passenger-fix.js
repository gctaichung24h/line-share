(() => {
  'use strict';
  const params = new URLSearchParams(location.search);
  if (params.get('mode') !== 'call') return;
  let tries = 0;
  const placePassenger = () => {
    tries += 1;
    const passengerInput = document.getElementById('passengers');
    const destinationInput = document.getElementById('destination');
    const passengerField = passengerInput?.closest('.field');
    const destinationField = destinationInput?.closest('.field');
    if (!passengerField || !destinationField) {
      if (tries < 120) setTimeout(placePassenger, 50);
      return;
    }
    passengerField.classList.add('gc-passenger-public');
    passengerField.style.display = 'block';
    passengerField.style.visibility = 'visible';
    if (destinationField.nextElementSibling !== passengerField) destinationField.after(passengerField);
    const label = passengerField.querySelector(':scope > label');
    if (label) label.textContent = '搭乘人數（選填）';
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', placePassenger, { once: true });
  else placePassenger();
})();
