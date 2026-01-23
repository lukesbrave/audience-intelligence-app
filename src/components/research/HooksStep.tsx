'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SwipeCard } from './SwipeCard'
import { Hook, HookRating, RatedHook, BrandAngle, ResearchOutput } from '@/lib/research/schemas'

interface HooksStepProps {
  selectedAngles: BrandAngle[]
  research: ResearchOutput
  onComplete: (ratedHooks: RatedHook[]) => void
  onBack: () => void
}

export function HooksStep({ selectedAngles, research, onComplete, onBack }: HooksStepProps) {
  const [status, setStatus] = useState<'loading' | 'swiping' | 'complete'>('loading')
  const [hooks, setHooks] = useState<Hook[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ratedHooks, setRatedHooks] = useState<RatedHook[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateHooks()
  }, [])

  const generateHooks = async () => {
    setStatus('loading')
    setError(null)

    try {
      const primaryAngle = selectedAngles[0]

      const response = await fetch('/api/research/hooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedAngle: primaryAngle,
          research,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate hooks')
      }

      setHooks(data.hooks)
      setStatus('swiping')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const handleSwipe = (rating: HookRating) => {
    const currentHook = hooks[currentIndex]
    const ratedHook: RatedHook = { ...currentHook, rating }

    setRatedHooks((prev) => [...prev, ratedHook])

    if (currentIndex < hooks.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setStatus('complete')
    }
  }

  const likedHooks = ratedHooks.filter((h) => h.rating === 'like')
  const lovedHooks = ratedHooks.filter((h) => h.rating === 'love')
  const topHooks = [...lovedHooks, ...likedHooks]

  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#243351] rounded-xl p-8 border border-white/10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block text-5xl mb-4"
          >
            🪝
          </motion.div>
          <h2 className="text-xl font-semibold text-white">Generating Your Hooks</h2>
          <p className="text-gray-400 mt-2">
            Creating 50 scroll-stopping hooks based on your brand angle...
          </p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#243351] rounded-xl p-8 border border-white/10 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">Generation Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={generateHooks}
            className="px-6 py-2 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (status === 'complete') {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white">You've Rated All Hooks!</h2>
          <p className="text-gray-400 mt-2">
            You saved {topHooks.length} hooks ({lovedHooks.length} loved, {likedHooks.length} liked)
          </p>
        </motion.div>

        {topHooks.length > 0 && (
          <div className="space-y-6">
            {lovedHooks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🔥</span> Your Fire Hooks ({lovedHooks.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {lovedHooks.map((hook, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="bg-[#243351] rounded-xl p-4 border-l-4 border-l-orange-500 border border-white/10">
                        <p className="font-medium text-white">"{hook.text}"</p>
                        <p className="text-sm text-gray-400 mt-2">{hook.category}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {likedHooks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <span>❤️</span> Liked Hooks ({likedHooks.length})
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {likedHooks.map((hook, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="bg-[#243351] rounded-xl p-4 border-l-4 border-l-[var(--color-brave-500)] border border-white/10">
                        <p className="font-medium text-white">"{hook.text}"</p>
                        <p className="text-sm text-gray-400 mt-2">{hook.category}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-between items-center mt-8 pt-6 border-t border-white/10"
        >
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Angles
          </button>
          <button
            onClick={() => onComplete(ratedHooks)}
            className="px-6 py-2 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors"
          >
            Create Playbook →
          </button>
        </motion.div>
      </div>
    )
  }

  // Swiping state
  return (
    <div className="max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <h2 className="text-2xl font-bold text-white">Rate Your Hooks</h2>
        <p className="text-gray-400 mt-2">Swipe right ❤️, left ⬅️, or up 🔥</p>
      </motion.div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>
            {currentIndex + 1} of {hooks.length}
          </span>
          <span>
            ❤️ {likedHooks.length} | 🔥 {lovedHooks.length}
          </span>
        </div>
        <div className="h-2 bg-[#243351] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-brave-500)]"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / hooks.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Card stack */}
      <div className="relative h-[350px]">
        <AnimatePresence>
          {hooks.slice(currentIndex, currentIndex + 3).map((hook, i) => (
            <SwipeCard
              key={`${hook.text}-${currentIndex + i}`}
              hook={hook}
              onSwipe={handleSwipe}
              isTop={i === 0}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Manual buttons */}
      <div className="flex justify-center gap-6 mt-8">
        <button
          onClick={() => handleSwipe('skip')}
          className="w-16 h-16 rounded-full bg-[#243351] border border-white/10 flex items-center justify-center text-2xl hover:bg-[#2a3d5f] transition-colors"
          aria-label="Skip"
        >
          ⬅️
        </button>
        <button
          onClick={() => handleSwipe('like')}
          className="w-16 h-16 rounded-full bg-[var(--color-brave-600)]/20 border border-[var(--color-brave-500)]/30 flex items-center justify-center text-2xl hover:bg-[var(--color-brave-600)]/30 transition-colors"
          aria-label="Like"
        >
          ❤️
        </button>
        <button
          onClick={() => handleSwipe('love')}
          className="w-16 h-16 rounded-full bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-2xl hover:bg-orange-600/30 transition-colors"
          aria-label="Love"
        >
          🔥
        </button>
      </div>

      <p className="text-center text-sm text-gray-400 mt-4">
        Or use keyboard: ← skip, → like, ↑ love
      </p>
    </div>
  )
}
