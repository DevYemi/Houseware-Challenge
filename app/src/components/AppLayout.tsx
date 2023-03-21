import React, { useCallback, useEffect, useRef } from 'react'
import Header from './Header'
import { useLocation } from 'react-router-dom'
import { SwitchTransition, Transition } from 'react-transition-group'
import gsap from 'gsap'
import WebglExperience from '../webGL'

interface AppLayoutProps {
    children: JSX.Element,
    customWrapperStyles?: string
}

function AppLayout({ children, customWrapperStyles }: AppLayoutProps) {
    const nodeRef = useRef<HTMLDivElement | null>(null)
    const location = useLocation();

    useEffect(() => {
        const experience = new WebglExperience();

        return () => experience.dispose()
    }, [])



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
        <div className={`flex flex-col h-max `}>
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
                    <div ref={nodeRef} className='flex-1 bg-transparent px-5 max-w-[95rem] w-full mx-auto '>
                        {children}
                    </div>
                </Transition>
            </SwitchTransition>
            <canvas data-webgl_canvas className='fixed z-[1] top-0 left-0' />


        </div>
    )
}

export default AppLayout