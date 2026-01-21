'use client';

interface CitationCardProps {
  url: string;
  index: number;
}

function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

function CitationCard({ url, index }: CitationCardProps) {
  const domain = extractDomain(url);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-white rounded-lg border border-gray-200 p-3 hover:border-[#BBDCEF] hover:shadow-sm transition-all group"
    >
      {/* Index number */}
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-medium flex items-center justify-center group-hover:bg-[#BBDCEF]/30 group-hover:text-[#16314C] transition-colors">
        {index}
      </div>

      {/* Link icon and domain */}
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <span className="text-sm text-gray-700 truncate group-hover:text-[#16314C]">
          {domain}
        </span>
      </div>

      {/* External link indicator */}
      <svg className="w-4 h-4 text-gray-400 flex-shrink-0 group-hover:text-[#16314C] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

export { CitationCard };
export type { CitationCardProps };
