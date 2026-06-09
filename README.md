# Agentic-job-flow

Full-stack AI job search agent — resume-to-JD matching, hiring manager research, personalized outreach generation.

Built with Next.js and the Anthropic API. The agent surfaces relevant roles, explains why each matches your background, identifies who's likely hiring, and drafts outreach you'd actually send.

---

## Features

**Resume-to-JD matching** — Paste or upload your resume. The agent searches for roles at target companies, scores each match 0-100 against your specific background, and explains the reasoning. Not keyword matching — the model reads the full resume and the full job description.

**Hiring manager research** — For any role, the agent identifies who the likely hiring manager is, suggests their LinkedIn profile, and shows its confidence level and reasoning. You decide whether to reach out.

**Outreach drafting** — Claude writes a personalized LinkedIn message for each role and hiring manager. It references the specific role, draws from your actual experience, and keeps a professional but direct tone. Edit before sending.

**Pipeline tracker** — Kanban-style board across four stages: Interested, Applied, Interviewing, Offers. Click any card to draft outreach.

---

## Why I built this as an agent

The naive version of this is a job search script: take a resume, query a job API, score matches, done. I built it as an agent loop because the interesting problem is not the search — it's the context.

A single job search session involves four distinct tasks: discovery, evaluation, research, and communication. Each task requires state from the previous ones. The outreach draft needs to know which role you're targeting AND what the hiring manager's background is. The match score needs to weight your resume differently depending on the role's seniority level. The research step needs to know the company and team before it can identify the right person.

Chaining these as independent scripts means passing context manually. An agent loop means the model carries context across all four tasks and can reason about the full picture.

**The PM thinking behind the architecture**

Three explicit design choices:

1. All AI calls go through `/api` routes server-side. The Anthropic API key never touches the browser. This is not just security hygiene — it means you can add rate limiting, logging, and cost tracking without changing the frontend.

2. Match scoring returns reasoning, not just a number. A 78% match with no explanation is useless. A 78% match with "strong alignment on distributed systems experience, gap on team size — this role manages 40 engineers, your largest team was 8" is actionable.

3. The hiring manager research step returns confidence levels explicitly. The model doesn't pretend to know things it doesn't know. If the confidence is low, you see that before reaching out to the wrong person.

---

## Quick start

```bash
git clone https://github.com/AnjanaG/Agentic-job-flow.git
cd Agentic-job-flow
npm install
cp .env.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Get an API key at [console.anthropic.com](https://console.anthropic.com).

---

## Stack

Next.js 14, TypeScript, Tailwind CSS, Anthropic API (claude-sonnet)

---

## API routes

| Endpoint | Method | What it does |
|----------|--------|-------------|
| `/api/search-jobs` | POST | AI-powered job search with match scoring |
| `/api/find-hiring-manager` | POST | Research likely hiring manager for a role |
| `/api/draft-outreach` | POST | Generate personalized LinkedIn message |

---

## Project structure

```
Agentic-job-flow/
├── src/
│   └── app/
│       ├── api/
│       │   ├── search-jobs/           # Match scoring endpoint
│       │   ├── find-hiring-manager/   # HM research endpoint
│       │   └── draft-outreach/        # Message generation endpoint
│       ├── page.tsx                   # Main application UI
│       ├── layout.tsx
│       └── globals.css
├── .env.example
├── package.json
└── README.md
```

---

## What's next

- Live job board integrations (LinkedIn, Greenhouse, Lever APIs)
- Auto-apply with user approval step before each submission
- Scheduled job polling with email digest
- Response tracking — detect replies and update pipeline automatically

---

Built by [Anjana Gummadivalli](https://linkedin.com/in/anjanagummadivalli)
