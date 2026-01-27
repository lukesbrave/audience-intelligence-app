'use client'

import Image from 'next/image'
import { useState } from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Logo dimensions: 700x185 (aspect ratio ~3.78:1)
// Need larger sizes to show the subheadline clearly
const sizeConfig = {
  sm: { height: 40, width: 151 },
  md: { height: 52, width: 197 },
  lg: { height: 64, width: 242 },
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const [imageError, setImageError] = useState(false)
  const { width, height } = sizeConfig[size]

  if (imageError) {
    return (
      <div className={className}>
        <span className={`font-bold text-white ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
          BraveBrand
        </span>
      </div>
    )
  }

  return (
    <Image
      src="/logo.svg"
      alt="BraveBrand"
      width={width}
      height={height}
      className={`h-auto ${className}`}
      onError={() => setImageError(true)}
      priority
    />
  )
}

interface StickyHeaderProps {
  className?: string
}

export function StickyHeader({ className = '' }: StickyHeaderProps) {
  return (
    <header className={`sticky top-0 z-50 bg-[#1a2744]/95 backdrop-blur-sm border-b border-white/5 ${className}`}>
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-center">
        <div className="relative inline-flex items-start">
          <Logo size="md" />
          <span className="ml-1 -mt-1 text-[10px] font-medium text-gray-500 bg-gray-800/50 px-1.5 py-0.5 rounded">
            v1
          </span>
        </div>
      </div>
    </header>
  )
}
