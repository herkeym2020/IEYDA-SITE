import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'
import { Skeleton } from './components/ui/skeleton'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Preloader from './components/ui/Preloader'

// Page Components (code-split with React.lazy)
const HomePage = lazy(() => import('./pages/HomePageEnhanced'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPageNew'))
const ProgramsPage = lazy(() => import('./pages/ProgramsPageNew'))
const NewsPage = lazy(() => import('./pages/NewsPageNew'))
const EventsPage = lazy(() => import('./pages/EventsPageFinal'))
const ContactPage = lazy(() => import('./pages/ContactPageEnhanced'))
const MembershipPage = lazy(() => import('./pages/MembershipPage'))
const DonatePage = lazy(() => import('./pages/DonatePage'))
const QuranformPage = lazy(() => import('./pages/QuranformPage'))
const GuestRegistrationPage = lazy(() => import('./pages/GuestRegistrationPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const CommunityPage = lazy(() => import('./pages/CommunityPage'))
const TeamPage = lazy(() => import('./pages/TeamPageFinal'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20
  },
  in: {
    opacity: 1,
    y: 0
  },
  out: {
    opacity: 0,
    y: -20
  }
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
}

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Wait for bootstrap data and page hydration
  useEffect(() => {
    let isMounted = true;
    async function initApp() {
      try {
        // Wait for bootstrap data to be available in window
        let bootstrapReady = false;
        let attempts = 0;
        const maxAttempts = 100; // max 10 seconds

        while (!bootstrapReady && attempts < maxAttempts) {
          if (typeof window !== 'undefined' && window.__BOOTSTRAP_DATA__) {
            bootstrapReady = true;
            break;
          }
          // On first miss, proactively fetch aggregated bootstrap from API
          if (attempts === 0) {
            try {
              const apiBase = import.meta.env.VITE_API_URL || 'https://control.ilorinemirateyouths.com/api/v1';
              const res = await fetch(`${apiBase.replace(/\/$/, '')}/bootstrap`, { headers: { 'Accept': 'application/json' } });
              if (res.ok) {
                const data = await res.json();
                // Normalize keys to match existing consumer mapping
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
              // ignore; retry loop continues
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
        
        // Ensure minimal display time for preloader
        await new Promise((resolve) => setTimeout(resolve, 800));
        
        if (isMounted) {
          setLoading(false);
          setError(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          // Retry after delay
          setTimeout(initApp, 2000);
        }
      }
    }
    initApp();
    return () => { isMounted = false; };
  }, []);

  // Lightweight route-specific fallbacks
  const HomeFallback = () => (
    <div className="space-y-6 p-6">
      <Skeleton className="h-64 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )

  const EventsFallback = () => (
    <div className="space-y-6 p-6">
      <Skeleton className="h-48 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )

  const TeamFallback = () => (
    <div className="space-y-6 p-6">
      <Skeleton className="h-56 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )

  const GalleryFallback = () => (
    <div className="space-y-6 p-6">
      <Skeleton className="h-48 w-full" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    </div>
  )

  const ProgramsFallback = () => (
    <div className="space-y-6 p-6">
      <Skeleton className="h-56 w-full" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Router>
      <div className="content-wrapper">
        <Header />
        {loading ? (
          <Preloader />
        ) : (
          <main className="main-content">
            <AnimatePresence mode="wait">
              <Suspense fallback={<Preloader />}>
              <Routes>
                {/* ...existing routes... */}
                <Route path="/" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Suspense fallback={<HomeFallback />}><HomePage /></Suspense></motion.div>} />
                <Route path="/about" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><AboutPage /></motion.div>} />
                <Route path="/programs" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Suspense fallback={<ProgramsFallback />}><ProgramsPage /></Suspense></motion.div>} />
                <Route path="/empowerment" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Suspense fallback={<ProgramsFallback />}><ProgramsPage /></Suspense></motion.div>} />
                <Route path="/news" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><NewsPage /></motion.div>} />
                <Route path="/events" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Suspense fallback={<EventsFallback />}><EventsPage /></Suspense></motion.div>} />
                <Route path="/gallery" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Suspense fallback={<GalleryFallback />}><GalleryPage /></Suspense></motion.div>} />
                <Route path="/contact" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><ContactPage /></motion.div>} />
                <Route path="/membership" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><MembershipPage /></motion.div>} />
                <Route path="/donate" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><DonatePage /></motion.div>} />
                <Route path="/quranform" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><QuranformPage /></motion.div>} />
                <Route path="/guest-registration" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><GuestRegistrationPage /></motion.div>} />
                <Route path="/login" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><LoginPage /></motion.div>} />
                <Route path="/signup" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><SignupPage /></motion.div>} />
                <Route path="/community" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><CommunityPage /></motion.div>} />
                <Route path="/team" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Suspense fallback={<TeamFallback />}><TeamPage /></Suspense></motion.div>} />
                <Route path="/testimonials" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><TestimonialsPage /></motion.div>} />
                <Route path="*" element={<motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}><Suspense fallback={<Preloader />}><NotFoundPage /></Suspense></motion.div>} />
              </Routes>
              </Suspense>
            </AnimatePresence>
          </main>
        )}
        <Footer />
      </div>
    </Router>
  )
}

export default App

