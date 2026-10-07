import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import HeroSlider from '@/components/HeroSlider'
import LeadershipSectionDynamic from '@/components/LeadershipSectionDynamic'
import MonthlyRealizationCard from '@/components/MonthlyRealizationCard'
import HomeContentDialog from '@/components/HomeContentDialog'
import { 
  Users, 
  Target, 
  Award, 
  ArrowRight,
  Star,
  TrendingUp,
  MapPin,
  Calendar,
  Heart,
  Crown,
  Newspaper,
  CalendarDays,
  Eye,
} from 'lucide-react'
import { getImageUrl } from '@/lib/utils'

const HomePage = () => {
  const [heroSlides, setHeroSlides] = useState([]);
  const [heroStats, setHeroStats] = useState([]);
  const [siteStats, setSiteStats] = useState(() => (typeof window !== 'undefined' ? window.__BOOTSTRAP_DATA__?.['site-stats'] : null));
  const [apiPrograms, setApiPrograms] = useState([])
  const [apiNews, setApiNews] = useState([])
  const [apiTestimonials, setApiTestimonials] = useState([])
  const [apiEvents, setApiEvents] = useState([])
  const [apiTeam, setApiTeam] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null)
  const [monthlyRealization, setMonthlyRealization] = useState(() => {
    const value = typeof window !== 'undefined' ? window.__BOOTSTRAP_DATA__?.['monthly-realizations'] : null
    return (Array.isArray(value) ? value : value?.data || [])[0] || null
  });

  // Icon mapping for programs (string to React component)
  const iconMap = {
    Users,
    Award,
    Target,
    MapPin,
    Heart,
    Crown,
  };
  
  // Color mapping (string to Tailwind class)
  const colorMap = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500',
    default: 'bg-primary',
  };

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return isNaN(d) ? '' : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    async function load() {
      try {
        const results = await Promise.allSettled([
          apiFetch('/hero-slides', { signal: controller.signal }),
          apiFetch('/hero-stats', { signal: controller.signal }),
          apiFetch('/programs', { signal: controller.signal }),
          apiFetch('/news', { signal: controller.signal }),
          apiFetch('/testimonials', { signal: controller.signal }),
          apiFetch('/events', { signal: controller.signal }),
          apiFetch('/team', { signal: controller.signal })
        ]);

        if (cancelled) return;

        const valueOr = (index, fallback = []) => (
          results[index]?.status === 'fulfilled' ? results[index].value : fallback
        );
        const heroSlidesRes = valueOr(0);
        const heroStatsRes = valueOr(1);
        const programs = valueOr(2);
        const news = valueOr(3);
        const testimonials = valueOr(4);
        const events = valueOr(5);
        const team = valueOr(6);

        setHeroSlides(heroSlidesRes?.data || heroSlidesRes || []);
        setHeroStats(heroStatsRes?.data || heroStatsRes || []);
        const managedStats = typeof window !== 'undefined' ? window.__BOOTSTRAP_DATA__?.['site-stats'] : null;
        if (managedStats) setSiteStats(managedStats);

        const prog = (programs?.data || programs || []).map((p) => ({
          ...p,
          image: getImageUrl(p.image),
          icon: iconMap[p.icon] || Award,
          color: colorMap[p.color] || colorMap.default,
          participants: p.participants || '',
          duration: p.duration || '',
        }));

        const newsArr = (news?.data || news || []).map((n) => ({
          ...n,
          image: getImageUrl(n.image),
          date: formatDate(n.date || n.published_at),
        }));

        const testi = (testimonials?.data || testimonials || []).map((t) => ({
          ...t,
          content: t.testimonial || t.content,
          image: getImageUrl(t.photo || t.image),
        }));

        const evs = (events?.data || events || []).map((e) => ({
          ...e,
          image: getImageUrl(e.image),
          date: formatDate(e.date),
        }));

        const teamArr = (team?.data || team || []).map((m) => ({
          ...m,
          image: getImageUrl(m.image),
        }));

        setApiPrograms(prog);
        setApiNews(newsArr);
        setApiTestimonials(testi);
        setApiEvents(evs);
        setApiTeam(teamArr);
      } catch (e) {
        if (cancelled) return;
      }
    }

    load();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    apiFetch('/monthly-realizations').then((value) => {
      const items = value?.data || value || [];
      if (Array.isArray(items) && items[0]) setMonthlyRealization(items[0]);
    }).catch(() => {});
  }, []);

  // Use only dynamic data from API
  const programsSource = Array.isArray(apiPrograms) ? apiPrograms : [];
  const newsSource = Array.isArray(apiNews) ? apiNews : [];
  const testimonialsSource = Array.isArray(apiTestimonials) ? apiTestimonials : [];
  const eventsSource = Array.isArray(apiEvents) ? apiEvents : [];

  const visiblePrograms = programsSource.slice(0, 3);
  const visibleNews = newsSource.slice(0, 3);
  const visibleTestimonials = testimonialsSource.slice(0, 3);
  const visibleEvents = eventsSource.slice(0, 3);

  // Dynamic stats (Our Impact) calculated from API data
  const totalBeneficiaries = programsSource.reduce((sum, p) => {
    const num = typeof p.beneficiaries === 'string' ? parseInt(p.beneficiaries.replace(/\D/g, '')) : 0;
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  const totalPrograms = programsSource.length;
  const allLocations = programsSource.flatMap(p => Array.isArray(p.locations) ? p.locations : []).filter(Boolean);
  const uniqueLocations = Array.from(new Set(allLocations.map(l => l.trim().toLowerCase())));
  const yearsOfImpact = 2025 - 2015 + 1;

  const stats = [
    {
      number: siteStats?.youth_empowered || (totalBeneficiaries ? totalBeneficiaries + '+' : '0'),
      label: 'Youth Empowered',
      icon: Users,
      description: 'Young people trained and empowered',
    },
    {
      number: siteStats?.active_programs || totalPrograms,
      label: 'Programs Delivered',
      icon: Target,
      description: 'Successful programs implemented',
    },
    {
      number: siteStats?.communities_reached || uniqueLocations.length,
      label: 'Communities Reached',
      icon: MapPin,
      description: 'Communities across the Emirate',
    },
    {
      number: siteStats?.years_of_service || yearsOfImpact,
      label: 'Years of Impact',
      icon: Award,
      description: 'Decade of community service',
    },
  ];
  
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <HeroSlider slides={heroSlides} stats={heroStats} />

      {/* Stats Section */}
      <section className="section-padding bg-linear-to-b from-primary/5 to-white">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-primary/10 text-primary">
              <TrendingUp className="h-4 w-4 mr-2" />
              Our Impact
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Making a Difference</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Over a decade of dedicated service to the youth and communities of the Ilorin Emirate, 
              creating lasting impact through comprehensive empowerment programs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white group">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                      <stat.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-primary mb-2">{stat.number}</h3>
                    <p className="font-semibold mb-2">{stat.label}</p>
                    <p className="text-sm text-muted-foreground">{stat.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section with See More/Less */}
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
              <Target className="h-4 w-4 mr-2" />
              Our Programs
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Empowerment Through Action</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Comprehensive programs designed to empower youth, strengthen communities, 
              and create sustainable development across the Ilorin Emirate.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {visiblePrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden h-full cursor-pointer" onClick={() => setSelectedContent({ kind: 'program', item: program })}>
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={program.image} 
                        alt={program.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4">
                        <div className={`w-12 h-12 ${program.color} rounded-full flex items-center justify-center shadow-lg`}>
                          <program.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{program.participants}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{program.duration}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-200">
                        {program.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {program.description}
                      </p>
                      
                      <Button onClick={(event) => { event.stopPropagation(); setSelectedContent({ kind: 'program', item: program }) }} className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-200" variant="outline">Learn More<ArrowRight className="h-4 w-4 ml-2" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View All Programs Button */}
          <div className="text-center">
            <Link to="/empowerment">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
              >
                View All Programs
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Leadership Section (Dynamic) */}
      <LeadershipSectionDynamic leaders={apiTeam} />

      {monthlyRealization && (
        <section className="section-padding bg-[#fffaf0]">
          <div className="container-max"><div className="mb-8 flex items-end justify-between gap-4"><div><Badge className="mb-3 bg-amber-100 text-amber-900"><Award className="mr-2 h-4 w-4" /> Community recognition</Badge><h2 className="text-3xl font-bold md:text-4xl">Community of the Month</h2><p className="mt-2 max-w-2xl text-muted-foreground">Celebrating practical service and development work across the Ilorin Emirate.</p></div><Link to="/community" className="hidden text-sm font-semibold text-primary hover:underline sm:block">View communities <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div><MonthlyRealizationCard realization={monthlyRealization} /></div>
        </section>
      )}

      <section className="relative isolate overflow-hidden section-padding bg-primary text-primary-foreground">
        <img src="/history/ilorin-1.jpeg" alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-15" />
        <div className="absolute inset-0 -z-10 bg-primary/75" />
        <div className="container-max flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <Badge className="mb-4 bg-secondary/20 text-secondary">Our shared heritage</Badge>
            <h2 className="text-3xl font-bold md:text-4xl">Discover the story of Ilorin</h2>
            <p className="mt-3 max-w-2xl text-primary-foreground/80">Walk through the milestones, people, and shared responsibility that continue to shape the Ilorin Emirate community.</p>
          </div>
          <Link to="/history/ilorin" className="shrink-0">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">See Ilorin history <ArrowRight className="ml-2 h-4 w-4" /></Button>
          </Link>
        </div>
      </section>

      {/* News Section with See More/Less */}
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
              <Newspaper className="h-4 w-4 mr-2" />
              Latest News
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Keep up with the latest developments, achievements, and upcoming initiatives 
              from IEYDA across the Ilorin Emirate.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {visibleNews.map((news, index) => (
              <motion.div
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden h-full cursor-pointer" onClick={() => setSelectedContent({ kind: 'news', item: news })}>
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={news.image} 
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-gray-800 border-0 shadow-lg">
                          {news.category}
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(news.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            <span>{news.readTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {news.excerpt}
                      </p>
                      
                      <Button onClick={(event) => { event.stopPropagation(); setSelectedContent({ kind: 'news', item: news }) }} className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-200" variant="outline" size="sm">Read More<ArrowRight className="h-4 w-4 ml-2" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View All News Button */}
          <div className="text-center">
            <Link to="/news">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
              >
                View All News
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <HomeContentDialog content={selectedContent} onClose={() => setSelectedContent(null)} />

      {/* Testimonials Section with See More/Less */}
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
              <Star className="h-4 w-4 mr-2" />
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Voices of Impact</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Hear from the youth and community members whose lives have been transformed 
              through IEYDA's empowerment programs and initiatives.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {visibleTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                        <img 
                          src={testimonial.image} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{testimonial.name}</h4>
                        <p className="text-primary font-medium text-sm">{testimonial.role}</p>
                        <p className="text-muted-foreground text-xs">{testimonial.program} • {testimonial.year}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex text-yellow-400 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-muted-foreground leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View All Testimonials Button */}
          <div className="text-center">
            <Link to="/testimonials">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
              >
                View All Stories
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Events Section with See More/Less */}
      <section className="section-padding">
        <div className="container-max">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Badge className="mb-4 bg-orange-100 text-orange-800">
              <CalendarDays className="h-4 w-4 mr-2" />
              Upcoming Events
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Our Events</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Participate in our upcoming events, workshops, and community activities 
              designed to empower, educate, and bring people together.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {visibleEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden h-full cursor-pointer" onClick={() => setSelectedContent({ kind: 'event', item: event })}>
                  <CardContent className="p-0">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>
                      
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-orange-500 text-white border-0 shadow-lg">
                          {event.category}
                        </Badge>
                      </div>

                      <div className="absolute bottom-4 left-4 text-white">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            <span>{event.attendees}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                        {event.title}
                      </h3>
                      
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2 text-primary" />
                          <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2 text-primary" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      
                      <Button onClick={(eventClick) => { eventClick.stopPropagation(); setSelectedContent({ kind: 'event', item: event }) }} className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-200" variant="outline" size="sm">View details<ArrowRight className="h-4 w-4 ml-2" /></Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View All Events Button */}
          <div className="text-center">
            <Link to="/events">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-3 hover:bg-primary hover:text-white transition-all duration-200"
              >
                View All Events
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
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
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-white/90">
              Join thousands of young leaders who are already part of the IEYDA family. 
              Together, we're building a brighter future for the Ilorin Emirate.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/membership">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-black font-semibold text-lg px-8 py-4 hover:scale-105 transition-transform duration-200">
                  <Users className="h-5 w-5 mr-2" />
                  Become a Member
                </Button>
              </Link>
              <Link to="/donate">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 border-white/30 text-white hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-200 backdrop-blur-sm"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Support Our Cause
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
