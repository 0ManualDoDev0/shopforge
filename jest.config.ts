import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@emails/(.*)$": "<rootDir>/emails/$1",
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}",
    "<rootDir>/src/__tests__/**/*.test.{ts,tsx}",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/__tests__/**",
  ],
};

export default createJestConfig(config);
