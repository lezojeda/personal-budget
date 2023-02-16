/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: __dirname,
  globalSetup: './__tests__/setup.ts',
  testMatch:  ['<rootDir>/__tests__/**/*.test.ts'],
};