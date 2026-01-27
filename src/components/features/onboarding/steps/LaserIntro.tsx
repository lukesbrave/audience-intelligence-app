'use client'

import { motion } from 'framer-motion'

interface LaserIntroProps {
  onStart: () => void
}

const outcomes = [
  { icon: '🔍', label: 'Audience Truth', desc: 'Where your audience actually spends attention, what they care about right now, and what\'s quietly driving their decisions.' },
  { icon: '🎯', label: 'Your Strategic Angle', desc: 'The positioning that makes your message land, stand out, and actually stick.' },
  { icon: '🎣', label: 'Demand Triggers', desc: 'Proven ways into attention, ranked, refined, and ready to deploy when it actually matters.' },
  { icon: '💰', label: 'What Makes Them Say Yes', desc: 'The real emotional drivers behind action, so your offer connects before it convinces.' },
]

export default function LaserIntro({ onStart }: LaserIntroProps) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl"
      >
        {/* Lightning bolt icon */}
        <div className="text-8xl mb-8">
          ⚡
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Start Marketing
          <span className="block bg-gradient-to-r from-[var(--color-brave-400)] to-[var(--color-brave-600)] bg-clip-text text-transparent mt-2">
            Like a Laser Beam
          </span>
        </h1>

        <p className="text-xl text-gray-300 mb-12">
          Focused. Precise. Impossible to ignore.
        </p>

        {/* What You Get - enhanced panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-sm font-normal text-gray-500 mb-6 uppercase tracking-wider">What you&apos;ll walk away with</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {outcomes.map((outcome, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-[#1e3a5f] p-4 rounded-xl border border-[var(--color-brave-500)]/30 text-center cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:bg-[#254a73] hover:border-[var(--color-brave-500)]/60 hover:shadow-lg hover:shadow-[var(--color-brave-500)]/20"
              >
                <div className="text-3xl mb-2">{outcome.icon}</div>
                <p className="text-white font-bold text-base mb-1">{outcome.label}</p>
                <p className="text-gray-300 text-xs">{outcome.desc}</p>
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
          className="px-10 py-5 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-500)] text-white font-bold text-xl rounded-xl shadow-lg shadow-[var(--color-brave-500)]/30 hover:shadow-[var(--color-brave-500)]/50 transition-all duration-200 ease-out hover:scale-105 active:scale-98"
        >
          <span className="flex items-center gap-3">
            <span>Activate Laser Mode</span>
            <span>⚡</span>
          </span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-gray-400 text-sm mt-6"
        >
          More leads. More conversions. More growth.
        </motion.p>
      </motion.div>
    </div>
  )
}
