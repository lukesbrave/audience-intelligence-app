'use client';

import { Demographics } from '@/lib/types';

interface DemographicsGridProps {
  demographics: Demographics;
}

function DemographicsGrid({ demographics }: DemographicsGridProps) {
  // Defensive: ensure arrays exist
  const locations = demographics?.locations || [];
  const jobTitles = demographics?.jobTitles || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Demographics
      </h3>

      {/* Icon cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
        {/* Age Range */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="w-8 h-8 rounded-lg bg-[#BBDCEF]/30 flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-900">{demographics?.ageRange || 'N/A'}</p>
          <p className="text-xs text-gray-500">Age Range</p>
        </div>

        {/* Industry */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="w-8 h-8 rounded-lg bg-[#BBDCEF]/30 flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-900 truncate">{demographics?.industry || 'N/A'}</p>
          <p className="text-xs text-gray-500">Industry</p>
        </div>

        {/* Income Level */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="w-8 h-8 rounded-lg bg-[#BBDCEF]/30 flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-900 truncate">{demographics?.incomeLevel || 'N/A'}</p>
          <p className="text-xs text-gray-500">Income Level</p>
        </div>

        {/* Location */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="w-8 h-8 rounded-lg bg-[#BBDCEF]/30 flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <p className="text-lg font-bold text-gray-900 truncate">
            {locations[0] || 'N/A'}
          </p>
          <p className="text-xs text-gray-500">
            {locations.length > 1 ? `+${locations.length - 1} more` : 'Location'}
          </p>
        </div>
      </div>

      {/* Locations */}
      {locations.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Locations</p>
          <div className="flex flex-wrap gap-2">
            {locations.map((location, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                <svg className="w-3 h-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                {location}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Job Titles */}
      {jobTitles.length > 0 && (
        <div>
          <p className="text-xs text-gray-500 mb-2">Job Titles</p>
          <div className="flex flex-wrap gap-2">
            {jobTitles.map((title, i) => (
              <span
                key={i}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#BBDCEF]/20 text-[#16314C]"
              >
                {title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { DemographicsGrid };
export type { DemographicsGridProps };
