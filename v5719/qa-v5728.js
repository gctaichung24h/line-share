(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  if (params.get('mode') !== 'call') return;

  let boundSource = null;
  let observer = null;

  function ensurePassengerNotice() {
    const passengers = document.getElementById('passengers');
    const field = passengers?.closest('.field');
    if (!passengers || !field) return null;

    let notice = document.getElementById('graduationPassengerNotice');
    if (notice) return notice;

    notice = document.createElement('div');
    notice.id = 'graduationPassengerNotice';
    notice.className = 'graduation-price-notice hidden';
    notice.setAttribute('aria-live', 'polite');

    const childSeatNote = field.querySelector('.graduation-child-seat-note');
    if (childSeatNote) {
      field.insertBefore(notice, childSeatNote);
    } else {
      field.appendChild(notice);
    }
    return notice;
  }

  function syncNotices() {
    const source = document.getElementById('graduationVehiclePassengerNotice');
    const passengerNotice = ensurePassengerNotice();
    if (!source || !passengerNotice) return;

    const paragraphs = [...source.querySelectorAll('p')];
    const passengerMessages = [];
    let vehicleMessageCount = 0;

    paragraphs.forEach(paragraph => {
      const text = paragraph.textContent.trim();
      const isPassengerFee = /位乘客需額外加價/.test(text);
      const isSharedRule = text.startsWith('車型與人數加價取較高者');

      paragraph.hidden = isPassengerFee;
      if (!isPassengerFee) vehicleMessageCount += 1;
      if (isPassengerFee || isSharedRule) passengerMessages.push(text);
    });

    passengerNotice.innerHTML = passengerMessages.map(text => {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      return paragraph.outerHTML;
    }).join('');

    passengerNotice.classList.toggle('hidden', passengerMessages.length === 0);
    source.classList.toggle('hidden', vehicleMessageCount === 0);
  }

  function bind() {
    const source = document.getElementById('graduationVehiclePassengerNotice');
    const passengers = document.getElementById('passengers');
    if (!source || !passengers) return;

    ensurePassengerNotice();
    if (boundSource !== source) {
      observer?.disconnect();
      observer = new MutationObserver(syncNotices);
      observer.observe(source, { childList: true, subtree: true });
      boundSource = source;
    }

    passengers.addEventListener('change', () => setTimeout(syncNotices, 0), { once: false });
    syncNotices();
  }

  const app = document.getElementById('app');
  if (app) new MutationObserver(bind).observe(app, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', bind, { once: true });

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    bind();
    if (boundSource || attempts > 400) clearInterval(timer);
  }, 50);
})();
