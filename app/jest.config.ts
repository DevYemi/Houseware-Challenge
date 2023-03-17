const config = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
        "^.+\\.css$": "jest-transform-css"
    },
    moduleNameMapper: {
        "\\.(css|less|scss)$": "identity-obj-proxy"
    },
    moduleDirectories: [
        'node_modules',
    ],
    setupFilesAfterEnv: [
        "<rootDir>/src/jest.setup.ts"
    ]
}

export default config