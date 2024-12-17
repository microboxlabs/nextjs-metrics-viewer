module.exports = {
  preset: "ts-jest", 
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"], 
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", 
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest", 
  },
  verbose: true, 
  clearMocks: true, 
};
