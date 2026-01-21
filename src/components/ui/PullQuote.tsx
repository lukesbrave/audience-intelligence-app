'use client';

interface PullQuoteProps {
  quote: string;
  attribution?: string;
}

function PullQuote({ quote, attribution = 'Research Synthesis' }: PullQuoteProps) {
  return (
    <blockquote className="relative bg-white rounded-xl border-l-4 border-[#BBDCEF] px-6 py-5 shadow-sm">
      {/* Decorative quote mark */}
      <span className="absolute top-3 left-4 text-4xl text-[#BBDCEF]/40 font-serif leading-none">
        &ldquo;
      </span>

      <p className="text-lg text-gray-700 italic leading-relaxed pl-4">
        {quote}
      </p>

      {attribution && (
        <footer className="mt-3 pl-4">
          <cite className="text-sm text-gray-500 not-italic">
            — {attribution}
          </cite>
        </footer>
      )}
    </blockquote>
  );
}

export { PullQuote };
export type { PullQuoteProps };
