import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Target, 
  Eye, 
  Heart,
  Users,
  Award,
  CheckCircle,
  ArrowRight,
  Crown,
  Building,
  Calendar,
  Sparkles,
  Globe,
  HandHeart
} from 'lucide-react'
import abstractBg from '../assets/VeKiraO1Skp4.jpg'
import youthEmpowermentBg from '../assets/45nOkJspxo2J.jpeg'
import communityImage1 from '../assets/yFAvXjklLejr.jpg'
import communityImage2 from '../assets/P8wodN6fxLYt.jpg'

const AboutPage = () => {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const d = await apiFetch('/settings', { signal: controller.signal })
        if (cancelled) return
        setSettings(d || {})
      } catch (err) {
        if (cancelled) return
        setError('Unable to load settings.')
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
  return (
    <div className="pt-20">
      {/* Enhanced Hero Section */}
      <section className="section-padding relative overflow-hidden min-h-[70vh] flex items-center">
        {/* Multi-layered Background */}
        <div className="absolute inset-0">
          <img 
            src={abstractBg} 
            alt="Abstract Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/80 to-accent/85"></div>
          <div className="absolute inset-0 hero-pattern opacity-20"></div>
          
          {/* Floating Elements */}
          <motion.div 
            className="absolute top-20 left-10 w-20 h-20 bg-secondary/30 rounded-full blur-xl"
            animate={{ 
              y: [0, -20, 0],
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div 
            className="absolute bottom-20 right-20 w-32 h-32 bg-accent/25 rounded-full blur-xl"
            animate={{ 
              y: [0, 15, 0],
              scale: [1, 0.9, 1],
              opacity: [0.4, 0.7, 0.4]
            }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          />
        </div>
        
        <div className="container-max relative z-10 text-white">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-lg px-6 py-2 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                About IEYDA
              </Badge>
            </motion.div>
            <h1 className="heading-primary mb-6 text-shadow">
              Empowering Youth Since{' '}
              <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                2014
              </span>
            </h1>
            <p className="text-large text-white/90 leading-relaxed">
              The Ilorin Emirate Youth Development Association is a community-based organization 
              dedicated to improving the social and economic well-being of our community through 
              innovative programs and collaborative partnerships.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Mission, Vision, Values */}
      <section className="section-padding relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent/3 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container-max relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary">Our Foundation</Badge>
            <h2 className="heading-secondary mb-4">Built on Strong Values</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Our mission, vision, and values guide everything we do as we work to create 
              lasting positive change in the Ilorin Emirate.
            </p>
          </motion.div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="feature-card h-full border-l-4 border-l-primary group-hover:border-l-primary/80 transition-colors duration-300">
                <CardContent className="p-8 text-center">
                  <motion.div 
                    className="bg-linear-to-br from-primary/10 to-primary/5 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Target className="h-8 w-8 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To foster community development through youth empowerment, economic development programs, 
                    and collaborative initiatives that improve the lives of people in the Ilorin Emirate.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="feature-card h-full border-l-4 border-l-accent group-hover:border-l-accent/80 transition-colors duration-300">
                <CardContent className="p-8 text-center">
                  <motion.div 
                    className="bg-linear-to-br from-accent/10 to-accent/5 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Eye className="h-8 w-8 text-accent" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-accent transition-colors duration-300">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    A thriving Ilorin Emirate where every young person has the opportunity to reach 
                    their full potential and contribute meaningfully to community development.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <Card className="feature-card h-full border-l-4 border-l-secondary group-hover:border-l-secondary/80 transition-colors duration-300">
                <CardContent className="p-8 text-center">
                  <motion.div 
                    className="bg-linear-to-br from-secondary/10 to-secondary/5 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Heart className="h-8 w-8 text-secondary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-secondary transition-colors duration-300">Our Values</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Community First, Youth Empowerment, and Excellence in all our programs and initiatives 
                    guide everything we do.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary">Our History</Badge>
            <h2 className="heading-secondary mb-4">A Decade of Community Service</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              From our incorporation in 2014 to becoming the leading voice of Ilorin Emirate youth, 
              our journey has been one of continuous growth and impact.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Founded in 2014</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Ilorin Emirate Youth Development Association (IEYDA) was registered as an incorporated trustees 
                        under the laws of Federal Republic of Nigeria in 2014 on the introduction of the Association 
                        to Corporate Affairs Commission (CAC) by His Royal Highness, Alh. (Dr) Ibrahim Sulu Gambari, CFR, 
                        the Emir of Ilorin.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 mb-6">
                    <div className="bg-accent/10 p-3 rounded-lg">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Visionary Formation</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        The association was formed and promoted by visionary young like-minds sons and daughters 
                        of Ilorin Emirate comprising of Asa, Ilorin East, Ilorin South, Ilorin West and Moro 
                        Local Government Areas of Kwara State.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-secondary/10 p-3 rounded-lg">
                      <Award className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Leading Voice</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Since incorporation, the association has been the leading voice of the Youths of Ilorin Emirate 
                        through developmental programmes, promoting and preserving cultural heritage of Ilorin Emirate 
                        as well as organizing periodic and annual empowerment programmes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-accent/10 text-accent">Leadership</Badge>
            <h2 className="heading-secondary mb-4">Dedicated Leaders</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Our leadership team brings together experienced professionals committed to 
              youth development and community empowerment.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="feature-card">
                <CardContent className="p-8 text-center">
                  <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Crown className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Grand Patron</h3>
                  <h4 className="text-lg font-medium text-primary mb-2">
                    His Royal Highness, Alhaji (Dr) Ibrahim Sulu Gambari, CFR
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    The Emir of Ilorin, Chairman, Kwara State Traditional Council of Chiefs and Obas, 
                    and Chancellor, Bayero University Kano (BUK)
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="feature-card">
                <CardContent className="p-8 text-center">
                  <div className="bg-secondary/10 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Users className="h-10 w-10 text-secondary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">National President</h3>
                  <h4 className="text-lg font-medium text-secondary mb-2">
                    Alh. Mohammed Uthman Jagunmo
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ilorin South Local Government Area
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Leading IEYDA with vision and dedication to community development.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline">
              View Full Leadership Team
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section className="section-padding bg-linear-to-b from-white to-gray-50">
        <div className="container-max">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-green-100 text-green-800">
              <Users className="h-4 w-4 mr-2" />
              Our Communities
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Communities United as IEYDA</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              IEYDA is a coalition of vibrant youth and community groups from across the Ilorin Emirate. These communities come together, sharing resources, ideas, and passion to drive positive change and empower the next generation. Our strength lies in our unity and collaboration.
            </p>
          </motion.div>
          <div className="text-center mt-6">
            <Button asChild size="lg" className="px-8 py-4 text-lg font-semibold">
              <a href="/community">
                Meet Our Communities
                <ArrowRight className="h-5 w-5 ml-2 inline" />
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
