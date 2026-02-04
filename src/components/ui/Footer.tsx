'use client'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`py-8 px-4 text-center ${className}`}>
      <p className="text-xs text-white/50">
        Built with <span className="text-white/60">⚡</span> by{' '}
        <span className="text-white/60">BraveBrand</span>
        <span className="mx-2 text-white/60">·</span>
        <span className="text-white/60">v1</span>
      </p>
    </footer>
  )
}
