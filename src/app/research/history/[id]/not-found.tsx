import Link from 'next/link';

export default function ReportNotFound() {
  return (
    <div className="min-h-screen bg-[#1a2744] flex items-center justify-center p-8">
      <div className="bg-[#243351] rounded-xl p-12 border border-white/10 text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-medium text-white mb-2">Report Not Found</h2>
        <p className="text-gray-400 mb-6">
          This report may have been deleted or the link is invalid.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-4 py-2 bg-[#BBDCEF] hover:bg-[#9fcce8] text-[#1a2744] font-medium rounded-lg transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
