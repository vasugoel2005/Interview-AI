import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            setError(err?.response?.data?.message || "Registration failed. Please try again.")
        }
    }

    if (loading) {
        return (
            <main className='min-h-screen w-full flex items-center justify-center bg-bg-primary'>
                <div className='flex flex-col items-center gap-4'>
                    <div className='w-10 h-10 border-3 border-accent border-t-transparent rounded-full animate-spin'></div>
                    <p className='text-text-secondary text-sm'>Loading...</p>
                </div>
            </main>
        )
    }

    return (
        <main className='min-h-screen w-full flex items-center justify-center bg-bg-primary p-4'>

            {/* Background gradient accent */}
            <div className='fixed inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl'></div>
                <div className='absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl'></div>
            </div>

            <div className='relative w-full max-w-md'>

                {/* Logo / Brand */}
                <div className='text-center mb-8'>
                    <div className='inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className='text-accent'>
                            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                        </svg>
                    </div>
                    <h1 className='text-2xl font-bold text-text-primary'>Create your account</h1>
                    <p className='text-text-secondary text-sm mt-1'>Get started with InterviewAI for free</p>
                </div>

                {/* Card */}
                <div className='glass-card p-8'>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-5' id="register-form">

                        {error && (
                            <div className='flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm animate-[fadeIn_0.3s_ease-out]'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                                {error}
                            </div>
                        )}

                        <div className='flex flex-col gap-2'>
                            <label htmlFor="register-username" className='text-sm font-medium text-text-secondary'>Username</label>
                            <input
                                onChange={(e) => { setUsername(e.target.value) }}
                                type="text"
                                id="register-username"
                                name='username'
                                placeholder='Enter username'
                                className='w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted text-sm transition-all duration-200 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30'
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="register-email" className='text-sm font-medium text-text-secondary'>Email</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email"
                                id="register-email"
                                name='email'
                                placeholder='Enter email address'
                                className='w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted text-sm transition-all duration-200 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30'
                                required
                            />
                        </div>
                        <div className='flex flex-col gap-2'>
                            <label htmlFor="register-password" className='text-sm font-medium text-text-secondary'>Password</label>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password"
                                id="register-password"
                                name='password'
                                placeholder='Enter password'
                                className='w-full px-4 py-3 bg-bg-input border border-border rounded-lg text-text-primary placeholder-text-muted text-sm transition-all duration-200 outline-none focus:border-accent focus:ring-1 focus:ring-accent/30'
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            id="register-submit-btn"
                            className='w-full py-3 mt-2 bg-accent hover:bg-accent-hover text-white font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] cursor-pointer shadow-[0_0_20px_var(--color-accent-glow)]'
                        >
                            Create Account
                        </button>
                    </form>

                    <p className='text-center text-sm text-text-secondary mt-6'>
                        Already have an account?{' '}
                        <Link to={"/login"} className='text-accent hover:text-accent-hover font-medium transition-colors duration-200'>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    )
}

export default Register