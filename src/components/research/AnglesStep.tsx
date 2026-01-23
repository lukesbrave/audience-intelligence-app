'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BrandAngle, ResearchOutput } from '@/lib/research/schemas'

interface AnglesStepProps {
  research: ResearchOutput
  onComplete: (selectedAngles: BrandAngle[]) => void
  onBack: () => void
}

export function AnglesStep({ research, onComplete, onBack }: AnglesStepProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'revealing' | 'complete'>('idle')
  const [angles, setAngles] = useState<BrandAngle[]>([])
  const [revealedCount, setRevealedCount] = useState(0)
  const [selectedAngles, setSelectedAngles] = useState<BrandAngle[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateAngles()
  }, [])

  useEffect(() => {
    if (status === 'revealing' && revealedCount < angles.length) {
      const timer = setTimeout(() => {
        setRevealedCount((prev) => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    } else if (status === 'revealing' && revealedCount === angles.length) {
      setStatus('complete')
    }
  }, [status, revealedCount, angles.length])

  const generateAngles = async () => {
    setStatus('loading')
    setError(null)

    try {
      const response = await fetch('/api/research/angles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ research }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate angles')
      }

      setAngles(data.angles)
      setStatus('revealing')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('idle')
    }
  }

  const toggleAngle = (angle: BrandAngle) => {
    setSelectedAngles((prev) => {
      const isSelected = prev.some((a) => a.name === angle.name)
      if (isSelected) {
        return prev.filter((a) => a.name !== angle.name)
      }
      return [...prev, angle]
    })
  }

  const isSelected = (angle: BrandAngle) => selectedAngles.some((a) => a.name === angle.name)

  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#243351] rounded-xl p-8 border border-white/10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block text-5xl mb-4"
          >
            🎯
          </motion.div>
          <h2 className="text-xl font-semibold text-white">Crafting Your Brand Angles</h2>
          <p className="text-gray-400 mt-2">Analyzing your research to find unique positions...</p>
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
            onClick={generateAngles}
            className="px-6 py-2 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-2xl font-bold text-white">Discover Your Unique Edge</h2>
        <p className="text-gray-400 mt-2">
          {status === 'revealing'
            ? 'Unlocking your unique positions...'
            : 'Select the angle(s) that resonate with you'}
        </p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <AnimatePresence>
          {angles.slice(0, revealedCount).map((angle, index) => (
            <motion.div
              key={angle.name}
              initial={{ opacity: 0, rotateY: -90, scale: 0.8 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1 }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 100,
              }}
            >
              <div
                className={`bg-[#243351] rounded-xl p-6 border cursor-pointer transition-all duration-300 h-full ${
                  isSelected(angle)
                    ? 'border-[var(--color-brave-500)] ring-2 ring-[var(--color-brave-500)]/50 bg-[var(--color-brave-500)]/10'
                    : 'border-white/10 hover:border-white/30'
                }`}
                onClick={() => status === 'complete' && toggleAngle(angle)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">{angle.name}</h3>
                  {isSelected(angle) && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-[var(--color-brave-600)] text-2xl"
                    >
                      ✓
                    </motion.span>
                  )}
                </div>

                <p className="text-[var(--color-brave-500)] font-medium text-lg mb-4">"{angle.tagline}"</p>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-red-400">💢</span>
                    <div>
                      <span className="font-medium text-gray-300">Addresses:</span>
                      <span className="text-gray-300 ml-1">{angle.targetPain}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-[var(--color-brave-600)]">✨</span>
                    <div>
                      <span className="font-medium text-gray-300">Fulfills:</span>
                      <span className="text-gray-300 ml-1">{angle.targetDesire}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="text-purple-400">🎭</span>
                    <div>
                      <span className="font-medium text-gray-300">Tone:</span>
                      <span className="text-gray-300 ml-1">{angle.tone}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-2">Content themes:</p>
                  <div className="flex flex-wrap gap-2">
                    {angle.contentThemes.slice(0, 3).map((theme, i) => (
                      <span
                        key={i}
                        className="bg-white/10 text-gray-300 px-3 py-1 rounded text-sm"
                      >
                        {theme}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Placeholder cards for unrevealed angles */}
        {status === 'revealing' &&
          Array.from({ length: angles.length - revealedCount }).map((_, i) => (
            <motion.div
              key={`placeholder-${i}`}
              className="h-64 bg-[#243351] border border-white/10 rounded-xl flex items-center justify-center"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="text-4xl">🔒</span>
            </motion.div>
          ))}
      </div>

      {status === 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between items-center mt-8 pt-6 border-t border-white/10"
        >
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Research
          </button>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">
              {selectedAngles.length === 0
                ? 'Select at least one angle'
                : `${selectedAngles.length} angle${selectedAngles.length > 1 ? 's' : ''} selected`}
            </span>
            <button
              onClick={() => onComplete(selectedAngles)}
              disabled={selectedAngles.length === 0}
              className="px-6 py-2 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              Generate Hooks →
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
