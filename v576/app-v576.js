(() => {
  'use strict';

  const CONFIG = window.GC_FORM_CONFIG || {};
  const COMMON = CONFIG.common || {};
  const app = document.getElementById('app');
  const preview = new URLSearchParams(location.search).get('preview') === '1';
  const brandAvatarUrl = `表格頭像_直接更換.png?v=${Date.now()}`;
  const RELEASE_MARKER = 'GC_V576_FORMAL_SERVICE_TYPE';
  const RECENT_STORAGE_KEY = 'gc_recent_addresses_v1';
  const RECENT_LIMIT = 3;
  let pendingConfirmAction = null;
  let confirmationBusy = false;
  let pendingRecentClearAction = null;

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const requiredLabel = (text) => `<span class="required">${escapeHtml(text)}</span>`;

  function renderBrand() {
    return `
      <header class="brand-header" data-release="${RELEASE_MARKER}">
        <img class="brand-avatar" src="${brandAvatarUrl}" alt="GC 車隊頭像">
        <div class="brand-copy">
          <strong>${escapeHtml(COMMON['品牌名稱'] || 'GC 台中白牌車隊 24H')}</strong>
          <span>安全｜專業｜可靠｜貼心</span>
        </div>
      </header>`;
  }

  function renderQr() {
    document.title = COMMON['品牌名稱'] || 'GC 台中白牌車隊 24H';
    app.innerHTML = `<section class="qr-page"><img src="IMG_1323.jpeg" alt="GC 官方 QR Code"></section>`;
  }

  function renderFatal(title, message) {
    app.innerHTML = `
      ${renderBrand()}
      <section class="error-card">
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(message)}</p>
      </section>`;
  }

  function fieldText(id, label, placeholder, required = false, type = 'text') {
    return `
      <div class="field">
        <label for="${id}">${required ? requiredLabel(label) : escapeHtml(label)}</label>
        <input class="input" id="${id}" name="${id}" type="${type}" placeholder="${escapeHtml(placeholder || '')}" ${required ? 'required' : ''} autocomplete="off">
        <div class="error-text" id="${id}Error"></div>
      </div>`;
  }

  function fieldAddress(id, label, placeholder, required = false) {
    return `
      <div class="field address-field">
        <label for="${id}">${required ? requiredLabel(label) : escapeHtml(label)}</label>
        <input class="input" id="${id}" name="${id}" type="text" placeholder="${escapeHtml(placeholder || '')}" ${required ? 'required' : ''} autocomplete="street-address">
        <div class="recent-address-control hidden" data-target="${id}">
          <button class="recent-toggle" type="button" aria-expanded="false">
            <span>🕘 ${escapeHtml(COMMON['最近地址標題'] || '最近使用地址')}</span>
            <span class="recent-count"></span>
            <span class="recent-chevron" aria-hidden="true">⌄</span>
          </button>
          <div class="recent-panel hidden"></div>
        </div>
        <div class="error-text" id="${id}Error"></div>
      </div>`;
  }

  function fieldTextarea(id, label, placeholder) {
    return `
      <div class="field">
        <label for="${id}">${escapeHtml(label)}</label>
        <textarea id="${id}" name="${id}" placeholder="${escapeHtml(placeholder || '')}"></textarea>
      </div>`;
  }

  function modeChoices(cfg) {
    return `
      <div class="field">
        <div class="field-label required">服務類型</div>
        <div class="segmented">
          <label class="choice">
            <input type="radio" name="serviceType" value="instant">
            <span>${escapeHtml(cfg['即時選項'])}</span>
          </label>
          <label class="choice">
            <input type="radio" name="serviceType" value="reserve">
            <span>${escapeHtml(cfg['預約選項'])}</span>
          </label>
        </div>
        <div class="error-text" id="serviceTypeError"></div>
      </div>`;
  }

  function scheduleFields(cfg) {
    return `
      <div id="scheduleFields" class="schedule-grid hidden">
        <div class="field" style="margin-bottom:0">
          <label for="date">${requiredLabel(cfg['日期標題'])}</label>
          <input class="input" id="date" name="date" type="date">
          <div class="error-text" id="dateError"></div>
        </div>
        <div class="field" style="margin-bottom:0">
          <label for="time">${requiredLabel(cfg['時間標題'])}</label>
          <input class="input" id="time" name="time" type="time">
          <div class="error-text" id="timeError"></div>
        </div>
      </div>`;
  }

  function renderReminderNotice(cfg) {
    const reminderLines = [];
    for (let i = 1; i <= 6; i += 1) {
      const text = cfg[`表格提醒${i}`];
      if (text) reminderLines.push(`<p>${escapeHtml(text)}</p>`);
    }
    return reminderLines.length ? `<div class="notice">${reminderLines.join('')}</div>` : '';
  }

  function directionChoices(cfg) {
    return `
      <div class="field">
        <div class="field-label">${escapeHtml(cfg['行程方向標題'])}</div>
        <div class="choice-row">
          <label class="choice">
            <input type="radio" name="direction" value="${escapeHtml(cfg['行程方向選項1'])}">
            <span>${escapeHtml(cfg['行程方向選項1'])}</span>
          </label>
          <label class="choice">
            <input type="radio" name="direction" value="${escapeHtml(cfg['行程方向選項2'])}">
            <span>${escapeHtml(cfg['行程方向選項2'])}</span>
          </label>
        </div>
      </div>`;
  }

  function normalizeAddress(address) {
    return String(address || '').replace(/\s+/g, ' ').trim();
  }

  function loadRecentAddresses() {
    try {
      const parsed = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      const unique = [];
      for (const item of parsed) {
        const address = normalizeAddress(item);
        if (!address) continue;
        if (!unique.some(existing => existing.toLocaleLowerCase() === address.toLocaleLowerCase())) {
          unique.push(address);
        }
        if (unique.length >= RECENT_LIMIT) break;
      }
      return unique;
    } catch (_) {
      return [];
    }
  }

  function saveRecentAddresses(addresses) {
    try {
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(addresses.slice(0, RECENT_LIMIT)));
      return true;
    } catch (_) {
      return false;
    }
  }

  function rememberRecentAddresses(addresses) {
    const next = [];
    const candidates = [...addresses, ...loadRecentAddresses()];
    for (const item of candidates) {
      const address = normalizeAddress(item);
      if (!address) continue;
      if (!next.some(existing => existing.toLocaleLowerCase() === address.toLocaleLowerCase())) {
        next.push(address);
      }
      if (next.length >= RECENT_LIMIT) break;
    }
    saveRecentAddresses(next);
    refreshRecentAddressControls();
  }

  function deleteRecentAddress(index) {
    const addresses = loadRecentAddresses();
    if (index < 0 || index >= addresses.length) return;
    addresses.splice(index, 1);
    saveRecentAddresses(addresses);
    refreshRecentAddressControls();
  }

  function clearRecentAddresses() {
    try { localStorage.removeItem(RECENT_STORAGE_KEY); } catch (_) {}
    refreshRecentAddressControls();
  }


  function blurActiveEditor() {
    const active = document.activeElement;
    if (!active) return;
    const tag = active.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
      try { active.blur(); } catch (_) {}
    }
  }

  function keepViewportStable(anchor, mutate, preservedTop = null) {
    const measuredTop = anchor?.getBoundingClientRect().top;
    const startTop = Number.isFinite(preservedTop) ? preservedTop : measuredTop;
    blurActiveEditor();
    mutate();
    if (!anchor || !Number.isFinite(startTop)) return;

    const restore = () => {
      const currentTop = anchor.getBoundingClientRect().top;
      const delta = currentTop - startTop;
      if (Math.abs(delta) > 1) {
        window.scrollBy({ top: delta, left: 0, behavior: 'auto' });
      }
    };

    requestAnimationFrame(() => {
      restore();
      requestAnimationFrame(restore);
    });
    setTimeout(restore, 120);
    setTimeout(restore, 280);
  }

  function refreshRecentAddressControls() {
    const addresses = loadRecentAddresses();
    document.querySelectorAll('.recent-address-control').forEach(control => {
      const panel = control.querySelector('.recent-panel');
      const count = control.querySelector('.recent-count');
      if (!addresses.length) {
        control.classList.add('hidden');
        if (panel) panel.classList.add('hidden');
        return;
      }

      control.classList.remove('hidden');
      if (count) count.textContent = `（${addresses.length}）`;
      if (!panel) return;
      panel.innerHTML = `
        <div class="recent-helper">點選地址即可自動帶入</div>
        <div class="recent-list">
          ${addresses.map((address, index) => `
            <div class="recent-row">
              <button class="recent-use" type="button" data-index="${index}" title="${escapeHtml(address)}">
                <span>${escapeHtml(address)}</span>
              </button>
              <button class="recent-delete" type="button" data-index="${index}">${escapeHtml(COMMON['最近地址刪除'] || '刪除')}</button>
            </div>`).join('')}
        </div>
        <button class="recent-clear" type="button">${escapeHtml(COMMON['最近地址清除全部'] || '清除全部')}</button>`;
    });
  }

  function bindRecentAddressControls() {
    document.querySelectorAll('.recent-address-control').forEach(control => {
      const targetId = control.dataset.target;
      const toggle = control.querySelector('.recent-toggle');
      const panel = control.querySelector('.recent-panel');

      let toggleAnchorTop = null;
      toggle?.addEventListener('pointerdown', () => {
        toggleAnchorTop = toggle.getBoundingClientRect().top;
        blurActiveEditor();
      });

      toggle?.addEventListener('click', () => {
        const willOpen = panel.classList.contains('hidden');
        keepViewportStable(toggle, () => {
          document.querySelectorAll('.recent-panel').forEach(other => other.classList.add('hidden'));
          document.querySelectorAll('.recent-toggle').forEach(other => other.setAttribute('aria-expanded', 'false'));
          panel.classList.toggle('hidden', !willOpen);
          toggle.setAttribute('aria-expanded', String(willOpen));
        }, toggleAnchorTop);
        toggleAnchorTop = null;
      });

      control.addEventListener('click', event => {
        const useButton = event.target.closest('.recent-use');
        if (useButton) {
          const address = loadRecentAddresses()[Number(useButton.dataset.index)];
          const input = document.getElementById(targetId);
          if (address && input) {
            keepViewportStable(toggle, () => {
              input.value = address;
              input.classList.remove('invalid');
              const error = document.getElementById(`${targetId}Error`);
              if (error) error.classList.remove('show');
              panel.classList.add('hidden');
              toggle.setAttribute('aria-expanded', 'false');
              input.dispatchEvent(new Event('input', { bubbles: true }));
              input.dispatchEvent(new Event('change', { bubbles: true }));
            });
          }
          return;
        }

        const deleteButton = event.target.closest('.recent-delete');
        if (deleteButton) {
          deleteRecentAddress(Number(deleteButton.dataset.index));
          return;
        }

        if (event.target.closest('.recent-clear')) {
          openRecentClearModal(clearRecentAddresses);
        }
      });
    });
    refreshRecentAddressControls();
  }

  function renderConfirmationModal() {
    return `
      <div class="confirm-overlay hidden" id="confirmOverlay">
        <section class="confirm-card" role="dialog" aria-modal="true" aria-labelledby="confirmTitle">
          <h2 id="confirmTitle"></h2>
          <p class="confirm-intro">${escapeHtml(COMMON['確認提醒'] || '請確認上、下車地點與資料是否正確。')}</p>
          <div class="confirm-summary" id="confirmSummary"></div>
          <div class="confirm-actions">
            <button class="confirm-back" id="confirmBackBtn" type="button">${escapeHtml(COMMON['確認返回按鈕'] || '返回修改')}</button>
            <button class="confirm-send" id="confirmSendBtn" type="button">${escapeHtml(COMMON['確認送出按鈕'] || '確認送出')}</button>
          </div>
        </section>
      </div>`;
  }


  function renderRecentClearModal() {
    return `
      <div class="recent-clear-overlay hidden" id="recentClearOverlay">
        <section class="recent-clear-card" role="dialog" aria-modal="true" aria-labelledby="recentClearBrand" aria-describedby="recentClearMessage">
          <div class="recent-clear-brand">
            <img src="${brandAvatarUrl}" alt="" aria-hidden="true">
            <strong id="recentClearBrand">${escapeHtml(COMMON['品牌名稱'] || 'GC 台中白牌車隊 24H')}</strong>
          </div>
          <p id="recentClearMessage">${escapeHtml(COMMON['最近地址清除確認'] || '確定要清除全部最近使用地址嗎？')}</p>
          <div class="recent-clear-actions">
            <button class="recent-clear-cancel" id="recentClearCancelBtn" type="button">取消</button>
            <button class="recent-clear-confirm" id="recentClearConfirmBtn" type="button">確定清除</button>
          </div>
        </section>
      </div>`;
  }

  function closeRecentClearModal() {
    const overlay = document.getElementById('recentClearOverlay');
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    pendingRecentClearAction = null;
  }

  function openRecentClearModal(action) {
    const overlay = document.getElementById('recentClearOverlay');
    if (!overlay) return;
    pendingRecentClearAction = action;
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.getElementById('recentClearCancelBtn')?.focus();
  }

  function bindRecentClearModal() {
    const overlay = document.getElementById('recentClearOverlay');
    document.getElementById('recentClearCancelBtn')?.addEventListener('click', closeRecentClearModal);
    document.getElementById('recentClearConfirmBtn')?.addEventListener('click', () => {
      const action = pendingRecentClearAction;
      closeRecentClearModal();
      if (typeof action === 'function') action();
    });
    overlay?.addEventListener('click', event => {
      if (event.target === overlay) closeRecentClearModal();
    });
  }

  function closeConfirmation() {
    const overlay = document.getElementById('confirmOverlay');
    if (overlay) overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
    pendingConfirmAction = null;
    confirmationBusy = false;
  }

  function openConfirmation(title, rows, action) {
    const overlay = document.getElementById('confirmOverlay');
    const titleElement = document.getElementById('confirmTitle');
    const summary = document.getElementById('confirmSummary');
    if (!overlay || !titleElement || !summary) {
      const fallbackText = rows
        .filter(row => row && row.value !== undefined && row.value !== null && String(row.value).trim() !== '')
        .map(row => `${row.label}：${row.value}`)
        .join('\n');
      if (window.confirm(`${title}\n\n${fallbackText}\n\n確定送出嗎？`)) {
        Promise.resolve(action()).catch(error => showGlobalError(error?.message || COMMON['傳送失敗文字']));
      }
      return;
    }
    titleElement.textContent = title;
    summary.innerHTML = rows
      .filter(row => row && row.value !== undefined && row.value !== null && String(row.value).trim() !== '')
      .map(row => `
        <div class="confirm-row${row.emphasis ? ' confirm-row-emphasis' : ''}">
          <span>${escapeHtml(row.label)}</span>
          <strong>${escapeHtml(row.value)}</strong>
        </div>`).join('');

    pendingConfirmAction = action;
    confirmationBusy = false;
    overlay.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.getElementById('confirmSendBtn')?.focus();
  }

  function bindConfirmationModal() {
    document.getElementById('confirmBackBtn')?.addEventListener('click', closeConfirmation);
    document.getElementById('confirmSendBtn')?.addEventListener('click', async () => {
      if (confirmationBusy || !pendingConfirmAction) return;
      confirmationBusy = true;
      const sendButton = document.getElementById('confirmSendBtn');
      const backButton = document.getElementById('confirmBackBtn');
      if (sendButton) {
        sendButton.disabled = true;
        sendButton.textContent = COMMON['傳送中文字'] || '傳送中…';
      }
      if (backButton) backButton.disabled = true;

      try {
        await pendingConfirmAction();
      } catch (error) {
        closeConfirmation();
        showGlobalError(error?.message || COMMON['傳送失敗文字']);
      } finally {
        const currentSendButton = document.getElementById('confirmSendBtn');
        const currentBackButton = document.getElementById('confirmBackBtn');
        if (currentSendButton) {
          currentSendButton.disabled = false;
          currentSendButton.textContent = COMMON['確認送出按鈕'] || '確認送出';
        }
        if (currentBackButton) currentBackButton.disabled = false;
        confirmationBusy = false;
      }
    });
  }

  function renderRideLike(mode, cfg) {
    const isDriver = mode === 'driver';
    const extraFields = isDriver
      ? `${directionChoices(cfg)}
         ${fieldText('vehicle', cfg['車輛資訊標題'], cfg['車輛資訊提示'])}
         ${fieldText('parking', cfg['停車位置標題'], cfg['停車位置提示'])}
         ${fieldTextarea('notes', cfg['備註標題'], cfg['備註提示'])}`
      : `${directionChoices(cfg)}
         ${fieldText('baggage', cfg['行李標題'], cfg['行李提示'])}
         ${fieldText('requirements', cfg['需求標題'], cfg['需求提示'])}
         ${fieldTextarea('notes', cfg['備註標題'], cfg['備註提示'])}`;

    document.title = cfg['頁面標題'];
    app.innerHTML = `
      ${renderBrand()}
      <section class="form-card">
        <div class="form-head">
          <h1>${escapeHtml(cfg['頁面標題'])}</h1>
          <p>${escapeHtml(cfg['頁面說明'])}</p>
        </div>
        <form class="form-body" id="serviceForm" novalidate>
          ${preview ? `<div class="notice preview-notice"><p>${escapeHtml(COMMON['預覽模式提醒'])}</p></div>` : ''}
          <div id="globalError" class="global-error"></div>
          ${modeChoices(cfg)}
          ${scheduleFields(cfg)}
          ${fieldAddress('pickup', cfg['上車標題'], cfg['上車提示'], true)}
          ${fieldAddress('destination', cfg['下車標題'], cfg['下車提示'])}
          ${fieldText('passengers', cfg['人數標題'], cfg['人數提示'])}
          <details class="optional-box">
            <summary>${escapeHtml(cfg['更多資訊標題'])}</summary>
            <div class="optional-content">${extraFields}</div>
          </details>
          ${renderReminderNotice(cfg)}
          <button class="submit-btn" id="submitBtn" type="submit">${escapeHtml(cfg['送出按鈕'])}</button>
        </form>
        ${renderConfirmationModal()}
        ${renderRecentClearModal()}
      </section>`;

    bindRideLike(mode, cfg);
  }

  function renderFare(cfg) {
    document.title = cfg['頁面標題'];
    app.innerHTML = `
      ${renderBrand()}
      <section class="form-card">
        <div class="form-head">
          <h1>${escapeHtml(cfg['頁面標題'])}</h1>
          <p>${escapeHtml(cfg['頁面說明'])}</p>
        </div>
        <form class="form-body" id="serviceForm" novalidate>
          ${preview ? `<div class="notice preview-notice"><p>${escapeHtml(COMMON['預覽模式提醒'])}</p></div>` : ''}
          <div id="globalError" class="global-error"></div>
          ${fieldAddress('pickup', cfg['上車標題'], cfg['上車提示'], true)}
          ${fieldAddress('destination', cfg['下車標題'], cfg['下車提示'], true)}
          ${fieldTextarea('notes', cfg['備註標題'], cfg['備註提示'])}
          ${renderReminderNotice(cfg)}
          <button class="submit-btn" id="submitBtn" type="submit">${escapeHtml(cfg['送出按鈕'])}</button>
        </form>
        ${renderConfirmationModal()}
        ${renderRecentClearModal()}
      </section>`;

    bindFare(cfg);
  }

  function setDateMinimum() {
    const input = document.getElementById('date');
    if (!input) return;
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    input.min = local;
  }

  function clearErrors() {
    document.querySelectorAll('.error-text').forEach(el => {
      el.textContent = '';
      el.classList.remove('show');
    });
    document.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    const global = document.getElementById('globalError');
    if (global) {
      global.textContent = '';
      global.classList.remove('show');
    }
  }

  function showFieldError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}Error`);
    if (input) input.classList.add('invalid');
    if (error) {
      error.textContent = message;
      error.classList.add('show');
    }
  }

  function showNamedError(id, message) {
    const error = document.getElementById(id);
    if (error) {
      error.textContent = message;
      error.classList.add('show');
    }
  }

  function showGlobalError(message) {
    const global = document.getElementById('globalError');
    if (global) {
      global.textContent = message;
      global.classList.add('show');
      global.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function value(id) {
    return (document.getElementById(id)?.value || '').trim();
  }

  function checked(name) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value || '';
  }

  function appendLine(lines, label, data) {
    const symbol = COMMON['訊息欄位符號'] || '•';
    if (data) lines.push(`${symbol} ${label}：${data}`);
  }

  async function sendText(text, cfg) {
    if (preview) return;
    if (!window.liff || !liff.isInClient()) {
      throw new Error(COMMON['非LINE開啟提醒'] || '請從 LINE 聊天室開啟。');
    }
    // sendMessages 不是 liff.isApiAvailable() 支援的檢查名稱。
    // 直接呼叫並由 LINE 回傳實際成功／失敗結果。
    await liff.sendMessages([{ type: 'text', text }]);
  }

  function setSending(sending, cfg) {
    const btn = document.getElementById('submitBtn');
    if (!btn) return;
    btn.disabled = sending;
    btn.textContent = sending ? (COMMON['傳送中文字'] || '傳送中…') : cfg['送出按鈕'];
  }

  function bindRideLike(mode, cfg) {
    setDateMinimum();
    bindRecentAddressControls();
    bindConfirmationModal();
    bindRecentClearModal();

    document.querySelectorAll('input[name="serviceType"]').forEach(input => {
      input.addEventListener('change', () => {
        const reserve = checked('serviceType') === 'reserve';
        document.getElementById('scheduleFields').classList.toggle('hidden', !reserve);
        if (!reserve) {
          document.getElementById('date').value = '';
          document.getElementById('time').value = '';
        }
      });
    });

    let sending = false;
    document.getElementById('serviceForm').addEventListener('submit', event => {
      event.preventDefault();
      if (sending) return;
      clearErrors();

      const serviceType = checked('serviceType');
      const pickup = value('pickup');
      const destination = value('destination');
      let valid = true;

      if (!serviceType) {
        showNamedError('serviceTypeError', cfg['錯誤_用車方式']);
        valid = false;
      }
      if (serviceType === 'reserve' && !value('date')) {
        showFieldError('date', cfg['錯誤_日期']);
        valid = false;
      }
      if (serviceType === 'reserve' && !value('time')) {
        showFieldError('time', cfg['錯誤_時間']);
        valid = false;
      }
      if (!pickup) {
        showFieldError('pickup', cfg['錯誤_上車地址']);
        valid = false;
      }
      if (!valid) return;

      const typeText = serviceType === 'reserve' ? cfg['預約選項'] : cfg['即時選項'];
      const lines = [serviceType === 'reserve' ? cfg['訊息標題_預約'] : cfg['訊息標題_即時']];
      if (cfg['訊息分隔線']) lines.push(cfg['訊息分隔線']);
      appendLine(lines, cfg['訊息欄位_用車方式'], typeText);
      if (serviceType === 'reserve') {
        appendLine(lines, cfg['訊息欄位_日期'], value('date'));
        appendLine(lines, cfg['訊息欄位_時間'], value('time'));
      }
      appendLine(lines, cfg['訊息欄位_上車'], pickup);
      appendLine(lines, cfg['訊息欄位_下車'], destination);
      appendLine(lines, cfg['訊息欄位_方向'], checked('direction'));
      appendLine(lines, cfg['訊息欄位_人數'], value('passengers'));

      if (mode === 'driver') {
        appendLine(lines, cfg['訊息欄位_車輛'], value('vehicle'));
        appendLine(lines, cfg['訊息欄位_停車'], value('parking'));
      } else {
        appendLine(lines, cfg['訊息欄位_行李'], value('baggage'));
        appendLine(lines, cfg['訊息欄位_需求'], value('requirements'));
      }
      appendLine(lines, cfg['訊息欄位_備註'], value('notes'));

      const rows = [
        { label: cfg['訊息欄位_用車方式'], value: typeText },
        ...(serviceType === 'reserve' ? [
          { label: cfg['訊息欄位_日期'], value: value('date') },
          { label: cfg['訊息欄位_時間'], value: value('time') }
        ] : []),
        { label: cfg['訊息欄位_上車'], value: pickup, emphasis: true },
        { label: cfg['訊息欄位_下車'], value: destination || (COMMON['選填未填寫'] || '未填寫（選填）'), emphasis: true },
        ...(checked('direction') ? [{ label: cfg['訊息欄位_方向'], value: checked('direction') }] : []),
        ...(value('passengers') ? [{ label: cfg['訊息欄位_人數'], value: value('passengers') }] : [])
      ];

      if (mode === 'driver') {
        if (value('vehicle')) rows.push({ label: cfg['訊息欄位_車輛'], value: value('vehicle') });
        if (value('parking')) rows.push({ label: cfg['訊息欄位_停車'], value: value('parking') });
      } else {
        if (value('baggage')) rows.push({ label: cfg['訊息欄位_行李'], value: value('baggage') });
        if (value('requirements')) rows.push({ label: cfg['訊息欄位_需求'], value: value('requirements') });
      }
      if (value('notes')) rows.push({ label: cfg['訊息欄位_備註'], value: value('notes') });

      const confirmTitle = mode === 'driver'
        ? (COMMON['確認標題_代駕'] || '請確認代駕資料')
        : (COMMON['確認標題_叫車'] || '請確認叫車資料');

      openConfirmation(confirmTitle, rows, async () => {
        sending = true;
        setSending(true, cfg);
        try {
          await sendText(lines.join('\n'), cfg);
          rememberRecentAddresses([destination, pickup]);
          renderSuccess(cfg, serviceType === 'reserve');
        } catch (error) {
          sending = false;
          setSending(false, cfg);
          throw error;
        }
      });
    });
  }

  function bindFare(cfg) {
    bindRecentAddressControls();
    bindConfirmationModal();
    bindRecentClearModal();

    let sending = false;
    document.getElementById('serviceForm').addEventListener('submit', event => {
      event.preventDefault();
      if (sending) return;
      clearErrors();

      const pickup = value('pickup');
      const destination = value('destination');
      let valid = true;
      if (!pickup) {
        showFieldError('pickup', cfg['錯誤_上車地址']);
        valid = false;
      }
      if (!destination) {
        showFieldError('destination', cfg['錯誤_下車地址']);
        valid = false;
      }
      if (!valid) return;

      const lines = [cfg['訊息標題']];
      if (cfg['訊息分隔線']) lines.push(cfg['訊息分隔線']);
      appendLine(lines, cfg['訊息欄位_上車'], pickup);
      appendLine(lines, cfg['訊息欄位_下車'], destination);
      appendLine(lines, cfg['訊息欄位_備註'], value('notes'));

      const rows = [
        { label: cfg['訊息欄位_上車'], value: pickup, emphasis: true },
        { label: cfg['訊息欄位_下車'], value: destination, emphasis: true },
        ...(value('notes') ? [{ label: cfg['訊息欄位_備註'], value: value('notes') }] : [])
      ];

      openConfirmation(COMMON['確認標題_估價'] || '請確認估價資料', rows, async () => {
        sending = true;
        setSending(true, cfg);
        try {
          await sendText(lines.join('\n'), cfg);
          rememberRecentAddresses([destination, pickup]);
          renderSuccess(cfg);
        } catch (error) {
          sending = false;
          setSending(false, cfg);
          throw error;
        }
      });
    });
  }

  function successLines(cfg, reservation = false) {
    const prefix = reservation ? '成功內容_預約' : '成功內容';
    return Object.keys(cfg)
      .filter(key => key.startsWith(prefix) && /^\d+$/.test(key.slice(prefix.length)))
      .sort((a, b) => Number(a.slice(prefix.length)) - Number(b.slice(prefix.length)))
      .map(key => cfg[key])
      .filter(Boolean);
  }

  function renderSuccess(cfg, reservation = false) {
    const useReservation = reservation === true && Boolean(cfg['成功標題_預約']);
    const title = useReservation ? cfg['成功標題_預約'] : cfg['成功標題'];
    app.innerHTML = `
      ${renderBrand()}
      <section class="success-card">
        <div class="success-icon">✓</div>
        <h1>${escapeHtml(title)}</h1>
        <div class="success-lines">
          ${successLines(cfg, useReservation).map(line => `<p>${escapeHtml(line)}</p>`).join('')}
        </div>
        <button type="button" class="back-btn" id="closeBtn">${escapeHtml(cfg['返回按鈕'])}</button>
      </section>`;

    document.getElementById('closeBtn').addEventListener('click', () => {
      if (preview) {
        history.back();
        return;
      }
      if (window.liff && liff.isInClient()) {
        liff.closeWindow();
      } else {
        history.back();
      }
    });
  }

  async function initialize() {
    const initialParams = new URLSearchParams(location.search);
    const mightBeLiff = initialParams.has('liff.state') || initialParams.has('mode');

    if (!preview && mightBeLiff) {
      try {
        await liff.init({ liffId: CONFIG.liffId });
      } catch (error) {
        renderFatal('表格無法開啟', error?.message || 'LIFF 初始化失敗。');
        return;
      }
    }

    const params = new URLSearchParams(location.search);
    const mode = params.get('mode');

    if (!mode) {
      renderQr();
      return;
    }

    if (!preview && (!window.liff || !liff.isInClient())) {
      renderFatal('請從 LINE 開啟', COMMON['非LINE開啟提醒']);
      return;
    }

    if (mode === 'call') {
      renderRideLike('call', CONFIG.call || {});
    } else if (mode === 'driver') {
      renderRideLike('driver', CONFIG.driver || {});
    } else if (mode === 'fare') {
      renderFare(CONFIG.fare || {});
    } else {
      renderQr();
    }
  }

  const loadingText = document.getElementById('loadingText');
  if (loadingText && COMMON['初始化文字']) loadingText.textContent = COMMON['初始化文字'];
  initialize();
})();
