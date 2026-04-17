const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  collectCoverage: true,
  coverageReporters: ['lcov', 'text-summary'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'models',
    'mocks',
    '.spec.ts',
    '.module.ts',
    'mock.ts',
    'test-setup.ts',
    'index.ts',
    '<rootDir>/src/main.ts',
  ],
  moduleNameMapper: {
    '^flat': '<rootDir>/node_modules/flat/index.js',
  },
};
