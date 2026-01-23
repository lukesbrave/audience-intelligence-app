import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { NextRequest, NextResponse } from 'next/server'
import { ResearchOutputSchema } from '@/lib/research/schemas'
import { getResearchPrompt } from '@/lib/research/prompts'

export const maxDuration = 120 // Allow up to 2 minutes

export async function POST(request: NextRequest) {
  try {
    const { audienceProfile } = await request.json()

    if (!audienceProfile) {
      return NextResponse.json(
        { error: 'Audience profile is required' },
        { status: 400 }
      )
    }

    const prompt = getResearchPrompt(
      typeof audienceProfile === 'string'
        ? audienceProfile
        : JSON.stringify(audienceProfile, null, 2)
    )

    // Use Gemini 2.5 Flash Preview for faster response
    const { object } = await generateObject({
      model: google('gemini-3-flash-preview'),
      schema: ResearchOutputSchema,
      prompt,
    })

    return NextResponse.json({
      success: true,
      research: object,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Research error:', error)
    return NextResponse.json(
      {
        error: 'Failed to conduct research',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
