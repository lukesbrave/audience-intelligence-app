import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { NextRequest, NextResponse } from 'next/server'
import { ResearchOutputSchema, FocusGroupInsights } from '@/lib/research/schemas'
import { getResearchPrompt } from '@/lib/research/prompts'

export const maxDuration = 120 // Allow up to 2 minutes

// Format focus group insights into a string for the prompt
// NOTE: These are framed as GUIDANCE for research, not quotable material
function formatFocusGroupData(insights: FocusGroupInsights): string {
  const sections: string[] = []

  if (insights.painPoints?.length > 0) {
    sections.push('### Problems to Research (validate these in web discussions)\n' +
      insights.painPoints.map(p =>
        `- ${p.pain} [${p.frequency}] — search for discussions about this`
      ).join('\n'))
  }

  if (insights.vocabularyPatterns?.length > 0) {
    sections.push('### Language Patterns to Search For\n' +
      'Look for these phrases and similar language in Reddit, forums, and reviews:\n' +
      insights.vocabularyPatterns.map(v => `- "${v}"`).join('\n'))
  }

  if (insights.urgencyIndicators?.length > 0) {
    sections.push('### Urgent Problems to Prioritize in Research\n' +
      insights.urgencyIndicators.map(u => `- ${u}`).join('\n'))
  }

  if (insights.desireStatements?.length > 0) {
    sections.push('### Desired Outcomes to Explore\n' +
      'Research what this audience says they want online:\n' +
      insights.desireStatements.map(d => `- ${d}`).join('\n'))
  }

  if (insights.directQuotes?.length > 0) {
    sections.push('### Audience Mindset Signals (for context only, do not quote)\n' +
      'These show the emotional tone to look for in web research:\n' +
      insights.directQuotes.slice(0, 3).map(q =>
        `- Feeling: ${q.emotion} | Topic: ${q.context}`
      ).join('\n'))
  }

  return sections.join('\n\n')
}

export async function POST(request: NextRequest) {
  try {
    const { audienceProfile, focusGroupInsights, businessContext } = await request.json()

    if (!audienceProfile) {
      return NextResponse.json(
        { error: 'Audience profile is required' },
        { status: 400 }
      )
    }

    // Format focus group data if provided
    const focusGroupData = focusGroupInsights
      ? formatFocusGroupData(focusGroupInsights)
      : undefined

    const prompt = getResearchPrompt(
      typeof audienceProfile === 'string'
        ? audienceProfile
        : JSON.stringify(audienceProfile, null, 2),
      focusGroupData,
      businessContext
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
