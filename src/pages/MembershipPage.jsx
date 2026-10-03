import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/api'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  Search,
  MapPin,
  CheckCircle,
  UserPlus,
  Building,
  Phone,
  Mail,
  Calendar,
  Filter
} from 'lucide-react'

const MembershipPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLGA, setSelectedLGA] = useState('all')
  const [viewMode, setViewMode] = useState('cards') // 'cards', 'table', 'list'
  const [associations, setAssociations] = useState([])
  const [directoryError, setDirectoryError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    apiFetch('/communities', { signal: controller.signal })
      .then((data) => setAssociations(Array.isArray(data) ? data : data?.data || []))
      .catch((error) => {
        if (error?.name !== 'AbortError') setDirectoryError('Unable to load the approved association directory.')
      })
    return () => controller.abort()
  }, [])
  
  // Form state
  const [form, setForm] = useState({
    name: '',
    lga: '',
    contact_name: '',
    position: '',
    contact_phone: '',
    contact_email: '',
    address: '',
    activities: '',
  });
  const [formStatus, setFormStatus] = useState(null); // { type: 'success' | 'error', message: string }
  const [submitting, setSubmitting] = useState(false);

  // Dedicated submit handler to avoid any native form navigation
  const handleMembershipSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
      e.stopPropagation();
    }
    if (submitting) return;
    setFormStatus(null);
    setSubmitting(true);
    try {
      await apiFetch('/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          lga: form.lga,
          description: form.activities,
          contact_name: form.contact_name,
          contact_email: form.contact_email,
          contact_phone: form.contact_phone,
          address: form.address,
          position: form.position
        })
      });

      // Clear form on success
      setForm({
        name: '', lga: '', contact_name: '', position: '', contact_phone: '', contact_email: '', address: '', activities: ''
      });
      setFormStatus({ type: 'success', message: 'Registration submitted! Awaiting admin approval.' });
    } catch (err) {
      console.error('Community registration error:', err);
      console.error('Error details:', { message: err?.message, status: err?.status, stack: err?.stack });
      let message = 'Submission failed. Please try again.';
      if (err.message === 'Failed to fetch') {
        message = 'Unable to reach the server. Please make sure you have an internet connection and try again.';
      } else if (err.message?.includes('timeout')) {
        message = 'Request timed out. Please try again.';
      } else if (err?.status === 422) {
        message = 'Validation error: Please check your input and try again.';
      } else if (err?.status === 500) {
        message = 'Server error. Please try again later.';
      } else {
        message = err?.message || message;
      }
      setFormStatus({ type: 'error', message });
    } finally {
      setSubmitting(false);
      // Ensure the status message is visible
      setTimeout(() => {
        document.getElementById('membership-form-status')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      // Auto-hide after 8 seconds
      setTimeout(() => setFormStatus(null), 8000);
    }
    return false;
  };

  const lgas = ['all', ...Array.from(new Set(associations.map((association) => association.lga).filter(Boolean))).sort()]

  const filteredAssociations = associations.filter(association => {
    const matchesSearch = String(association.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLGA = selectedLGA === 'all' || association.lga === selectedLGA
    return matchesSearch && matchesLGA
  })

  const stats = [
    { number: associations.length || "0", label: "Approved Associations", icon: Building },
    { number: "2.3M+", label: "Youth Population Served", icon: Users },
    { number: "5", label: "Local Government Areas", icon: MapPin },
    { number: "11", label: "Years of Service", icon: Calendar }
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding gradient-bg text-white relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-20"></div>
        <div className="container-max relative z-10">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30">
              Membership Portal
            </Badge>
            <h1 className="heading-primary mb-6 text-shadow">
              Join the IEYDA Community
            </h1>
            <p className="text-large text-white/90 mb-8">
              Become part of our growing network of over 200 youth development associations 
              working together to empower communities across the Ilorin Emirate.
            </p>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="glass-effect rounded-xl p-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <stat.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                  <div className="text-2xl font-bold mb-1">{stat.number}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Member Associations Section */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary">Member Associations</Badge>
            <h2 className="heading-secondary mb-4">Our Community Network</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Explore the diverse network of youth development associations that make up 
              the IEYDA community across all five Local Government Areas.
            </p>
          </motion.div>

          {/* Search, Filter, and View Mode */}
      {directoryError && <p className="mb-4 text-center text-sm text-muted-foreground">{directoryError}</p>}
          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
            <div className="flex-1 w-full md:w-auto flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search associations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={selectedLGA}
                  onChange={(e) => setSelectedLGA(e.target.value)}
                  className="px-3 py-2 border border-input rounded-md bg-background"
                >
                  {lgas.map(lga => (
                    <option key={lga} value={lga}>
                      {lga === 'all' ? 'All LGAs' : lga}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">View:</span>
              <Button size="sm" variant={viewMode === 'cards' ? 'default' : 'outline'} onClick={() => setViewMode('cards')}>Cards</Button>
              <Button size="sm" variant={viewMode === 'table' ? 'default' : 'outline'} onClick={() => setViewMode('table')}>Table</Button>
              <Button size="sm" variant={viewMode === 'list' ? 'default' : 'outline'} onClick={() => setViewMode('list')}>List</Button>
            </div>
          </div>

          {/* Associations View Modes */}
          {viewMode === 'cards' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredAssociations.map((association, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-hover h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Building className="h-5 w-5 text-primary" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {association.lga}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-2 line-clamp-2">
                        {association.name}
                      </h3>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {association.lga} LGA
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {viewMode === 'table' && (
            <div className="overflow-x-auto mb-12">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">LGA</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssociations.map((association, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className="px-4 py-2">{association.name}</td>
                      <td className="px-4 py-2">{association.lga}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {viewMode === 'list' && (
            <ul className="mb-12 divide-y divide-muted-foreground/10 bg-white rounded-lg shadow">
              {filteredAssociations.map((association, index) => (
                <li key={index} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between">
                  <span className="font-medium">{association.name}</span>
                  <span className="text-xs text-muted-foreground mt-1 sm:mt-0">{association.lga} LGA</span>
                </li>
              ))}
            </ul>
          )}

          <div className="text-center text-muted-foreground">
            Showing {filteredAssociations.length} of {associations.length} associations
          </div>
        </div>
      </section>

      {/* Registration Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-max">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 bg-primary/10 text-primary">Join Us</Badge>
              <h2 className="heading-secondary mb-6">Register Your Association</h2>
              <p className="text-large text-muted-foreground mb-8">
                Ready to join the IEYDA network? Register your youth development association 
                and become part of our mission to empower communities across the Ilorin Emirate.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Access to empowerment programs and resources</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Networking opportunities with other associations</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Training and capacity building support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span>Participation in IEYDA events and activities</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="flex items-center">
                    <UserPlus className="h-5 w-5 mr-2 text-primary" />
                    Association Registration
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <form className="space-y-6" onSubmit={handleMembershipSubmit} noValidate>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="association-name">Association Name *</Label>
                        <Input 
                          id="association-name" 
                          placeholder="Enter association name"
                          required
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lga">Local Government Area *</Label>
                        <select
                          id="lga"
                          className="w-full px-3 py-2 border border-input rounded-md bg-background"
                          required
                          value={form.lga}
                          onChange={e => setForm(f => ({ ...f, lga: e.target.value }))}
                        >
                          <option value="">Select LGA</option>
                          <option value="Asa">Asa</option>
                          <option value="Ilorin East">Ilorin East</option>
                          <option value="Ilorin South">Ilorin South</option>
                          <option value="Ilorin West">Ilorin West</option>
                          <option value="Moro">Moro</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="contact-name">Contact Person *</Label>
                        <Input 
                          id="contact-name" 
                          placeholder="Full name"
                          required
                          value={form.contact_name}
                          onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="position">Position *</Label>
                        <Input 
                          id="position" 
                          placeholder="e.g. President, Secretary"
                          required
                          value={form.position}
                          onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input 
                          id="phone" 
                          type="tel"
                          placeholder="+234 xxx xxx xxxx"
                          required
                          value={form.contact_phone}
                          onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          type="email"
                          placeholder="contact@association.org"
                          required
                          value={form.contact_email}
                          onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea 
                        id="address" 
                        placeholder="Complete address of association"
                        required
                        value={form.address}
                        onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="activities">Activities & Objectives</Label>
                      <Textarea 
                        id="activities" 
                        placeholder="Brief description of your association's activities and objectives"
                        rows={4}
                        required
                        value={form.activities}
                        onChange={e => setForm(f => ({ ...f, activities: e.target.value }))}
                      />
                    </div>

                    {formStatus?.type === 'success' && (
                      <motion.div 
                        id="membership-form-status"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-50 border-2 border-green-500 text-green-800 px-6 py-4 rounded-lg text-center shadow-lg"
                      >
                        <div className="flex items-center justify-center mb-2">
                          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                          <strong className="text-lg">Registration Successful!</strong>
                        </div>
                        <p className="text-sm">
                          {formStatus.message || 'Your association has been registered successfully. Our team will review your submission and contact you within 2-3 business days.'}
                        </p>
                      </motion.div>
                    )}
                    {formStatus?.type === 'error' && (
                      <motion.div 
                        id="membership-form-status"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border-2 border-red-500 text-red-800 px-6 py-4 rounded-lg text-center shadow-lg"
                      >
                        <div className="flex items-center justify-center mb-2">
                          <svg className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <strong className="text-lg">Submission Failed</strong>
                        </div>
                        <p className="text-sm">
                          {formStatus.message || 'There was an error submitting your registration. Please try again or contact us directly.'}
                        </p>
                      </motion.div>
                    )}

                    <Button size="lg" className="w-full btn-primary" type="button" onClick={handleMembershipSubmit} disabled={submitting} aria-disabled={submitting}>
                      <UserPlus className="h-5 w-5 mr-2" />
                      {submitting ? 'Submitting...' : 'Submit Registration'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-accent/10 text-accent">Need Help?</Badge>
            <h2 className="heading-secondary mb-4">Contact Our Membership Team</h2>
            <p className="text-large text-muted-foreground max-w-3xl mx-auto">
              Have questions about membership or need assistance with registration? 
              Our team is here to help you join the IEYDA community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="feature-card text-center">
                <CardContent className="p-8">
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Phone className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-4">Call Us</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>+234 809 709 0867</p>
                    <p className="text-sm">WhatsApp: +234 805 167 9910</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="feature-card text-center">
                <CardContent className="p-8">
                  <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <Mail className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-4">Email Us</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>talk2ieyda@gmail.com</p>
                    <p className="text-sm">info@ieyda.org</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="feature-card text-center">
                <CardContent className="p-8">
                  <div className="bg-secondary/10 p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-4">Visit Us</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p>Aishat Adepate House</p>
                    <p>Edun Street, Ilorin</p>
                    <p className="text-sm">Kwara State, Nigeria</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MembershipPage

