'use client'

import { motion } from 'framer-motion'

interface Step {
  id: number
  name: string
}

const steps: Step[] = [
  { id: 1, name: 'Research' },
  { id: 2, name: 'Brand Angles' },
  { id: 3, name: 'Hooks' },
  { id: 4, name: 'Playbook' },
  { id: 5, name: 'Offer Core' },
]

interface ProgressBarProps {
  currentStep: number
  completedSteps: number[]
}

export function ProgressBar({ currentStep, completedSteps }: ProgressBarProps) {
  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header card matching onboarding StepIndicator */}
      <div className="bg-[#141414] rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-[var(--color-brave-600)]/20 flex items-center justify-center">
            <span className="text-xl font-bold text-[var(--color-brave-500)]">{currentStep}</span>
          </div>
          <div>
            <p className="text-white/60 text-sm uppercase tracking-wide">
              Step {currentStep} of {totalSteps}
            </p>
            <h2 className="text-white font-semibold text-lg">
              {steps[currentStep - 1]?.name || 'Research'}
            </h2>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-[#0a0a0a] rounded-full overflow-hidden">
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
          const isPending = !isCompleted && !isCurrent

          return (
            <div key={step.id} className="flex items-center flex-1">
              {/* Step circle */}
              <div className="relative">
                <motion.div
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full cursor-pointer
                    text-lg font-bold transition-colors duration-300
                    ${isCompleted ? 'bg-[var(--color-brave-500)] text-[#0a0a0a]' : ''}
                    ${isCurrent ? 'bg-[var(--color-brave-500)]/20 text-[var(--color-brave-500)] ring-2 ring-[var(--color-brave-500)]/30' : ''}
                    ${isPending ? 'bg-[#1a1a1a] text-white/40' : ''}
                  `}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {isCompleted ? '✓' : step.id}
                </motion.div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-[#141414] rounded-full overflow-hidden">
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
                isCurrent ? 'text-[var(--color-brave-500)]' : ''
              } ${isCompleted ? 'text-[var(--color-brave-500)]/70' : ''} ${
                !isCurrent && !isCompleted ? 'text-white/40' : ''
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
