'use client';

import { useState, useEffect, useRef } from 'react';

const TIPS = [
  'Your Urgency Gateway is the ONE problem to solve first — the aspirin, not the vitamin.',
  "Them-centric language means using their words, not yours. We're mapping exactly what those words are.",
  'The best offers solve urgent problems, not important ones. Urgent gets action.',
  "After this research, you'll generate your offer — one clear entry point to your value ladder.",
];

const ROTATION_INTERVAL = 12000; // 12 seconds

interface RotatingTipsProps {
  className?: string;
}

function RotatingTips({ className = '' }: RotatingTipsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsAnimating(true);

      // After fade out, change tip and fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % TIPS.length);
        setIsAnimating(false);
      }, 300);
    }, ROTATION_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`text-center ${className}`}>
      <p className="text-sm text-slate-400 mb-2">
        <span role="img" aria-label="lightbulb">💡</span> While you wait...
      </p>
      <p
        className={`text-sm text-slate-300 italic max-w-md mx-auto transition-opacity duration-300 ${
          isAnimating ? 'opacity-0' : 'opacity-100'
        }`}
        aria-live="polite"
        aria-atomic="true"
      >
        &ldquo;{TIPS[currentIndex]}&rdquo;
      </p>
    </div>
  );
}

export { RotatingTips };
export type { RotatingTipsProps };
