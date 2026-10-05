import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@/contexts/ThemeContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 1000 * 60 * 5 },
  },
})

const API_BASE = (import.meta.env.VITE_API_URL || 'https://control.ilorinemirateyouths.com/api/v1').replace(/\/$/, '')
const STORAGE_KEY = 'ieyda:bootstrap:v1'
const MAX_CACHE_AGE = 1000 * 60 * 60 * 24

function mapBootstrap(data) {
  return {
    'hero-slides': data.heroSlides,
    'hero-stats': data.heroStats,
    'site-stats': data.siteStats,
    news: data.news,
    events: data.events,
    'past-events': data.pastEvents,
    programs: data.programs,
    team: data.team,
    gallery: data.gallery,
    testimonials: data.testimonials,
    communities: data.communities,
    settings: data.settings,
    'meeting-notices': data.meetingNotices,
    'monthly-realizations': data.monthlyRealizations,
    history: data.history,
  }
}

function readStoredBootstrap() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved?.data || Date.now() - saved.savedAt > MAX_CACHE_AGE) return null
    return saved
  } catch (_) {
    return null
  }
}

function saveBootstrap(data, etag) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, etag, savedAt: Date.now() })) } catch (_) { /* private mode/storage quota */ }
}

function initBootstrap() {
  if (typeof window === 'undefined') return Promise.resolve(null)
  const stored = readStoredBootstrap()
  if (stored) {
    window.__BOOTSTRAP_DATA__ = stored.data
    window.__BOOTSTRAP_SOURCE__ = 'cache'
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 10000)
  const headers = { Accept: 'application/json' }
  if (stored?.etag) headers['If-None-Match'] = stored.etag

  const refresh = fetch(`${API_BASE}/bootstrap`, { headers, credentials: 'include', signal: controller.signal })
    .then(async (response) => {
      if (response.status === 304 && stored) return stored.data
      if (!response.ok) throw new Error(`Bootstrap request failed: ${response.status}`)
      const mapped = mapBootstrap(await response.json())
      saveBootstrap(mapped, response.headers.get('etag'))
      window.__BOOTSTRAP_DATA__ = mapped
      window.__BOOTSTRAP_SOURCE__ = 'network'
      return mapped
    })
    .catch((error) => {
      window.__BOOTSTRAP_ERROR__ = error
      return stored?.data || null
    })
    .finally(() => window.clearTimeout(timeoutId))

  // Cached content is already render-ready; do not make a returning visitor wait
  // for a second network round trip. The refresh continues in the background.
  if (stored) return Promise.resolve(stored.data)
  return refresh
}

window.__BOOTSTRAP_PROMISE__ = initBootstrap()

window.__BOOTSTRAP_PROMISE__.finally(() => {
  const root = createRoot(document.getElementById('root'))
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
})
