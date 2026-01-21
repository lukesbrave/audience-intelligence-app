import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const ProfileSchema = z.object({
  audienceSummary: z.string().describe('A 1-2 sentence summary of who this audience is'),
  demographics: z.object({
    jobTitles: z.array(z.string()).describe('Common job titles or roles'),
    industries: z.array(z.string()).describe('Industries they work in'),
    ageRange: z.string().describe('Typical age range'),
    incomeLevel: z.string().describe('Income level description')
  }),
  painPoints: z.array(z.object({
    pain: z.string().describe('The specific pain point'),
    emotionalContext: z.string().describe('How this makes them feel'),
    severity: z.enum(['high', 'medium', 'low'])
  })),
  goals: z.array(z.object({
    goal: z.string().describe('The specific goal'),
    timeframe: z.string().describe('When they want to achieve this'),
    priority: z.enum(['primary', 'secondary'])
  })),
  currentState: z.string().describe('Where they are now - their current situation'),
  desiredState: z.string().describe('Where they want to be - their ideal outcome')
})

export async function POST(request: NextRequest) {
  try {
    const { path, data } = await request.json()

    if (!path || !data) {
      return NextResponse.json(
        { error: 'Path and data are required' },
        { status: 400 }
      )
    }

    let prompt: string

    if (path === 'direct') {
      prompt = `You are a market researcher creating an audience profile.

Based on this business description and ideal client description, create a detailed audience profile.

BUSINESS DESCRIPTION:
${data.businessDescription}

IDEAL CLIENT DESCRIPTION:
${data.idealClientDescription}

Generate a comprehensive profile that will be used for deep audience research.
Be specific and detailed - this profile will guide marketing strategy and content creation.
Extract real pain points, goals, and emotional context from the descriptions provided.`

    } else {
      prompt = `You are a market researcher creating an audience profile.

Based on the selected audience and the introspection answers, create a detailed audience profile.

SELECTED AUDIENCE:
${data.selectedAudience}

CONTEXT FROM THEIR ANSWERS:
- Biggest challenge overcome: ${data.introspection?.biggestChallenge || 'Not provided'}
- Biggest trauma/setback: ${data.introspection?.biggestTrauma || 'Not provided'}
- Proudest achievement: ${data.introspection?.proudestAchievement || 'Not provided'}
- What they're passionate about: ${data.introspection?.passionateAbout || 'Not provided'}
- Who comes to them for help: ${data.introspection?.whoComesToYou || 'Not provided'}
- Questions people ask them: ${data.introspection?.questionsTheyAsk || 'Not provided'}
- What fires them up: ${data.introspection?.firesYouUp || 'Not provided'}
- What frustrates them: ${data.introspection?.pissesYouOff || 'Not provided'}
- What lights them up in conversation: ${data.introspection?.lightsUpInConversation || 'Not provided'}
- What they'd do even unpaid: ${data.introspection?.loveToDoAnyway || 'Not provided'}

Generate a comprehensive profile that reflects the unique perspective this person brings to serving their audience.
Connect their personal experiences to the pain points and goals of their ideal audience.`
    }

    const { object } = await generateObject({
      model: google('gemini-2.0-flash-001'),
      schema: ProfileSchema,
      prompt,
    })

    return NextResponse.json({ profile: object })
  } catch (error) {
    console.error('Error generating profile:', error)
    return NextResponse.json(
      { error: 'Failed to generate audience profile' },
      { status: 500 }
    )
  }
}
