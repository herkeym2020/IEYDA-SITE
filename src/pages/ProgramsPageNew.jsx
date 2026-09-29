import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Target, 
  Award, 
  GraduationCap,
  TrendingUp,
  Heart,
  Building,
  Globe,
  Calendar,
  MapPin,
  UserCheck,
  DollarSign,
  Clock,
  CheckCircle,
  ArrowRight,
  Play,
  Download,
  Share2,
  Briefcase,
  HandHeart,
  Lightbulb,
  Shield,
  X
} from 'lucide-react'
import communityImage1 from '../assets/yFAvXjklLejr.jpg'
import communityImage2 from '../assets/P8wodN6fxLYt.jpg'
import communityImage3 from '../assets/GgmJonl1FD04.jpg'
import communityImage4 from '../assets/R92I275XDXjF.jpg'
import youthEmpowermentImage from '../assets/TcNX6NjKH8nZ.jpg'
import abstractBg from '../assets/VeKiraO1Skp4.jpg'
import youthEmpowermentBg from '../assets/45nOkJspxo2J.jpeg'
import ilorinPattern1 from '../assets/ilorin_pattern_1.png'
import ilorinPattern2 from '../assets/ilorin_pattern_2.png'
import ilorinPattern3 from '../assets/ilorin_pattern_3.png'
import { getImageUrl } from '@/lib/utils'

