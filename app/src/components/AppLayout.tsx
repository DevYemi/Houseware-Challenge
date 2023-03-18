import React, { useCallback, useRef } from 'react'
import Header from './Header'
import { useLocation } from 'react-router-dom'
import { SwitchTransition, Transition } from 'react-transition-group'
import gsap from 'gsap'

interface AppLayoutProps {
    children: JSX.Element,
    customWrapperStyles?: string
}

function AppLayout({ children, customWrapperStyles }: AppLayoutProps) {
    const nodeRef = useRef<HTMLDivElement | null>(null)
    const location = useLocation();



    const onPageEnter = useCallback((element: HTMLElement) => {
        gsap.fromTo(
            nodeRef.current,
            {
                translateY: 80,
                autoAlpha: 0,
                ease: 'power3.out',
            },
            {
                translateY: 0,
                autoAlpha: 1,
                position: "static",
                duration: 1,
                ease: 'power3.out',
            }
        )
    }, [])


    const onPageExit = useCallback((element: HTMLElement) => {
        console.log()
        gsap.fromTo(
            nodeRef.current,
            {
                translateY: 0,
                autoAlpha: 1,
                ease: 'power3.out',
            },
            {
                translateY: -80,
                autoAlpha: 0,
                duration: 1,
                ease: 'power3.inOut',
            }
        )
    }, [])

    return (
        <div className={`flex flex-col h-max bg-black `}>
            <Header />
            <SwitchTransition>
                <Transition
                    key={location.pathname}
                    timeout={500}
                    in={true}
                    nodeRef={nodeRef as any}
                    onEnter={onPageEnter}
                    onExit={onPageExit}
                    mountOnEnter={true}
                    unmountOnExit={true}>
                    <div ref={nodeRef} className='flex-1 px-5'>
                        {children}
                    </div>
                </Transition>
            </SwitchTransition>


        </div>
    )
}

export default AppLayout