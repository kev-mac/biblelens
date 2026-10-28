// Install once before app scripts (after the native API bridge, when present).
// Keep the original request and its signal; writes always pass straight through.
(function installReadRetries(target) {
  const transport = target.fetch.bind(target);
  let pending = 0, status;
  function show(delta) {
    pending += delta;
    if (!status && pending) {
      status = document.createElement('div');
      status.className = 'fetch-retry-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      status.textContent = 'Retrying…';
      document.body.appendChild(status);
    }
    if (status) status.hidden = !pending;
  }
  function pause(ms, signal) {
    return new Promise((resolve, reject) => {
      const cleanup = () => signal?.removeEventListener('abort', abort);
      const abort = () => { clearTimeout(timer); cleanup(); reject(signal.reason || new DOMException('Aborted', 'AbortError')); };
      const timer = setTimeout(() => { cleanup(); resolve(); }, ms);
      signal?.addEventListener('abort', abort, {once: true});
      if (signal?.aborted) abort();
    });
  }
  target.fetch = async (input, init) => {
    const method = String(init?.method || input?.method || 'GET').toUpperCase();
    const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url, target.location.href);
    const local = url.origin === target.location.origin ||
      url.origin === 'https://scripture-lens.kvn-mcgwn.chatgpt.site' && url.pathname === '/release.json';
    if (method !== 'GET' || !local) return transport(input, init);
    const signal = init?.signal || input?.signal;
    let retrying = false;
    try {
      for (let attempt = 0; attempt < 3; attempt++) {
        signal?.throwIfAborted();
        let response;
        try {
          response = await transport(input, init);
          if (response.status < 500 || response.status > 599 || attempt === 2) return response;
        } catch (error) {
          if (signal?.aborted || !['TypeError', 'NetworkError'].includes(error.name) || attempt === 2) throw error;
        }
        // Release a failed response before the next request.
        await response?.body?.cancel().catch(() => {});
        if (!retrying) { retrying = true; show(1); }
        await pause(300 * 2 ** attempt * (0.75 + Math.random() * 0.5), signal);
      }
    } finally { if (retrying) show(-1); }
  };
})(globalThis);
