import React, { MouseEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowLongDownIcon, ArrowLongRightIcon, CheckCircleIcon } from "@heroicons/react/24/solid"
import { nanoid } from "nanoid"
import gsap from "gsap"
import { Flip } from "gsap/dist/Flip"
import { generateRandomColor, getIsDuplicate } from '../utils/chunks';
import Card from '../components/Card';

gsap.registerPlugin(Flip);

export interface CharType {

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
    const [showSuccessHeader, setShowSuccessHeader] = useState(false);

    const navigateBack = () => {
        localStorage.removeItem("StringDuplicateUserInput")
        navigate(-1)
    }

    const removeCharacter = useCallback((index: number, item: CharType) => {
        const newStr = resultantString.split("").filter((char, i) => {
            return item.char.toLowerCase() !== char.toLowerCase() || item.originalIndex === i
        }).join("")

        const isDuplicate = getIsDuplicate(newStr)

        setShowSuccessHeader(!isDuplicate)

        if (isDuplicate || newStr !== resultantString) { //create a nice smooth animation when duplicate is being removed
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


    }, [resultantString])



    const userInputCharacters = useMemo(() => {
        const characters: CharType[] = [];
        const colors: string[] = [];



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
                        const color = generateRandomColor(colors);
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
                setShowSuccessHeader(true);
            } else {
                sucessTextRef.current!.innerText = "You have sucessfully remove all duplicate string"
                setShowSuccessHeader(false);
            }
        } else {
            navigate("/")
        }

    }, [navigate])



    return (
        <div data-testid="wordParserWrapper" className='relative space-y-10 py-5 '>
            <div className={` bg-secondary p-4 rounded-md py-2 z-[2] flex flex-col items-center space-y-3 md:flex-row md:space-x-4 md:space-y-0 ${showSuccessHeader ? "w-full" : "w-fit"}`}>
                <ArrowLeftIcon onClick={navigateBack} className='block cursor-pointer self-start w-6 h-6 md:self-center text-primary' />
                {
                    showSuccessHeader &&
                    <>
                        <fieldset className='border border-gray-300 p-4 py-2 rounded-md md:flex-1'>
                            <legend className='text-gray-300 text-xs px-2 mx-auto'>Original String</legend>
                            <p data-testid="userInput" className='text-center text-gray-400 [word-break:break-word]'>{userInput}</p>
                        </fieldset>

                        <ArrowLongDownIcon className='w-6 h-6 md:hidden text-primary' />
                        <ArrowLongRightIcon className='w-6 h-6 hidden md:block text-primary' />
                        <fieldset className='border border-gray-300 p-4 py-2 rounded-md md:flex-1'>
                            <legend className='text-gray-300 text-xs px-2 mx-auto'>Resultant String</legend>
                            <p className='text-center text-gray-400 [word-break:break-word]'>{resultantString}</p>
                        </fieldset>
                    </>
                }



            </div>
            <div data-testid="successPrompt" className={` w-fit z-[5] bg-transparent mx-auto opacity-0 pointer-events-none transition-all duration-700 ${showSuccessHeader ? "opacity-100 pointer-events-auto" : ""}`}>
                <div className='flex relative z-10 bg-white space-x-3 pr-2 items-center'>
                    <span className='bg-green-500 block px-2 py-4'>
                        <CheckCircleIcon className='h-5 w-5 text-white' />
                    </span>
                    <p ref={sucessTextRef} className='text-sm'></p>

                </div>

            </div>

            <div data-cards-wrapper className='grid grid-cols-[repeat(auto-fill,_minmax(132px,_1fr))] gap-4  md:gap-8 md:grid-cols-[repeat(auto-fill,_minmax(200px,_1fr))] '>
                {
                    userInputCharacters.map((item, i) => (
                        <Card
                            key={item.id}
                            item={item}
                            index={i}
                            removeCharacter={removeCharacter}
                        />

                    ))
                }
            </div >


        </div >
    )
}

export default WordParseScreen