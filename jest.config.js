module.exports = {
  // Preset Expo : transformation TypeScript via Babel
  preset: 'jest-expo',
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.ts'],
  // Fonctions pures uniquement
  collectCoverageFrom: [
    'src/services/loanRules.ts',
    'src/services/validation.ts',
    'src/services/loanWrites.ts',
    'src/services/loanHistory.ts',
    'src/services/equipmentWrites.ts',
    'src/services/equipmentForm.ts',
    'src/services/loanForm.ts',
    'src/utils/date.ts',
    'src/utils/dateInput.ts',
    'src/utils/search.ts',
  ],
  coverageDirectory: 'coverage',
  // Seuil global minimal de 80 %
  coverageThreshold: {
    global: { statements: 80, branches: 80, functions: 80, lines: 80 },
  },
};
