'use client'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`py-6 px-4 text-center ${className}`}>
      <p className="text-xs text-gray-500">
        A <span className="text-gray-400">BraveBrand AI</span> Experience
        <span className="mx-2 text-gray-600">•</span>
        © {new Date().getFullYear()}
      </p>
    </footer>
  )
}
