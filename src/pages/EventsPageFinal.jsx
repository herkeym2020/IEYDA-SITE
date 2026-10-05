import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  Filter,
  Search,
  Star,
  Award,
  Target,
  Heart,
  Briefcase,
  GraduationCap,
  Building,
  Globe,
  Sparkles,
  CheckCircle,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Share2
} from 'lucide-react'
import abstractBg from '../assets/VeKiraO1Skp4.jpg'
import youthEmpowermentBg from '../assets/45nOkJspxo2J.jpeg'
import { getImageUrl } from '@/lib/utils'

const EventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)
  const [showAllPast, setShowAllPast] = useState(false)
  const [showAllFeatured, setShowAllFeatured] = useState(false)
  const [apiEvents, setApiEvents] = useState(null)
  const [pastEvents, setPastEvents] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [upcomingRes, pastRes] = await Promise.all([
          apiFetch('/events', { signal: controller.signal }),
          apiFetch('/past-events', { signal: controller.signal })
        ])

        if (cancelled) return

        const eventsData = upcomingRes?.data || upcomingRes || []
        const transformedEvents = eventsData.map(event => ({
          ...event,
          image: getImageUrl(event.image),
          highlights: Array.isArray(event.highlights) ? event.highlights : [],
          speakers: Array.isArray(event.speakers) ? event.speakers : [],
          registration: event.registration || {
            fee: 'Free',
            deadline: event.registration_deadline || event.date,
            contact: event.contact_email || 'events@ieyda.org'
          }
        }))

        const pastEventsData = pastRes?.data || pastRes || []
        const transformedPastEvents = pastEventsData.map(event => ({
          ...event,
          image: getImageUrl(event.image),
          highlights: Array.isArray(event.highlights) ? event.highlights : [],
          speakers: Array.isArray(event.speakers) ? event.speakers : [],
          registration: event.registration || {
            fee: 'Free',
            deadline: event.registration_deadline || event.date,
            contact: event.contact_email || 'events@ieyda.org'
          }
        }))

        setApiEvents(transformedEvents)
        setPastEvents(transformedPastEvents)
      } catch (err) {
        if (cancelled) return
        setError('Failed to load events data.')
        setApiEvents([])
        setPastEvents([])
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

  if (error) {
    return (
      <div className="pt-20">
        <div className="container-max py-16 text-center text-red-600">{error}</div>
      </div>
    )
  }

  // Events data from API
  const allUpcomingEvents = apiEvents || []

  const allPastEvents = pastEvents || []

  const allFeaturedEvents = allUpcomingEvents.filter(event => event.featured)

  const categories = ['All', 'Empowerment', 'Training', 'Health', 'Technology', 'Leadership', 'Environment']

  const filteredUpcomingEvents = selectedCategory === 'All' 
    ? allUpcomingEvents 
    : allUpcomingEvents.filter(event => event.category === selectedCategory)

  const filteredPastEvents = selectedCategory === 'All' 
    ? allPastEvents 
    : allPastEvents.filter(event => event.category === selectedCategory)

  const visibleUpcoming = showAllUpcoming ? filteredUpcomingEvents : filteredUpcomingEvents.slice(0, 3)
  const visiblePast = showAllPast ? filteredPastEvents : filteredPastEvents.slice(0, 3)
  const visibleFeatured = showAllFeatured ? allFeaturedEvents : allFeaturedEvents.slice(0, 2)

  return (
    <div className="pt-20">
      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden min-h-[70vh] flex items-center">
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
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/20"></div>
        </div>
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-24 h-24 bg-secondary/20 rounded-full blur-xl"
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="container-max relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-lg px-6 py-2 backdrop-blur-sm">
              <Calendar className="h-4 w-4 mr-2" />
              Events & Programs
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Join Our{' '}
              <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                Transformative Events
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-white/90 leading-relaxed">
              Participate in life-changing events, workshops, and community activities designed to 
              empower, educate, and bring people together across the Ilorin Emirate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding bg-gray-50">
        <div className="container-max">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`px-6 py-2 transition-all duration-200 ${
                  selectedCategory === category 
                    ? 'bg-primary text-white shadow-md' 
                    : 'hover:bg-primary/10'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Section with See More/Less */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-yellow-100 text-yellow-800">
              <Star className="h-4 w-4 mr-2" />
              Featured Events
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't Miss These</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our signature events that create the most impact and provide exceptional 
              opportunities for growth, learning, and community building.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {visibleFeatured.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden h-full">
                  <CardContent className="p-0">
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-yellow-500 text-black border-0 shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4 text-white">
                        <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-2" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-2" />
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Badge className="bg-primary/10 text-primary">
                          {event.category}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Users className="h-4 w-4 mr-1" />
                          <span>{event.attendees} Expected</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {event.description}
                      </p>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-200"
                            onClick={() => setSelectedEvent(event)}
                          >
                            View Details & Register
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">
                              {event.title}
                            </DialogTitle>
                            <div className="flex items-center justify-end mt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const url = `${window.location.origin}/events/${event.slug || event.id}`
                                  const title = event.title
                                  const text = event.description || ''
                                  import('@/lib/share').then(m => m.shareContent({ title, text, url }))
                                }}
                              >
                                <Share2 className="h-4 w-4 mr-2" />
                                Share
                              </Button>
                            </div>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            <div className="relative h-64 rounded-lg overflow-hidden">
                              <img 
                                src={event.image} 
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                              <div className="absolute bottom-4 left-4 text-white">
                                <Badge className="bg-yellow-500 text-black mb-2">
                                  Featured Event
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3">Event Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-primary" />
                                    <span>{event.time}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                                    <span>{event.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2 text-primary" />
                                    <span>{event.attendees} Expected Attendees</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-3">Registration Info</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center">
                                    <Award className="h-4 w-4 mr-2 text-primary" />
                                    <span>Fee: {event.registration.fee}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                                    <span>Deadline: {new Date(event.registration.deadline).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-primary" />
                                    <span>{event.registration.contact}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">About This Event</h4>
                              <p className="text-muted-foreground leading-relaxed mb-4">
                                {event.description}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Event Highlights</h4>
                              <ul className="space-y-2">
                                {event.highlights.map((highlight, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Featured Speakers</h4>
                              <ul className="space-y-2">
                                {event.speakers.map((speaker, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{speaker}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="flex gap-4">
                              {event.registration && event.registration.link ? (
                                <a
                                  href={event.registration.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 inline-flex items-center justify-center bg-primary text-white px-4 py-3 rounded-md font-medium hover:opacity-95 transition"
                                  aria-label={`Register for ${event.title}`}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Register Now
                                </a>
                              ) : (
                                <Button className="flex-1" size="lg" disabled>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Register Now
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="lg"
                                onClick={() => {
                                  if (event.registration && event.registration.contact) {
                                    // open mail client if email present, otherwise fallback to phone
                                    const contact = event.registration.contact;
                                    if (contact.includes('@')) {
                                      window.open(`mailto:${contact}`);
                                    } else {
                                      window.open(`tel:${contact}`);
                                    }
                                  }
                                }}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Contact Us
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* See More/Less Button for Featured Events */}
          {allFeaturedEvents.length > 2 && (
            <div className="text-center">
              <Button
                onClick={() => setShowAllFeatured(!showAllFeatured)}
                variant="outline"
                size="lg"
                className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
              >
                {showAllFeatured ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    See Less Featured
                    <ChevronUp className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    See All Featured ({allFeaturedEvents.length})
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section with See More/Less */}
      <section className="section-padding bg-linear-to-b from-gray-50 to-white">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-green-100 text-green-800">
              <Calendar className="h-4 w-4 mr-2" />
              Upcoming Events
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What's Coming Next</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Mark your calendars for these exciting upcoming events and opportunities 
              to grow, learn, and connect with the IEYDA community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {visibleUpcoming.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden h-full">
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-green-500 text-white border-0 shadow-lg">
                          {event.category}
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{event.attendees}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2 text-primary" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-200"
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEvent(event)}
                          >
                            Learn More
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">
                              {event.title}
                            </DialogTitle>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            <div className="relative h-64 rounded-lg overflow-hidden">
                              <img 
                                src={event.image} 
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                              <div className="absolute bottom-4 left-4 text-white">
                                <Badge className="bg-green-500 text-white mb-2">
                                  {event.category}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold mb-3">Event Details</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-2 text-primary" />
                                    <span>{event.time}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                                    <span>{event.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2 text-primary" />
                                    <span>{event.attendees} Expected Attendees</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-3">Registration Info</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex items-center">
                                    <Award className="h-4 w-4 mr-2 text-primary" />
                                    <span>Fee: {event.registration.fee}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                                    <span>Deadline: {new Date(event.registration.deadline).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Mail className="h-4 w-4 mr-2 text-primary" />
                                    <span>{event.registration.contact}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">About This Event</h4>
                              <p className="text-muted-foreground leading-relaxed mb-4">
                                {event.description}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Event Highlights</h4>
                              <ul className="space-y-2">
                                {event.highlights.map((highlight, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{highlight}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-3">Featured Speakers</h4>
                              <ul className="space-y-2">
                                {event.speakers.map((speaker, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <Star className="h-4 w-4 mr-2 text-yellow-500 mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{speaker}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div className="flex gap-4">
                              {event.registration && event.registration.link ? (
                                <a
                                  href={event.registration.link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 inline-flex items-center justify-center bg-primary text-white px-4 py-3 rounded-md font-medium hover:opacity-95 transition"
                                  aria-label={`Register for ${event.title}`}>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Register Now
                                </a>
                              ) : (
                                <Button className="flex-1" size="lg" disabled>
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Register Now
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="lg"
                                onClick={() => {
                                  if (event.registration && event.registration.contact) {
                                    const contact = event.registration.contact;
                                    if (contact.includes('@')) {
                                      window.open(`mailto:${contact}`);
                                    } else {
                                      window.open(`tel:${contact}`);
                                    }
                                  }
                                }}
                              >
                                <Phone className="h-4 w-4 mr-2" />
                                Contact Us
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* See More/Less Button for Upcoming Events */}
          {filteredUpcomingEvents.length > 3 && (
            <div className="text-center">
              <Button
                onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                variant="outline"
                size="lg"
                className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
              >
                {showAllUpcoming ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    See Less Upcoming
                    <ChevronUp className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    See All Upcoming ({filteredUpcomingEvents.length})
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              <Award className="h-4 w-4 mr-2" />
              Past Events
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Success Stories</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Look back at the successful events we've organized and the positive 
              impact they've had on our community and participants.
            </p>
          </motion.div>

          {allPastEvents.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {visiblePast.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden h-full">
                      <CardContent className="p-0">
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>

                          <div className="absolute top-4 left-4">
                            <Badge className="bg-blue-500 text-white border-0 shadow-lg">
                              Completed
                            </Badge>
                          </div>

                          <div className="absolute bottom-4 left-4 text-white">
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                <span>{new Date(event.date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                <span>{event.attendees}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-6">
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                            {event.title}
                          </h3>

                          <div className="mb-4">
                            <Badge className="bg-gray-100 text-gray-700 text-xs">
                              {event.category}
                            </Badge>
                          </div>

                          <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                            {event.description}
                          </p>

                          {event.outcomes && event.outcomes.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold text-sm mb-2">Key Outcomes:</h4>
                              <ul className="space-y-1">
                                {event.outcomes.slice(0, 2).map((outcome, idx) => (
                                  <li key={idx} className="flex items-start text-sm">
                                    <CheckCircle className="h-3 w-3 mr-2 text-green-500 mt-0.5 shrink-0" />
                                    <span className="text-muted-foreground">{outcome}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <Button
                            className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-200"
                            variant="outline"
                            size="sm"
                          >
                            View Results
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* See More/Less Button for Past Events */}
              {filteredPastEvents.length > 3 && (
                <div className="text-center">
                  <Button
                    onClick={() => setShowAllPast(!showAllPast)}
                    variant="outline"
                    size="lg"
                    className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
                  >
                    {showAllPast ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        See Less Past Events
                        <ChevronUp className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        See All Past Events ({filteredPastEvents.length})
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Award className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Past Events Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're working on showcasing our completed events and their impact on the community.
                Check back soon to see our success stories!
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-padding bg-linear-to-r from-primary via-primary/90 to-accent text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/20"></div>
        
        {/* Floating Elements */}
        <motion.div 
          className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-20 right-20 w-24 h-24 bg-secondary/20 rounded-full blur-xl"
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 0.9, 1],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="container-max relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Join Our Next Event?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Don't miss out on opportunities to grow, learn, and connect with like-minded 
              individuals. Register for our upcoming events today!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-black font-semibold text-lg px-8 py-4 hover:scale-105 transition-transform duration-200">
                <Calendar className="h-5 w-5 mr-2" />
                View All Events
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-200 backdrop-blur-sm"
              >
                <Mail className="h-5 w-5 mr-2" />
                Get Event Updates
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default EventsPage
