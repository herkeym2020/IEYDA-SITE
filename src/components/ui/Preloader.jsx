import React from 'react'

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-linear-to-b from-primary/5 via-white to-white backdrop-blur-xl">
      <div className="relative flex flex-col items-center gap-6 px-6 py-10">
        <div className="absolute -inset-10 bg-primary/5 blur-3xl rounded-full animate-pulse" aria-hidden="true" />

        <div className="relative flex items-end gap-2 text-primary">
          <MosqueIcon className="h-20 w-20 drop-shadow-md" />
          <div className="h-16 w-2 rounded-full bg-primary/30 animate-[pulse_1.4s_ease-in-out_infinite]" />
        </div>

        <div className="flex flex-col items-center text-center gap-1">
          <span className="text-xl font-semibold text-primary tracking-wide">Love and harmony</span>
          <span className="text-sm text-muted-foreground">Preparing your experience…</span>
        </div>
      </div>
    </div>
  )
}

function MosqueIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Loading"
    >
      <defs>
        <linearGradient id="dome" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M60 18 C52 28 40 34 40 52 V64 H80 V52 C80 34 68 28 60 18 Z"
          fill="url(#dome)"
          className="animate-[pulse_1.6s_ease-in-out_infinite]"
        />
        <rect x="26" y="64" width="68" height="32" rx="6" className="opacity-90" />
        <path d="M18 48 V96" className="opacity-80" />
        <path d="M102 48 V96" className="opacity-80" />
        <circle cx="18" cy="44" r="5" className="animate-bounce" />
        <circle cx="102" cy="44" r="5" className="animate-bounce" />
        <path d="M52 64 V96" />
        <path d="M68 64 V96" />
        <path d="M48 76 H72" />
        <path d="M42 96 H78" />
      </g>
    </svg>
  )
}
