'use client';

import { GammaEmbed } from './GammaEmbed';
import { DownloadButton } from './DownloadButton';
import { OfferBuilderCTA } from './OfferBuilderCTA';

interface ReportViewProps {
  reportId: string;
  businessName: string;
  createdAt: string;
  gammaEmbedUrl: string;
  gammaDownloadUrl: string | null;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function ReportView({
  reportId,
  businessName,
  createdAt,
  gammaEmbedUrl,
  gammaDownloadUrl,
}: ReportViewProps) {
  return (
    <div className="min-h-screen bg-[#1a2744]">
      {/* Header */}
      <header className="border-b border-[#243351] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Your Audience Intelligence Report
            </h1>
            <p className="text-sm text-gray-400">
              {businessName} &bull; Generated {formatDate(createdAt)}
            </p>
          </div>
          <DownloadButton url={gammaDownloadUrl} />
        </div>
      </header>

      {/* Gamma Embed */}
      <main className="p-6">
        <div className="max-w-6xl mx-auto">
          <GammaEmbed embedUrl={gammaEmbedUrl} />
        </div>
      </main>

      {/* Next Step CTA */}
      <footer className="border-t border-[#243351] px-6 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-4">
            Ready to turn this into an irresistible offer?
          </p>
          <OfferBuilderCTA reportId={reportId} />
        </div>
      </footer>
    </div>
  );
}
