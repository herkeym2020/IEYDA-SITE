import { motion } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import { apiFetch } from '@/lib/api'
import { shareContent } from '@/lib/share'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Newspaper, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  Share2, 
  Search,
  Filter,
  ArrowRight,
  MessageCircle,
  Heart,
  Bookmark,
  ExternalLink,
  Tag,
  TrendingUp,
  Award,
  Users,
  MapPin,
  Play,
  Image as ImageIcon,
  X
} from 'lucide-react'
import communityImage1 from '../assets/yFAvXjklLejr.jpg'
import communityImage2 from '../assets/P8wodN6fxLYt.jpg'
import communityImage3 from '../assets/GgmJonl1FD04.jpg'
import communityImage4 from '../assets/R92I275XDXjF.jpg'
import youthEmpowermentImage from '../assets/TcNX6NjKH8nZ.jpg'
import presidentImage from '../assets/wlf7jBIWw6f3.jpg'
import abstractBg from '../assets/VeKiraO1Skp4.jpg'
import youthEmpowermentBg from '../assets/45nOkJspxo2J.jpeg'
import ilorinPattern1 from '../assets/ilorin_pattern_1.png'
import ilorinPattern2 from '../assets/ilorin_pattern_2.png'
import ilorinPattern3 from '../assets/ilorin_pattern_3.png'
import { getImageUrl, stripHtml } from '@/lib/utils'

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [apiNews, setApiNews] = useState(null)
  const [dynamicCategories, setDynamicCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)

  const fetchNews = useCallback(async () => {
    // Abort any in-flight request before starting a new one (covers refresh clicks)
    if (abortRef.current) {
      abortRef.current.abort()
    }

    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    try {
      const d = await apiFetch('/news', { signal: controller.signal })
      const newsData = (d?.data || d || []).map(article => ({
        ...article,
        image: getImageUrl(article.image),
        tags: Array.isArray(article.tags) ? article.tags : []
      }))
      setApiNews(newsData)
    } catch (err) {
      if (controller.signal.aborted) return
      setError('Failed to load news.')
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])

  // Use centralized getImageUrl utility
  useEffect(() => {
    fetchNews()

    return () => {
      if (abortRef.current) {
        abortRef.current.abort()
      }
    }
  }, [fetchNews])

  useEffect(() => {
    if (apiNews && apiNews.length) {
      const uniqueCategories = [...new Set(apiNews.map(article => article.category))]
      setDynamicCategories([
        { id: 'all', name: 'All News', icon: Newspaper },
        ...uniqueCategories.map(cat => ({ id: cat, name: cat, icon: Newspaper }))
      ])
    }
  }, [apiNews])

  const categories = dynamicCategories;

  if (error) {
    return (
      <div className="pt-20">
        <div className="container-max py-16 text-center text-red-600">{error}</div>
      </div>
    )
  }

  const newsArticles = (apiNews && apiNews.length) ? apiNews : [];
  const filteredArticles = newsArticles.filter(article => {
    const tags = Array.isArray(article.tags) ? article.tags : []
    const title = (article.title || '').toLowerCase()
    const excerpt = (article.excerpt || '').toLowerCase()
    const term = (searchTerm || '').toLowerCase()
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    const matchesSearch = title.includes(term) || excerpt.includes(term) || tags.some(tag => (tag || '').toLowerCase().includes(term))
    return matchesCategory && matchesSearch
  })

  const featuredArticles = newsArticles.filter(article => article.is_featured)
  const recentArticles = newsArticles.slice(0, 5)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="pt-20">
      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden min-h-[60vh] flex items-center">
        {/* Multi-layered Background */}
        <div className="absolute inset-0">
          <img 
            src={abstractBg} 
            alt="Abstract Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 opacity-30">
            <img 
              src={youthEmpowermentBg} 
              alt="Youth Empowerment" 
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/80 to-accent/85"></div>
          
          {/* Cultural Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <img 
              src={ilorinPattern1} 
              alt="Ilorin Cultural Pattern" 
              className="w-full h-full object-cover"
              style={{ 
                backgroundRepeat: 'repeat',
                backgroundSize: '400px 400px'
              }}
            />
          </div>
        </div>

        <div className="container-max relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-lg px-6 py-2 backdrop-blur-sm">
              <Newspaper className="h-4 w-4 mr-2" />
              News & Updates
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow">
              Latest{' '}
              <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                News
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Stay informed about our latest activities, achievements, and community impact 
              across the Ilorin Emirate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured News Section */}
      <section className="section-padding bg-linear-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Cultural Background Pattern */}
        <div className="absolute inset-0 opacity-3">
          <img 
            src={ilorinPattern2} 
            alt="Ilorin Cultural Pattern" 
            className="w-full h-full object-cover"
            style={{ 
              backgroundRepeat: 'repeat',
              backgroundSize: '300px 300px'
            }}
          />
        </div>
        
        <div className="container-max relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Stories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Highlighting our most impactful stories and significant developments.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {featuredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden h-full cursor-pointer" onClick={() => setSelectedArticle(article)}>
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    
                    {/* Article Type Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={`${
                        article.type === 'video' ? 'bg-red-500' : 'bg-blue-500'
                      } text-white`}>
                        {article.type === 'video' ? (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Video
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Article
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-white">
                        Featured
                      </Badge>
                    </div>
                    
                    {/* Article Meta */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-4 text-sm mb-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(article.published_at)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-gray-500">by {article.author}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {article.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {article.comments}
                        </span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedArticle(article)}
                        className="group-hover:bg-primary group-hover:text-white transition-colors duration-200"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* News Filter and Search */}
      <section className="section-padding relative overflow-hidden">
        {/* Cultural Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <img 
            src={ilorinPattern3} 
            alt="Ilorin Cultural Pattern" 
            className="w-full h-full object-cover"
            style={{ 
              backgroundRepeat: 'repeat',
              backgroundSize: '400px 400px'
            }}
          />
        </div>
        
        <div className="container-max relative z-10">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">All News</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse through all our news articles and updates.
            </p>
          </motion.div>

          {/* Search and Filter Controls */}
          <motion.div 
            className="flex flex-col lg:flex-row gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Search Bar */}
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={fetchNews} variant="outline">
                Refresh
              </Button>
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <category.icon className="h-4 w-4" />
                  {category.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* News Grid */}
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {filteredArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden h-full">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                    
                    {/* Article Type */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${
                        article.type === 'video' ? 'bg-red-500' : 'bg-blue-500'
                      } text-white text-xs`}>
                        {article.type === 'video' ? (
                          <>
                            <Play className="h-3 w-3 mr-1" />
                            Video
                          </>
                        ) : (
                          <>
                            <ImageIcon className="h-3 w-3 mr-1" />
                            Article
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <button onClick={(event) => event.stopPropagation()} className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors duration-200">
                          <Bookmark className="h-4 w-4 text-white" />
                        </button>
                        <button
                          className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors duration-200"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const url = `${window.location.origin}/news/${article.slug || article.id}`
                            const title = article.title
                            const text = article.excerpt || ''
                            shareContent({ title, text, url })
                          }}
                        >
                          <Share2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-xs">
                        {article.category}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {formatDate(article.published_at)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>by {article.author}</span>
                      <span>{article.readTime}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {article.likes}
                        </span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedArticle(article)}
                        className="text-xs group-hover:bg-primary group-hover:text-white transition-colors duration-200"
                      >
                        Read More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Button size="lg" variant="outline">
              Load More Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedArticle(null)}
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="relative h-64">
                <img 
                  src={selectedArticle.image} 
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <Badge className={`${
                    selectedArticle.type === 'video' ? 'bg-red-500' : 'bg-blue-500'
                  } text-white mb-2`}>
                    {selectedArticle.type === 'video' ? 'Video' : 'Article'}
                  </Badge>
                  <h2 className="text-2xl font-bold mb-2">{selectedArticle.title}</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <span>by {selectedArticle.author}</span>
                    <span>{formatDate(selectedArticle.published_at)}</span>
                    <span>{selectedArticle.readTime}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">
                      {selectedArticle.category}
                    </Badge>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {selectedArticle.views} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {selectedArticle.likes} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {selectedArticle.comments} comments
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = `${window.location.origin}/news/${selectedArticle.slug || selectedArticle.id}`
                        const title = selectedArticle.title
                        const text = selectedArticle.excerpt || ''
                        shareContent({ title, text, url })
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-600 mb-6 italic">
                    {stripHtml(selectedArticle.excerpt)}
                  </p>
                  <div className="text-gray-700 leading-relaxed">
                    {stripHtml(selectedArticle.content)}
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t">
                  <h4 className="font-semibold mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedArticle.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Subscription */}
      <section className="section-padding bg-linear-to-r from-primary to-accent text-white relative overflow-hidden">
        {/* Cultural Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src={ilorinPattern1} 
            alt="Ilorin Cultural Pattern" 
            className="w-full h-full object-cover"
            style={{ 
              backgroundRepeat: 'repeat',
              backgroundSize: '500px 500px'
            }}
          />
        </div>
        
        <div className="container-max relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Stay Updated
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Subscribe to our newsletter and never miss important updates about our programs and community impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input 
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Subscribe
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

export default NewsPage
