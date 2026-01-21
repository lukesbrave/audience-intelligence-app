'use client';

import { CommunicationPrefs } from '@/lib/types';
import { ChannelCard, ChannelListItem } from '@/components/ui';

interface YourChannelsSectionProps {
  communicationPrefs: CommunicationPrefs;
  marketingStrategy: string;
  isLibraryView?: boolean;
}

interface ParsedChannel {
  name: string;
  priority: 'tier1' | 'tier2' | 'tier3';
  why?: string;
  whatWorks?: string[];
}

function YourChannelsSection({
  communicationPrefs,
  marketingStrategy,
  isLibraryView = false,
}: YourChannelsSectionProps) {
  const channels = parseChannels(communicationPrefs.channels || [], marketingStrategy);

  const tier1 = channels.filter((c) => c.priority === 'tier1');
  const tier2 = channels.filter((c) => c.priority === 'tier2');
  const tier3 = channels.filter((c) => c.priority === 'tier3');

  const influencers = parseInfluencers(marketingStrategy);

  if (isLibraryView) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Congregation Analysis</h1>
          <p className="text-sm text-gray-400 mt-1">
            Where your audience gathers and who they trust
          </p>
        </div>

        <div className="bg-[#243351] rounded-xl border border-white/10 p-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
            All Channels
          </h3>
          <div className="space-y-2">
            {channels.map((channel, i) => (
              <ChannelListItem key={i} name={channel.name} description={channel.why} />
            ))}
          </div>
        </div>

        {influencers.length > 0 && (
          <div className="bg-[#243351] rounded-xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Influencers & Trusted Voices
            </h3>
            <div className="flex flex-wrap gap-2">
              {influencers.map((name, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-[#1a2744] border border-white/10 rounded-full text-sm text-gray-300"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {communicationPrefs.contentFormats && communicationPrefs.contentFormats.length > 0 && (
          <div className="bg-[#243351] rounded-xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Preferred Content Formats
            </h3>
            <div className="flex flex-wrap gap-2">
              {communicationPrefs.contentFormats.map((format, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-[#BBDCEF]/10 border border-[#BBDCEF]/20 rounded-full text-sm text-[#BBDCEF]"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Your Channels</h1>
        <p className="text-sm text-gray-400 mt-1">
          Where your audience already gathers — show up here
        </p>
      </div>

      {/* Tier 1 - Primary Channels */}
      {tier1.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span>🎯</span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Primary Channels
            </p>
            <span className="text-xs text-gray-500">Focus your energy here first</span>
          </div>
          <div className="grid gap-4">
            {tier1.map((channel, i) => (
              <ChannelCard
                key={i}
                name={channel.name}
                priority="tier1"
                why={channel.why}
                whatWorks={channel.whatWorks}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tier 2 - Secondary Channels */}
      {tier2.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span>📰</span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Secondary Channels
            </p>
            <span className="text-xs text-gray-500">Expand here once primary channels work</span>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tier2.map((channel, i) => (
              <ChannelCard
                key={i}
                name={channel.name}
                priority="tier2"
                why={channel.why}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tier 3 - Additional Channels */}
      {tier3.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span>📌</span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Additional Channels
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {tier3.map((channel, i) => (
              <ChannelListItem key={i} name={channel.name} description={channel.why} />
            ))}
          </div>
        </div>
      )}

      {/* Who They Listen To */}
      {influencers.length > 0 && (
        <div className="bg-[#243351] rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span>👂</span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Who They Listen To
            </p>
          </div>
          <p className="text-sm text-gray-400 mb-4">Trusted voices and content sources</p>
          <div className="flex flex-wrap gap-2">
            {influencers.map((name, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-[#1a2744] border border-white/10 rounded-full text-sm text-gray-300"
              >
                {name}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Consider: Guest posts, sponsorships, or referencing these voices in your content.
          </p>
        </div>
      )}

      {/* Content Formats */}
      {communicationPrefs.contentFormats && communicationPrefs.contentFormats.length > 0 && (
        <div className="bg-[#243351] rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span>📝</span>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Content Formats They Prefer
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {communicationPrefs.contentFormats.map((format, i) => (
              <span
                key={i}
                className="px-3 py-1.5 bg-[#BBDCEF]/10 border border-[#BBDCEF]/20 rounded-full text-sm text-[#BBDCEF]"
              >
                {format}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function parseChannels(channels: string[], marketingStrategy: string): ParsedChannel[] {
  const tier1Keywords = ['linkedin', 'discord', 'slack', 'twitter', 'x.com'];
  const tier2Keywords = ['youtube', 'substack', 'reddit', 'newsletter', 'podcast'];

  const result: ParsedChannel[] = [];
  const seen = new Set<string>();

  for (const channel of channels) {
    const lower = channel.toLowerCase();
    if (seen.has(lower)) continue;
    seen.add(lower);

    let priority: 'tier1' | 'tier2' | 'tier3' = 'tier3';
    if (tier1Keywords.some((k) => lower.includes(k))) priority = 'tier1';
    else if (tier2Keywords.some((k) => lower.includes(k))) priority = 'tier2';

    result.push({
      name: channel,
      priority,
      why: extractChannelContext(channel, marketingStrategy),
      whatWorks: priority === 'tier1' ? extractWhatWorks(channel, marketingStrategy) : undefined,
    });
  }

  // Sort by priority
  return result.sort((a, b) => {
    const order = { tier1: 0, tier2: 1, tier3: 2 };
    return order[a.priority] - order[b.priority];
  });
}

function extractChannelContext(channel: string, strategy: string): string | undefined {
  const lower = channel.toLowerCase();
  const lines = strategy.split('\n');

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].toLowerCase().includes(lower)) {
      // Get surrounding context
      const context = lines.slice(i, i + 2).join(' ').replace(/\*\*/g, '').replace(/\*/g, '');
      if (context.length > 20 && context.length < 200) {
        return context.trim();
      }
    }
  }
  return undefined;
}

function extractWhatWorks(channel: string, strategy: string): string[] | undefined {
  const whatWorks: string[] = [];
  const lower = channel.toLowerCase();
  const lines = strategy.split('\n');

  let inChannelSection = false;
  for (const line of lines) {
    if (line.toLowerCase().includes(lower)) {
      inChannelSection = true;
      continue;
    }
    if (inChannelSection) {
      const clean = line.replace(/^[-•*]\s*/, '').replace(/\*\*/g, '').trim();
      if (clean.length > 10 && clean.length < 100) {
        whatWorks.push(clean);
      }
      if (whatWorks.length >= 4 || (line.trim() === '' && whatWorks.length > 0)) {
        break;
      }
    }
  }

  return whatWorks.length > 0 ? whatWorks : undefined;
}

function parseInfluencers(strategy: string): string[] {
  const influencers: string[] = [];
  const influencerKeywords = ['newsletter', 'podcast', 'influencer', 'follow', 'listen to'];

  const lines = strategy.split('\n');
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (influencerKeywords.some((k) => lower.includes(k))) {
      // Extract names (often in quotes or after colons)
      const matches = line.match(/"([^"]+)"|'([^']+)'|:\s*([A-Z][a-zA-Z\s]+)/g);
      if (matches) {
        for (const match of matches) {
          const clean = match.replace(/["':]/g, '').trim();
          if (clean.length > 3 && clean.length < 50 && !influencers.includes(clean)) {
            influencers.push(clean);
          }
        }
      }
    }
  }

  return influencers.slice(0, 10);
}

export { YourChannelsSection };
export type { YourChannelsSectionProps };
