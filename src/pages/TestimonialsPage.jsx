import { useEffect, useState, useRef } from 'react'
import { apiFetch } from '@/lib/api'
import { getImageUrl } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { Sparkles } from 'lucide-react'
import abstractBg from '../assets/VeKiraO1Skp4.jpg'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const abortRef = useRef(null)
  const [programFilter, setProgramFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)

    apiFetch('/testimonials', { signal: controller.signal })
      .then((res) => {
        const list = (res?.data || res || [])
        const mapped = list.map((t) => ({
          id: t.id,
          name: t.name || t.fullname || t.title || 'Anonymous',
          role: t.role || t.position || '',
          program: t.program || t.department || t.faculty || '',
          year: t.year || t.classYear || '',
          image: getImageUrl(t.photo || t.image || ''),
          content: t.testimonial || t.content || '',
        }))
        setTestimonials(mapped)
        setLoading(false)
      })
      .catch((err) => {
        if (err?.name === 'AbortError') return
        setError('Failed to load testimonials')
        setLoading(false)
      })

    return () => {
      controller.abort()
    }
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-muted-foreground">Loading testimonials…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="pt-20">
      {/* Enhanced Hero Section */}
      <section className="section-padding relative overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <img src={abstractBg} alt="Abstract Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/80 to-accent/85"></div>
          <div className="absolute inset-0 hero-pattern opacity-20"></div>
        </div>

        <div className="container-max relative z-10 text-white">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-lg px-6 py-2 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                Community Voices
              </Badge>
            </motion.div>
            <h1 className="heading-primary mb-4 text-shadow">Testimonials</h1>
            <p className="text-large text-white/90 leading-relaxed">Real stories and experiences from our members and partners.</p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">

      {/* Filters */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {(() => {
          const programOptions = Array.from(new Set((testimonials || []).map(t => t.program).filter(Boolean))).sort()
          const yearOptions = Array.from(new Set((testimonials || []).map(t => t.year).filter(Boolean))).sort((a, b) => {
            const na = Number(a), nb = Number(b)
            if (!isNaN(na) && !isNaN(nb)) return nb - na
            return String(b).localeCompare(String(a))
          })
          const resetDisabled = programFilter === 'all' && yearFilter === 'all'
          return (
            <>
              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground mb-1">Filter by Program</label>
                <select
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 bg-background"
                >
                  <option value="all">All Programs</option>
                  {programOptions.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-muted-foreground mb-1">Filter by Year</label>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="border rounded-md px-3 py-2 bg-background"
                >
                  <option value="all">All Years</option>
                  {yearOptions.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  disabled={resetDisabled}
                  className={`inline-flex items-center px-4 py-2 rounded-md border text-sm font-medium ${resetDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-muted'}`}
                  onClick={() => { setProgramFilter('all'); setYearFilter('all'); }}
                >
                  Reset Filters
                </button>
              </div>
            </>
          )
        })()}
      </div>

      {(() => {
        const filtered = (testimonials || []).filter(t => {
          const programOk = programFilter === 'all' || (t.program && t.program === programFilter)
          const yearOk = yearFilter === 'all' || (t.year && String(t.year) === String(yearFilter))
          return programOk && yearOk
        })
        const listToShow = filtered
        return (
          Array.isArray(listToShow) && listToShow.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listToShow.map((t) => (
                <motion.div
                  key={t.id || `${t.name}-${t.year}`}
                  className="rounded-xl border bg-card text-card-foreground shadow hover:shadow-lg transition-shadow"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-4 mb-4">
                      <Avatar className="w-14 h-14 border">
                        <AvatarImage src={t.image || ''} alt={t.name} />
                        <AvatarFallback>
                          {(t.name || 'A').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg leading-tight">{t.name}</h3>
                        {(t.role || t.program || t.year) && (
                          <p className="text-sm text-muted-foreground">
                            {[t.role, t.program, t.year].filter(Boolean).join(' • ')}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-muted-foreground">“{t.content}”</p>

                    <div className="mt-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">See Details</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl font-bold">Testimonial Details</DialogTitle>
                          </DialogHeader>
                          <div className="flex items-center gap-4 mb-4">
                            <Avatar className="w-16 h-16 border">
                              <AvatarImage src={t.image || ''} alt={t.name} />
                              <AvatarFallback>
                                {(t.name || 'A').split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg leading-tight">{t.name}</h3>
                              {(t.role || t.program || t.year) && (
                                <p className="text-sm text-muted-foreground">
                                  {[t.role, t.program, t.year].filter(Boolean).join(' • ')}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-muted-foreground leading-relaxed">{t.content}</p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">No testimonials match the selected filters.</div>
          )
        )
      })()}
      </div>
    </div>
  )
}

export default TestimonialsPage
