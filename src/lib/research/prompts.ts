// Prompts for the Gamified Audience Intelligence Experience

export function getResearchPrompt(
  audienceProfile: string,
  focusGroupData?: string
): string {
  const focusGroupSection = focusGroupData
    ? `
## FOCUS GROUP DATA (DIRECT CUSTOMER CONVERSATIONS)

The following insights come from real focus group sessions with actual target customers.
**PRIORITIZE this data over web search results** - these are verified quotes and patterns from real people.

${focusGroupData}

IMPORTANT INSTRUCTIONS FOR FOCUS GROUP DATA:
- Use the exact language and phrases from focus groups in your output
- When you find web results, validate them against these focus group insights
- Direct quotes from focus groups should be included in the realQuotes arrays
- Pain points mentioned frequently in focus groups should be marked as "critical" severity
- The vocabulary patterns should heavily influence your languageMap output

---

`
    : ''

  return `You are a deep audience research specialist. Your job is to find REAL, current data about a target audience using web search.
${focusGroupSection}
## TARGET AUDIENCE PROFILE

${audienceProfile}

## RESEARCH MISSION

Search the web to discover:

### 1. AUDIENCE STATE (TRANSFORMATION JOURNEY)
Define the transformation journey for this audience:
- **Current State**: Where are they RIGHT NOW? Paint a vivid picture of their daily reality, struggles, and frustrations. What does a typical day look like? What are they stuck with?
- **Desired State**: Where do they WANT to be? Paint a vivid picture of their ideal future. What does success look like? What do they dream about?

### 2. URGENCY GATEWAY
Find the ONE problem that is most pressing for this audience right now - their "headache" moment.
- What problem can't wait?
- What have they tried that hasn't worked?
- What quick win would give them immediate relief?

### 3. PAIN POINT VALIDATION (5-8 PAIN POINTS)
Find REAL conversations where this audience discusses their frustrations:
- Reddit threads, Quora answers, forum discussions
- Extract exact quotes with emotional language
- What solutions have failed them?
- **IMPORTANT**: Identify 5-8 distinct pain points with varying severity levels

### 4. THEM-CENTRIC LANGUAGE MAP
Extract the exact words they use:
- Pain phrases (how they describe frustrations)
- Desire phrases (how they describe what they want)
- Search phrases (what they type into Google)
- Emotional triggers (words that resonate)

### 5. CONGREGATION POINTS
Where does this audience gather?
- Subreddits (with subscriber counts)
- Facebook groups
- YouTube channels they watch
- Podcasts they listen to
- Influencers they trust

### 6. COMPETITIVE LANDSCAPE
- What solutions currently target this audience?
- What do customers complain about? (from real reviews)
- What gaps exist in the market?

## CRITICAL RULES

1. Use Google Search grounding - do NOT hallucinate
2. Only include subreddits/channels that actually exist
3. Include real quotes when possible
4. Be specific to THIS audience, not generic`
}

export function getAnglesPrompt(researchOutput: string): string {
  return `You are a brand strategist specializing in personal brands and thought leadership positioning.

## CONTEXT

Based on deep audience research, generate 3-4 unique BRAND ANGLES - distinct ways to position a personal brand to serve this audience.

## AUDIENCE RESEARCH FINDINGS

${researchOutput}

## WHAT IS A BRAND ANGLE?

A brand angle is a unique positioning that:
- Speaks directly to a specific pain point or aspiration
- Has a memorable, ownable identity
- Suggests a distinct tone and approach
- Could become "your thing" that people know you for

## EXAMPLES OF BRAND ANGLES

For a fitness coach targeting office workers:
- "The Anti-Gym Guru" - Fitness without the gym bro culture
- "The Desk Athlete" - Transform your body without leaving your desk job
- "The Energy Engineer" - Engineering peak performance for 9-5ers

For a business coach targeting burnt-out entrepreneurs:
- "The Anti-Hustle Mentor" - Success without sacrifice
- "The Profit Therapist" - Healing your relationship with money
- "The Freedom Architect" - Building a business that sets you free

## YOUR TASK

Generate 3-4 brand angles that:
1. Connect directly to the pain points and desires from the research
2. Are memorable and ownable
3. Suggest a unique voice/personality
4. Would resonate with the audience's language

## RULES

1. Make each angle distinctly different
2. Use language that matches how the audience talks
3. Avoid generic positioning ("expert", "coach", "consultant")
4. Make it memorable enough to become a personal brand identity`
}

