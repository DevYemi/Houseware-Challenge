import React, { MouseEvent } from 'react'
import { TrashIcon } from "@heroicons/react/24/solid"
import { CharType } from '../screens/WordParseScreen'
import gsap from "gsap"

interface propType {
    item: CharType,
    index: number,
    removeCharacter: (i: number, item: CharType) => void
}


function Card({ item, index: i, removeCharacter }: propType) {

    const rotateCards = (e: MouseEvent, type: "enter" | "leave") => { // 3d rotate card on hover 
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()

        //  get mouse coord (e.g 0-1) relative to card element
        let xCoord = (e.clientX - rect.left) / rect.width;
        let yCoord = ((e.clientY - rect.top) / rect.height);

        // rotate 3d values moving from -10,+10
        let rotateX = (yCoord - 0.5) * 20
        let rotateY = (xCoord - 0.5) * 20


        if (type === "enter") {
            gsap.to(
                el,
                {
                    rotationX: rotateX,
                    rotateZ: rotateY * 0.5,
                    rotateY: rotateY,
                    backgroundImage: `
                    radial-gradient(farthest-corner circle at ${xCoord * 100}% ${yCoord * 100}% , white 20%, transparent 90%),
                    url("/pattern.png"),
                    url("/checkBoard.png")
                    `,
                    backgroundBlendMode: "soft-light,hue,soft-light",
                    duration: 1
                }
            )

        } else {
            gsap.to(
                el,
                {
                    rotationX: 0,
                    rotateZ: 0,
                    rotateY: 0,
                    backgroundImage: `
                    radial-gradient(farthest-corner circle at ${xCoord * 100}% ${yCoord * -100}% , transparent 5%, transparent 20%),
                    url("/pattern.png"),
                    url("/checkBoard.png")
                    `,
                    backgroundBlendMode: "soft-light,soft-light,hue",
                    duration: 2
                }
            )
        }
    }
    return (
        <div
            data-card
            data-cardindex={i}
            data-card-charvalue={item.char}
            className='[perspective:300px]'
        >
            <p

                className={`group aspect-square   relative bg-[radial-gradient(farthest-corner_circle_at_0%_0%,_transparent_5%,_transparent_20%),url("/pattern.png"),url("/checkBoard.png")]  [background-blend-mode:soft-light,soft-light,hue] bg-contain rounded-md  shadow-black `}
                style={{ backgroundColor: item.color }}
                onMouseMove={(e: MouseEvent) => rotateCards(e, "enter")}
                onMouseLeave={(e: MouseEvent) => rotateCards(e, "leave")}

            >
                <span
                    className='flex font-medium justify-center items-center h-full text-white text-[4rem] '>
                    {item.char}
                </span>
                <span
                    data-testid={`trashIcon-${i}`}
                    className='absolute bg-red-200 p-2 rounded-md cursor-pointer top-1 right-1 md:top-4 md:right-4  transition-all duration-700'
                    onClick={(e: MouseEvent) => removeCharacter(i, item)}
                >
                    <TrashIcon className='w-6 h-6 text-red-500' />
                </span>

            </p>
            <svg role={"presentation"} className='absolute top-0 left-0 pointer-events-none w-full h-full z-[2]'>
                <filter id={`noise-${i}`} x='0%' y='0%' width='100%' height='100%' >
                    <feTurbulence
                        baseFrequency='0.02 0.03'
                        result='NOISE'
                        numOctaves={1}
                        id='image-turbulence'
                    />
                    <feDisplacementMap
                        in='SourceGraphic'
                        in2='NOISE'
                        scale={50}
                        id='image-displacement'
                    />
                </filter>
            </svg>
        </div>
    )
}

export default Card