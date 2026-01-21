'use client';

import { useState } from 'react';

interface OfferBuilderCTAProps {
  reportId: string;
}

export function OfferBuilderCTA({ reportId }: OfferBuilderCTAProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    // Navigate to offer builder page with report context
    window.location.href = `/offer-builder?reportId=${reportId}`;
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="px-8 py-3 bg-[#0d9488] text-white rounded-lg font-semibold hover:bg-[#0b7c71] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? 'Starting...' : 'Build Your Offer →'}
    </button>
  );
}
