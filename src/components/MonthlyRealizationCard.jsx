import { Award, MapPin, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getImageUrl } from '@/lib/utils'

export default function MonthlyRealizationCard({ realization, compact = false }) {
  if (!realization) return null
  return (
    <Card className={`group overflow-hidden border-amber-300 bg-linear-to-br from-amber-50 via-yellow-50 to-white shadow-lg ${compact ? '' : 'lg:grid lg:grid-cols-[0.9fr_1.1fr]'}`}>
      {realization.image && <div className={`${compact ? 'h-48' : 'min-h-64'} overflow-hidden`}><img src={getImageUrl(realization.image)} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>}
      <CardContent className="relative p-6 md:p-8">
        <div className="absolute right-5 top-5 text-amber-300/70"><Sparkles className="h-10 w-10" /></div>
        <Badge className="mb-4 bg-amber-500 text-white hover:bg-amber-500"><Award className="mr-2 h-4 w-4" /> Community development realization of the month</Badge>
        <h3 className="max-w-xl text-2xl font-bold text-amber-950 md:text-3xl">{realization.title}</h3>
        <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-amber-800"><span>{realization.community_name}</span>{realization.lga && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" />{realization.lga}</span>}</div>
        <p className="mt-4 leading-relaxed text-amber-950/75">{realization.summary}</p>
        {realization.impact_metric && <p className="mt-5 inline-flex rounded-full border border-amber-300 bg-white/70 px-4 py-2 text-sm font-bold text-amber-900">{realization.impact_metric}</p>}
      </CardContent>
    </Card>
  )
}
