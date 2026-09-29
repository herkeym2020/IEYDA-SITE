import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Crown,
  Users,
  Mail,
  Phone,
  MapPin,
  Award,
  Star,
  Building,
  GraduationCap,
  Briefcase,
  Shield,
  Target,
  Heart,
  ArrowRight,
  CheckCircle,
  Calendar,
  Globe,
  UserCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react'
import abstractBg from '../assets/VeKiraO1Skp4.jpg'
import youthEmpowermentBg from '../assets/45nOkJspxo2J.jpeg'
import presidentImage from '../assets/wlf7jBIWw6f3.jpg'
import grandPatronImage from '../assets/8UyofGMTSzUa.jpg'
import communityImage1 from '../assets/yFAvXjklLejr.jpg'
import communityImage2 from '../assets/P8wodN6fxLYt.jpg'
import communityImage3 from '../assets/GgmJonl1FD04.jpg'
import communityImage4 from '../assets/R92I275XDXjF.jpg'
import { getImageUrl } from '@/lib/utils'

const TeamPage = () => {
  const [activeExecutiveType, setActiveExecutiveType] = useState('present') // 'present' or 'pioneering'
  const [selectedMember, setSelectedMember] = useState(null)
  const [showAllBoard, setShowAllBoard] = useState(false)
  const [showAllDepartments, setShowAllDepartments] = useState(false)
  const [showAllPresentLeadership, setShowAllPresentLeadership] = useState(false)
  const [showAllPioneeringLeadership, setShowAllPioneeringLeadership] = useState(false)
  const [apiTeam, setApiTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const d = await apiFetch('/team', { signal: controller.signal })
        if (cancelled) return
        setApiTeam(d?.data || d || [])
      } catch (err) {
        if (cancelled) return
        setError('Failed to load team data')
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

  // Dynamic data filtering
  const grandPatron = apiTeam?.find(member => member.type === 'grand_patron');
  const presentExecutives = apiTeam?.filter(member => member.type === 'executive_present');
  const pioneeringExecutives = apiTeam?.filter(member => member.type === 'executive_pioneering');
  const boardOfTrustees = apiTeam?.filter(member => member.type === 'board_of_trustees');
  const departments = apiTeam?.filter(member => member.type === 'department') || [];

  // President detection helper
  const isPresident = (m) => {
    const pos = (m?.position || '').toLowerCase()
    const pri = Number(m?.priority)
    return pos.includes('president') || pri === 1
  }

  // Extract presidents for each type (robust selection)
  const presentPresident = presentExecutives?.find(isPresident) || null
  const pioneeringPresident = pioneeringExecutives?.find(isPresident) || null

  const currentExecutives = activeExecutiveType === 'present' ? (presentExecutives || []) : (pioneeringExecutives || [])
  const executiveLevelMembers = (currentExecutives || [])
    .filter(member => member && member.id !== presentPresident?.id && member.id !== pioneeringPresident?.id)
    .filter(member => !isPresident(member) && Number(member.priority) > 1)
  const leadershipLevelMembers = (currentExecutives || [])
    .filter(member => member && member.id !== presentPresident?.id && member.id !== pioneeringPresident?.id)
    .filter(member => !isPresident(member) && (Number(member.priority) < 1 || member.priority === null || member.priority === undefined))
  const visibleLeadershipExecutives = activeExecutiveType === 'present'
    ? (showAllPresentLeadership ? leadershipLevelMembers : leadershipLevelMembers.slice(0, 3))
    : (showAllPioneeringLeadership ? leadershipLevelMembers : leadershipLevelMembers.slice(0, 3))

  const visibleBoard = showAllBoard ? (boardOfTrustees || []) : ((boardOfTrustees || []).slice(0, 6))


  if (loading) {
    return (
      <div className="pt-20">
        <div className="container-max py-16 text-center text-muted-foreground">Loading Executive...</div>
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

  // ...existing code...

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
              <Users className="h-4 w-4 mr-2" />
              Our Team
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Meet Our{' '}
              <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                Leadership Team
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto text-white/90 leading-relaxed">
              Dedicated leaders working tirelessly to empower youth and build stronger 
              communities across the Ilorin Emirate through vision, commitment, and collaborative action.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grand Patron Section */}
      <section className="section-padding bg-linear-to-b from-gray-50 to-white">
        <div className="container-max">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-yellow-100 text-yellow-800">
              <Crown className="h-4 w-4 mr-2" />
              Grand Patron
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Royal Patronage</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Under the distinguished patronage of His Royal Highness, the Emir of Ilorin, 
              IEYDA continues to thrive and serve the youth of the Emirate.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            {grandPatron ? (
              <Card className="overflow-hidden shadow-2xl border-0 bg-linear-to-br from-white to-gray-50">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative h-80 md:h-96">
                      <img 
                        src={getImageUrl(grandPatron.image) || grandPatronImage} 
                        alt={grandPatron.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent"></div>
                    </div>
                    
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <div className="mb-6">
                        <Crown className="h-12 w-12 text-yellow-600 mb-4" />
                        <div className="text-2xl md:text-3xl font-bold mb-2">
                          {grandPatron.salute && (
                            <div className="mb-1 text-yellow-600">{grandPatron.salute}</div>
                          )}
                          <div>{grandPatron.name}</div>
                        </div>
                        <h4 className="text-xl md:text-2xl text-primary font-semibold mb-2">
                          {grandPatron.position}
                        </h4>
                        {grandPatron.awards && (
                          <Badge className="mb-4 bg-yellow-100 text-yellow-800">{grandPatron.awards}</Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {grandPatron.bio}
                      </p>
                      
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">Ilorin Emirate</Badge>
                        {grandPatron.awards && (
                          <Badge variant="outline" className="text-xs">{grandPatron.awards}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-12">
                <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Grand Patron</h3>
                <p className="text-gray-500">Information coming soon...</p>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Executive Committee Section */}
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
              <Shield className="h-4 w-4 mr-2" />
              Executive Committee
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Excellence</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              {activeExecutiveType === 'present' 
                ? "Meet our current executive team leading IEYDA into the future with innovation and dedication."
                : "Honor the pioneering leaders who established IEYDA and built its foundation from 2014 to 2024."
              }
            </p>
          </motion.div>

          {/* Toggle Buttons */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <Button
                onClick={() => setActiveExecutiveType('present')}
                variant={activeExecutiveType === 'present' ? 'default' : 'ghost'}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeExecutiveType === 'present' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock className="h-4 w-4 mr-2" />
                Present Executives (2024 - Date)
              </Button>
              <Button
                onClick={() => setActiveExecutiveType('pioneering')}
                variant={activeExecutiveType === 'pioneering' ? 'default' : 'ghost'}
                className={`px-6 py-3 rounded-md transition-all duration-200 ${
                  activeExecutiveType === 'pioneering' 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Star className="h-4 w-4 mr-2" />
                Pioneering Executives (2014 - 2024)
              </Button>
            </div>
          </div>

          {/* Executive Cards */}
          <motion.div 
            key={activeExecutiveType}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Special Card for Present Executives */}
            {activeExecutiveType === 'present' && presentPresident && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                className="group"
              >
                <Card className="border-0 shadow-2xl overflow-hidden bg-linear-to-r from-blue-50 via-cyan-50 to-blue-50 transition-all duration-500 group-hover:shadow-blue-500/20 group-hover:shadow-[0_20px_70px_-10px_rgba(59,130,246,0.5)]">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-4 gap-0">
                      {/* President Image */}
                      <div className="relative h-80 md:h-full overflow-hidden">
                        <motion.img 
                          src={getImageUrl(presentPresident.image)} 
                          alt={presentPresident.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 1.2 }}
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-blue-600 text-white border-0">
                            <Crown className="h-3 w-3 mr-1" />
                            National President
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center bg-linear-to-b from-blue-50 to-cyan-50">
                        <div className="flex items-center gap-3 mb-4">
                          <Clock className="h-6 w-6 text-blue-600" />
                          <Badge className="bg-blue-600 text-white border-0">
                            Present Team
                          </Badge>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                          Current Leadership
                        </h3>
                        <p className="text-lg text-blue-600 font-semibold mb-2">
                          {presentPresident.name}
                        </p>
                        <p className="text-blue-700 font-medium mb-4">
                          {presentPresident.position}
                        </p>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          Our present executive team is dedicated to driving IEYDA forward with fresh perspectives and innovative strategies. Together, they lead with passion and commitment to community development and youth empowerment.
                        </p>
                        
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="text-muted-foreground">{presentPresident.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-blue-600" />
                            <span className="text-muted-foreground">{presentPresident.phone}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Innovation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Unity</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">Progress</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Special Card for Pioneering Executives */}
            {activeExecutiveType === 'pioneering' && pioneeringPresident && (
              <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3 } }}
                className="group"
              >
                <Card className="border-0 shadow-2xl overflow-hidden bg-linear-to-r from-purple-50 via-pink-50 to-purple-50 transition-all duration-500 group-hover:shadow-purple-500/20 group-hover:shadow-[0_20px_70px_-10px_rgba(168,85,247,0.5)]">
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-4 gap-0">
                      {/* President Image */}
                      <div className="relative h-80 md:h-full overflow-hidden">
                        <motion.img 
                          src={getImageUrl(pioneeringPresident.image)} 
                          alt={pioneeringPresident.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          initial={{ scale: 1.1, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 1.2 }}
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent"></div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-purple-600 text-white border-0">
                            <Star className="h-3 w-3 mr-1" />
                            Pioneering President
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center bg-linear-to-b from-purple-50 to-pink-50">
                        <div className="flex items-center gap-3 mb-4">
                          <Star className="h-6 w-6 text-purple-600" />
                          <Badge className="bg-purple-600 text-white border-0">
                            Pioneering Legacy
                          </Badge>
                        </div>
                        
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                          Pioneering Leadership
                        </h3>
                        <p className="text-lg text-purple-600 font-semibold mb-2">
                          {pioneeringPresident.name}
                        </p>
                        <p className="text-purple-700 font-medium mb-4">
                          {pioneeringPresident.position}
                        </p>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          These visionary leaders established IEYDA's foundation and nurtured it through its formative decade. Their pioneering spirit, dedication, and sacrifice have shaped the organization into the beacon of hope it is today.
                        </p>
                        
                        <div className="space-y-2 mb-4 text-sm">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-purple-600" />
                            <span className="text-muted-foreground">{pioneeringPresident.email}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-purple-600" />
                            <span className="text-muted-foreground">{pioneeringPresident.phone}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 items-center">
                          <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Legacy</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Foundation</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Vision</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Executive Level (President and VPs) */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {executiveLevelMembers
                .sort((a, b) => a.priority - b.priority)
                .map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`${member.priority === 1 ? 'md:col-span-2 lg:col-span-3' : ''}`}
                >
                  <Card className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden ${
                    member.priority === 1 ? 'bg-linear-to-br from-primary/5 to-accent/5' : 'bg-white'
                  }`}>
                    <CardContent className="p-0">
                      <div className={`grid ${member.priority === 1 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-0`}>
                        <div className={`relative ${member.priority === 1 ? 'h-80' : 'h-64'} overflow-hidden`}>
                          <img 
                            src={getImageUrl(member.image)} 
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                          
                          {/* Position Badge */}
                          <div className="absolute top-4 left-4">
                            <Badge className={`${
                              member.priority === 1 
                                ? 'bg-yellow-500 text-black' 
                                : 'bg-blue-500 text-white'
                            } border-0 shadow-lg`}>
                              {member.priority === 1 ? (
                                <>
                                  <Crown className="h-3 w-3 mr-1" />
                                  President
                                </>
                              ) : (
                                <>
                                  <Shield className="h-3 w-3 mr-1" />
                                  Executive
                                </>
                              )}
                            </Badge>
                          </div>

                          {/* Contact Info Overlay */}
                          <div className="absolute bottom-4 left-4 text-white">
                            <div className="flex items-center mb-1 text-sm">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{member.location || 'Ilorin'}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{member.term || 'Current'}</span>
                            </div>
                          </div>
                        </div>

                        <div className={`p-6 ${member.priority === 1 ? 'md:p-8' : ''} flex flex-col justify-center`}>
                          <div className="mb-4">
                            <h3 className={`${member.priority === 1 ? 'text-2xl md:text-3xl' : 'text-xl'} font-bold mb-2 group-hover:text-primary transition-colors duration-200`}>
                              {member.name}
                            </h3>
                            <p className={`${member.priority === 1 ? 'text-lg' : 'text-base'} text-primary font-semibold mb-3`}>
                              {member.position}
                            </p>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                              {member.bio}
                            </p>
                          </div>

                          <div className="space-y-2 mb-4 text-sm">
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-muted-foreground">{member.email}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-2 text-primary" />
                              <span className="text-muted-foreground">{member.phone}</span>
                            </div>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-200"
                                variant="outline"
                                onClick={() => setSelectedMember(member)}
                              >
                                View Details
                                <ArrowRight className="h-4 w-4 ml-2" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-bold">
                                  {member.name}
                                </DialogTitle>
                              </DialogHeader>
                              
                              <div className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                  <div className="space-y-4">
                                    <div className="relative h-64 rounded-lg overflow-hidden">
                                      <img 
                                        src={getImageUrl(member.image)} 
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    
                                    <div>
                                      <Badge className="mb-2 bg-primary/10 text-primary">
                                        {member.position}
                                      </Badge>
                                      <p className="text-sm text-muted-foreground">{member.location || 'Ilorin'}</p>
                                      <p className="text-sm text-muted-foreground">{member.term || 'Current'}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="font-semibold mb-2">About</h4>
                                      <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                                    </div>
                                    
                                    <div>
                                      <h4 className="font-semibold mb-2">Contact Information</h4>
                                      <div className="space-y-2 text-sm">
                                        <div className="flex items-center">
                                          <Mail className="h-4 w-4 mr-2 text-primary" />
                                          <span className="text-muted-foreground">{member.email}</span>
                                        </div>
                                        <div className="flex items-center">
                                          <Phone className="h-4 w-4 mr-2 text-primary" />
                                          <span className="text-muted-foreground">{member.phone}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center">
                                  <Award className="h-4 w-4 mr-2 text-primary" />
                                  Key Achievements
                                </h4>
                                <ul className="space-y-2">
                                  {member.achievements && member.achievements.length > 0 ? (
                                    member.achievements.map((achievement, idx) => (
                                      <li key={idx} className="flex items-start">
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">{achievement}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                                      <span className="text-muted-foreground">Dedicated service to IEYDA and community development</span>
                                    </li>
                                  )}
                                </ul>
                              </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Leadership Level */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleLeadershipExecutives
                .sort((a, b) => a.priority - b.priority)
                .map((member, index) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: (index + 3) * 0.1 }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={getImageUrl(member.image)} 
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-green-500 text-white border-0 shadow-lg">
                            <UserCheck className="h-3 w-3 mr-1" />
                            Leadership
                          </Badge>
                        </div>

                        <div className="absolute bottom-4 left-4 text-white">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{member.term || 'Current'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-200">
                          {member.name}
                        </h3>
                        <p className="text-primary font-semibold mb-3 text-sm">
                          {member.position}
                        </p>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                          {member.bio}
                        </p>
                        
                        <div className="space-y-1 mb-4 text-xs">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-2 text-primary" />
                            <span className="text-muted-foreground truncate">{member.email}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-2 text-primary" />
                            <span className="text-muted-foreground truncate">{member.location}</span>
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-200"
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedMember(member)}
                            >
                              Learn More
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-bold">
                                {member.name}
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-6">
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div className="relative h-64 rounded-lg overflow-hidden">
                                    <img 
                                      src={getImageUrl(member.image)} 
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  
                                  <div>
                                    <Badge className="mb-2 bg-primary/10 text-primary">
                                      {member.position}
                                    </Badge>
                                    <p className="text-sm text-muted-foreground">{member.location || 'Ilorin'}</p>
                                    <p className="text-sm text-muted-foreground">{member.term || 'Current'}</p>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">About</h4>
                                    <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-semibold mb-2">Contact Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2 text-primary" />
                                        <span className="text-muted-foreground">{member.email}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-primary" />
                                        <span className="text-muted-foreground">{member.phone}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold mb-3 flex items-center">
                                  <Award className="h-4 w-4 mr-2 text-primary" />
                                  Key Achievements
                                </h4>
                                <ul className="space-y-2">
                                  {member.achievements && member.achievements.length > 0 ? (
                                    member.achievements.map((achievement, idx) => (
                                      <li key={idx} className="flex items-start">
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                                        <span className="text-muted-foreground">{achievement}</span>
                                      </li>
                                    ))
                                  ) : (
                                    <li className="flex items-start">
                                      <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                                      <span className="text-muted-foreground">Dedicated service to IEYDA and community development</span>
                                    </li>
                                  )}
                                </ul>
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

            {/* See More/Less Button for Leadership Executives */}
            {leadershipLevelMembers.length > 3 && (
              <div className="text-center mt-8">
                <Button
                  onClick={() => {
                    if (activeExecutiveType === 'present') {
                      setShowAllPresentLeadership(!showAllPresentLeadership)
                    } else {
                      setShowAllPioneeringLeadership(!showAllPioneeringLeadership)
                    }
                  }}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  {(activeExecutiveType === 'present' && showAllPresentLeadership) || (activeExecutiveType === 'pioneering' && showAllPioneeringLeadership) ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      See Less Leadership
                      <ChevronUp className="h-4 w-4 ml-2" />
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      See All Leadership ({leadershipLevelMembers.length})
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Board of Trustees Section with See More/Less */}
      <section className="section-padding bg-linear-to-b from-gray-50 to-white">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-purple-100 text-purple-800">
              <Building className="h-4 w-4 mr-2" />
              Board of Trustees
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Governance & Oversight</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Distinguished members who provide strategic guidance and ensure IEYDA's 
              commitment to excellence and accountability.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {boardOfTrustees && boardOfTrustees.length > 0 ? (
              boardOfTrustees.slice(0, showAllBoard ? boardOfTrustees.length : 6).map((member, index) => (
                <motion.div
                  key={member.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md overflow-hidden bg-white h-full">
                    <CardContent className="p-0">
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={getImageUrl(member.image)} 
                          alt={member.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                        
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-purple-500 text-white border-0 shadow-lg">
                            <Award className="h-3 w-3 mr-1" />
                            BOT
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-200">
                          {member.name}
                        </h3>
                        <p className="text-primary font-semibold mb-2 text-sm">
                          {member.position}
                        </p>
                        {member.bio && (
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                            {member.bio}
                          </p>
                        )}
                        
                        <div className="flex gap-2">
                          {member.email && (
                            <Button variant="outline" size="sm" className="h-8 px-2">
                              <Mail className="h-3 w-3" />
                            </Button>
                          )}
                          {member.phone && (
                            <Button variant="outline" size="sm" className="h-8 px-2">
                              <Phone className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Board of Trustees</h3>
                <p className="text-gray-500">No board members found.</p>
              </div>
            )}
          </div>

          {/* See More/Less Button for Board */}
          {boardOfTrustees && boardOfTrustees.length > 6 && (
            <div className="text-center">
              <Button
                onClick={() => setShowAllBoard(!showAllBoard)}
                variant="outline"
                size="lg"
                className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
              >
                {showAllBoard ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    See Less Board Members
                    <ChevronUp className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    See All Board Members ({boardOfTrustees.length})
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Departments Section with See More/Less */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-green-100 text-green-800">
              <Briefcase className="h-4 w-4 mr-2" />
              Departments
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Organizational Structure</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our specialized departments work collaboratively to deliver comprehensive 
              programs and services across the Ilorin Emirate.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {departments && departments.length > 0 ? (
              departments.slice(0, showAllDepartments ? departments.length : 4).map((dept, index) => (
                <motion.div
                  key={dept.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md h-full text-center">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                        <Briefcase className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-200">
                        {dept.name || dept.position}
                      </h3>
                      <p className="text-sm text-primary font-medium mb-3">
                        Head: {dept.head || dept.name}
                      </p>
                      {dept.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                          {dept.description}
                        </p>
                      )}
                      
                      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{dept.members || 'N/A'} Members</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="h-3 w-3 mr-1" />
                          <span>{dept.programs || 'N/A'} Programs</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Departments</h3>
                <p className="text-gray-500">Department information coming soon...</p>
              </div>
            )}
          </div>

          {/* See More/Less Button for Departments */}
          {departments && departments.length > 4 && (
            <div className="text-center">
              <Button
                onClick={() => setShowAllDepartments(!showAllDepartments)}
                variant="outline"
                size="lg"
                className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
              >
                {showAllDepartments ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    See Less Departments
                    <ChevronUp className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    See All Departments ({departments.length})
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
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
              Join Our Mission
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Be part of the transformative change happening across the Ilorin Emirate. 
              Together, we can empower more youth and build stronger communities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-black font-semibold text-lg px-8 py-4 hover:scale-105 transition-transform duration-200">
                <Users className="h-5 w-5 mr-2" />
                Become a Member
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-200 backdrop-blur-sm"
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

export default TeamPage

