import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, BookOpen, Clock3, ExternalLink, MapPin, Sparkles, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { apiFetch } from '@/lib/api'

const fallback = {
  title: 'Ilorin: a living crossroads',
  content: 'A concise journey through the people, faith traditions, leadership, and shared culture that shaped Ilorin and the Ilorin Emirate.',
  metadata: {
    eyebrow: 'A living heritage',
    intro: 'Ilorin is a historic meeting point of Yoruba, Fulani, Hausa and wider Muslim scholarly traditions. Its story is one of movement, learning, leadership, resilience and harmony.',
    stats: [{ label: 'Emirate LGAs', value: '5' }, { label: 'IEYDA founded', value: '2014' }, { label: 'Shared motto', value: 'Love & Harmony' }],
    gallery: [
      { image: '/history/ilorin-1.jpeg', caption: 'Ilorin today: a city shaped by community and movement.' },
      { image: '/history/ilorin-2.jpeg', caption: 'The visual language of an enduring Emirate.' },
      { image: '/history/emir-ilorin.jpg', caption: 'The Emirate institution and its living leadership.' },
    ], timeline: [], people: [], sources: [],
  },
}

export default function IlorinHistoryPage() {
  const [page, setPage] = useState(() => window.__BOOTSTRAP_DATA__?.history || fallback)

  useEffect(() => {
    apiFetch('/history/ilorin').then((value) => {
      const data = value?.data || value
      if (data) setPage(data)
    }).catch(() => {})
  }, [])

  const meta = page.metadata || fallback.metadata
  const gallery = meta.gallery?.length ? meta.gallery : fallback.metadata.gallery
  const timeline = meta.timeline || []
  const people = meta.people || []

  return (
    <main className="min-h-screen bg-[#071b17] pt-20 text-white">
      <section className="relative isolate overflow-hidden px-6 py-24 md:py-32">
        <img src={gallery[0]?.image} alt="Ilorin heritage" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,#071b17_15%,rgba(7,27,23,.78)_52%,rgba(7,27,23,.35))]" />
        <div className="absolute inset-0 -z-10 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #d4af37 0, transparent 30%), radial-gradient(circle at 85% 55%, #147d5a 0, transparent 35%)' }} />
        <div className="container-max relative z-10">
          <div className="max-w-4xl">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.3em] text-[#e2bd53]">{meta.eyebrow || 'A living heritage'}</p>
            <h1 className="text-5xl font-black tracking-tight md:text-7xl">{page.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/75 md:text-xl">{meta.intro || page.content}</p>
            <div className="mt-9 flex flex-wrap gap-3 text-sm text-white/65"><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2"><MapPin className="h-4 w-4 text-[#e2bd53]" /> Ilorin Emirate, Kwara State</span><span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2"><BookOpen className="h-4 w-4 text-[#e2bd53]" /> A concise public history</span></div>
          </div>
          <div className="mt-14 grid max-w-4xl gap-4 sm:grid-cols-3">{(meta.stats || []).map((stat) => <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md"><div className="text-3xl font-bold text-[#e2bd53]">{stat.value}</div><div className="mt-2 text-sm text-white/65">{stat.label}</div></div>)}</div>
          <a href="#timeline" className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#e2bd53] hover:text-white">Begin the journey <ArrowDown className="h-4 w-4" /></a>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] px-6 py-16"><div className="container-max"><div className="mb-8 flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e2bd53]">The place</p><h2 className="mt-2 text-3xl font-bold md:text-4xl">A city of memory and movement</h2></div><span className="hidden text-sm text-white/45 md:block">Ilorin through a visual lens</span></div><div className="grid gap-5 md:grid-cols-3">{gallery.map((item, index) => <motion.figure key={`${item.image}-${index}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className={`group overflow-hidden rounded-3xl border border-white/10 bg-[#0d2922] ${index === 1 ? 'md:translate-y-8' : ''}`}><div className="h-64 overflow-hidden"><img src={item.image} alt={item.alt || item.caption || 'Ilorin heritage'} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><figcaption className="p-5 text-sm leading-relaxed text-white/65">{item.caption}</figcaption></motion.figure>)}</div></div></section>

      <section id="timeline" className="relative px-6 py-24"><div className="container-max"><div className="mb-14 max-w-2xl"><div className="flex items-center gap-3 text-[#e2bd53]"><Clock3 className="h-5 w-5" /><span className="text-sm font-bold uppercase tracking-[0.25em]">The journey</span></div><h2 className="mt-4 text-4xl font-black md:text-5xl">Place, people and turning points</h2><p className="mt-4 text-lg leading-relaxed text-white/60">A concise timeline of the events and people that shaped Ilorin’s identity.</p></div>{timeline.length ? <div className="relative ml-3 border-l border-[#e2bd53]/40 pl-8 md:ml-12 md:pl-16">{timeline.map((item, index) => <motion.article key={`${item.year}-${item.title}`} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ delay: index * 0.04 }} className="relative mb-16 grid max-w-5xl gap-7 md:grid-cols-[.8fr_1.2fr] md:items-start"><span className="absolute -left-[2.65rem] top-1 h-4 w-4 rounded-full border-4 border-[#071b17] bg-[#e2bd53] md:-left-[4.45rem]" /><div><div className="text-sm font-bold tracking-[0.2em] text-[#e2bd53]">{item.year}</div><h3 className="mt-3 text-2xl font-bold md:text-3xl">{item.title}</h3></div><div><p className="leading-relaxed text-white/65 md:text-lg">{item.description}</p>{item.image && <img src={item.image} alt="" className="mt-5 max-h-64 w-full rounded-2xl object-cover opacity-90" />}</div></motion.article>)}</div> : <p className="max-w-3xl text-white/65">The historical timeline is being curated by IEYDA. Please check back as more verified milestones and oral histories are added.</p>}</div></section>

      {people.length > 0 && <section className="bg-white/[0.04] px-6 py-20"><div className="container-max"><div className="mb-10 max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.25em] text-[#e2bd53]">The people</p><h2 className="mt-3 text-3xl font-bold md:text-4xl">Those who shaped the story</h2></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{people.map((person) => <div key={person.name} className="rounded-2xl border border-white/10 bg-[#0d2922] p-6"><div className="mb-4 flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#e2bd53]/15 text-[#e2bd53]">{person.image ? <img src={person.image} alt="" className="h-full w-full object-cover" /> : <Sparkles className="h-5 w-5" />}</div><h3 className="text-xl font-bold">{person.name}</h3><p className="mt-1 text-sm text-[#e2bd53]">{person.role}</p><p className="mt-3 text-sm leading-relaxed text-white/60">{person.description}</p></div>)}</div></div></section>}

      <section className="px-6 py-20"><div className="container-max rounded-3xl border border-[#e2bd53]/30 bg-[linear-gradient(120deg,rgba(226,189,83,.16),rgba(20,125,90,.18))] p-8 md:p-12"><div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between"><div><div className="mb-4 flex items-center gap-3 text-[#e2bd53]"><Users className="h-5 w-5" /><span className="text-sm font-bold uppercase tracking-[0.2em]">The story continues</span></div><h2 className="text-3xl font-bold md:text-4xl">History is carried by people.</h2><p className="mt-3 max-w-2xl text-white/65">Discover the associations, leaders and community builders continuing Ilorin’s story today.</p></div><Link to="/community" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#e2bd53] px-5 py-3 font-bold text-[#071b17] transition hover:bg-white">Explore our communities <ArrowRight className="h-4 w-4" /></Link></div>{meta.sources?.length > 0 && <div className="mt-10 border-t border-white/10 pt-6"><p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-white/45">Sources and further reading</p><div className="flex flex-wrap gap-4">{meta.sources.map((source) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-[#e2bd53] hover:text-white">{source.label}<ExternalLink className="h-3 w-3" /></a>)}</div></div>}</div></section>
    </main>
  )
}