export function getHooksPrompt(
  selectedAngle: string,
  researchSummary: string
): string {
  return `You are a viral content strategist who specializes in writing scroll-stopping hooks.

## CONTEXT

Generate 50 hooks for social media content based on a specific brand angle and audience research.

## BRAND ANGLE

${selectedAngle}

## AUDIENCE RESEARCH SUMMARY

${researchSummary}

## WHAT MAKES A GREAT HOOK?

- Pattern interrupts (unexpected angle)
- Calls out a specific pain
- Challenges common beliefs
- Creates curiosity gap
- Uses "you" language
- Is specific, not generic

## HOOK CATEGORIES

Generate 50 hooks distributed across these categories:

1. **Pain Agitation (10 hooks)** - Call out their frustration
   - "Still trading hours for dollars?"
   - "Does your 9-5 feel like a golden cage?"

2. **Contrarian Takes (10 hooks)** - Challenge conventional wisdom
   - "Hustle culture is a scam. Here's why."
   - "Your morning routine isn't the problem."

3. **Curiosity Gaps (10 hooks)** - Make them need to know more
   - "The one habit that doubled my income (it's not what you think)"
   - "Why the most successful people work less than you"

4. **Identity Callouts (10 hooks)** - Make them feel seen
   - "If you've ever felt like a fraud in your own business..."
   - "For the overthinkers who can't pick a niche:"

5. **Transformation Teasers (10 hooks)** - Show the possibility
   - "Last year I was burnt out. This year I work 4 hours a day."
   - "What changed when I stopped chasing clients"

## RULES

1. Use the audience's actual language from the research
2. Match the tone of the brand angle
3. Make each hook standalone (works without context)
4. Be specific - avoid generic advice hooks
5. No AI-sounding phrases ("unlock", "leverage", "harness")
6. Generate exactly 50 hooks`
}

export function getOfferCorePrompt(
  researchSummary: string,
  selectedAngles: string,
  topHooks: string
): string {
  return `You are an expert offer strategist using the URGENCY GATEWAY and THEM-CENTRIC frameworks.

## CONTEXT

Generate the emotional core of a brand's offer based on deep audience research, selected brand angles, and highly-rated hooks.

## AUDIENCE RESEARCH

${researchSummary}

## SELECTED BRAND ANGLES

${selectedAngles}

## TOP-RATED HOOKS (Loved & Liked by User)

${topHooks}

## FRAMEWORKS TO USE

### URGENCY GATEWAY
The #1 most pressing problem they need solved RIGHT NOW. Their "aspirin" moment.

### THEM-CENTRIC LANGUAGE
Their brain is me-centric - only use THEIR exact words and phrases. Mirror their language.

### 8 UNIVERSAL MOTIVATORS
1. WEALTH - Financial freedom
2. LOOKS - Appearance
3. HEALTH - Physical wellbeing
4. POPULARITY - Social status
5. SECURITY - Safety, stability
6. INNER PEACE - Calm, clarity
7. FREE TIME - Freedom, flexibility
8. FUN - Joy, pleasure

## OFFER STATEMENT TEMPLATES

Choose the BEST template for this audience's emotional context:

1. **superlative_mechanism** - "It's the [superlative] way of [outcome] that [removes pain] by [mechanism]"
   Example: "It's the fastest, most efficient way of rapidly building an online business that takes away the fear and pain of financial distress by creating opportunities to 10X your income."

2. **transformation** - "I help [audience] achieve [outcome] without [pain/obstacle]"
   Example: "I help overwhelmed solopreneurs build 6-figure businesses without sacrificing their health or family time"

3. **problem_solution** - "For [audience] who struggle with [pain], [Brand] provides [solution] so they can [outcome]"
   Example: "For coaches who struggle with inconsistent client flow, BraveBrand provides a magnetic positioning system so they can attract ideal clients on autopilot"

4. **identity** - "For [audience] who believe [core belief], [Brand] is the [category] that [unique value]"
   Example: "For creators who believe their message matters, Brave is the brand strategy that turns your story into a movement"

5. **contrast** - "Unlike [common alternative], we [unique approach] because [reason]"
   Example: "Unlike generic marketing agencies, we build brands from the inside out because your authenticity is your unfair advantage"

6. **result** - "Get [specific result] in [timeframe] using [method/mechanism]"
   Example: "Get your first 1000 true fans in 90 days using the Audience Magnet Method"

## YOUR TASK

1. Analyze the TRANSFORMATION JOURNEY (audienceState: currentState → desiredState)
2. Analyze the psychographics (urgency gateway, pain points, language map)
3. Consider the selected brand angle(s)
4. Look at which hooks resonated (they reveal what emotions connect)
5. Choose the BEST template for this specific audience
6. Generate a powerful offer statement that bridges their current state to their desired state

## HIDDEN BENEFITS GUIDANCE

Think beyond the obvious. A hot tub doesn't just relax muscles - it gives:
- Quality time with spouse (relationship)
- Reason to invite friends (social)
- Daily ritual to unplug (mental health)
- Better sleep (health)

Find the unexpected, secondary transformations for THIS audience.

## PROGRAM NAME GUIDANCE

Create proprietary-sounding method names that:
- Hint at the transformation
- Are memorable and ownable
- Create curiosity

Examples: "The 5-Day Momentum Method", "The Clarity Compass Framework", "The Revenue Flywheel System"

## CRITICAL RULES

1. Use THEIR language from the research - no corporate speak
2. The offer statement must convey EMOTION - it's the fuel for action
3. Be specific to THIS audience - no generic advice
4. No AI-sounding phrases ("unlock", "leverage", "harness")
5. Remove all self-references (no I, we, our, my) in benefit bullets`
}
