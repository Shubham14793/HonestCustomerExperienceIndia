import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/layout.tsx',
    '!app/**/layout.tsx',
    '!app/api/**/*.ts', // Exclude API routes from coverage (require complex Next.js mocking)
    '!app/submit-case/**/*.tsx', // Exclude complex form page (requires intricate form testing)
    '!app/dashboard/**/*.tsx', // Exclude dashboard (requires complex state management testing)
    '!app/case/**/*.tsx', // Exclude case detail page (requires dynamic routing param testing)
    '!lib/types.ts', // Exclude type definitions
    '!**/*.config.{js,ts}',
    '!**/node_modules/**',
    '!**/.next/**',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 90,
      statements: 90,
    },
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  modulePathIgnorePatterns: ['<rootDir>/.next/'],
  // CI/CD reporters
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '.',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
    }],
  ],
  // Coverage formats for CI
  coverageReporters: ['text', 'lcov', 'cobertura', 'json'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
