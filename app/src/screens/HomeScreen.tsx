import React, { MouseEvent, useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { InformationCircleIcon } from "@heroicons/react/24/solid"

function HomeScreen() {
    const navigate = useNavigate()
    const [userInput, setUserInput] = useState({ value: "", error: false })

    const handleUserSubmit = (e: MouseEvent) => {
        e.preventDefault();

        // check if string is empty or has only space character
        if (userInput.value.trim().length === 0) return setUserInput({ ...userInput, error: true })

        localStorage.setItem("StringDuplicateUserInput", userInput.value.trim())

        navigate(`/word-parser`)

    }

    useEffect(() => {
        localStorage.removeItem("StringDuplicateUserInput")
    }, [])

    return (
        <div className='flex items-center h-full max-w-md mt-40 mx-auto '>
            <form className='space-y-5 flex-1 bg-secondary p-8 rounded-md' action="">
                <div className='flex flex-col space-y-2'>
                    <label className='text-white' htmlFor="word">Enter any text</label>
                    <input
                        data-testid="inputField"
                        id="word"
                        type="text"
                        className={`border-2 bg-secondary text-white border-[#2E2E2E] px-2 py-3 rounded-md focus:border-primary outline-none ${userInput.error ? "shadow shadow-red-600 border-red-600 focus:border-red-800" : ""} `}
                        placeholder='....text'
                        value={userInput.value}
                        onChange={(e) => setUserInput({ value: e.target.value, error: false })}
                    />
                    {
                        userInput.error &&
                        <p data-testid="errorPrompt" className='flex items-center text-red-600 font-semibold'>
                            <InformationCircleIcon className='h-6 w-6' />
                            <small>You need to provide a non-empty value</small>
                        </p>

                    }

                </div>

                <button
                    onClick={handleUserSubmit}
                    data-testid="submitBtn"
                    type='submit'
                    className='bg-primary p-3 w-full rounded-md text-white'>Submit</button>

            </form>
        </div>
    )
}

export default HomeScreen