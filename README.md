# Job Search Agent 🎯

An AI-powered job search assistant that helps you discover, track, and reach out for job opportunities — built with Next.js and Claude.

![Demo Screenshot](docs/demo-screenshot.png)

## Features

### 🔍 Smart job discovery
- Search for jobs matching your profile and preferences
- AI-powered matching scores (70-100%) based on your resume
- Support for multiple job titles and keywords

### 📊 Pipeline tracker
- Kanban-style board to track applications
- Stages: New → Interested → Applied → Interviewing
- Never lose track of where you are with each opportunity

### ✍️ AI outreach drafting
- Generate personalized LinkedIn messages with Claude
- Tailored to each job and your background
- Edit and refine before sending

### 👤 Profile-based matching
- Paste your resume for intelligent matching
- Set target titles, location, and keywords
- AI understands your transferable skills

---

## Quick start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ installed
- An [Anthropic API key](https://console.anthropic.com) for AI features

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/job-search-agent.git
cd job-search-agent

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

Create a `.env.local` file with:

```env
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## Usage

### 1. Set up your profile

Go to the **Profile** tab and enter:
- Your name
- Your resume (paste as text)
- Target job titles (e.g., "Principal Product Manager, Director of Product")
- Preferred location
- Keywords that match your expertise

### 2. Search for jobs

Go to the **Search** tab and click **"Find New Jobs"**. The agent will:
- Search for matching opportunities
- Score each job against your profile
- Show you the best matches first

### 3. Track your pipeline

As you find interesting jobs, mark them as **"Interested"**. View all your jobs organized by stage in the **Pipeline** tab.

### 4. Generate outreach

Click **"Draft Outreach"** on any job. The AI will:
- Analyze the job description
- Review your background
- Generate a personalized LinkedIn message
- Let you edit before copying

---

## Tech stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14, React, Tailwind CSS | Modern, responsive UI |
| **Backend** | Next.js API Routes | Serverless API endpoints |
| **AI** | Anthropic Claude | Intelligent matching and drafting |
| **Language** | TypeScript | Type-safe development |

---

## Project structure

```
job-agent-demo/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── draft-outreach/    # AI outreach generation endpoint
│   │   ├── page.tsx               # Main application UI
│   │   ├── layout.tsx             # App layout
│   │   └── globals.css            # Global styles
│   └── components/                # Reusable components
├── .env.example                   # Environment variables template
├── package.json
└── README.md
```

---

## Roadmap

### MVP (Current)
- [x] Profile setup with resume parsing
- [x] Job search with mock data
- [x] Match scoring
- [x] Pipeline tracker
- [x] AI outreach drafting

### Phase 2 (Planned)
- [ ] Real job API integrations (LinkedIn, Indeed)
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- Built during the ["Build AI Product Sense"](https://buildaiproductsense.com) learning journey
- Powered by [Anthropic Claude](https://anthropic.com)
- UI components styled with [Tailwind CSS](https://tailwindcss.com)

---

## Author

**Anjana Gummadivalli**  
Principal Product Manager | AI/ML Products  
[LinkedIn](https://www.linkedin.com/in/anjanagummadivalli/)

---

*Built with ❤️ and AI*
