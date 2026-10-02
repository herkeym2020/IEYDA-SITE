import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  User,
  Heart
} from 'lucide-react'

import { getAppSettings } from '@/lib/utils'
import { apiFetch } from '@/lib/api'
import logoFallback from '../../assets/ieyda_logo.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [settings, setSettings] = useState(() => getAppSettings())
  const location = useLocation()

  // Sync settings from bootstrap or fetch if missing
  useEffect(() => {
    let mounted = true
    async function ensureSettings() {
      const injected = getAppSettings()
      if (injected && Object.keys(injected).length) {
        setSettings(injected)
        document.title = injected.site_name ? `${injected.site_name}` : document.title
        return
      }
      try {
        const remote = await apiFetch('/settings')
        if (!mounted) return
        const normalized = remote?.data || remote || {}
        setSettings(normalized)
        if (normalized.site_name) {
          document.title = normalized.site_name
        }
      } catch (_) {
        // ignore
      }
    }
    ensureSettings()
    return () => { mounted = false }
  }, [])

  const logo = settings.logo_url || logoFallback;
  const siteName = settings.site_name || 'Ilorin Emirate';
  const siteDesc = settings.site_description || 'Youth Development Association';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Ilorin History', href: '/history/ilorin' },
    { name: 'Executive', href: '/team' },
    { name: 'Membership', href: '/membership' },
    { name: 'Empowerment', href: '/empowerment' },
    { name: 'News', href: '/news' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass-header shadow-lg border-b border-gray-100'
          : 'glass-header'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container-max">
        <div className="flex items-center justify-between h-20 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group z-10">
            <motion.div
              whileHover={{ scale: 1.55 }}
              whileTap={{ scale: 0.55 }}
              className="relative"
            >
              <img 
                src={logo} 
                alt={siteName + ' Logo'} 
                className="h-12 w-12 object-contain"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
            </motion.div>
            <div className="flex flex-col justify-center ml-2 min-w-0">
              <span
                className="block font-extrabold text-primary text-left tracking-wide leading-tight truncate"
                style={{
                  letterSpacing: '0.04em',
                  fontSize: 'clamp(1.2rem, 2.8vw, 2.1rem)',
                  lineHeight: 1.1,
                  maxWidth: '100vw',
                }}
              >
                {siteName}
              </span>
              <span
                className="block font-medium text-secondary text-left truncate"
                style={{
                  letterSpacing: '0.02em',
                  fontSize: 'clamp(0.75rem, 1.5vw, 1.05rem)',
                  maxWidth: '100vw',
                }}
              >
                {siteDesc}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-primary bg-primary/10 active'
                    : isScrolled
                    ? 'text-gray-700 hover:text-primary hover:bg-primary/5'
                    : 'text-secondary hover:text-secondary hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center flex-wrap gap-2 min-w-0">
            <Link to="/guest-registration" className="min-w-0">
              <Button size="sm" className="btn-outline mr-2">Register (Guest)</Button>
            </Link>
            <a
              href="/financial-membership/index.html"
              className="min-w-0"
            >
              <Button 
                size="sm"
                className="btn-primary bg-secondary hover:bg-secondary/90 text-secondary-foreground truncate max-w-40 flex items-center gap-2"
              >
                <span className="animate-breath">
                  <Heart className="h-4 w-4 mr-1" />
                </span>
                Financial Members
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className={`lg:hidden ${
              isScrolled 
                ? 'text-gray-700 hover:text-primary' 
                : 'text-primary hover:text-primary'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{padding: '0.5rem'}}
          >
            {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-100"
          >
            <div className="container-max py-4">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-gray-700 hover:text-primary hover:bg-primary/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <a href="/financial-membership/index.html">
                    <Button size="sm" className="w-full justify-start btn-primary bg-secondary hover:bg-secondary/90">
                      <Heart className="h-4 w-4 mr-2" />
                      Financial Members
                    </Button>
                  </a>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                  <Link to="/donate" onClick={() => setIsMenuOpen(false)}>
                    <Button size="sm" className="w-full justify-start btn-secondary">
                      <Heart className="h-4 w-4 mr-2" />
                      Donate
                    </Button>
                  </Link>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header
