import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
  Send,
  ArrowUp,
  ChevronRight,
} from 'lucide-react'

import { getAppSettings } from '@/lib/utils'
import { apiFetch } from '@/lib/api'
import logoFallback from '../../assets/ieyda_logo.png'

const Footer = () => {
  const [settings, setSettings] = useState(() => getAppSettings())
  const [showTopBtn, setShowTopBtn] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const logo = settings.logo_url || logoFallback
  const siteName = settings.site_name || 'IEYDA'
  const contactEmail = settings.contact_email || 'info@ieyda.org'
  const contactPhone = settings.contact_phone || '+234 809 709 0867'
  const facebookUrl = settings.facebook_url || 'https://www.facebook.com/ilorinemirateyouthdevelopmentassociation/'
  const twitterUrl = settings.twitter_url || '#'
  const instagramUrl = settings.instagram_url || '#'

  // Fetch settings dynamically to pick up backend updates
  useEffect(() => {
    let mounted = true
    async function refreshSettings() {
      try {
        const remote = await apiFetch('/settings')
        if (!mounted) return
        const normalized = remote?.data || remote || {}
        setSettings(normalized)
      } catch (_) {
        // ignore; keep existing settings
      }
    }
    refreshSettings()
    return () => { mounted = false }
  }, [])

  // Show/hide back-to-top button
  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Executive Team', href: '/team' },
    { name: 'Empowerment', href: '/empowerment' },
    { name: 'News & Updates', href: '/news' },
    { name: 'Events', href: '/events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ]

  const programs = [
    { name: 'Skills Development', href: '/empowerment' },
    { name: 'Economic Empowerment', href: '/empowerment' },
    { name: 'Youth Leadership', href: '/empowerment' },
    { name: 'Community Health', href: '/empowerment' },
    { name: 'Infrastructure Development', href: '/empowerment' },
  ]

  const socialLinks = [
    { icon: Facebook, name: 'Facebook', url: facebookUrl, followers: '6.8K', color: 'hover:bg-blue-600' },
    { icon: Instagram, name: 'Instagram', url: instagramUrl, followers: '1.4K', color: 'hover:bg-pink-600' },
    { icon: Twitter, name: 'Twitter', url: twitterUrl, followers: '2.1K', color: 'hover:bg-sky-500' },
  ]

  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-10"></div>

      {/* Main Footer */}
      <div className="relative z-10">
        <div className="container-max py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            {/* Organization Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-3 mb-5">
                <img src={logo} alt={`${siteName} Logo`} className="h-12 w-12 flex-shrink-0" />
                <div className="min-w-0">
                  <h3 className="text-xl font-bold truncate">{siteName}</h3>
                  <p className="text-sm text-primary-foreground/80">Emirate Youth</p>
                </div>
              </div>

              <p className="text-primary-foreground/80 mb-6 leading-relaxed text-sm">
                The Ilorin Emirate Youth Development Association is dedicated to fostering
                community development through youth empowerment and collaborative initiatives.
              </p>

              <div className="space-y-3">
                <a href={`tel:${contactPhone}`} className="flex items-center space-x-3 text-sm hover:text-secondary transition-colors group">
                  <div className="bg-primary-foreground/10 p-2 rounded-lg group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                    <Phone className="h-4 w-4 text-secondary" />
                  </div>
                  <span>{contactPhone}</span>
                </a>
                <a href={`mailto:${contactEmail}`} className="flex items-center space-x-3 text-sm hover:text-secondary transition-colors group">
                  <div className="bg-primary-foreground/10 p-2 rounded-lg group-hover:bg-secondary/20 transition-colors flex-shrink-0">
                    <Mail className="h-4 w-4 text-secondary" />
                  </div>
                  <span className="truncate">{contactEmail}</span>
                </a>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="bg-primary-foreground/10 p-2 rounded-lg flex-shrink-0 mt-0.5">
                    <MapPin className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <div>Aishat Adepate House, Edun Street</div>
                    <div className="text-xs text-primary-foreground/60">Ilorin, Kwara State, Nigeria</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-secondary rounded-full"></span>
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-primary-foreground/80 hover:text-secondary transition-all duration-200 text-sm flex items-center group"
                    >
                      <ChevronRight className="h-3 w-3 mr-1 text-secondary/0 group-hover:text-secondary transition-all duration-200 transform group-hover:translate-x-0 -translate-x-2" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Programs */}
            <div>
              <h4 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-secondary rounded-full"></span>
                Our Programs
              </h4>
              <ul className="space-y-2.5">
                {programs.map((program, index) => (
                  <li key={index}>
                    <Link
                      to={program.href}
                      className="text-primary-foreground/80 hover:text-secondary transition-all duration-200 text-sm flex items-center group"
                    >
                      <ChevronRight className="h-3 w-3 mr-1 text-secondary/0 group-hover:text-secondary transition-all duration-200 transform group-hover:translate-x-0 -translate-x-2" />
                      {program.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Social */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <span className="w-1 h-5 bg-secondary rounded-full"></span>
                Stay Connected
              </h4>
              <p className="text-primary-foreground/80 mb-4 text-sm leading-relaxed">
                Subscribe to our newsletter for the latest updates on our programs and community activities.
              </p>

              <form onSubmit={handleSubscribe} className="mb-6">
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 flex-1 h-10"
                    required
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-3 h-10"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {subscribed && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-secondary mt-2 flex items-center gap-1"
                  >
                    <Heart className="h-3 w-3" /> Thank you for subscribing!
                  </motion.p>
                )}
              </form>

              {/* Social Links */}
              <div>
                <p className="text-sm mb-3 font-medium">Follow us on social media:</p>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`bg-primary-foreground/10 p-3 rounded-xl hover:text-white transition-all duration-300 group transform hover:scale-110 hover:-translate-y-1 ${social.color}`}
                      title={`${social.name} - ${social.followers} followers`}
                      aria-label={social.name}
                    >
                      <social.icon className="h-5 w-5 text-primary-foreground group-hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
                <p className="text-xs text-primary-foreground/60 mt-3">
                  Join our growing community online
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Motto Section */}
        <div className="border-t border-primary-foreground/20 bg-primary-foreground/5">
          <div className="container-max py-6">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">
                "Love and Harmony"
              </p>
              <p className="text-sm text-primary-foreground/80 italic">
                "Omo Ilorin Emirate ni mi…….Ilorin Emirate o ni baje faa"
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20">
          <div className="container-max py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-primary-foreground/80 text-center md:text-left">
                <span>&copy; {new Date().getFullYear()} Ilorin Emirate Youth Development Association (IEYDA)</span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
                <Link to="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Terms of Service
                </Link>
                <Link to="#" className="text-primary-foreground/80 hover:text-secondary transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-primary-foreground/10 text-center">
              <p className="text-sm text-primary-foreground/60 flex items-center justify-center flex-wrap">
                Made with <Heart className="h-4 w-4 mx-1 text-red-400 animate-pulse" /> for community development
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Donation CTA */}
      <div className="bg-secondary relative z-10">
        <div className="container-max py-8">
          <div className="text-center">
            <h3 className="text-xl font-bold text-secondary-foreground mb-2">
              Support Our Mission
            </h3>
            <p className="text-secondary-foreground/80 mb-4 max-w-2xl mx-auto text-sm sm:text-base">
              Help us continue empowering youth and building stronger communities across the Ilorin Emirate
            </p>
            <Link to="/donate">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transform hover:scale-105 transition-all duration-300"
              >
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showTopBtn && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-primary text-primary-foreground p-3 rounded-full shadow-xl hover:bg-primary/90 transition-all duration-300 hover:scale-110"
          aria-label="Back to top"
        >
          <ArrowUp className="h-6 w-6" />
        </motion.button>
      )}
    </footer>
  )
}

export default Footer