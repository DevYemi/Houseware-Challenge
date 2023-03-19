
import { MemoryRouter, Routes } from 'react-router-dom';
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'
import GetRoutes from "../utils/routes";


// handles the manual process of user inputing a string from the home page 
const userInteractionProcess = async (string: string) => {

    const user = userEvent.setup()
    const routes = GetRoutes()

    const { debug } = render(
        <MemoryRouter initialIndex={0} initialEntries={["/", `/word-parser`]}>
            <Routes>
                {routes}
            </Routes>
        </MemoryRouter>
    )

    // user types
    const inputField = screen.getByTestId("inputField") as HTMLInputElement;
    await user.type(inputField, string);

    // user clicks submit button
    const button = screen.getByTestId("submitBtn") as HTMLButtonElement
    await user.click(button)


    return { user, debug }
}



describe("Unit Tests", () => {
    it("should route user back to Home page when user provide no Inputs", () => {
        const routes = GetRoutes()
        render(
            <MemoryRouter initialIndex={1} initialEntries={["/", `/word-parser`]}>
                <Routes>
                    {routes}
                </Routes>
            </MemoryRouter>
        )

        const homeScreenInputField = screen.getByTestId("inputField");

        expect(homeScreenInputField).toBeVisible();
    })
})


describe("Integration Test", () => {
    it("should display user input after routing from home screen", async () => {
        let string = "aabcaccda";
        await userInteractionProcess(string)


        const pElement = await screen.findByText(string) as HTMLParagraphElement

        expect(pElement).toBeInTheDocument()


    })

    it("should remove dupliacte of characters user clicked on", async () => {
        let string = "aabcaccda";
        const { user } = await userInteractionProcess(string)


        const spanElement = await screen.findByTestId("trashIcon-4") as HTMLSpanElement

        await user.click(spanElement)

        const pElement = await screen.findByText("bcaccd") as HTMLParagraphElement

        expect(pElement).toBeInTheDocument()


    })
    it("should display sucess prompt when user remove all duplicates", async () => {
        let string = "aabcada";
        const { user } = await userInteractionProcess(string)


        const spanElement = await screen.findByTestId("trashIcon-4") as HTMLSpanElement

        await user.click(spanElement)

        const divElement = await screen.findByTestId("successPrompt") as HTMLDivElement

        expect(divElement).toBeVisible()


    })
})