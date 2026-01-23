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

export const ResearchOutputSchema = z.object({
  urgencyGateway: UrgencyGatewaySchema,
  painPoints: z.array(PainPointSchema),
  languageMap: LanguageMapSchema,
  congregationPoints: CongregationPointsSchema,
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
  universalMotivatorsUsed: z.array(z.string()).describe('2-3 from: wealth, looks, health, popularity, security, inner_peace, free_time, fun'),
  templateUsed: OfferStatementTemplateSchema.describe('Which template the AI chose'),
})

export const ProgramNameOptionSchema = z.object({
  name: z.string().describe('The program/offer name'),
  uniqueMechanism: z.string().describe('The proprietary method name like "The 5-Day Momentum Method"'),
  rationale: z.string().describe('Why this name resonates with the audience'),
})

export const OfferCoreOutputSchema = z.object({
  offerStatement: OfferStatementSchema,
  theOfferGivesYou: z.array(z.string()).min(3).max(5).describe('What they GET - tangible benefits'),
  youCanUseItTo: z.array(z.string()).min(3).max(5).describe('Specific applications and use cases'),
  hiddenBenefits: z.array(z.string()).min(2).max(3).describe('Unexpected secondary transformations'),
  programNameOptions: z.array(ProgramNameOptionSchema).min(2).max(3).describe('Program name suggestions'),
})

export type OfferStatement = z.infer<typeof OfferStatementSchema>
export type ProgramNameOption = z.infer<typeof ProgramNameOptionSchema>
export type OfferCoreOutput = z.infer<typeof OfferCoreOutputSchema>
export type OfferStatementTemplate = z.infer<typeof OfferStatementTemplateSchema>
