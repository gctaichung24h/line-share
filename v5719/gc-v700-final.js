(() => {
  'use strict';

  const params = new URLSearchParams(location.search);
  const mode = params.get('mode');
  const isCall = mode === 'call';
  const isDriver = mode === 'driver';
  const isFare = mode === 'fare';
  if (!isCall && !isDriver && !isFare) return;

  const CONFIG = window.GC_FORM_CONFIG || {};
  const COMMON = CONFIG.common || {};
  const VEHICLES = {
    suv: { label: '休旅車', fee: 0 },
    imported: { label: '進口車', fee: 200 },
    six: { label: '六人座', fee: 100 },
    seven: { label: '七人座', fee: 100 },
    nine: { label: '九人座', fee: 250 }
  };

  let applied = false;
  let sendPatched = false;

  const value = id => String(document.getElementById(id)?.value || '').trim();
  const selectedVehicle = () => VEHICLES[value('gcVehicle')] || null;
  const passengerCount = () => Number.parseInt(value('passengers'), 10) || 0;
  const passengerFee = () => passengerCount() >= 5 ? (passengerCount() - 4) * 50 : 0;
  const petRaw = () => document.querySelector('input[name="gcPet"]:checked')?.value || '';
  const petText = () => petRaw() === 'caged' ? '有（有籠）' : petRaw() === 'uncaged' ? '有（無籠）' : '';

  function fieldById(id) { return document.getElementById(id)?.closest('.field') || null; }
  function relabel(field, text) { const label = field?.querySelector(':scope > label'); if (label) label.textContent = text; }
  function removeFieldByInputName(name) { document.querySelector(`input[name="${name}"]`)?.closest('.field')?.remove(); }

  function makeLabelRow(field, action) {
    if (!field || field.querySelector(':scope > .field-label-row')) return;
    const label = field.querySelector(':scope > label');
    if (!label) return;
    const row = document.createElement('div');
    row.className = 'field-label-row';
    field.insertBefore(row, label);
    row.appendChild(label);
    if (action) row.appendChild(action);
  }

  function createFavoriteSheet(destination, favorite) {
    if (!destination || !favorite || document.getElementById('gcFavoriteSheet')) return;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = 'gcFavoriteToggle';
    toggle.className = 'field-inline-btn';
    toggle.textContent = '⭐常用行程';
    toggle.setAttribute('aria-expanded', 'false');
    makeLabelRow(destination, toggle);

    const sheet = document.createElement('div');
    sheet.id = 'gcFavoriteSheet';
    sheet.className = 'gc-sheet-overlay hidden';
    sheet.innerHTML = `<section class="gc-sheet" role="dialog" aria-modal="true" aria-label="常用行程">
      <div class="gc-sheet-handle"></div>
      <div class="gc-sheet-head"><strong>⭐ 常用行程</strong><button type="button" class="gc-sheet-close" aria-label="關閉">✕</button></div>
      <div class="gc-sheet-body"></div>
    </section>`;
    favorite.classList.add('gc-favorite-sheet-box');
    favorite.open = true;
    sheet.querySelector('.gc-sheet-body').appendChild(favorite);
    document.body.appendChild(sheet);

    const close = () => {
      sheet.classList.add('hidden');
      sheet.hidden = true;
      sheet.setAttribute('aria-hidden', 'true');
      sheet.style.setProperty('display', 'none', 'important');
      document.body.classList.remove('gc-sheet-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    const open = () => {
      const y = window.scrollY;
      const active = document.activeElement;
      if (active && ['INPUT','TEXTAREA','SELECT'].includes(active.tagName)) active.blur();
      const reveal = () => {
        favorite.open = true;
        window.scrollTo(0, y);
        sheet.hidden = false;
        sheet.removeAttribute('aria-hidden');
        sheet.style.removeProperty('display');
        sheet.classList.remove('hidden');
        document.body.classList.add('gc-sheet-open');
        toggle.setAttribute('aria-expanded', 'true');
      };
      setTimeout(reveal, 180);
      setTimeout(() => window.scrollTo(0, y), 300);
    };
    toggle.addEventListener('click', open);
    sheet.querySelector('.gc-sheet-close')?.addEventListener('click', close);
    sheet.addEventListener('click', event => { if (event.target === sheet) close(); });
    sheet.addEventListener('click', event => {
      // V8.1: capture 階段先關 Sheet，再讓儲存 Dialog 開啟，杜絕雙層視窗。
      if (event.target.closest('#favoriteSaveBtn')) close();
      if (event.target.closest('.favorite-use')) setTimeout(close, 0);
    }, true);

    const saveOverlay = document.getElementById('favoriteSaveOverlay');
    if (saveOverlay) {
      new MutationObserver(() => {
        if (!saveOverlay.classList.contains('hidden')) close();
      }).observe(saveOverlay, { attributes: true, attributeFilter: ['class'] });
    }
  }

  function compactAddressActions() {
    const pickup = document.getElementById('pickup')?.closest('.address-field');
    const locationAction = document.getElementById('locationAction');
    const locationStatus = document.getElementById('locationStatus');
    if (pickup) {
      pickup.classList.add('gc-primary-address', 'gc-pickup-address');
      if (locationAction) {
        locationAction.classList.add('field-inline-action');
        const button = locationAction.querySelector('.location-btn');
        if (button) button.textContent = '📍目前位置';
        makeLabelRow(pickup, locationAction);
        if (locationStatus) pickup.appendChild(locationStatus);
      } else makeLabelRow(pickup, null);
    }
    const destination = document.getElementById('destination')?.closest('.address-field');
    if (destination) destination.classList.add('gc-primary-address', 'gc-destination-address');
    createFavoriteSheet(destination, document.getElementById('favoriteTripsBox'));
  }

  function addVehicleField() {
    if (!isCall || document.getElementById('gcVehicle')) return;
    const pickup = fieldById('pickup');
    if (!pickup) return;
    const field = document.createElement('div');
    field.className = 'field gc-vehicle-field';
    field.innerHTML = `
      <label for="gcVehicle">指定車型（選填）</label>
      <select class="input gc-select" id="gcVehicle" name="gcVehicle">
        <option value="">不指定（隨機派車）</option>
        <option value="suv">休旅車</option>
        <option value="imported">進口車</option>
        <option value="six">六人座</option>
        <option value="seven">七人座</option>
        <option value="nine">九人座</option>
      </select>
      <details class="gc-info-disclosure">
        <summary>ⓘ 車型與加價說明</summary>
        <div class="gc-info-disclosure-body">
          <p><strong>僅指定車型｜品牌／車款隨機媒合。</strong></p>
          <p><strong>不指定最快｜指定可能影響媒合速度與成功率。</strong></p>
          <p>休旅車不加價｜進口車 +200｜六、七人座 +100｜九人座 +250。</p>
        </div>
      </details>
      <div id="gcVehicleNotice" class="gc-price-notice hidden" aria-live="polite"></div>`;
    pickup.before(field);
    const vehicleSelect = field.querySelector('select');
    const disclosure = field.querySelector('.gc-info-disclosure');
    const vehicleNotice = field.querySelector('#gcVehicleNotice');
    vehicleSelect?.addEventListener('change', () => {
      // V8: 切換車型時完整說明自動收起，只留該車型的精簡提示。
      if (disclosure) disclosure.open = false;
      updateNotices();
    });
    disclosure?.addEventListener('toggle', () => {
      // V8: 同一時間只顯示一個資訊區，避免兩張說明卡堆疊。
      if (vehicleNotice) {
        if (disclosure.open) vehicleNotice.classList.add('gc-v8-suppressed');
        else { vehicleNotice.classList.remove('gc-v8-suppressed'); updateNotices(); }
      }
    });
  }

  function replacePassengersAndExpose() {
    if (!isCall) return;
    const old = document.getElementById('passengers');
    if (!old) return;
    let select = old;
    if (old.tagName !== 'SELECT') {
      select = document.createElement('select');
      select.id = 'passengers';
      select.name = 'passengers';
      select.className = `${old.className || 'input'} gc-select`;
      select.innerHTML = '<option value="">請選擇實際乘客人數</option>' +
        Array.from({ length: 8 }, (_, i) => `<option value="${i + 1}人">${i + 1}人</option>`).join('');
      old.replaceWith(select);
    }
    const field = select.closest('.field');
    relabel(field, '搭乘人數（選填）');
    if (!document.getElementById('gcPeopleNotice')) {
      const notice = document.createElement('div');
      notice.id = 'gcPeopleNotice';
      notice.className = 'gc-price-notice hidden';
      field?.appendChild(notice);
    }
    select.addEventListener('change', updateNotices);

    const destination = fieldById('destination');
    if (field && destination && field.previousElementSibling !== destination) destination.after(field);
  }

  function addPetField(anchor) {
    if (!isCall || document.getElementById('gcPetField') || !anchor) return;
    const field = document.createElement('div');
    field.className = 'field';
    field.id = 'gcPetField';
    field.innerHTML = `<div class="field-label">寵物同行（選填）</div>
      <div class="choice-row gc-pet-row">
        <label class="choice"><input type="radio" name="gcPet" value="none"><span>無</span></label>
        <label class="choice"><input type="radio" name="gcPet" value="caged"><span>有籠</span></label>
        <label class="choice"><input type="radio" name="gcPet" value="uncaged"><span>無籠</span></label>
      </div><div id="gcPetNotice" class="gc-price-notice hidden"></div>`;
    anchor.before(field);
    field.querySelectorAll('input').forEach(input => input.addEventListener('change', updateNotices));
  }

  function forcePassengerPublicPosition() {
    if (!isCall) return;
    const passenger = fieldById('passengers');
    const destination = fieldById('destination');
    if (!passenger || !destination) return;
    passenger.classList.add('gc-passenger-public');
    if (passenger.parentElement?.classList.contains('optional-content')) {
      destination.after(passenger);
    } else if (destination.nextElementSibling !== passenger) {
      destination.after(passenger);
    }
  }

  function restructureCallDetails() {
    const form = document.getElementById('serviceForm');
    if (!form) return;
    const details = [...form.querySelectorAll('details.optional-box')].find(d => d.id !== 'favoriteTripsBox');
    const baggage = fieldById('baggage');
    const requirements = fieldById('requirements');
    const notes = fieldById('notes');
    requirements?.remove();
    if (!details) return;
    details.classList.add('gc-secondary-box');
    const summary = details.querySelector('summary');
    const content = details.querySelector('.optional-content');
    if (summary) summary.textContent = '其他需求（選填）';
    if (baggage) {
      relabel(baggage, '行李數量（選填）');
      baggage.querySelector('input')?.setAttribute('placeholder', '例如：1個30吋、1個26吋');
    }
    if (notes) {
      relabel(notes, '備註資訊（選填）');
      notes.querySelector('textarea')?.setAttribute('placeholder', '其他需要小編或司機留意的資訊');
    }
    addPetField(baggage || notes);
    const pet = document.getElementById('gcPetField');
    [pet, baggage, notes].forEach(field => { if (field && content && field.parentNode !== content) content.appendChild(field); });
  }

  function restructureDriver() {
    const form = document.getElementById('serviceForm');
    if (!form) return;
    fieldById('vehicle')?.remove();
    fieldById('parking')?.remove();
    const details = [...form.querySelectorAll('details.optional-box')].find(d => d.id !== 'favoriteTripsBox');
    const notes = fieldById('notes');
    if (details) {
      details.classList.add('gc-secondary-box');
      const summary = details.querySelector('summary');
      if (summary) summary.textContent = '備註資訊（選填）';
      if (notes) {
        const innerLabel = notes.querySelector(':scope > label, :scope > .field-label');
        if (innerLabel) innerLabel.remove();
        notes.classList.add('gc-driver-note-field');
      }
    }
  }

  function updateNotices() {
    const v = selectedVehicle();
    const vf = v?.fee || 0;
    const pf = passengerFee();
    const vn = document.getElementById('gcVehicleNotice');
    const pn = document.getElementById('gcPeopleNotice');
    const petn = document.getElementById('gcPetNotice');
    const feeBase = Math.max(vf, pf);

    if (vn) {
      let lines = [];
      if (v) {
        lines.push('<span class="gc-notice-kicker">媒合提醒</span><strong>指定車型可能影響媒合速度與成功率。</strong>');
        lines.push(vf > 0 ? `<span class="gc-fee-line">加價資訊 <b>${v.label} +NT$${vf}</b></span>` : '<span class="gc-fee-line">加價資訊 <b>休旅車不加價</b></span>');
      }
      vn.innerHTML = lines.map(line => `<p>${line}</p>`).join('');
      vn.classList.toggle('hidden', lines.length === 0);
    }
    if (pn) {
      const lines = [];
      if (pf > 0) lines.push(`<span class="gc-fee-line">加價資訊 <b>${passengerCount()}位乘客 +NT$${pf}</b></span>`);
      if (vf > 0 && pf > 0) lines.push('<span class="gc-fee-rule">車型與人數加價取較高者，不重複累加。</span>');
      pn.innerHTML = lines.map(line => `<p>${line}</p>`).join('');
      pn.classList.toggle('hidden', lines.length === 0);
    }
    if (petn) {
      const show = petRaw() === 'uncaged';
      petn.innerHTML = show ? '<p><span class="gc-fee-line">加價資訊 <b>無籠寵物 +NT$50</b></span></p>' : '';
      petn.classList.toggle('hidden', !show);
    }
  }

  function cleanConfirmation() {
    const overlay = document.getElementById('confirmOverlay');
    const summary = document.getElementById('confirmSummary');
    if (!overlay || !summary || overlay.classList.contains('hidden')) return;
    const removeLabels = ['跨縣市方向', '行程方向', '車輛資訊', '車輛停放位置', '乘車需求', '補充資訊'];
    [...summary.querySelectorAll('.confirm-row')].forEach(row => {
      const label = row.querySelector('span')?.textContent.trim();
      const data = row.querySelector('strong')?.textContent.trim();
      if (removeLabels.includes(label) || ((label === '下車地址' || label === '送達地點') && /^未填寫/.test(data || ''))) row.remove();
    });
    if (!isCall) return;
    summary.querySelectorAll('[data-gc-v7-extra]').forEach(row => row.remove());
    const serviceRow = [...summary.querySelectorAll('.confirm-row')].find(row => row.querySelector('span')?.textContent.trim() === '服務類型');
    const noteRow = [...summary.querySelectorAll('.confirm-row')].find(row => row.querySelector('span')?.textContent.trim() === '備註資訊');
    const addRow = (label, text, afterService = false) => {
      if (!text) return;
      const row = document.createElement('div');
      row.className = 'confirm-row';
      row.dataset.gcV7Extra = '1';
      row.innerHTML = `<span>${label}</span><strong>${text}</strong>`;
      if (afterService && serviceRow) serviceRow.after(row); else summary.insertBefore(row, noteRow || null);
    };
    addRow('指定車型', selectedVehicle()?.label || '', true);
    addRow('寵物同行', petText());

    const vehicleFee = selectedVehicle()?.fee || 0;
    const peopleFee = passengerFee();
    const petFee = petRaw() === 'uncaged' ? 50 : 0;
    const extraTotal = Math.max(vehicleFee, peopleFee) + petFee;
    {
      const row = document.createElement('div');
      row.className = 'confirm-row gc-confirm-extra-total';
      row.dataset.gcV7Extra = '1';
      row.innerHTML = `<span>除車資外，另加收費用</span><strong>NT$${extraTotal}</strong>`;
      summary.appendChild(row);
    }
  }

  function transformMessage(text) {
    let lines = String(text).split('\n').filter(line => !/[•・]\s*(跨縣市方向|行程方向|車輛資訊|車輛停放位置|乘車需求|補充資訊)\s*：/.test(line));
    if (isDriver || isFare) return lines.join('\n');
    if (!isCall || !/^🚕 我要【(?:預約)?叫車】/.test(lines[0] || '')) return lines.join('\n');
    lines = lines.filter(line => !/[•・]\s*(指定車型|寵物同行)\s*：/.test(line));
    const symbol = COMMON['訊息欄位符號'] || '•';
    const serviceIndex = lines.findIndex(line => /[•・]\s*服務類型：/.test(line));
    if (selectedVehicle()) lines.splice(serviceIndex >= 0 ? serviceIndex + 1 : 2, 0, `${symbol} 指定車型：🈯️${selectedVehicle().label}`);
    if (petText()) {
      let noteIndex = lines.findIndex(line => /[•・]\s*備註資訊：/.test(line));
      if (noteIndex < 0) noteIndex = lines.length;
      lines.splice(noteIndex, 0, `${symbol} 寵物同行：${petText()}`);
    }
    return lines.join('\n');
  }

  function patchSend() {
    if (sendPatched || !window.liff || typeof window.liff.sendMessages !== 'function') return false;
    const original = window.liff.sendMessages.bind(window.liff);
    window.liff.sendMessages = messages => original(messages.map(message => message?.type === 'text' ? { ...message, text: transformMessage(message.text) } : message));
    sendPatched = true;
    return true;
  }

  function applyOnce() {
    const form = document.getElementById('serviceForm');
    if (!form || applied) return false;
    applied = true;
    compactAddressActions();
    removeFieldByInputName('direction');
    if (isCall) {
      addVehicleField();
      replacePassengersAndExpose();
      restructureCallDetails();
      forcePassengerPublicPosition();
      updateNotices();
      setTimeout(forcePassengerPublicPosition, 0);
      setTimeout(forcePassengerPublicPosition, 160);
    } else if (isDriver) {
      restructureDriver();
    } else if (isFare) {
      [...form.querySelectorAll('details.optional-box')].filter(d => d.id !== 'favoriteTripsBox').forEach(d => d.remove());
    }
    const overlay = document.getElementById('confirmOverlay');
    if (overlay) new MutationObserver(cleanConfirmation).observe(overlay, { attributes: true, attributeFilter: ['class'] });
    cleanConfirmation();
    return true;
  }

  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    applyOnce();
    patchSend();
    if ((applied && (sendPatched || new URLSearchParams(location.search).get('preview') === '1')) || tries >= 400) clearInterval(timer);
  }, 50);
})();
