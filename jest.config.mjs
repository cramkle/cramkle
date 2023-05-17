// @ts-check

import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  dir: './',
})

/** @type {import('jest').Config} */
const config = {
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],

  testEnvironment: 'jsdom',
}

export default createJestConfig(config)
