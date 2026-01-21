'use client';

import { ThemCentricLanguage } from '@/lib/types';
import { LanguageGrid, CopyButton } from '@/components/ui';

interface YourMessageSectionProps {
  language?: ThemCentricLanguage;
  focusSection?: 'pain' | 'desire' | 'search' | 'triggers';
}

function YourMessageSection({ language, focusSection }: YourMessageSectionProps) {
  if (!language) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No Language Data Available</h3>
        <p className="text-gray-400 text-sm">
          Language insights weren&apos;t captured in this research.
        </p>
      </div>
    );
  }

  const { painPhrases, desirePhrases, searchPhrases, emotionalTriggers } = language;

  // If focusing on a specific section (library view)
  if (focusSection === 'search') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Search Behaviour</h1>
          <p className="text-sm text-gray-400 mt-1">
            What they type into Google, YouTube & ChatGPT
          </p>
        </div>

        <div className="bg-[#243351] rounded-xl border border-blue-500/20 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span>🔍</span>
              <h3 className="text-sm font-semibold text-white">Search Language</h3>
            </div>
            <CopyButton text={searchPhrases || []} label="Copy All" variant="full" />
          </div>

          <div className="space-y-2">
            {(searchPhrases || []).map((phrase, i) => (
              <div
                key={i}
                className="group flex items-center justify-between gap-3 px-4 py-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:border-blue-500/40 transition-colors"
              >
                <span className="text-sm text-gray-300">&ldquo;{phrase}&rdquo;</span>
                <CopyButton
                  text={phrase}
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-[#1a2744] rounded-lg">
            <p className="text-xs text-gray-400">
              <span className="font-medium text-gray-300">Use in:</span> SEO titles, YouTube
              thumbnails, ad targeting, content topics
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Your Message</h1>
        <p className="text-sm text-gray-400 mt-1">
          The exact words your audience uses — steal these
        </p>
      </div>

      {/* Why This Matters */}
      <div className="bg-gradient-to-br from-[#243351] to-[#1e3a5f] rounded-xl border border-[#BBDCEF]/20 p-6">
        <div className="flex items-start gap-3">
          <span className="text-lg">💡</span>
          <div>
            <h3 className="text-sm font-semibold text-white mb-2">Why This Matters</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your audience&apos;s brain is wired to ask &ldquo;what&apos;s in it for me?&rdquo;
              When your marketing uses their exact words, they feel understood. This shifts you
              from &ldquo;salesy&rdquo; to &ldquo;this brand gets me.&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Language Grids */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#243351] rounded-xl border border-red-500/20 p-5">
          <LanguageGrid
            phrases={painPhrases || []}
            type="pain"
            title="Pain Language"
            description="How they describe their frustrations"
          />
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400">
              <span className="font-medium text-gray-300">Use in:</span> Headlines, hooks, email
              subject lines
            </p>
          </div>
        </div>

        <div className="bg-[#243351] rounded-xl border border-green-500/20 p-5">
          <LanguageGrid
            phrases={desirePhrases || []}
            type="desire"
            title="Desire Language"
            description="How they describe what they want"
          />
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400">
              <span className="font-medium text-gray-300">Use in:</span> CTAs, benefits, solution
              positioning
            </p>
          </div>
        </div>
      </div>

      {/* Search Language */}
      <div className="bg-[#243351] rounded-xl border border-blue-500/20 p-5">
        <LanguageGrid
          phrases={searchPhrases || []}
          type="search"
          title="Search Language"
          description="What they type into Google, YouTube & ChatGPT"
        />
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-400">
            <span className="font-medium text-gray-300">Use in:</span> SEO titles, YouTube
            thumbnails, ad targeting
          </p>
        </div>
      </div>

      {/* Emotional Triggers */}
      {emotionalTriggers && emotionalTriggers.length > 0 && (
        <div className="bg-[#243351] rounded-xl border border-purple-500/20 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Emotional Triggers
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">Words that resonate deeply</p>
            </div>
            <CopyButton text={emotionalTriggers} label="Copy All" variant="full" />
          </div>

          <div className="flex flex-wrap gap-2">
            {emotionalTriggers.map((trigger, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300"
              >
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Ready-to-Use Hooks section placeholder */}
      <div className="bg-[#243351] rounded-xl border border-white/10 p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
          Ready-to-Use Hooks
        </p>
        <p className="text-sm text-gray-400">
          Generate your offer to unlock messaging frameworks (Hook, Agitate, Solution).
        </p>
      </div>
    </div>
  );
}

export { YourMessageSection };
export type { YourMessageSectionProps };
