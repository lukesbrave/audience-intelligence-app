'use client';

import { ReactNode } from 'react';

interface InsightCalloutProps {
  title: string;
  description: string;
  variant?: 'insight' | 'warning' | 'action' | 'success';
  icon?: ReactNode;
  className?: string;
}

function InsightCallout({
  title,
  description,
  variant = 'insight',
  icon,
  className = ''
}: InsightCalloutProps) {
  const variantStyles = {
    insight: {
      container: 'bg-[#BBDCEF]/10 border-[#BBDCEF]',
      icon: 'bg-[#BBDCEF]/30 text-[#0a0a0a]',
      title: 'text-[#0a0a0a]'
    },
    warning: {
      container: 'bg-amber-50 border-amber-200',
      icon: 'bg-amber-100 text-amber-700',
      title: 'text-amber-800'
    },
    action: {
      container: 'bg-indigo-50 border-indigo-200',
      icon: 'bg-indigo-100 text-indigo-700',
      title: 'text-indigo-800'
    },
    success: {
      container: 'bg-green-50 border-green-200',
      icon: 'bg-green-100 text-green-700',
      title: 'text-green-800'
    }
  };

  const defaultIcons = {
    insight: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    action: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const styles = variantStyles[variant];
  const displayIcon = icon || defaultIcons[variant];

  return (
    <div className={`rounded-lg border p-4 ${styles.container} ${className}`}>
      <div className="flex gap-3">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${styles.icon}`}>
          {displayIcon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm ${styles.title}`}>
            {title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export { InsightCallout };
export type { InsightCalloutProps };
