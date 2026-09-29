import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, CheckCircle2, CircleAlert, Clock3, Mail, MapPin, PartyPopper, Phone, ShieldCheck, Sparkles, Ticket } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

const initialState = {
  fullName: '',
  email: '',
  phone: '',
}

const GuestRegistrationPage = () => {
  const [formData, setFormData] = useState(initialState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [registrationNumber, setRegistrationNumber] = useState('')

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const nextErrors = {}

    if (!formData.fullName.trim()) {
      nextErrors.fullName = 'Please enter your full name.'
    }

    if (!formData.email.trim()) {
      nextErrors.email = 'Please enter your email address.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = 'Please enter your phone number.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      }

      const response = await apiFetch('/guest-registration/register', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const regNumber = response?.data?.registration_number || response?.registration_number || ''
      setRegistrationNumber(regNumber)
      setSuccess(true)
      setFormData(initialState)
    } catch (error) {
      if (error?.status === 409) {
        setErrors({ submit: 'This guest already has a registration on record.' })
      } else if (error?.status === 403) {
        setErrors({ submit: error.message || 'Registration is currently closed.' })
      } else if (error?.status === 422) {
        setErrors({ submit: 'Please review the information and try again.' })
      } else {
        setErrors({ submit: error?.message || 'Registration could not be completed. Please try again in a moment.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#07130d] text-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.22),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.22),_transparent_35%)]" />
      <div className="absolute inset-0 bg-[url('/QuranRecitationInvitation_page-0001.jpg')] bg-cover bg-center opacity-20" />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[32px] border border-white/20 bg-white/95 shadow-[0_30px_100px_-30px_rgba(0,0,0,0.6)] backdrop-blur"
        >
          <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 sm:p-10">
              <Badge className="w-fit border border-emerald-200 bg-emerald-50 text-emerald-700">
                <Sparkles className="mr-2 h-4 w-4" />
                Guest e-invitation registration
              </Badge>
              <h1 className="mt-6 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Register for the Ilorin Children’s Qur’an Recitation Championship 2026
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Reserve your invitation and receive a personalized e-invitation by email for the event on Thursday, 20 August 2026.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800">
                  <CalendarDays className="h-4 w-4" />
                  20 Aug 2026
                </div>
                <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
                  <Clock3 className="h-4 w-4" />
                  10:00 a.m. prompt
                </div>
                <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                  <PartyPopper className="h-4 w-4" />
                  Strictly by invitation
                </div>
              </div>
            </div>

            <div className="bg-[#0f2d1d] p-8 text-white sm:p-10">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-amber-300">
                <Ticket className="h-4 w-4" />
                Admission by invitation
              </div>
              <div className="mt-6 space-y-4 rounded-2xl border border-white/15 bg-white/10 p-4">
                <div className="flex items-start gap-3 rounded-xl bg-white/10 p-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <div>
                    <p className="font-semibold">Secure registration</p>
                    <p className="mt-1 text-sm text-white/70">Your details are captured safely and your invitation is emailed to you instantly.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl bg-white/10 p-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                  <div>
                    <p className="font-semibold">Venue</p>
                    <p className="mt-1 text-sm text-white/70">Ilorin Banquet Hall, Ahmadu Bello Way, Opposite Government House, Ilorin.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
          >
            <Card className="overflow-hidden border-0 shadow-[0_20px_80px_-35px_rgba(2,19,10,0.7)]">
              <CardContent className="p-0">
                {success ? (
                  <div className="bg-gradient-to-br from-emerald-50 via-white to-amber-50 p-8 sm:p-10">
                    <div className="flex items-center gap-2 text-lg font-semibold text-emerald-700">
                      <CheckCircle2 className="h-5 w-5" />
                      Registration completed successfully
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      Your invitation has been prepared and your personalized e-invitation will be sent to your email address.
                    </p>
                    {registrationNumber && (
                      <div className="mt-6 rounded-2xl border border-emerald-200 bg-white/90 p-5 shadow-sm">
                        <p className="text-sm font-medium text-emerald-700">Registration number</p>
                        <p className="mt-2 text-3xl font-semibold tracking-[0.3em] text-slate-900">{registrationNumber}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 sm:p-10">
                    <div className="mb-6">
                      <h2 className="text-2xl font-semibold text-slate-900">Guest details</h2>
                      <p className="mt-2 text-sm text-slate-600">Enter your details below and your invitation will be sent to your inbox.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input
                          id="fullName"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={(event) => updateField('fullName', event.target.value)}
                          className="border-slate-200 bg-slate-50"
                        />
                        {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <div className="relative">
                          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className="border-slate-200 bg-slate-50 pl-9"
                            value={formData.email}
                            onChange={(event) => updateField('email', event.target.value)}
                          />
                        </div>
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone number</Label>
                        <div className="relative">
                          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <Input
                            id="phone"
                            placeholder="Enter your phone number"
                            className="border-slate-200 bg-slate-50 pl-9"
                            value={formData.phone}
                            onChange={(event) => updateField('phone', event.target.value)}
                          />
                        </div>
                        {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
                      </div>

                      {errors.submit && (
                        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" />
                          <span>{errors.submit}</span>
                        </div>
                      )}

                      <Button type="submit" className="w-full bg-[#0f2d1d] text-white hover:bg-[#163925]" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Register for invitation'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="space-y-4"
          >
            <Card className="border-0 shadow-[0_20px_80px_-35px_rgba(2,19,10,0.7)]">
              <CardContent className="space-y-4 p-6">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">Invitation preview</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <img src="/QuranRecitationInvitation_page-0001.jpg" alt="Invitation preview page one" className="h-48 w-full rounded-xl border border-white/70 object-cover shadow-sm" />
                    <img src="/QuranRecitationInvitation_page-0002.jpg" alt="Invitation preview page two" className="h-48 w-full rounded-xl border border-white/70 object-cover shadow-sm" />
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900 p-4 text-white">
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-5 w-5 text-amber-300" />
                    <div>
                      <p className="font-semibold">Event schedule</p>
                      <p className="mt-1 text-sm text-slate-300">Thursday, 20 August 2026 • 10:00 a.m. prompt</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-emerald-300" />
                    <div>
                      <p className="font-semibold">Venue</p>
                      <p className="mt-1 text-sm text-slate-300">Ilorin Banquet Hall, Ahmadu Bello Way, Opposite Government House, Ilorin, Kwara State.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
                  <p className="font-semibold">What happens next?</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Your registration details will be recorded securely.</li>
                    <li>Your personalized invitation will be emailed to you as a PDF.</li>
                    <li>Please present the invitation at the venue for entry.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default GuestRegistrationPage
