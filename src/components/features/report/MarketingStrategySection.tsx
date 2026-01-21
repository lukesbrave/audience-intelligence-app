'use client';

import { Collapsible, RichTextDisplay } from '@/components/ui';

interface MarketingStrategySectionProps {
  strategy: string;
  defaultOpen?: boolean;
}

function MarketingStrategySection({ strategy, defaultOpen = false }: MarketingStrategySectionProps) {
  return (
    <Collapsible title="Marketing Strategy" defaultOpen={defaultOpen}>
      <RichTextDisplay content={strategy} />
    </Collapsible>
  );
}

export { MarketingStrategySection };
export type { MarketingStrategySectionProps };
