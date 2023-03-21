const config = {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.(js|jsx)$": "babel-jest",
        "^.+\\.css$": "jest-transform-css"
    },
    moduleNameMapper: {
        "\\.(css|less|scss)$": "identity-obj-proxy",
        "^.+.(vert|frag|glsl)$": "jest-transform-stub"
    },
    moduleDirectories: [
        'node_modules',
    ],
    transformIgnorePatterns: [
        '/node_modules/(?!(three))',
    ],
    setupFilesAfterEnv: [
        "<rootDir>/src/jest.setup.ts"
    ]
}

export default config