'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LaserIntroProps {
  onStart: () => void
}

const sunshineProblems = [
  { before: '"I help people get results"', after: 'Speaking their exact words back to them' },
  { before: 'Posting and hoping', after: 'Hooks that stop the scroll' },
  { before: 'Generic offers that blend in', after: 'Offers they can\'t refuse' },
  { before: 'Wondering who your audience is', after: 'Knowing them better than they know themselves' },
]

const outcomes = [
  { icon: '🔍', label: 'Deep Audience Research', desc: 'Where they hang out & what keeps them up at night' },
  { icon: '🎯', label: 'Your Brand Angle', desc: 'Positioning that makes you unforgettable' },
  { icon: '🎣', label: '50 Scroll-Stopping Hooks', desc: 'Rated by you, ready to use' },
  { icon: '💰', label: 'Your Offer Core', desc: 'The emotional foundation that converts' },
]

export default function LaserIntro({ onStart }: LaserIntroProps) {
  const [phase, setPhase] = useState<'sunshine' | 'transition' | 'laser'>('sunshine')

  const handleTransition = useCallback(() => {
    setPhase('transition')
    // Push state so browser back button works
    window.history.pushState({ phase: 'laser' }, '', window.location.pathname)
    setTimeout(() => setPhase('laser'), 800)
  }, [])

  // Listen for browser back button
  useEffect(() => {
    const handlePopState = () => {
      // If we're on the laser phase and user clicks back, go to sunshine
      if (phase === 'laser') {
        setPhase('sunshine')
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [phase])

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      <AnimatePresence mode="wait">
        {phase === 'sunshine' && (
          <motion.div
            key="sunshine"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center max-w-2xl"
          >
            {/* Sunshine Icon - static */}
            <div className="text-8xl mb-8">
              ☀️
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Stop Marketing Like a
              <span className="block text-yellow-400 mt-2">Ray of Sunshine</span>
            </h1>

            <p className="text-xl text-gray-400 mb-12">
              Scattered light goes everywhere.<br />
              Reaches no one. Converts nothing.
            </p>

            {/* Problem List */}
            <div className="space-y-4 mb-12">
              {sunshineProblems.map((problem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center justify-center gap-3"
                >
                  <span className="text-yellow-500">✗</span>
                  <span className="italic text-gray-300">{problem.before}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={handleTransition}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-shadow"
            >
              There&apos;s a better way →
            </motion.button>
          </motion.div>
        )}

        {phase === 'transition' && (
          <motion.div
            key="transition"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center relative"
          >
            <motion.div
              animate={{
                scale: [1, 0.5, 0.1],
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 0.6 }}
              className="text-8xl"
            >
              ☀️
            </motion.div>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 1] }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-2 h-32 bg-gradient-to-b from-[var(--color-brave-400)] to-[var(--color-brave-600)] rounded-full shadow-lg shadow-[var(--color-brave-500)]/50" />
            </motion.div>
          </motion.div>
        )}

        {phase === 'laser' && (
          <motion.div
            key="laser"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl"
          >
            {/* Lightning bolt icon - static, no gradient circle */}
            <div className="text-8xl mb-8">
              ⚡
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              Start Marketing Like a
              <span className="block bg-gradient-to-r from-[var(--color-brave-400)] to-[var(--color-brave-600)] bg-clip-text text-transparent mt-2">
                Laser Beam
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300 mb-12"
            >
              Focused. Precise. Impossible to ignore.
            </motion.p>

            {/* Transformation Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid md:grid-cols-2 gap-4 mb-12"
            >
              {sunshineProblems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-[#243351] p-4 rounded-xl border border-white/10 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-[var(--color-brave-500)]/20 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-[var(--color-brave-400)] text-sm">✓</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{item.after}</p>
                      <p className="text-gray-400 text-sm line-through">{item.before}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* What You Get - smooth hover animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-12"
            >
              <h3 className="text-lg font-semibold text-white mb-6">What you&apos;ll walk away with:</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {outcomes.map((outcome, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="bg-[#243351] p-4 rounded-xl border border-white/10 text-center cursor-pointer transition-all duration-300 ease-out hover:scale-105 hover:bg-[#2a3d5f] hover:border-[var(--color-brave-500)]/30 hover:shadow-lg hover:shadow-[var(--color-brave-500)]/10"
                  >
                    <div className="text-3xl mb-2">{outcome.icon}</div>
                    <p className="text-white font-medium text-sm mb-1">{outcome.label}</p>
                    <p className="text-gray-300 text-xs">{outcome.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, type: 'spring' }}
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
              transition={{ delay: 1.4 }}
              className="text-gray-400 text-sm mt-6"
            >
              More leads. More conversions. More growth.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
