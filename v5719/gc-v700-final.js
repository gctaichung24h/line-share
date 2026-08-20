(() => {
  'use strict';
  // GC_MASTER_STABLE_2026_08R10_5PLUS_PASSENGER_UX
  // GC_MASTER_STABLE_2026_08R10J_PRIMARY_TASK_FIRST_LAYOUT
  // GC_MASTER_STABLE_2026_08R10S_FAVORITE_SHEET_NATIVE_GESTURE
  // GC_MASTER_STABLE_2026_08R10Q_FAVORITE_SHEET_SCROLL_FIX

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
  let favoriteSheetScrollY = 0;

  const value = id => String(document.getElementById(id)?.value || '').trim();
  const selectedVehicle = () => VEHICLES[value('gcVehicle')] || null;
  const passengerCount = () => Number.parseInt(value('passengers'), 10) || 0;
  const passengerFee = () => passengerCount() >= 5 ? (passengerCount() - 4) * 50 : 0;
  const petRaw = () => document.querySelector('input[name="gcPet"]:checked')?.value || '';
  const petText = () => petRaw() === 'caged' ? '有（有籠）' : petRaw() === 'uncaged' ? '有（無籠）' : '';

  function fieldById(id) { return document.getElementById(id)?.closest('.field') || null; }
  function relabel(field, text) { const label = field?.querySelector(':scope > label'); if (label) label.textContent = text; }
  function removeFieldByInputName(name) { document.querySelector(`input[name="${name}"]`)?.closest('.field')?.remove(); }

  // GC_MASTER_STABLE_2026_08R10M_ADDRESS_UTILITY_ROW
  // GC_MASTER_STABLE_2026_08R10N_ADDRESS_HELPER_LABELS
  // Address input is always the protagonist. Recent/current-location/favorite shortcuts live
  // in a consistent, quiet row below the input instead of floating beside the field label.
  function ensureAddressUtilityRow(field) {
    if (!field) return null;
    let row = field.querySelector(':scope > .gc-address-utility-row');
    if (row) return row;
    row = document.createElement('div');
    row.className = 'gc-address-utility-row';
    const suggest = field.querySelector(':scope > .gc-address-suggest');
    const input = field.querySelector(':scope > .input');
    if (suggest) suggest.after(row);
    else if (input) input.after(row);
    else field.appendChild(row);
    return row;
  }

  function attachRecentAddressShortcut(field) {
    const recent = field?.querySelector(':scope > .recent-address-control');
    const row = ensureAddressUtilityRow(field);
    if (recent && row && !row.contains(recent)) row.appendChild(recent);
  }

  function createFavoriteSheet(hostField, favorite) {
    if (!hostField || !favorite || document.getElementById('gcFavoriteSheet')) return;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.id = 'gcFavoriteToggle';
    toggle.className = 'field-inline-btn';
    toggle.textContent = '⭐ 常用行程';
    toggle.setAttribute('aria-expanded', 'false');
    ensureAddressUtilityRow(hostField)?.appendChild(toggle);

    const sheet = document.createElement('div');
    sheet.id = 'gcFavoriteSheet';
    sheet.className = 'gc-sheet-overlay hidden';
    sheet.innerHTML = `<section class="gc-sheet" role="dialog" aria-modal="true" aria-label="常用行程">
      <div class="gc-sheet-handle"></div>
      <div class="gc-sheet-head"><strong>常用行程</strong><button type="button" class="gc-sheet-close" aria-label="關閉">✕</button></div>
      <div class="gc-sheet-body"></div>
    </section>`;
    favorite.classList.add('gc-favorite-sheet-box');
    favorite.open = true;
    sheet.querySelector('.gc-sheet-body').appendChild(favorite);
    document.body.appendChild(sheet);

    const panel = sheet.querySelector('.gc-sheet');
    const resetSheetDrag = () => {
      if (!panel) return;
      panel.classList.remove('gc-sheet-dragging', 'gc-sheet-snapback');
      panel.style.removeProperty('transform');
    };
    // R10Z14F13: status messages belong only to the current favorite-sheet session.
    // Clear success/error state when the sheet is closed or reopened so an old route result
    // can never be mistaken for the passenger's newly edited address.
    const clearFavoriteSheetStatus = () => {
      const status = document.getElementById('favoriteStatus');
      if (!status) return;
      status.textContent = '';
      status.classList.remove('is-error', 'is-success');
    };
    const close = () => {
      clearFavoriteSheetStatus();
      resetSheetDrag();
      sheet.classList.add('hidden');
      sheet.hidden = true;
      sheet.setAttribute('aria-hidden', 'true');
      sheet.style.setProperty('display', 'none', 'important');
      document.body.classList.remove('gc-sheet-open');
      document.documentElement.classList.remove('gc-sheet-open');
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      toggle.setAttribute('aria-expanded', 'false');
      window.scrollTo(0, favoriteSheetScrollY);
    };
    const open = () => {
      clearFavoriteSheetStatus();
      const y = window.scrollY;
      const active = document.activeElement;
      if (active && ['INPUT','TEXTAREA','SELECT'].includes(active.tagName)) active.blur();
      const reveal = () => {
        favorite.open = true;
        favoriteSheetScrollY = y;
        window.scrollTo(0, y);
        sheet.hidden = false;
        sheet.removeAttribute('aria-hidden');
        sheet.style.removeProperty('display');
        sheet.classList.remove('hidden');
        document.documentElement.classList.add('gc-sheet-open');
        document.body.classList.add('gc-sheet-open');
        document.body.style.position = 'fixed';
        document.body.style.top = `-${y}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        toggle.setAttribute('aria-expanded', 'true');
      };
      setTimeout(reveal, 180);
      setTimeout(() => window.scrollTo(0, y), 300);
    };
    toggle.addEventListener('click', open);
    sheet.querySelector('.gc-sheet-close')?.addEventListener('click', close);
    sheet.addEventListener('click', event => { if (event.target === sheet) close(); });
    sheet.addEventListener('click', event => {
      if (event.target.closest('#favoriteClearBtn')) close();
      if (event.target.closest('.favorite-use')) setTimeout(close, 0);
    }, true);

    // iOS-style Bottom Sheet: upward swipes browse the list; only a deliberate downward drag
    // from the handle/header can dismiss the sheet. This prevents "looking for more" from closing it.
    const dragZones = [sheet.querySelector('.gc-sheet-handle'), sheet.querySelector('.gc-sheet-head')].filter(Boolean);
    let dragPointerId = null;
    let dragStartY = 0;
    let dragLastY = 0;
    let dragStartTime = 0;
    let dragActive = false;
    const dragMove = event => {
      if (!dragActive || event.pointerId !== dragPointerId || !panel) return;
      const dy = Math.max(0, event.clientY - dragStartY);
      dragLastY = event.clientY;
      if (dy > 0) {
        event.preventDefault();
        panel.classList.add('gc-sheet-dragging');
        panel.style.transform = `translate3d(0, ${Math.min(dy, 220)}px, 0)`;
      }
    };
    const dragEnd = event => {
      if (!dragActive || event.pointerId !== dragPointerId || !panel) return;
      const dy = Math.max(0, dragLastY - dragStartY);
      const elapsed = Math.max(1, performance.now() - dragStartTime);
      const velocity = dy / elapsed;
      dragActive = false;
      dragPointerId = null;
      panel.classList.remove('gc-sheet-dragging');
      try { event.currentTarget?.releasePointerCapture?.(event.pointerId); } catch (_) {}
      if (dy >= 92 || (dy >= 44 && velocity >= 0.55)) {
        close();
        return;
      }
      panel.classList.add('gc-sheet-snapback');
      panel.style.transform = 'translate3d(0,0,0)';
      setTimeout(() => {
        panel.classList.remove('gc-sheet-snapback');
        panel.style.removeProperty('transform');
      }, 240);
    };
    dragZones.forEach(zone => {
      zone.addEventListener('pointerdown', event => {
        if (event.target.closest('button')) return;
        if (event.pointerType === 'mouse' && event.button !== 0) return;
        dragPointerId = event.pointerId;
        dragStartY = dragLastY = event.clientY;
        dragStartTime = performance.now();
        dragActive = true;
        try { zone.setPointerCapture?.(event.pointerId); } catch (_) {}
      });
      zone.addEventListener('pointermove', dragMove, { passive: false });
      zone.addEventListener('pointerup', dragEnd);
      zone.addEventListener('pointercancel', dragEnd);
    });

    // R10Z14F10: the save dialog preserves the common-trip sheet context;
    // do not auto-close the sheet when the centered save overlay opens.
  }

  function compactAddressActions() {
    const pickup = document.getElementById('pickup')?.closest('.address-field');
    const locationAction = document.getElementById('locationAction');
    const locationStatus = document.getElementById('locationStatus');
    if (pickup) {
      pickup.classList.add('gc-primary-address', 'gc-pickup-address');
      const utility = ensureAddressUtilityRow(pickup);
      if (locationAction && utility) {
        locationAction.classList.add('field-inline-action');
        const button = locationAction.querySelector('.location-btn');
        if (button) button.textContent = '📍 目前位置';
        utility.appendChild(locationAction);
        if (locationStatus) pickup.appendChild(locationStatus);
      }
      // GC_MASTER_STABLE_2026_08R10Z9D_PICKUP_SHORTCUT_PRIORITY
      // Priority follows speed-to-completion: current location -> saved full trip -> recent single address.
      // A saved trip can populate both endpoints, so it belongs before the recent-address fallback.
      createFavoriteSheet(pickup, document.getElementById('favoriteTripsBox'));
      attachRecentAddressShortcut(pickup);
    }
    const destination = document.getElementById('destination')?.closest('.address-field');
    if (destination) {
      destination.classList.add('gc-primary-address', 'gc-destination-address');
      attachRecentAddressShortcut(destination);
    }
  }

  function addVehicleField() {
    if (!isCall || document.getElementById('gcVehicle')) return;
    const pickup = fieldById('pickup');
    if (!pickup) return;
    const field = document.createElement('div');
    field.className = 'field gc-vehicle-field';
    field.innerHTML = `
      <label for="gcVehicle">指定車型</label>
      <select class="input gc-select" id="gcVehicle" name="gcVehicle">
        <option value="">不指定車型</option>
        <option value="suv">休旅車</option>
        <option value="imported">進口車</option>
        <option value="six">六人座</option>
        <option value="seven">七人座</option>
        <option value="nine">九人座</option>
      </select>
      <details class="gc-info-disclosure">
        <summary>ⓘ 車型與加價說明</summary>
        <div class="gc-info-disclosure-body">
          <div class="gc-vehicle-info-lead"><strong>僅指定車型</strong><span>品牌／車款隨機媒合</span></div>
          <div class="gc-vehicle-price-list" aria-label="車型加價">
            <div><span>休旅車</span><b>不加價</b></div>
            <div><span>進口車</span><b>+$200</b></div>
            <div><span>六、七人座</span><b>+$100</b></div>
            <div><span>九人座</span><b>+$250</b></div>
          </div>
        </div>
      </details>
      <div id="gcVehicleNotice" class="gc-price-notice hidden" aria-live="polite"></div>`;
    const destination = fieldById('destination');
    if (destination) destination.after(field); else pickup.after(field);
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
      old.replaceWith(select);
    }
    select.innerHTML = '<option value="">1～4人免選</option>' +
      [5, 6, 7, 8].map(n => `<option value="${n}人">${n}人</option>`).join('');
    const field = select.closest('.field');
    relabel(field, '5人以上請選人數');
    if (!document.getElementById('gcPeopleNotice')) {
      const notice = document.createElement('div');
      notice.id = 'gcPeopleNotice';
      notice.className = 'gc-price-notice hidden';
      field?.appendChild(notice);
    }
    select.addEventListener('change', updateNotices);

    const destination = fieldById('destination');
    const vehicle = document.getElementById('gcVehicle')?.closest('.field');
    const anchor = vehicle || destination;
    if (field && anchor && field.previousElementSibling !== anchor) anchor.after(field);
  }

  function addPetField(anchor) {
    if (!isCall || document.getElementById('gcPetField') || !anchor) return;
    const field = document.createElement('div');
    field.className = 'field';
    field.id = 'gcPetField';
    field.innerHTML = `<div class="field-label">寵物同行</div>
      <div class="choice-row gc-pet-row">
        <label class="choice"><input type="radio" name="gcPet" value="none"><span>無</span></label>
        <label class="choice"><input type="radio" name="gcPet" value="caged"><span>有籠</span></label>
        <label class="choice"><input type="radio" name="gcPet" value="uncaged"><span>無籠</span></label>
      </div><div id="gcPetNotice" class="gc-price-notice hidden"></div>`;
    anchor.before(field);
    field.querySelectorAll('input').forEach(input => input.addEventListener('change', updateNotices));
  }

  // GC_MASTER_STABLE_2026_08R10Z9H_NEEDS_GROUPED_REFLOW
  // Client-side layout only: group optional dispatch needs visually without changing field IDs, values,
  // confirmation logic, or LINE dispatch message order.
  function ensureNeedsGroup(content, className, ariaLabel) {
    if (!content) return null;
    let group = content.querySelector(`.${className}`);
    if (!group) {
      group = document.createElement('div');
      group.className = `gc-needs-group ${className}`;
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', ariaLabel);
      content.appendChild(group);
    }
    return group;
  }

  function forcePassengerPublicPosition() {
    if (!isCall) return;
    const passenger = fieldById('passengers');
    const details = [...document.querySelectorAll('details.optional-box')].find(d => d.id !== 'favoriteTripsBox');
    const content = details?.querySelector('.optional-content');
    if (!passenger || !content) return;
    passenger.classList.add('gc-passenger-public');
    const peopleGroup = content.querySelector('.gc-needs-group--people');
    const target = peopleGroup || content;
    if (passenger.parentElement !== target) target.prepend(passenger);
  }

  function restructureCallDetails() {
    const form = document.getElementById('serviceForm');
    if (!form) return;
    const details = [...form.querySelectorAll('details.optional-box')].find(d => d.id !== 'favoriteTripsBox');
    const vehicle = document.getElementById('gcVehicle')?.closest('.field');
    const passenger = fieldById('passengers');
    const baggage = fieldById('baggage');
    const requirements = fieldById('requirements');
    const notes = fieldById('notes');
    requirements?.remove();
    if (!details) return;
    details.classList.add('gc-secondary-box', 'gc-call-needs-box');
    const summary = details.querySelector('summary');
    const content = details.querySelector('.optional-content');
    if (summary) {
      const disclosureTrigger = summary.querySelector('.gc-small-disclosure-trigger');
      // GC_MASTER_STABLE_2026_08R10Z9Y_NEEDS_SUMMARY_HIERARCHY
      // Keep every important category visible while the fields are collapsed, but
      // separate the label from its examples so narrow phones do not read it as one
      // dense, equally weighted sentence.
      const summaryCopy = document.createElement('span');
      summaryCopy.className = 'gc-needs-summary-copy';
      const summaryTitle = document.createElement('span');
      summaryTitle.className = 'gc-needs-summary-title';
      summaryTitle.textContent = '其他需求';
      const summaryMeta = document.createElement('span');
      summaryMeta.className = 'gc-needs-summary-meta';
      summaryMeta.textContent = '車型・5人以上・寵物・行李';
      summaryCopy.append(summaryTitle, summaryMeta);
      summary.replaceChildren(summaryCopy);
      if (disclosureTrigger) summary.appendChild(disclosureTrigger);
    }
    if (baggage) {
      relabel(baggage, '行李數量');
      baggage.querySelector('input')?.setAttribute('placeholder', '例如：1個30吋、1個26吋');
    }
    if (notes) {
      relabel(notes, '備註資訊');
      notes.querySelector('textarea')?.setAttribute('placeholder', '其他需要小編或司機留意的資訊');
    }
    addPetField(baggage || notes);
    const pet = document.getElementById('gcPetField');
    if (!content) return;
    content.classList.add('gc-needs-content');
    const vehicleGroup = ensureNeedsGroup(content, 'gc-needs-group--vehicle', '指定車型');
    const peopleGroup = ensureNeedsGroup(content, 'gc-needs-group--people', '5人以上與寵物同行');
    const extraGroup = ensureNeedsGroup(content, 'gc-needs-group--extra', '行李與備註');
    if (vehicle && vehicleGroup) vehicleGroup.appendChild(vehicle);
    [passenger, pet].forEach(field => { if (field && peopleGroup) peopleGroup.appendChild(field); });
    [baggage, notes].forEach(field => { if (field && extraGroup) extraGroup.appendChild(field); });
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
      if (summary) {
        // V8.5: 保留右側小型展開／收合控制；不可用 textContent 把按鈕一起清掉。
        const disclosureTrigger = summary.querySelector('.gc-small-disclosure-trigger');
        summary.textContent = '備註資訊';
        if (disclosureTrigger) summary.appendChild(disclosureTrigger);
      }
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
        lines.push(vf > 0 ? `<span class="gc-fee-line">加價資訊 <b>${v.label} +NT$${vf}</b></span>` : '<span class="gc-fee-line">加價資訊 <b>休旅車不加價</b></span>');
        lines.push('<span class="gc-match-warning">指定車型可能影響媒合速度與成功率。</span>');
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
      // GC_MASTER_STABLE_2026_08R10Z14F25R6M2R15R7F1M6_ZERO_FEE_AND_DISCLOSURE_CHEVRON_POLISH
      row.className = `confirm-row gc-confirm-extra-total${extraTotal === 0 ? ' gc-confirm-extra-total-zero' : ''}`;
      row.dataset.gcV7Extra = '1';
      row.innerHTML = `<span>車資外另加費用</span><strong>NT$${extraTotal}</strong>`;
      summary.appendChild(row);
    }
  }

  // GC_R10Z14F6_CONFIRM_ADDRESS_TRADITIONALIZATION
  // The approved Simplified-to-Taiwan-Traditional converter is exposed to the
  // confirmation workflow. Form fields, provider data, coordinates, route calculation
  // and navigation remain untouched; the reviewed display copy is sent to LINE unchanged.
  // One-to-one data is derived from OpenCC STCharacters (Apache-2.0); Taiwan address
  // ambiguities such as 台／后／里 are deliberately not force-converted.
  const gcLineAddressS2TFrom = "㐷㐽㑇㑈㑔㑩㓆㓥㓰㔉㖊㖞㘎㚯㛀㛟㛠㛣㛤㛿㟆㟜㟥㡎㤘㤽㥪㧏㧐㧑㧟㧰㨫㭎㭏㭣㭤㭴㱩㱮㲿㳔㳕㳠㳡㳢㳽㴋㶉㶶㶽㺍㻅㻏㻘䀥䁖䂵䃅䅉䅟䅪䇲䉤䌶䌷䌸䌹䌺䌻䌼䌽䌾䌿䍀䍁䍠䎬䏝䑽䓓䓕䓖䓨䗖䘛䘞䙊䙌䙓䜣䜤䜥䜧䜩䝙䞌䞍䞎䞐䟢䢀䢁䢂䥺䥽䥾䥿䦀䦁䦂䦃䦅䦆䦶䦷䩄䭪䯃䯄䯅䲝䲞䲟䲠䲡䲢䲣䴓䴔䴕䴖䴗䴘䴙䶮与专业丛东丝丢两严丧临为丽举么义乌乐乔习乡书买乱争亏亚产亩亲亵亸亿仅从仓仪们众优会伛伞伟传伡伣伤伥伦伧伪伫体佥侠侣侥侦侧侨侩侪侬侭俣俦俨俩俪俫俭债倾偬偻偾偿傤傥傧储傩儿兑兖兰关兴兹养兽冁内冈册写军农冯决况冻净凉减凑凛凤凫凭凯击凿刍刘则刚创删刬刭刹刽刾刿剀剂剐剑剥剧劝办务劢动励劲劳势勚匀匦匮区医华协单卖卢卧卫却卺厅厉压厌厍厐厕厢厣厦厨厩厮县叁叆叇双变叙叠号叽吓吕吗吨听启吴呐呒呓呕呖呗员呙呛呜咏咙咛咝咤响哑哒哓哔哕哙哜哝哟唛唝唠唡唢唤啧啬啭啯啰啴啸喷喽喾嗫嗳嘘嘤嘱噜嚣园囱围囵国图圆圣圹场坏块坚坜坞坟坠垄垅垆垒垦垩垫垭垯垱垲垴埘埚堑堕塆墙壮声壳壶壸处备够头夺奁奂奋奖奥妆妇妈妩妪妫姗姹娄娅娆娇娈娱娲婳婴婵婶媪媭嫒嫔嫱嬷孙学孪宝实宠审宪宫宽宾寝对寻导寿将尔尘尧尴层屃屉届属屡屦屿岁岂岖岗岘岚岛岭岽岿峃峄峡峣峤峥峦峰崂崃崄崭嵘嵚嵝巅巩巯币帅师帏帐帜带帧帮帱帻帼幂庄庆床庐庑库应庙庞废庼廪开异弃弑张弪弯弹强归彟彦彨彻徕忆忏忧忾怀态怂怃怄怅怆怜总怼怿恋恒恳恸恹恺恻恼恽悦悫悬悭悮悯惊惧惨惩惫惬惭惮惯愠愤愦慑慭懑懒懔戆戋戏戗战戬戯户扑执扩扪扫扬扰抚抛抟抠抡抢护报担拟拢拣拥拦拧拨择挚挛挜挝挞挟挠挡挢挣挤挥挦捝捞损捡换捣掳掴掷掸掺掼揽揾揿搀搁搂搄搅携摄摅摇摈摊撄撑撵撷撸撺擜擞攒敌敚敛敩数斋斓斩断无旧时旷旸昙昵昼昽显晋晒晓晔晕晖暂暅暧机杀杂权条来杨杩构枞枢枣枥枧枨枫枭柠柽栀栅标栈栉栊栋栌栎栏树栖样栾桠桡桢档桤桥桦桧桨桩桪梦梼梾梿检棁棂椁椝椟椠椢椤椫椭椮楼榄榅榇榈榉榝槚槛槟槠横樯樱橥橱橹橼檩欢欤欧歼殁殇残殒殓殚殡殴毂毕毙毡毵毶氇气氢氩氲汉汤汹沄沟没沣沤沥沦沧沨沩沪泞泪泶泷泸泺泻泼泽泾洁洒洼浃浅浆浇浈浉浊测浍济浏浐浑浒浓浔浕涚涛涝涞涟涠涡涢涣涤润涧涨涩渊渌渍渎渐渑渔渖渗温湾湿溁溃溅溆溇滗滚滞滠满滢滤滥滦滨滩滪潆潇潋潍潜潴澛澜濑濒灏灭灯灵灶灾灿炀炉炖炜炝点炽烁烂烃烛烦烧烨烩烫烬热焕焖焘煴爱爷牍牦牵牺犊状犷犸犹狈狝狞独狭狮狯狰狱狲猃猎猕猡猪猫猬献獭玑玙玚玛玮环现玱玺珐珑珰珲琎琏琐琼瑶瑷瑸璎瓒瓮瓯电画畅畴疖疗疟疠疡疬疭疮疯疱疴痈痉痒痖痨痪痫痴瘅瘆瘗瘘瘪瘫瘾瘿癞癣癫皑皱皲盏盐监盖盗盘眍眦眬睁睐睑瞆瞒瞩矫矶矾矿砀码砖砗砚砜砺砻砾础硁硕硖硗硙硚硵碍碛碜碱礼祃祎祢祯祷祸禀禄禅离秃秆秘积称秽秾稆税稣稳穑穞穷窃窍窎窑窜窝窥窦窭竖竞笃笋笔笕笺笼笾筚筛筜筝筹筼筿简箓箦箧箨箩箪箫篑篓篮篯篱簖籁籴类籼粜粝粤粪粮粽糁糇糍紧絷緼縆纟纠纡红纣纥约级纨纩纪纫纬纭纮纯纰纱纲纳纴纵纶纷纸纹纺纻纼纽纾线绀绁绂练组绅细织终绉绊绋绌绍绎经绐绑绒结绔绕绖绗绘给绚绛络绝绞统绠绡绢绣绤绥绦继绨绩绪绫绬续绮绯绰绲绳维绵绶绸绹绺绻综绽绾绿缀缁缂缃缄缅缆缇缈缉缊缋缌缍缎缏缐缑缒缓缔缕编缗缘缙缚缛缜缝缞缟缠缡缢缣缤缥缦缧缨缩缪缫缬缭缮缯缰缱缲缳缴缵罂网罗罚罢罴羁羟羡群翘翙翚耢耧耸耻聂聋职聍联聩聪肃肠肤肮肴肾肿胀胁胆胧胨胪胫胶脉脍脐脑脓脔脚脱脶脸腘腭腻腼腽腾膑臜舆舣舰舱舻艰艺节芈芗芜芦苁苇苈苋苌苍苎苧茎茏茑茔茕茧荆荙荚荛荜荝荞荟荠荣荤荥荦荧荨荩荪荬荭荮莅莱莲莳莴莶莸莹莺莼萚萝萤营萦萧萨葱蒀蒇蒉蒋蒌蒏蓝蓟蓠蓣蓥蓦蔂蔷蔹蔺蔼蕰蕲蕴薮藓藴蘖虏虑虚虬虮虱虽虾虿蚀蚁蚂蚃蚕蚬蛊蛎蛏蛮蛰蛱蛲蛳蛴蜕蜗蝇蝈蝉蝼蝾螀螨蟏衅衔补衬衮袄袆袜袭袯装裆裈裢裣裤褛褴襕见观觃规觅视觇览觉觊觋觌觍觎觏觐觑觞触觯訚詟誉誊讠计订讣认讥讦讧讨让讪讫讬训议讯记讱讲讳讴讵讶讷许讹论讻讼讽设访诀诂诃评诅识诇诈诉诊诋诌词诎诏诐译诒诓诔试诖诗诘诙诚诛诜话诞诟诠诡询诣诤该详诧诨诩诪诫诬语诮误诰诱诲诳说诵诶请诸诹诺读诼诽课诿谀谁谂调谄谅谆谇谈谉谊谋谌谍谎谏谐谑谒谓谔谕谖谗谘谙谚谛谜谝谞谟谠谡谢谣谤谦谧谨谩谪谫谬谭谮谯谰谱谲谳谴谵谶豮贝贞负贠贡财责贤败账货质贩贪贫贬购贮贯贰贱贲贳贴贵贶贷贸费贺贻贼贽贾贿赀赁赂赃资赅赆赇赈赉赊赋赌赍赎赏赐赑赒赓赔赕赖赗赘赙赚赛赜赟赠赡赢赣赪赵赶趋趱趸跃跄跞践跶跷跸跹跻踌踪踬踯蹑蹒蹰蹿躏躜躯輼车轧轨轩轪轫转轭轮软轰轱轲轳轴轵轶轷轸轹轺轻轼载轾轿辀辁辂较辄辅辆辇辈辉辊辋辌辍辎辏辐辑辒输辔辕辖辗辘辙辚辞辩辫边辽达迁过迈运还这进远违连迟迩迳选逊递逦逻遗遥邓邝邬邮邹邺邻郏郐郑郓郦郧郸酂酝酦酱酽酾酿醖释銮錾钅钆钇钉钊钋钌钍钎钏钐钑钒钓钔钕钖钗钘钙钚钛钜钝钞钠钡钢钣钤钦钧钨钩钪钬钭钮钯钰钱钲钳钴钵钶钷钸钹钺钼钽钾钿铀铁铂铃铄铅铆铇铈铉铊铋铌铍铎铏铐铑铒铓铔铕铖铗铘铙铚铛铜铝铞铟铠铡铢铣铤铥铦铧铨铩铪铫铬铭铮铯铰铱铳铴铵银铷铸铹铺铻铼铽铿销锁锂锃锅锆锇锈锉锊锋锌锍锎锏锐锑锒锓锔锕锖锗锘错锚锛锜锝锞锟锠锡锢锣锤锥锦锧锨锩锪锬锭键锯锰锱锲锳锴锵锶锷锸锹锺锻锼锽锾锿镀镁镂镃镄镅镆镇镈镉镊镌镍镏镐镑镒镓镔镕镖镗镘镙镚镛镜镝镞镟镠镡镣镤镥镦镧镨镩镪镫镬镭镮镯镱镲镳镴镵镶长门闩闪闫闬闭问闯闰闱闳间闵闶闷闸闹闺闻闼闽闾闿阀阁阂阃阄阅阆阇阈阉阊阋阌阍阎阏阐阑阒阓阔阕阖阗阘阙阚阛队阳阴阵阶际陆陇陈陉陕陦陧陨险随隐隶隽难雏雠雳雾霁霉霡霭靓靔静靥鞑鞒鞯鞲韦韧韨韩韪韫韬韵页顶顷顸项顺顼顽顾顿颀颁颂颃预颅领颇颈颉颊颋颌颍颎颏颐频颒颓颔颕颖颗题颙颚颛颜额颞颟颠颡颢颣颤颥颦颧风飏飐飑飒飓飔飕飖飗飘飙飚飞飨餍饣饤饦饧饨饩饪饫饬饭饮饯饰饱饲饳饴饵饶饷饸饹饺饻饼饽饾饿馀馁馂馃馄馅馆馇馈馉馊馋馌馍馎馏馐馑馒馓馔馕马驭驮驯驰驱驲驳驴驵驶驷驸驹驺驻驼驽驾驿骀骁骂骃骄骅骆骇骈骉骊骋验骍骎骏骐骑骒骓骔骕骖骗骘骙骚骛骜骝骞骟骠骡骢骣骤骥骦骧髅髋髌鬓鬶魇魉鱼鱽鱾鱿鲀鲁鲂鲃鲄鲅鲆鲇鲈鲉鲊鲋鲌鲍鲎鲏鲐鲑鲒鲓鲔鲕鲖鲗鲘鲙鲚鲛鲜鲝鲞鲟鲠鲡鲢鲣鲤鲥鲦鲧鲨鲩鲪鲫鲬鲭鲮鲯鲰鲱鲲鲳鲴鲵鲶鲷鲸鲹鲺鲻鲼鲽鲾鲿鳀鳁鳂鳃鳄鳅鳆鳇鳈鳉鳊鳋鳌鳍鳎鳏鳐鳑鳒鳓鳔鳕鳖鳗鳘鳙鳚鳛鳜鳝鳞鳟鳠鳡鳢鳣鳤鸟鸠鸡鸢鸣鸤鸥鸦鸧鸨鸩鸪鸫鸬鸭鸮鸯鸰鸱鸲鸳鸴鸵鸶鸷鸸鸹鸺鸻鸼鸽鸾鸿鹀鹁鹂鹃鹄鹅鹆鹈鹉鹊鹋鹌鹍鹎鹏鹐鹑鹒鹓鹔鹕鹖鹗鹘鹙鹚鹛鹜鹝鹞鹟鹠鹡鹢鹣鹤鹥鹦鹧鹨鹩鹪鹫鹬鹭鹮鹯鹰鹱鹲鹳鹴鹾麦麸麹麺麽黄黉黡黩黪黾鼋鼌鼍鼹齐齑齿龀龁龂龃龄龅龆龇龈龉龊龋龌龙龚龛龟鿎鿏鿒鿔𠀾𠆲𠆿𠇹𠉂𠉗𠋆𠚳𠛅𠛆𠛾𠡠𠮶𠯟𠯠𠰱𠰷𠱞𠲥𠴛𠴢𠵸𠵾𡋀𡋗𡋤𡍣𡒄𡝠𡞋𡞱𡠟𡥧𡭜𡭬𡳃𡳒𡶴𡸃𡺃𡺄𢋈𢗓𢘙𢘝𢘞𢙏𢙐𢙑𢙒𢙓𢛯𢠁𢢐𢧐𢫊𢫞𢫬𢬍𢬦𢭏𢽾𣃁𣆐𣈣𣍨𣍯𣍰𣎑𣏢𣐕𣐤𣑶𣒌𣓿𣔌𣗊𣗋𣗙𣘐𣘓𣘴𣘷𣚚𣞎𣨼𣭤𣯣𣱝𣲗𣲘𣳆𣶩𣶫𣶭𣷷𣸣𣺼𣺽𣽷𤆡𤆢𤇃𤇄𤇭𤇹𤈶𤈷𤊀𤊰𤋏𤎺𤎻𤙯𤝢𤞃𤞤𤠋𤦀𤩽𤳄𤶊𤶧𤻊𤽯𤾀𤿲𥁢𥅘𥅴𥅿𥆧𥇢𥎝𥐟𥐯𥐰𥐻𥞦𥧂𥩟𥩺𥫣𥬀𥬞𥬠𥭉𥮋𥮜𥮾𥱔𥹥𥺅𥺇𦈈𦈉𦈋𦈌𦈎𦈏𦈐𦈑𦈒𦈓𦈔𦈕𦈖𦈗𦈘𦈙𦈚𦈛𦈜𦈝𦈞𦈟𦈠𦈡𦍠𦛨𦝼𦟗𦨩𦰏𦰴𦶟𦶻𦻕𧉐𧉞𧌥𧏖𧏗𧑏𧒭𧜭𧝝𧝧𧮪𧳕𧹑𧹒𧹓𧹔𧹕𧹖𧹗𧿈𨀁𨀱𨁴𨂺𨄄𨅛𨅫𨅬𨉗𨐅𨐆𨐇𨐈𨐉𨐊𨑹𨟳𨠨𨡙𨡺𨤰𨰾𨰿𨱀𨱁𨱂𨱃𨱄𨱅𨱆𨱇𨱈𨱉𨱊𨱋𨱌𨱍𨱎𨱏𨱐𨱑𨱒𨱓𨱔𨱕𨱖𨷿𨸀𨸁𨸂𨸃𨸄𨸅𨸆𨸇𨸉𨸊𨸋𨸌𨸎𨸘𨸟𩏼𩏽𩏾𩏿𩐀𩓋𩖕𩖖𩖗𩙥𩙦𩙧𩙨𩙩𩙪𩙫𩙬𩙭𩙮𩙯𩙰𩟿𩠀𩠁𩠂𩠃𩠅𩠆𩠇𩠈𩠉𩠊𩠋𩠌𩠎𩠏𩠠𩡖𩧦𩧨𩧩𩧪𩧫𩧬𩧭𩧮𩧯𩧰𩧱𩧲𩧳𩧴𩧵𩧶𩧸𩧺𩧻𩧼𩧿𩨀𩨁𩨂𩨃𩨄𩨅𩨆𩨇𩨈𩨉𩨊𩨋𩨌𩨍𩨎𩨏𩨐𩩈𩬣𩬤𩭹𩯒𩰰𩲒𩴌𩽹𩽺𩽻𩽼𩽽𩽾𩽿𩾁𩾂𩾃𩾄𩾅𩾆𩾇𩾈𩾊𩾋𩾌𩾎𪉂𪉃𪉄𪉅𪉆𪉈𪉉𪉊𪉋𪉌𪉍𪉎𪉏𪉐𪉑𪉒𪉔𪉕𪎈𪎉𪎊𪎋𪎌𪑅𪔭𪚏𪚐𪜎𪞝𪟎𪟝𪠀𪠟𪠡𪠳𪠵𪠸𪠺𪠽𪡀𪡃𪡋𪡏𪡛𪡞𪡺𪢌𪢐𪢒𪢕𪢖𪢠𪢮𪢸𪣆𪣒𪣻𪤄𪤚𪥠𪥫𪥰𪥿𪧀𪧘𪨊𪨗𪨧𪨩𪨶𪨷𪨹𪩇𪩎𪩘𪩛𪩷𪩸𪪏𪪑𪪞𪪴𪪼𪫌𪫡𪫷𪫺𪬚𪬯𪭝𪭢𪭧𪭯𪭵𪭾𪮃𪮋𪮖𪮳𪮶𪯋𪰶𪱥𪱷𪲎𪲔𪲛𪲮𪳍𪳗𪴙𪵑𪵣𪵱𪶄𪶒𪶮𪷍𪷽𪸕𪸩𪹀𪹠𪹳𪹹𪺣𪺪𪺭𪺷𪺸𪺻𪺽𪻐𪻨𪻲𪻺𪼋𪼴𪽈𪽝𪽪𪽭𪽮𪽴𪽷𪾔𪾢𪾣𪾦𪾸𪿊𪿞𪿫𪿵𫀌𫀓𫀨𫀬𫀮𫁂𫁟𫁡𫁱𫁲𫁳𫁷𫁺𫂃𫂆𫂈𫂖𫂿𫃗𫄙𫄚𫄛𫄜𫄝𫄞𫄟𫄠𫄡𫄢𫄣𫄤𫄥𫄦𫄧𫄨𫄩𫄪𫄫𫄬𫄭𫄮𫄯𫄰𫄱𫄲𫄳𫄴𫄵𫄶𫄷𫄸𫄹𫅅𫅗𫅥𫅭𫅼𫆏𫆝𫆫𫇘𫇛𫇪𫇭𫇴𫇽𫈉𫈎𫈟𫈵𫉁𫉄𫊪𫊮𫊸𫊹𫊻𫋇𫋌𫋲𫋷𫋹𫋻𫌀𫌇𫌋𫌨𫌪𫌫𫌬𫌭𫌯𫍐𫍙𫍚𫍛𫍜𫍝𫍞𫍟𫍠𫍡𫍢𫍣𫍤𫍥𫍦𫍧𫍨𫍩𫍪𫍫𫍬𫍭𫍮𫍯𫍰𫍱𫍲𫍳𫍴𫍵𫍶𫍷𫍸𫍹𫍺𫍻𫍼𫍽𫍾𫍿𫎆𫎌𫎦𫎧𫎨𫎩𫎪𫎫𫎬𫎭𫎱𫎳𫎸𫎺𫏃𫏆𫏋𫏌𫏐𫏑𫏕𫏞𫏨𫐄𫐅𫐆𫐇𫐈𫐉𫐊𫐋𫐌𫐍𫐎𫐏𫐐𫐑𫐒𫐓𫐔𫐕𫐖𫐗𫐘𫐙𫐷𫑘𫑡𫑷𫓥𫓦𫓧𫓨𫓩𫓪𫓫𫓬𫓭𫓮𫓯𫓰𫓱𫓲𫓳𫓴𫓵𫓶𫓷𫓸𫓹𫓺𫓻𫓼𫓽𫓾𫓿𫔀𫔁𫔂𫔃𫔄𫔅𫔆𫔇𫔈𫔉𫔊𫔋𫔌𫔍𫔎𫔏𫔐𫔑𫔒𫔓𫔔𫔕𫔖𫔭𫔮𫔯𫔰𫔲𫔴𫔵𫔶𫔽𫕚𫕥𫕨𫖃𫖅𫖇𫖑𫖒𫖓𫖔𫖕𫖖𫖪𫖫𫖬𫖭𫖮𫖯𫖰𫖱𫖲𫖳𫖴𫖵𫖶𫖷𫖸𫖹𫖺𫗇𫗈𫗉𫗊𫗋𫗚𫗞𫗟𫗠𫗡𫗢𫗣𫗤𫗥𫗦𫗧𫗨𫗩𫗪𫗫𫗬𫗭𫗮𫗯𫗰𫗱𫗳𫗴𫗵𫘛𫘜𫘝𫘞𫘟𫘠𫘡𫘣𫘤𫘥𫘦𫘧𫘨𫘩𫘪𫘫𫘬𫘭𫘮𫘯𫘰𫘱𫘽𫙂𫚈𫚉𫚊𫚋𫚌𫚍𫚎𫚏𫚐𫚑𫚒𫚓𫚔𫚕𫚖𫚗𫚘𫚙𫚚𫚛𫚜𫚝𫚞𫚟𫚠𫚡𫚢𫚣𫚤𫚥𫚦𫚧𫚨𫚩𫚪𫚫𫚬𫚭𫛚𫛛𫛜𫛝𫛞𫛟𫛠𫛡𫛢𫛣𫛤𫛥𫛦𫛧𫛨𫛩𫛪𫛫𫛬𫛭𫛮𫛯𫛰𫛱𫛲𫛳𫛴𫛵𫛶𫛷𫛸𫛹𫛺𫛻𫛼𫛽𫛾𫜀𫜁𫜂𫜃𫜄𫜅𫜊𫜑𫜒𫜓𫜔𫜕𫜙𫜟𫜨𫜩𫜪𫜫𫜬𫜭𫜮𫜯𫜰𫜲𫜳𫝈𫝋𫝦𫝧𫝨𫝩𫝪𫝫𫝬𫝭𫝮𫝵𫞅𫞗𫞚𫞛𫞝𫞠𫞡𫞢𫞣𫞥𫞦𫞧𫞨𫞩𫞷𫟃𫟄𫟅𫟆𫟇𫟑𫟕𫟞𫟟𫟠𫟡𫟢𫟤𫟥𫟦𫟫𫟬𫟲𫟳𫟴𫟵𫟶𫟷𫟸𫟹𫟺𫟻𫟼𫟽𫟾𫟿𫠀𫠁𫠂𫠅𫠆𫠇𫠈𫠊𫠋𫠌𫠏𫠐𫠑𫠒𫠖𫠜𫢸𫧃𫧮𫫇𫬐𫭟𫭢𫭼𫮃𫰛𫵷𫶇𫷷𫸩𬀩𬀪𬂩𬃊𬇕𬇙𬇹𬉼𬊈𬊤𬍛𬍡𬍤𬒈𬒗𬕂𬘓𬘘𬘡𬘩𬘫𬘬𬘭𬘯𬙂𬙊𬙋𬜬𬜯𬞟𬟁𬟽𬣙𬣞𬣡𬣳𬤇𬤊𬤝𬨂𬨎𬩽𬪩𬬩𬬭𬬮𬬱𬬸𬬹𬬻𬬿𬭁𬭊𬭎𬭚𬭛𬭤𬭩𬭬𬭭𬭯𬭳𬭶𬭸𬭼𬮱𬮿𬯀𬯎𬱖𬱟𬳵𬳶𬳽𬳿𬴂𬴃𬴊𬶋𬶍𬶏𬶐𬶟𬶠𬶨𬶭𬶮𬷕𬸘𬸚𬸣𬸦𬸪𬸯𬹼𬺈𬺓𰬸𰰨𰶎𰻝𰾄𰾭𱊜万云丰发叶宁广厂历复苏坛坝钟证药种团柜闲烟雇确签鉴赞准别划";
  const gcLineAddressS2TTo = "傌偑㑳倲㑯儸𠗣劏劃劚噚喎㘚㜄媰𡞵𡢃㜏孋𡠹㠏𡾱嵾幓㥮懤慺掆㩳撝擓擽㩜棡椲𣙎樢樫殰殨瀇濧灡澾濄𣾷瀰潚鸂燶煱獱璯𤫩𤪺䁻瞜碽磾稏穇𥢢筴籔䊷紬縳絅䋙䋚綐綵䋻䋹繿繸䍦䎱膞𦪙薵薳藭罃螮𧝞𧜗𧜵䙡襬訢鿁𧩙䜀讌貙𧵳䝼𧶧賰躎𨊰𨊸𨋢釾鏺䥱𨯅𨦫𨧜䥇鐯鐥钁䦛䦟靦𩞯𩣑騧䯀䱽𩶘鮣鰆鰌鰧䱷鳾鵁鴷鶄鶪鷉鸊龑與專業叢東絲丟兩嚴喪臨爲麗舉麼義烏樂喬習鄉書買亂爭虧亞產畝親褻嚲億僅從倉儀們衆優會傴傘偉傳俥俔傷倀倫傖僞佇體僉俠侶僥偵側僑儈儕儂儘俁儔儼倆儷倈儉債傾傯僂僨償儎儻儐儲儺兒兌兗蘭關興茲養獸囅內岡冊寫軍農馮決況凍淨涼減湊凜鳳鳧憑凱擊鑿芻劉則剛創刪剗剄剎劊㓨劌剴劑剮劍剝劇勸辦務勱動勵勁勞勢勩勻匭匱區醫華協單賣盧臥衛卻巹廳厲壓厭厙龎廁廂厴廈廚廄廝縣叄靉靆雙變敘疊號嘰嚇呂嗎噸聽啓吳吶嘸囈嘔嚦唄員咼嗆嗚詠嚨嚀噝吒響啞噠嘵嗶噦噲嚌噥喲嘜嗊嘮啢嗩喚嘖嗇囀嘓囉嘽嘯噴嘍嚳囁噯噓嚶囑嚕囂園囪圍圇國圖圓聖壙場壞塊堅壢塢墳墜壟壠壚壘墾堊墊埡墶壋塏堖塒堝塹墮壪牆壯聲殼壺壼處備夠頭奪奩奐奮獎奧妝婦媽嫵嫗嬀姍奼婁婭嬈嬌孌娛媧嫿嬰嬋嬸媼嬃嬡嬪嬙嬤孫學孿寶實寵審憲宮寬賓寢對尋導壽將爾塵堯尷層屓屜屆屬屢屨嶼歲豈嶇崗峴嵐島嶺崬巋嶨嶧峽嶢嶠崢巒峯嶗崍嶮嶄嶸嶔嶁巔鞏巰幣帥師幃帳幟帶幀幫幬幘幗冪莊慶牀廬廡庫應廟龐廢廎廩開異棄弒張弳彎彈強歸彠彥彲徹徠憶懺憂愾懷態慫憮慪悵愴憐總懟懌戀恆懇慟懨愷惻惱惲悅愨懸慳悞憫驚懼慘懲憊愜慚憚慣慍憤憒懾憖懣懶懍戇戔戲戧戰戩戱戶撲執擴捫掃揚擾撫拋摶摳掄搶護報擔擬攏揀擁攔擰撥擇摯攣掗撾撻挾撓擋撟掙擠揮撏挩撈損撿換搗擄摑擲撣摻摜攬搵撳攙擱摟揯攪攜攝攄搖擯攤攖撐攆擷擼攛㩵擻攢敵敓斂斆數齋斕斬斷無舊時曠暘曇暱晝曨顯晉曬曉曄暈暉暫𣈶曖機殺雜權條來楊榪構樅樞棗櫪梘棖楓梟檸檉梔柵標棧櫛櫳棟櫨櫟欄樹棲樣欒椏橈楨檔榿橋樺檜槳樁樳夢檮棶槤檢梲欞槨槼櫝槧槶欏樿橢槮樓欖榲櫬櫚櫸樧檟檻檳櫧橫檣櫻櫫櫥櫓櫞檁歡歟歐殲歿殤殘殞殮殫殯毆轂畢斃氈毿𣯶氌氣氫氬氳漢湯洶澐溝沒灃漚瀝淪滄渢潙滬濘淚澩瀧瀘濼瀉潑澤涇潔灑窪浹淺漿澆湞溮濁測澮濟瀏滻渾滸濃潯濜涗濤澇淶漣潿渦溳渙滌潤澗漲澀淵淥漬瀆漸澠漁瀋滲溫灣溼濚潰濺漵漊潷滾滯灄滿瀅濾濫灤濱灘澦瀠瀟瀲濰潛瀦瀂瀾瀨瀕灝滅燈靈竈災燦煬爐燉煒熗點熾爍爛烴燭煩燒燁燴燙燼熱煥燜燾熅愛爺牘犛牽犧犢狀獷獁猶狽獮獰獨狹獅獪猙獄猻獫獵獼玀豬貓蝟獻獺璣璵瑒瑪瑋環現瑲璽琺瓏璫琿璡璉瑣瓊瑤璦璸瓔瓚甕甌電畫暢疇癤療瘧癘瘍癧瘲瘡瘋皰痾癰痙癢瘂癆瘓癇癡癉瘮瘞瘻癟癱癮癭癩癬癲皚皺皸盞鹽監蓋盜盤瞘眥矓睜睞瞼瞶瞞矚矯磯礬礦碭碼磚硨硯碸礪礱礫礎硜碩硤磽磑礄磠礙磧磣鹼禮禡禕禰禎禱禍稟祿禪離禿稈祕積稱穢穠穭稅穌穩穡穭窮竊竅窵窯竄窩窺竇窶豎競篤筍筆筧箋籠籩篳篩簹箏籌篔篠簡籙簀篋籜籮簞簫簣簍籃籛籬籪籟糴類秈糶糲粵糞糧糉糝餱餈緊縶縕緪糹糾紆紅紂紇約級紈纊紀紉緯紜紘純紕紗綱納紝縱綸紛紙紋紡紵紖紐紓線紺紲紱練組紳細織終縐絆紼絀紹繹經紿綁絨結絝繞絰絎繪給絢絳絡絕絞統綆綃絹繡綌綏絛繼綈績緒綾緓續綺緋綽緄繩維綿綬綢綯綹綣綜綻綰綠綴緇緙緗緘緬纜緹緲緝縕繢緦綞緞緶線緱縋緩締縷編緡緣縉縛縟縝縫縗縞纏縭縊縑繽縹縵縲纓縮繆繅纈繚繕繒繮繾繰繯繳纘罌網羅罰罷羆羈羥羨羣翹翽翬耮耬聳恥聶聾職聹聯聵聰肅腸膚骯餚腎腫脹脅膽朧腖臚脛膠脈膾臍腦膿臠腳脫腡臉膕齶膩靦膃騰臏臢輿艤艦艙艫艱藝節羋薌蕪蘆蓯葦藶莧萇蒼苧薴莖蘢蔦塋煢繭荊薘莢蕘蓽萴蕎薈薺榮葷滎犖熒蕁藎蓀蕒葒葤蒞萊蓮蒔萵薟蕕瑩鶯蓴蘀蘿螢營縈蕭薩蔥蒕蕆蕢蔣蔞醟藍薊蘺蕷鎣驀虆薔蘞藺藹薀蘄蘊藪蘚蘊櫱虜慮虛虯蟣蝨雖蝦蠆蝕蟻螞蠁蠶蜆蠱蠣蟶蠻蟄蛺蟯螄蠐蛻蝸蠅蟈蟬螻蠑螿蟎蠨釁銜補襯袞襖褘襪襲襏裝襠褌褳襝褲褸襤襴見觀覎規覓視覘覽覺覬覡覿覥覦覯覲覷觴觸觶誾讋譽謄訁計訂訃認譏訐訌討讓訕訖託訓議訊記訒講諱謳詎訝訥許訛論訩訟諷設訪訣詁訶評詛識詗詐訴診詆謅詞詘詔詖譯詒誆誄試詿詩詰詼誠誅詵話誕詬詮詭詢詣諍該詳詫諢詡譸誡誣語誚誤誥誘誨誑說誦誒請諸諏諾讀諑誹課諉諛誰諗調諂諒諄誶談讅誼謀諶諜謊諫諧謔謁謂諤諭諼讒諮諳諺諦謎諞諝謨讜謖謝謠謗謙謐謹謾謫譾謬譚譖譙讕譜譎讞譴譫讖豶貝貞負貟貢財責賢敗賬貨質販貪貧貶購貯貫貳賤賁貰貼貴貺貸貿費賀貽賊贄賈賄貲賃賂贓資賅贐賕賑賚賒賦賭齎贖賞賜贔賙賡賠賧賴賵贅賻賺賽賾贇贈贍贏贛赬趙趕趨趲躉躍蹌躒踐躂蹺蹕躚躋躊蹤躓躑躡蹣躕躥躪躦軀轀車軋軌軒軑軔轉軛輪軟轟軲軻轤軸軹軼軤軫轢軺輕軾載輊轎輈輇輅較輒輔輛輦輩輝輥輞輬輟輜輳輻輯轀輸轡轅轄輾轆轍轔辭辯辮邊遼達遷過邁運還這進遠違連遲邇逕選遜遞邐邏遺遙鄧鄺鄔郵鄒鄴鄰郟鄶鄭鄆酈鄖鄲酇醞醱醬釅釃釀醞釋鑾鏨釒釓釔釘釗釙釕釷釺釧釤鈒釩釣鍆釹鍚釵鈃鈣鈈鈦鉅鈍鈔鈉鋇鋼鈑鈐欽鈞鎢鉤鈧鈥鈄鈕鈀鈺錢鉦鉗鈷鉢鈳鉕鈽鈸鉞鉬鉭鉀鈿鈾鐵鉑鈴鑠鉛鉚鉋鈰鉉鉈鉍鈮鈹鐸鉶銬銠鉺鋩錏銪鋮鋏鋣鐃銍鐺銅鋁銱銦鎧鍘銖銑鋌銩銛鏵銓鎩鉿銚鉻銘錚銫鉸銥銃鐋銨銀銣鑄鐒鋪鋙錸鋱鏗銷鎖鋰鋥鍋鋯鋨鏽銼鋝鋒鋅鋶鐦鐧銳銻鋃鋟鋦錒錆鍺鍩錯錨錛錡鍀錁錕錩錫錮鑼錘錐錦鑕鍁錈鍃錟錠鍵鋸錳錙鍥鍈鍇鏘鍶鍔鍤鍬鍾鍛鎪鍠鍰鎄鍍鎂鏤鎡鐨鎇鏌鎮鎛鎘鑷鐫鎳鎦鎬鎊鎰鎵鑌鎔鏢鏜鏝鏍鏰鏞鏡鏑鏃鏇鏐鐔鐐鏷鑥鐓鑭鐠鑹鏹鐙鑊鐳鐶鐲鐿鑔鑣鑞鑱鑲長門閂閃閆閈閉問闖閏闈閎間閔閌悶閘鬧閨聞闥閩閭闓閥閣閡閫鬮閱閬闍閾閹閶鬩閿閽閻閼闡闌闃闠闊闋闔闐闒闕闞闤隊陽陰陣階際陸隴陳陘陝隯隉隕險隨隱隸雋難雛讎靂霧霽黴霢靄靚靝靜靨韃鞽韉韝韋韌韍韓韙韞韜韻頁頂頃頇項順頊頑顧頓頎頒頌頏預顱領頗頸頡頰頲頜潁熲頦頤頻頮頹頷頴穎顆題顒顎顓顏額顳顢顛顙顥纇顫顬顰顴風颺颭颮颯颶颸颼颻飀飄飆飈飛饗饜飠飣飥餳飩餼飪飫飭飯飲餞飾飽飼飿飴餌饒餉餄餎餃餏餅餑餖餓餘餒餕餜餛餡館餷饋餶餿饞饁饃餺餾饈饉饅饊饌饢馬馭馱馴馳驅馹駁驢駔駛駟駙駒騶駐駝駑駕驛駘驍罵駰驕驊駱駭駢驫驪騁驗騂駸駿騏騎騍騅騌驌驂騙騭騤騷騖驁騮騫騸驃騾驄驏驟驥驦驤髏髖髕鬢鬹魘魎魚魛魢魷魨魯魴䰾魺鮁鮃鮎鱸鮋鮓鮒鮊鮑鱟鮍鮐鮭鮚鮳鮪鮞鮦鰂鮜鱠鱭鮫鮮鮺鯗鱘鯁鱺鰱鰹鯉鰣鰷鯀鯊鯇鮶鯽鯒鯖鯪鯕鯫鯡鯤鯧鯝鯢鯰鯛鯨鰺鯴鯔鱝鰈鰏鱨鯷鰮鰃鰓鱷鰍鰒鰉鰁鱂鯿鰠鰲鰭鰨鰥鰩鰟鰜鰳鰾鱈鱉鰻鰵鱅䲁鰼鱖鱔鱗鱒鱯鱤鱧鱣䲘鳥鳩雞鳶鳴鳲鷗鴉鶬鴇鴆鴣鶇鸕鴨鴞鴦鴒鴟鴝鴛鷽鴕鷥鷙鴯鴰鵂鴴鵃鴿鸞鴻鵐鵓鸝鵑鵠鵝鵒鵜鵡鵲鶓鵪鵾鵯鵬鵮鶉鶊鵷鷫鶘鶡鶚鶻鶖鷀鶥鶩鷊鷂鶲鶹鶺鷁鶼鶴鷖鸚鷓鷚鷯鷦鷲鷸鷺䴉鸇鷹鸌鸏鸛鸘鹺麥麩麴麪麼黃黌黶黷黲黽黿鼂鼉鼴齊齏齒齔齕齗齟齡齙齠齜齦齬齪齲齷龍龔龕龜䃮䥑鿓鎶𠁞儣𠌥俓㒓𠏢儭𠠎剾𠞆𪟖勑嗰哯噅㘉嚧囃𡅏𡃕𡄔𡄣㗲𡓾𡑭壗𡔖壈㜷㜗㜢孎孻𡮉𡮣𡳳𦘧嵼𡽗嶈嶘㢝㦛𢤱𢣚𢣭愻憹𢠼憢懀㦎懎𤢻戰𢷮𢶫摋擫𢹿擣斅斸曥𣋋𦢈腪脥臗槫桱欍𣠲楇橯樤樠欓㰙㯤𣞻檭𣝕欘𣠩殢𣯴𣯩氭湋潕㵗澅𣿉𪷓𤅶濆灙𤁣瀃熓㷍爄熌爖熚熉㷿𤒎𤓩熡𤓎𤑳𤛮𤢟獩玁㺏瓕瓛𤳸癐𤸫㿗㿧皟麬䀉𥌃䀹𥊝瞤䁪䂎礒𥖅𥕥碙𥞵𥨐竚𥪂籅䉙籋篘𥵊𥸠䉲篸𥵃𥼽䊭𥽖𥿊緷綇綀繟緍縺緸𦂅䋿縎緰䌈𦃄䌋䌰縬繓䌖繏䌟䌝䌥繻䍽朥膢𦣎𦪽蓧䕳爇𦾟蘟𧕟䗿𧎈蠙蠀蠾𧔥䙱襰𧟀詀𧳟䞈買𧶔賬䝻賟贃𨇁躘𨄣𨅍𨈊𨈌䠱𨇞躝軉軗𨊻𨏠輄𨎮𨏥䢨𨣞𨣧𨢿𨣈𨤻鎷釳𨥛鈠鈋鈲鈯鉁龯銶鋉鍄𨧱錂鏆鎯鍮鎝𨫒鐄鏉鐎鐏𨮂䥩䦳𨳕𨳑閍閐䦘𨴗𨵩𨵸𨶀𨶏𨶲𨶮𨷲𨽏䧢䪏𩏪𩎢䪘䪗顂𩓣顃䫴颰𩗀䬞𩘹𩘀颷颾𩘺𩘝䬘䬝𩙈𩚛𩚥𩚵𩛆𩛩𩟐𩜦䭀䭃𩜇𩜵𩝔餸𩞄𩞦𩠴𩡣𩡺駎𩤊䮾駚𩢡䭿𩢾驋䮝𩥉駧𩢸駩𩢴𩣏𩣫駶𩣵𩣺䮠騔䮞驄騝騪𩤸𩤙䮫騟𩤲騚𩥄𩥑𩥇龭䮳𩧆䯤𩭙𩰀鬖𩯳𩰹𩳤𩴵魥𩵩𩵹鯶𩶱鮟𩶰鯄䲖鮸𩷰𩸃𩸦鯱䱙䱬䱰鱇𩽇䲰鳼𩿪𪀦鴲鴜𪁈鷨𪀾𪁖鵚𪂆𪃏𪃍鷔𪄕𪄆𪇳䴬麲麨䴴麳䵳𪔵𪘀𪘯𠿕凙㔋勣𧷎㓄𠬙唓㖮嚛𠽃噹嘺嘪噞嗹㗿嘳𡃄㘓𡃤𡂡嚽𡅯囒圞墲埬堚塿𡓁壣𧹈孇嬣嬻孾寠㞞屩崙𡸗輋巗𡹬㟺巊巘𡿖幝幩廬㢗廧𢍰彃徿𢤩㦞憸𢣐𢤿𢯷摐擟𢶒掚撊㨻㩋撧𢺳攋㪎曊膹梖櫅欐檵櫠欇𣜬欑毊霼濿溡𤄷𣽏㵾灒熂煇𤑹𤓌爥𤒻𤘀𤜆犞獊𤠮㺜猌瑽瓄瑻璝㻶𤬅畼𤳷痮𤷃㿖𤺔瘱盨睍眝矑矉𥏝𥖲礮𥗇𥜰𥜐䅐䅳𥢷䆉竱鴗𥶽䉑𥯤䉶𥴼簢簂䉬𥴨𥻦𩏷糺䊺紟䋃𥾯䋔絁絙絧絥繷繨纚𦀖綖絺䋦𦅇綟緤緮䋼𦃩縍繬縸縰繂𦅈繈繶纁纗䍤羵𦒀䎙𦔖聻𦟼𦡝𦧺艣𦱌蔿蒭蕽蕳葝蔯蕝薆藷䗅蠦蟜𧒯蟳蟂蟘䙔襗襓襘襀襵𧞫覼覛𧡴𧢄覹䚩𧭹訑訞訜詓諫𧦝𧦧䛄詑譊詷譑誂譨誺誫諣誋䛳誷𧩕誳諴諰諯謏諥謱謸𧩼謉謆謯𧫝譆𧬤譞𧭈譾豵貗贚䝭𧸘賝䞋贉贑䞓䟐䟆𧽯䟃䠆蹳蹻𨂐蹔𨇽𨆪𨇰𨇤軏軕轣軜軷軨軬𨎌軿𨌈輢輖輗輨輷輮𨍰轊轇轐轗轠遱鄟鄳醶釟釨鈇鈛鏦鈆𨥟鉔鉠𨪕銈銊鐈銁𨰋鉾鋠鋗𫒡錽錤鐪錜𨨛錝錥𨨢鍊鐼鍉𨰲鍒鎍䥯鎞鎙𨰃鏥䥗鏾鐇鐍𨬖𨭸𨭖𨮳𨯟鑴𨰥𨲳開閒閗閞𨴹閵䦯闑𨼳𩀨霣𩅙靧䪊鞾𩎖韠𩏂韛韝𩏠𩑔䪴䪾𩒎顗頫䫂䫀䫟頵𩔳𩓥顅𩔑願顣䫶䫻𩗓𩗴䬓飋𩟗飦䬧餦𩚩飵飶𩛌餫餔餗𩛡饠餧餬餪餵餭餱䭔䭑𩝽饘饟馯馼駃駞駊駤駫駻騃騉騊騄騠騜騵騴騱騻䮰驓驙驨鬠𩯁鱮魟鰑鱄魦魵𩶁䱁䱀鮅鮄鮤鮰鰤鮆鮯𩻮鯆鮿鮵䲅𩸄鯬𩸡䱧鯞鰋鯾鰦鰕鰫鰽𩻗𩻬鱊鱢𩼶鱲鳽鳷鴀鴅鴃鸗𩿤鴔鸋鴥鴐鵊鴮𪀖鵧鴳鴽鶰䳜鵟䳤鶭䳢鵫鵰鵩鷤鶌鶒鶦鶗𪃧䳧𪃒䳫鷅𪆷鷐鷩𪅂鷣鷷䴋𪉸麷䴱𪌭䴽𪍠䵴𪓰䶕齧齩𫜦齰齭齴𪙏齾龓䶲㑮𠐊㛝㜐媈嬦𡟫婡嬇孆孄嶹𦠅潣澬㶆灍爧爃𤛱㹽珼璾𤩂璼璊𥢶絍綋綡緟𦆲䖅䕤訨詊譂誴䜖䡐䡩䡵𨞺𨟊釚釲鈖鈗銏鉝鉽鉷䤤銂鐽𨧰𨩰鎈䥄鑉閝韚頍𩖰䫾䮄騼𩦠𩵦魽䱸鱆𩿅齯僤𣍐𪋿噁㘔塸埨𡑍墠娙㠣嵽廞彄暐晛梜櫍澫浿漍熰燖燀瓅璗璕礐𥗽篢紃紞絪綎綄綪綝綧縯纆纕蔄䓣蘋虉蝀訏詝諓詪諲諟譓軝輶鄩醲釴錀鋹釿鉥鉮鑪鉊鉧𨧀鋐錞𨨏鍭鎓鏏鏚䥕𨭎𨭆鏻鐩闉隑隮隤頔頠駓駉駪駼騑騞驎鮈鮀鮠鮡鯻鰊鱀鰶鱚鵏鶠鸑鶱鷟鷭鷿齘齮齼繐菕譅𰻞鋂鑀𪈼萬雲豐發葉寧廣廠歷復蘇壇壩鍾證藥種團櫃閒煙僱確簽鑑讚準別劃";
  const gcLineAddressTwVariantFrom = "僞啓喫嫺嬀峯幺棱樑檐污泄潙潨爲牀痹癡皁着睾祕竈糉繮纔羣脣蔘蔿衆裏覈踊鉢鍼鮎麪齶";
  const gcLineAddressTwVariantTo = "偽啟吃嫻媯峰么稜梁簷汙洩溈潀為床痺痴皂著睪秘灶粽韁才群唇參蒍眾裡核踴缽針鯰麵顎";
  const gcLineAddressPhraseS2T = [
    ['美发', '美髮'],
    ['理发', '理髮'],
    ['发廊', '髮廊'],
    ['发型', '髮型'],
    ['护发', '護髮'],
    ['染发', '染髮'],
    ['剪发', '剪髮'],
    ['头发', '頭髮'],
    ['发艺', '髮藝'],
    ['钟表', '鐘錶'],
    ['钟楼', '鐘樓'],
    ['时钟', '時鐘'],
    ['闹钟', '鬧鐘'],
    ['重复', '重複'],
    ['复合', '複合'],
    ['复杂', '複雜'],
    ['复制', '複製'],
    ['复印', '複印'],
    ['复数', '複數']
  ];
  let gcLineAddressS2TMap = null;
  let gcLineAddressTwVariantMap = null;

  function traditionalizeLineAddress(value) {
    if (!value) return value;
    let text = String(value);
    gcLineAddressPhraseS2T.forEach(([source, target]) => {
      text = text.split(source).join(target);
    });
    if (!gcLineAddressS2TMap) {
      const from = Array.from(gcLineAddressS2TFrom);
      const to = Array.from(gcLineAddressS2TTo);
      gcLineAddressS2TMap = new Map(from.map((char, index) => [char, to[index]]));
    }
    if (!gcLineAddressTwVariantMap) {
      const from = Array.from(gcLineAddressTwVariantFrom);
      const to = Array.from(gcLineAddressTwVariantTo);
      gcLineAddressTwVariantMap = new Map(from.map((char, index) => [char, to[index]]));
    }
    return Array.from(text, char => {
      const converted = gcLineAddressS2TMap.get(char);
      return converted ? (gcLineAddressTwVariantMap.get(converted) || converted) : char;
    }).join('');
  }

  window.GC_traditionalizeDispatchAddress = traditionalizeLineAddress;

  function transformMessage(text) {
    let lines = String(text).split('\n').filter(line => !/[•・]\s*(跨縣市方向|行程方向|車輛資訊|車輛停放位置|乘車需求|補充資訊)\s*：/.test(line));
    if (isDriver || isFare) return lines.join('\n');
    if (!isCall || !/^🚕💨 我要【(?:預約)?叫車】/.test(lines[0] || '')) return lines.join('\n');
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
      window.GC_bindSmallDisclosureTriggers?.();
      window.GC_installManagedDisclosureBehavior?.();
      setTimeout(() => window.GC_bindSmallDisclosureTriggers?.(), 0);
      setTimeout(() => window.GC_bindSmallDisclosureTriggers?.(), 120);
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
    if (document.querySelector('.error-card')) {
      clearInterval(timer);
      return;
    }
    tries += 1;
    applyOnce();
    patchSend();
    if ((applied && (sendPatched || new URLSearchParams(location.search).get('preview') === '1')) || tries >= 400) clearInterval(timer);
  }, 50);
  window.addEventListener('gc:liff-settled', event => {
    if (event.detail?.ready) patchSend();
    else clearInterval(timer);
  }, { once: true });
})();
