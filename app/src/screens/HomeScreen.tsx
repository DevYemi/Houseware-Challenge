import React, { MouseEvent, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { InformationCircleIcon } from "@heroicons/react/24/solid"

function HomeScreen() {
    const navigate = useNavigate()
    const [userInput, setUserInput] = useState({ value: "", error: false })

    const handleUserSubmit = (e: MouseEvent) => {
        e.preventDefault();

        // check if string is empty or has only space character
        if (userInput.value.trim().length === 0) return setUserInput({ ...userInput, error: true })

        navigate(`/${userInput.value.trim()}`)

    }

    return (
        <div className='flex items-center h-full max-w-md mx-auto'>
            <form className='space-y-5 flex-1' action="">
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="word">Enter any text</label>
                    <input
                        id="word"
                        type="text"
                        className={`border border-gray-200 px-2 py-3 rounded-md focus:border-primary outline-none ${userInput.error ? "shadow shadow-red-600 border-red-600 focus:border-red-800" : ""} `}
                        placeholder='....text'
                        value={userInput.value}
                        onChange={(e) => setUserInput({ value: e.target.value, error: false })}
                    />
                    {
                        userInput.error &&
                        <p className='flex items-center text-red-600 font-semibold'>
                            <InformationCircleIcon className='h-6 w-6' />
                            <small>You need to provide a non-empty value</small>
                        </p>

                    }

                </div>

                <button onClick={handleUserSubmit} type='submit' className='bg-primary p-3 w-full rounded-md text-white'>Submit</button>

            </form>
        </div>
    )
}

export default HomeScreen