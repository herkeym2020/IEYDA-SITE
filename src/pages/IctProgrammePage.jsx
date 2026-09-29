import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { apiFetch } from '../lib/api'
import {
  User, Users, Laptop, Camera, ShieldCheck, CheckCircle2,
  ChevronLeft, ChevronRight, Loader2, Phone, Mail, MapPin,
  GraduationCap, Briefcase, Heart, AlertCircle, Upload, X
} from 'lucide-react'

const ICT_COURSES = [
  { value: 'digital_marketing', label: 'Digital Marketing', icon: '📱' },
  { value: 'document_management', label: 'Document Management', icon: '📄' },
  { value: 'digital_presentation', label: 'Digital Presentation', icon: '📊' },
  { value: 'graphics_design', label: 'Graphics Design', icon: '🎨' },
  { value: 'virtual_classroom', label: 'Virtual Classroom', icon: '💻' },
  { value: 'general_ai', label: 'General Artificial Intelligence (AI)', icon: '🤖' },
  { value: 'cctv_installation', label: 'CCTV Installation and Maintenance', icon: '📹' },
]

const VOCATIONAL_SESSIONS = [
  { value: 'custard_production', label: 'Custard and Powdered Milk Production', icon: '🥛' },
  { value: 'air_freshener', label: 'Air Freshener Production', icon: '🌸' },
  { value: 'perfume_balm', label: 'Perfume and Balm Production', icon: '🧴' },
  { value: 'liquid_soap', label: 'Liquid Soap Making', icon: '🧼' },
  { value: 'scouring_powder', label: 'Scouring Powder Making', icon: '🧹' },
]

const LGAS = [
  'Ilorin East', 'Ilorin South', 'Ilorin West', 'Asa', 'Moro',
  'Offa', 'Oyun', 'Ifelodun', 'Irepodun', 'Ekiti', 'Isin',
  'Oke-Ero', 'Oyun', 'Pategi', 'Edu', 'Baruten', 'Kaiama',
  'Other'
]

const formSteps = [
  { title: 'Personal Info', icon: User },
  { title: 'Programme Selection', icon: Laptop },
  { title: 'Guardian / Photo', icon: Users },
  { title: 'Declaration', icon: ShieldCheck },
]

