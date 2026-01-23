'use client'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`py-8 px-4 text-center ${className}`}>
      <p className="text-xs text-gray-500">
        Built with <span className="text-gray-400">⚡</span> by{' '}
        <span className="text-gray-400">BraveBrand</span>
      </p>
    </footer>
  )
}
