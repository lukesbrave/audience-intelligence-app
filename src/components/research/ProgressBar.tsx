'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Step {
  id: number
  name: string
  icon: string
  lockedIcon?: string
  unlockedIcon?: string
}

const steps: Step[] = [
  { id: 1, name: 'Research', icon: '🔍' },
  { id: 2, name: 'Brand Angles', icon: '🎯' },
  { id: 3, name: 'Hooks', icon: '🪝' },
  { id: 4, name: 'Playbook', icon: '📋' },
  { id: 5, name: 'Offer Core', icon: '⚡', lockedIcon: '🔒', unlockedIcon: '⚡' },
]

interface ProgressBarProps {
  currentStep: number
  completedSteps: number[]
}

export function ProgressBar({ currentStep, completedSteps }: ProgressBarProps) {
  const [tooltipStep, setTooltipStep] = useState<number | null>(null)

  // Progress is based on first 4 steps (Step 5 is bonus)
  const mainSteps = 4
  const progress = Math.min((currentStep / mainSteps) * 100, 100)

  // Step 5 is unlocked when Step 4 (Playbook) is reached or completed
  const isStep5Unlocked = currentStep >= 4 || completedSteps.includes(4)

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header card matching onboarding StepIndicator */}
      <div className="bg-[#243351] rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--color-brave-600)]/20 flex items-center justify-center">
            <span className="text-2xl">{steps[currentStep - 1]?.icon || '✨'}</span>
          </div>
          <div>
            <p className="text-gray-400 text-sm uppercase tracking-wide">
              {currentStep <= 4 ? `Step ${currentStep} of ${mainSteps}` : 'Bonus Step'}
            </p>
            <h2 className="text-white font-semibold text-lg">
              {steps[currentStep - 1]?.name || 'Research'}
            </h2>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#1a2744] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[var(--color-brave-500)]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Step indicators below */}
      <div className="flex items-center justify-between mt-6 px-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id
          const isStep5 = step.id === 5
          const isLocked = isStep5 && !isStep5Unlocked

          // Determine which icon to show for Step 5
          const getStepIcon = () => {
            if (isCompleted) return '✓'
            if (isStep5) {
              return isLocked ? step.lockedIcon : step.unlockedIcon
            }
            return step.icon
          }

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="relative">
                <motion.div
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer
                    ${isCompleted ? 'bg-[var(--color-brave-600)]' : ''}
                    ${isCurrent && !isLocked ? 'bg-[#243351] border-2 border-[var(--color-brave-500)]' : ''}
                    ${isLocked ? 'bg-[#1a2744] border border-white/5' : ''}
                    ${!isCompleted && !isCurrent && !isLocked ? 'bg-[#243351] border border-white/10' : ''}
                    ${isStep5 && !isLocked && !isCompleted && !isCurrent ? 'border-yellow-500/30 bg-yellow-500/5' : ''}
                    transition-colors duration-300
                  `}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: isLocked ? 0.5 : 1 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => isLocked && setTooltipStep(step.id)}
                  onMouseLeave={() => setTooltipStep(null)}
                >
                  {isCompleted ? (
                    <span className="text-white">✓</span>
                  ) : (
                    <span className={`text-lg ${isLocked ? 'opacity-60' : ''}`}>{getStepIcon()}</span>
                  )}

                  {/* Pulse animation for current step */}
                  {isCurrent && !isLocked && (
                    <div className="absolute inset-0 rounded-full border-2 border-[var(--color-brave-500)] animate-ping-slow" />
                  )}

                  {/* Electric pulse for unlocked Step 5 (not current, not completed) */}
                  {isStep5 && !isLocked && !isCurrent && !isCompleted && (
                    <div className="absolute inset-0 rounded-full border border-yellow-500/50 animate-pulse" />
                  )}
                </motion.div>

                {/* Tooltip for locked step */}
                <AnimatePresence>
                  {tooltipStep === step.id && isLocked && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#1a2744] border border-white/10 rounded-lg px-3 py-2 whitespace-nowrap z-10"
                    >
                      <p className="text-xs text-gray-300">Complete your Playbook to unlock</p>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-[#1a2744] border-r border-b border-white/10" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-[#243351] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[var(--color-brave-500)]"
                    initial={{ width: '0%' }}
                    animate={{ width: isCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Step labels */}
      <div className="flex items-center justify-between mt-2 px-2">
        {steps.map((step) => {
          const isCurrent = currentStep === step.id
          const isCompleted = completedSteps.includes(step.id)
          const isStep5 = step.id === 5
          const isLocked = isStep5 && !isStep5Unlocked

          return (
            <div
              key={step.id}
              className={`flex-1 text-center text-xs font-medium ${
                isLocked
                  ? 'text-gray-600'
                  : isCurrent
                    ? 'text-[var(--color-brave-600)]'
                    : isCompleted
                      ? 'text-[var(--color-brave-600)]'
                      : isStep5 && !isLocked
                        ? 'text-yellow-500/70'
                        : 'text-gray-500'
              }`}
            >
              {step.name}
            </div>
          )
        })}
      </div>
    </div>
  )
}
