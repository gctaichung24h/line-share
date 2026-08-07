/* GC_V5732_UI_GRADUATION */
(() => {
  'use strict';

  const CONFIG = window.GC_FORM_CONFIG || {};
  const COMMON = CONFIG.common || {};
  const params = new URLSearchParams(location.search);
  const mode = params.get('mode');
  const isCall = mode === 'call';
  const isDriver = mode === 'driver';
  const isFare = mode === 'fare';
  let enhanced = false;
  let sendPatched = false;

  const VEHICLES = {
    suv: { label: '休旅車', fee: 0 },
    imported: { label: '進口車', fee: 200 },
    six: { label: '六人座', fee: 100 },
    seven: { label: '七人座', fee: 100 },
    nine: { label: '九人座', fee: 250 }
  };

  const value = id => String(document.getElementById(id)?.value || '').trim();
  const selectedVehicle = () => VEHICLES[value('gcVehicle')] || null;
  const passengerCount = () => Number.parseInt(value('passengers'), 10) || 0;
  const passengerFee = () => passengerCount() >= 5 ? (passengerCount() - 4) * 50 : 0;
  const petRaw = () => document.querySelector('input[name="gcPet"]:checked')?.value || '';
  const petText = () => petRaw() === 'caged' ? '有（有籠）' : petRaw() === 'uncaged' ? '有（無籠）' : '';

  function fieldById(id) { return document.getElementById(id)?.closest('.field'); }

  function relabel(field, text) {
    const label = field?.querySelector(':scope > label');
    if (label) label.textContent = text;
  }

  function createLabelRow(field, action) {
    if (!field || field.querySelector(':scope > .field-label-row')) return;
    const label = field.querySelector(':scope > label');
    if (!label) return;
    const row = document.createElement('div');
    row.className = 'field-label-row';
    field.insertBefore(row, label);
    row.appendChild(label);
    if (action) row.appendChild(action);
  }

  function compactActions() {
    const pickup = document.getElementById('pickup')?.closest('.address-field');
    const loc = document.getElementById('locationAction');
    const status = document.getElementById('locationStatus');
    if (pickup && loc) {
      loc.classList.add('field-inline-action');
      createLabelRow(pickup, loc);
      if (status) pickup.insertBefore(status, pickup.querySelector('.recent-address-control'));
    } else createLabelRow(pickup, null);

    const destination = document.getElementById('destination')?.closest('.address-field');
    const favorite = document.getElementById('favoriteTripsBox');
    if (destination && favorite && !document.getElementById('gcFavoriteToggle')) {
      const button = document.createElement('button');
      button.type = 'button';
      button.id = 'gcFavoriteToggle';
      button.className = 'field-inline-btn';
      button.textContent = '⭐常用行程';
      createLabelRow(destination, button);
      favorite.classList.add('graduation-favorite-box');
      button.addEventListener('click', () => { favorite.open = !favorite.open; });
    } else createLabelRow(destination, null);
  }

  function removeDirection() {
    document.querySelector('input[name="direction"]')?.closest('.field')?.remove();
  }

  function addVehicleField() {
    if (!isCall || document.getElementById('gcVehicle')) return;
    const pickupField = fieldById('pickup');
    if (!pickupField) return;
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
          <p>不指定最快；指定車型可能增加等候時間，並影響媒合成功率。</p>
          <p>休旅車不加價｜進口車 +200｜六、七人座 +100｜九人座 +250。</p>
        </div>
      </details>
      <div id="gcVehicleNotice" class="gc-price-notice hidden" aria-live="polite"></div>`;
    pickupField.before(field);
    field.querySelector('select')?.addEventListener('change', updateNotices);
  }

  function replacePassengers() {
    if (!isCall) return;
    const current = document.getElementById('passengers');
    if (!current || current.tagName === 'SELECT') return;
    const select = document.createElement('select');
    select.id = 'passengers';
    select.name = 'passengers';
    select.className = current.className || 'input';
    select.innerHTML = '<option value="">請選擇實際乘客人數</option>' +
      Array.from({length: 9}, (_, i) => `<option value="${i + 1}人">${i + 1}人</option>`).join('');
    current.replaceWith(select);
    const field = select.closest('.field');
    relabel(field, '搭乘人數（選填）');
    const notice = document.createElement('div');
    notice.id = 'gcPeopleNotice';
    notice.className = 'gc-price-notice hidden';
    field?.append(notice);
    select.addEventListener('change', updateNotices);
  }

  function addPetField(anchor) {
    if (!isCall || document.getElementById('gcPetField') || !anchor) return;
    const field = document.createElement('div');
    field.className = 'field';
    field.id = 'gcPetField';
    field.innerHTML = `
      <div class="field-label">寵物同行（選填）</div>
      <div class="choice-row gc-pet-row">
        <label class="choice"><input type="radio" name="gcPet" value="none"><span>無</span></label>
        <label class="choice"><input type="radio" name="gcPet" value="caged"><span>有籠</span></label>
        <label class="choice"><input type="radio" name="gcPet" value="uncaged"><span>無籠</span></label>
      </div>
      <div id="gcPetNotice" class="gc-price-notice hidden" aria-live="polite"></div>`;
    anchor.before(field);
    field.querySelectorAll('input').forEach(input => input.addEventListener('change', updateNotices));
  }

  function updateNotices() {
    const vehicle = selectedVehicle();
    const vehicleFee = vehicle?.fee || 0;
    const people = passengerFee();
    const vehicleNotice = document.getElementById('gcVehicleNotice');
    const peopleNotice = document.getElementById('gcPeopleNotice');
    const petNotice = document.getElementById('gcPetNotice');

    if (vehicleNotice) {
      let text = '';
      if (vehicle) text = vehicleFee > 0
        ? `${vehicle.label}加價 NT$${vehicleFee}。`
        : '休旅車不加價。';
      vehicleNotice.textContent = text;
      vehicleNotice.classList.toggle('hidden', !text);
    }

    if (peopleNotice) {
      const lines = [];
      if (people > 0) lines.push(`${passengerCount()}人加價 NT$${people}。`);
      if (vehicleFee > 0 && people > 0) {
        lines.push(`車型與人數加價取較高者，本次為 NT$${Math.max(vehicleFee, people)}，不重複累加。`);
      }
      peopleNotice.innerHTML = lines.map(text => `<p>${text}</p>`).join('');
      peopleNotice.classList.toggle('hidden', lines.length === 0);
    }

    if (petNotice) {
      const text = petRaw() === 'uncaged' ? '無籠寵物加價 NT$50。' : '';
      petNotice.textContent = text;
      petNotice.classList.toggle('hidden', !text);
    }
  }

  function restructureCall() {
    addVehicleField();
    replacePassengers();
    const form = document.getElementById('serviceForm');
    const oldDetails = form?.querySelector('details.optional-box');
    const passengers = fieldById('passengers');
    const baggage = fieldById('baggage');
    const requirements = fieldById('requirements');
    const notes = fieldById('notes');

    requirements?.remove();
    if (baggage) {
      relabel(baggage, '行李數量（選填）');
      baggage.querySelector('input')?.setAttribute('placeholder', '例如：1個30吋、1個26吋');
    }
    if (notes) relabel(notes, '備註資訊（選填）');

    addPetField(baggage || notes);
    const pet = document.getElementById('gcPetField');

    let secondary = document.getElementById('gcSecondaryDetails');
    if (!secondary) {
      secondary = document.createElement('details');
      secondary.id = 'gcSecondaryDetails';
      secondary.className = 'optional-box gc-secondary-box';
      secondary.innerHTML = '<summary>其他需求（選填）</summary><div class="optional-content gc-secondary-content"></div>';
      const destinationField = fieldById('destination');
      const favorite = document.getElementById('favoriteTripsBox');
      (favorite || destinationField)?.after(secondary);
    }
    const content = secondary.querySelector('.gc-secondary-content');
    [passengers, pet, baggage, notes].forEach(field => { if (field && content && field.parentNode !== content) content.appendChild(field); });
    oldDetails?.remove();
    updateNotices();
  }

  function restructureDriver() {
    const form = document.getElementById('serviceForm');
    const details = form?.querySelector('details.optional-box');
    fieldById('vehicle')?.remove();
    fieldById('parking')?.remove();
    const notes = fieldById('notes');
    if (notes) relabel(notes, '備註資訊（選填）');
    if (details && notes) {
      details.querySelector('summary').textContent = '備註資訊（選填）';
      const content = details.querySelector('.optional-content');
      if (content && notes.parentNode !== content) content.appendChild(notes);
    }
  }

  function restructureFare() {
    document.getElementById('serviceForm')?.querySelector('details.optional-box')?.remove();
  }

  function cleanConfirmation() {
    const overlay = document.getElementById('confirmOverlay');
    const summary = document.getElementById('confirmSummary');
    if (!overlay || !summary || overlay.classList.contains('hidden')) return;

    const removeLabels = ['行程方向', '車輛資訊', '車輛停放位置', '乘車需求', '補充資訊'];
    [...summary.querySelectorAll('.confirm-row')].forEach(row => {
      const label = row.querySelector('span')?.textContent.trim();
      const data = row.querySelector('strong')?.textContent.trim();
      if (removeLabels.includes(label) || ((label === '下車地址' || label === '送達地點') && /^未填寫/.test(data || ''))) row.remove();
    });

    if (!isCall) return;
    summary.querySelectorAll('[data-gc-extra]').forEach(el => el.remove());
    const serviceRow = [...summary.querySelectorAll('.confirm-row')]
      .find(row => row.querySelector('span')?.textContent.trim() === '服務類型');
    const extras = [];
    if (selectedVehicle()) extras.push(['指定車型', selectedVehicle().label]);
    if (petText()) extras.push(['寵物同行', petText()]);
    for (const [label, data] of extras) {
      const row = document.createElement('div');
      row.className = 'confirm-row';
      row.dataset.gcExtra = '1';
      row.innerHTML = `<span>${label}</span><strong>${data}</strong>`;
      if (label === '指定車型' && serviceRow?.nextSibling) summary.insertBefore(row, serviceRow.nextSibling);
      else {
        const note = [...summary.querySelectorAll('.confirm-row')]
          .find(x => x.querySelector('span')?.textContent.trim() === '備註資訊');
        summary.insertBefore(row, note || null);
      }
    }
  }

  function stripLine(line) {
    return /[•・]\s*(行程方向|車輛資訊|車輛停放位置|乘車需求|補充資訊)\s*：/.test(line);
  }

  function transformMessage(text) {
    let lines = String(text).split('\n').filter(line => !stripLine(line));
    if (isFare || isDriver || !isCall) return lines.join('\n');
    if (!/^🚕 我要【(?:預約)?叫車】/.test(lines[0] || '')) return lines.join('\n');

    lines = lines.filter(line => !/[•・]\s*(指定車型|寵物同行)\s*：/.test(line));
    const symbol = COMMON['訊息欄位符號'] || '•';
    const serviceIndex = lines.findIndex(line => /[•・]\s*服務類型：/.test(line));
    if (selectedVehicle()) {
      lines.splice(serviceIndex >= 0 ? serviceIndex + 1 : 2, 0, `${symbol} 指定車型：🈯️${selectedVehicle().label}`);
    }
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
    window.liff.sendMessages = messages => original(messages.map(message =>
      message?.type === 'text' ? { ...message, text: transformMessage(message.text) } : message
    ));
    sendPatched = true;
    return true;
  }

  function enhance() {
    if (!document.getElementById('serviceForm')) return;
    compactActions();
    removeDirection();
    if (isCall) restructureCall();
    else if (isDriver) restructureDriver();
    else if (isFare) restructureFare();

    if (!enhanced) {
      enhanced = true;
      const overlay = document.getElementById('confirmOverlay');
      if (overlay) new MutationObserver(cleanConfirmation).observe(overlay, { attributes: true, attributeFilter: ['class'] });
    }
    cleanConfirmation();
  }

  const app = document.getElementById('app');
  if (app) new MutationObserver(enhance).observe(app, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', enhance, { once: true });

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    enhance();
    if (patchSend() || attempts > 400) clearInterval(timer);
  }, 50);
})();
