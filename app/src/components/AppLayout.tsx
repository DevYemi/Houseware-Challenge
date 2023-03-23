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
    const nodeRef = useRef<HTMLDivElement | null>(null);
    const experience = useRef<WebglExperience | null>(null);
    const location = useLocation();

    useEffect(() => {
        experience.current = new WebglExperience();

        return () => {
            if (experience.current) {
                experience.current.dispose()
            }
        }
    }, [])



    const onPageEnter = useCallback((element: HTMLElement) => {

        // handle page content transition
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
        //  rotate WebGL background
        if (!location.pathname.includes("word-parser")) {
            gsap.to(
                experience.current!.navigation.view.spherical.smoothed,
                {
                    phi: Math.PI / 20,
                    duration: 1
                }
            )
        } else {
            gsap.to(
                experience.current!.navigation.view.spherical.smoothed,
                {
                    phi: Math.PI / 2.2,
                    duration: 1
                }
            )
        }

        // handle page content transition
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
    }, [location])

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
            <canvas data-webgl_canvas className='fixed z-[-1] top-0 left-0' />


        </div>
    )
}

export default AppLayout