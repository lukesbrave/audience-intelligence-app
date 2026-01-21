'use client';

import { CommunicationPrefs } from '@/lib/types';

interface CommunicationPrefsCardProps {
  preferences: CommunicationPrefs;
}

// Channel icons mapping
const channelIcons: Record<string, string> = {
  email: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  phone: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z',
  linkedin: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z',
  twitter: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
  slack: 'M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z',
  chat: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
  social: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
};

// Format icons mapping
const formatIcons: Record<string, string> = {
  video: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
  article: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
  webinar: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  podcast: 'M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z',
  infographic: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  blog: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
  newsletter: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
  whitepaper: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
};

function getIcon(name: string, iconMap: Record<string, string>): string {
  const normalizedName = name.toLowerCase();
  for (const [key, path] of Object.entries(iconMap)) {
    if (normalizedName.includes(key)) {
      return path;
    }
  }
  // Default icon
  return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
}

function CommunicationPrefsCard({ preferences }: CommunicationPrefsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
          <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
          Communication Preferences
        </h3>
      </div>

      <div className="space-y-4">
        {/* Channels */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Preferred Channels</p>
          <div className="flex flex-wrap gap-2">
            {preferences.channels.map((channel, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-[#BBDCEF]/20 text-[#16314C]"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(channel, channelIcons)} />
                </svg>
                {channel}
              </span>
            ))}
          </div>
        </div>

        {/* Content Formats */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Content Formats</p>
          <div className="flex flex-wrap gap-2">
            {preferences.contentFormats.map((format, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getIcon(format, formatIcons)} />
                </svg>
                {format}
              </span>
            ))}
          </div>
        </div>

        {/* Tone Preference */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Tone Preference</p>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>Professional</span>
              <span>Casual</span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full">
              {/* Visual indicator based on tone */}
              <div
                className="absolute h-full bg-gradient-to-r from-[#16314C] to-[#BBDCEF] rounded-full"
                style={{
                  width: preferences.tonePreference.toLowerCase().includes('professional')
                    ? '30%'
                    : preferences.tonePreference.toLowerCase().includes('casual')
                      ? '70%'
                      : '50%',
                }}
              />
              <div
                className="absolute w-4 h-4 bg-white border-2 border-[#16314C] rounded-full -top-1 transform -translate-x-1/2"
                style={{
                  left: preferences.tonePreference.toLowerCase().includes('professional')
                    ? '30%'
                    : preferences.tonePreference.toLowerCase().includes('casual')
                      ? '70%'
                      : '50%',
                }}
              />
            </div>
            <p className="text-sm text-gray-700 mt-2 text-center font-medium">
              {preferences.tonePreference}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { CommunicationPrefsCard };
export type { CommunicationPrefsCardProps };
