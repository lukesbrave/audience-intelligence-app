'use client';

import { Collapsible, Card, Badge } from '@/components/ui';
import { ThemCentricLanguage } from '@/lib/types';

interface ThemCentricLanguageSectionProps {
  language?: ThemCentricLanguage;
  defaultOpen?: boolean;
}

function ThemCentricLanguageSection({ language, defaultOpen = true }: ThemCentricLanguageSectionProps) {
  if (!language) {
    return null;
  }

  const { painPhrases, desirePhrases, searchPhrases, emotionalTriggers } = language;

  return (
    <Collapsible
      title="Them-Centric Language Map"
      badge="Their Words"
      defaultOpen={defaultOpen}
    >
      <div className="space-y-4">
        {/* Header explanation */}
        <p className="text-sm text-gray-600">
          Your audience&apos;s brain is completely me-centric — they only care about what&apos;s in it for them.
          Use these exact words in your marketing to create magnetic attraction.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pain Language */}
          <Card padding="sm" className="bg-red-50/50 border-red-100">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="error">Pain Language</Badge>
            </div>
            <p className="text-xs text-gray-500 mb-2">How they describe their frustrations</p>
            <ul className="space-y-2">
              {painPhrases.map((phrase, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-red-400 mt-0.5">&quot;</span>
                  <span className="italic">{phrase}</span>
                  <span className="text-red-400 mt-0.5">&quot;</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Desire Language */}
          <Card padding="sm" className="bg-green-50/50 border-green-100">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="success">Desire Language</Badge>
            </div>
            <p className="text-xs text-gray-500 mb-2">How they describe what they want</p>
            <ul className="space-y-2">
              {desirePhrases.map((phrase, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">&quot;</span>
                  <span className="italic">{phrase}</span>
                  <span className="text-green-400 mt-0.5">&quot;</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Search Language */}
          <Card padding="sm" className="bg-blue-50/50 border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="info">Search Language</Badge>
            </div>
            <p className="text-xs text-gray-500 mb-2">How they Google for solutions</p>
            <ul className="space-y-2">
              {searchPhrases.map((phrase, index) => (
                <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>{phrase}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Emotional Triggers */}
          <Card padding="sm" className="bg-purple-50/50 border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="default" className="bg-purple-100 text-purple-700">Emotional Triggers</Badge>
            </div>
            <p className="text-xs text-gray-500 mb-2">Words that resonate emotionally</p>
            <div className="flex flex-wrap gap-2">
              {emotionalTriggers.map((trigger, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-purple-100/50 text-purple-700 text-sm rounded-md font-medium"
                >
                  {trigger}
                </span>
              ))}
            </div>
          </Card>
        </div>

        {/* Usage Tip */}
        <Card padding="sm" className="bg-[#16314C]/5 border-[#16314C]/10">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-[#16314C] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-[#16314C]">Pro Tip: Mirror Their Language</p>
              <p className="text-sm text-gray-600 mt-1">
                When your marketing uses your audience&apos;s exact words, they feel understood.
                This shifts you from &quot;salesy&quot; to &quot;this brand gets me.&quot;
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Collapsible>
  );
}

export { ThemCentricLanguageSection };
export type { ThemCentricLanguageSectionProps };
