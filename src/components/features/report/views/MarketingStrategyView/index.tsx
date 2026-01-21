'use client';

import { RichTextDisplay } from '@/components/ui';
import { StrategyCard } from './StrategyCard';
import { ChannelGrid, Channel } from './ChannelGrid';

interface MarketingStrategyViewProps {
  strategy: string;
}

// Extract recommendations from markdown content
function extractRecommendations(content: string): { text: string; impact: 'high' | 'medium' | 'low' }[] {
  const recommendations: { text: string; impact: 'high' | 'medium' | 'low' }[] = [];

  // Skip phrases that indicate meta-content or AI commentary
  const skipPhrases = [
    'high in',
    'keywords',
    'i need to',
    'i cannot',
    'search results',
    'available to me',
    'based on the',
    'according to'
  ];

  // Split by common list patterns
  const lines = content.split('\n');

  for (const line of lines) {
    let cleanLine = line.replace(/^[-*•\d.)\s]+/, '').trim();
    // Remove bold markers and asterisks
    cleanLine = cleanLine.replace(/\*\*/g, '').replace(/\*/g, '').trim();
    // Remove parentheticals that might contain meta info
    cleanLine = cleanLine.replace(/\([^)]*keyword[^)]*\)/gi, '').trim();
    cleanLine = cleanLine.replace(/\([^)]*high in[^)]*\)/gi, '').trim();

    // Skip if too short or looks like a header
    if (cleanLine.length < 20 || cleanLine.startsWith('#')) continue;
    if (cleanLine.length > 300) continue;

    // Skip lines that contain meta-commentary
    const lowerLine = cleanLine.toLowerCase();
    if (skipPhrases.some(phrase => lowerLine.includes(phrase) && cleanLine.length < 80)) continue;

    // Determine impact based on keywords
    let impact: 'high' | 'medium' | 'low' = 'medium';

    if (
      lowerLine.includes('critical') ||
      lowerLine.includes('essential') ||
      lowerLine.includes('priority') ||
      lowerLine.includes('primary') ||
      lowerLine.includes('key') ||
      lowerLine.includes('must')
    ) {
      impact = 'high';
    } else if (
      lowerLine.includes('consider') ||
      lowerLine.includes('optional') ||
      lowerLine.includes('secondary') ||
      lowerLine.includes('later') ||
      lowerLine.includes('long-term')
    ) {
      impact = 'low';
    }

    // Check if this looks like a recommendation
    if (
      lowerLine.includes('recommend') ||
      lowerLine.includes('should') ||
      lowerLine.includes('focus') ||
      lowerLine.includes('leverage') ||
      lowerLine.includes('create') ||
      lowerLine.includes('develop') ||
      lowerLine.includes('implement') ||
      lowerLine.includes('use ') ||
      lowerLine.includes('target') ||
      lowerLine.includes('optimize') ||
      line.match(/^[-*•\d.)]/)
    ) {
      recommendations.push({ text: cleanLine, impact });
    }
  }

  // Sort by impact
  const order = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => order[a.impact] - order[b.impact]);

  return recommendations.slice(0, 8);
}

// Extract channel mentions from content
function extractChannels(content: string): Channel[] {
  const channelKeywords: Record<string, string[]> = {
    'LinkedIn': ['linkedin', 'li'],
    'Twitter/X': ['twitter', 'tweet', ' x '],
    'Email': ['email', 'newsletter', 'mail'],
    'Content Marketing': ['content', 'blog', 'article'],
    'SEO': ['seo', 'search engine', 'organic search'],
    'Paid Ads': ['paid', 'advertising', 'ppc', 'ads'],
    'Video': ['video', 'youtube', 'vimeo'],
    'Podcast': ['podcast'],
    'Webinars': ['webinar'],
    'Community': ['community', 'forum', 'discord', 'slack'],
    'Reddit': ['reddit', 'subreddit'],
    'Social Media': ['social media', 'social platform'],
  };

  const lowerContent = content.toLowerCase();
  const channels: Channel[] = [];

  for (const [name, keywords] of Object.entries(channelKeywords)) {
    let count = 0;
    for (const keyword of keywords) {
      const matches = lowerContent.split(keyword).length - 1;
      count += matches;
    }
    if (count > 0) {
      channels.push({ name, mentioned: count });
    }
  }

  return channels.filter(c => c.mentioned > 0).sort((a, b) => b.mentioned - a.mentioned);
}

function MarketingStrategyView({ strategy }: MarketingStrategyViewProps) {
  const recommendations = extractRecommendations(strategy);
  const channels = extractChannels(strategy);

  const highImpact = recommendations.filter(r => r.impact === 'high');
  const otherRecs = recommendations.filter(r => r.impact !== 'high');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketing Strategy</h1>
        <p className="text-sm text-gray-500 mt-1">
          Actionable recommendations based on your research findings
        </p>
      </div>

      {/* Top Recommendations */}
      {highImpact.length > 0 && (
        <div className="bg-red-50/50 rounded-xl border border-red-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              High Priority Recommendations
            </h3>
          </div>
          <div className="space-y-3">
            {highImpact.map((rec, i) => (
              <StrategyCard
                key={i}
                recommendation={rec.text}
                impact={rec.impact}
                index={i + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Recommendations */}
      {otherRecs.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Additional Recommendations
          </h3>
          <div className="space-y-3">
            {otherRecs.map((rec, i) => (
              <StrategyCard
                key={i}
                recommendation={rec.text}
                impact={rec.impact}
                index={highImpact.length + i + 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Channel Recommendations */}
      {channels.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Channel Recommendations
            </h3>
            <span className="text-sm text-gray-500">
              {channels.length} channel{channels.length !== 1 ? 's' : ''} identified
            </span>
          </div>
          <ChannelGrid channels={channels} />
        </div>
      )}

      {/* Detailed Strategy */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Full Strategy Details
        </h3>
        <div className="prose prose-gray max-w-none">
          <RichTextDisplay content={strategy} />
        </div>
      </div>
    </div>
  );
}

export { MarketingStrategyView };
export type { MarketingStrategyViewProps };
