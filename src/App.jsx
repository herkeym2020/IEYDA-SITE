import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { lazy, Suspense, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

// Layout Components
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MeetingNoticePopup from './components/MeetingNoticePopup'
import AppPreloader from './components/AppPreloader'

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
const IlorinHistoryPage = lazy(() => import('./pages/IlorinHistoryPage'))

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 },
}

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
}

function Page({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  )
}

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname, location.search])

  return (
    <div className="content-wrapper">
        <Header />
        <MeetingNoticePopup />
        <main className="main-content">
          <AnimatePresence mode="wait">
            <Suspense fallback={<AppPreloader />}>
              <Routes>
                <Route path="/" element={<Page><HomePage /></Page>} />
                <Route path="/about" element={<Page><AboutPage /></Page>} />
                <Route path="/programs" element={<Page><ProgramsPage /></Page>} />
                <Route path="/empowerment" element={<Page><ProgramsPage /></Page>} />
                <Route path="/news" element={<Page><NewsPage /></Page>} />
                <Route path="/events" element={<Page><EventsPage /></Page>} />
                <Route path="/gallery" element={<Page><GalleryPage /></Page>} />
                <Route path="/contact" element={<Page><ContactPage /></Page>} />
                <Route path="/membership" element={<Page><MembershipPage /></Page>} />
                <Route path="/donate" element={<Page><DonatePage /></Page>} />
                <Route path="/quranform" element={<Page><QuranformPage /></Page>} />
                <Route path="/guest-registration" element={<Page><GuestRegistrationPage /></Page>} />
                <Route path="/login" element={<Page><LoginPage /></Page>} />
                <Route path="/signup" element={<Page><SignupPage /></Page>} />
                <Route path="/community" element={<Page><CommunityPage /></Page>} />
                <Route path="/team" element={<Page><TeamPage /></Page>} />
                <Route path="/testimonials" element={<Page><TestimonialsPage /></Page>} />
                <Route path="/history/ilorin" element={<Page><IlorinHistoryPage /></Page>} />
                <Route path="*" element={<Page><NotFoundPage /></Page>} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
        <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
