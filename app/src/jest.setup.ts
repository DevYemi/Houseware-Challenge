// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { config } from 'react-transition-group'
import { enableFetchMocks } from 'jest-fetch-mock'
enableFetchMocks()

// disable page transition when testing component to prevent abitrary waits
config.disabled = true


// Mock nanoid in every test setup
jest.mock("nanoid", () => {
    return { nanoid: () => Math.random() * 73647346374 };
});