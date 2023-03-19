import React, { MouseEvent, TouchEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowLongDownIcon, TrashIcon, ArrowLongRightIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { nanoid } from "nanoid"
import gsap from "gsap"
import { Flip } from "gsap/dist/Flip"

gsap.registerPlugin(Flip);

interface CharType {

    char: string,
    color: string,
    originalIndex: number,
    id: string

}

function WordParseScreen() {
    const navigate = useNavigate()
    const charColorStoreRef = useRef<Record<string, string>>({})
    const sucessTextRef = useRef<HTMLParagraphElement | null>(null);
    const [userInput, setUserInput] = useState("");
    const [resultantString, setResultantString] = useState<string>("");
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    const navigateBack = () => {
        localStorage.removeItem("StringDuplicateUserInput")
        navigate(-1)
    }

    const removeCharacter = (index: number, item: CharType) => {
        const newStr = resultantString.split("").filter((char, i) => {
            return item.char.toLowerCase() !== char.toLowerCase() || item.originalIndex === i
        }).join("")

        const isDuplicate = getIsDuplicate(newStr)

        setShowSuccessOverlay(!isDuplicate)

        if (isDuplicate || newStr !== resultantString) {
            const clickedCard = document.querySelector(`[data-cardindex="${index}"]`)
            const cardsWrapper = document.querySelector("[data-cards-wrapper]") as HTMLDivElement
            const cards = Array.from(cardsWrapper.children) as HTMLDivElement[]

            // enabled card distortion
            cards.forEach((card, i) => {
                const cardValue = card.getAttribute("data-card-charvalue")?.toLowerCase()
                if (item.char.toLowerCase() === cardValue && clickedCard !== card) {
                    card.style.filter = `url(#noise-${i})`
                }
            })

            // Save cards current state
            const state = Flip.getState(cards)


            // change duplicate cards style values
            cards.forEach((card) => {
                const cardValue = card.getAttribute("data-card-charvalue")?.toLowerCase()
                if (item.char.toLowerCase() === cardValue && clickedCard !== card) {
                    card.style.display = "none"
                }
            })


            // Animate duplicate cards from saved state to current cards style value
            Flip.from(state, {
                absolute: true,
                duration: 1,
                ease: "power1.inOut",
                onLeave: (el) => {
                    el.forEach(e => {
                        const feTurbulance = e.querySelector(`feTurbulence`);
                        const tl = gsap.timeline()
                        tl.to(feTurbulance,
                            {
                                yoyo: true,
                                yoyoEase: true,
                                repeat: -1,
                                attr: { baseFrequency: "0.05 0.07" }
                            },
                        ).to(
                            el,
                            {
                                opacity: 0,
                                scale: 0,
                                duration: 2
                            },
                            "<"
                        )
                    })
                },
                onComplete: () => {
                    setResultantString(newStr);
                }
            })
        } else {
            setResultantString(newStr);
        }


    }

    const getIsDuplicate = useCallback((str: string) => {
        if (!str) return false
        const store: string[] = [];
        let value: boolean = false;
        for (let i = 0; i < str.length; i++) {
            const char = str[i];

            if (store.includes(char.toLowerCase())) {
                i = str.length + 1;
                value = true
            } else {
                if (char !== " ") store.push(char.toLowerCase())
            }
        }

        return value;
    }, [])

    const rotateCards = (e: MouseEvent, type: "enter" | "leave") => {
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


    const userInputCharacters = useMemo(() => {
        const characters: CharType[] = [];
        const colors: string[] = [];

        const generateRandomColor = (): string => {
            const x = Math.round(0xffffff * Math.random()).toString(16);
            const y = (6 - x.length);
            const z = "000000";
            const z1 = z.substring(0, y);
            const color = `#${z1}${x}`

            if (colors.includes(color)) {
                return generateRandomColor()
            } else {
                return color;
            }

        }

        if (userInput === resultantString) { // user hasn't removed any duplicate

            for (let i = 0; i < resultantString.length; i++) {
                const char = resultantString[i];

                if (char !== " ") { // don't handle empty spaces

                    if (charColorStoreRef.current[char.toLowerCase()]) { // make sure identical char have the same background color
                        characters.push(
                            {
                                char,
                                color: charColorStoreRef.current[char.toLowerCase()],
                                originalIndex: i,
                                id: nanoid()
                            }
                        )
                    } else {
                        const color = generateRandomColor();
                        charColorStoreRef.current[char.toLowerCase()] = color;
                        characters.push(
                            {
                                char,
                                color: color,
                                originalIndex: i,
                                id: nanoid()
                            }
                        )
                    }

                }



            }
        } else {
            for (let i = 0; i < resultantString.length; i++) {
                const char = resultantString[i];

                if (char !== " ") { // don't handle empty spaces

                    characters.push(
                        {
                            char,
                            color: charColorStoreRef.current[char.toLowerCase()],
                            originalIndex: i,
                            id: nanoid()
                        }
                    )

                }



            }
        }

        return characters

    }, [resultantString, userInput])

    useEffect(() => {
        const string = localStorage.getItem("StringDuplicateUserInput");

        if (string) {
            setUserInput(string);
            setResultantString(string);

            // check if string has duplicate on first render
            const isDuplicate = getIsDuplicate(string)
            if (!isDuplicate) {
                sucessTextRef.current!.innerText = "Ooops the string you provided have no duplicate"
                setShowSuccessOverlay(true);
            } else {
                sucessTextRef.current!.innerText = "You have sucessfully remove all duplicate string"
                setShowSuccessOverlay(false);
            }
        } else {
            navigate("/")
        }

    }, [navigate, getIsDuplicate])



    return (
        <div data-testid="wordParserWrapper" className='relative space-y-10 py-5 '>
            <div className='md:sticky bg-[#121212] p-4 rounded-md top-[75px] py-2 z-[2] flex flex-col items-center space-y-3 md:flex-row md:space-x-4 md:space-y-0'>
                <ArrowLeftIcon onClick={navigateBack} className='block cursor-pointer self-start w-6 h-6 md:self-center text-primary' />
                <fieldset className='border border-gray-300 p-4 py-2 rounded-md md:flex-1'>
                    <legend className='text-gray-300 text-xs px-2 mx-auto'>Original String</legend>
                    <p data-testid="userInput" className='text-center text-gray-400 [word-break:break-word]'>{userInput}</p>
                </fieldset>
                {
                    (resultantString !== userInput && userInput !== "") &&
                    <>
                        <ArrowLongDownIcon className='w-6 h-6 md:hidden text-primary' />
                        <ArrowLongRightIcon className='w-6 h-6 hidden md:block text-primary' />
                        <fieldset className='border border-gray-300 p-4 py-2 rounded-md md:flex-1'>
                            <legend className='text-gray-300 text-xs px-2 mx-auto'>Resultant String</legend>
                            <p className='text-center text-gray-400 [word-break:break-word]'>{resultantString}</p>
                        </fieldset>
                    </>

                }

            </div>
            <div data-testid="successPrompt" className={`sticky top-[160px] w-fit z-[5] bg-transparent mx-auto opacity-0 pointer-events-none transition-all duration-700 ${showSuccessOverlay ? "opacity-100 pointer-events-auto" : ""}`}>
                <div role={"presentation"} className="fixed w-full h-full bg-gray-900 opacity-50 top-0 left-0" />
                <div className='flex relative z-10 bg-white space-x-3 pr-2 items-center'>
                    <span className='bg-green-500 block px-2 py-4'>
                        <CheckCircleIcon className='h-5 w-5 text-white' />
                    </span>
                    <p ref={sucessTextRef} className='text-sm'></p>
                    <span onClick={() => setShowSuccessOverlay(false)} className='cursor-pointer'>
                        <XMarkIcon className='h-5 w-5' />
                    </span>

                </div>

            </div>

            <div data-cards-wrapper className='grid grid-cols-[repeat(auto-fill,_minmax(132px,_1fr))] gap-4  md:gap-8 md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] '>
                {
                    userInputCharacters.map((item, i) => (
                        <div
                            key={item.id}
                            data-card
                            data-cardindex={i}
                            data-card-charvalue={item.char}
                            className='[perspective:300px]'
                        >
                            <p

                                className={`group aspect-square   relative bg-[radial-gradient(farthest-corner_circle_at_0%_0%,_transparent_5%,_transparent_20%),url("/pattern.png"),url("/checkBoard.png")]  [background-blend-mode:soft-light,soft-light,hue] bg-contain rounded-md  shadow-black `}
                                style={{ backgroundColor: item.color }}
                                // onTouchStart={(e: TouchEvent) => removeCharacter(i, item)}
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
                            <svg className='absolute top-0 left-0 pointer-events-none w-full h-full z-[2]'>
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

                    ))
                }
            </div >


        </div >
    )
}

export default WordParseScreen