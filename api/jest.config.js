const { resolve } = require('path');

module.exports = {
  displayName: 'unit-tests',
  rootDir: resolve(__dirname),
  testMatch: ['<rootDir>/src/**/*.spec.js'],
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  transform: {
    '^.+\\.(j)s?$': '@swc/jest',
  },
  bail: true,
  clearMocks: true,
};
