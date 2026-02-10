'use client'

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { Hook, HookRating } from '@/lib/research/schemas'

interface SwipeCardProps {
  hook: Hook
  onSwipe: (rating: HookRating) => void
  isTop: boolean
}

export function SwipeCard({ hook, onSwipe, isTop }: SwipeCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Rotation based on horizontal drag
  const rotate = useTransform(x, [-200, 200], [-15, 15])

  // Opacity of the action indicators
  const likeOpacity = useTransform(x, [0, 100], [0, 1])
  const skipOpacity = useTransform(x, [-100, 0], [1, 0])
  const loveOpacity = useTransform(y, [-100, 0], [1, 0])

  // Background colors - dark theme
  const backgroundColor = useTransform(
    x,
    [-200, 0, 200],
    ['rgb(127, 29, 29)', 'rgb(36, 51, 81)', 'rgb(20, 83, 45)']
  )

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 100
    const { offset, velocity } = info

    // Swipe up for "love"
    if (offset.y < -threshold || velocity.y < -500) {
      onSwipe('love')
      return
    }

    // Swipe right for "like"
    if (offset.x > threshold || velocity.x > 500) {
      onSwipe('like')
      return
    }

    // Swipe left for "skip"
    if (offset.x < -threshold || velocity.x < -500) {
      onSwipe('skip')
      return
    }
  }

  const categoryColors = {
    pain_agitation: 'bg-red-500/20 text-red-300 border border-red-500/30',
    contrarian: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
    curiosity: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    identity: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    transformation: 'bg-[var(--color-brave-500)]/20 text-[var(--color-brave-600)] border border-[var(--color-brave-500)]/30',
  }

  const categoryLabels = {
    pain_agitation: 'Pain',
    contrarian: 'Contrarian',
    curiosity: 'Curiosity',
    identity: 'Identity',
    transformation: 'Transformation',
  }

  return (
    <motion.div
      className="absolute w-full cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden"
      style={{
        x,
        y,
        rotate,
        backgroundColor,
        zIndex: isTop ? 10 : 0,
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 1.02 }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 0.2 },
      }}
    >
      <div className="bg-[#141414] rounded-2xl shadow-xl p-8 border border-white/10 min-h-[300px] flex flex-col">
        {/* Category badge */}
        <div className="flex justify-between items-start mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${categoryColors[hook.category]}`}
          >
            {categoryLabels[hook.category]}
          </span>
        </div>

        {/* Hook text */}
        <p className="text-2xl font-semibold text-white leading-snug flex-grow">
          "{hook.text}"
        </p>

        {/* Target emotion */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-sm text-white/60">
            <span className="font-medium text-white/70">Targets:</span> {hook.targetEmotion}
          </p>
        </div>

        {/* Swipe indicators */}
        <motion.div
          className="absolute top-4 right-4 text-[var(--color-brave-600)] text-4xl"
          style={{ opacity: likeOpacity }}
        >
          ❤️
        </motion.div>

        <motion.div
          className="absolute top-4 left-4 text-white/60 text-4xl"
          style={{ opacity: skipOpacity }}
        >
          ⬅️
        </motion.div>

        <motion.div
          className="absolute top-4 left-1/2 -translate-x-1/2 text-orange-400 text-4xl"
          style={{ opacity: loveOpacity }}
        >
          🔥
        </motion.div>
      </div>
    </motion.div>
  )
}
