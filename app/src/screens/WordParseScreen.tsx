import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ArrowLongDownIcon, TrashIcon, ArrowLongRightIcon, CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid"
import { nanoid } from "nanoid"

interface CharType {

    char: string,
    color: string,
    originalIndex: number,
    id: string

}

function WordParseScreen() {
    const navigate = useNavigate()
    const charStoreRef = useRef<Record<string, string>>({})
    const sucessTextRef = useRef<HTMLParagraphElement | null>(null);
    const [userInput, setUserInput] = useState("");
    const [resultantString, setResultantString] = useState<string>("");
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    const navigateBack = () => {
        localStorage.removeItem("StringDuplicateUserInput")
        navigate(-1)
    }

    const removeCharacter = (item: CharType) => {
        const newStr = resultantString.split("").filter((char, i) => {
            return item.char.toLowerCase() !== char.toLowerCase() || item.originalIndex === i
        }).join("")

        setResultantString(newStr);
        setShowSuccessOverlay(!getIsDuplicate(newStr))
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

                    if (charStoreRef.current[char.toLowerCase()]) {
                        characters.push(
                            {
                                char,
                                color: charStoreRef.current[char.toLowerCase()],
                                originalIndex: i,
                                id: nanoid()
                            }
                        )
                    } else {
                        const color = generateRandomColor();
                        charStoreRef.current[char.toLowerCase()] = color;
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
                            color: charStoreRef.current[char.toLowerCase()],
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
        <div data-testid="wordParserWrapper" className='relative space-y-10 py-5'>
            <div className='sticky bg-[#121212] p-4 rounded-md top-[75px] py-2 z-[2] flex flex-col items-center space-y-3 md:flex-row md:space-x-4 md:space-y-0'>
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

            <div className='grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))] gap-5 md:grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))]'>
                {
                    userInputCharacters.map((item, i) => (
                        <p
                            data-charid={i}
                            key={item.id}
                            className={`group relative rounded-md w-28 h-28 shadow-black cursor-pointer md:w-52 md:h-52`}
                            style={{ backgroundColor: item.color }}
                            onTouchStart={() => removeCharacter(item)}

                        >
                            <span
                                className='flex justify-center items-center h-full text-white text-[4rem] '>
                                {item.char}
                            </span>
                            <span
                                data-testid={`trashIcon-${i}`}
                                className='absolute top-4 right-4 -translate-y-5 opacity-0 transition-all duration-700 group-hover:translate-y-0 group-hover:opacity-100'
                                onClick={() => removeCharacter(item)}
                            >
                                <TrashIcon className='w-6 h-6 text-gray-200' />
                            </span>

                        </p>
                    ))
                }
            </div>


        </div>
    )
}

export default WordParseScreen