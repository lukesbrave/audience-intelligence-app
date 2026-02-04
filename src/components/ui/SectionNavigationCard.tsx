'use client';

import { ReactNode } from 'react';

interface SectionNavigationCardProps {
  title: string;
  description: string;
  stats?: string;
  icon?: ReactNode;
  onClick: () => void;
}

function SectionNavigationCard({
  title,
  description,
  stats,
  icon,
  onClick,
}: SectionNavigationCardProps) {
  return (
    <button
      onClick={onClick}
      className="
        w-full text-left bg-white rounded-xl border border-gray-200 p-4
        hover:border-[#BBDCEF] hover:shadow-md transition-all duration-200
        group
      "
    >
      <div className="flex items-start gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-white/50 group-hover:bg-[#BBDCEF]/30 group-hover:text-[#0a0a0a] transition-colors">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-gray-900 group-hover:text-[#0a0a0a] transition-colors">
              {title}
            </h4>
            <svg
              className="w-5 h-5 text-white/60 group-hover:text-[#0a0a0a] group-hover:translate-x-1 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <p className="text-sm text-white/50 mt-0.5">{description}</p>
          {stats && (
            <p className="text-xs text-[#0a0a0a] font-medium mt-2 bg-[#BBDCEF]/20 inline-block px-2 py-0.5 rounded">
              {stats}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export { SectionNavigationCard };
export type { SectionNavigationCardProps };
