'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';

interface CollapsibleProps {
  title: string;
  defaultOpen?: boolean;
  badge?: string | number;
  children: ReactNode;
  className?: string;
}

function Collapsible({
  title,
  defaultOpen = false,
  badge,
  children,
  className = '',
}: CollapsibleProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const contentEl = contentRef.current;
      if (contentEl) {
        setHeight(contentEl.scrollHeight);
        // After animation, remove fixed height so content can resize naturally
        const timer = setTimeout(() => setHeight(undefined), 200);
        return () => clearTimeout(timer);
      }
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  const contentId = `collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={toggle}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full flex items-center justify-between p-4 text-left bg-white hover:bg-gray-50 transition-colors focus-ring"
      >
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-900">{title}</span>
          {badge !== undefined && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#BBDCEF] text-[#16314C]">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        id={contentId}
        style={{ height: height === undefined ? 'auto' : `${height}px` }}
        className="transition-[height] duration-200 ease-out overflow-hidden"
      >
        <div ref={contentRef} className="p-4 pt-0 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
}

export { Collapsible };
export type { CollapsibleProps };
