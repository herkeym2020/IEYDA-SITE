import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Facebook,
  Twitter,
  MessageCircle,
  Send,
  Linkedin,
  Share2,
  Copy,
  Check,
} from 'lucide-react'
import { socialShareUrls, copyToClipboard } from '@/lib/share'

export function SocialShare({ title, text, url, className = '' }) {
  const [copied, setCopied] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const shareUrls = socialShareUrls(url, title, text)

  const handleCopy = async () => {
    const success = await copyToClipboard(url)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const platforms = [
    { name: 'Facebook', icon: Facebook, href: shareUrls.facebook, color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: Twitter, href: shareUrls.twitter, color: 'hover:bg-sky-500' },
    { name: 'WhatsApp', icon: MessageCircle, href: shareUrls.whatsapp, color: 'hover:bg-green-500' },
    { name: 'Telegram', icon: Send, href: shareUrls.telegram, color: 'hover:bg-sky-400' },
    { name: 'LinkedIn', icon: Linkedin, href: shareUrls.linkedin, color: 'hover:bg-blue-700' },
  ]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm font-medium text-muted-foreground">Share:</span>
      <div className="flex items-center gap-1.5">
        {platforms.map((platform) => (
          <motion.a
            key={platform.name}
            href={platform.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${platform.name}`}
            onClick={() => setShowTooltip(false)}
            className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 ${platform.color} hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {platform.icon({ className: 'h-4 w-4' })}
          </motion.a>
        ))}
        <div className="relative">
          <motion.button
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : 'Copy link'}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-primary-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </motion.button>
          <AnimatePresence>
            {showTooltip && !copied && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap"
              >
                Copy link
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export function ShareButton({ title, text, url, className = '' }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative inline-block">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Share this content"
        className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-primary hover:text-primary-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Share2 className="h-5 w-5" />
      </motion.button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 p-3 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <SocialShare title={title} text={text} url={url} />
            <div className="absolute top-[-8px] right-4 w-4 h-4 bg-white dark:bg-gray-800 border-l border-t border-gray-200 dark:border-gray-700 transform rotate-45"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
