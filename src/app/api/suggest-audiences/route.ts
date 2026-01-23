import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const SuggestionsSchema = z.object({
  suggestions: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string()
  }))
})

export async function POST(request: NextRequest) {
  try {
    const { introspection } = await request.json()

    if (!introspection) {
      return NextResponse.json(
        { error: 'Introspection data is required' },
        { status: 400 }
      )
    }

    const prompt = `You are helping someone discover their ideal target audience for their business.

Based on their answers below, suggest 3-4 specific audiences they're well-positioned to serve.

For each suggestion:
- id: A unique identifier (e.g., "audience-1", "audience-2", etc.)
- title: A clear, specific description of the audience (e.g., "Mid-career professionals feeling stuck in corporate roles")
- description: 2-3 sentences explaining WHY this person is well-positioned to serve them, referencing specific answers they gave

Their answers:

THEIR STORY:
- Biggest challenge overcome: ${introspection.biggestChallenge || 'Not provided'}
- Biggest trauma/setback: ${introspection.biggestTrauma || 'Not provided'}
- Proudest achievement: ${introspection.proudestAchievement || 'Not provided'}

THEIR STRENGTHS:
- Who comes to them for help: ${introspection.whoComesToYou || 'Not provided'}
- Questions people ask them: ${introspection.questionsTheyAsk || 'Not provided'}
- What they're passionate about: ${introspection.passionateAbout || 'Not provided'}

THEIR ENERGY:
- What fires them up: ${introspection.firesYouUp || 'Not provided'}
- What frustrates them: ${introspection.pissesYouOff || 'Not provided'}
- What lights them up in conversation: ${introspection.lightsUpInConversation || 'Not provided'}
- What they'd do even unpaid: ${introspection.loveToDoAnyway || 'Not provided'}

Generate suggestions that connect their personal experience and strengths to audiences who would deeply resonate with them.
Be specific and actionable - avoid generic audiences like "small business owners" unless qualified with specific circumstances.`

    const { object } = await generateObject({
      model: google('gemini-3-flash-preview'),
      schema: SuggestionsSchema,
      prompt,
    })

    return NextResponse.json({ suggestions: object.suggestions })
  } catch (error) {
    console.error('Error generating suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to generate audience suggestions' },
      { status: 500 }
    )
  }
}
