(() => {
  'use strict';
  if (window.GC_V5733_MUTATION_GUARD) return;
  const NativeMutationObserver = window.MutationObserver;
  if (typeof NativeMutationObserver !== 'function') return;
  window.GC_V5733_MUTATION_GUARD = true;

  window.MutationObserver = function(callback) {
    const observer = new NativeMutationObserver((records, self) => {
      const appChildMutation = records.some(record => {
        if (record.type !== 'childList') return false;
        const target = record.target;
        return target?.id === 'app' || Boolean(target?.closest?.('#app'));
      });

      // V5.7.33 的 UI 重排只允許由 #app 渲染觸發一次。
      // 在 callback 前先停止監看，避免重排 DOM 又觸發自己形成無限迴圈。
      if (appChildMutation) self.disconnect();
      callback(records, self);
    });
    return observer;
  };
  window.MutationObserver.prototype = NativeMutationObserver.prototype;
})();
