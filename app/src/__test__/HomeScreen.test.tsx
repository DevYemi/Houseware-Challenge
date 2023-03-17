import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes } from 'react-router-dom';
import HomeScreen from "../screens/HomeScreen"
import GetRoutes from '../utils/routes';


jest.mock("nanoid", () => {
    return { nanoid: () => Math.random() * 73647346374 };
});




describe("Unit Tests", () => {

    it("input field should update as a user types", async () => {
        const user = userEvent.setup()
        render(<MemoryRouter><HomeScreen /></MemoryRouter>)

        const string = "aabcaccda"

        const inputField = screen.getByTestId("inputField") as HTMLInputElement;
        await user.type(inputField, string);

        expect(inputField.value).toBe(string)
    })

    it("should show error prompt when a user click button without inputing a string", async () => {
        const user = userEvent.setup()
        render(<MemoryRouter><HomeScreen /></MemoryRouter>)

        const button = screen.getByTestId("submitBtn") as HTMLButtonElement

        await user.click(button)

        const errorPrompt = screen.getByTestId("errorPrompt")

        expect(errorPrompt).toBeInTheDocument()
    })
})

describe("Integration Test", () => {
    it("should route user to wordParseScreen after a user typed a string and click the submit button", async () => {
        let string = "aabcaccda";
        const user = userEvent.setup()
        const routes = GetRoutes()

        render(
            <MemoryRouter initialIndex={0} initialEntries={["/", `/${string}`]}>
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


        const wordParserWrapper = await screen.findByTestId("wordParserWrapper")

        expect(wordParserWrapper).toBeInTheDocument()

    })
})
