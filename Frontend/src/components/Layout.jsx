import React from 'react'
import { Outlet } from 'react-router'
import Footer from './Footer'

const Layout = () => {
    return (
        <div className='site-layout'>
            <div className='site-layout__content'>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Layout
