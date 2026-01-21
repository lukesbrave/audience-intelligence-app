'use client';

import { useState } from 'react';
import { Spinner } from '@/components/ui/Spinner';

interface GammaEmbedProps {
  embedUrl: string;
}

export function GammaEmbed({ embedUrl }: GammaEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#243351] rounded-lg border border-[#243351]">
          <Spinner size="lg" className="text-[#0d9488]" />
        </div>
      )}
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full rounded-lg border border-[#243351]"
        allowFullScreen
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        title="Audience Intelligence Report"
      />
    </div>
  );
}
