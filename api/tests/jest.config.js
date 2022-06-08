const unitConfig = require('../jest.config');

const { resolve } = require('path');

module.exports = {
  ...unitConfig,
  ...{
    rootDir: resolve(__dirname),
    displayName: 'integration-tests',
    setupFilesAfterEnv: ['<rootDir>/jestSetup.js'],
    collectCoverage: false,
    testMatch: ['<rootDir>/**/*.spec.js'],
  },
};
