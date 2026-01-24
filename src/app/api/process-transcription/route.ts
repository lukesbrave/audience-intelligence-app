import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { NextRequest, NextResponse } from 'next/server'
import { FocusGroupInsightsSchema } from '@/lib/research/schemas'

export const maxDuration = 120 // Allow up to 2 minutes for processing

const PROCESSING_PROMPT = `You are analyzing focus group transcription(s) from conversations with a business's target customers.

Your job is to extract meaningful insights that will supercharge audience research.
{{BUSINESS_CONTEXT}}
## TRANSCRIPTION CONTENT

{{TRANSCRIPTION}}

## EXTRACTION INSTRUCTIONS

Extract the following insights:

### 1. DIRECT QUOTES (5-10 powerful quotes)
Find statements that reveal pain, desire, or strong emotion.
- Include the exact quote
- Describe the context (what they were discussing)
- Note the apparent emotion (frustration, excitement, hope, fear, etc.)

### 2. PAIN POINTS
Identify problems and frustrations mentioned.
- Describe each pain point clearly
- Rate frequency: "mentioned_once", "recurring" (came up multiple times), or "dominant_theme" (central topic)
- Capture the exact words/phrases they used to describe this pain

### 3. DESIRE STATEMENTS
What do they want, hope for, or dream about?
- Use their exact words when possible
- Focus on outcomes they're seeking

### 4. VOCABULARY PATTERNS
Distinctive words or phrases they use repeatedly:
- Industry jargon or insider terms
- Slang or colloquialisms
- Recurring metaphors or expressions
- How they describe their situation

### 5. URGENCY INDICATORS
Which problems seemed most pressing?
- What did they bring up first or most often?
- What generated the most energy, frustration, or animation?
- What problems "can't wait"?

## RULES

1. Be thorough but concise - quality over quantity
2. Prioritize direct quotes over paraphrasing
3. Capture emotional nuance - these are real people expressing real frustrations
4. Focus on insights that reveal deep audience understanding
5. Don't sanitize or corporate-ify their language - keep it real`

export async function POST(request: NextRequest) {
  try {
    const { transcription, fileContent, businessContext } = await request.json()

    // Accept either raw transcription text or base64 file content
    const content = transcription || fileContent

    if (!content) {
      return NextResponse.json(
        { error: 'Transcription content is required' },
        { status: 400 }
      )
    }

    // If it's base64 encoded, decode it
    let textContent = content
    if (content.startsWith('data:')) {
      // Handle data URL format (e.g., from file upload)
      const base64Content = content.split(',')[1]
      textContent = Buffer.from(base64Content, 'base64').toString('utf-8')
    } else if (isBase64(content)) {
      textContent = Buffer.from(content, 'base64').toString('utf-8')
    }

    // Build business context section if provided
    const businessContextSection = businessContext
      ? `
## BUSINESS CONTEXT

The person running these focus groups does the following:
${businessContext}

Use this context to better understand the audience and their relationship to this business.
`
      : ''

    const prompt = PROCESSING_PROMPT
      .replace('{{BUSINESS_CONTEXT}}', businessContextSection)
      .replace('{{TRANSCRIPTION}}', textContent)

    const { object } = await generateObject({
      model: google('gemini-2.0-flash'),
      schema: FocusGroupInsightsSchema,
      prompt,
    })

    return NextResponse.json({
      success: true,
      insights: object,
      processedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Transcription processing error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process transcription',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Helper to detect base64 encoded content
function isBase64(str: string): boolean {
  if (!str || str.length === 0) return false
  try {
    return Buffer.from(str, 'base64').toString('base64') === str
  } catch {
    return false
  }
}
