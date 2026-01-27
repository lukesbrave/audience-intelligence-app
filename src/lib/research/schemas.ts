import { z } from 'zod'

// ============================================
// Step 1: Research Output Schema
// ============================================

export const UrgencyGatewaySchema = z.object({
  problem: z.string().describe('The #1 most pressing problem'),
  whyUrgent: z.string().describe('Why this problem cannot wait'),
  failedSolutions: z.array(z.string()).describe('Solutions they have tried that did not work'),
  aspirinSolution: z.string().describe('The quick win that would give immediate relief'),
})

export const PainPointSchema = z.object({
  pain: z.string().describe('The specific pain point'),
  severity: z.enum(['critical', 'moderate', 'minor']).describe('How severe this pain is'),
  emotionalContext: z.string().describe('How this makes them feel emotionally'),
  realQuotes: z.array(z.string()).describe('Actual quotes from forums, Reddit, etc.'),
})

export const LanguageMapSchema = z.object({
  painPhrases: z.array(z.string()).describe('Exact phrases they use for frustrations'),
  desirePhrases: z.array(z.string()).describe('Exact phrases they use for desires'),
  searchPhrases: z.array(z.string()).describe('Actual Google searches they make'),
  emotionalTriggers: z.array(z.string()).describe('Words that resonate deeply'),
})

export const SubredditSchema = z.object({
  name: z.string().describe('Subreddit name like r/subreddit'),
  subscribers: z.string().describe('Subscriber count like 100K'),
  relevance: z.string().describe('Why this subreddit is relevant'),
})

export const YouTubeChannelSchema = z.object({
  name: z.string().describe('Channel name'),
  subscribers: z.string().describe('Subscriber count'),
})

export const CongregationPointsSchema = z.object({
  subreddits: z.array(SubredditSchema).describe('Relevant subreddits'),
  youtubeChannels: z.array(YouTubeChannelSchema).describe('YouTube channels they watch'),
  podcasts: z.array(z.string()).describe('Podcasts they listen to'),
  influencers: z.array(z.string()).describe('Trusted voices and thought leaders'),
  otherCommunities: z.array(z.string()).describe('Facebook groups, Discord servers, forums'),
})

// Marketing Platform Recommendation
export const PlatformRecommendationSchema = z.object({
  platform: z.string().describe('Platform name: LinkedIn, YouTube, Instagram, TikTok, Twitter/X, Reddit, Facebook, Podcast, Newsletter'),
  reasoning: z.string().describe('Why this platform is ideal for this specific audience'),
  contentFormats: z.array(z.string()).describe('Recommended content types: short-form video, long-form articles, carousels, live streams, stories, podcasts'),
  postingCadence: z.string().describe('Suggested posting frequency'),
})

export const MarketingRecommendationSchema = z.object({
  primaryPlatform: PlatformRecommendationSchema.describe('The #1 platform to focus on first'),
  secondaryPlatforms: z.array(PlatformRecommendationSchema).max(2).describe('1-2 secondary platforms'),
  contentStrategyTips: z.array(z.string()).describe('3-5 actionable content tips for this audience'),
  quickWin: z.string().describe('One specific action to take this week'),
})

export type PlatformRecommendation = z.infer<typeof PlatformRecommendationSchema>
export type MarketingRecommendation = z.infer<typeof MarketingRecommendationSchema>

export const CompetitorSchema = z.object({
  name: z.string().describe('Competitor or solution name'),
  positioning: z.string().describe('How they position themselves'),
  complaints: z.array(z.string()).describe('Customer complaints about this solution'),
})

export const CompetitiveLandscapeSchema = z.object({
  existingSolutions: z.array(CompetitorSchema).describe('Existing solutions in the market'),
  marketGaps: z.array(z.string()).describe('Underserved needs in the market'),
  positioningOpportunities: z.array(z.string()).describe('Ways to differentiate'),
})

export const AudienceStateSchema = z.object({
  currentState: z.string().describe('Where the audience is NOW - their current reality, struggles, and daily situation'),
  desiredState: z.string().describe('Where they WANT to be - their ideal future, dreams, and aspirations'),
})

export const ResearchOutputSchema = z.object({
  audienceState: AudienceStateSchema.describe('The transformation journey from current to desired state'),
  urgencyGateway: UrgencyGatewaySchema,
  painPoints: z.array(PainPointSchema).min(5).max(8).describe('5-8 validated pain points from real conversations'),
  languageMap: LanguageMapSchema,
  congregationPoints: CongregationPointsSchema,
  marketingRecommendation: MarketingRecommendationSchema.describe('Strategic marketing platform recommendation'),
  competitiveLandscape: CompetitiveLandscapeSchema,
})

export type ResearchOutput = z.infer<typeof ResearchOutputSchema>

// ============================================
// Step 2: Brand Angles Schema
// ============================================

