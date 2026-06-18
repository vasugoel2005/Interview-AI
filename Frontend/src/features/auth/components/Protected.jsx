import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'

const Protected = ({ children }) => {
    const { loading, user } = useAuth()


    if (loading) {
        return (
            <main className='min-h-screen w-full flex flex-col items-center justify-center bg-bg-primary gap-4'>
                <div className='relative'>
                    <div className='w-12 h-12 border-3 border-accent/20 rounded-full'></div>
                    <div className='absolute inset-0 w-12 h-12 border-3 border-accent border-t-transparent rounded-full animate-spin'></div>
                </div>
                <p className='text-text-secondary text-sm'>Loading...</p>
            </main>
        )
    }

    if (!user) {
        return <Navigate to={'/login'} />
    }

    return children
}

export default Protected