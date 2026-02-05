'use client'

import { useState, useEffect } from 'react'

interface Job {
  id: string
  company: string
  title: string
  location: string
  matchScore: number
  url: string
  status: 'new' | 'interested' | 'applied' | 'interviewing'
  whyMatch?: string
}

interface Profile {
  name: string
  resumeText: string
  targetTitles: string[]
  location: string
  keywords: string[]
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'search' | 'pipeline' | 'outreach'>('search')
  const [showOnboarding, setShowOnboarding] = useState(true)
  const [onboardingStep, setOnboardingStep] = useState(1)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  
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
  const [hiringManager, setHiringManager] = useState<{
    name: string
    title: string
    linkedinUrl: string
    confidence: string
    reasoning: string
  } | null>(null)
  const [isResearchingHM, setIsResearchingHM] = useState(false)

  // Check if profile is complete
  const isProfileComplete = profile.name.length > 0 && profile.resumeText.length > 50

  // Show toast notification
  const showToast = (message: string) => {
    setToast(message)
    setTimeout(() => setToast(null), 3000)
  }

  const searchJobs = async () => {
    setIsSearching(true)
    
    try {
      const response = await fetch('/api/search-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      })
      
      const data = await response.json()
      
      if (data.error) {
        showToast(`Error: ${data.error}`)
        setIsSearching(false)
        return
      }
      
      if (data.jobs && data.jobs.length > 0) {
        setJobs(data.jobs)
        showToast(`Found ${data.jobs.length} matching jobs!`)
      } else {
        showToast('No jobs found. Try adjusting your criteria.')
      }
    } catch (error) {
      showToast('Error searching for jobs. Check your API key.')
    }
    
    setIsSearching(false)
  }

  const markInterested = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, status: 'interested' } : job
    ))
    const job = jobs.find(j => j.id === jobId)
    showToast(`Added ${job?.company} to your pipeline`)
  }

  const researchHiringManager = async (job: Job) => {
    setIsResearchingHM(true)
    setHiringManager(null)
    
    try {
      const response = await fetch('/api/find-hiring-manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job })
      })
      
      const data = await response.json()
      
      if (data.hiringManager) {
        setHiringManager(data.hiringManager)
      }
    } catch (error) {
      console.error('Error researching hiring manager:', error)
    }
    
    setIsResearchingHM(false)
  }

  const generateOutreach = async (job: Job) => {
    setSelectedJob(job)
    setActiveTab('outreach') // Auto-transition to outreach
    setIsGenerating(true)
    setOutreachDraft('')
    setHiringManager(null)
    
    // Start both in parallel
    researchHiringManager(job)
    
    try {
      const response = await fetch('/api/draft-outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job, profile })
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

  // Complete onboarding
  const completeOnboarding = () => {
    setShowOnboarding(false)
    showToast('Profile saved! Let\'s find you a job.')
    searchJobs() // Auto-start job search
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Onboarding Wizard */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    onboardingStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-12 h-1 ${onboardingStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Name */}
            {onboardingStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center">Welcome! Let's get started</h2>
                <p className="text-gray-600 text-center">What should we call you?</p>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="Your name"
                  className="w-full p-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={() => setOnboardingStep(2)}
                  disabled={profile.name.length < 2}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Step 2: Resume */}
            {onboardingStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center">Add your resume</h2>
                <p className="text-gray-600 text-center">This helps us match you with the right jobs</p>
                
                {/* File upload option */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.type === 'text/plain') {
                          const text = await file.text()
                          setProfile({ ...profile, resumeText: text })
                        } else {
                          // For non-txt files, show a message
                          setProfile({ ...profile, resumeText: `[Uploaded: ${file.name}] - For best results, paste your resume text below.` })
                        }
                      }
                    }}
                    className="hidden"
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload" className="cursor-pointer">
                    <div className="text-3xl mb-2">📄</div>
                    <p className="text-sm text-gray-600">
                      <span className="text-blue-600 font-medium">Upload a file</span> or paste below
                    </p>
                    <p className="text-xs text-gray-400 mt-1">.txt, .pdf, .doc supported</p>
                  </label>
                </div>

                <div className="relative">
                  <div className="absolute inset-x-0 top-0 flex justify-center -translate-y-1/2">
                    <span className="bg-white px-3 text-sm text-gray-400">or paste directly</span>
                  </div>
                </div>

                <textarea
                  value={profile.resumeText}
                  onChange={(e) => setProfile({ ...profile, resumeText: e.target.value })}
                  placeholder="Paste your resume text here..."
                  rows={6}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setOnboardingStep(1)}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setOnboardingStep(3)}
                    disabled={profile.resumeText.length < 50}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {onboardingStep === 3 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center">Almost there!</h2>
                <p className="text-gray-600 text-center">What are you looking for?</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target titles</label>
                  <input
                    type="text"
                    value={profile.targetTitles.join(', ')}
                    onChange={(e) => setProfile({ ...profile, targetTitles: e.target.value.split(',').map(t => t.trim()) })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <input
                    type="text"
                    value={profile.keywords.join(', ')}
                    onChange={(e) => setProfile({ ...profile, keywords: e.target.value.split(',').map(k => k.trim()) })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setOnboardingStep(2)}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200"
                  >
                    Back
                  </button>
                  <button
                    onClick={completeOnboarding}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
                  >
                    Find Jobs
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Profile</h2>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                <div className="mb-2">
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file && file.type === 'text/plain') {
                        const text = await file.text()
                        setProfile({ ...profile, resumeText: text })
                      }
                    }}
                    className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <textarea
                  value={profile.resumeText}
                  onChange={(e) => setProfile({ ...profile, resumeText: e.target.value })}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                  placeholder="Or paste your resume text here..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Target titles</label>
                <input
                  type="text"
                  value={profile.targetTitles.join(', ')}
                  onChange={(e) => setProfile({ ...profile, targetTitles: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <input
                  type="text"
                  value={profile.keywords.join(', ')}
                  onChange={(e) => setProfile({ ...profile, keywords: e.target.value.split(',').map(k => k.trim()) })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                />
              </div>
              <button
                onClick={() => {
                  setShowProfileModal(false)
                  showToast('Profile updated!')
                }}
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Search Agent</h1>
          <p className="text-gray-600 mt-1">AI-powered job search assistant</p>
        </div>
        {!showOnboarding && (
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium">{profile.name}</span>
          </button>
        )}
      </header>

      {/* Main Content (only show after onboarding) */}
      {!showOnboarding && (
        <>
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            {[
              { id: 'search', label: 'Find Jobs', count: jobs.filter(j => j.status === 'new').length },
              { id: 'pipeline', label: 'Pipeline', count: jobs.filter(j => j.status !== 'new').length },
              { id: 'outreach', label: 'Outreach', count: selectedJob ? 1 : 0 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 font-medium flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Searching for <span className="font-medium">{profile.targetTitles[0]}</span> in <span className="font-medium">{profile.location}</span>
                </div>
                <button
                  onClick={searchJobs}
                  disabled={isSearching}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSearching && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {isSearching ? 'Searching...' : 'Refresh Jobs'}
                </button>
              </div>

              {jobs.length > 0 ? (
                <div className="space-y-3">
                  {jobs.filter(j => j.status === 'new').map((job) => (
                    <div
                      key={job.id}
                      className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{job.title}</h3>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              job.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                              job.matchScore >= 70 ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {job.matchScore}% match
                            </span>
                          </div>
                          <p className="text-gray-600 mt-1">{job.company} • {job.location}</p>
                          {job.whyMatch && (
                            <p className="text-sm text-gray-500 mt-2 italic">"{job.whyMatch}"</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => markInterested(job.id)}
                          className="px-4 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium"
                        >
                          + Interested
                        </button>
                        <button
                          onClick={() => generateOutreach(job)}
                          className="px-4 py-2 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 font-medium"
                        >
                          Draft Outreach
                        </button>
                        <a
                          href={job.url}
                          target="_blank"
                          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
                        >
                          View Job →
                        </a>
                      </div>
                    </div>
                  ))}
                  {jobs.filter(j => j.status === 'new').length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      All jobs moved to pipeline! Click "Refresh Jobs" to find more.
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <p className="text-gray-500">Click "Refresh Jobs" to find matching opportunities</p>
                </div>
              )}
            </div>
          )}

          {/* Pipeline Tab */}
          {activeTab === 'pipeline' && (
            <div className="grid grid-cols-4 gap-4">
              {(['interested', 'applied', 'interviewing'] as const).map((status) => (
                <div key={status} className="bg-gray-50 rounded-xl p-4 min-h-[400px]">
                  <h3 className="font-medium capitalize text-gray-700 mb-3 flex items-center justify-between">
                    {status}
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                      {jobs.filter(j => j.status === status).length}
                    </span>
                  </h3>
                  <div className="space-y-2">
                    {jobs.filter(j => j.status === status).map((job) => (
                      <div 
                        key={job.id} 
                        className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => generateOutreach(job)}
                      >
                        <p className="font-medium text-sm">{job.company}</p>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{job.title}</p>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            job.matchScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {job.matchScore}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="bg-green-50 rounded-xl p-4 min-h-[400px]">
                <h3 className="font-medium text-green-700 mb-3">Offers</h3>
                <div className="text-center py-12 text-green-600/50">
                  <span className="text-3xl">🎉</span>
                  <p className="text-sm mt-2">Offers will appear here</p>
                </div>
              </div>
            </div>
          )}

          {/* Outreach Tab */}
          {activeTab === 'outreach' && (
            <div className="max-w-4xl mx-auto">
              {selectedJob ? (
                <div className="grid grid-cols-3 gap-6">
                  {/* Left: Hiring Manager Card */}
                  <div className="col-span-1">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="bg-purple-50 p-4 border-b border-purple-100">
                        <h3 className="font-medium text-purple-900">Hiring Manager</h3>
                      </div>
                      <div className="p-4">
                        {isResearchingHM ? (
                          <div className="flex flex-col items-center py-8">
                            <div className="w-8 h-8 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin mb-3"></div>
                            <p className="text-sm text-gray-500">Researching...</p>
                          </div>
                        ) : hiringManager ? (
                          <div className="space-y-3">
                            <div>
                              <p className="font-semibold">{hiringManager.name}</p>
                              <p className="text-sm text-gray-600">{hiringManager.title}</p>
                            </div>
                            <div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                hiringManager.confidence === 'high' ? 'bg-green-100 text-green-700' :
                                hiringManager.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {hiringManager.confidence} confidence
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{hiringManager.reasoning}</p>
                            <a
                              href={hiringManager.linkedinUrl}
                              target="_blank"
                              className="block w-full py-2 bg-blue-600 text-white text-center rounded-lg text-sm font-medium hover:bg-blue-700"
                            >
                              View on LinkedIn →
                            </a>
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-400">
                            <p className="text-sm">No hiring manager found</p>
                            <button
                              onClick={() => researchHiringManager(selectedJob)}
                              className="mt-2 text-purple-600 text-sm font-medium hover:text-purple-700"
                            >
                              Search again
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Job card */}
                    <div className="mt-4 bg-gray-50 rounded-xl p-4">
                      <p className="font-medium text-sm">{selectedJob.title}</p>
                      <p className="text-gray-600 text-xs mt-1">{selectedJob.company}</p>
                      <p className="text-gray-500 text-xs">{selectedJob.location}</p>
                      <a
                        href={selectedJob.url}
                        target="_blank"
                        className="text-blue-600 text-xs mt-2 inline-block hover:text-blue-700"
                      >
                        View job posting →
                      </a>
                    </div>
                  </div>

                  {/* Right: Message Draft */}
                  <div className="col-span-2">
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <h3 className="font-medium">Outreach Message</h3>
                        <p className="text-sm text-gray-500">Personalized for {selectedJob.company}</p>
                      </div>

                      <div className="p-6">
                        {isGenerating ? (
                          <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-10 h-10 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-600">Crafting your personalized message...</p>
                          </div>
                        ) : (
                          <>
                            <textarea
                              value={outreachDraft}
                              onChange={(e) => setOutreachDraft(e.target.value)}
                              rows={12}
                              className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                            <div className="mt-4 flex gap-3">
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(outreachDraft)
                                  showToast('Copied to clipboard!')
                                }}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                              >
                                Copy to Clipboard
                              </button>
                              <button
                                onClick={() => generateOutreach(selectedJob)}
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
                              >
                                Regenerate
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✍️</span>
                  </div>
                  <p className="text-gray-500">Select a job and click "Draft Outreach" to get started</p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    ← Back to jobs
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Custom styles for animations */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </main>
  )
}
