import { create } from '@storybook/theming/create'

import logo from '../src/assets/logo-full.svg'

const cssVar = (property, defaultValue) =>
  getComputedStyle(document.documentElement).getPropertyValue(property) ||
  defaultValue

export default create({
  base: 'light',

  colorPrimary: cssVar('--primary', 'hsl(224, 100%, 58%)'),

  // UI
  // appBg: cssVar('--background'),
  // appContentBg: cssVar('--surface'),
  // appBorderColor: cssVar('--divider'),
  appBorderRadius: '1rem',

  // Typography
  fontBase:
    '"Libre Franklin", -apple-system, system-ui, BlinkMacSystemFont, sans-serif',
  fontCode:
    '"Dank Mono", "Operator Mono", "Fira Code Retina", "Fira Code", "FiraCode-Retina", "Consolas", "Monaco", monospace',

  // Text colors
  // textColor: cssVar('--text-primary'),

  // Toolbar default and active colors
  // barTextColor: cssVar('--background'),
  // barSelectedColor: cssVar('--background'),
  // barBg: cssVar('--text-primary'),

  // Form colors
  // inputBg: cssVar('--input-background'),
  // inputBorder: cssVar('--divider'),
  // inputTextColor: cssVar('--text-primary'),
  // inputBorderRadius: '1rem',

  brandTitle: 'Cramkle',
  brandUrl: 'https://cramkle.com',
  brandImage: logo,
})
