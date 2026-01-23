'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ResearchOutput,
  BrandAngle,
  RatedHook,
  OfferCoreOutput,
} from '@/lib/research/schemas'

interface OfferStepProps {
  research: ResearchOutput
  selectedAngles: BrandAngle[]
  ratedHooks: RatedHook[]
  onComplete: (offerCore: OfferCoreOutput) => void
  onBack: () => void
}

const loadingPhases = [
  { id: 'analyzing', label: 'Analyzing your audience psychographics...', icon: '🧠' },
  { id: 'extracting', label: 'Extracting emotional core...', icon: '💫' },
  { id: 'identifying', label: 'Identifying universal motivators...', icon: '🎯' },
  { id: 'crafting', label: 'Crafting your offer statement...', icon: '✨' },
  { id: 'generating', label: 'Generating program name options...', icon: '🏷️' },
]

const templateLabels: Record<string, string> = {
  superlative_mechanism: 'Superlative Mechanism',
  transformation: 'Transformation',
  problem_solution: 'Problem-Solution',
  identity: 'Identity',
  contrast: 'Contrast',
  result: 'Result',
}

export function OfferStep({
  research,
  selectedAngles,
  ratedHooks,
  onComplete,
  onBack,
}: OfferStepProps) {
  const [status, setStatus] = useState<'idle' | 'warning' | 'loading' | 'complete' | 'error'>(
    'idle'
  )
  const [currentPhase, setCurrentPhase] = useState(0)
  const [offerCore, setOfferCore] = useState<OfferCoreOutput | null>(null)
  const [error, setError] = useState<string | null>(null)

  const likedHooks = ratedHooks.filter((h) => h.rating === 'like')
  const lovedHooks = ratedHooks.filter((h) => h.rating === 'love')

  const handleActivate = () => {
    setStatus('warning')
  }

  const handleGenerate = async () => {
    setStatus('loading')
    setCurrentPhase(0)
    setError(null)

    // Progress through phases
    const phaseInterval = setInterval(() => {
      setCurrentPhase((prev) => {
        if (prev < loadingPhases.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 2000)

    try {
      const response = await fetch('/api/research/offer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          research,
          selectedAngles,
          lovedHooks,
          likedHooks,
        }),
      })

      clearInterval(phaseInterval)

      const data = await response.json()

      if (!response.ok) {
        const errorMsg = data.details
          ? `${data.error}: ${data.details}`
          : data.error || 'Failed to generate offer core'
        throw new Error(errorMsg)
      }

      setOfferCore(data.offerCore)
      onComplete(data.offerCore)
      setStatus('complete')
    } catch (err) {
      clearInterval(phaseInterval)
      setError(err instanceof Error ? err.message : 'Unknown error')
      setStatus('error')
    }
  }

  const downloadBrandPlaybook = (format: 'json' | 'txt') => {
    if (!offerCore) return

    if (format === 'json') {
      // Comprehensive brand playbook with all research data
      const data = {
        generatedAt: new Date().toISOString(),
        version: '1.0',

        // Section 1: Audience Research
        audienceResearch: {
          transformationJourney: {
            currentState: research.audienceState.currentState,
            desiredState: research.audienceState.desiredState,
          },
          urgencyGateway: research.urgencyGateway,
          painPoints: research.painPoints,
          languageMap: research.languageMap,
          congregationPoints: research.congregationPoints,
          competitiveLandscape: research.competitiveLandscape,
        },

        // Section 2: Brand Positioning
        brandPositioning: {
          selectedAngles: selectedAngles.map((angle) => ({
            name: angle.name,
            tagline: angle.tagline,
            targetPain: angle.targetPain,
            targetDesire: angle.targetDesire,
            tone: angle.tone,
            contentThemes: angle.contentThemes,
          })),
        },

        // Section 3: Content Hooks
        contentHooks: {
          lovedHooks: lovedHooks.map((h) => ({
            text: h.text,
            category: h.category,
          })),
          likedHooks: likedHooks.map((h) => ({
            text: h.text,
            category: h.category,
          })),
          totalRated: ratedHooks.length,
          summary: {
            loved: lovedHooks.length,
            liked: likedHooks.length,
            skipped: ratedHooks.filter((h) => h.rating === 'skip').length,
          },
        },

        // Section 4: Offer Core
        offerCore: {
          offerStatement: offerCore.offerStatement,
          benefits: offerCore.theOfferGivesYou,
          useCases: offerCore.youCanUseItTo,
          hiddenBenefits: offerCore.hiddenBenefits,
          programNameOptions: offerCore.programNameOptions,
        },

        // Usage instructions for AI tools
        _instructions:
          'Use this JSON to give AI tools (ChatGPT, Claude, etc.) full context about your brand. Paste the entire document or relevant sections when creating content, sales pages, or marketing materials.',
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `brand-playbook-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // Comprehensive text document
      const lines = [
        '╔═══════════════════════════════════════════════════════════════════════════╗',
        '║                                                                           ║',
        '║                    YOUR COMPLETE BRAND PLAYBOOK                           ║',
        '║                                                                           ║',
        '╚═══════════════════════════════════════════════════════════════════════════╝',
        '',
        '',
        '┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓',
        '┃  PART 1: AUDIENCE RESEARCH                                               ┃',
        '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛',
        '',
        '▸ THE TRANSFORMATION JOURNEY',
        '─────────────────────────────',
        '',
        'WHERE THEY ARE NOW:',
        research.audienceState.currentState,
        '',
        'WHERE THEY WANT TO BE:',
        research.audienceState.desiredState,
        '',
        '',
        '▸ THE #1 HEADACHE (Urgency Gateway)',
        '────────────────────────────────────',
        '',
        `Problem: ${research.urgencyGateway.problem}`,
        '',
        'What They\'ve Tried:',
        ...research.urgencyGateway.failedSolutions.map((s) => `  • ${s}`),
        '',
        `Aspirin Solution: ${research.urgencyGateway.aspirinSolution}`,
        '',
        '',
        '▸ VALIDATED PAIN POINTS',
        '────────────────────────',
        '',
        ...research.painPoints.flatMap((p, i) => [
          `${i + 1}. ${p.pain} (Severity: ${p.severity})`,
          `   Emotional Context: ${p.emotionalContext}`,
          ...(p.realQuotes.length > 0 ? [`   Quote: "${p.realQuotes[0]}"`] : []),
          '',
        ]),
        '',
        '▸ THEIR LANGUAGE MAP',
        '─────────────────────',
        '',
        'Pain Phrases (how they describe frustrations):',
        ...research.languageMap.painPhrases.map((p) => `  • "${p}"`),
        '',
        'Desire Phrases (how they describe what they want):',
        ...research.languageMap.desirePhrases.map((p) => `  • "${p}"`),
        '',
        'Search Phrases (what they Google):',
        ...research.languageMap.searchPhrases.map((p) => `  • "${p}"`),
        '',
        'Emotional Triggers:',
        ...research.languageMap.emotionalTriggers.map((t) => `  • ${t}`),
        '',
        '',
        '▸ WHERE THEY GATHER',
        '────────────────────',
        '',
        'Subreddits:',
        ...research.congregationPoints.subreddits.map((s) => `  • r/${s.name} (${s.subscribers} members) - ${s.relevance}`),
        '',
        'YouTube Channels:',
        ...research.congregationPoints.youtubeChannels.map((c) => `  • ${c.name} (${c.subscribers})`),
        '',
        'Podcasts:',
        ...research.congregationPoints.podcasts.map((p) => `  • ${p}`),
        '',
        'Influencers:',
        ...research.congregationPoints.influencers.map((i) => `  • ${i}`),
        '',
        '',
        '▸ COMPETITIVE LANDSCAPE',
        '─────────────────────────',
        '',
        'Existing Solutions:',
        ...research.competitiveLandscape.existingSolutions.map((s) => `  • ${s.name}: ${s.positioning}`),
        '',
        'Market Gaps:',
        ...research.competitiveLandscape.marketGaps.map((g) => `  • ${g}`),
        '',
        'Positioning Opportunities:',
        ...research.competitiveLandscape.positioningOpportunities.map((o) => `  • ${o}`),
        '',
        '',
        '┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓',
        '┃  PART 2: BRAND POSITIONING                                               ┃',
        '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛',
        '',
        '▸ YOUR SELECTED BRAND ANGLES',
        '─────────────────────────────',
        '',
        ...selectedAngles.flatMap((angle) => [
          `★ ${angle.name}`,
          `  "${angle.tagline}"`,
          '',
          `  Addresses: ${angle.targetPain}`,
          `  Fulfills: ${angle.targetDesire}`,
          `  Tone: ${angle.tone}`,
          `  Content Themes: ${angle.contentThemes.join(', ')}`,
          '',
        ]),
        '',
        '',
        '┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓',
        '┃  PART 3: CONTENT HOOKS                                                   ┃',
        '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛',
        '',
        `You rated ${ratedHooks.length} hooks: ${lovedHooks.length} loved, ${likedHooks.length} liked`,
        '',
        '▸ YOUR FIRE HOOKS (Loved)',
        '──────────────────────────',
        '',
        ...lovedHooks.map((h) => `🔥 "${h.text}" [${h.category}]`),
        '',
        '',
        '▸ YOUR LIKED HOOKS',
        '───────────────────',
        '',
        ...likedHooks.map((h) => `❤️ "${h.text}" [${h.category}]`),
        '',
        '',
        '┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓',
        '┃  PART 4: OFFER CORE                                                      ┃',
        '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛',
        '',
        '▸ YOUR OFFER STATEMENT',
        '───────────────────────',
        '',
        offerCore.offerStatement.finalStatement,
        '',
        `Emotional Core: ${offerCore.offerStatement.emotionalCore}`,
        `Universal Motivators: ${offerCore.offerStatement.universalMotivatorsUsed.join(', ')}`,
        `Template: ${templateLabels[offerCore.offerStatement.templateUsed] || offerCore.offerStatement.templateUsed}`,
        '',
        '',
        '▸ THE OFFER GIVES YOU',
        '──────────────────────',
        '',
        ...offerCore.theOfferGivesYou.map((b) => `  ✓ ${b}`),
        '',
        '',
        '▸ YOU CAN USE IT TO',
        '────────────────────',
        '',
        ...offerCore.youCanUseItTo.map((u) => `  → ${u}`),
        '',
        '',
        '▸ HIDDEN BENEFITS',
        '──────────────────',
        '',
        ...offerCore.hiddenBenefits.map((h) => `  ★ ${h}`),
        '',
        '',
        '▸ PROGRAM NAME OPTIONS',
        '───────────────────────',
        '',
        ...offerCore.programNameOptions.flatMap((p) => [
          `  ◆ ${p.name}`,
          `    Mechanism: ${p.uniqueMechanism}`,
          `    Why it works: ${p.rationale}`,
          '',
        ]),
        '',
        '',
        '╔═══════════════════════════════════════════════════════════════════════════╗',
        '║                                                                           ║',
        `║  Generated: ${new Date().toISOString()}                        ║`,
        '║  Use this playbook to inform all your brand content and messaging.       ║',
        '║                                                                           ║',
        '╚═══════════════════════════════════════════════════════════════════════════╝',
      ]

      const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `brand-playbook-${new Date().toISOString().split('T')[0]}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  // Idle state - show the electric button
  if (status === 'idle') {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#243351] rounded-xl p-8 border border-white/10 text-center"
        >
          <div className="text-6xl mb-6">⚡</div>
          <h2 className="text-2xl font-bold text-white mb-4">Ready for the Next Level?</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            You've discovered your audience and crafted your hooks. Now it's time to define
            the emotional core of your brand - the foundation for everything you'll create.
          </p>

          <button
            onClick={handleActivate}
            className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-xl font-bold text-white text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(251,146,60,0.5)]"
          >
            <span className="relative z-10">⚡ Activate the Heart of Your Brand</span>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <button
            onClick={onBack}
            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Playbook
          </button>
        </motion.div>
      </div>
    )
  }

  // Warning modal
  if (status === 'warning') {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#243351] rounded-xl border-2 border-yellow-500/50 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-6 py-4 border-b border-yellow-500/30">
            <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
              <span>⚡</span> You're About to Define Your Brand's Core
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <p className="text-gray-300 leading-relaxed">
              Everything you create from here forward - your copy, content, and sales pages
              - will be built on what we're about to generate.
            </p>

            <div className="space-y-3">
              <p className="text-white font-medium">This includes:</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">✦</span>
                  Your <strong className="text-white">Offer Statement</strong> (the emotional
                  core)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">✦</span>
                  Your <strong className="text-white">Benefit Bullets</strong> (what they get)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">✦</span>
                  Your <strong className="text-white">Use Cases</strong> (what they can do with
                  it)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">✦</span>
                  <strong className="text-white">Hidden Benefits</strong> (unexpected
                  transformations)
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-yellow-400">✦</span>
                  <strong className="text-white">Program Name Options</strong> (with unique
                  mechanism)
                </li>
              </ul>
            </div>

            <p className="text-gray-400 italic text-sm">
              Once you see it, you can't unsee it.
            </p>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStatus('idle')}
                className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold rounded-lg transition-all"
              >
                ⚡ Generate My Offer Core
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Loading state
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
              ⚡
            </motion.div>
            <h2 className="text-xl font-semibold text-white">Generating Your Offer Core</h2>
          </div>

          <div className="space-y-4">
            {loadingPhases.map((phase, index) => {
              const isActive = index === currentPhase
              const isComplete = index < currentPhase

              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    isActive
                      ? 'bg-yellow-500/20 border-2 border-yellow-500/50'
                      : isComplete
                        ? 'bg-green-500/10 border-2 border-green-500/30'
                        : 'bg-[#1a2744] border-2 border-transparent'
                  }`}
                >
                  <span className="text-2xl">{phase.icon}</span>
                  <span
                    className={`font-medium ${
                      isActive
                        ? 'text-yellow-400'
                        : isComplete
                          ? 'text-green-400'
                          : 'text-gray-400'
                    }`}
                  >
                    {phase.label}
                  </span>
                  {isComplete && <span className="ml-auto text-green-400">✓</span>}
                  {isActive && (
                    <motion.span
                      className="ml-auto text-yellow-400"
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

  // Error state
  if (status === 'error') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#243351] rounded-xl p-8 border border-white/10 text-center">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-red-400 mb-2">Generation Failed</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => setStatus('warning')}
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
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="text-5xl mb-4">⚡</div>
        <h2 className="text-2xl font-bold text-white">Your Offer Core</h2>
        <p className="text-gray-400">The emotional foundation of your brand</p>
      </motion.div>

      {/* Download buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex justify-end gap-3 mb-6"
      >
        <button
          onClick={() => downloadBrandPlaybook('json')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-brave-500)] hover:text-[var(--color-brave-400)] transition-colors"
        >
          <span>📥</span> Download Playbook JSON (for AI)
        </button>
        <button
          onClick={() => downloadBrandPlaybook('txt')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[var(--color-brave-500)] hover:text-[var(--color-brave-400)] transition-colors"
        >
          <span>📄</span> Download Full Playbook
        </button>
      </motion.div>

      {offerCore && (
        <div className="space-y-6">
          {/* Offer Statement - Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-xl border border-yellow-500/30 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-yellow-500/20 flex items-center gap-3">
              <span className="text-2xl">✨</span>
              <h3 className="text-lg font-semibold text-white">Your Offer Statement</h3>
              <span className="ml-auto px-3 py-1 bg-yellow-500/30 text-yellow-300 text-xs rounded-full">
                {templateLabels[offerCore.offerStatement.templateUsed] ||
                  offerCore.offerStatement.templateUsed}
              </span>
            </div>
            <div className="p-6">
              <p className="text-xl text-white font-medium leading-relaxed">
                "{offerCore.offerStatement.finalStatement}"
              </p>
              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                    Emotional Core
                  </p>
                  <p className="text-white">{offerCore.offerStatement.emotionalCore}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-lg">
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                    Universal Motivators
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {offerCore.offerStatement.universalMotivatorsUsed.map((m, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full capitalize"
                      >
                        {m.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* The Offer Gives You */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#243351] rounded-xl border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <span className="text-2xl">🎁</span>
              <h3 className="text-lg font-semibold text-white">The Offer Gives You</h3>
            </div>
            <div className="p-6 space-y-3">
              {offerCore.theOfferGivesYou.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-[#1a2744] rounded-lg"
                >
                  <span className="text-green-400 mt-0.5">✓</span>
                  <p className="text-white">{benefit}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* You Can Use It To */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-[#243351] rounded-xl border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <span className="text-2xl">🚀</span>
              <h3 className="text-lg font-semibold text-white">You Can Use It To</h3>
            </div>
            <div className="p-6 space-y-3">
              {offerCore.youCanUseItTo.map((useCase, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-[#1a2744] rounded-lg"
                >
                  <span className="text-[var(--color-brave-500)] mt-0.5">→</span>
                  <p className="text-white">{useCase}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hidden Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#243351] rounded-xl border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <span className="text-2xl">💎</span>
              <h3 className="text-lg font-semibold text-white">Hidden Benefits</h3>
            </div>
            <div className="p-6 space-y-3">
              {offerCore.hiddenBenefits.map((benefit, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg border-l-4 border-l-purple-500"
                >
                  <p className="text-white">{benefit}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Program Name Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-[#243351] rounded-xl border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
              <span className="text-2xl">🏷️</span>
              <h3 className="text-lg font-semibold text-white">Program Name Options</h3>
            </div>
            <div className="p-6 space-y-4">
              {offerCore.programNameOptions.map((option, i) => (
                <div
                  key={i}
                  className="p-4 bg-[#1a2744] rounded-lg border border-white/5"
                >
                  <p className="text-xl font-bold text-[var(--color-brave-500)] mb-2">
                    {option.name}
                  </p>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-400">
                      <span className="text-gray-300 font-medium">Mechanism:</span>{' '}
                      {option.uniqueMechanism}
                    </p>
                    <p className="text-gray-400">
                      <span className="text-gray-300 font-medium">Why it works:</span>{' '}
                      {option.rationale}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Usage Guide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#1a2744] rounded-xl p-6 border border-white/5"
          >
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <span>💡</span> How to Use This
            </h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Download the JSON version and use it to give any AI tool context about your
              brand's emotional core. Paste it into ChatGPT, Claude, or any writing assistant
              when creating copy, content, or sales pages. The AI will understand your
              audience's psychology and speak their language.
            </p>
          </motion.div>
        </div>
      )}

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 pt-6 border-t border-white/10"
      >
        <button
          onClick={onBack}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          ← Back to Playbook
        </button>
      </motion.div>
    </div>
  )
}
