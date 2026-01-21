'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ResearchFinding } from '@/lib/types';

interface SidebarSection {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: { id: string; label: string }[];
}

interface SidebarProps {
  showReportNav?: boolean;
  researchPhases?: ResearchFinding[];
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
  hasOfferData?: boolean;
  isResearchComplete?: boolean;
}

function Sidebar({
  showReportNav = false,
  researchPhases = [],
  activeSection = '',
  onSectionClick,
  hasOfferData = false,
  isResearchComplete = false
}: SidebarProps) {
  const pathname = usePathname();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['workflows', 'audience-research', 'your-offer']);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSectionClick = (sectionId: string) => {
    if (onSectionClick) {
      onSectionClick(sectionId);
    }
  };

  // Report sections that live under Audience Research
  const reportSections: SidebarSection[] = [
    { id: 'overview', label: 'Overview' },
    {
      id: 'urgency-gateway',
      label: 'Urgency Gateway',
      icon: (
        <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      id: 'them-centric-language',
      label: 'Language Map',
      icon: (
        <svg className="w-3.5 h-3.5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    { id: 'audience-profile', label: 'Audience Profile' },
    {
      id: 'research-findings',
      label: 'Research Findings',
      children: researchPhases.map(phase => ({
        id: `phase-${phase.phase}`,
        label: `Phase ${phase.phase}: ${phase.phaseName}`
      }))
    },
    { id: 'synthesis', label: 'Synthesis' },
    { id: 'marketing-strategy', label: 'Marketing Strategy' }
  ];

  // Offer sections that live under Your Offer
  const offerSections: SidebarSection[] = [
    { id: 'offer-builder', label: 'Offer Blueprint' },
    // Future: Add more offer-related sections here
    // { id: 'value-ladder', label: 'Value Ladder' },
    // { id: 'messaging', label: 'Messaging Framework' },
  ];

  const isActiveSection = (sectionId: string) => {
    return activeSection === sectionId;
  };

  // Check if current section is within audience research
  const isInAudienceResearch = reportSections.some(s =>
    s.id === activeSection || s.children?.some(c => c.id === activeSection)
  );

  // Check if current section is within your offer
  const isInYourOffer = offerSections.some(s => s.id === activeSection);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo/Brand Area */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/research" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#16314C] rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-900">Research Hub</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {/* Workflows Section */}
        <div className="mb-2">
          <button
            onClick={() => toggleGroup('workflows')}
            className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 hover:text-gray-700"
          >
            <span>Workflows</span>
            <svg
              className={`w-4 h-4 transition-transform ${expandedGroups.includes('workflows') ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedGroups.includes('workflows') && (
            <ul className="space-y-1">
              {/* Audience Research - with nested report sections */}
              <li>
                <button
                  onClick={() => {
                    if (showReportNav) {
                      toggleGroup('audience-research');
                    }
                  }}
                  className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                    (pathname === '/research' || isInAudienceResearch)
                      ? 'bg-[#BBDCEF]/30 text-[#16314C] font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Audience Research
                  </span>
                  {showReportNav && (
                    <svg
                      className={`w-4 h-4 transition-transform ${expandedGroups.includes('audience-research') ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>

                {/* Nested Report Sections under Audience Research */}
                {showReportNav && expandedGroups.includes('audience-research') && (
                  <ul className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {reportSections.map(section => (
                      <li key={section.id}>
                        <button
                          onClick={() => handleSectionClick(section.id)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors w-full text-left ${
                            isActiveSection(section.id)
                              ? 'bg-[#BBDCEF]/20 text-[#16314C] font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {section.icon && <span className="flex-shrink-0">{section.icon}</span>}
                          {section.label}
                        </button>

                        {/* Nested items for Research Findings */}
                        {section.children && section.children.length > 0 && (
                          <ul className="ml-3 mt-0.5 space-y-0.5 border-l border-gray-100 pl-2">
                            {section.children.map(child => (
                              <li key={child.id}>
                                <button
                                  onClick={() => handleSectionClick(child.id)}
                                  className={`block px-2 py-1 rounded text-xs transition-colors w-full text-left truncate ${
                                    isActiveSection(child.id)
                                      ? 'bg-[#BBDCEF]/20 text-[#16314C] font-medium'
                                      : 'text-gray-500 hover:bg-gray-50'
                                  }`}
                                  title={child.label}
                                >
                                  {child.label}
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              {/* Your Offer - with nested offer sections */}
              <li>
                <div className="relative group">
                  <button
                    onClick={() => {
                      if (showReportNav && isResearchComplete) {
                        toggleGroup('your-offer');
                        // If clicking to expand and has offer data, navigate to it
                        if (!expandedGroups.includes('your-offer') && hasOfferData) {
                          handleSectionClick('offer-builder');
                        }
                      }
                    }}
                    disabled={!isResearchComplete}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm transition-colors ${
                      !isResearchComplete
                        ? 'text-gray-400 cursor-not-allowed'
                        : isInYourOffer
                          ? 'bg-[#BBDCEF]/30 text-[#16314C] font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      {isResearchComplete ? (
                        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                      Your Offer
                    </span>
                    {showReportNav && isResearchComplete && (
                      <svg
                        className={`w-4 h-4 transition-transform ${expandedGroups.includes('your-offer') ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>

                  {/* Tooltip for locked state */}
                  {!isResearchComplete && (
                    <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                      Complete your research first
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                    </div>
                  )}
                </div>

                {/* Nested Offer Sections under Your Offer */}
                {showReportNav && isResearchComplete && expandedGroups.includes('your-offer') && (
                  <ul className="ml-4 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {offerSections.map(section => (
                      <li key={section.id}>
                        <button
                          onClick={() => handleSectionClick(section.id)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors w-full text-left ${
                            isActiveSection(section.id)
                              ? 'bg-[#BBDCEF]/20 text-[#16314C] font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {section.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              {/* History */}
              <li>
                <Link
                  href="/research/history"
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    pathname === '/research/history'
                      ? 'bg-[#BBDCEF]/30 text-[#16314C] font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  History
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => {/* TODO: Implement logout */}}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
}

export { Sidebar };
export type { SidebarProps };
