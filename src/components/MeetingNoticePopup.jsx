import { useEffect, useState } from 'react'
import { CalendarDays, Clock3, MapPin, Megaphone, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiFetch } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

function getInitialNotices() {
  const value = typeof window !== 'undefined' ? window.__BOOTSTRAP_DATA__?.['meeting-notices'] : null
  return Array.isArray(value) ? value : value?.data || []
}

function dateLabel(value) {
  if (!value) return ''
  return new Date(value).toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' })
}

export default function MeetingNoticePopup() {
  const [notices, setNotices] = useState(getInitialNotices)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const response = await apiFetch('/meeting-notices')
        if (!cancelled) setNotices(response?.data || response || [])
      } catch (_) {
        // The injected bootstrap is enough; a missing endpoint must not block the site.
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!notices.length) return undefined
    const notice = notices[0]
    const key = `ieyda-meeting-notice-${notice.id}`
    if (typeof window !== 'undefined' && window.sessionStorage.getItem(key)) return undefined
    const timer = window.setTimeout(() => setOpen(true), 900)
    return () => window.clearTimeout(timer)
  }, [notices])

  const notice = notices[0]
  if (!notice) return null
  const dismiss = (value) => {
    if (!value && typeof window !== 'undefined') window.sessionStorage.setItem(`ieyda-meeting-notice-${notice.id}`, '1')
    setOpen(value)
  }

  return (
    <Dialog open={open} onOpenChange={dismiss}>
      <DialogContent className="max-w-xl overflow-hidden border-0 p-0">
        <div className="bg-primary px-6 py-5 text-white">
          <div className="flex items-center gap-3 text-secondary"><Megaphone className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.2em]">Meeting notice</span></div>
          <DialogHeader className="mt-3 text-left"><DialogTitle className="text-2xl font-bold text-white">{notice.title}</DialogTitle><DialogDescription className="text-white/80">{notice.meeting_type || 'Official IEYDA notice'}</DialogDescription></DialogHeader>
        </div>
        <div className="space-y-5 p-6">
          <p className="text-base leading-relaxed text-muted-foreground">{notice.summary}</p>
          {notice.details && <p className="text-sm leading-relaxed text-muted-foreground">{notice.details}</p>}
          <div className="grid gap-3 rounded-xl bg-primary/5 p-4 text-sm">
            {notice.starts_at && <div className="flex items-start gap-3"><CalendarDays className="mt-0.5 h-4 w-4 text-primary" /><span>{dateLabel(notice.starts_at)}</span></div>}
            {notice.ends_at && <div className="flex items-start gap-3"><Clock3 className="mt-0.5 h-4 w-4 text-primary" /><span>Ends {dateLabel(notice.ends_at)}</span></div>}
            {notice.location && <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><span>{notice.location}</span></div>}
          </div>
          <div className="flex flex-wrap gap-3"><Button onClick={() => dismiss(false)}>Close notice</Button>{notice.action_url && <Button asChild variant="outline"><Link to={notice.action_url}>{notice.action_label || 'View details'}<ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button>}</div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
