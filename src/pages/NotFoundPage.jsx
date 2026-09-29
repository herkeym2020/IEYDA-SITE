import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function NotFoundPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.25 }}
      className="min-h-[60vh] flex items-center justify-center px-4 py-20 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="text-center max-w-xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg mb-6">
          <span className="text-2xl font-extrabold">404</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-8">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center rounded-lg bg-indigo-600 text-white px-4 py-2 font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          >
            Go Home
          </Link>
          <Link
            to="/news"
            className="inline-flex items-center rounded-lg bg-gray-100 text-gray-900 px-4 py-2 font-medium hover:bg-gray-200"
          >
            View News
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white text-gray-900 px-4 py-2 font-medium hover:bg-gray-50"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