export const BrandAngleSchema = z.object({
  name: z.string().describe('The memorable angle name like "The Anti-Hustle Coach"'),
  tagline: z.string().describe('One sentence that captures the essence'),
  targetPain: z.string().describe('Which pain point this addresses'),
  targetDesire: z.string().describe('Which desire this fulfills'),
  tone: z.string().describe('The voice and personality this suggests'),
  whyItWorks: z.string().describe('Why this would resonate with the audience'),
  contentThemes: z.array(z.string()).describe('Types of content this angle would create'),
})

export const AnglesOutputSchema = z.object({
  angles: z.array(BrandAngleSchema).min(3).max(4),
})

export type BrandAngle = z.infer<typeof BrandAngleSchema>
export type AnglesOutput = z.infer<typeof AnglesOutputSchema>

// ============================================
// Step 3: Hooks Schema
// ============================================

export const HookCategorySchema = z.enum([
  'pain_agitation',
  'contrarian',
  'curiosity',
  'identity',
  'transformation',
])

export const HookSchema = z.object({
  text: z.string().describe('The hook text exactly as it would appear'),
  category: HookCategorySchema.describe('The type of hook'),
  targetEmotion: z.string().describe('What feeling this triggers'),
  followUpIdea: z.string().describe('Brief content idea this could lead to'),
})

export const HooksOutputSchema = z.object({
  hooks: z.array(HookSchema).min(45).max(55), // Allow some flexibility
})

export type Hook = z.infer<typeof HookSchema>
export type HooksOutput = z.infer<typeof HooksOutputSchema>

// ============================================
// User Ratings (for swipe interface)
// ============================================

export type HookRating = 'like' | 'love' | 'skip'

export interface RatedHook extends Hook {
  rating: HookRating
}

// ============================================
// Step 5: Offer Core Schema
// ============================================

export const OfferStatementTemplateSchema = z.enum([
  'superlative_mechanism',
  'transformation',
  'problem_solution',
  'identity',
  'contrast',
  'result',
])

export const OfferStatementSchema = z.object({
  finalStatement: z.string().describe('The complete offer statement'),
  emotionalCore: z.string().describe('The underlying emotional transformation (relief, excitement, confidence)'),
  universalMotivatorsUsed: z.array(z.string()).describe('2-3 motivators from: wealth, looks, health, popularity, security, inner_peace, free_time, fun'),
  templateUsed: z.string().describe('Which template was used: superlative_mechanism, transformation, problem_solution, identity, contrast, or result'),
})

export const ProgramNameOptionSchema = z.object({
  name: z.string().describe('The program/offer name'),
  uniqueMechanism: z.string().describe('The proprietary method name like "The 5-Day Momentum Method"'),
  rationale: z.string().describe('Why this name resonates with the audience'),
})

export const OfferCoreOutputSchema = z.object({
  offerStatement: OfferStatementSchema,
  theOfferGivesYou: z.array(z.string()).describe('3-5 tangible benefits - what they GET'),
  youCanUseItTo: z.array(z.string()).describe('3-5 specific applications and use cases'),
  hiddenBenefits: z.array(z.string()).describe('2-3 unexpected secondary transformations'),
  programNameOptions: z.array(ProgramNameOptionSchema).describe('2-3 program name suggestions'),
})

export type OfferStatement = z.infer<typeof OfferStatementSchema>
export type ProgramNameOption = z.infer<typeof ProgramNameOptionSchema>
export type OfferCoreOutput = z.infer<typeof OfferCoreOutputSchema>
export type OfferStatementTemplate = z.infer<typeof OfferStatementTemplateSchema>

// ============================================
// Focus Group Insights Schema
// ============================================

export const FocusGroupQuoteSchema = z.object({
  quote: z.string().describe('Direct quote from the focus group participant'),
  context: z.string().describe('What prompted this statement or what they were discussing'),
  emotion: z.string().describe('The apparent emotion (frustration, excitement, hope, etc.)'),
})

export const FocusGroupPainPointSchema = z.object({
  pain: z.string().describe('The pain point or frustration mentioned'),
  frequency: z.enum(['mentioned_once', 'recurring', 'dominant_theme']).describe('How often this came up'),
  exactPhrases: z.array(z.string()).describe('Exact words/phrases used to describe this pain'),
})

export const FocusGroupInsightsSchema = z.object({
  directQuotes: z.array(FocusGroupQuoteSchema).describe('Powerful direct quotes revealing pain, desire, or emotion'),
  painPoints: z.array(FocusGroupPainPointSchema).describe('Pain points mentioned with frequency indicators'),
  desireStatements: z.array(z.string()).describe('What they want, hope for, or dream about - in their words'),
  vocabularyPatterns: z.array(z.string()).describe('Distinctive words, phrases, jargon, or slang they use'),
  urgencyIndicators: z.array(z.string()).describe('Problems that seemed most pressing or generated most energy'),
})

export type FocusGroupQuote = z.infer<typeof FocusGroupQuoteSchema>
export type FocusGroupPainPoint = z.infer<typeof FocusGroupPainPointSchema>
export type FocusGroupInsights = z.infer<typeof FocusGroupInsightsSchema>
