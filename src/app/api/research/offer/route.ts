import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { NextRequest, NextResponse } from 'next/server'
import {
  OfferCoreOutputSchema,
  BrandAngle,
  ResearchOutput,
  RatedHook,
} from '@/lib/research/schemas'
import { getOfferCorePrompt } from '@/lib/research/prompts'

interface OfferRequest {
  research: ResearchOutput
  selectedAngles: BrandAngle[]
  lovedHooks: RatedHook[]
  likedHooks: RatedHook[]
}

export async function POST(request: NextRequest) {
  try {
    const { research, selectedAngles, lovedHooks, likedHooks } =
      (await request.json()) as OfferRequest

    if (!research || !selectedAngles || selectedAngles.length === 0) {
      return NextResponse.json(
        { error: 'Research and at least one selected angle are required' },
        { status: 400 }
      )
    }

    // Create focused summaries for the prompt
    const researchSummary = {
      audienceState: research.audienceState, // Current state -> Desired state transformation
      urgencyGateway: research.urgencyGateway,
      painPoints: research.painPoints.slice(0, 5),
      languageMap: research.languageMap,
    }

    // Combine loved and liked hooks (loved first) with defensive handling
    const safeLovedHooks = lovedHooks || []
    const safeLikedHooks = likedHooks || []
    const topHooks = [
      ...safeLovedHooks.map((h) => `🔥 "${h.text}" (${h.category})`),
      ...safeLikedHooks.slice(0, 5).map((h) => `❤️ "${h.text}" (${h.category})`),
    ]

    const prompt = getOfferCorePrompt(
      JSON.stringify(researchSummary, null, 2),
      JSON.stringify(selectedAngles, null, 2),
      topHooks.join('\n')
    )

    const { object } = await generateObject({
      model: google('gemini-3-flash-preview'),
      schema: OfferCoreOutputSchema,
      prompt,
    })

    return NextResponse.json({
      success: true,
      offerCore: object,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Offer Core generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate offer core',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
