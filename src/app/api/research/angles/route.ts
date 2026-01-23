import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { NextRequest, NextResponse } from 'next/server'
import { AnglesOutputSchema, ResearchOutput } from '@/lib/research/schemas'
import { getAnglesPrompt } from '@/lib/research/prompts'

export async function POST(request: NextRequest) {
  try {
    const { research } = await request.json() as { research: ResearchOutput }

    if (!research) {
      return NextResponse.json(
        { error: 'Research output is required' },
        { status: 400 }
      )
    }

    const prompt = getAnglesPrompt(JSON.stringify(research, null, 2))

    const { object } = await generateObject({
      model: google('gemini-3-flash-preview'),
      schema: AnglesOutputSchema,
      prompt,
    })

    return NextResponse.json({
      success: true,
      angles: object.angles,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Angles generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate brand angles',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
