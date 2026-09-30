import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@/contexts/ThemeContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60,
    },
  },
})

// Warm the shared cache without delaying the first paint. Individual pages can
// render immediately and use their own request state while this completes.
function initBootstrap() {
  if (typeof window === 'undefined' || window.__BOOTSTRAP_PROMISE__) return

  const apiBase = import.meta.env.VITE_API_URL || 'https://control.ilorinemirateyouths.com/api/v1'
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), 8000)
  window.__BOOTSTRAP_PROMISE__ = fetch(`${apiBase.replace(/\/$/, '')}/bootstrap`, {
    headers: { Accept: 'application/json' },
    credentials: 'include',
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) throw new Error(`Bootstrap request failed: ${response.status}`)
      const data = await response.json()
      window.__BOOTSTRAP_DATA__ = {
        'hero-slides': data.heroSlides,
        'hero-stats': data.heroStats,
        news: data.news,
        events: data.events,
        'past-events': data.pastEvents,
        programs: data.programs,
        team: data.team,
        gallery: data.gallery,
        testimonials: data.testimonials,
        communities: data.communities,
        settings: data.settings,
      }
      return window.__BOOTSTRAP_DATA__
    })
    .catch(() => null)
    .finally(() => window.clearTimeout(timeoutId))
}

initBootstrap()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
)
