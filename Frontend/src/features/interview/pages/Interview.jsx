import React, { useState } from 'react'
import { useInterview } from '../hooks/useInterview.js'
import { useParams, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth.js'


const NAV_ITEMS = [
    {
        id: 'technical', label: 'Technical Q&A', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
        )
    },
    {
        id: 'behavioral', label: 'Behavioral Q&A', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )
    },
    {
        id: 'roadmap', label: 'Prep Road Map', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
        )
    },
    {
        id: 'learningRoadmap', label: 'Learning Roadmap', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        )
    },
    {
        id: 'projects', label: 'Projects & Resources', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
        )
    },
    {
        id: 'gaps', label: 'Detailed Skill Gaps', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        )
    },
    {
        id: 'practice', label: 'Interactive Practice', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        )
    }
]

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='glass-card overflow-hidden transition-all duration-200 animate-[fadeIn_0.3s_ease-out] hover:border-accent/20'>
            <div
                className='flex items-start gap-4 p-5 cursor-pointer select-none group'
                onClick={() => setOpen(o => !o)}
            >
                <span className='flex items-center justify-center w-8 h-8 shrink-0 rounded-lg bg-accent/10 text-accent text-xs font-bold'>
                    Q{index + 1}
                </span>
                <p className='flex-1 text-sm text-text-primary leading-relaxed pt-1'>{item.question}</p>
                <span className={`text-text-muted transition-transform duration-200 mt-1 ${open ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='px-5 pb-5 pt-0 flex flex-col gap-4 animate-[fadeIn_0.2s_ease-out]'>
                    <div className='pl-12'>
                        <div className='flex items-center gap-2 mb-2'>
                            <span className='px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-warning/10 text-warning rounded-md'>
                                Intention
                            </span>
                        </div>
                        <p className='text-sm text-text-secondary leading-relaxed'>{item.intention}</p>
                    </div>
                    <div className='pl-12'>
                        <div className='flex items-center gap-2 mb-2'>
                            <span className='px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-success/10 text-success rounded-md'>
                                Model Answer
                            </span>
                        </div>
                        <p className='text-sm text-text-secondary leading-relaxed'>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='glass-card p-5 animate-[fadeIn_0.3s_ease-out] hover:border-accent/20 transition-all duration-200'>
        <div className='flex items-center gap-3 mb-4'>
            <span className='flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10 text-accent text-xs font-bold'>
                D{day.day}
            </span>
            <h3 className='font-semibold text-text-primary'>{day.focus}</h3>
        </div>
        <ul className='flex flex-col gap-2.5 pl-1'>
            {day.tasks.map((task, i) => (
                <li key={i} className='flex items-start gap-3 text-sm text-text-secondary'>
                    <span className='w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const LearningRoadmapWeek = ({ item }) => (
    <div className='glass-card p-6 animate-[fadeIn_0.3s_ease-out] hover:border-accent/20 transition-all duration-200 flex flex-col gap-4'>
        <div className='flex items-center gap-3 border-b border-border/50 pb-3'>
            <span className='flex items-center justify-center w-20 h-8 rounded-lg bg-accent/10 text-accent text-xs font-bold'>
                Week {item.week}
            </span>
            <h3 className='font-bold text-text-primary text-base'>{item.focus}</h3>
        </div>
        <div>
            <h4 className='text-xs font-semibold text-text-muted uppercase tracking-wider mb-2.5'>Learning Tasks</h4>
            <ul className='flex flex-col gap-2.5'>
                {item.tasks.map((task, i) => (
                    <li key={i} className='flex items-start gap-3 text-sm text-text-secondary leading-relaxed'>
                        <span className='w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0' />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
        {item.checkpoint && (
            <div className='mt-2 p-3 bg-success/5 border border-success/15 rounded-lg flex items-start gap-2.5'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='text-success mt-0.5 shrink-0'><polyline points="20 6 9 17 4 12" /></svg>
                <div className='text-xs text-text-secondary leading-relaxed'>
                    <strong className='text-success font-medium'>Checkpoint:</strong> {item.checkpoint}
                </div>
            </div>
        )}
    </div>
)

const ProjectCard = ({ project, index }) => (
    <div className='glass-card p-6 animate-[fadeIn_0.3s_ease-out] hover:border-accent/20 transition-all duration-200 flex flex-col gap-3'>
        <div className='flex items-center gap-3'>
            <span className='flex items-center justify-center w-8 h-8 rounded-lg bg-accent/15 text-accent text-xs font-bold'>
                {index + 1}
            </span>
            <h3 className='font-bold text-text-primary text-base'>{project.title}</h3>
        </div>
        <p className='text-sm text-text-secondary leading-relaxed'>{project.description}</p>
        <div className='flex flex-wrap gap-2 mt-2'>
            {project.skillsPracticed.map((skill, i) => (
                <span key={i} className='px-2.5 py-0.5 text-[11px] font-medium bg-bg-badge text-text-secondary rounded-md border border-border/50'>
                    {skill}
                </span>
            ))}
        </div>
    </div>
)

const ResourceCard = ({ resource }) => (
    <div className='glass-card p-5 animate-[fadeIn_0.3s_ease-out] hover:border-accent/20 transition-all duration-200 flex items-start gap-4 justify-between'>
        <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 mb-1'>
                <span className='px-2 py-0.5 text-[10px] font-semibold bg-accent/10 text-accent rounded uppercase tracking-wider'>
                    {resource.skill}
                </span>
                <span className='px-2 py-0.5 text-[10px] font-medium bg-bg-badge text-text-muted rounded'>
                    {resource.type}
                </span>
            </div>
            <h3 className='font-semibold text-text-primary text-sm truncate'>{resource.resourceName}</h3>
        </div>
        {resource.url && (
            <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className='px-3.5 py-1.5 bg-border hover:bg-border-focus text-text-secondary hover:text-text-primary text-xs font-semibold rounded-lg transition-all duration-200 text-center select-none shrink-0'
            >
                View Resource
            </a>
        )}
    </div>
)

const SkillGapRow = ({ gap }) => (
    <div className='glass-card p-5 animate-[fadeIn_0.3s_ease-out] hover:border-accent/20 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between'>
        <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-3 mb-2'>
                <h3 className='font-bold text-text-primary text-base'>{gap.skill}</h3>
                <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider
                        ${gap.severity === 'high'
                            ? 'bg-danger/10 text-danger border border-danger/20'
                            : gap.severity === 'medium'
                                ? 'bg-warning/10 text-warning border border-warning/20'
                                : 'bg-success/10 text-success border border-success/20'
                        }`}
                >
                    {gap.severity} Priority
                </span>
            </div>
            <p className='text-sm text-text-secondary leading-relaxed'>{gap.reason || 'Critical concept required for this role.'}</p>
        </div>
    </div>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('technical')
    const { report, loading, getResumePdf, triggerStartMock, triggerSubmitMock } = useInterview()
    const { interviewId } = useParams()
    const navigate = useNavigate()
    const { user, handleLogout } = useAuth()

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [userAnswers, setUserAnswers] = useState([])
    const [quizSubmitting, setQuizSubmitting] = useState(false)
    const [quizError, setQuizError] = useState("")

    // Synchronize userAnswers state when the report is loaded/fetched from the DB (e.g. on page reload)
    React.useEffect(() => {
        if (report && report.mockInterview && report.mockInterview.questions && report.mockInterview.questions.length > 0 && userAnswers.length === 0) {
            setUserAnswers(report.mockInterview.questions.map(q => ({
                question: q.question,
                candidateAnswer: q.candidateAnswer || ""
            })))
        }
    }, [report])

    const handleStartMock = async () => {
        setQuizError("")
        try {
            const res = await triggerStartMock(interviewId)
            if (res && res.questions) {
                setCurrentQuestionIndex(0)
                setUserAnswers(res.questions.map(q => ({ question: q.question, candidateAnswer: "" })))
            } else {
                setQuizError("Failed to generate questions. Please try again.")
            }
        } catch (err) {
            setQuizError(err.message || "Failed to generate questions. Please try again.")
        }
    }

    const handleAnswerChange = (val) => {
        setUserAnswers(prev => {
            const updated = [...prev]
            // Defensively populate the array from report if it is empty/out-of-sync
            if (updated.length === 0 && report && report.mockInterview && report.mockInterview.questions) {
                report.mockInterview.questions.forEach((q, i) => {
                    updated[i] = {
                        question: q.question,
                        candidateAnswer: i === currentQuestionIndex ? val : (q.candidateAnswer || "")
                    }
                })
            }
            if (updated[currentQuestionIndex]) {
                updated[currentQuestionIndex] = {
                    ...updated[currentQuestionIndex],
                    candidateAnswer: val
                }
            }
            return updated
        })
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Tab') {
            e.preventDefault()
            const start = e.target.selectionStart
            const end = e.target.selectionEnd
            const val = e.target.value
            const newVal = val.substring(0, start) + "    " + val.substring(end)
            handleAnswerChange(newVal)
            
            setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 4
            }, 0)
        }
    }

    const handleSubmitMock = async () => {
        setQuizError("")
        setQuizSubmitting(true)
        try {
            const res = await triggerSubmitMock(interviewId, userAnswers)
            if (!res) {
                setQuizError("Failed to submit answers. Please try again.")
            }
        } catch (err) {
            setQuizError(err.message || "Something went wrong. Please try again.")
        } finally {
            setQuizSubmitting(false)
        }
    }

    const activeNavItems = report && report.learningRoadmap && report.learningRoadmap.length > 0
        ? NAV_ITEMS
        : NAV_ITEMS.filter(item => ['technical', 'behavioral', 'roadmap', 'practice'].includes(item.id))

    const handleLogoutClick = async () => {
        await handleLogout()
        navigate('/login')
    }

    if (loading || !report) {
        return (
            <main className='min-h-screen w-full flex flex-col items-center justify-center bg-bg-primary gap-4'>
                <div className='relative'>
                    <div className='w-14 h-14 border-3 border-accent/20 rounded-full'></div>
                    <div className='absolute inset-0 w-14 h-14 border-3 border-accent border-t-transparent rounded-full animate-spin'></div>
                </div>
                <p className='text-text-secondary text-sm'>Loading your interview plan...</p>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'text-success' :
            report.matchScore >= 60 ? 'text-warning' : 'text-danger'

    const scoreBg =
        report.matchScore >= 80 ? 'bg-success' :
            report.matchScore >= 60 ? 'bg-warning' : 'bg-danger'

    const scoreRingColor =
        report.matchScore >= 80 ? 'border-success' :
            report.matchScore >= 60 ? 'border-warning' : 'border-danger'


    return (
        <div className='min-h-screen bg-bg-primary'>

            {/* Top Bar */}
            <nav className='border-b border-border/50'>
                <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate('/')}>
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

            <div className='max-w-7xl mx-auto px-6 py-5'>

                {/* Title bar */}
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5'>
                    <div>
                        <button onClick={() => navigate('/')} className='flex items-center gap-1 text-text-muted hover:text-text-secondary text-xs mb-2 cursor-pointer transition-colors duration-200'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                            Back to Dashboard
                        </button>
                        <h1 className='text-2xl font-bold text-text-primary'>{report.title || 'Interview Plan'}</h1>
                    </div>
                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        id="download-resume-btn"
                        className='flex items-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-lg transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_0_20px_var(--color-accent-glow)]'
                    >
                        <svg height="14" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button>
                </div>

                <div className='flex flex-col lg:flex-row gap-6'>

                    {/* ── Left Nav ── */}
                    <aside className='lg:w-56 shrink-0'>
                        <div className='glass-card p-3 lg:sticky lg:top-8'>
                            <p className='text-[10px] font-semibold uppercase tracking-wider text-text-muted px-3 pt-2 pb-3'>Sections</p>
                            <div className='flex flex-row lg:flex-col gap-1'>
                                {activeNavItems.map(item => (
                                    <button
                                        key={item.id}
                                        className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                                            ${activeNav === item.id
                                                ? 'bg-accent/10 text-accent'
                                                : 'text-text-secondary hover:text-text-primary hover:bg-bg-card-hover'
                                            }`}
                                        onClick={() => setActiveNav(item.id)}
                                    >
                                        <span className='shrink-0'>{item.icon}</span>
                                        <span className='hidden sm:inline'>{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* ── Center Content ── */}
                    <main className='flex-1 min-w-0'>
                        {activeNav === 'technical' && (
                            <section>
                                <div className='flex items-center justify-between mb-5'>
                                    <h2 className='text-lg font-bold text-text-primary'>Technical Questions</h2>
                                    <span className='text-xs font-medium text-text-muted bg-bg-badge px-3 py-1.5 rounded-full'>
                                        {report.technicalQuestions.length} questions
                                    </span>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    {report.technicalQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'behavioral' && (
                            <section>
                                <div className='flex items-center justify-between mb-5'>
                                    <h2 className='text-lg font-bold text-text-primary'>Behavioral Questions</h2>
                                    <span className='text-xs font-medium text-text-muted bg-bg-badge px-3 py-1.5 rounded-full'>
                                        {report.behavioralQuestions.length} questions
                                    </span>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    {report.behavioralQuestions.map((q, i) => (
                                        <QuestionCard key={i} item={q} index={i} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'roadmap' && (
                            <section>
                                <div className='flex items-center justify-between mb-5'>
                                    <h2 className='text-lg font-bold text-text-primary'>Preparation Road Map</h2>
                                    <span className='text-xs font-medium text-text-muted bg-bg-badge px-3 py-1.5 rounded-full'>
                                        {report.preparationPlan.length}-day plan
                                    </span>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    {report.preparationPlan.map((day) => (
                                        <RoadMapDay key={day.day} day={day} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'learningRoadmap' && report.learningRoadmap && (
                            <section>
                                <div className='flex items-center justify-between mb-5'>
                                    <h2 className='text-lg font-bold text-text-primary'>Personalized Learning Roadmap</h2>
                                    <span className='text-xs font-medium text-text-muted bg-bg-badge px-3 py-1.5 rounded-full'>
                                        {report.learningRoadmap.length} Weeks
                                    </span>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    {report.learningRoadmap.map((item, i) => (
                                        <LearningRoadmapWeek key={i} item={item} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {activeNav === 'projects' && (
                            <section>
                                <div className='mb-6'>
                                    <h2 className='text-lg font-bold text-text-primary mb-1'>Recommended Mini-Projects</h2>
                                    <p className='text-xs text-text-secondary'>Hands-on projects targeting your missing skills</p>
                                </div>
                                <div className='flex flex-col gap-4 mb-8'>
                                    {report.recommendedProjects && report.recommendedProjects.length > 0 ? (
                                        report.recommendedProjects.map((p, i) => (
                                            <ProjectCard key={i} project={p} index={i} />
                                        ))
                                    ) : (
                                        <p className='text-sm text-text-secondary glass-card p-5'>No projects recommended.</p>
                                    )}
                                </div>

                                <div className='mb-6 pt-4 border-t border-border/50'>
                                    <h2 className='text-lg font-bold text-text-primary mb-1'>Learning Resources</h2>
                                    <p className='text-xs text-text-secondary'>Curated tutorials, guides, and courses</p>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {report.learningResources && report.learningResources.length > 0 ? (
                                        report.learningResources.map((r, i) => (
                                            <ResourceCard key={i} resource={r} />
                                        ))
                                    ) : (
                                        <p className='text-sm text-text-secondary glass-card p-5 col-span-2'>No resources suggested.</p>
                                    )}
                                </div>
                            </section>
                        )}

                        {activeNav === 'gaps' && (
                            <section>
                                <div className='mb-6'>
                                    <h2 className='text-lg font-bold text-text-primary mb-1'>Detailed Skill Gap Analysis</h2>
                                    <p className='text-xs text-text-secondary'>Concepts and frameworks missing from your profile</p>
                                </div>
                                <div className='flex flex-col gap-4'>
                                    {report.skillGaps && report.skillGaps.length > 0 ? (
                                        report.skillGaps.map((gap, i) => (
                                            <SkillGapRow key={i} gap={gap} />
                                        ))
                                    ) : (
                                        <p className='text-sm text-text-secondary glass-card p-5'>No skill gaps identified!</p>
                                    )}
                                </div>
                            </section>
                        )}

                        {activeNav === 'practice' && (
                            <section>
                                <div className='mb-6'>
                                    <h2 className='text-lg font-bold text-text-primary mb-1'>Interactive Mock Interview Practice</h2>
                                    <p className='text-xs text-text-secondary'>Test your skills and get analyzed in real-time by Google Gemini AI</p>
                                </div>

                                {quizSubmitting ? (
                                    <div className='glass-card p-10 flex flex-col items-center justify-center gap-4 animate-[fadeIn_0.3s_ease-out]'>
                                        <div className='relative'>
                                            <div className='w-14 h-14 border-3 border-accent/20 rounded-full'></div>
                                            <div className='absolute inset-0 w-14 h-14 border-3 border-accent border-t-transparent rounded-full animate-spin'></div>
                                        </div>
                                        <p className='text-text-primary font-medium text-sm'>Analyzing your answers...</p>
                                        <p className='text-xs text-text-muted'>Our AI is evaluating your technical accuracy, communication, and problem solving.</p>
                                    </div>
                                ) : quizError ? (
                                    <div className='glass-card p-6 flex flex-col gap-4 text-center items-center'>
                                        <p className='text-danger text-sm'>{quizError}</p>
                                        <button onClick={handleStartMock} className='px-4 py-2 bg-accent text-white text-xs font-semibold rounded-lg hover:bg-accent-hover transition-colors'>
                                            Retry
                                        </button>
                                    </div>
                                ) : !report.mockInterview || report.mockInterview.status === 'not_started' ? (
                                    <div className='glass-card p-8 animate-[fadeIn_0.3s_ease-out] flex flex-col items-center text-center gap-6'>
                                        <div className='w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                        </div>
                                        <div>
                                            <h3 className='font-bold text-text-primary text-lg mb-2'>Ready to practice your interview?</h3>
                                            <p className='text-sm text-text-secondary max-w-md mx-auto leading-relaxed'>
                                                We will generate custom, role-specific technical and behavioral questions based on your resume and this target job description. Write your answers and get deep analysis scorecards!
                                            </p>
                                        </div>
                                        <button
                                            onClick={handleStartMock}
                                            className='px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-lg transition-all duration-200 shadow-[0_0_20px_var(--color-accent-glow)] cursor-pointer'
                                        >
                                            Generate & Start Practice Quiz
                                        </button>
                                    </div>
                                ) : report.mockInterview.status === 'in_progress' ? (
                                    <div className='glass-card p-8 animate-[fadeIn_0.3s_ease-out] flex flex-col gap-6'>
                                        {/* Progress Header */}
                                        <div className='flex items-center justify-between border-b border-border/50 pb-4'>
                                            <div className='flex flex-col gap-1'>
                                                <span className='px-2.5 py-0.5 text-[10px] font-semibold bg-accent/15 text-accent rounded uppercase tracking-wider w-fit'>
                                                    Question {currentQuestionIndex + 1} of {report.mockInterview.questions.length}
                                                </span>
                                                <span className='text-xs text-text-muted mt-1'>
                                                    Type: <strong className='text-text-secondary capitalize'>{report.mockInterview.questions[currentQuestionIndex].type}</strong>
                                                    {report.mockInterview.questions[currentQuestionIndex].difficulty && (
                                                        <> • Difficulty: <strong className='text-text-secondary capitalize'>{report.mockInterview.questions[currentQuestionIndex].difficulty}</strong></>
                                                    )}
                                                </span>
                                            </div>
                                            <span className='text-xs text-text-muted'>
                                                Topic: <strong className='text-text-primary'>{report.mockInterview.questions[currentQuestionIndex].skill}</strong>
                                            </span>
                                        </div>

                                        {/* Question Text */}
                                        <div className='py-4'>
                                            <p className='text-text-primary font-medium text-base leading-relaxed'>
                                                {report.mockInterview.questions[currentQuestionIndex].question}
                                            </p>
                                        </div>

                                        {/* Answer Area */}
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex justify-between items-center'>
                                                <label htmlFor="answer-input" className='text-xs font-semibold text-text-secondary uppercase tracking-wider'>Your Answer</label>
                                                <span className='text-[10px] text-text-muted font-medium'>Press Tab for indentation • Linebreaks are preserved</span>
                                            </div>
                                            <textarea
                                                id="answer-input"
                                                value={userAnswers[currentQuestionIndex]?.candidateAnswer || ""}
                                                onChange={(e) => handleAnswerChange(e.target.value)}
                                                onKeyDown={handleKeyDown}
                                                className='w-full h-36 px-4 py-3 bg-bg-input border border-border rounded-xl text-text-primary placeholder-text-muted text-sm font-mono outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all duration-200'
                                                placeholder="Type your response or paste code blocks here..."
                                            />
                                        </div>

                                        {/* Controls */}
                                        <div className='flex items-center justify-between border-t border-border/50 pt-4 mt-2'>
                                            <button
                                                disabled={currentQuestionIndex === 0}
                                                onClick={() => setCurrentQuestionIndex(i => i - 1)}
                                                className='px-4 py-2 text-xs font-semibold border border-border text-text-secondary hover:text-text-primary hover:border-border-focus rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer'
                                            >
                                                Back
                                            </button>

                                            {currentQuestionIndex < report.mockInterview.questions.length - 1 ? (
                                                <button
                                                    onClick={() => setCurrentQuestionIndex(i => i + 1)}
                                                    className='px-4 py-2 text-xs font-semibold bg-accent hover:bg-accent-hover text-white rounded-lg transition-all duration-200 shadow-[0_0_15px_var(--color-accent-glow)] cursor-pointer'
                                                >
                                                    Next Question
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleSubmitMock}
                                                    className='px-5 py-2.5 bg-success hover:bg-success/90 text-white text-xs font-bold rounded-lg transition-all duration-200 shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer'
                                                >
                                                    Submit Interview
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    /* Evaluated State Dashboard */
                                    <div className='flex flex-col gap-4 animate-[fadeIn_0.3s_ease-out]'>
                                        
                                        {/* Evaluation Scores Summary */}
                                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                                            <div className='glass-card p-4 text-center flex flex-col items-center justify-center gap-1.5'>
                                                <span className='text-[10px] font-semibold text-text-muted uppercase tracking-wider'>Technical</span>
                                                <div className='text-2xl font-black text-accent'>{report.mockInterview.evaluation.technicalScore}/10</div>
                                            </div>
                                            <div className='glass-card p-4 text-center flex flex-col items-center justify-center gap-1.5'>
                                                <span className='text-[10px] font-semibold text-text-muted uppercase tracking-wider'>Communication</span>
                                                <div className='text-2xl font-black text-warning'>{report.mockInterview.evaluation.communicationScore}/10</div>
                                            </div>
                                            <div className='glass-card p-4 text-center flex flex-col items-center justify-center gap-1.5'>
                                                <span className='text-[10px] font-semibold text-text-muted uppercase tracking-wider'>Problem Solving</span>
                                                <div className='text-2xl font-black text-success'>{report.mockInterview.evaluation.problemSolvingScore}/10</div>
                                            </div>
                                            <div className='glass-card p-4 text-center flex flex-col items-center justify-center gap-1.5 border border-accent/25 bg-accent/5'>
                                                <span className='text-[10px] font-semibold text-text-primary uppercase tracking-wider'>Overall Score</span>
                                                <div className='text-3xl font-black text-white'>{report.mockInterview.evaluation.overallScore}/10</div>
                                            </div>
                                        </div>
 
                                        {/* Strengths & Improvements */}
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div className='glass-card p-4 flex flex-col gap-2'>
                                                <h3 className='font-bold text-success text-sm flex items-center gap-2'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                                    Key Strengths
                                                </h3>
                                                <ul className='flex flex-col gap-2 pl-1'>
                                                    {report.mockInterview.evaluation.strengths.map((str, i) => (
                                                        <li key={i} className='flex items-start gap-2 text-xs text-text-secondary leading-relaxed'>
                                                            <span className='w-1 h-1 rounded-full bg-success mt-1.5 shrink-0' />
                                                            {str}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
 
                                            <div className='glass-card p-4 flex flex-col gap-2'>
                                                <h3 className='font-bold text-danger text-sm flex items-center gap-2'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                                    Areas for Improvement
                                                </h3>
                                                <ul className='flex flex-col gap-2 pl-1'>
                                                    {report.mockInterview.evaluation.improvements.map((imp, i) => (
                                                        <li key={i} className='flex items-start gap-2 text-xs text-text-secondary leading-relaxed'>
                                                            <span className='w-1 h-1 rounded-full bg-danger mt-1.5 shrink-0' />
                                                            {imp}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
 
                                        {/* Recommended Next Steps */}
                                        <div className='glass-card p-4 flex flex-col gap-2'>
                                            <h3 className='font-bold text-text-primary text-sm flex items-center gap-2'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 22 22 22" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                                                Recommended Next Steps
                                            </h3>
                                            <ul className='flex flex-col gap-2 pl-1'>
                                                {report.mockInterview.evaluation.nextSteps.map((step, i) => (
                                                    <li key={i} className='flex items-start gap-2 text-xs text-text-secondary leading-relaxed'>
                                                        <span className='w-1 h-1 rounded-full bg-accent mt-1.5 shrink-0' />
                                                        {step}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Detailed Q&A Analysis list */}
                                        <div className='mt-2'>
                                            <h3 className='font-bold text-text-primary text-base mb-4'>Question-by-Question Analysis</h3>
                                            <div className='flex flex-col gap-4'>
                                                {report.mockInterview.questions.map((q, i) => (
                                                    <div key={i} className='glass-card p-4 flex flex-col gap-3'>
                                                        <div className='flex items-center gap-2.5 border-b border-border/50 pb-2.5'>
                                                            <span className='flex items-center justify-center w-7 h-7 rounded-lg bg-accent/15 text-accent text-xs font-black shrink-0'>
                                                                Q{i+1}
                                                            </span>
                                                            <div className='flex flex-col min-w-0'>
                                                                <h4 className='font-bold text-text-primary text-xs leading-relaxed'>{q.question}</h4>
                                                                <span className='text-[9px] text-text-muted mt-0.5 capitalize'>{q.type} • tested: {q.skill}</span>
                                                            </div>
                                                        </div>
                                                        <div className='pl-1 flex flex-col gap-2.5'>
                                                            <div>
                                                                <span className='text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-0.5'>Your Answer</span>
                                                                <p className='text-xs text-text-secondary leading-relaxed font-mono whitespace-pre-wrap bg-bg-badge p-2.5 rounded-lg border border-border/30'>
                                                                    {q.candidateAnswer ? q.candidateAnswer : "(No answer submitted)"}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <span className='text-[9px] font-bold text-warning uppercase tracking-wider block mb-0.5'>Feedback</span>
                                                                <p className='text-xs text-text-secondary leading-relaxed whitespace-pre-wrap'>{q.feedback}</p>
                                                            </div>
                                                            <div>
                                                                <span className='text-[9px] font-bold text-success uppercase tracking-wider block mb-0.5'>Suggested Model Answer</span>
                                                                <p className='text-xs text-text-secondary leading-relaxed font-mono whitespace-pre-wrap bg-success/5 p-2.5 rounded-lg border border-success/10'>{q.suggestedAnswer}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Restart button */}
                                        <div className='flex justify-center mt-4'>
                                            <button
                                                onClick={handleStartMock}
                                                className='px-6 py-3 border border-border hover:border-border-focus text-text-secondary hover:text-text-primary text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer'
                                            >
                                                Start New Mock Interview
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                    </main>

                    {/* ── Right Sidebar ── */}
                    <aside className='lg:w-64 shrink-0'>
                        <div className='glass-card p-6 lg:sticky lg:top-8 flex flex-col gap-6'>

                            {/* Match Score */}
                            <div className='text-center'>
                                <p className='text-xs font-semibold uppercase tracking-wider text-text-muted mb-4'>Match Score</p>
                                <div className={`relative inline-flex items-center justify-center w-28 h-28 rounded-full border-4 ${scoreRingColor} animate-[pulse-ring_2s_ease-out_1]`}>
                                    <div className='flex items-baseline'>
                                        <span className={`text-3xl font-bold ${scoreColor}`}>{report.matchScore}</span>
                                        <span className={`text-sm font-medium ${scoreColor} ml-0.5`}>%</span>
                                    </div>
                                </div>
                                <p className='text-xs text-text-muted mt-3'>
                                    {report.matchScore >= 80 ? 'Excellent match for this role' :
                                        report.matchScore >= 60 ? 'Good match with some gaps' :
                                            'Significant gaps to address'}
                                </p>
                            </div>

                            {report.jobReadinessScore !== undefined && report.jobReadinessScore !== null && (
                                <>
                                    <div className='h-px bg-border/50' />
                                    <div className='text-center'>
                                        <p className='text-xs font-semibold uppercase tracking-wider text-text-muted mb-4'>Readiness Goal</p>
                                        <div className='relative inline-flex items-center justify-center w-28 h-28 rounded-full border-4 border-accent/40 bg-accent/5'>
                                            <div className='flex items-baseline'>
                                                <span className='text-3xl font-bold text-accent'>{report.jobReadinessScore}</span>
                                                <span className='text-sm font-medium text-accent ml-0.5'>%</span>
                                            </div>
                                        </div>
                                        <p className='text-[11px] text-text-muted mt-3 leading-relaxed'>
                                            Projected readiness score after roadmap completion
                                        </p>
                                    </div>
                                </>
                            )}

                            {report.estimatedTimeline && (
                                <>
                                    <div className='h-px bg-border/50' />
                                    <div className='text-center'>
                                        <p className='text-xs font-semibold uppercase tracking-wider text-text-muted mb-2'>Prep Time Needed</p>
                                        <p className='text-xl font-bold text-text-primary'>{report.estimatedTimeline}</p>
                                        <p className='text-[11px] text-text-muted mt-1'>Estimated timeline to become interview-ready</p>
                                    </div>
                                </>
                            )}

                            <div className='h-px bg-border/50' />

                            {/* Skill Gaps List */}
                            <div>
                                <p className='text-xs font-semibold uppercase tracking-wider text-text-muted mb-3'>Gaps Identified</p>
                                <div className='flex flex-wrap gap-2'>
                                    {report.skillGaps.map((gap, i) => (
                                        <span
                                            key={i}
                                            className={`inline-flex items-center px-2.5 py-1 text-[11px] font-medium rounded-lg
                                                ${gap.severity === 'high'
                                                    ? 'bg-danger/10 text-danger border border-danger/20'
                                                    : gap.severity === 'medium'
                                                        ? 'bg-warning/10 text-warning border border-warning/20'
                                                        : 'bg-success/10 text-success border border-success/20'
                                                }`}
                                        >
                                            {gap.skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}

export default Interview