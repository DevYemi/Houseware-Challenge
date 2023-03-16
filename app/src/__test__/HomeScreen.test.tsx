import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomeScreen from "../screens/HomeScreen"

test("render home page correctly", () => {
    render(<MemoryRouter><HomeScreen /></MemoryRouter>)

    expect(true).toBeTruthy()
})