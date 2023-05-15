module.exports = {
  extends: ['@lucasecdb', 'next/core-web-vitals'],
  env: {
    es6: true,
    node: true,
    browser: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'no-underscore-dangle': [
      1,
      {
        allow: [
          '_id',
          '__NAME__',
          '__WB_MANIFEST',
          '__APOLLO_STATE__',
          '__theme',
          '__onThemeChange',
          '__setPreferredTheme',
        ],
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-namespace': 'off',
    'react/no-unescaped-entities': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: '16.8',
    },
  },
}
