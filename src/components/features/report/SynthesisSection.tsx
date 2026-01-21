'use client';

import { Collapsible, RichTextDisplay } from '@/components/ui';

interface SynthesisSectionProps {
  synthesis: string;
  defaultOpen?: boolean;
}

function SynthesisSection({ synthesis, defaultOpen = false }: SynthesisSectionProps) {
  return (
    <Collapsible title="Research Synthesis" defaultOpen={defaultOpen}>
      <RichTextDisplay content={synthesis} />
    </Collapsible>
  );
}

export { SynthesisSection };
export type { SynthesisSectionProps };
