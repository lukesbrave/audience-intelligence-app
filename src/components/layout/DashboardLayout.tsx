'use client';

import { useState, useCallback, ReactNode, Children, cloneElement, isValidElement } from 'react';
import { Sidebar } from './Sidebar';
import { ResearchFinding } from '@/lib/types';

interface DashboardLayoutProps {
  children: ReactNode;
  showReportNav?: boolean;
  researchPhases?: ResearchFinding[];
  hasOfferData?: boolean;
  isResearchComplete?: boolean;
}

function DashboardLayout({
  children,
  showReportNav = false,
  researchPhases = [],
  hasOfferData = false,
  isResearchComplete = false
}: DashboardLayoutProps) {
  const [activeSection, setActiveSection] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Simple click handler - just update state, no scrolling
  const handleSectionClick = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    setIsMobileMenuOpen(false);
  }, []);

  // Clone children and pass activeSection and onNavigate props
  const childrenWithProps = Children.map(children, child => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        activeSection,
        onNavigate: handleSectionClick
      } as { activeSection: string; onNavigate: (section: string) => void });
    }
    return child;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isMobileMenuOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <Sidebar
          showReportNav={showReportNav}
          researchPhases={researchPhases}
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          hasOfferData={hasOfferData}
          isResearchComplete={isResearchComplete}
        />
      </div>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        <div className="min-h-screen">
          {childrenWithProps}
        </div>
      </main>
    </div>
  );
}

export { DashboardLayout };
export type { DashboardLayoutProps };
