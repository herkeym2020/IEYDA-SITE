import { Calendar, CheckCircle, Clock, MapPin, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { stripHtml } from '@/lib/utils'

export default function HomeContentDialog({ content, onClose }) {
  if (!content) return null
  const { kind, item } = content
  const title = item.title || item.name
  const description = stripHtml(item.content || item.description || item.excerpt || '')
  const image = item.image

  return (
    <Dialog open={Boolean(content)} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="pr-8 text-2xl">{title}</DialogTitle></DialogHeader>
        {image && <img src={image} alt={title} className="h-56 w-full rounded-xl object-cover" />}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {kind === 'news' && <><span>{item.category}</span><span>{item.author ? `By ${item.author}` : ''}</span><span>{item.date || item.published_at}</span></>}
          {kind === 'program' && <><span>{item.status}</span><span>{item.beneficiaries}</span><span>{item.duration}</span></>}
          {kind === 'event' && <><span className="inline-flex items-center gap-1"><Calendar className="h-4 w-4" />{item.date}</span><span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" />{item.time}</span><span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{item.location}</span></>}
        </div>
        <div className="prose max-w-none text-muted-foreground"><p className="whitespace-pre-line leading-relaxed">{description}</p></div>
        {kind === 'program' && Array.isArray(item.objectives) && item.objectives.length > 0 && <div><h3 className="mb-2 font-semibold">Key objectives</h3><ul className="space-y-2">{item.objectives.map((objective, index) => <li key={index} className="flex gap-2 text-sm text-muted-foreground"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{stripHtml(objective)}</li>)}</ul></div>}
        {kind === 'event' && Array.isArray(item.highlights) && item.highlights.length > 0 && <div><h3 className="mb-2 font-semibold">Event highlights</h3><ul className="space-y-2">{item.highlights.map((highlight, index) => <li key={index} className="flex gap-2 text-sm text-muted-foreground"><CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />{stripHtml(highlight)}</li>)}</ul></div>}
        {kind === 'event' && <div className="flex flex-wrap gap-3 border-t pt-4"><span className="inline-flex items-center gap-2 text-sm text-muted-foreground"><Users className="h-4 w-4" />{item.attendees || 'Open'} expected attendees</span>{item.registration?.link && <a className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white" href={item.registration.link} target="_blank" rel="noreferrer">Register now</a>}</div>}
        <Button variant="outline" onClick={onClose}><X className="mr-2 h-4 w-4" />Close</Button>
      </DialogContent>
    </Dialog>
  )
}
