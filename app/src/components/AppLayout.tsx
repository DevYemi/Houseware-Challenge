import React from 'react'
import Header from './Header'

function AppLayout({ children }: { children: JSX.Element }) {
    return (
        <div className='flex flex-col h-full'>
            <Header />
            <div className='flex-1 px-5'>
                {children}
            </div>

        </div>
    )
}

export default AppLayout