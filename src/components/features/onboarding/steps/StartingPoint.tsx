'use client'

import { motion } from 'framer-motion'

interface StartingPointProps {
  email: string
  selectedPath: 'direct' | 'discovery' | null
  onEmailChange: (email: string) => void
  onSelect: (path: 'direct' | 'discovery') => void
  onNext: () => void
  onBack?: () => void
}

export default function StartingPoint({ selectedPath, onSelect, onNext, onBack }: StartingPointProps) {
  const canContinue = !!selectedPath

  return (
    <div className="min-h-[70vh] flex flex-col justify-center max-w-2xl mx-auto">
      {/* Path Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Do you know who you're here to serve?
        </h1>
        <p className="text-white/60 mb-8">
          Pick the path that fits where you're at right now.
        </p>

        {/* Side-by-side path cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Direct Path */}
          <motion.button
            onClick={() => onSelect('direct')}
            whileTap={{ scale: 0.98 }}
            className={`relative p-6 rounded-xl border-2 text-left transition-all duration-200 ${
              selectedPath === 'direct'
                ? 'bg-[var(--color-brave-600)]/20 border-[var(--color-brave-500)]'
                : 'bg-[#141414] border-white/10 hover:border-white/30 hover:bg-[#2a3d5f]'
            }`}
          >
            {selectedPath === 'direct' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 bg-[var(--color-brave-500)] rounded-full flex items-center justify-center"
              >
                <span className="text-[#0a0a0a] text-sm font-bold">✓</span>
              </motion.div>
            )}

            <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--color-brave-500)]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--color-brave-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Yes, I know my audience
            </h3>
            <p className="text-white/60 text-sm">
              I can describe who I serve and what they struggle with
            </p>
          </motion.button>

          {/* Discovery Path */}
          <motion.button
            onClick={() => onSelect('discovery')}
            whileTap={{ scale: 0.98 }}
            className={`relative p-6 rounded-xl border-2 text-left transition-all duration-200 ${
              selectedPath === 'discovery'
                ? 'bg-[var(--color-brave-600)]/20 border-[var(--color-brave-500)]'
                : 'bg-[#141414] border-white/10 hover:border-white/30 hover:bg-[#2a3d5f]'
            }`}
          >
            {selectedPath === 'discovery' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 bg-[var(--color-brave-500)] rounded-full flex items-center justify-center"
              >
                <span className="text-[#0a0a0a] text-sm font-bold">✓</span>
              </motion.div>
            )}

            <div className="w-12 h-12 mb-4 rounded-xl bg-[var(--color-brave-500)]/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--color-brave-400)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              I'm still figuring it out
            </h3>
            <p className="text-white/60 text-sm">
              Help me uncover who I'm best positioned to serve
            </p>
          </motion.button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            onClick={onNext}
            disabled={!canContinue}
            whileHover={canContinue ? { scale: 1.02 } : {}}
            whileTap={canContinue ? { scale: 0.98 } : {}}
            className="w-full py-4 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-500)] text-white font-semibold text-lg rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-brave-600)]"
          >
            Start My Research →
          </motion.button>

          {onBack && (
            <motion.button
              onClick={onBack}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 text-white/60 hover:text-white font-medium transition-colors"
            >
              ← Back
            </motion.button>
          )}
        </div>
      </motion.div>
    </div>
  )
}
