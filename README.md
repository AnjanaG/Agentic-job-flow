# Job Search Agent 🎯

An AI-powered job search assistant that helps you discover, track, and reach out for job opportunities — built with Next.js and Claude.

## Features

### 🔍 AI-powered job discovery
- Real-time job search powered by Claude AI
- Personalized match scoring based on YOUR resume
- "Why match" explanations for each opportunity
- Searches across top tech companies

### 👤 Smart onboarding
- 3-step wizard: Name → Resume → Preferences
- Upload or paste your resume
- Set target titles, location, and keywords
- Auto-starts job search when complete

### 🕵️ Hiring manager research
- AI identifies likely hiring managers for each role
- LinkedIn profile suggestions with confidence levels
- Reasoning for why they're likely the right contact

### ✍️ AI outreach drafting
- Personalized LinkedIn messages crafted by Claude
- Tailored to each job AND hiring manager
- Edit and refine before sending
- One-click copy to clipboard

### 📊 Pipeline tracker
- Kanban-style board: Interested → Applied → Interviewing → Offers
- Visual progress tracking
- Click any card to draft outreach

---

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- An [Anthropic API key](https://console.anthropic.com) (required)

### Installation

```bash
# Clone the repository
git clone https://github.com/AnjanaG/Agentic-job-flow.git
cd Agentic-job-flow

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your Anthropic API key

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

Create a `.env.local` file with your API key:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your API key from [console.anthropic.com](https://console.anthropic.com)

---

## How it works

### 1. Onboarding wizard
When you first open the app, a 3-step wizard guides you through setup:
- Enter your name
- Paste or upload your resume
- Set job preferences (titles, location, keywords)

### 2. AI job search
The agent searches for jobs matching your profile using Claude AI, returning:
- Real company names and job titles
- Match scores (0-100%) based on your resume
- Explanations for why each job matches

### 3. Hiring manager research
Click "Draft Outreach" and the agent:
- Researches who the likely hiring manager is
- Provides their name, title, and LinkedIn URL
- Shows confidence level and reasoning

### 4. Personalized outreach
Claude drafts a personalized LinkedIn message that:
- References the specific role and company
- Highlights your relevant experience
- Maintains a professional but conversational tone

---

## Tech stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14, React, Tailwind CSS | Modern, responsive UI |
| **Backend** | Next.js API Routes | Serverless API endpoints |
| **AI** | Anthropic Claude Sonnet | Job search, HM research, outreach drafting |
| **Language** | TypeScript | Type-safe development |

---

## API endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search-jobs` | POST | AI-powered job search |
| `/api/find-hiring-manager` | POST | Research hiring managers |
| `/api/draft-outreach` | POST | Generate personalized messages |

---

## Project structure

```
job-agent-demo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── search-jobs/        # Job search endpoint
│   │   │   ├── find-hiring-manager/ # HM research endpoint
│   │   │   └── draft-outreach/     # Message generation endpoint
│   │   ├── page.tsx                # Main application UI
│   │   ├── layout.tsx              # App layout
│   │   └── globals.css             # Global styles
│   └── components/                 # Reusable components
├── .env.example                    # Environment variables template
├── package.json
└── README.md
```

---

## Roadmap

### Current (MVP)
- [x] Onboarding wizard
- [x] AI job search with match scoring
- [x] Pipeline tracker
- [x] Hiring manager research
- [x] AI outreach drafting
- [x] Resume upload/paste

### Phase 2 (Planned)
- [ ] Real job board API integrations (LinkedIn, Indeed)
- [ ] Auto-apply with user approval
- [ ] Scheduled job polling with email digests
- [ ] Database persistence (PostgreSQL)
- [ ] User authentication

### Phase 3 (Future)
- [ ] Adjacent role recommendations
- [ ] Email response detection
- [ ] Interview scheduling integration
- [ ] Mobile app

---

## License

MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built during the ["Build AI Product Sense"](https://buildaiproductsense.com) learning journey
- Powered by [Anthropic Claude](https://anthropic.com)
- UI styled with [Tailwind CSS](https://tailwindcss.com)

---

## Author

**Anjana Gummadivalli**  
Principal Product Manager | AI/ML Products  
[LinkedIn](https://www.linkedin.com/in/anjanagummadivalli/)

---

*Built with ❤️ and AI*
