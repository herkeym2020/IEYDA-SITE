// Centralized API utility for all frontend data fetching
// Guarantees: timeout with AbortController, consistent headers, credentials, normalization, in-memory cache, bootstrap priming.

const API_BASE = import.meta.env.VITE_API_URL || 'https://control.ilorinemirateyouths.com/api/v1';
const DEFAULT_TIMEOUT = 10000; // ms
const CACHE_TTL = 30000; // ms

const memoryCache = new Map(); // key -> { ts, data }
const inflight = new Map();    // key -> promise
const BOOTSTRAP_KEYS = new Set([
  'hero-slides',
  'hero-stats',
  'news',
  'events',
  'past-events',
  'programs',
  'team',
  'gallery',
  'testimonials',
  'communities',
  'settings',
  'meeting-notices',
  'monthly-realizations',
  'history/ilorin',
]);

// Access bootstrap data injected by Laravel or populated at runtime
function getBootstrap() {
  return (typeof window !== 'undefined' && window.__BOOTSTRAP_DATA__) || null;
}

function normalizeKey(endpoint) {
  return (endpoint || '')
    .replace(/^\//, '')
    .split('?')[0]
    .toLowerCase();
}

// Seed cache from bootstrap to avoid initial network hits
let primed = false;
function primeBootstrapCache() {
  if (primed) return;
  const boot = getBootstrap();
  if (!boot) return;
  const entries = {
    'hero-slides': boot['hero-slides'],
    'hero-stats': boot['hero-stats'],
    'news': boot['news'],
    'events': boot['events'],
    'past-events': boot['past-events'],
    'programs': boot['programs'],
    'team': boot['team'],
    'gallery': boot['gallery'],
    'testimonials': boot['testimonials'],
    'communities': boot['communities'],
    'settings': boot['settings'],
    'meeting-notices': boot['meeting-notices'],
    'monthly-realizations': boot['monthly-realizations'],
    'history/ilorin': boot.history,
  };
  const now = Date.now();
  Object.entries(entries).forEach(([k, v]) => {
    if (v !== undefined) {
      memoryCache.set(`GET:${k}`, { ts: now, data: v });
    }
  });
  primed = true;
}

function normalizeResponse(json) {
  if (json === null || json === undefined) return { data: null, meta: {} };
  if (Array.isArray(json)) return { data: json, meta: {} };
  if (json.data !== undefined) {
    const meta = json.meta || json.links ? { ...json.meta, links: json.links } : {};
    return { data: json.data, meta };
  }
  return { data: json, meta: {} };
}

function attachMeta(data, meta) {
  if (data && typeof data === 'object' && !Object.prototype.hasOwnProperty.call(data, '_meta')) {
    Object.defineProperty(data, '_meta', { value: meta, enumerable: false, writable: false });
  }
  return data;
}

function readCache(key) {
  const cached = memoryCache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.ts > CACHE_TTL) {
    memoryCache.delete(key);
    return null;
  }
  return cached.data;
}

async function waitForBootstrap(endpoint, method) {
  if (method !== 'GET' || !BOOTSTRAP_KEYS.has(normalizeKey(endpoint))) return;
  if (getBootstrap()) {
    primeBootstrapCache();
    return;
  }

  const bootstrapPromise = typeof window !== 'undefined' ? window.__BOOTSTRAP_PROMISE__ : null;
  if (!bootstrapPromise) return;

  try {
    await bootstrapPromise;
    primeBootstrapCache();
  } catch (_) {
    // Bootstrap failure is non-fatal; apiFetch will use the individual endpoint.
  }
}

export async function apiFetch(endpoint, options = {}) {
  primeBootstrapCache();

  const method = (options.method || 'GET').toUpperCase();
  const normalizedKey = normalizeKey(endpoint);
  const cacheKey = `${method}:${normalizedKey}`;
  const useCache = options.cache !== false && method === 'GET';
  const timeoutMs = options.timeout || DEFAULT_TIMEOUT;

  // Serve from cache if present
  if (useCache) {
    const cached = readCache(cacheKey);
    if (cached !== null && cached !== undefined) {
      const normalized = normalizeResponse(cached);
      return attachMeta(normalized.data, normalized.meta);
    }
  }

  // The bootstrap request already contains the initial public data set. Wait
  // for it briefly before opening duplicate requests for the same resources.
  await waitForBootstrap(endpoint, method);

  if (useCache) {
    const cached = readCache(cacheKey);
    if (cached !== null && cached !== undefined) {
      const normalized = normalizeResponse(cached);
      return attachMeta(normalized.data, normalized.meta);
    }
  }

  // Deduplicate inflight identical requests, but allow retry if previous one was aborted
  if (inflight.has(cacheKey)) {
    const existingPromise = inflight.get(cacheKey);
    // If the existing promise is aborted, retry instead of reusing
    existingPromise.catch(err => {
      if (err?.name === 'AbortError') {
        // Mark for retry by removing from inflight
        inflight.delete(cacheKey);
      }
    });
    // Return existing if not aborted; if aborted, continue to create new request below
    return existingPromise.catch(err => {
      if (err?.name === 'AbortError') {
        // Fall through to create new request
        return apiFetch(endpoint, options);
      }
      throw err;
    });
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(new Error('Request timeout')), timeoutMs);

  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  const headers = {
    Accept: 'application/json',
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  };

  const fetchPromise = (async () => {
    try {
      // Strip custom options that are not valid fetch() properties
      const { cache: _cache, timeout: _timeout, ...fetchOptions } = options;
      const response = await fetch(url, {
        credentials: fetchOptions.credentials || 'include',
        signal: fetchOptions.signal || controller.signal,
        headers,
        ...fetchOptions,
      });

      if (!response.ok) {
        let message = response.statusText;
        try {
          const err = await response.json();
          message = err.message || err.error || message;
        } catch (_) {
          // ignore JSON parse errors
        }
        const error = new Error(message);
        error.status = response.status;
        throw error;
      }

      const json = await response.json();
      const normalized = normalizeResponse(json);
      if (useCache) {
        memoryCache.set(cacheKey, { ts: Date.now(), data: normalized });
      }
      return attachMeta(normalized.data, normalized.meta);
    } catch (error) {
      // On abort (navigation), don't clear inflight so retry on back-button works
      if (error.name === 'AbortError') {
        throw error;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
      // Only delete from inflight if not aborted (abort means page navigation, allow retry)
      if (!controller.signal.aborted) {
        inflight.delete(cacheKey);
      }
    }
  })();

  inflight.set(cacheKey, fetchPromise);
  return fetchPromise;
}

export function clearApiCache() {
  memoryCache.clear();
  inflight.clear();
}
