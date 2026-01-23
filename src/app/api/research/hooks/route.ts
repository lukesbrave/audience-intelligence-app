import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { NextRequest, NextResponse } from 'next/server'
import {
  HooksOutputSchema,
  BrandAngle,
  ResearchOutput,
} from '@/lib/research/schemas'
import { getHooksPrompt } from '@/lib/research/prompts'

interface HooksRequest {
  selectedAngle: BrandAngle
  research: ResearchOutput
}

export async function POST(request: NextRequest) {
  try {
    const { selectedAngle, research } = (await request.json()) as HooksRequest

    if (!selectedAngle || !research) {
      return NextResponse.json(
        { error: 'Selected angle and research are required' },
        { status: 400 }
      )
    }

    // Create a focused research summary for the hooks prompt
    const researchSummary = {
      urgencyGateway: research.urgencyGateway,
      topPainPoints: research.painPoints.slice(0, 3),
      languageMap: research.languageMap,
    }

    const prompt = getHooksPrompt(
      JSON.stringify(selectedAngle, null, 2),
      JSON.stringify(researchSummary, null, 2)
    )

    const { object } = await generateObject({
      model: google('gemini-3-flash-preview'),
      schema: HooksOutputSchema,
      prompt,
    })

    return NextResponse.json({
      success: true,
      hooks: object.hooks,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Hooks generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate hooks',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
