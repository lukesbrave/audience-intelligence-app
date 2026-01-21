'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
  value: string | number;
  label: string;
  sublabel?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

function MetricCard({
  value,
  label,
  sublabel,
  icon,
  trend,
  variant = 'default',
  size = 'md',
  className = ''
}: MetricCardProps) {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    primary: 'bg-[#BBDCEF]/10 border-[#BBDCEF]',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    error: 'bg-red-50 border-red-200'
  };

  const sizeStyles = {
    sm: {
      container: 'p-3',
      value: 'text-2xl',
      label: 'text-xs',
      icon: 'w-8 h-8'
    },
    md: {
      container: 'p-4',
      value: 'text-3xl',
      label: 'text-sm',
      icon: 'w-10 h-10'
    },
    lg: {
      container: 'p-6',
      value: 'text-4xl',
      label: 'text-base',
      icon: 'w-12 h-12'
    }
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500'
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    )
  };

  return (
    <div
      className={`
        rounded-xl border ${variantStyles[variant]} ${sizeStyles[size].container}
        ${className}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Value */}
          <div className={`${sizeStyles[size].value} font-bold text-gray-900 leading-none tabular-nums`}>
            {value}
          </div>

          {/* Label */}
          <div className={`${sizeStyles[size].label} text-gray-500 mt-1`}>
            {label}
          </div>

          {/* Sublabel or Trend */}
          {(sublabel || trend) && (
            <div className="mt-2 flex items-center gap-2">
              {sublabel && (
                <span className="text-xs text-gray-400">{sublabel}</span>
              )}
              {trend && (
                <span className={`flex items-center gap-1 text-xs font-medium ${trendColors[trend.direction]}`}>
                  {trendIcons[trend.direction]}
                  {trend.value}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div className={`${sizeStyles[size].icon} flex items-center justify-center rounded-lg bg-gray-100 text-gray-600`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export { MetricCard };
export type { MetricCardProps };
