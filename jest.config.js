module.exports = {
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  testEnvironment: 'node',
  rootDir: './',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/test/**/?(*.)+(unit|int|e2e|spec|test).(ts|js)'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: './coverage',
  collectCoverage: true,
  moduleNameMapper: {
    '^@application(.*)$': '<rootDir>/src/core/application$1',
    '^@interfaces(.*)$': '<rootDir>/src/interfaces$1',
    '^@infra(.*)$': '<rootDir>/src/core/infra$1',
    '^@domain(.*)$': '<rootDir>/src/core/domain$1',
    '^@config(.*)$': '<rootDir>/src/config$1',
    '^@shared(.*)$': '<rootDir>/src/shared$1',
  },
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.ts', 'jest-extended/all'],
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/', '<rootDir>/dist/'],
}
