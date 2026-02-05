import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { job } = await request.json()
    
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY not configured' },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({ apiKey })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `You are a hiring manager research assistant. Find the likely hiring manager for this role:

**Company:** ${job.company}
**Role:** ${job.title}
**Location:** ${job.location}

Based on typical organizational structures, identify:
1. The most likely hiring manager (Director/VP level in the relevant department)
2. Their likely LinkedIn profile URL pattern
3. Why they're likely the hiring manager

Respond in this exact JSON format only:
{
  "hiringManager": {
    "name": "Full Name",
    "title": "Their Title at Company",
    "linkedinUrl": "https://linkedin.com/in/probable-profile-slug",
    "confidence": "high/medium/low",
    "reasoning": "Why this person is likely the hiring manager"
  },
  "alternateContacts": [
    {
      "name": "Another Name",
      "title": "Their Title",
      "linkedinUrl": "https://linkedin.com/in/profile-slug",
      "role": "Recruiter/Team Lead/etc"
    }
  ],
  "searchTips": "Tips for finding the actual hiring manager on LinkedIn"
}`
        }
      ]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''
    
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0])
        return NextResponse.json(data)
      }
    } catch (parseError) {
      console.error('Failed to parse hiring manager response:', parseError)
    }

    return NextResponse.json({ error: 'Failed to find hiring manager' })
  } catch (error: unknown) {
    console.error('Error finding hiring manager:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to find hiring manager'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
