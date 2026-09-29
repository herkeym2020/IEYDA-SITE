import React, { useRef, useEffect } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Target, 
  ArrowRight,
  Sparkles,
  Users,
  Award,
  MapPin
} from 'lucide-react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

// Import hero images
import heroImage from '../assets/ilorin 1.jpeg'
import youthEmpowermentBg from '../assets/ilorin 2.jpeg'
import communityDevBg from '../assets/ilorin 3.jpg'
import communityImage1 from '../assets/ilorin 6.jpg'
import communityImage2 from '../assets/ilorin 7.jpeg'
import { getImageUrl } from '@/lib/utils'

const HeroSlider = ({ slides = [], stats = [] }) => {
  const progressCircle = useRef(null)
  const progressContent = useRef(null)

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty('--progress', 1 - progress)
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`
    }
  }

  // Icon mapping for CTAs
  const ctaIconMap = {
    'Explore Programs': Target,
    'Join Community': Users,
    'Leadership Programs': Award,
    'Learn More': ArrowRight,
    'View Programs': ArrowRight,
    'Meet Our Team': ArrowRight,
    '': ArrowRight,
  };

  function toCamelCase(str) {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  }


  function transformSlide(slide) {
    // Convert all keys to camelCase
    const obj = {};
    for (const key in slide) {
      obj[toCamelCase(key)] = slide[key];
    }
    // Map ctas to primaryAction/secondaryAction
    const ctas = Array.isArray(obj.ctas) ? obj.ctas : [];
    obj.primaryAction = ctas[0]
      ? {
          ...ctas[0],
          icon: ctaIconMap[ctas[0].text] || ArrowRight,
        }
      : null;
    obj.secondaryAction = ctas[1]
      ? {
          ...ctas[1],
          icon: ctaIconMap[ctas[1].text] || ArrowRight,
        }
      : null;
    // Use centralized getImageUrl for all images
    obj.image = getImageUrl(obj.primaryImage || obj.image || '');
    obj.overlayImage = getImageUrl(obj.overlayImage || '');
    return obj;
  }


  const transformedSlides = (slides || []).map(transformSlide);

  // Icon mapping for stats (if needed for rendering)
  const statIconMap = {
    Users,
    Target,
    Award,
    MapPin,
  };
  // If stats need icon mapping, map here
  const mappedStats = (stats || []).map(stat => ({
    ...stat,
    icon: statIconMap[stat.icon] || Award,
  }));

  // No loading or error state: render instantly with provided data
  if (!transformedSlides || transformedSlides.length === 0) {
    return null;
  }
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Swiper
        spaceBetween={0}
        centeredSlides={true}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        effect="fade"
        fadeEffect={{
          crossFade: true
        }}
        modules={[Autoplay, Pagination, EffectFade]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className="hero-swiper h-screen"
      >
        {transformedSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Multi-layered Background */}
              <div className="absolute inset-0">
                {/* Primary Background Image */}
                <img 
                  src={slide.image} 
                  alt={slide.title} 
                  className="w-full h-full object-cover"
                />
                
                {/* Secondary Background Overlay */}
                {/* <div className="absolute inset-0 opacity-30">
                  <img 
                    src={slide.overlayImage} 
                    alt="Background overlay" 
                    className="w-full h-full object-cover mix-blend-overlay"
                  />
                </div> */}
                
                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-linear-to-r from-primary/55 via-primary/35 to-accent/35"></div>
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/20"></div>
                
                {/* Animated Pattern Overlay */}
                {/* <div className="absolute inset-0 hero-pattern opacity-20"></div> */}
                
                {/* Floating Geometric Elements */}
                <motion.div 
                  className="absolute top-20 left-10 w-24 h-24 bg-secondary/30 rounded-full blur-xl"
                  animate={{ 
                    y: [0, -30, 0],
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.7, 0.3],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute top-40 right-20 w-16 h-16 bg-accent/40 rounded-lg blur-lg rotate-45"
                  animate={{ 
                    y: [0, 25, 0],
                    scale: [1, 0.8, 1],
                    opacity: [0.4, 0.8, 0.4],
                    rotate: [45, 225, 405]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
                />
                <motion.div 
                  className="absolute bottom-32 right-16 w-32 h-32 bg-secondary/25 rounded-full blur-xl"
                  animate={{ 
                    y: [0, 20, 0],
                    scale: [1, 0.9, 1],
                    opacity: [0.4, 0.7, 0.4],
                    x: [0, 10, 0]
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                />
                
                {/* Particle Effect */}
                <div className="absolute inset-0">
                  {[...Array(15)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white/20 rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                      animate={{
                        y: [0, -100, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10 container-max text-center text-white px-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  >
                    <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 text-lg px-6 py-2 backdrop-blur-sm">
                      <Sparkles className="h-4 w-4 mr-2" />
                      {slide.badge}
                    </Badge>
                  </motion.div>
                  
                  <motion.h1 
                    className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                  >
                    {slide.title},{' '}
                    <span className="bg-linear-to-r from-secondary to-accent bg-clip-text text-transparent">
                      {slide.subtitle}
                    </span>
                  </motion.h1>
                  
                  <motion.p 
                    className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto text-white/90"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 + index * 0.1 }}
                  >
                    {slide.description}
                  </motion.p>

                  <motion.div 
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                  >
                    <p className="text-lg font-medium mb-2 text-secondary">
                      "{slide.motto}"
                    </p>
                    <p className="text-sm italic text-white/80">
                      "{slide.yorubaText}"
                    </p>
                  </motion.div>

                  <motion.div 
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 + index * 0.1 }}
                  >
                    {slide.primaryAction && (
                      <Link to={slide.primaryAction.link || '#'}>
                        <Button size="lg" className="btn-secondary text-lg px-8 py-4 hover:scale-105 transition-transform duration-200">
                          {(slide.primaryAction.icon || ArrowRight) && (
                            <slide.primaryAction.icon className="h-5 w-5 mr-2" />
                          )}
                          {slide.primaryAction.text || 'Learn More'}
                        </Button>
                      </Link>
                    )}
                    {slide.secondaryAction && (
                      <Link to={slide.secondaryAction.link || '#'}>
                        <Button 
                          size="lg" 
                          variant="outline" 
                          className="text-lg px-8 py-4 border-white/30 text-primary hover:bg-white/10 hover:text-white hover:scale-105 transition-all duration-200 backdrop-blur-sm"
                        >
                          {slide.secondaryAction.text || 'Explore'}
                          {(slide.secondaryAction.icon || ArrowRight) && (
                            <slide.secondaryAction.icon className="h-5 w-5 ml-2" />
                          )}
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                </motion.div>

                {/* Enhanced Stats - Only show on first slide */}
                {index === 0 && (
                  <motion.div 
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    {mappedStats.map((stat, statIndex) => (
                      <motion.div
                        key={statIndex}
                        className="glass-effect rounded-xl p-6 text-center backdrop-blur-md border border-white/10"
                        whileHover={{ 
                          scale: 1.05,
                          y: -5,
                          boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
                        }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 * statIndex }}
                      >
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <stat.icon className="h-8 w-8 text-secondary mx-auto mb-3" />
                        </motion.div>
                        <div className="text-2xl lg:text-3xl font-bold mb-1">{stat.number}</div>
                        <div className="text-sm font-medium mb-2">{stat.label}</div>
                        <div className="text-xs text-white/70">{stat.description}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        {/* Custom Autoplay Progress */}
        <div className="autoplay-progress" slot="container-end">
          <svg viewBox="0 0 48 48" ref={progressCircle}>
            <circle cx="24" cy="24" r="20"></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>

      {/* Enhanced Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center backdrop-blur-sm">
          <motion.div 
            className="w-1 h-3 bg-white/70 rounded-full mt-2"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      <style>{`
        .hero-pattern {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 50px 50px, 25px 25px;
          animation: float 20s ease-in-out infinite;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .hero-swiper .swiper-pagination {
          bottom: 60px !important;
        }

        .hero-swiper .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.5);
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .hero-swiper .swiper-pagination-bullet-active {
          background: #ffffff;
          opacity: 1;
          transform: scale(1.2);
        }

        .autoplay-progress {
          position: absolute;
          right: 16px;
          bottom: 16px;
          z-index: 10;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 50%;
          backdrop-filter: blur(10px);
        }

        .autoplay-progress svg {
          --progress: 0;
          position: absolute;
          left: 0;
          top: 0px;
          z-index: 10;
          width: 100%;
          height: 100%;
          stroke-width: 2px;
          stroke: white;
          fill: none;
          stroke-dashoffset: calc(125.6px * (1 - var(--progress)));
          stroke-dasharray: 125.6;
          transform: rotate(-90deg);
        }
      `}</style>
    </section>
  )
}

export default HeroSlider

