'use client';

interface PresentationPanelProps {
  status: 'completed' | 'error';
  url?: string;
  embedUrl?: string;
  exportUrl?: string;
}

export function PresentationPanel({ status, url, embedUrl, exportUrl }: PresentationPanelProps) {
  return (
    <div className="bg-[#243351] border border-slate-600/50 rounded-2xl overflow-hidden h-full">
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-slate-600/50">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
          Your Presentation
        </h2>
      </div>

      {/* Panel Content */}
      <div className="p-6">
        {status === 'completed' && embedUrl && (
          <div className="space-y-4">
            {/* Embedded Presentation */}
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={embedUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="fullscreen"
                title="Audience Intelligence Presentation"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Google Slides
              </a>
              {exportUrl && (
                <a
                  href={exportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PPTX
                </a>
              )}
            </div>
          </div>
        )}

        {status === 'completed' && !embedUrl && url && (
          <div className="aspect-video bg-[#1a2744] rounded-xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Presentation Ready!</h3>
            <p className="text-slate-400 text-center max-w-xs mb-4">
              Your presentation has been created in Google Slides.
            </p>
            <div className="flex gap-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                View Presentation
              </a>
              {exportUrl && (
                <a
                  href={exportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              )}
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="aspect-video bg-[#1a2744] rounded-xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Presentation Unavailable</h3>
            <p className="text-slate-400 text-center max-w-xs">
              The presentation couldn&apos;t be generated, but your research data is available in the JSON export.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
