'use client';

import { ReactNode } from 'react';

interface IconCardProps {
  icon: ReactNode;
  title: string;
  value?: string | number;
  description?: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'muted';
  size?: 'sm' | 'md' | 'lg';
}

const variantStyles = {
  default: 'bg-white border-gray-200 hover:border-gray-300',
  primary: 'bg-[#BBDCEF]/10 border-[#BBDCEF]/30 hover:border-[#BBDCEF]/50',
  muted: 'bg-gray-50 border-gray-100 hover:border-gray-200',
};

const iconContainerStyles = {
  default: 'bg-gray-100 text-white/60',
  primary: 'bg-[#BBDCEF]/30 text-[#0a0a0a]',
  muted: 'bg-gray-100 text-white/50',
};

const sizeStyles = {
  sm: { container: 'p-3', icon: 'w-8 h-8', title: 'text-xs', value: 'text-lg' },
  md: { container: 'p-4', icon: 'w-10 h-10', title: 'text-sm', value: 'text-xl' },
  lg: { container: 'p-5', icon: 'w-12 h-12', title: 'text-sm', value: 'text-2xl' },
};

function IconCard({
  icon,
  title,
  value,
  description,
  onClick,
  variant = 'default',
  size = 'md',
}: IconCardProps) {
  const isClickable = !!onClick;
  const Component = isClickable ? 'button' : 'div';
  const sizes = sizeStyles[size];

  return (
    <Component
      className={`
        rounded-xl border ${sizes.container} flex flex-col items-start gap-3
        ${variantStyles[variant]}
        ${isClickable ? 'cursor-pointer transition-all hover:shadow-sm' : ''}
        text-left w-full
      `}
      onClick={onClick}
    >
      <div className={`${sizes.icon} rounded-lg flex items-center justify-center ${iconContainerStyles[variant]}`}>
        {icon}
      </div>
      <div className="space-y-0.5">
        {value !== undefined && (
          <p className={`${sizes.value} font-bold text-gray-900`}>{value}</p>
        )}
        <p className={`${sizes.title} font-medium text-white/60`}>{title}</p>
        {description && (
          <p className="text-xs text-white/50">{description}</p>
        )}
      </div>
    </Component>
  );
}

export { IconCard };
export type { IconCardProps };
