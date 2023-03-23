import { Link, useRouteError } from "react-router-dom";
import react from 'react'

export default function ErrorPage() {
    const error = useRouteError();

    return (
        <div id="error-page" className="text-white space-y-4 flex-col flex justify-center items-center h-full">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p className="flex flex-col justify-center items-center">
                <span>{(error as any)?.status}</span>
                <span className="text-xl">{(error as any)?.statusText}</span>
            </p>
            <Link className="text-primary underline" to={"/"}>Go Home
            </Link>
        </div>
    );
}