import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@/contexts/ThemeContext'

// Single QueryClient instance for the whole app
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2, // small retry count with backoff handled internally
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60, // 1 minute of fresh data
    },
  },
})

// Eagerly fetch bootstrap data before React renders (uses preloaded resource)
async function initBootstrap() {
  if (typeof window !== 'undefined' && !window.__BOOTSTRAP_DATA__) {
    try {
      const apiBase = import.meta.env.VITE_API_URL || 'https://control.ilorinemirateyouths.com/api/v1';
      const res = await fetch(`${apiBase.replace(/\/$/, '')}/bootstrap`, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        window.__BOOTSTRAP_DATA__ = {
          'hero-slides': data.heroSlides,
          'hero-stats': data.heroStats,
          'news': data.news,
          'events': data.events,
          'past-events': data.pastEvents,
          'programs': data.programs,
          'team': data.team,
          'gallery': data.gallery,
          'testimonials': data.testimonials,
          'communities': data.communities,
          'settings': data.settings,
        };
      }
    } catch (_) {
      // Silent fail; App.jsx will retry if needed
    }
  }
}

// Start bootstrap fetch immediately, render React app
initBootstrap().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
})
