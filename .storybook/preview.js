import React from 'react'
import 'fontsource-libre-franklin/latin.css'

import '../src/material.global.scss'
import '../src/_tailwind.global.css'
import '../src/app.global.scss'

import { ThemeProvider } from '../src/components/Theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <Story />
    </ThemeProvider>
  ),
]
