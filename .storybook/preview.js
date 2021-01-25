import React from 'react'
import 'fontsource-libre-franklin/latin.css'

import '../src/material.global.scss'
import '../src/tailwind.global.scss'
import '../src/app.global.scss'

import { ThemeProvider } from '../src/components/Theme'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

export const decorators = [
  (Story) => (
    <ThemeProvider>
      <div className="__light-mode">
        <Story />
      </div>
    </ThemeProvider>
  ),
]
