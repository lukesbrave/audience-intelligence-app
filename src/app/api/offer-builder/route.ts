import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { OfferBuilderRequest, AudienceProfile } from '@/lib/types';

// Transform research data into format expected by Offer Builder workflow
function transformResearchToOfferInput(data: OfferBuilderRequest) {
  const { audienceProfile, synthesis, marketingStrategy, businessContext } = data;

  // Extract pain points in the format the workflow expects
  const painPoints = audienceProfile.painPoints.map((p) => ({
    pain: p.pain,
    emotionalContext: p.emotionalContext,
    severity: p.severity,
    classification: p.classification,
  }));

  // Extract desired outcomes from goals
  const desiredOutcomes = audienceProfile.goals.map((g) => ({
    outcome: g.goal,
    timeframe: g.timeframe,
    successMetric: g.successMetric,
    priority: g.priority,
  }));

  // Build language phrases from them-centric language if available
  const languagePhrases: string[] = [];
  if (audienceProfile.themCentricLanguage) {
    languagePhrases.push(...audienceProfile.themCentricLanguage.painPhrases);
    languagePhrases.push(...audienceProfile.themCentricLanguage.desirePhrases);
  }

  // Build target audience description
  const { demographics } = audienceProfile;
  const targetAudience = {
    who: `${demographics.jobTitles.join(', ')} in ${demographics.industry}`,
    currentSituation: `Currently using ${audienceProfile.currentSolutions.join(', ')}`,
    ageRange: demographics.ageRange,
    locations: demographics.locations.join(', '),
    incomeLevel: demographics.incomeLevel,
  };

  // Include urgency gateway context if available
  let urgencyGatewayContext = '';
  if (audienceProfile.urgencyGateway) {
    urgencyGatewayContext = `
URGENCY GATEWAY (Most pressing problem):
- Problem: ${audienceProfile.urgencyGateway.problem}
- Why Urgent: ${audienceProfile.urgencyGateway.whyUrgent}
- Emotional State: ${audienceProfile.urgencyGateway.emotionalState}
- Aspirin Solution: ${audienceProfile.urgencyGateway.aspirinSolution}
`;
  }

  return {
    businessName: businessContext || 'Your Brand',
    targetAudience,
    painPoints,
    desiredOutcomes,
    decisionFactors: audienceProfile.decisionFactors,
    currentAlternatives: audienceProfile.currentSolutions.join(', '),
    languagePhrases,
    commonObjections: [], // Could be extracted from synthesis if available
    // Additional context for the workflow
    urgencyGatewayContext,
    synthesisContext: synthesis,
    marketingStrategyContext: marketingStrategy,
  };
}

export async function POST(request: Request) {
  try {
    // Validate authentication
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('ai-auth');

    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: OfferBuilderRequest = await request.json();

    // Validate required fields
    if (!body.audienceProfile || !body.synthesis) {
      return NextResponse.json(
        { error: 'Missing required fields: audienceProfile, synthesis' },
        { status: 400 }
      );
    }

    // Validate audienceProfile has required nested fields
    if (!body.audienceProfile.painPoints || body.audienceProfile.painPoints.length === 0) {
      return NextResponse.json(
        { error: 'audienceProfile must include at least one pain point' },
        { status: 400 }
      );
    }

    if (!body.audienceProfile.goals || body.audienceProfile.goals.length === 0) {
      return NextResponse.json(
        { error: 'audienceProfile must include at least one goal' },
        { status: 400 }
      );
    }

    // Get webhook URL from environment - use offer builder endpoint
    const baseUrl = process.env.N8N_WEBHOOK_URL;
    if (!baseUrl) {
      console.error('N8N_WEBHOOK_URL environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Construct offer builder webhook URL
    // The base URL is for the research workflow, we need to adjust for offer-builder
    const offerBuilderUrl = baseUrl.replace(/\/[^/]+$/, '/offer-builder');

    // Transform the research data to offer builder format
    const offerInput = transformResearchToOfferInput(body);

    // Forward request to n8n offer builder webhook
    const n8nResponse = await fetch(offerBuilderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(offerInput),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('n8n offer builder webhook error:', errorText);
      return NextResponse.json(
        { error: 'Offer generation failed. Please try again.' },
        { status: 502 }
      );
    }

    const data = await n8nResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Offer Builder API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
