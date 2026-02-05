'use client'

import { useState } from 'react'

interface Job {
  id: string
  company: string
  title: string
  location: string
  matchScore: number
  url: string
  status: 'new' | 'interested' | 'applied' | 'interviewing'
}

interface Profile {
  name: string
  resumeText: string
  targetTitles: string[]
  location: string
  keywords: string[]
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'profile' | 'search' | 'pipeline' | 'outreach'>('profile')
  const [profile, setProfile] = useState<Profile>({
    name: '',
    resumeText: '',
    targetTitles: ['Principal Product Manager', 'Director of Product Management'],
    location: 'San Francisco Bay Area',
    keywords: ['AI', 'ML', 'LLM', 'internal tools']
  })
  const [jobs, setJobs] = useState<Job[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [outreachDraft, setOutreachDraft] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleResumeUpload = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProfile({ ...profile, resumeText: e.target.value })
  }

  const searchJobs = async () => {
    setIsSearching(true)
    
    // Simulate job search (in production, this would call the API)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockJobs: Job[] = [
      {
        id: '1',
        company: 'Salesforce',
        title: 'Director/Sr Director PM, AI Internal Developer Experience',
        location: 'San Francisco, CA',
        matchScore: 85,
        url: 'https://careers.salesforce.com/en/jobs/jr308489',
        status: 'new'
      },
      {
        id: '2',
        company: 'DocuSign',
        title: 'Principal PM, AI Support Transformation',
        location: 'San Francisco, CA',
        matchScore: 80,
        url: 'https://careers.docusign.com/jobs/28150',
        status: 'new'
      },
      {
        id: '3',
        company: 'Okta',
        title: 'Principal PM, AI & Automation',
        location: 'San Francisco, CA',
        matchScore: 80,
        url: 'https://okta.com/company/careers/7166879',
        status: 'new'
      },
      {
        id: '4',
        company: 'Intuit (Mailchimp)',
        title: 'Principal PM, AI',
        location: 'Mountain View, CA',
        matchScore: 75,
        url: 'https://jobs.intuit.com/job/mountain-view/principal-product-manager-ai-mailchimp',
        status: 'new'
      },
      {
        id: '5',
        company: 'Rippling',
        title: 'Director of Product, AI Platform',
        location: 'San Francisco, CA',
        matchScore: 75,
        url: 'https://ats.rippling.com/rippling/jobs/ai-platform',
        status: 'new'
      }
    ]
    
    setJobs(mockJobs)
    setIsSearching(false)
  }

  const updateJobStatus = (jobId: string, status: Job['status']) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status } : job
    ))
  }

  const generateOutreach = async (job: Job) => {
    setSelectedJob(job)
    setIsGenerating(true)
    setOutreachDraft('')
    
    try {
      const response = await fetch('/api/draft-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job,
          profile
        })
      })
      
      const data = await response.json()
      
      if (data.error) {
        setOutreachDraft(`Error: ${data.error}`)
      } else {
        setOutreachDraft(data.message)
      }
    } catch (error) {
      setOutreachDraft('Error generating outreach. Please check your API key configuration.')
    }
    
    setIsGenerating(false)
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Job Search Agent</h1>
        <p className="text-gray-600 mt-2">AI-powered job search assistant</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['profile', 'search', 'pipeline', 'outreach'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-6 py-3 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder="e.g., Anjana Gummadivalli"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste Your Resume
            </label>
            <textarea
              value={profile.resumeText}
              onChange={handleResumeUpload}
              placeholder="Paste your resume text here..."
              rows={10}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Titles (comma-separated)
              </label>
              <input
                type="text"
                value={profile.targetTitles.join(', ')}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  targetTitles: e.target.value.split(',').map(t => t.trim()) 
                })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={profile.keywords.join(', ')}
              onChange={(e) => setProfile({ 
                ...profile, 
                keywords: e.target.value.split(',').map(k => k.trim()) 
              })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800">
              ✓ Profile ready. Go to the Search tab to find jobs.
            </p>
          </div>
        </div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Find Jobs</h2>
            <button
              onClick={searchJobs}
              disabled={isSearching}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSearching ? 'Searching...' : 'Find New Jobs'}
            </button>
          </div>

          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Search criteria:</strong> {profile.targetTitles.join(', ')} in {profile.location}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Keywords:</strong> {profile.keywords.join(', ')}
            </p>
          </div>

          {jobs.length > 0 && (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-gray-600">{job.company} • {job.location}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        job.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                        job.matchScore >= 70 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.matchScore}% match
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updateJobStatus(job.id, 'interested')}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Interested
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('outreach')
                        generateOutreach(job)
                      }}
                      className="px-4 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                    >
                      Draft Outreach
                    </button>
                    <a
                      href={job.url}
                      target="_blank"
                      className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      View Job →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {jobs.length === 0 && !isSearching && (
            <div className="text-center py-12 text-gray-500">
              Click "Find New Jobs" to search for matching opportunities
            </div>
          )}
        </div>
      )}

      {/* Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Your Pipeline</h2>
          
          <div className="grid grid-cols-4 gap-4">
            {(['new', 'interested', 'applied', 'interviewing'] as const).map((status) => (
              <div key={status} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium capitalize text-gray-700 mb-3">{status}</h3>
                <div className="space-y-2">
                  {jobs.filter(j => j.status === status).map((job) => (
                    <div key={job.id} className="bg-white p-3 rounded border border-gray-200 text-sm">
                      <p className="font-medium">{job.company}</p>
                      <p className="text-gray-500 text-xs truncate">{job.title}</p>
                    </div>
                  ))}
                  {jobs.filter(j => j.status === status).length === 0 && (
                    <p className="text-gray-400 text-sm">No jobs</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outreach Tab */}
      {activeTab === 'outreach' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Draft Outreach</h2>
          
          {selectedJob ? (
            <div>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="font-medium">{selectedJob.title}</p>
                <p className="text-gray-600">{selectedJob.company}</p>
              </div>

              {isGenerating ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Generating personalized outreach...</span>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn Message Draft
                  </label>
                  <textarea
                    value={outreachDraft}
                    onChange={(e) => setOutreachDraft(e.target.value)}
                    rows={8}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(outreachDraft)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Copy to Clipboard
                    </button>
                    <button
                      onClick={() => generateOutreach(selectedJob)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Regenerate
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Select a job from the Search tab and click "Draft Outreach"
            </div>
          )}
        </div>
      )}
    </main>
  )
}
