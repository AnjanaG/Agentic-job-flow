import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(request: NextRequest) {
  try {
    const { profile } = await request.json()
    
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your-api-key-here') {
      return NextResponse.json(
        { error: 'Please add your Anthropic API key to .env.local' },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({ apiKey })

    const targetTitles = profile.targetTitles?.join(', ') || 'Product Manager'
    const location = profile.location || 'San Francisco Bay Area'
    const keywords = profile.keywords?.join(', ') || 'AI, ML'
    const resumeSummary = profile.resumeText?.slice(0, 1000) || 'Experienced product manager'

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      messages: [
        {
          role: 'user',
          content: `You are a job search assistant. Generate realistic job listings for these criteria:

Target Titles: ${targetTitles}
Location: ${location}  
Keywords: ${keywords}

User Background:
${resumeSummary}

Generate 5 realistic job openings from real tech companies (like Salesforce, Google, Meta, Stripe, Airbnb, Databricks, OpenAI, Anthropic, Notion, Figma, etc.) that would match this profile.

IMPORTANT: Respond with ONLY valid JSON, no markdown, no explanation. Start directly with { and end with }

{"jobs":[{"id":"1","company":"Company Name","title":"Exact Job Title","location":"City, State","url":"https://careers.companyname.com/jobs/12345","matchScore":85,"status":"new","whyMatch":"One sentence why this matches"}]}`
        }
      ]
    })

    const responseText = response.content[0].type === 'text' ? response.content[0].text : ''
    
    console.log('Claude response:', responseText.slice(0, 500))
    
    // Try to parse JSON - handle various formats
    let jsonStr = responseText.trim()
    
    // Remove markdown code blocks if present
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```\n?/g, '')
    }
    
    // Find JSON object
    const startIdx = jsonStr.indexOf('{')
    const endIdx = jsonStr.lastIndexOf('}')
    
    if (startIdx !== -1 && endIdx !== -1) {
      jsonStr = jsonStr.slice(startIdx, endIdx + 1)
      
      try {
        const data = JSON.parse(jsonStr)
        if (data.jobs && Array.isArray(data.jobs)) {
          return NextResponse.json(data)
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Attempted to parse:', jsonStr.slice(0, 300))
      }
    }

    // Fallback: return sample jobs so the demo still works
    return NextResponse.json({
      jobs: [
        {
          id: '1',
          company: 'Salesforce',
          title: 'Director of Product Management, AI Platform',
          location: 'San Francisco, CA',
          url: 'https://careers.salesforce.com/jobs',
          matchScore: 85,
          status: 'new',
          whyMatch: 'Strong AI/ML background matches their platform needs'
        },
        {
          id: '2',
          company: 'Stripe',
          title: 'Principal Product Manager, Developer Experience',
          location: 'San Francisco, CA',
          url: 'https://stripe.com/jobs',
          matchScore: 80,
          status: 'new',
          whyMatch: 'Internal tools experience aligns with developer platform'
        },
        {
          id: '3',
          company: 'Anthropic',
          title: 'Product Manager, Claude Enterprise',
          location: 'San Francisco, CA',
          url: 'https://anthropic.com/careers',
          matchScore: 90,
          status: 'new',
          whyMatch: 'Direct LLM product experience is a perfect match'
        },
        {
          id: '4',
          company: 'Notion',
          title: 'Senior Product Manager, AI Features',
          location: 'San Francisco, CA',
          url: 'https://notion.so/careers',
          matchScore: 75,
          status: 'new',
          whyMatch: 'AI integration experience relevant to their roadmap'
        },
        {
          id: '5',
          company: 'Databricks',
          title: 'Principal PM, ML Platform',
          location: 'San Francisco, CA',
          url: 'https://databricks.com/careers',
          matchScore: 82,
          status: 'new',
          whyMatch: 'ML platform background aligns with their core product'
        }
      ]
    })
  } catch (error: unknown) {
    console.error('Error searching jobs:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to search jobs'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
