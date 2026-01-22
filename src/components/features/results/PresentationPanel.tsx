'use client';

interface PresentationPanelProps {
  gammaStatus: 'processing' | 'completed' | 'error';
  gammaUrl?: string;
  gammaEmbedUrl?: string;
}

export function PresentationPanel({ gammaStatus, gammaUrl, gammaEmbedUrl }: PresentationPanelProps) {
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
        {gammaStatus === 'processing' && (
          <div className="aspect-video bg-[#1a2744] rounded-xl flex flex-col items-center justify-center">
            {/* Animated loading state */}
            <div className="relative mb-6">
              <div className="w-16 h-16 border-4 border-slate-600 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-teal-400 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Creating Your Presentation</h3>
            <p className="text-slate-400 text-center max-w-xs">
              We&apos;re generating a beautiful presentation from your research. This usually takes 1-2 minutes.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
              Powered by Gamma AI
            </div>
          </div>
        )}

        {gammaStatus === 'completed' && gammaEmbedUrl && (
          <div className="space-y-4">
            {/* Embedded Presentation */}
            <div className="aspect-video rounded-xl overflow-hidden bg-black">
              <iframe
                src={gammaEmbedUrl}
                className="w-full h-full"
                frameBorder="0"
                allow="fullscreen"
                title="Audience Intelligence Presentation"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3">
              <a
                href={gammaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Gamma
              </a>
              <a
                href={gammaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </a>
            </div>
          </div>
        )}

        {gammaStatus === 'completed' && !gammaEmbedUrl && gammaUrl && (
          <div className="aspect-video bg-[#1a2744] rounded-xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Presentation Ready!</h3>
            <p className="text-slate-400 text-center max-w-xs mb-4">
              Your presentation has been created and sent to your email.
            </p>
            <a
              href={gammaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Presentation
            </a>
          </div>
        )}

        {gammaStatus === 'error' && (
          <div className="aspect-video bg-[#1a2744] rounded-xl flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white mb-2">Presentation Unavailable</h3>
            <p className="text-slate-400 text-center max-w-xs">
              We couldn&apos;t generate the presentation, but your research data is still available below.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
