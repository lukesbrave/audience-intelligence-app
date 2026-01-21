'use client';

import { Card, Badge } from '@/components/ui';
import { ThemCentricLanguage } from '@/lib/types';

interface ThemCentricLanguageViewProps {
  language?: ThemCentricLanguage;
}

function ThemCentricLanguageView({ language }: ThemCentricLanguageViewProps) {
  if (!language) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Language Map Not Available</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          The them-centric language map will be available after running research with the updated workflow.
        </p>
      </div>
    );
  }

  const { painPhrases, desirePhrases, searchPhrases, emotionalTriggers } = language;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Them-Centric Language Map</h1>
        <p className="text-sm text-gray-500 mt-1">
          The exact words your audience uses — mirror these for magnetic marketing
        </p>
      </div>

      {/* Framework Explanation */}
      <Card padding="md" className="bg-[#16314C]/5 border-[#16314C]/10">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#16314C]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#16314C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-[#16314C] mb-1">Your Audience is Me-Centric</h4>
            <p className="text-sm text-gray-600">
              Your customer&apos;s brain is wired to ask &quot;what&apos;s in it for me?&quot; When your marketing uses their exact words,
              they feel understood. This shifts you from &quot;salesy&quot; to &quot;this brand gets me.&quot; Use these phrases in your
              headlines, ads, emails, and sales conversations.
            </p>
          </div>
        </div>
      </Card>

      {/* Language Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pain Language */}
        <Card padding="md" className="border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Pain Language</h3>
              <p className="text-xs text-gray-500">How they describe their frustrations</p>
            </div>
          </div>
          <div className="space-y-2">
            {painPhrases.map((phrase, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-red-50/50 rounded-lg"
              >
                <span className="text-red-400 mt-0.5 font-serif">&ldquo;</span>
                <span className="text-gray-700 italic flex-1">{phrase}</span>
                <span className="text-red-400 mt-0.5 font-serif">&rdquo;</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-red-100">
            <p className="text-xs text-gray-500">
              <strong>Use in:</strong> Problem-focused headlines, hooks, email subject lines
            </p>
          </div>
        </Card>

        {/* Desire Language */}
        <Card padding="md" className="border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Desire Language</h3>
              <p className="text-xs text-gray-500">How they describe what they want</p>
            </div>
          </div>
          <div className="space-y-2">
            {desirePhrases.map((phrase, index) => (
              <div
                key={index}
                className="flex items-start gap-2 p-3 bg-green-50/50 rounded-lg"
              >
                <span className="text-green-400 mt-0.5 font-serif">&ldquo;</span>
                <span className="text-gray-700 italic flex-1">{phrase}</span>
                <span className="text-green-400 mt-0.5 font-serif">&rdquo;</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-green-100">
            <p className="text-xs text-gray-500">
              <strong>Use in:</strong> Solution positioning, benefit statements, CTAs
            </p>
          </div>
        </Card>

        {/* Search Language */}
        <Card padding="md" className="border-blue-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Search Language</h3>
              <p className="text-xs text-gray-500">How they Google for solutions</p>
            </div>
          </div>
          <div className="space-y-2">
            {searchPhrases.map((phrase, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-blue-50/50 rounded-lg"
              >
                <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-gray-700">{phrase}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-blue-100">
            <p className="text-xs text-gray-500">
              <strong>Use in:</strong> SEO keywords, ad targeting, content topics
            </p>
          </div>
        </Card>

        {/* Emotional Triggers */}
        <Card padding="md" className="border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Emotional Triggers</h3>
              <p className="text-xs text-gray-500">Words that resonate emotionally</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {emotionalTriggers.map((trigger, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-purple-100/50 text-purple-700 text-sm rounded-full font-medium"
              >
                {trigger}
              </span>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-purple-100">
            <p className="text-xs text-gray-500">
              <strong>Use in:</strong> Power words throughout all copy, CTAs, testimonials
            </p>
          </div>
        </Card>
      </div>

      {/* Usage Guide */}
      <Card padding="md" className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <h3 className="font-semibold text-gray-900 mb-3">How to Use This Language Map</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-1">
            <h4 className="font-medium text-amber-800">Headlines & Hooks</h4>
            <p className="text-gray-600">Lead with Pain Language to grab attention, then pivot to Desire Language</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-amber-800">SEO & Ads</h4>
            <p className="text-gray-600">Target Search Language for keywords and ad copy that matches intent</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-amber-800">Emotional Resonance</h4>
            <p className="text-gray-600">Sprinkle Emotional Triggers throughout to amplify connection</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export { ThemCentricLanguageView };
export type { ThemCentricLanguageViewProps };
