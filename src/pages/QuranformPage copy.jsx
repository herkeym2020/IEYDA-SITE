import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  BookOpen, Award, Trophy, Medal, Star, Users, User, UserCheck, FileText, Upload, CheckCircle,
  Calendar, ArrowRight, ArrowLeft, Sparkles, Crown, Heart, ScrollText, Layers, MapPin, Clock,
  Phone, PartyPopper, AlertCircle, ImageIcon,
} from 'lucide-react'

const QuranformPage = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '', gender: '', dateOfBirth: '', school: '', lga: '', state: '', address: '',
    guardianName: '', relationship: '', phone: '', email: '', emergencyName: '', emergencyPhone: '',
    madrasah: '', teacherName: '', teacherPhone: '', category: [], photo: null,
    declarations: { age: false, accurate: false, consent: false, rules: false },
  })
  const [errors, setErrors] = useState({})
  const [photoPreview, setPhotoPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState('')

  const competitionCategories = [
    { id: 'markaz', name: 'Markaz', description: 'A distinguished recitation style rooted in the Markaz tradition, emphasizing precision and depth.', color: 'bg-primary' },
    { id: 'adaby', name: 'Adaby', description: 'The literary recitation style, celebrating eloquence and the beauty of Qur\'anic expression.', color: 'bg-secondary' },
    { id: 'zumurah', name: 'Zumurah', description: 'A melodic recitation tradition known for its harmonious and flowing delivery.', color: 'bg-accent' },
    { id: 'imam-agba', name: 'Imam Agba', description: 'The senior recitation style, reflecting the mastery and wisdom of seasoned reciters.', color: 'bg-green-700' },
    { id: 'asily', name: 'Asily', description: 'A foundational recitation style, honoring the roots and origins of Ilorin\'s Qur\'anic heritage.', color: 'bg-purple-700' },
  ]

  const formSteps = [
    { title: 'Personal Info', icon: User },
    { title: 'Parent / Guardian', icon: Users },
    { title: 'Islamic Education', icon: BookOpen },
    { title: 'Category', icon: Layers },
    { title: 'Document Upload', icon: Upload },
    { title: 'Declaration', icon: CheckCircle },
  ]

  const partnerOrganizations = [
    { name: 'IEYDA', logo: '/ieyda_logo.png', alt: 'IEYDA Logo' },
    { name: 'YAYEF', logo: '/yayef_logo.png', alt: 'YAYEF Logo' },
  ]

  const kwaralgas = ['Asa', 'Baruten', 'Edu', 'Ekiti (Kwara)', 'Ifelodun', 'Ilorin East', 'Ilorin South', 'Ilorin West', 'Irepodun', 'Kaiama', 'Moro', 'Offa', 'Oke Ero', 'Oyun', 'Pategi']
  const nigerianStates = ['Kwara', 'Lagos', 'Oyo', 'Osun', 'Ondo', 'Ekiti', 'Kogi', 'Niger', 'Zamfara', 'Sokoto', 'Kebbi', 'Jigawa', 'Kano', 'Katsina', 'Kaduna', 'Bauchi', 'Borno', 'Yobe', 'Adamawa', 'Taraba', 'Gombe', 'Nasarawa', 'Plateau', 'Benue', 'FCT (Abuja)', 'Anambra', 'Enugu', 'Ebonyi', 'Imo', 'Abia', 'Rivers', 'Bayelsa', 'Akwa Ibom', 'Cross River', 'Delta', 'Edo', 'Ogun', 'Federal Capital Territory']

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const updateDeclaration = (key, checked) => {
    setFormData(prev => ({ ...prev, declarations: { ...prev.declarations, [key]: checked } }))
    if (errors[`decl_${key}`]) setErrors(prev => ({ ...prev, [`decl_${key}`]: '' }))
  }

  const calculateAge = (dob) => {
    if (!dob) return ''
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
    return age >= 0 ? age : ''
  }

  const validateStep = (step) => {
    const newErrors = {}
    if (step === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.gender) newErrors.gender = 'Please select gender'
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
      else {
        const age = calculateAge(formData.dateOfBirth)
        if (age === '' || age < 0) newErrors.dateOfBirth = 'Invalid date of birth'
        else if (age > 16) newErrors.dateOfBirth = 'Participant must be 16 years or younger'
      }
      if (!formData.school.trim()) newErrors.school = 'School or institution is required'
      if (!formData.lga) newErrors.lga = 'Local Government Area is required'
      if (!formData.state) newErrors.state = 'State is required'
      if (!formData.address.trim()) newErrors.address = 'Residential address is required'
    }
    if (step === 1) {
      if (!formData.guardianName.trim()) newErrors.guardianName = 'Guardian name is required'
      if (!formData.relationship.trim()) newErrors.relationship = 'Relationship is required'
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email address'
      if (!formData.emergencyName.trim()) newErrors.emergencyName = 'Emergency contact name is required'
      if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency contact phone is required'
    }
    if (step === 2) {
      if (!formData.madrasah.trim()) newErrors.madrasah = 'Madrasah or Islamic school name is required'
      if (!formData.teacherName.trim()) newErrors.teacherName = 'Islamic teacher name is required'
    }
    if (step === 3) {
      if (!formData.category || formData.category.length === 0) newErrors.category = 'Please select at least one competition category'
    }
    if (step === 4) {
      if (!formData.photo) newErrors.photo = 'Passport photograph is required'
    }
    if (step === 5) {
      if (!formData.declarations.age) newErrors.decl_age = 'Please confirm age requirement'
      if (!formData.declarations.accurate) newErrors.decl_accurate = 'Please confirm information accuracy'
      if (!formData.declarations.consent) newErrors.decl_consent = 'Please confirm guardian consent'
      if (!formData.declarations.rules) newErrors.decl_rules = 'Please accept competition rules'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Please upload an image file' }))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, photo: 'Image must be less than 5MB' }))
      return
    }
    setFormData(prev => ({ ...prev, photo: file }))
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result)
    reader.readAsDataURL(file)
    if (errors.photo) setErrors(prev => ({ ...prev, photo: '' }))
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1))
      window.scrollTo({ top: document.getElementById('registration-form')?.offsetTop - 100, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
    window.scrollTo({ top: document.getElementById('registration-form')?.offsetTop - 100, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return
    setIsSubmitting(true)
    try {
      const payload = new FormData()
      payload.append('fullName', formData.fullName)
      payload.append('gender', formData.gender)
      payload.append('dateOfBirth', formData.dateOfBirth)
      payload.append('school', formData.school)
      payload.append('lga', formData.lga)
      payload.append('state', formData.state)
      payload.append('address', formData.address)
      payload.append('guardianName', formData.guardianName)
      payload.append('relationship', formData.relationship)
      payload.append('phone', formData.phone)
      if (formData.email) payload.append('email', formData.email)
      payload.append('emergencyName', formData.emergencyName)
      payload.append('emergencyPhone', formData.emergencyPhone)
      payload.append('madrasah', formData.madrasah)
      payload.append('teacherName', formData.teacherName)
      if (formData.teacherPhone) payload.append('teacherPhone', formData.teacherPhone)
      // Append each selected category
      formData.category.forEach((cat) => {
        payload.append('category[]', cat)
      })
      if (formData.photo) payload.append('photo', formData.photo)
      payload.append('declAge', '1')
      payload.append('declAccurate', '1')
      payload.append('declConsent', '1')
      payload.append('declRules', '1')

      const response = await apiFetch('/quran-competition/register', {
        method: 'POST',
        body: payload,
        cache: false,
        timeout: 30000,
      })

      const regNum = response?.registration_number || response?.data?.registration_number
      setRegistrationNumber(regNum || 'IEYDA-QRC-2026-0001')
      setSubmitSuccess(true)
      window.scrollTo({ top: document.getElementById('registration-form')?.offsetTop - 100, behavior: 'smooth' })
    } catch (err) {
      if (err?.status === 409) {
        setErrors({ submit: 'A registration with this name and phone already exists. Please check your details.' })
      } else if (err?.status === 422) {
        setErrors({ submit: 'Validation failed. Please review your information and try again.' })
      } else {
        setErrors({ submit: err?.message || 'Registration failed. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePrintSlip = () => {
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Registration Slip - ${registrationNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; text-align: center; }
            h1 { color: #2E7D32; margin-bottom: 10px; }
            .reg-number { font-size: 32px; font-weight: bold; color: #2E7D32; margin: 20px 0; }
            .name { font-size: 18px; color: #333; margin-bottom: 30px; }
            .footer { margin-top: 50px; font-size: 12px; color: #666; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <h1>IEYDA Qur'an Competition Registration Slip</h1>
          <p class="name">${formData.fullName}</p>
          <p style="font-size: 14px; color: #666;">Registration Number</p>
          <p class="reg-number">${registrationNumber}</p>
          <div class="footer">
            <p>Ilorin Emirate Youth Development Association (IEYDA)</p>
            <p>5th August - Kwara State Banquet Hall</p>
          </div>
        </body>
      </html>
    `
    const printWindow = window.open('', '_blank', 'width=600,height=800')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: '', gender: '', dateOfBirth: '', school: '', lga: '', state: '', address: '',
      guardianName: '', relationship: '', phone: '', email: '', emergencyName: '', emergencyPhone: '',
      madrasah: '', teacherName: '', teacherPhone: '', category: [], photo: null,
      declarations: { age: false, accurate: false, consent: false, rules: false },
    })
    setPhotoPreview(null)
    setErrors({})
    setCurrentStep(0)
    setSubmitSuccess(false)
    setRegistrationNumber('')
  }

  const age = calculateAge(formData.dateOfBirth)
  const progressValue = ((currentStep + 1) / formSteps.length) * 100

  // Categories section for the hero info page
  const prizes = [
    { title: 'Overall Best Qur\'an Reciter', amount: '₦1,000,000', icon: Crown, description: 'The single most outstanding reciter across all categories in the Grand Finale.', highlight: true },
    { title: 'Category Winners', amount: '₦250,000', icon: Trophy, description: 'Five category winners — one from each recitation tradition — recognized for excellence.', highlight: false },
    { title: 'Grand Finale Finalists', amount: '37 Selected', icon: Medal, description: 'Only 37 outstanding participants will be shortlisted from all registered entries to compete in the Grand Finale.', highlight: false },
  ]

  const eligibilityCriteria = [
    { text: 'Be 18 years of age or younger', icon: Calendar },
    { text: 'Register in one or more competition categories', icon: Layers },
    { text: 'Submit complete and accurate personal information', icon: FileText },
    { text: 'Provide valid parent or guardian information', icon: UserCheck },
    { text: 'Upload a recent passport photograph', icon: Upload },
    { text: 'Agree to the competition rules and declaration before submission', icon: CheckCircle },
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-bg text-white">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="container-max relative z-10 section-padding">
          <motion.div className="text-center max-w-4xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" /> Ilorin Emirate Youth Development Association
            </Badge>

            {/* Partner Organizations Logos - small circular thumbnails immediately after badge */}
            <div className="flex flex-col items-center gap-2 mb-4">
              <span className="text-xs font-medium text-white/70">In Partnership With</span>
              <div className="flex items-center justify-center gap-4">
                {partnerOrganizations.map((org) => (
                  <div
                    key={org.name}
                    className="w-14 h-14 bg-white dark:bg-gray-100 rounded-full p-1.5 shadow-lg border-2 border-white flex items-center justify-center"
                    title={org.name}
                  >
                    <img
                      src={org.logo}
                      alt={org.alt}
                      className="h-full w-full object-contain filter drop-shadow-md"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            <h1 className="heading-primary mb-6 text-shadow">Ilorin Children's Qur'an Recitation Competition</h1>
            <p className="text-large text-white/90 mb-4">Celebrating Tajwīd and the Timeless Recitation Traditions of Ilorin Emirate</p>
            <p className="text-base text-white/80 mb-8 max-w-2xl mx-auto">
              A prestigious one-day competition event — organized by <span className="font-semibold text-white">IEYDA</span> in collaboration with <span className="font-semibold text-white">Yahaya Alapansanpa Youth Education Foundation (YAYEF)</span>
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <div className="glass-effect rounded-full px-5 py-2.5 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-secondary" /><span className="text-sm font-medium">18th August</span>
              </div>
              <div className="glass-effect rounded-full px-5 py-2.5 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-secondary" /><span className="text-sm font-medium">Kwara State Banquet Hall</span>
              </div>
              <div className="glass-effect rounded-full px-5 py-2.5 flex items-center gap-2">
                <Clock className="h-5 w-5 text-secondary" /><span className="text-sm font-medium">9:00 AM</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl" onClick={() => document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' })}>
                <FileText className="h-5 w-5 mr-2" /> Register a Participant
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm">
                <BookOpen className="h-5 w-5 mr-2" /> Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Competition Categories */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <Badge className="mb-4 bg-secondary/10 text-secondary"><Layers className="h-4 w-4 mr-2" /> Recitation Categories</Badge>
            <h2 className="heading-secondary mb-4">Five Recognized Recitation Traditions</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Participants compete in one or more of five recognized recitation categories, each representing a unique tradition of Qur'anic recitation in Ilorin Emirate.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {competitionCategories.map((category, index) => (
              <motion.div key={category.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} viewport={{ once: true }}>
                <Card className="feature-card h-full">
                  <CardContent className="p-6">
                    <div className={`${category.color} p-3 rounded-lg w-fit mb-4`}><BookOpen className="h-6 w-6 text-white" /></div>
                    <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                    <p className="text-muted-foreground text-sm">{category.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prizes & Rewards */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 gradient-bg opacity-5"></div>
        <div className="container-max relative z-10">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <Badge className="mb-4 bg-accent/10 text-accent"><Trophy className="h-4 w-4 mr-2" /> Prizes & Rewards</Badge>
            <h2 className="heading-secondary mb-4">Compete for Prestigious Awards</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              The Grand Finale will produce one overall best reciter and five category winners, recognizing excellence across all recitation traditions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {prizes.map((prize, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.15 }} viewport={{ once: true }} className={prize.highlight ? 'md:-mt-4' : ''}>
                <Card className={`text-center h-full ${prize.highlight ? 'border-primary shadow-2xl ring-2 ring-primary/20' : 'feature-card'}`}>
                  <CardContent className="p-8">
                    <div className={`p-5 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center ${prize.highlight ? 'bg-primary' : 'bg-primary/10'}`}>
                      <prize.icon className={`h-10 w-10 ${prize.highlight ? 'text-primary-foreground' : 'text-primary'}`} />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{prize.title}</h3>
                    <div className={`text-4xl font-bold mb-4 ${prize.highlight ? 'text-primary' : 'text-foreground'}`}>{prize.amount}</div>
                    <p className="text-sm text-muted-foreground">{prize.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility Criteria */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <Badge className="mb-4 bg-primary/10 text-primary"><CheckCircle className="h-4 w-4 mr-2" /> Eligibility</Badge>
            <h2 className="heading-secondary mb-4">Who Can Participate?</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              The system clearly enforces competition rules. Participants must meet all the following requirements to be eligible.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {eligibilityCriteria.map((criterion, index) => (
              <motion.div key={index} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}>
                <Card className="feature-card">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg flex-shrink-0"><criterion.icon className="h-5 w-5 text-primary" /></div>
                    <p className="font-medium text-sm">{criterion.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Form */}
      <section id="registration-form" className="section-padding bg-muted/30">
        <div className="container-max max-w-4xl">
          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <Badge className="mb-4 bg-primary/10 text-primary"><FileText className="h-4 w-4 mr-2" /> Participant Registration</Badge>
            <h2 className="heading-secondary mb-4">Register for the Competition</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Complete the form below to register a participant. All fields are required unless marked optional.
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {submitSuccess ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.5 }}>
                <Card className="border-primary shadow-2xl">
                  <CardContent className="p-8 md:p-12 text-center">
                    <div className="bg-primary/10 p-6 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center"><CheckCircle className="h-12 w-12 text-primary" /></div>
                    <h3 className="text-2xl font-bold mb-3">Registration Successful!</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">Your registration has been submitted successfully. Please save your registration number for future reference.</p>
                    <div className="bg-muted/50 rounded-xl p-6 mb-6 max-w-md mx-auto">
                      <p className="text-sm text-muted-foreground mb-1">Your Registration Number</p>
                      <p className="text-2xl font-bold text-primary">{registrationNumber}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button onClick={handlePrintSlip} variant="outline"><FileText className="h-4 w-4 mr-2" /> Print / Save Slip</Button>
                      <Button onClick={resetForm} className="btn-primary">Register Another Participant</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="shadow-xl">
                  <CardContent className="p-6 md:p-8">
                    {/* Progress bar */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-muted-foreground">Step {currentStep + 1} of {formSteps.length}</span>
                        <span className="text-sm font-medium text-primary">{Math.round(progressValue)}% Complete</span>
                      </div>
                      <Progress value={progressValue} className="h-2" />
                      <div className="flex justify-between mt-4 overflow-x-auto">
                        {formSteps.map((step, index) => (
                          <div key={index} className={`flex flex-col items-center gap-1 transition-colors ${index <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                            <div className={`p-2 rounded-full w-9 h-9 flex items-center justify-center text-xs font-bold ${index < currentStep ? 'bg-primary text-primary-foreground' : index === currentStep ? 'bg-primary/10 text-primary ring-2 ring-primary' : 'bg-muted text-muted-foreground'}`}>
                              {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                            </div>
                            <span className="text-[10px] hidden md:block whitespace-nowrap">{step.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {/* Step 0: Personal Info */}
                      {currentStep === 0 && (
                        <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                          <div className="flex items-center gap-2 mb-4"><User className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Personal Information</h3></div>
                          <div>
                            <Label htmlFor="fullName">Full Name <span className="text-destructive">*</span></Label>
                            <Input id="fullName" value={formData.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Participant's full name" className={errors.fullName ? 'border-destructive' : ''} />
                            {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Gender <span className="text-destructive">*</span></Label>
                              <div className="flex gap-4 mt-2">
                                {['male', 'female'].map(g => (
                                  <label key={g} className="flex items-center space-x-2 cursor-pointer">
                                    <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={(e) => updateField('gender', e.target.value)} className="text-primary" />
                                    <span className="text-sm capitalize">{g}</span>
                                  </label>
                                ))}
                              </div>
                              {errors.gender && <p className="text-xs text-destructive mt-1">{errors.gender}</p>}
                            </div>
                            <div>
                              <Label htmlFor="dateOfBirth">Date of Birth <span className="text-destructive">*</span></Label>
                              <Input id="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} className={errors.dateOfBirth ? 'border-destructive' : ''} />
                              {age !== '' && formData.dateOfBirth && (
                                <p className="text-xs text-muted-foreground mt-1">Age: <span className={`font-medium ${age > 16 ? 'text-destructive' : 'text-primary'}`}>{age} years</span>{age > 16 && ' (exceeds age limit)'}</p>
                              )}
                              {errors.dateOfBirth && <p className="text-xs text-destructive mt-1">{errors.dateOfBirth}</p>}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="school">School or Institution <span className="text-destructive">*</span></Label>
                            <Input id="school" value={formData.school} onChange={(e) => updateField('school', e.target.value)} placeholder="e.g. Government Secondary School, Ilorin" className={errors.school ? 'border-destructive' : ''} />
                            {errors.school && <p className="text-xs text-destructive mt-1">{errors.school}</p>}
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label>Local Government Area <span className="text-destructive">*</span></Label>
                              <Select value={formData.lga} onValueChange={(v) => updateField('lga', v)}>
                                <SelectTrigger className={errors.lga ? 'border-destructive' : ''}><SelectValue placeholder="Select LGA" /></SelectTrigger>
                                <SelectContent>{kwaralgas.map(lga => <SelectItem key={lga} value={lga}>{lga}</SelectItem>)}</SelectContent>
                              </Select>
                              {errors.lga && <p className="text-xs text-destructive mt-1">{errors.lga}</p>}
                            </div>
                            <div>
                              <Label>State <span className="text-destructive">*</span></Label>
                              <Select value={formData.state} onValueChange={(v) => updateField('state', v)}>
                                <SelectTrigger className={errors.state ? 'border-destructive' : ''}><SelectValue placeholder="Select State" /></SelectTrigger>
                                <SelectContent>{nigerianStates.map(state => <SelectItem key={state} value={state}>{state}</SelectItem>)}</SelectContent>
                              </Select>
                              {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="address">Residential Address <span className="text-destructive">*</span></Label>
                            <Textarea id="address" value={formData.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Enter full residential address" rows={2} className={errors.address ? 'border-destructive' : ''} />
                            {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                          </div>
                        </motion.div>
                      )}

                      {/* Step 1: Parent / Guardian */}
                      {currentStep === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                          <div className="flex items-center gap-2 mb-4"><Users className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Parent / Guardian Information</h3></div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="guardianName">Parent / Guardian Name <span className="text-destructive">*</span></Label>
                              <Input id="guardianName" value={formData.guardianName} onChange={(e) => updateField('guardianName', e.target.value)} placeholder="Full name of parent or guardian" className={errors.guardianName ? 'border-destructive' : ''} />
                              {errors.guardianName && <p className="text-xs text-destructive mt-1">{errors.guardianName}</p>}
                            </div>
                            <div>
                              <Label htmlFor="relationship">Relationship <span className="text-destructive">*</span></Label>
                              <Select value={formData.relationship} onValueChange={(v) => updateField('relationship', v)}>
                                <SelectTrigger className={errors.relationship ? 'border-destructive' : ''}><SelectValue placeholder="Select relationship" /></SelectTrigger>
                                <SelectContent>
                                  {['father', 'mother', 'uncle', 'aunt', 'grandparent', 'guardian', 'other'].map(r => <SelectItem key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</SelectItem>)}
                                </SelectContent>
                              </Select>
                              {errors.relationship && <p className="text-xs text-destructive mt-1">{errors.relationship}</p>}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                              <Input id="phone" type="tel" value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="+234 xxx xxx xxxx" className={errors.phone ? 'border-destructive' : ''} />
                              {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                            </div>
                            <div>
                              <Label htmlFor="email">Email Address <span className="text-muted-foreground">(optional)</span></Label>
                              <Input id="email" type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" className={errors.email ? 'border-destructive' : ''} />
                              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="emergencyName">Emergency Contact Name <span className="text-destructive">*</span></Label>
                              <Input id="emergencyName" value={formData.emergencyName} onChange={(e) => updateField('emergencyName', e.target.value)} placeholder="Emergency contact person" className={errors.emergencyName ? 'border-destructive' : ''} />
                              {errors.emergencyName && <p className="text-xs text-destructive mt-1">{errors.emergencyName}</p>}
                            </div>
                            <div>
                              <Label htmlFor="emergencyPhone">Emergency Contact Phone <span className="text-destructive">*</span></Label>
                              <Input id="emergencyPhone" type="tel" value={formData.emergencyPhone} onChange={(e) => updateField('emergencyPhone', e.target.value)} placeholder="+234 xxx xxx xxxx" className={errors.emergencyPhone ? 'border-destructive' : ''} />
                              {errors.emergencyPhone && <p className="text-xs text-destructive mt-1">{errors.emergencyPhone}</p>}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 2: Islamic Education */}
                      {currentStep === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                          <div className="flex items-center gap-2 mb-4"><BookOpen className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Islamic Education Information</h3></div>
                          <div>
                            <Label htmlFor="madrasah">Name of Madrasah or Islamic School <span className="text-destructive">*</span></Label>
                            <Input id="madrasah" value={formData.madrasah} onChange={(e) => updateField('madrasah', e.target.value)} placeholder="e.g. Markaz Arabic Training Centre, Ilorin" className={errors.madrasah ? 'border-destructive' : ''} />
                            {errors.madrasah && <p className="text-xs text-destructive mt-1">{errors.madrasah}</p>}
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="teacherName">Name of Islamic Teacher <span className="text-destructive">*</span></Label>
                              <Input id="teacherName" value={formData.teacherName} onChange={(e) => updateField('teacherName', e.target.value)} placeholder="Teacher's full name" className={errors.teacherName ? 'border-destructive' : ''} />
                              {errors.teacherName && <p className="text-xs text-destructive mt-1">{errors.teacherName}</p>}
                            </div>
                            <div>
                              <Label htmlFor="teacherPhone">Teacher's Contact Number <span className="text-muted-foreground">(optional)</span></Label>
                              <Input id="teacherPhone" type="tel" value={formData.teacherPhone} onChange={(e) => updateField('teacherPhone', e.target.value)} placeholder="+234 xxx xxx xxxx" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Step 3: Category - Multi-select */}
                      {currentStep === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                          <div className="flex items-center gap-2 mb-4"><Layers className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Competition Category</h3></div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Select one or more categories. Participants who recite in different voices can select multiple categories.
                          </p>
                          <div className="space-y-3">
                            {competitionCategories.map((cat) => {
                              const isSelected = (formData.category || []).includes(cat.id)
                              return (
                                <Label key={cat.id} htmlFor={`cat-${cat.id}`} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                                  <Checkbox
                                    id={`cat-${cat.id}`}
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                      const current = formData.category || []
                                      const updated = checked ? [...current, cat.id] : current.filter((id) => id !== cat.id)
                                      updateField('category', updated)
                                    }}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <div className={`${cat.color} p-1.5 rounded`}><BookOpen className="h-4 w-4 text-white" /></div>
                                      <span className="font-semibold">{cat.name}</span>
                                      {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                                    </div>
                                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                                  </div>
                                </Label>
                              )
                            })}
                          </div>
                          {errors.category && <p className="text-xs text-destructive mt-1">{errors.category}</p>}
                        </motion.div>
                      )}

                      {/* Step 4: Photo Upload */}
                      {currentStep === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                          <div className="flex items-center gap-2 mb-4"><Upload className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Document Upload</h3></div>
                          <p className="text-sm text-muted-foreground mb-4">Upload a recent passport photograph of the participant.</p>
                          <div className="flex flex-col items-center">
                            <label htmlFor="photo" className={`w-full max-w-xs aspect-[4/5] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-muted/50 ${errors.photo ? 'border-destructive' : 'border-border'}`}>
                              {photoPreview ? (
                                <img src={photoPreview} alt="Passport" className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <div className="text-center p-8">
                                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                                  <p className="text-sm font-medium">Click to upload photo</p>
                                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG • Max 5MB</p>
                                </div>
                              )}
                              <input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                            </label>
                            {errors.photo && <p className="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.photo}</p>}
                          </div>
                        </motion.div>
                      )}

                      {/* Step 5: Declaration */}
                      {currentStep === 5 && (
                        <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }} className="space-y-4">
                          <div className="flex items-center gap-2 mb-4"><CheckCircle className="h-5 w-5 text-primary" /><h3 className="text-lg font-semibold">Declaration & Consent</h3></div>
                          <div className="space-y-3">
                            {[
                              { key: 'age', label: 'I confirm that the participant is 16 years of age or younger.' },
                              { key: 'accurate', label: 'I confirm that all information provided is accurate and complete.' },
                              { key: 'consent', label: 'I confirm that parent/guardian consent has been obtained for this registration.' },
                              { key: 'rules', label: 'I have read and accept the competition rules and agree to abide by them.' },
                            ].map((decl) => (
                              <div key={decl.key} className={`flex items-start gap-3 p-4 rounded-lg border ${errors[`decl_${decl.key}`] ? 'border-destructive bg-destructive/5' : 'border-border bg-muted/30'}`}>
                                <Checkbox id={`decl-${decl.key}`} checked={formData.declarations[decl.key]} onCheckedChange={(checked) => updateDeclaration(decl.key, checked)} className="mt-0.5" />
                                <Label htmlFor={`decl-${decl.key}`} className="text-sm font-normal cursor-pointer flex-1">{decl.label}</Label>
                              </div>
                            ))}
                          </div>
                          {errors.submit && <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm"><AlertCircle className="h-4 w-4" />{errors.submit}</div>}
                          <div className="bg-muted/50 rounded-lg p-4 mt-4">
                            <h4 className="text-sm font-semibold mb-2">Registration Summary</h4>
                            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                              <div><strong>Name:</strong> {formData.fullName || '—'}</div>
                              <div><strong>Age:</strong> {age || '—'}</div>
                              <div><strong>Gender:</strong> {formData.gender || '—'}</div>
                              <div><strong>Category:</strong> {formData.category?.length ? formData.category.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ') : '—'}</div>
                              <div><strong>Guardian:</strong> {formData.guardianName || '—'}</div>
                              <div><strong>Phone:</strong> {formData.phone || '—'}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation */}
                    <div className="flex justify-between mt-8 pt-6 border-t">
                      <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}><ArrowLeft className="h-4 w-4 mr-2" /> Previous</Button>
                      {currentStep < formSteps.length - 1 ? (
                        <Button onClick={handleNext} className="btn-primary">Next <ArrowRight className="h-4 w-4 ml-2" /></Button>
                      ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting} className="btn-primary">
                          {isSubmitting ? (<><div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" /> Submitting...</>) : (<><CheckCircle className="h-4 w-4 mr-2" /> Submit Registration</>)}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}

export default QuranformPage