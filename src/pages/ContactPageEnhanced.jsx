import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { getAppSettings } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building,
  Globe,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink,
  CheckCircle,
  ArrowRight,
  Users,
  Heart,
  Target,
  Award,
  Sparkles,
  Calendar,
  HandHeart
} from 'lucide-react'
import '../styles/3d-effects.css'
import abstractBg from '../assets/VeKiraO1Skp4.jpg'
import youthEmpowermentBg from '../assets/45nOkJspxo2J.jpeg'
import communityImage1 from '../assets/yFAvXjklLejr.jpg'

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const injectedSettings = getAppSettings()
  const [settings, setSettings] = useState(injectedSettings)

  useEffect(() => {
    // Merge injected settings with API settings (API settings take precedence for additional data)
    apiFetch('/settings').then(d => setSettings(prev => ({ ...prev, ...d }))).catch(() => {})
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const [formError, setFormError] = useState(null)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)
    try {
      await apiFetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      setIsSubmitted(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      })
    } catch (err) {
      setFormError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Building,
      title: "National Secretariat",
      details: [
        settings.contact_address || settings.address || settings.office_address || 'IEYDA National Secretariat, Ilorin, Kwara State, Nigeria'
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        settings.phone_president && `${settings.phone_president} (President)`,
        settings.phone_secretary && `${settings.phone_secretary} (Secretary)`,
        settings.contact_phone ? `${settings.contact_phone} (General Inquiries)` : null
      ],
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        settings.email_general ? `${settings.email_general} (General)` : settings.contact_email ? `${settings.contact_email} (General)` : null,
        settings.email_president && `${settings.email_president} (President)`,
        settings.email_secretary && `${settings.email_secretary} (Secretary)`
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        settings.office_hours_weekdays || settings.office_hours || 'Monday - Friday: 9:00 AM - 5:00 PM',
        settings.office_hours_saturday || null,
        settings.office_hours_sunday || null
      ],
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ]

  const configuredDepartments = typeof settings.departments === 'string' ? (() => { try { return JSON.parse(settings.departments) } catch (_) { return [] } })() : settings.departments
  const departments = configuredDepartments && Array.isArray(configuredDepartments)
    ? configuredDepartments
    : []

  const socialLinks = [
    { icon: Facebook, name: "Facebook", url: settings.facebook_url || "https://web.facebook.com/ilorinemirateyouthdevelopmentassociation/", color: "text-blue-600" },
    { icon: Twitter, name: "Twitter", url: settings.twitter_url || "#", color: "text-sky-500" },
    { icon: Instagram, name: "Instagram", url: settings.instagram_url || "#", color: "text-pink-600" },
    { icon: Linkedin, name: "LinkedIn", url: settings.linkedin_url || "#", color: "text-blue-700" }
  ]

  const quickActions = [
    {
      title: "Become a Member",
      description: "Join our community of young leaders",
      icon: Users,
      color: "bg-blue-500",
      link: "/membership"
    },
    {
      title: "Volunteer",
      description: "Contribute to community development",
      icon: HandHeart,
      color: "bg-green-500",
      link: "/volunteer"
    },
    {
      title: "Donate",
      description: "Support our empowerment programs",
      icon: Heart,
      color: "bg-red-500",
      link: "/donate"
    },
    {
      title: "Events",
      description: "Join our upcoming activities",
      icon: Calendar,
      color: "bg-purple-500",
      link: "/events"
    }
  ]

  return (
    <div className="pt-20">
      {/* Enhanced Hero Section */}
      <section className="relative py-20 overflow-hidden min-h-[70vh] flex items-center">
        {/* Multi-layered Background */}
        <div className="absolute inset-0 pointer-events-none">
          <img 
            src={abstractBg} 
            alt="Abstract Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <img 
              src={youthEmpowermentBg} 
              alt="Youth Empowerment" 
              className="w-full h-full object-cover mix-blend-overlay"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/80 to-accent/85 pointer-events-none"></div>
          <div className="absolute inset-0 hero-pattern opacity-20 pointer-events-none"></div>
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
              <MessageSquare className="h-4 w-4 mr-2" />
              Get In Touch
            </Badge>
            
            <h1 className="heading-primary mb-6 text-shadow">
              Connect With{' '}
              <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                IEYDA
              </span>
            </h1>
            
            <p className="text-large mb-8 max-w-3xl mx-auto text-white/90">
              Ready to join our mission of youth empowerment and community development? 
              We're here to answer your questions and welcome you to our growing family.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200">
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-200 backdrop-blur-sm"
              >
                Visit Our Office
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="section-padding bg-linear-to-b from-gray-50 to-white">
        <div className="container-max">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-blue-100 text-blue-800">
              <Building className="h-4 w-4 mr-2" />
              Contact Information
            </Badge>
            <h2 className="heading-secondary mb-4">How to Reach Us</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Multiple ways to connect with IEYDA. Choose the most convenient option 
              for your needs and we'll respond promptly.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="feature-card h-full text-center group">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${info.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <info.icon className={`h-8 w-8 ${info.color}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-4">{info.title}</h3>
                    <div className="space-y-2">
                      {info.details.filter(Boolean).map((detail, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">
                          {detail}
                        </p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form and Map Section */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="feature-card">
                <CardContent className="p-8 relative z-10">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold mb-2">Send Us a Message</h3>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                  </div>

                  {isSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-2 text-green-700">Message Sent!</h4>
                      <p className="text-muted-foreground">
                        Thank you for contacting us. We'll respond within 24 hours.
                      </p>
                      <Button 
                        onClick={() => setIsSubmitted(false)}
                        className="mt-4"
                        variant="outline"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {formError && (
                        <div className="text-red-600 text-center mb-2">{formError}</div>
                      )}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name *</label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your full name"
                            required
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email Address *</label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="your.email@example.com"
                            required
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone Number</label>
                          <Input
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+234 xxx xxx xxxx"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Category</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="general">General Inquiry</option>
                            <option value="membership">Membership</option>
                            <option value="volunteer">Volunteer</option>
                            <option value="events">Events</option>
                            <option value="programs">Programs</option>
                            <option value="partnership">Partnership</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Subject *</label>
                        <Input
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="Brief subject of your message"
                          required
                          className="w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Message *</label>
                        <Textarea
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us more about your inquiry..."
                          required
                          rows={5}
                          className="w-full"
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Office Image and Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              {/* Office Image */}
              <Card className="feature-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative h-64 executive-image-container">
                    <img 
                      src={communityImage1} 
                      alt="IEYDA National Secretariat"
                      className="executive-image"
                    />
                    <div className="executive-depth-shadow"></div>
                    <div className="executive-shimmer pointer-events-none"></div>
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none"></div>
                    
                    <div className="absolute bottom-4 left-4 text-white">
                      <h4 className="text-lg font-semibold mb-1">IEYDA National Secretariat</h4>
                      <p className="text-sm opacity-90">Aishat Adepate House, Edun Street, Ilorin</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-semibold mb-3">Visit Our Office</h4>
                    <p className="text-muted-foreground mb-4">
                      Our doors are always open for community members, partners, and anyone 
                      interested in learning more about our programs and initiatives.
                    </p>
                    <Button variant="outline" className="w-full">
                      <MapPin className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="feature-card">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center text-center hover:bg-primary/5 transition-colors duration-200"
                      >
                        <div className={`w-8 h-8 ${action.color} rounded-full flex items-center justify-center mb-2`}>
                          <action.icon className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{action.title}</span>
                        <span className="text-xs text-muted-foreground mt-1">{action.description}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
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
              <Building className="h-4 w-4 mr-2" />
              Departments
            </Badge>
            <h2 className="heading-secondary mb-4">Specialized Contact Points</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Connect directly with our specialized departments for specific inquiries 
              and faster, more targeted assistance.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="card-hover h-full group">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                        {dept.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {dept.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-muted-foreground">{dept.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-muted-foreground">{dept.phone}</span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4 group-hover:bg-primary group-hover:text-white transition-colors duration-200"
                    >
                      Contact Department
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media and Follow Section */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-purple-100 text-purple-800">
              <Globe className="h-4 w-4 mr-2" />
              Stay Connected
            </Badge>
            <h2 className="heading-secondary mb-4">Follow Our Journey</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Stay updated with our latest activities, events, and impact stories 
              through our social media channels.
            </p>
          </motion.div>

          <div className="flex justify-center gap-6 mb-12">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="group"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:shadow-xl transition-all duration-200">
                  <social.icon className={`h-8 w-8 ${social.color} group-hover:scale-110 transition-transform duration-200`} />
                </div>
                <p className="text-sm text-center mt-2 text-muted-foreground group-hover:text-primary transition-colors duration-200">
                  {social.name}
                </p>
              </motion.a>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="feature-card max-w-2xl mx-auto">
              <CardContent className="p-8 text-center">
                <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Stay Informed</h3>
                <p className="text-muted-foreground mb-6">
                  Subscribe to our newsletter for updates on programs, events, and opportunities.
                </p>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter your email address"
                    className="flex-1"
                  />
                  <Button>
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="section-padding bg-linear-to-r from-primary via-primary/90 to-accent text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        
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
            <h2 className="heading-secondary mb-6 text-shadow">
              Ready to Make a Difference?
            </h2>
            <p className="text-large mb-8 max-w-3xl mx-auto text-white/90">
              Join thousands of young leaders who are already part of the IEYDA family. 
              Together, we're building a brighter future for the Ilorin Emirate.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200">
                <Users className="h-5 w-5 mr-2" />
                Join IEYDA Today
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white/30 text-secondary hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-200 backdrop-blur-sm"
              >
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage

