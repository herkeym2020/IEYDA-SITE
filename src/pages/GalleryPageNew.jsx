import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Camera, 
  Video, 
  Calendar, 
  MapPin, 
  Users, 
  Eye,
  EyeOff,
  Download,
  Share2,
  Filter,
  Grid3X3,
  List,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  ExternalLink
} from 'lucide-react'
import communityImage1 from '../assets/yFAvXjklLejr.jpg'
import communityImage2 from '../assets/P8wodN6fxLYt.jpg'
import communityImage3 from '../assets/GgmJonl1FD04.jpg'
import communityImage4 from '../assets/R92I275XDXjF.jpg'
import youthEmpowermentImage from '../assets/TcNX6NjKH8nZ.jpg'
import presidentImage from '../assets/wlf7jBIWw6f3.jpg'
import grandPatronImage from '../assets/8UyofGMTSzUa.jpg'
import abstractBg from '../assets/VeKiraO1Skp4.jpg'
import youthEmpowermentBg from '../assets/45nOkJspxo2J.jpeg'
import ilorinPattern1 from '../assets/ilorin_pattern_1.png'
import ilorinPattern2 from '../assets/ilorin_pattern_2.png'
import ilorinPattern3 from '../assets/ilorin_pattern_3.png'

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [apiGallery, setApiGallery] = useState(null)
  const [showAllGallery, setShowAllGallery] = useState(false);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchGallery = (signal) => {
    return apiFetch('/gallery', { signal }).then(d => {
      const gallery = (d?.data || d || []).map(item => ({
        ...item,
        image: getImageUrl(item.image || item.src)
      }))
      setApiGallery(gallery)
    })
  }

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        await fetchGallery(controller.signal)
      } catch (err) {
        if (cancelled) return
        setError('Failed to load gallery.')
        setApiGallery([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [])

  const categories = [
    { id: 'all', name: 'All Media', icon: Camera },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'programs', name: 'Programs', icon: Users },
    { id: 'leadership', name: 'Leadership', icon: Users },
    { id: 'community', name: 'Community', icon: MapPin },
    { id: 'training', name: 'Training', icon: Users }
  ]

  // const galleryItems = (apiGallery && apiGallery.length) ? apiGallery : [
  //   ...static demo data here...
  // ]
  const galleryItems = apiGallery && apiGallery.length ? apiGallery : []

  if (error) {
    return (
      <div className="pt-20">
        <div className="container-max py-16 text-center text-red-600">{error}</div>
      </div>
    )
  }

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  const visibleItems = showAllGallery ? filteredItems : filteredItems.slice(0, 8)

  const openLightbox = (item, index) => {
    setSelectedMedia(item)
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setSelectedMedia(null)
    setCurrentIndex(0)
  }

  const navigateLightbox = (direction) => {
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredItems.length
      : (currentIndex - 1 + filteredItems.length) % filteredItems.length
    setCurrentIndex(newIndex)
    setSelectedMedia(filteredItems[newIndex])
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
              <Camera className="h-4 w-4 mr-2" />
              Photo & Video Gallery
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow">
              Visual{' '}
              <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Explore our visual journey through community development, youth empowerment, 
              and the transformative impact of IEYDA across the Ilorin Emirate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Controls */}
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
          {/* Category Filters */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <category.icon className="h-4 w-4" />
                {category.name}
              </button>
            ))}
          </motion.div>

          {/* View Mode Toggle */}
          <motion.div 
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">
                {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
              </span>
              <Button onClick={fetchGallery} variant="outline" size="sm">
                Refresh
              </Button>
            </div>
            
            <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm border">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </motion.div>

          {/* Gallery Grid */}
          <motion.div 
            className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {visibleItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card 
                  className={`group hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}
                  onClick={() => openLightbox(item, index)}
                >
                  <div className={`relative overflow-hidden ${
                    viewMode === 'list' ? 'w-48 h-32' : 'aspect-square'
                  }`}>
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Media Type Indicator */}
                    <div className="absolute top-3 left-3">
                      <Badge className={`${
                        item.type === 'video' ? 'bg-red-500' : 'bg-blue-500'
                      } text-white`}>
                        {item.type === 'video' ? (
                          <>
                            <Video className="h-3 w-3 mr-1" />
                            {item.duration}
                          </>
                        ) : (
                          <>
                            <Camera className="h-3 w-3 mr-1" />
                            Photo
                          </>
                        )}
                      </Badge>
                    </div>
                    
                    {/* Play Button for Videos */}
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex gap-2">
                        <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors duration-200">
                          <Eye className="h-4 w-4 text-white" />
                        </button>
                        <button className="bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/30 transition-colors duration-200">
                          <Share2 className="h-4 w-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {item.location}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {item.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {item.comments}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* See More/Less Button for Gallery */}
          {filteredItems.length > 8 && (
            <div className="text-center mt-12">
              <Button
                onClick={() => setShowAllGallery(!showAllGallery)}
                variant="outline"
                size="lg"
                className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
              >
                {showAllGallery ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    See Less Gallery
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    See All Gallery ({filteredItems.length})
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedMedia && (
        <Dialog open={!!selectedMedia} onOpenChange={closeLightbox}>
          <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={() => navigateLightbox('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => navigateLightbox('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
              
              {/* Close Button */}
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
              
              {/* Media Display */}
              <div className="aspect-video bg-black">
                {selectedMedia.type === 'video' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-white text-center">
                      <Play className="h-16 w-16 mx-auto mb-4" />
                      <p>Video Player Placeholder</p>
                      <p className="text-sm opacity-70">Duration: {selectedMedia.duration}</p>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={selectedMedia.image} 
                    alt={selectedMedia.title}
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
              
              {/* Media Info */}
              <div className="p-6 bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{selectedMedia.title}</h3>
                    <p className="text-gray-600 mb-4">{selectedMedia.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Date:</strong> {new Date(selectedMedia.date).toLocaleDateString()}</p>
                    <p><strong>Location:</strong> {selectedMedia.location}</p>
                    <p><strong>Photographer:</strong> {selectedMedia.photographer}</p>
                  </div>
                  <div>
                    <p><strong>Category:</strong> {categories.find(c => c.id === selectedMedia.category)?.name}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        {selectedMedia.likes} likes
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4 text-blue-500" />
                        {selectedMedia.comments} comments
                      </span>
                    </div>
                  </div>
                </div>
                
                {selectedMedia.tags && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedMedia.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Call to Action */}
      <section className="section-padding bg-linear-to-r from-primary to-accent text-white relative overflow-hidden">
        {/* Cultural Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <img 
            src={ilorinPattern3} 
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
              Share Your Story
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Have photos or videos from IEYDA events? Share them with us and be part of our visual story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Camera className="h-5 w-5 mr-2" />
                Submit Media
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">
                <ExternalLink className="h-5 w-5 mr-2" />
                Follow Us
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
      `}</style>
    </div>
  )
}

export default GalleryPage
