'use client'

import { motion } from 'framer-motion'

interface StartingPointProps {
  email: string
  selectedPath: 'direct' | 'discovery' | null
  onEmailChange: (email: string) => void
  onSelect: (path: 'direct' | 'discovery') => void
  onNext: () => void
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function StartingPoint({ email, selectedPath, onEmailChange, onSelect, onNext }: StartingPointProps) {
  const canContinue = selectedPath && email && isValidEmail(email)

  return (
    <div className="max-w-2xl mx-auto">
      {/* Email Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          First things first
        </h1>
        <p className="text-gray-400 mb-6">
          Where should we send your completed report?
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="w-full px-4 py-4 bg-[#243351] border border-white/10 rounded-xl text-white text-lg placeholder-gray-500 focus:border-[var(--color-brave-500)] focus:outline-none transition-colors"
          placeholder="you@example.com"
        />
      </motion.div>

      {/* Path Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
          Do you know who you&apos;re here to serve?
        </h2>
        <p className="text-gray-400 mb-8">
          Pick the path that fits where you&apos;re at right now.
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
                : 'bg-[#243351] border-white/10 hover:border-white/30 hover:bg-[#2a3d5f]'
            }`}
          >
            {selectedPath === 'direct' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 bg-[var(--color-brave-500)] rounded-full flex items-center justify-center"
              >
                <span className="text-white text-sm">✓</span>
              </motion.div>
            )}

            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Yes, I know my audience
            </h3>
            <p className="text-gray-400 text-sm">
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
                : 'bg-[#243351] border-white/10 hover:border-white/30 hover:bg-[#2a3d5f]'
            }`}
          >
            {selectedPath === 'discovery' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-4 right-4 w-6 h-6 bg-[var(--color-brave-500)] rounded-full flex items-center justify-center"
              >
                <span className="text-white text-sm">✓</span>
              </motion.div>
            )}

            <div className="text-4xl mb-4">🧩</div>
            <h3 className="text-lg font-semibold text-white mb-2">
              I&apos;m still figuring it out
            </h3>
            <p className="text-gray-400 text-sm">
              Help me uncover who I&apos;m best positioned to serve
            </p>
          </motion.button>
        </div>

        {/* Continue Button */}
        <motion.button
          onClick={onNext}
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.02 } : {}}
          whileTap={canContinue ? { scale: 0.98 } : {}}
          className="w-full py-4 bg-[var(--color-brave-600)] hover:bg-[var(--color-brave-500)] text-white font-semibold text-lg rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-brave-600)]"
        >
          Continue
        </motion.button>
      </motion.div>
    </div>
  )
}
