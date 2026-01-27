'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ResearchOutput, FocusGroupInsights, MarketingRecommendation } from '@/lib/research/schemas'

interface ResearchStepProps {
  audienceProfile: Record<string, unknown>
  focusGroupInsights?: FocusGroupInsights | null
  businessContext?: string | null
  onComplete: (research: ResearchOutput) => void
}

const discoveryPhases = [
  { id: 'state', label: 'Mapping their transformation journey...', icon: '🗺️' },
  { id: 'urgency', label: 'Finding their #1 headache...', icon: '🔥' },
  { id: 'pain', label: 'Validating pain points...', icon: '💢' },
  { id: 'language', label: 'Mapping their language...', icon: '💬' },
  { id: 'communities', label: 'Discovering where they gather...', icon: '👥' },
  { id: 'competitors', label: 'Analyzing the landscape...', icon: '🎯' },
]

export function ResearchStep({ audienceProfile, focusGroupInsights, businessContext, onComplete }: ResearchStepProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'complete' | 'error'>('idle')
  const [currentPhase, setCurrentPhase] = useState(0)
  const [research, setResearch] = useState<ResearchOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  // Auto-start research when component mounts
  useEffect(() => {
    if (status === 'idle' && audienceProfile) {
      startResearch()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (status === 'loading') {
      const interval = setInterval(() => {
        setCurrentPhase((prev) => {
          if (prev < discoveryPhases.length - 1) {
            return prev + 1
          }
          return prev
        })
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [status])

  const startResearch = async () => {
    setStatus('loading')
    setCurrentPhase(0)
    setError(null)

    try {
      const response = await fetch('/api/research/direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audienceProfile,
          focusGroupInsights: focusGroupInsights || undefined,
          businessContext: businessContext || undefined,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Research failed')
      }

      setResearch(data.research)
      setStatus('complete')
      setCurrentPhase(discoveryPhases.length)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    )
  }

  if (status === 'idle') {
    // If we have a profile, auto-start will trigger - show loading immediately
    if (audienceProfile) {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#243351] rounded-xl p-8 border border-white/10">
            <div className="text-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block text-5xl mb-4"
              >
                🔍
              </motion.div>
              <h2 className="text-xl font-semibold text-white">Starting Research...</h2>
            </div>
          </div>
        </div>
      )
    }

    // No profile - show manual start (fallback)
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#243351] rounded-xl p-8 border border-white/10 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Let's Deep Dive Into Your Audience</h2>
          <p className="text-gray-400 mb-8">
            We'll search the web to find real conversations, communities, and insights about your
            target audience.
          </p>
          <button
            onClick={startResearch}
            className="px-8 py-3 bg-[var(--color-brave-500)] hover:bg-[var(--color-brave-600)] text-[#1a2744] font-semibold rounded-lg transition-colors"
          >
            Start Research
          </button>
        </div>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#243351] rounded-xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="inline-block text-5xl mb-4"
            >
              🔍
            </motion.div>
            <h2 className="text-xl font-semibold text-white">Researching Your Audience</h2>
          </div>

          <div className="space-y-4">
            {discoveryPhases.map((phase, index) => {
              const isActive = index === currentPhase
              const isComplete = index < currentPhase

              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    isActive
                      ? 'bg-[var(--color-brave-600)]/20 border-2 border-[var(--color-brave-500)]'
                      : isComplete
                        ? 'bg-[var(--color-brave-600)]/10 border-2 border-[var(--color-brave-600)]'
                        : 'bg-[#1a2744] border-2 border-transparent'
                  }`}
                >
                  <span className="text-2xl">{phase.icon}</span>
                  <span
                    className={`font-medium ${
                      isActive ? 'text-[var(--color-brave-500)]' : isComplete ? 'text-[var(--color-brave-500)]' : 'text-gray-400'
                    }`}
                  >
                    {phase.label}
                  </span>
                  {isComplete && <span className="ml-auto text-[var(--color-brave-500)]">✓</span>}
                  {isActive && (
                    <motion.span
                      className="ml-auto text-[var(--color-brave-500)]"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      ...
                    </motion.span>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#243351] rounded-xl p-8 border border-white/10 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">Research Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={startResearch}
            className="px-6 py-2 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Complete state - show results
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-white">Research Complete!</h2>
        <p className="text-gray-400">Here's what we discovered about your audience</p>
      </motion.div>

      {research && (
        <>
          {/* Transformation Journey - Current State vs Desired State */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-[#243351] rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🗺️</span> The Transformation Journey
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {/* Current State */}
                <div className="bg-gray-500/10 p-4 rounded-lg border border-gray-500/30 relative">
                  <div className="absolute -top-3 left-4 bg-[#243351] px-2">
                    <span className="text-sm font-medium text-gray-400">WHERE THEY ARE NOW</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-gray-300 leading-relaxed">{research.audienceState.currentState}</p>
                  </div>
                </div>
                {/* Desired State */}
                <div className="bg-emerald-500/10 p-4 rounded-lg border border-emerald-500/30 relative">
                  <div className="absolute -top-3 left-4 bg-[#243351] px-2">
                    <span className="text-sm font-medium text-emerald-400">WHERE THEY WANT TO BE</span>
                  </div>
                  <div className="pt-2">
                    <p className="text-emerald-200 leading-relaxed">{research.audienceState.desiredState}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Urgency Gateway - Always expanded */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="bg-[#243351] rounded-xl p-6 border border-white/10 border-l-4 border-l-red-500">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🔥</span> The #1 Headache
              </h3>
              <p className="text-lg font-medium text-white mb-4">
                {research.urgencyGateway.problem}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                  <h4 className="font-medium text-red-400 mb-2">Why It's Urgent</h4>
                  <p className="text-gray-300">{research.urgencyGateway.whyUrgent}</p>
                </div>
                <div className="bg-[var(--color-brave-500)]/10 p-4 rounded-lg border border-[var(--color-brave-500)]/20">
                  <h4 className="font-medium text-[var(--color-brave-600)] mb-2">The Aspirin</h4>
                  <p className="text-gray-300">{research.urgencyGateway.aspirinSolution}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Marketing Recommendation - Prominent Card */}
          {research.marketingRecommendation && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
              <div className="bg-gradient-to-br from-[#243351] to-[#1a2744] rounded-xl p-6 border-2 border-[var(--color-brave-500)]/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-[var(--color-brave-500)]/20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Recommended Marketing Focus</h3>
                    <p className="text-sm text-gray-400">Where to reach your audience</p>
                  </div>
                </div>

                {/* Primary Platform - Highlighted */}
                <div className="bg-[var(--color-brave-500)]/10 rounded-lg p-4 border border-[var(--color-brave-500)]/30 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[var(--color-brave-500)] uppercase tracking-wide">
                      Primary Platform
                    </span>
                    <span className="px-2 py-0.5 bg-[var(--color-brave-500)]/20 text-[var(--color-brave-500)] text-xs font-medium rounded">
                      FOCUS HERE FIRST
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {research.marketingRecommendation.primaryPlatform.platform}
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    {research.marketingRecommendation.primaryPlatform.reasoning}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {research.marketingRecommendation.primaryPlatform.contentFormats.map((format, i) => (
                      <span
                        key={i}
                        className="bg-[var(--color-brave-600)]/30 text-[var(--color-brave-500)] px-2 py-1 rounded text-xs font-medium"
                      >
                        {format}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Posting cadence: {research.marketingRecommendation.primaryPlatform.postingCadence}
                  </p>
                </div>

                {/* Secondary Platforms */}
                {research.marketingRecommendation.secondaryPlatforms.length > 0 && (
                  <div className="grid gap-3 md:grid-cols-2 mb-4">
                    {research.marketingRecommendation.secondaryPlatforms.map((platform, i) => (
                      <div key={i} className="bg-[#1a2744] rounded-lg p-3 border border-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-white">{platform.platform}</span>
                          <span className="text-xs text-gray-400">Secondary</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{platform.reasoning}</p>
                        <div className="flex flex-wrap gap-1">
                          {platform.contentFormats.slice(0, 2).map((format, j) => (
                            <span key={j} className="bg-gray-600/30 text-gray-300 px-2 py-0.5 rounded text-xs">
                              {format}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Win */}
                <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⚡</span>
                    <div>
                      <h5 className="font-medium text-emerald-400 mb-1">Quick Win (Do This Week)</h5>
                      <p className="text-gray-300 text-sm">{research.marketingRecommendation.quickWin}</p>
                    </div>
                  </div>
                </div>

                {/* Content Strategy Tips */}
                <div>
                  <h5 className="font-medium text-gray-300 mb-2 flex items-center gap-2">
                    <span>💡</span> Content Strategy Tips
                  </h5>
                  <ul className="space-y-2">
                    {research.marketingRecommendation.contentStrategyTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-[var(--color-brave-500)] mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Language Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              className="bg-[#243351] rounded-xl border border-white/10 cursor-pointer"
              onClick={() => toggleSection('language')}
            >
              <div className="p-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>💬</span> Their Language
                </h3>
                <span className="text-gray-400">{expandedSections.includes('language') ? '−' : '+'}</span>
              </div>
              <AnimatePresence>
                {expandedSections.includes('language') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium text-gray-300 mb-2">Pain Phrases</h4>
                          <div className="flex flex-wrap gap-2">
                            {research.languageMap.painPhrases.map((phrase, i) => (
                              <span
                                key={i}
                                className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-sm border border-red-500/30"
                              >
                                "{phrase}"
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-300 mb-2">Desire Phrases</h4>
                          <div className="flex flex-wrap gap-2">
                            {research.languageMap.desirePhrases.map((phrase, i) => (
                              <span
                                key={i}
                                className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm border border-emerald-500/30"
                              >
                                "{phrase}"
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Communities - Where They Gather */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="bg-[#243351] rounded-xl border border-white/10 cursor-pointer"
              onClick={() => toggleSection('communities')}
            >
              <div className="p-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>👥</span> Where They Gather
                </h3>
                <span className="text-gray-400">{expandedSections.includes('communities') ? '−' : '+'}</span>
              </div>
              <AnimatePresence>
                {expandedSections.includes('communities') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-6">
                      {/* Subreddits */}
                      {research.congregationPoints.subreddits.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                            <span className="text-orange-500">🔴</span> Subreddits
                          </h4>
                          <div className="grid gap-2 md:grid-cols-2">
                            {research.congregationPoints.subreddits.map((sub, i) => (
                              <div key={i} className="bg-orange-500/10 p-3 rounded-lg border border-orange-500/20">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-orange-300">{sub.name}</span>
                                  <span className="text-orange-400/70 text-sm">
                                    {sub.subscribers}
                                  </span>
                                </div>
                                <p className="text-gray-400 text-sm mt-1">{sub.relevance}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* YouTube Channels */}
                      {research.congregationPoints.youtubeChannels.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                            <span className="text-red-500">▶️</span> YouTube Channels
                          </h4>
                          <div className="grid gap-2 md:grid-cols-2">
                            {research.congregationPoints.youtubeChannels.map((channel, i) => (
                              <div key={i} className="bg-red-500/10 p-3 rounded-lg border border-red-500/20 flex items-center justify-between">
                                <span className="font-medium text-red-300">{channel.name}</span>
                                <span className="text-red-400/70 text-sm">{channel.subscribers}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Podcasts */}
                      {research.congregationPoints.podcasts.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                            <span className="text-purple-500">🎙️</span> Podcasts
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {research.congregationPoints.podcasts.map((podcast, i) => (
                              <span
                                key={i}
                                className="bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm border border-purple-500/30"
                              >
                                {podcast}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Other Communities */}
                      {research.congregationPoints.otherCommunities.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                            <span className="text-blue-500">💬</span> Other Communities
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {research.congregationPoints.otherCommunities.map((community, i) => (
                              <span
                                key={i}
                                className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30"
                              >
                                {community}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Influencers */}
                      {research.congregationPoints.influencers.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-300 mb-3 flex items-center gap-2">
                            <span className="text-pink-500">⭐</span> Influencers & Thought Leaders
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {research.congregationPoints.influencers.map((name, i) => (
                              <span
                                key={i}
                                className="bg-pink-500/20 text-pink-300 px-3 py-1 rounded-full text-sm border border-pink-500/30"
                              >
                                {name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Pain Points */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div
              className="bg-[#243351] rounded-xl border border-white/10 cursor-pointer"
              onClick={() => toggleSection('pain')}
            >
              <div className="p-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>💢</span> Pain Points ({research.painPoints.length})
                </h3>
                <span className="text-gray-400">{expandedSections.includes('pain') ? '−' : '+'}</span>
              </div>
              <AnimatePresence>
                {expandedSections.includes('pain') && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-4">
                      {research.painPoints.map((point, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-lg border-l-4 ${
                            point.severity === 'critical'
                              ? 'bg-red-500/10 border-l-red-500'
                              : point.severity === 'moderate'
                                ? 'bg-yellow-500/10 border-l-yellow-500'
                                : 'bg-gray-500/10 border-l-gray-500'
                          }`}
                        >
                          <p className="font-medium text-white">{point.pain}</p>
                          <p className="text-gray-400 text-sm mt-1">{point.emotionalContext}</p>
                          {point.realQuotes.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-400 mb-1">Real quotes:</p>
                              {point.realQuotes.slice(0, 2).map((quote, j) => (
                                <p key={j} className="text-sm italic text-gray-400">
                                  "{quote}"
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-6"
          >
            <button
              onClick={() => onComplete(research)}
              className="px-8 py-3 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-700)] text-white font-medium rounded-lg transition-colors"
            >
              Continue to Brand Angles →
            </button>
          </motion.div>
        </>
      )}
    </div>
  )
}
