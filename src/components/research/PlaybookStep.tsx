'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { ResearchOutput, BrandAngle, RatedHook } from '@/lib/research/schemas'

interface PlaybookStepProps {
  research: ResearchOutput
  selectedAngles: BrandAngle[]
  ratedHooks: RatedHook[]
  onBack: () => void
  onRestart: () => void
  onOfferCore: () => void
}

export function PlaybookStep({
  research,
  selectedAngles,
  ratedHooks,
  onBack,
  onRestart,
  onOfferCore,
}: PlaybookStepProps) {
  const [status, setStatus] = useState<'generating' | 'complete'>('generating')
  const [expandedAngle, setExpandedAngle] = useState<number | null>(null)
  const [showAllPainPoints, setShowAllPainPoints] = useState(false)

  const likedHooks = ratedHooks.filter((h) => h.rating === 'like')
  const lovedHooks = ratedHooks.filter((h) => h.rating === 'love')
  const allSavedHooks = [...lovedHooks, ...likedHooks]

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus('complete')
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const downloadPlaybook = () => {
    const playbook = {
      generatedAt: new Date().toISOString(),
      urgencyGateway: research.urgencyGateway,
      painPoints: research.painPoints,
      languageMap: research.languageMap,
      selectedAngles: selectedAngles,
      fireHooks: lovedHooks.map(h => h.text),
      likedHooks: likedHooks.map(h => h.text),
    }

    const blob = new Blob([JSON.stringify(playbook, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audience-playbook-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (status === 'generating') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#141414] rounded-xl p-8 border border-white/10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="inline-block text-5xl mb-4"
          >
            📋
          </motion.div>
          <h2 className="text-xl font-semibold text-white">Creating Your Playbook</h2>
          <p className="text-white/60 mt-2">Compiling your research, angles, and hooks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Floating Action Button for Offer Core */}
      <motion.button
        onClick={onOfferCore}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50 group"
      >
        {/* Pulse rings - using CSS animation for smooth looping */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-fab-pulse" />
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 animate-fab-pulse-delayed" />

        {/* Button */}
        <span className="relative flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all">
          <span className="text-xl">⚡</span>
          <span className="hidden sm:inline">Click to go deeper</span>
        </span>
      </motion.button>

      {/* Achievement Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[var(--color-brave-500)] rounded-2xl p-8 text-center mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring' }}
          className="text-6xl mb-4"
        >
          🏆
        </motion.div>
        <h2 className="text-3xl font-bold mb-2 text-[var(--color-brave-primary)]">
          Achievement Unlocked!
        </h2>
        <p className="text-xl font-medium text-[var(--color-brave-primary)]">Audience Expert</p>
        <p className="text-base text-[var(--color-brave-primary)]/80 mt-2">
          You've completed your audience intelligence journey
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#141414] rounded-xl p-5 border border-white/10 text-center"
        >
          <div className="text-3xl mb-2">🔍</div>
          <div className="text-3xl font-bold text-[var(--color-brave-500)]">
            {research.painPoints.length}
          </div>
          <p className="text-sm text-white/60 mt-1">Pain Points</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-[#141414] rounded-xl p-5 border border-white/10 text-center"
        >
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-3xl font-bold text-[var(--color-brave-500)]">
            {selectedAngles.length}
          </div>
          <p className="text-sm text-white/60 mt-1">Brand Angles</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#141414] rounded-xl p-5 border border-white/10 text-center"
        >
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-3xl font-bold text-orange-400">{lovedHooks.length}</div>
          <p className="text-sm text-white/60 mt-1">Fire Hooks</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-[#141414] rounded-xl p-5 border border-white/10 text-center"
        >
          <div className="text-3xl mb-2">❤️</div>
          <div className="text-3xl font-bold text-pink-400">{likedHooks.length}</div>
          <p className="text-sm text-white/60 mt-1">Liked Hooks</p>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-end mb-6">
        <button
          onClick={downloadPlaybook}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-brave-500)] hover:text-[var(--color-brave-400)] transition-colors"
        >
          <span>📥</span> Download Playbook
        </button>
      </div>

      {/* Main Playbook Content */}
      <div className="space-y-6">
        {/* The #1 Headache */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#141414] rounded-xl border border-white/10 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <h3 className="text-lg font-semibold text-white">The #1 Headache</h3>
          </div>
          <div className="p-6">
            <p className="text-lg text-white leading-relaxed">{research.urgencyGateway.problem}</p>
            <div className="mt-4 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
              <p className="text-sm font-medium text-red-300 mb-2">Why it's urgent:</p>
              <p className="text-red-200/90">{research.urgencyGateway.whyUrgent}</p>
            </div>
          </div>
        </motion.div>

        {/* Pain Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#141414] rounded-xl border border-white/10 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">😫</span>
              <h3 className="text-lg font-semibold text-white">Pain Points ({research.painPoints.length})</h3>
            </div>
            {research.painPoints.length > 3 && (
              <button
                onClick={() => setShowAllPainPoints(!showAllPainPoints)}
                className="text-sm text-[var(--color-brave-500)] hover:text-[var(--color-brave-400)] transition-colors"
              >
                {showAllPainPoints ? 'Show less' : `Show all ${research.painPoints.length}`}
              </button>
            )}
          </div>
          <div className="p-6 space-y-3">
            {(showAllPainPoints ? research.painPoints : research.painPoints.slice(0, 3)).map(
              (point, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg"
                >
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      point.severity === 'critical'
                        ? 'bg-red-500/20 text-red-300'
                        : point.severity === 'moderate'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-gray-500/20 text-white/70'
                    }`}
                  >
                    {point.severity}
                  </span>
                  <div className="flex-1">
                    <p className="text-white font-medium">{point.pain}</p>
                    <p className="text-sm text-white/60 mt-1">{point.emotionalContext}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>

        {/* Brand Angles - Expandable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#141414] rounded-xl border border-white/10 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <h3 className="text-lg font-semibold text-white">Your Brand Angles</h3>
          </div>
          <div className="p-6 space-y-4">
            {selectedAngles.map((angle, i) => (
              <div key={i} className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedAngle(expandedAngle === i ? null : i)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="text-left">
                    <p className="text-xl font-bold text-[var(--color-brave-500)]">{angle.name}</p>
                    <p className="text-white/60 mt-1">"{angle.tagline}"</p>
                  </div>
                  <span className="text-sm text-[var(--color-brave-500)] hover:text-[var(--color-brave-400)]">
                    {expandedAngle === i ? 'Hide details' : 'Show details'}
                  </span>
                </button>
                <AnimatePresence>
                  {expandedAngle === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-[#0a0a0a] p-4 rounded-lg">
                            <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
                              Target Pain
                            </p>
                            <p className="text-white">{angle.targetPain}</p>
                          </div>
                          <div className="bg-[#0a0a0a] p-4 rounded-lg">
                            <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
                              Target Desire
                            </p>
                            <p className="text-white">{angle.targetDesire}</p>
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded-lg">
                          <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
                            Tone & Voice
                          </p>
                          <p className="text-white">{angle.tone}</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded-lg">
                          <p className="text-xs uppercase tracking-wide text-white/50 mb-1">
                            Why It Works
                          </p>
                          <p className="text-white">{angle.whyItWorks}</p>
                        </div>
                        <div className="bg-[#0a0a0a] p-4 rounded-lg">
                          <p className="text-xs uppercase tracking-wide text-white/50 mb-2">
                            Content Themes
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {angle.contentThemes.map((theme, j) => (
                              <span
                                key={j}
                                className="bg-[var(--color-brave-500)]/20 text-[var(--color-brave-500)] px-3 py-1 rounded-full text-sm"
                              >
                                {theme}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fire Hooks */}
        {lovedHooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-[#141414] rounded-xl border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <span className="text-2xl">🔥</span>
              <h3 className="text-lg font-semibold text-white">Fire Hooks ({lovedHooks.length})</h3>
            </div>
            <div className="p-6 space-y-3">
              {lovedHooks.map((hook, i) => (
                <div
                  key={i}
                  className="p-4 bg-orange-500/10 rounded-lg border-l-4 border-l-orange-500"
                >
                  <p className="text-white font-medium leading-relaxed">"{hook.text}"</p>
                  <p className="text-sm text-orange-300/70 mt-2 capitalize">
                    {hook.category.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Liked Hooks */}
        {likedHooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#141414] rounded-xl border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <span className="text-2xl">❤️</span>
              <h3 className="text-lg font-semibold text-white">Liked Hooks ({likedHooks.length})</h3>
            </div>
            <div className="p-6 space-y-3">
              {likedHooks.map((hook, i) => (
                <div
                  key={i}
                  className="p-4 bg-pink-500/10 rounded-lg border-l-4 border-l-pink-400"
                >
                  <p className="text-white font-medium leading-relaxed">"{hook.text}"</p>
                  <p className="text-sm text-pink-300/70 mt-2 capitalize">
                    {hook.category.replace('_', ' ')}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Their Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-[#141414] rounded-xl border border-white/10 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
            <span className="text-2xl">💬</span>
            <h3 className="text-lg font-semibold text-white">Their Language</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm font-medium text-white/60 mb-3">Pain Phrases</p>
              <div className="flex flex-wrap gap-2">
                {research.languageMap.painPhrases.slice(0, 8).map((phrase, i) => (
                  <span
                    key={i}
                    className="bg-red-500/15 text-red-300 px-3 py-1.5 rounded-full text-sm"
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white/60 mb-3">Desire Phrases</p>
              <div className="flex flex-wrap gap-2">
                {research.languageMap.desirePhrases.slice(0, 8).map((phrase, i) => (
                  <span
                    key={i}
                    className="bg-green-500/15 text-green-300 px-3 py-1.5 rounded-full text-sm"
                  >
                    "{phrase}"
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Offer Core CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="mt-10 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl" />
        <div className="relative bg-gradient-to-r from-[#0a0a0a] via-[#141414] to-[#0a0a0a] rounded-2xl border border-yellow-500/30 p-8 text-center overflow-hidden">
          {/* Electric background effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-pulse" />
            <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-orange-400 to-transparent animate-pulse delay-75" />
            <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-yellow-400 to-transparent animate-pulse delay-150" />
          </div>

          <div className="relative z-10">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl mb-4"
            >
              ⚡
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Ready to Go Deeper?</h3>
            <p className="text-white/60 mb-6 max-w-md mx-auto">
              Your playbook is complete. Now unlock the emotional core of your brand -
              the foundation for all your future copy and content.
            </p>
            <motion.button
              onClick={onOfferCore}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative group px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-lg rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:shadow-orange-500/40"
            >
              {/* Pulse ring */}
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 animate-ping opacity-20" />
              <span className="relative flex items-center gap-2">
                <span>⚡</span>
                Activate the Heart of Your Brand
                <span>⚡</span>
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Footer Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center"
      >
        <button
          onClick={onBack}
          className="px-4 py-2 text-white/60 hover:text-white transition-colors"
        >
          ← Back to Hooks
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors"
        >
          Start New Research
        </button>
      </motion.div>
    </div>
  )
}