const ProgramsPage = () => {
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [apiPrograms, setApiPrograms] = useState([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const d = await apiFetch('/programs', { signal: controller.signal })
        if (cancelled) return
        const data = d?.data || d || []
        const transformed = data.map(program => ({
          ...program,
          image: getImageUrl(program.image),
          icon: program.icon || 'bi-award',
          beneficiaries: program.beneficiaries || '',
          budget: program.budget || '',
          duration: program.duration || '',
          startDate: program.start_date || '',
          endDate: program.end_date || '',
          objectives: program.objectives || [],
          achievements: program.achievements || [],
          partners: program.partners || [],
          locations: program.locations || [],
          progress: program.progress || 0,
          coordinator: program.coordinator || '',
          status: program.status || '',
          color: 'from-blue-500 to-blue-700',
          bgColor: 'from-blue-50 to-indigo-50',
        }))
        setApiPrograms(transformed)
      } catch (err) {
        if (cancelled) return
        setError('Failed to load programs.')
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

  const programCategories = [
    {
      id: 'empowerment',
      name: 'Youth Empowerment',
      icon: Users,
      color: 'from-blue-500 to-blue-700',
      description: 'Comprehensive programs to develop youth skills and capabilities'
    },
    {
      id: 'education',
      name: 'Education & Training',
      icon: GraduationCap,
      color: 'from-green-500 to-green-700',
      description: 'Educational support and skill development initiatives'
    },
    {
      id: 'community',
      name: 'Community Development',
      icon: Building,
      color: 'from-purple-500 to-purple-700',
      description: 'Programs focused on community growth and development'
    },
    {
      id: 'economic',
      name: 'Economic Development',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-700',
      description: 'Economic empowerment and entrepreneurship programs'
    }
  ]

  const featuredPrograms = apiPrograms;

  // Dynamic impact stats
  const totalPrograms = apiPrograms.length;
  const totalBeneficiaries = apiPrograms.reduce((sum, p) => {
    const num = typeof p.beneficiaries === 'string' ? parseInt(p.beneficiaries.replace(/\D/g, '')) : 0;
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const totalBudget = apiPrograms.reduce((sum, p) => {
    const num = typeof p.budget === 'string' ? parseInt(p.budget.replace(/\D/g, '')) : 0;
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const allLocations = apiPrograms.flatMap(p => Array.isArray(p.locations) ? p.locations : []).filter(Boolean);
  const uniqueLocations = Array.from(new Set(allLocations.map(l => l.trim().toLowerCase())));

  const impactStats = [
    {
      icon: Users,
      number: totalBeneficiaries ? totalBeneficiaries + '+' : '0',
      label: "Lives Impacted",
      description: "Direct beneficiaries across all programs"
    },
    {
      icon: Award,
      number: totalPrograms,
      label: "Active Programs",
      description: "Currently running initiatives"
    },
    {
      icon: MapPin,
      number: uniqueLocations.length,
      label: "LGAs Covered",
      description: "Local Government Areas served"
    },
    {
      icon: DollarSign,
      number: totalBudget ? `₦${totalBudget.toLocaleString()}` : '₦0',
      label: "Total Investment",
      description: "Cumulative program funding"
    }
  ];

  if (loading) {
    return (
      <div className="pt-20">
        <div className="container-max py-16 text-center text-muted-foreground">Loading Programs...</div>
      </div>
    )
  }

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
              <Target className="h-4 w-4 mr-2" />
              Empowerment Programs
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow">
              Empowering{' '}
              <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                Communities & Youth
              </span>
            </h1>
            
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Comprehensive empowerment initiatives designed to equip youth, strengthen communities, 
              and drive sustainable development across the Ilorin Emirate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact Statistics */}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Measurable results from our commitment to youth empowerment and community development.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {impactStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{stat.number}</h3>
                  <p className="font-semibold mb-1">{stat.label}</p>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Program Categories */}
      <section className="py-4 md:py-6 px-4 relative overflow-hidden">
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
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Program Categories</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our programs are organized into key focus areas to ensure comprehensive community development.
            </p>
          </motion.div>

          <Tabs defaultValue="empowerment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12">
              {programCategories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2 p-4"
                >
                  <category.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {programCategories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="mb-8 p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`bg-linear-to-r ${category.color} p-3 rounded-lg`}>
                        <category.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{category.name}</h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  </Card>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredPrograms
                      .filter(program => (program.category || '').toLowerCase().replace(/\s/g, '') === category.id)
                      .map((program, index) => (
                        <motion.div
                          key={program.id}
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                        >
                          <Card className="group hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
                            <div className="relative h-48 overflow-hidden">
                              <img 
                                src={program.image} 
                                alt={program.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={e => { e.target.src = '/placeholder-program.jpg'; }}
                              />
                              <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                              <div className="absolute top-4 right-4">
                                <Badge className={`${
                                  program.status === 'Active' ? 'bg-green-500' : 'bg-blue-500'
                                } text-white`}>
                                  {program.status}
                                </Badge>
                              </div>
                              <div className={`absolute bottom-4 left-4 bg-linear-to-r ${program.color} p-3 rounded-lg shadow-lg`}>
                                <program.icon className="h-6 w-6 text-white" />
                              </div>
                            </div>

                            <CardContent className="p-6">
                              <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-200">
                                {program.title}
                              </h3>
                              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                {program.description}
                              </p>
                              
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="flex items-center gap-1">
                                    <UserCheck className="h-4 w-4 text-green-600" />
                                    <span className="font-medium">{program.beneficiaries}</span>
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-4 w-4 text-blue-600" />
                                    <span className="font-medium">{program.budget}</span>
                                  </span>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>Progress</span>
                                    <span>{program.progress}%</span>
                                  </div>
                                  <Progress value={program.progress} className="h-2" />
                                </div>
                              </div>
                              
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-colors duration-200"
                                onClick={() => setSelectedProgram(program)}
                              >
                                View Details
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Program Detail Modal */}
  {selectedProgram && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
              
              <div className="relative h-64">
                <img 
                  src={selectedProgram.image} 
                  alt={selectedProgram.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-2xl font-bold mb-2">{selectedProgram.title}</h2>
                  <Badge className={`${
                    selectedProgram.status === 'Active' ? 'bg-green-500' : 'bg-blue-500'
                  } text-white`}>
                    {selectedProgram.status}
                  </Badge>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-3">Program Overview</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {selectedProgram.description}
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <h4 className="font-semibold mb-2">Key Objectives</h4>
                        <ul className="space-y-1">
                          {selectedProgram.objectives.map((objective, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Key Achievements</h4>
                        <ul className="space-y-1">
                          {selectedProgram.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <Award className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Program Details</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Beneficiaries</p>
                        <p className="font-semibold">{selectedProgram.beneficiaries}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Budget</p>
                        <p className="font-semibold">{selectedProgram.budget}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Duration</p>
                        <p className="font-semibold">{selectedProgram.duration}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Coordinator</p>
                        <p className="font-semibold">{selectedProgram.coordinator}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Progress</p>
                        <Progress value={selectedProgram.progress} className="h-3" />
                        <p className="text-sm text-gray-600 mt-1">{selectedProgram.progress}% Complete</p>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">Locations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProgram.locations.map((location, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="font-semibold mb-2">Partners</h4>
                      <div className="space-y-1">
                        {selectedProgram.partners.map((partner, index) => (
                          <p key={index} className="text-sm text-gray-600">{partner}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4 border-t">
                  <Button className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download Brochure
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Program
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
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
              Get Involved
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Join us in creating positive change. Whether as a beneficiary, volunteer, 
              or partner, there's a place for you in our mission.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Users className="h-5 w-5 mr-2" />
                Apply for Programs
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">
                <HandHeart className="h-5 w-5 mr-2" />
                Become a Partner
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ProgramsPage

