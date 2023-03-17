import React from 'react'
import Header from './Header'

interface AppLayoutProps {
    children: JSX.Element,
    customWrapperStyles?: string
}

function AppLayout({ children, customWrapperStyles }: AppLayoutProps) {
    return (
        <div className={`flex flex-col h-full bg-black ${customWrapperStyles}`}>
            <Header />
            <div className='flex-1 px-5'>
                {children}
            </div>

        </div>
    )
}

export default AppLayout