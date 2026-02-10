'use client'

import { motion } from 'framer-motion'

interface LaserIntroProps {
  onStart: () => void
}

const outcomes = [
  { 
    label: 'Know Your Audience', 
    desc: 'Discover where they hang out, what keeps them up at night, and the hidden triggers that drive their decisions.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    label: 'Find Your Position', 
    desc: 'Uncover the strategic angle that makes you stand out — not just different, but impossible to ignore.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  { 
    label: 'Unlock Demand', 
    desc: 'Get proven attention hooks, ranked by impact, ready to deploy the moment they matter most.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    )
  },
  { 
    label: 'Convert with Clarity', 
    desc: 'Understand the emotional drivers that turn interest into action — so your offer lands before it sells.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
]

export default function LaserIntro({ onStart }: LaserIntroProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Stop Guessing.
          <span className="block bg-gradient-to-r from-[var(--color-brave-500)] to-[var(--color-brave-600)] bg-clip-text text-transparent mt-2">
            Start Knowing.
          </span>
        </h1>

        <p className="text-xl text-white/70 mb-12">
          Deep audience research in minutes — not weeks.
        </p>

        {/* What You Get - enhanced panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-sm font-normal text-white/50 mb-6 uppercase tracking-wider">What you&apos;ll walk away with</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {outcomes.map((outcome, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-[var(--color-brave-primary)] p-4 rounded-xl border border-[var(--color-brave-500)]/20 text-center cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:bg-[var(--color-brave-primary-light)] hover:border-[var(--color-brave-500)]/50 hover:shadow-lg hover:shadow-[var(--color-brave-500)]/10"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--color-brave-500)]/20 flex items-center justify-center text-[var(--color-brave-400)]">
                  {outcome.icon}
                </div>
                <p className="text-white font-bold text-base mb-1">{outcome.label}</p>
                <p className="text-white/70 text-xs leading-relaxed">{outcome.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          onClick={onStart}
          className="px-10 py-5 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-bold text-xl rounded-xl shadow-lg shadow-[var(--color-brave-600)]/30 hover:shadow-[var(--color-brave-600)]/50 transition-all duration-200 ease-out hover:scale-105 active:scale-98"
        >
          <span className="flex items-center gap-3">
            <span>Get Your Audience Intel</span>
            <span>→</span>
          </span>
        </motion.button>

      </motion.div>
    </div>
  )
}
