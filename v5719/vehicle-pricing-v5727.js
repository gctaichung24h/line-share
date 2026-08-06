(() => {
  'use strict';

  const CONFIG = window.GC_FORM_CONFIG || {};
  const COMMON = CONFIG.common || {};
  const params = new URLSearchParams(location.search);
  const isCall = params.get('mode') === 'call';
  let enhanced = false;
  let sendPatched = false;

  const VEHICLES = {
    suv: { label: '休旅車', surcharge: 0 },
    imported: { label: '進口車', surcharge: 200 },
    six: { label: '六人座', surcharge: 100 },
    seven: { label: '七人座', surcharge: 100 },
    nine: { label: '九人座', surcharge: 250 }
  };

  function value(id) {
    return String(document.getElementById(id)?.value || '').trim();
  }

  function selectedVehicle() {
    const key = value('graduationVehicle');
    return VEHICLES[key] || null;
  }

  function passengerCount() {
    const count = Number.parseInt(value('passengers'), 10);
    return Number.isFinite(count) ? count : 0;
  }

  function passengerSurcharge() {
    const count = passengerCount();
    return count >= 5 ? (count - 4) * 50 : 0;
  }

  function petValue() {
    return document.querySelector('input[name="graduationPet"]:checked')?.value || '';
  }

  function updateVehiclePassengerNotice() {
    const notice = document.getElementById('graduationVehiclePassengerNotice');
    if (!notice) return;

    const vehicle = selectedVehicle();
    const vehicleFee = vehicle?.surcharge || 0;
    const peopleFee = passengerSurcharge();
    const appliedFee = Math.max(vehicleFee, peopleFee);
    const messages = [];

    if (vehicle) {
      if (vehicleFee > 0) {
        messages.push(`指定${vehicle.label}需額外加價 NT$${vehicleFee}。`);
      } else {
        messages.push('指定休旅車不加價，仍須依現場車況媒合。');
      }
    }

    if (peopleFee > 0) {
      messages.push(`${passengerCount()}位乘客需額外加價 NT$${peopleFee}。`);
    }

    if (vehicleFee > 0 && peopleFee > 0) {
      messages.push(`車型與人數加價取較高者，本次為 NT$${appliedFee}，不重複累加。`);
    }

    notice.innerHTML = messages.map(text => `<p>${text}</p>`).join('');
    notice.classList.toggle('hidden', messages.length === 0);
  }

  function updatePetNotice() {
    const notice = document.getElementById('graduationPetNotice');
    if (!notice) return;
    const uncaged = petValue() === 'uncaged';
    notice.textContent = uncaged ? '寵物無籠需額外加價 NT$50。' : '';
    notice.classList.toggle('hidden', !uncaged);
  }

  function injectVehicleField() {
    if (!isCall || document.getElementById('graduationVehicle')) return;
    const pickupField = document.getElementById('pickup')?.closest('.field');
    if (!pickupField) return;

    const field = document.createElement('div');
    field.className = 'field graduation-vehicle-field';
    field.innerHTML = `
      <label for="graduationVehicle">指定車型（選填）</label>
      <select class="input" id="graduationVehicle" name="graduationVehicle">
        <option value="">不指定（隨機派車）</option>
        <option value="suv">休旅車</option>
        <option value="imported">進口車</option>
        <option value="six">六人座</option>
        <option value="seven">七人座</option>
        <option value="nine">九人座</option>
      </select>
      <div class="graduation-field-help">未指定則隨機派車，無法挑選品牌或車款。指定車型需依現場車況媒合，可能延長等候時間或降低媒合成功率。</div>
      <div class="graduation-price-notice hidden" id="graduationVehiclePassengerNotice" aria-live="polite"></div>`;

    pickupField.before(field);
    field.querySelector('#graduationVehicle')?.addEventListener('change', updateVehiclePassengerNotice);
  }

  function replacePassengerInput() {
    if (!isCall) return;
    const current = document.getElementById('passengers');
    if (!current || current.tagName === 'SELECT') return;

    const select = document.createElement('select');
    select.className = current.className || 'input';
    select.id = 'passengers';
    select.name = 'passengers';
    select.innerHTML = `
      <option value="">請選擇實際乘客人數</option>
      <option value="1人">1人</option>
      <option value="2人">2人</option>
      <option value="3人">3人</option>
      <option value="4人">4人</option>
      <option value="5人">5人</option>
      <option value="6人">6人</option>
      <option value="7人">7人</option>
      <option value="8人">8人</option>`;

    current.replaceWith(select);
    const field = select.closest('.field');
    if (field && !field.querySelector('.graduation-child-seat-note')) {
      const note = document.createElement('div');
      note.className = 'graduation-child-seat-note';
      note.textContent = '嬰幼兒仍請計入實際乘客人數，並於備註填寫年齡。安全座椅屬個人物品，本車隊不提供，如有疑問請先詢問小編。';
      field.appendChild(note);
    }
    select.addEventListener('change', updateVehiclePassengerNotice);
  }

  function bindPetNotice() {
    if (!isCall || document.getElementById('graduationPetNotice')) return;
    const petRow = document.querySelector('.graduation-pet-row');
    if (!petRow) return;
    const notice = document.createElement('div');
    notice.id = 'graduationPetNotice';
    notice.className = 'graduation-price-notice hidden';
    notice.setAttribute('aria-live', 'polite');
    petRow.after(notice);
    petRow.querySelectorAll('input[name="graduationPet"]').forEach(input => {
      input.addEventListener('change', updatePetNotice);
    });
  }

  function patchConfirmation() {
    if (!isCall) return;
    const overlay = document.getElementById('confirmOverlay');
    const summary = document.getElementById('confirmSummary');
    if (!overlay || !summary || overlay.classList.contains('hidden')) return;

    summary.querySelectorAll('[data-vehicle-row]').forEach(row => row.remove());
    const vehicle = selectedVehicle();
    if (!vehicle) return;

    const serviceRow = [...summary.querySelectorAll('.confirm-row')]
      .find(row => row.querySelector('span')?.textContent.trim() === '服務類型');

    const row = document.createElement('div');
    row.className = 'confirm-row';
    row.dataset.vehicleRow = '1';
    const label = document.createElement('span');
    const data = document.createElement('strong');
    label.textContent = '指定車型';
    data.textContent = vehicle.label;
    row.append(label, data);

    if (serviceRow?.nextSibling) {
      summary.insertBefore(row, serviceRow.nextSibling);
    } else {
      summary.appendChild(row);
    }
  }

  function transformMessage(text) {
    if (!isCall || !/^🚕 我要【(?:預約)?叫車】/.test(String(text))) return text;

    const symbol = COMMON['訊息欄位符號'] || '•';
    const vehicle = selectedVehicle();
    const lines = String(text).split('\n').filter(line => !/^• 指定車型：/.test(line));
    if (!vehicle) return lines.join('\n');

    const serviceIndex = lines.findIndex(line => line.startsWith(`${symbol} 服務類型：`));
    lines.splice(serviceIndex >= 0 ? serviceIndex + 1 : 2, 0, `${symbol} 指定車型：${vehicle.label}`);
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
    if (!isCall || !document.getElementById('serviceForm')) return;
    injectVehicleField();
    replacePassengerInput();
    bindPetNotice();
    updateVehiclePassengerNotice();
    updatePetNotice();

    if (!enhanced) {
      enhanced = true;
      const overlay = document.getElementById('confirmOverlay');
      if (overlay) {
        new MutationObserver(patchConfirmation).observe(overlay, {
          attributes: true,
          attributeFilter: ['class']
        });
      }
    }
    patchConfirmation();
  }

  const app = document.getElementById('app');
  if (app) new MutationObserver(enhance).observe(app, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', enhance, { once: true });

  let attempts = 0;
  const timer = setInterval(() => {
    attempts += 1;
    enhance();
    if (installSendPatch() || attempts > 400) clearInterval(timer);
  }, 50);
})();