(() => {
  'use strict';

  const CONFIG = window.GC_FORM_CONFIG || {};
  const COMMON = CONFIG.common || {};
  const params = new URLSearchParams(location.search);
  const mode = params.get('mode');
  const isCall = mode === 'call';
  const isDriver = mode === 'driver';
  let enhanced = false;
  let sendPatched = false;

  COMMON['定位按鈕'] = '📍目前位置';
  COMMON['定位重新取得'] = '📍目前位置';
  COMMON['常用行程標題'] = '⭐常用行程';

  if (CONFIG.call) {
    Object.assign(CONFIG.call, {
      '備註標題': '備註資訊（選填）',
      '備註提示': '其他需要小編或司機留意的資訊',
      '行李標題': '行李數量（選填）',
      '行李提示': '例如：1個30吋、1個26吋',
      '寵物標題': '寵物同行（選填）',
      '訊息欄位_寵物': '寵物同行',
      '訊息欄位_行李': '行李數量',
      '訊息欄位_備註': '備註資訊',
      '表格提醒1': '下車地址與選填資訊未填時，不會顯示於聊天室。'
    });
  }
  if (CONFIG.driver) {
    Object.assign(CONFIG.driver, {
      '備註標題': '備註資訊（選填）',
      '備註提示': '例如：車型、車牌、車輛停放位置，或其他需留意事項',
      '訊息欄位_備註': '備註資訊',
      '表格提醒1': '送達地點與備註資訊皆為選填。'
    });
  }

  function value(id) {
    return String(document.getElementById(id)?.value || '').trim();
  }

  function petValue() {
    const selected = document.querySelector('input[name="graduationPet"]:checked')?.value;
    if (selected === 'caged') return '有（有籠）';
    if (selected === 'uncaged') return '有（無籠）';
    return '';
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

  function compactAddressActions() {
    const pickup = document.getElementById('pickup')?.closest('.address-field');
    const locationAction = document.getElementById('locationAction');
    const locationStatus = document.getElementById('locationStatus');
    if (pickup && locationAction) {
      locationAction.classList.add('field-inline-action');
      createLabelRow(pickup, locationAction);
      if (locationStatus) pickup.insertBefore(locationStatus, pickup.querySelector('.recent-address-control'));
    } else if (pickup) {
      createLabelRow(pickup, null);
    }

    const destination = document.getElementById('destination')?.closest('.address-field');
    const favoriteBox = document.getElementById('favoriteTripsBox');
    if (destination && favoriteBox && !document.getElementById('favoriteTripsToggle')) {
      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.id = 'favoriteTripsToggle';
      toggle.className = 'field-inline-btn favorite-toggle-btn';
      toggle.textContent = COMMON['常用行程標題'] || '⭐常用行程';
      toggle.setAttribute('aria-expanded', 'false');
      createLabelRow(destination, toggle);
      favoriteBox.classList.add('graduation-favorite-box');
      toggle.addEventListener('click', () => { favoriteBox.open = !favoriteBox.open; });
      favoriteBox.addEventListener('toggle', () => {
        toggle.setAttribute('aria-expanded', String(favoriteBox.open));
      });
    } else if (destination) {
      createLabelRow(destination, null);
    }
  }

  function injectCallFields() {
    if (!isCall || document.getElementById('graduationBaggage')) return;
    const notes = document.getElementById('notes')?.closest('.field');
    if (!notes) return;

    const pet = document.createElement('div');
    pet.className = 'field graduation-field';
    pet.innerHTML = `
      <div class="field-label">寵物同行（選填）</div>
      <div class="choice-row graduation-pet-row">
        <label class="choice"><input type="radio" name="graduationPet" value="none"><span>無</span></label>
        <label class="choice"><input type="radio" name="graduationPet" value="caged"><span>有籠</span></label>
        <label class="choice"><input type="radio" name="graduationPet" value="uncaged"><span>無籠</span></label>
      </div>`;

    const baggage = document.createElement('div');
    baggage.className = 'field graduation-field';
    baggage.innerHTML = `
      <label for="graduationBaggage">行李數量（選填）</label>
      <input class="input" id="graduationBaggage" type="text" placeholder="例如：1個30吋、1個26吋" autocomplete="off">`;

    notes.before(pet, baggage);
  }

  function patchConfirmation() {
    const overlay = document.getElementById('confirmOverlay');
    const summary = document.getElementById('confirmSummary');
    if (!overlay || !summary || overlay.classList.contains('hidden')) return;

    for (const row of [...summary.querySelectorAll('.confirm-row')]) {
      const label = row.querySelector('span')?.textContent.trim();
      const data = row.querySelector('strong')?.textContent.trim();
      if ((label === '下車地址' || label === '送達地點') && data === (COMMON['選填未填寫'] || '未填寫（選填）')) row.remove();
    }
    if (!isCall) return;

    summary.querySelectorAll('[data-graduation-row]').forEach(row => row.remove());
    const noteRow = [...summary.querySelectorAll('.confirm-row')].find(row => row.querySelector('span')?.textContent.trim() === '備註資訊');
    const anchor = noteRow || null;
    const rows = [];
    const pet = petValue();
    const baggage = value('graduationBaggage');
    if (pet) rows.push(['寵物同行', pet]);
    if (baggage) rows.push(['行李數量', baggage]);
    for (const [label, data] of rows) {
      const row = document.createElement('div');
      row.className = 'confirm-row';
      row.dataset.graduationRow = '1';
      const span = document.createElement('span');
      const strong = document.createElement('strong');
      span.textContent = label;
      strong.textContent = data;
      row.append(span, strong);
      summary.insertBefore(row, anchor);
    }
  }

  function transformMessage(text) {
    if (!isCall || !/^🚕 我要【(?:預約)?叫車】/.test(text)) return text;
    const cfg = CONFIG.call || {};
    const symbol = COMMON['訊息欄位符號'] || '•';
    const pet = petValue();
    const baggage = value('graduationBaggage');
    const additions = [];
    if (pet) additions.push(`${symbol} ${cfg['訊息欄位_寵物'] || '寵物同行'}：${pet}`);
    if (baggage) additions.push(`${symbol} ${cfg['訊息欄位_行李'] || '行李數量'}：${baggage}`);
    if (!additions.length) return text;

    const lines = String(text).split('\n').filter(line => !/^• (寵物同行|行李數量)：/.test(line));
    const noteLabel = cfg['訊息欄位_備註'] || '備註資訊';
    const noteIndex = lines.findIndex(line => line.startsWith(`${symbol} ${noteLabel}：`));
    lines.splice(noteIndex >= 0 ? noteIndex : lines.length, 0, ...additions);
    return lines.join('\n');
  }

  function installSendPatch() {
    if (sendPatched || !window.liff || typeof window.liff.sendMessages !== 'function') return false;
    const original = window.liff.sendMessages.bind(window.liff);
    window.liff.sendMessages = messages => original(messages.map(message => (
      message?.type === 'text' ? { ...message, text: transformMessage(message.text) } : message
    )));
    sendPatched = true;
    return true;
  }

  function enhance() {
    if (enhanced || !document.getElementById('serviceForm') || (!isCall && !isDriver)) return;
    enhanced = true;
    compactAddressActions();
    injectCallFields();
    const overlay = document.getElementById('confirmOverlay');
    if (overlay) new MutationObserver(patchConfirmation).observe(overlay, { attributes: true, attributeFilter: ['class'] });
    patchConfirmation();
  }

  const app = document.getElementById('app');
  if (app) new MutationObserver(enhance).observe(app, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', enhance, { once: true });

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    if (installSendPatch() || attempts > 400) clearInterval(timer);
  }, 50);
})();
