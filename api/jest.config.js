module.exports = {
  preset: '@shelf/jest-mongodb',
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  testPathIgnorePatterns: ['/dist/', '/node_modules/'],
  testRegex: '(.test)\\.(js|ts)$',
  transform: {
    '^.+\\.(js|ts)$': 'babel-jest',
  },
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  moduleFileExtensions: ['js', 'ts'],
}
