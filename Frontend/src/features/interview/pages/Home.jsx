import React, { useState, useRef, useEffect } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { scrapeJobDescription } from '../services/interview.api.js'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth.js'

const LOADING_STEPS = [
    { text: "Analyzing your profile and target job description..." },
    { text: "Mapping critical skill gaps and requirements..." },
    { text: "Formulating tailor-made technical and behavioral questions..." },
    { text: "Drafting your day-wise study roadmap..." },
    { text: "Assembling custom recommended mini-projects..." },
    { text: "Finalizing your interview preparation strategy..." }
]

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const { user, handleLogout } = useAuth()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [fileName, setFileName] = useState("")
    const [jobUrl, setJobUrl] = useState("")
    const [scraping, setScraping] = useState(false)
    const [scrapingError, setScrapingError] = useState("")
    const [currentStepIndex, setCurrentStepIndex] = useState(0)
    const resumeInputRef = useRef()

    const navigate = useNavigate()

    useEffect(() => {
        if (!loading) {
            setCurrentStepIndex(0)
            return
        }

        let step = 0
        const interval = setInterval(() => {
            step = (step + 1) % LOADING_STEPS.length
            setCurrentStepIndex(step)
        }, 5000)

        return () => clearInterval(interval)
    }, [loading])

    const handleScrapeUrl = async () => {
        if (!jobUrl) {
            setScrapingError("Please enter a URL")
            return
        }
        setScrapingError("")
        setScraping(true)
        try {
            const data = await scrapeJobDescription(jobUrl)
            if (data && data.description) {
                setJobDescription(data.description)
                setJobUrl("")
            } else {
                setScrapingError("Failed to extract job details. Please copy-paste manually.")
            }
        } catch (err) {
            setScrapingError(err?.response?.data?.message || "Error fetching job listing. Please copy-paste manually.")
        } finally {
            setScraping(false)
        }
    }


    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]
        const data = await generateReport({ jobDescription, selfDescription, resumeFile })
        if (data && data._id) {
            navigate(`/interview/${data._id}`)
        }
    }

    const handleFileChange = () => {
        const file = resumeInputRef.current.files[0]
        setFileName(file ? file.name : "")
    }

    const handleLogoutClick = async () => {
        await handleLogout()
        navigate('/login')
    }

    if (loading) {
        return (
            <main className='min-h-screen w-full flex flex-col items-center justify-center bg-bg-primary p-6 gap-6'>
                <div className='relative'>
                    {/* Pulsing glow background */}
                    <div className='absolute -inset-4 bg-accent/20 rounded-full blur-xl animate-pulse'></div>
                    
                    {/* Ring spinner */}
                    <div className='relative w-16 h-16 flex items-center justify-center'>
                        <div className='absolute inset-0 border-4 border-accent/15 rounded-full'></div>
                        <div className='absolute inset-0 border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin'></div>
                        
                        {/* Core AI icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className='text-accent animate-pulse'>
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </div>
                </div>

                <div className='text-center max-w-sm flex flex-col gap-2 animate-[fadeIn_0.3s_ease-out]'>
                    <h2 className='text-text-primary font-bold text-base tracking-wide'>
                        Generating Strategy
                    </h2>
                    <p className='text-text-secondary text-sm leading-relaxed transition-all duration-300 min-h-[48px] px-4'>
                        {LOADING_STEPS[currentStepIndex].text}
                    </p>
                </div>

                {/* Progress Indicators */}
                <div className='flex gap-1.5 justify-center items-center mt-2'>
                    {LOADING_STEPS.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-1 rounded-full transition-all duration-300 ${
                                idx === currentStepIndex 
                                    ? 'w-6 bg-accent' 
                                    : idx < currentStepIndex 
                                        ? 'w-2 bg-accent/40' 
                                        : 'w-2 bg-border'
                            }`}
                        />
                    ))}
                </div>
            </main>
        )
    }

    return (
        <div className='min-h-screen bg-bg-primary'>

            {/* Background effects */}
            <div className='fixed inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute -top-60 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl'></div>
            </div>

            {/* Top Bar */}
            <nav className='relative border-b border-border/50'>
                <div className='max-w-6xl mx-auto px-6 py-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className='text-accent'>
                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                            </svg>
                        </div>
                        <span className='font-bold text-lg text-text-primary'>InterviewAI</span>
                    </div>
                    <div className='flex items-center gap-4'>
                        {user && (
                            <span className='text-text-secondary text-sm hidden sm:block'>
                                Hey, <span className='text-text-primary font-medium'>{user.username}</span>
                            </span>
                        )}
                        <button
                            onClick={handleLogoutClick}
                            id="logout-btn"
                            className='px-4 py-2 text-sm text-text-secondary hover:text-text-primary border border-border hover:border-border-focus rounded-lg transition-all duration-200 cursor-pointer'
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className='relative max-w-6xl mx-auto px-6 py-10'>

                {/* Page Header */}
                <header className='text-center mb-10'>
                    <div className='inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full text-accent text-xs font-medium mb-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                        AI-Powered Interview Preparation
                    </div>
                    <h1 className='text-3xl sm:text-4xl font-bold text-text-primary mb-3'>
                        Create Your Custom <span className='text-accent'>Interview Plan</span>
                    </h1>
                    <p className='text-text-secondary max-w-lg mx-auto'>
                        Let our AI analyze the job requirements and your unique profile to build a winning strategy.
                    </p>
                </header>

                {/* Main Card */}
                <div className='glass-card overflow-hidden animate-[fadeIn_0.5s_ease-out]'>
                    <div className='flex flex-col lg:flex-row'>

                        {/* Left Panel - Job Description */}
                        <div className='flex-1 p-6 lg:p-8'>
                            <div className='flex items-center gap-3 mb-5'>
                                <span className='flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 text-accent'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </span>
                                <h2 className='text-lg font-semibold text-text-primary'>Target Job Description</h2>
                                <span className='ml-auto px-2.5 py-1 text-[11px] font-medium bg-danger/10 text-danger rounded-md'>Required</span>
                            </div>
                            
                            {/* Import via URL */}
                            <div className='mb-4 flex flex-col gap-1.5'>
                                <label htmlFor="job-url-input" className='text-xs font-medium text-text-secondary'>Or Import from Job Link (LinkedIn, Indeed, etc.)</label>
                                <div className='flex gap-2'>
                                    <input
                                        type="url"
                                        id="job-url-input"
                                        placeholder="Paste job posting URL here..."
                                        value={jobUrl}
                                        onChange={(e) => setJobUrl(e.target.value)}
                                        className='flex-1 px-4 py-2.5 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-200'
                                    />
                                    <button
                                        type="button"
                                        onClick={handleScrapeUrl}
                                        disabled={scraping}
                                        className='px-4 py-2.5 bg-accent hover:bg-accent-hover text-white text-xs font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_var(--color-accent-glow)] cursor-pointer'
                                    >
                                        {scraping ? (
                                            <>
                                                <div className='w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                                Importing...
                                            </>
                                        ) : (
                                            "Import"
                                        )}
                                    </button>
                                </div>
                                {scrapingError && (
                                    <span className='text-[11px] text-danger animate-[fadeIn_0.2s_ease-out]'>{scrapingError}</span>
                                )}
                            </div>

                            <textarea
                                onChange={(e) => { setJobDescription(e.target.value) }}
                                value={jobDescription}
                                id="job-description-input"
                                className='w-full h-64 px-4 py-3 bg-bg-input border border-border rounded-xl text-text-primary placeholder-text-muted text-sm resize-none transition-all duration-200 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30'
                                placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                                maxLength={5000}
                            />
                            <div className='flex justify-end mt-2'>
                                <span className='text-xs text-text-muted'>{jobDescription.length} / 5000 chars</span>
                            </div>
                        </div>

                        {/* Vertical Divider */}
                        <div className='hidden lg:block w-px bg-border' />
                        <div className='lg:hidden h-px bg-border mx-6' />

                        {/* Right Panel - Profile */}
                        <div className='flex-1 p-6 lg:p-8'>
                            <div className='flex items-center gap-3 mb-5'>
                                <span className='flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 text-accent'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <h2 className='text-lg font-semibold text-text-primary'>Your Profile</h2>
                            </div>

                            {/* Upload Resume */}
                            <div className='mb-5'>
                                <label className='flex items-center gap-2 text-sm font-medium text-text-secondary mb-2'>
                                    Upload Resume
                                    <span className='px-2 py-0.5 text-[10px] font-medium bg-success/10 text-success rounded-md'>Best Results</span>
                                </label>
                                <label
                                    className='flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-border rounded-xl cursor-pointer transition-all duration-200 hover:border-accent/50 hover:bg-accent/5 group'
                                    htmlFor='resume-upload'
                                >
                                    <span className='flex items-center justify-center w-10 h-10 rounded-full bg-bg-badge text-text-muted group-hover:text-accent transition-colors duration-200'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    {fileName ? (
                                        <p className='text-sm text-accent font-medium'>{fileName}</p>
                                    ) : (
                                        <>
                                            <p className='text-sm text-text-secondary'>Click to upload or drag & drop</p>
                                            <p className='text-xs text-text-muted'>PDF or DOCX (Max 3MB)</p>
                                        </>
                                    )}
                                    <input ref={resumeInputRef} onChange={handleFileChange} hidden type='file' id='resume-upload' name='resume' accept='.pdf,.docx' />
                                </label>
                            </div>

                            {/* OR Divider */}
                            <div className='flex items-center gap-4 my-5'>
                                <div className='flex-1 h-px bg-border'></div>
                                <span className='text-xs font-medium text-text-muted'>OR</span>
                                <div className='flex-1 h-px bg-border'></div>
                            </div>

                            {/* Quick Self-Description */}
                            <div className='mb-5'>
                                <label className='text-sm font-medium text-text-secondary mb-2 block' htmlFor='selfDescription'>Quick Self-Description</label>
                                <textarea
                                    onChange={(e) => { setSelfDescription(e.target.value) }}
                                    value={selfDescription}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='w-full h-24 px-4 py-3 bg-bg-input border border-border rounded-xl text-text-primary placeholder-text-muted text-sm resize-none transition-all duration-200 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30'
                                    placeholder="Briefly describe your experience, key skills, and years of experience..."
                                />
                            </div>

                            {/* Info Box */}
                            <div className='flex items-start gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-accent mt-0.5 shrink-0'>
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                <p className='text-xs text-text-secondary'>
                                    Either a <strong className='text-text-primary'>Resume</strong> or a <strong className='text-text-primary'>Self Description</strong> is required to generate a personalized plan.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className='flex items-center justify-between px-6 lg:px-8 py-4 border-t border-border bg-bg-secondary/30'>
                        <span className='text-xs text-text-muted hidden sm:block'>AI-Powered Strategy Generation • Approx 30s</span>
                        <button
                            onClick={handleGenerateReport}
                            id="generate-report-btn"
                            className='flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-lg transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_0_20px_var(--color-accent-glow)] ml-auto'
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                            </svg>
                            Generate My Interview Strategy
                        </button>
                    </div>
                </div>

                {/* Recent Reports List */}
                {reports.length > 0 && (
                    <section className='mt-12 animate-[fadeIn_0.5s_ease-out_0.2s_both]'>
                        <h2 className='text-xl font-bold text-text-primary mb-6'>My Recent Interview Plans</h2>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {reports.map(report => (
                                <div
                                    key={report._id}
                                    onClick={() => navigate(`/interview/${report._id}`)}
                                    className='glass-card p-5 cursor-pointer transition-all duration-200 hover:border-accent/30 hover:bg-bg-card-hover group'
                                >
                                    <h3 className='font-semibold text-text-primary group-hover:text-accent transition-colors duration-200 mb-2 truncate'>
                                        {report.title || 'Untitled Position'}
                                    </h3>
                                    <p className='text-xs text-text-muted mb-3'>
                                        Generated on {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <div className='flex items-center gap-2'>
                                        <div className={`w-2 h-2 rounded-full ${report.matchScore >= 80 ? 'bg-success' : report.matchScore >= 60 ? 'bg-warning' : 'bg-danger'}`}></div>
                                        <span className={`text-sm font-medium ${report.matchScore >= 80 ? 'text-success' : report.matchScore >= 60 ? 'text-warning' : 'text-danger'}`}>
                                            {report.matchScore}% Match
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Page Footer */}
                <footer className='text-center py-10 mt-12 border-t border-border/30'>
                    <div className='flex items-center justify-center gap-6 text-xs text-text-muted'>
                        <a href='#' className='hover:text-text-secondary transition-colors duration-200'>Privacy Policy</a>
                        <span>•</span>
                        <a href='#' className='hover:text-text-secondary transition-colors duration-200'>Terms of Service</a>
                        <span>•</span>
                        <a href='#' className='hover:text-text-secondary transition-colors duration-200'>Help Center</a>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Home