export default function IctProgrammePage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    fullName: '', gender: '', dateOfBirth: '', phone: '', email: '',
    address: '', lga: '', state: 'Kwara', educationLevel: '', occupation: '',
    ictCourses: [], vocationalInterests: [], expectations: '',
    guardianName: '', guardianPhone: '', guardianRelationship: '',
    photo: null,
    declAccurate: false, declConsent: false, declRules: false,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: undefined }))
  }

  const selectCourse = (course) => {
    // Single-select: only one ICT course allowed
    setFormData(prev => ({ ...prev, ictCourses: [course] }))
    setErrors(prev => ({ ...prev, ictCourses: undefined }))
  }

  const toggleVocational = (voc) => {
    setFormData(prev => {
      const exists = prev.vocationalInterests.includes(voc)
      return {
        ...prev,
        vocationalInterests: exists
          ? prev.vocationalInterests.filter(v => v !== voc)
          : [...prev.vocationalInterests, voc]
      }
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'Photo must be less than 5MB' }))
        return
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setErrors(prev => ({ ...prev, photo: 'Photo must be JPG or PNG' }))
        return
      }
      updateField('photo', file)
      setPhotoPreview(URL.createObjectURL(file))
      setErrors(prev => ({ ...prev, photo: undefined }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    if (step === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required'
      if (!formData.gender) newErrors.gender = 'Please select gender'
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
      else {
        const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear()
        if (age < 10) newErrors.dateOfBirth = 'Applicant must be at least 10 years old'
        if (age > 60) newErrors.dateOfBirth = 'Applicant must be under 60 years old'
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
      else if (formData.phone.replace(/\D/g, '').length < 10) newErrors.phone = 'Enter a valid phone number'
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address'
      if (!formData.address.trim()) newErrors.address = 'Address is required'
    }
    if (step === 1) {
      if (formData.ictCourses.length === 0) newErrors.ictCourses = 'Please select one ICT course'
    }
    if (step === 3) {
      if (!formData.declAccurate) newErrors.declAccurate = 'You must confirm the information is accurate'
      if (!formData.declConsent) newErrors.declConsent = 'You must give consent'
      if (!formData.declRules) newErrors.declRules = 'You must agree to the rules'
    }
    return newErrors
  }

  const scrollToForm = () => {
    const formElement = document.getElementById('registration-form')
    if (formElement) {
      const top = formElement.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({ top: top - 30, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    const stepErrors = validateStep(currentStep)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }
    setCurrentStep(prev => Math.min(prev + 1, formSteps.length - 1))
    scrollToForm()
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
    scrollToForm()
  }

  const handleSubmit = async () => {
    const stepErrors = validateStep(3)
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setIsSubmitting(true)
    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'photo') {
          if (value) formDataObj.append('photo', value)
        } else if (Array.isArray(value)) {
          value.forEach(v => formDataObj.append(`${key}[]`, v))
        } else if (value !== null && value !== undefined) {
          formDataObj.append(key, value)
        }
      })

      const result = await apiFetch('/ict-programme/register', {
        method: 'POST',
        body: formDataObj,
        cache: false,
        timeout: 30000, // 30 seconds - allow time for email/WhatsApp notifications
      })

      setRegistrationNumber(result.registration_number || result.data?.registration_number || '')
      setSubmitSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (error) {
      setErrors({ submit: error.message || 'Registration failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClass = (field) => `
    w-full px-4 py-3 rounded-xl border-2 bg-white dark:bg-gray-800
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500
    ${errors[field] ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
  `

  const labelClass = 'block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Registration Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Thank you for registering for the IEYDA 11th Free ICT & Vocational Skills Acquisition Programme.
            </p>
            {registrationNumber && (
              <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-2xl p-6 mb-6">
                <p className="text-sm text-green-700 dark:text-green-300 mb-2 font-semibold">Your Registration Number</p>
                <p className="text-2xl md:text-3xl font-bold text-green-800 dark:text-green-200 tracking-wider">
                  {registrationNumber}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ⚠️ Please save this number. You will need it for admission verification.
                </p>
              </div>
            )}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">📅 Programme Details</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">
                <strong>Training Commences:</strong> Monday, August 3, 2026
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">
                <strong>Venue:</strong> IEYDA National Secretariat, Aishat Adepate House, 46 Edun Street, Ilorin
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                <strong>Cost:</strong> FREE (No charges)
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 text-left">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">📞 Enquiries</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                07036739943, 08151515608, 08033700725, 08065232374
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
            >
              Register Another Applicant
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-800 via-green-700 to-emerald-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-2 rounded-full mb-4">
              <Laptop className="w-4 h-4" />
              <span className="text-sm font-semibold">IEYDA ICT Programme</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              11th Free ICT & Vocational Skills Acquisition Programme
            </h1>
            <p className="text-base md:text-xl text-green-100 max-w-3xl mx-auto mb-6">
              Empowering Ilorin Emirate youth with free digital skills and vocational training.
              Choose one ICT course and multiple vocational sessions — all completely FREE!
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-2.5">
                <p className="text-xl md:text-2xl font-bold">7</p>
                <p className="text-xs text-green-100">ICT Courses</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-2.5">
                <p className="text-xl md:text-2xl font-bold">5</p>
                <p className="text-xs text-green-100">Vocational Sessions</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-2.5">
                <p className="text-xl md:text-2xl font-bold">FREE</p>
                <p className="text-xs text-green-100">No Charges</p>
              </div>
              <div className="bg-white/10 backdrop-blur border border-white/20 rounded-xl px-5 py-2.5">
                <p className="text-xl md:text-2xl font-bold">Aug 3</p>
                <p className="text-xs text-green-100">Training Starts</p>
              </div>
            </div>
            <a href="#registration-form" className="inline-block px-8 py-4 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-lg">
              Register Now — It's Free!
            </a>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-10 px-4 scroll-mt-24" id="registration-form">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Registration Form
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Fill in your details below to register for the programme. Training commences August 3, 2026.
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8 overflow-x-auto pb-2">
          {formSteps.map((step, idx) => {
            const Icon = step.icon
            const isActive = idx === currentStep
            const isComplete = idx < currentStep
            return (
              <div key={idx} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isComplete ? 'bg-green-600 border-green-600 text-white'
                      : isActive ? 'bg-white dark:bg-gray-800 border-green-600 text-green-600 shadow-lg'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400'}
                  `}>
                    {isComplete ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
                {idx < formSteps.length - 1 && (
                  <div className={`w-12 md:w-20 h-0.5 mx-2 mb-6 ${idx < currentStep ? 'bg-green-600' : 'bg-gray-300 dark:bg-gray-600'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 md:p-10"
            >
              {errors.submit && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-700 dark:text-red-300 text-sm">{errors.submit}</p>
                </div>
              )}

              {/* Step 0: Personal Info */}
              {currentStep === 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <User className="w-6 h-6 text-green-600" /> Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className={labelClass}>Full Name *</label>
                      <input
                        type="text"
                        className={inputClass('fullName')}
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Gender *</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['male', 'female'].map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => updateField('gender', g)}
                            className={`
                              py-3 rounded-xl border-2 font-semibold transition-all
                              ${formData.gender === g
                                ? 'bg-green-600 border-green-600 text-white'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-400'}
                            `}
                          >
                            {g === 'male' ? '♂ Male' : '♀ Female'}
                          </button>
                        ))}
                      </div>
                      {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Date of Birth *</label>
                      <input
                        type="date"
                        className={inputClass('dateOfBirth')}
                        value={formData.dateOfBirth}
                        onChange={(e) => updateField('dateOfBirth', e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                      />
                      {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number *</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          className={`${inputClass('phone')} pl-10`}
                          placeholder="e.g. 08012345678"
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                        />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="email"
                          className={`${inputClass('email')} pl-10`}
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                        />
                      </div>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Home Address *</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          className={`${inputClass('address')} pl-10`}
                          placeholder="Enter your home address"
                          value={formData.address}
                          onChange={(e) => updateField('address', e.target.value)}
                        />
                      </div>
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>LGA</label>
                      <select
                        className={inputClass('lga')}
                        value={formData.lga}
                        onChange={(e) => updateField('lga', e.target.value)}
                      >
                        <option value="">Select LGA</option>
                        {LGAS.map(lga => <option key={lga} value={lga}>{lga}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>State</label>
                      <input
                        type="text"
                        className={inputClass('state')}
                        value={formData.state}
                        onChange={(e) => updateField('state', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Education Level</label>
                      <div className="relative">
                        <GraduationCap className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <select
                          className={`${inputClass('educationLevel')} pl-10`}
                          value={formData.educationLevel}
                          onChange={(e) => updateField('educationLevel', e.target.value)}
                        >
                          <option value="">Select education level</option>
                          <option value="primary">Primary School</option>
                          <option value="secondary">Secondary School</option>
                          <option value="ssce">SSCE / WAEC</option>
                          <option value="nd">ND / NCE</option>
                          <option value="hnd">HND / BSc</option>
                          <option value="postgraduate">Postgraduate</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Occupation</label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          className={`${inputClass('occupation')} pl-10`}
                          placeholder="e.g. Student, Trader, etc."
                          value={formData.occupation}
                          onChange={(e) => updateField('occupation', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Programme Selection */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <Laptop className="w-6 h-6 text-green-600" /> Programme Selection
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Select at least one ICT course you wish to learn.
                  </p>
                  <div className="mb-8">
                    <label className={labelClass}>Select One ICT Course *</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Please choose <strong>one</strong> ICT course you wish to learn. You can select multiple vocational sessions below.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {ICT_COURSES.map(course => (
                        <button
                          key={course.value}
                          type="button"
                          onClick={() => selectCourse(course.value)}
                          className={`
                            p-4 rounded-xl border-2 text-left transition-all
                            ${formData.ictCourses.includes(course.value)
                              ? 'bg-green-50 dark:bg-green-900/30 border-green-500 shadow-md'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-green-300'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{course.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">{course.label}</p>
                            </div>
                            <div className={`
                              w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                              ${formData.ictCourses.includes(course.value)
                                ? 'bg-green-600 border-green-600'
                                : 'border-gray-300 dark:border-gray-600'}
                            `}>
                              {formData.ictCourses.includes(course.value) && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {errors.ictCourses && <p className="text-red-500 text-sm mt-2">{errors.ictCourses}</p>}
                  </div>

                  <div className="mb-8">
                    <label className={labelClass}>Vocational Sessions (Optional)</label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      Select any vocational skills you're interested in.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {VOCATIONAL_SESSIONS.map(voc => (
                        <button
                          key={voc.value}
                          type="button"
                          onClick={() => toggleVocational(voc.value)}
                          className={`
                            p-4 rounded-xl border-2 text-left transition-all
                            ${formData.vocationalInterests.includes(voc.value)
                              ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-500 shadow-md'
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-emerald-300'}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{voc.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 dark:text-white text-sm">{voc.label}</p>
                            </div>
                            <div className={`
                              w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                              ${formData.vocationalInterests.includes(voc.value)
                                ? 'bg-emerald-600 border-emerald-600'
                                : 'border-gray-300 dark:border-gray-600'}
                            `}>
                              {formData.vocationalInterests.includes(voc.value) && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>What do you expect to gain from this programme?</label>
                    <textarea
                      className={`${inputClass('expectations')} min-h-[120px]`}
                      placeholder="Tell us what you hope to achieve..."
                      value={formData.expectations}
                      onChange={(e) => updateField('expectations', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Guardian / Photo */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-green-600" /> Guardian & Photo
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Guardian Name</label>
                      <input
                        type="text"
                        className={inputClass('guardianName')}
                        placeholder="Guardian's full name"
                        value={formData.guardianName}
                        onChange={(e) => updateField('guardianName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Guardian Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input
                          type="tel"
                          className={`${inputClass('guardianPhone')} pl-10`}
                          placeholder="Guardian's phone number"
                          value={formData.guardianPhone}
                          onChange={(e) => updateField('guardianPhone', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Relationship to Guardian</label>
                      <select
                        className={inputClass('guardianRelationship')}
                        value={formData.guardianRelationship}
                        onChange={(e) => updateField('guardianRelationship', e.target.value)}
                      >
                        <option value="">Select relationship</option>
                        <option value="parent">Parent</option>
                        <option value="guardian">Guardian</option>
                        <option value="sibling">Sibling</option>
                        <option value="relative">Relative</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Passport Photograph (Optional)</label>
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <label className={`
                            flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all
                            ${photoPreview ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-green-400'}
                          `}>
                            {photoPreview ? (
                              <img src={photoPreview} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                            ) : (
                              <div className="text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload photo</p>
                                <p className="text-xs text-gray-400 mt-1">JPG or PNG, max 5MB</p>
                              </div>
                            )}
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/jpg"
                              className="hidden"
                              onChange={handlePhotoChange}
                            />
                          </label>
                          {photoPreview && (
                            <button
                              type="button"
                              onClick={() => { updateField('photo', null); setPhotoPreview(null) }}
                              className="mt-2 text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                            >
                              <X className="w-4 h-4" /> Remove photo
                            </button>
                          )}
                          {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Declaration */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-green-600" /> Declaration
                  </h2>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-green-400 transition-all">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 accent-green-600"
                        checked={formData.declAccurate}
                        onChange={(e) => updateField('declAccurate', e.target.checked)}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Information Accuracy</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          I confirm that all information provided in this registration form is accurate and true to the best of my knowledge.
                        </p>
                      </div>
                    </label>
                    {errors.declAccurate && <p className="text-red-500 text-sm">{errors.declAccurate}</p>}

                    <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-green-400 transition-all">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 accent-green-600"
                        checked={formData.declConsent}
                        onChange={(e) => updateField('declConsent', e.target.checked)}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Consent</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          I consent to the use of my information for the purpose of this programme and agree to be contacted via phone, email, or WhatsApp.
                        </p>
                      </div>
                    </label>
                    {errors.declConsent && <p className="text-red-500 text-sm">{errors.declConsent}</p>}

                    <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-green-400 transition-all">
                      <input
                        type="checkbox"
                        className="mt-1 w-5 h-5 accent-green-600"
                        checked={formData.declRules}
                        onChange={(e) => updateField('declRules', e.target.checked)}
                      />
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Rules & Regulations</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          I agree to abide by the rules and regulations of the IEYDA ICT Programme and understand that the training is free of charge.
                        </p>
                      </div>
                    </label>
                    {errors.declRules && <p className="text-red-500 text-sm">{errors.declRules}</p>}
                  </div>

                  <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">📅 Programme Summary</h3>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                      <strong>Training Commences:</strong> Monday, August 3, 2026
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300 mb-1">
                      <strong>Venue:</strong> IEYDA National Secretariat, Aishat Adepate House, 46 Edun Street, Ilorin
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <strong>Cost:</strong> FREE (No charges)
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="px-6 md:px-10 py-6 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-700 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0 || isSubmitting}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {currentStep < formSteps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Submit Registration
                  </>
                )}
              </button>
            )}
          </div>
        </motion.div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For enquiries, contact: <strong>07036739943</strong>, <strong>08151515608</strong>, <strong>08033700725</strong>, <strong>08065232374</strong>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Ilorin Emirate Youth Development Association (IEYDA) — Under the auspices of the Emir of Ilorin
          </p>
        </div>
      </div>
    </div>
  )
}