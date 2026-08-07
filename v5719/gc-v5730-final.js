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

  function fieldById(id) {
    return document.getElementById(id)?.closest('.field') || null;
  }

  function relabel(field, text) {
    const label = field?.querySelector(':scope > label');
    if (label) label.textContent = text;
  }

  function removeFieldByInputName(name) {
    document.querySelector(`input[name="${name}"]`)?.closest('.field')?.remove();
  }

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

  function compactAddressActions() {
    const pickup = document.getElementById('pickup')?.closest('.address-field');
    const locationAction = document.getElementById('locationAction');
    const locationStatus = document.getElementById('locationStatus');
    if (pickup) {
      if (locationAction) {
        locationAction.classList.add('field-inline-action');
        const button = locationAction.querySelector('.location-btn');
        if (button) button.textContent = '📍目前位置';
        makeLabelRow(pickup, locationAction);
        if (locationStatus) pickup.appendChild(locationStatus);
      } else {
        makeLabelRow(pickup, null);
      }
    }

    const destination = document.getElementById('destination')?.closest('.address-field');
    const favorite = document.getElementById('favoriteTripsBox');
    if (destination && favorite) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'field-inline-btn';
      toggle.textContent = '⭐常用行程';
      toggle.setAttribute('aria-expanded', 'false');
      favorite.classList.add('graduation-favorite-box');
      favorite.open = false;
      toggle.addEventListener('click', () => {
        favorite.open = !favorite.open;
        toggle.setAttribute('aria-expanded', String(favorite.open));
      });
      makeLabelRow(destination, toggle);
    } else if (destination) {
      makeLabelRow(destination, null);
    }
  }

  function addVehicleField() {
    if (!isCall || document.getElementById('gcVehicle')) return;
    const pickup = fieldById('pickup');
    if (!pickup) return;
    const field = document.createElement('div');
    field.className = 'field graduation-vehicle-field';
    field.innerHTML = `
      <label for="gcVehicle">指定車型（選填）</label>
      <select class="input" id="gcVehicle" name="gcVehicle">
        <option value="">不指定（隨機派車）</option>
        <option value="suv">休旅車</option>
        <option value="imported">進口車</option>
        <option value="six">六人座</option>
        <option value="seven">七人座</option>
        <option value="nine">九人座</option>
      </select>
      <div class="graduation-field-help">未指定則隨機派車，無法挑選品牌或車款。指定車型需依現場車況媒合，可能延長等候時間或降低媒合成功率。</div>
      <div id="gcVehicleNotice" class="graduation-price-notice hidden" aria-live="polite"></div>`;
    pickup.before(field);
    field.querySelector('select').addEventListener('change', updateNotices);
  }

  function replacePassengers() {
    if (!isCall) return;
    const old = document.getElementById('passengers');
    if (!old) return;
    const field = old.closest('.field');
    if (old.tagName !== 'SELECT') {
      const select = document.createElement('select');
      select.id = 'passengers';
      select.name = 'passengers';
      select.className = old.className || 'input';
      select.innerHTML = '<option value="">請選擇實際乘客人數</option>' + Array.from({ length: 8 }, (_, i) => `<option value="${i + 1}人">${i + 1}人</option>`).join('');
      old.replaceWith(select);
      select.addEventListener('change', updateNotices);
    }
    relabel(field, '搭乘人數（選填）');
    if (!document.getElementById('gcPeopleNotice')) {
      const notice = document.createElement('div');
      notice.id = 'gcPeopleNotice';
      notice.className = 'graduation-price-notice hidden';
      const info = document.createElement('div');
      info.className = 'graduation-child-seat-note';
      info.textContent = '嬰幼兒仍請計入實際乘客人數，並於備註填寫年齡。安全座椅屬個人物品，本車隊不提供，如有疑問請先詢問小編。';
      field.append(notice, info);
    }
  }

  function addPetField(anchor) {
    if (!isCall || document.getElementById('gcPetField') || !anchor) return;
    const field = document.createElement('div');
    field.className = 'field';
    field.id = 'gcPetField';
    field.innerHTML = `
      <div class="field-label">寵物同行（選填）</div>
      <div class="choice-row graduation-pet-row">
        <label class="choice"><input type="radio" name="gcPet" value="none"><span>無</span></label>
        <label class="choice"><input type="radio" name="gcPet" value="caged"><span>有籠</span></label>
        <label class="choice"><input type="radio" name="gcPet" value="uncaged"><span>無籠</span></label>
      </div>
      <div id="gcPetNotice" class="graduation-price-notice hidden"></div>`;
    anchor.before(field);
    field.querySelectorAll('input').forEach(input => input.addEventListener('change', updateNotices));
  }

  function flattenCallDetails() {
    const form = document.getElementById('serviceForm');
    if (!form) return;
    const details = [...form.querySelectorAll('details.optional-box')].find(d => d.id !== 'favoriteTripsBox');
    const baggage = fieldById('baggage');
    const requirements = fieldById('requirements');
    const notes = fieldById('notes');
    requirements?.remove();
    if (details) {
      if (baggage) {
        relabel(baggage, '行李數量（選填）');
        baggage.querySelector('input')?.setAttribute('placeholder', '例如：1個30吋、1個26吋');
        details.before(baggage);
      }
      if (notes) {
        relabel(notes, '備註資訊（選填）');
        notes.querySelector('textarea')?.setAttribute('placeholder', '其他需要小編或司機留意的資訊');
        details.before(notes);
      }
      details.remove();
    }
    addPetField(fieldById('baggage') || fieldById('notes'));
  }

  function flattenDriverDetails() {
    const form = document.getElementById('serviceForm');
    if (!form) return;
    const details = [...form.querySelectorAll('details.optional-box')].find(d => d.id !== 'favoriteTripsBox');
    fieldById('vehicle')?.remove();
    fieldById('parking')?.remove();
    const notes = fieldById('notes');
    if (details) {
      if (notes) {
        relabel(notes, '備註資訊（選填）');
        notes.querySelector('textarea')?.setAttribute('placeholder', '例如：車型、車牌、車輛停放位置，或其他需留意事項');
        details.before(notes);
      }
      details.remove();
    }
  }

  function updateNotices() {
    const vehicle = selectedVehicle();
    const vf = vehicle?.fee || 0;
    const pf = passengerFee();
    const vehicleNotice = document.getElementById('gcVehicleNotice');
    const peopleNotice = document.getElementById('gcPeopleNotice');
    const petNotice = document.getElementById('gcPetNotice');

    if (vehicleNotice) {
      let text = '';
      if (vehicle) text = vf > 0 ? `指定${vehicle.label}需額外加價 NT$${vf}。` : '指定休旅車不加價，仍須依現場車況媒合。';
      vehicleNotice.textContent = text;
      vehicleNotice.classList.toggle('hidden', !text);
    }

    if (peopleNotice) {
      const lines = [];
      if (pf > 0) lines.push(`${passengerCount()}位乘客需額外加價 NT$${pf}。`);
      if (vf > 0 && pf > 0) lines.push(`車型與人數加價取較高者，本次為 NT$${Math.max(vf, pf)}，不重複累加。`);
      peopleNotice.innerHTML = lines.map(line => `<p>${line}</p>`).join('');
      peopleNotice.classList.toggle('hidden', lines.length === 0);
    }

    if (petNotice) {
      const text = petRaw() === 'uncaged' ? '寵物無籠需額外加價 NT$50。' : '';
      petNotice.textContent = text;
      petNotice.classList.toggle('hidden', !text);
    }
  }

  function patchConfirmation() {
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
    summary.querySelectorAll('[data-gc-v5730]').forEach(row => row.remove());
    const serviceRow = [...summary.querySelectorAll('.confirm-row')].find(row => row.querySelector('span')?.textContent.trim() === '服務類型');
    const noteRow = [...summary.querySelectorAll('.confirm-row')].find(row => row.querySelector('span')?.textContent.trim() === '備註資訊');

    const addRow = (label, text, afterService = false) => {
      if (!text) return;
      const row = document.createElement('div');
      row.className = 'confirm-row';
      row.dataset.gcV5730 = '1';
      const span = document.createElement('span');
      const strong = document.createElement('strong');
      span.textContent = label;
      strong.textContent = text;
      row.append(span, strong);
      if (afterService && serviceRow) serviceRow.after(row);
      else summary.insertBefore(row, noteRow || null);
    };

    addRow('指定車型', selectedVehicle()?.label || '', true);
    addRow('寵物同行', petText());
  }

  function transformMessage(text) {
    let lines = String(text).split('\n');
    lines = lines.filter(line => !/[•・]\s*(跨縣市方向|行程方向|車輛資訊|車輛停放位置|乘車需求|補充資訊)\s*：/.test(line));

    if (isDriver || isFare) return lines.join('\n');
    if (!isCall || !/^🚕 我要【(?:預約)?叫車】/.test(lines[0] || '')) return lines.join('\n');

    lines = lines.filter(line => !/[•・]\s*(指定車型|寵物同行)\s*：/.test(line));
    const symbol = COMMON['訊息欄位符號'] || '•';
    const serviceIndex = lines.findIndex(line => /[•・]\s*服務類型：/.test(line));
    const vehicle = selectedVehicle();
    if (vehicle) lines.splice(serviceIndex >= 0 ? serviceIndex + 1 : 2, 0, `${symbol} 指定車型：🈯️${vehicle.label}`);
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
    window.liff.sendMessages = messages => original(messages.map(message => (
      message?.type === 'text' ? { ...message, text: transformMessage(message.text) } : message
    )));
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
      replacePassengers();
      flattenCallDetails();
      updateNotices();
    } else if (isDriver) {
      flattenDriverDetails();
    } else if (isFare) {
      [...form.querySelectorAll('details.optional-box')].filter(d => d.id !== 'favoriteTripsBox').forEach(d => d.remove());
    }

    const overlay = document.getElementById('confirmOverlay');
    if (overlay) new MutationObserver(patchConfirmation).observe(overlay, { attributes: true, attributeFilter: ['class'] });
    patchConfirmation();
    return true;
  }

  let tries = 0;
  const timer = setInterval(() => {
    tries += 1;
    applyOnce();
    patchSend();
    if ((applied && sendPatched) || tries >= 400) clearInterval(timer);
  }, 50);
})();