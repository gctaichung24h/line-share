(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  if (params.get('mode') !== 'call') return;

  function decorateText(text) {
    return String(text).replace(/([•・]\s*指定車型：)(?!🈯️)/g, '$1🈯️');
  }

  function install() {
    if (!window.liff || typeof window.liff.sendMessages !== 'function') return;
    const current = window.liff.sendMessages;
    if (current.__gcV5729VehicleMarker === true) return;

    const original = current.bind(window.liff);
    const wrapped = messages => original(messages.map(message => (
      message?.type === 'text'
        ? { ...message, text: decorateText(message.text) }
        : message
    )));

    Object.defineProperty(wrapped, '__gcV5729VehicleMarker', {
      value: true,
      configurable: false,
      enumerable: false,
      writable: false
    });
    window.liff.sendMessages = wrapped;
  }

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    install();
    if (attempts >= 400) clearInterval(timer);
  }, 50);
})();
