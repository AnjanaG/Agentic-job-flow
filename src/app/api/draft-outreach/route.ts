import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { job, profile } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured. Please add it to .env.local' },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    })

    const prompt = `You are helping a job seeker write a personalized LinkedIn outreach message to a hiring manager.

## Job Details
- Company: ${job.company}
- Role: ${job.title}
- Location: ${job.location}

## Job Seeker Profile
- Name: ${profile.name || 'Job Seeker'}
- Target Titles: ${profile.targetTitles?.join(', ') || 'Product Manager'}
- Keywords: ${profile.keywords?.join(', ') || 'AI, ML'}
${profile.resumeText ? `\n## Resume\n${profile.resumeText.slice(0, 3000)}` : ''}

## Instructions
Write a concise, personalized LinkedIn connection request message (under 300 characters for the connection note, OR a longer InMail if they're not a connection).

Guidelines:
1. Lead with value, not an ask
2. Reference something specific about the role or company
3. Mention 1-2 relevant experiences briefly
4. Be conversational, not formal
5. No generic phrases like "I came across your profile"
6. End with a soft ask (chat, coffee, etc.)

Write the message now:`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    const responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : 'Error generating message'

    return NextResponse.json({ message: responseText })
  } catch (error: unknown) {
    console.error('Error generating outreach:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate outreach'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
