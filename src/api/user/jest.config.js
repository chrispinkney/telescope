const path = require('path');
const baseConfig = require('../../../jest.config.base');
require('dotenv').config({
  path: path.join(__dirname, '../env.development'),
});

// FIRESTORE_EMULATOR_HOST requires an address to be set in an env file
// in order for firestore to be ran locally
process.env = { ...process.env, FIRESTORE_EMULATOR_HOST: 'localhost:8088' };

module.exports = {
  ...baseConfig,
  rootDir: '../../..',
  testMatch: ['<rootDir>/src/api/user/test/*.test.js'],
  collectCoverageFrom: ['<rootDir>/src/api/user/src/**/*.js'],
};
