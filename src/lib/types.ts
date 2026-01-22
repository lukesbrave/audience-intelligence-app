// Types for the Deep Research Agent API

export interface ResearchRequest {
  email: string;
  pdfBase64: string;
  pdfFilename: string;
  businessContext: string;
  researchPriority: string;
}

export interface Demographics {
  ageRange: string;
  locations: string[];
  jobTitles: string[];
  industry: string;
  incomeLevel: string;
}

export interface PainPoint {
  pain: string;
  severity: 'critical' | 'moderate' | 'minor';
  classification?: 'URGENCY_GATEWAY' | 'ROOT_CAUSE' | 'SECONDARY';
  emotionalContext: string;
  details: string;
}

// Urgency Gateway - The #1 most pressing problem (the "aspirin")
export interface UrgencyGateway {
  problem: string;
  whyUrgent: string;
  emotionalState: string;
  aspirinSolution: string;
}

// Them-Centric Language - Exact words your audience uses
export interface ThemCentricLanguage {
  painPhrases: string[];
  desirePhrases: string[];
  searchPhrases: string[];
  emotionalTriggers: string[];
}

export interface Goal {
  goal: string;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  successMetric: string;
}

export interface CommunicationPrefs {
  channels: string[];
  contentFormats: string[];
  tonePreference: string;
}

export interface AudienceProfile {
  demographics: Demographics;
  painPoints: PainPoint[];
  goals: Goal[];
  currentSolutions: string[];
  decisionFactors: string[];
  communicationPrefs: CommunicationPrefs;
  urgencyGateway?: UrgencyGateway;
  themCentricLanguage?: ThemCentricLanguage;
}

export interface ResearchFinding {
  phase: number;
  phaseName: string;
  phaseDescription: string;
  findings: string;
  citations: string[];
}

export interface FrontendReport {
  success: boolean;
  generatedAt: string;
  audienceProfile: AudienceProfile;
  researchFindings: ResearchFinding[];
  synthesis: string;
  marketingStrategy: string;
}

export interface ResearchResponse {
  success: boolean;
  message: string;
  generatedAt: string;
  googleDocUrl?: string;
  // Presentation URLs (from Google Apps Script)
  presentationUrl?: string;
  presentationEmbedUrl?: string;
  presentationExportUrl?: string;
  // Legacy Gamma fields (deprecated)
  gammaUrl?: string;
  gammaEmbedUrl?: string;
  gammaDownloadUrl?: string;
  gammaStatus?: 'processing' | 'completed' | 'error';
  report: FrontendReport;
}

export const RESEARCH_PRIORITIES = [
  'All Areas (Recommended)',
  'Pain Point Validation',
  'Community Discovery',
  'Content & Influencer Mapping',
  'Search Behavior Analysis',
] as const;

export type ResearchPriority = typeof RESEARCH_PRIORITIES[number];

// ============================================
// Offer Builder Types
// ============================================

export interface UrgencyGatewayOffer {
  problem: string;
  aspirin: string;
  promise: string;
  entryCommitment: string;
}

export interface MessagingFramework {
  hook: string;
  agitate: string;
  solution: string;
}

export interface ValueLadderStage {
  stage: number;
  stageName: string;
  problem: string;
  offer: string;
  pricePoint: string;
  outcome: string;
}

export interface OfferBuilderResponse {
  success: boolean;
  generatedAt: string;
  urgencyGatewayOffer: UrgencyGatewayOffer;
  messagingFramework: MessagingFramework;
  valueLadder: ValueLadderStage[];
  channelStrategy?: {
    tier1: string[];
    tier2: string[];
    tier3: string[];
  };
  quickWins?: string[];
}

export interface OfferBuilderRequest {
  audienceProfile: AudienceProfile;
  synthesis: string;
  marketingStrategy: string;
  businessContext?: string;
}
