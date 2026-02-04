'use client'

import { motion } from 'framer-motion'

interface LaserIntroProps {
  onStart: () => void
}

const outcomes = [
  { icon: '🎯', label: 'Know Your Audience', desc: 'Discover where they hang out, what keeps them up at night, and the hidden triggers that drive their decisions.' },
  { icon: '📍', label: 'Find Your Position', desc: 'Uncover the strategic angle that makes you stand out — not just different, but impossible to ignore.' },
  { icon: '🔑', label: 'Unlock Demand', desc: 'Get proven attention hooks, ranked by impact, ready to deploy the moment they matter most.' },
  { icon: '💡', label: 'Convert with Clarity', desc: 'Understand the emotional drivers that turn interest into action — so your offer lands before it sells.' },
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
                <div className="text-3xl mb-2">{outcome.icon}</div>
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

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-white/60 text-sm mt-6"
        >
          Used by 500+ marketers to find their edge.
        </motion.p>
      </motion.div>
    </div>
  )
}
