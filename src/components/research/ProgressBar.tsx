'use client'

import { motion } from 'framer-motion'

interface Step {
  id: number
  name: string
  icon: string
}

const steps: Step[] = [
  { id: 1, name: 'Research', icon: '🔍' },
  { id: 2, name: 'Brand Angles', icon: '🎯' },
  { id: 3, name: 'Hooks', icon: '🪝' },
  { id: 4, name: 'Playbook', icon: '📋' },
  { id: 5, name: 'Offer Core', icon: '⚡' },
]

interface ProgressBarProps {
  currentStep: number
  completedSteps: number[]
}

export function ProgressBar({ currentStep, completedSteps }: ProgressBarProps) {
  // Progress is based on all 5 steps
  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100


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
              Step {currentStep} of {totalSteps}
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

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="relative">
                <motion.div
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer
                    ${isCompleted ? 'bg-[var(--color-brave-600)]' : ''}
                    ${isCurrent ? 'bg-[#243351] border-2 border-[var(--color-brave-500)]' : ''}
                    ${!isCompleted && !isCurrent ? 'bg-[#243351] border border-white/10' : ''}
                    transition-colors duration-300
                  `}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {isCompleted ? (
                    <span className="text-white">✓</span>
                  ) : (
                    <span className="text-lg">{step.icon}</span>
                  )}

                  {/* Pulse animation for current step - CSS for smooth looping */}
                  {isCurrent && (
                    <>
                      <div className="absolute -inset-0.5 rounded-full border-2 border-[var(--color-brave-500)] animate-step-pulse" />
                      <div className="absolute -inset-0.5 rounded-full border-2 border-[var(--color-brave-500)] animate-step-pulse-delayed" />
                    </>
                  )}
                </motion.div>
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

          return (
            <div
              key={step.id}
              className={`flex-1 text-center text-xs font-medium ${
                isCurrent || isCompleted
                  ? 'text-[var(--color-brave-600)]'
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
