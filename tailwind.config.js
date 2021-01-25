const customColors = [
  'always-black',
  'always-white',
  'background',
  'background-primary',
  'disabled',
  'divider',
  'editor',
  'gray-1',
  'gray-2',
  'gray-3',
  'gray-4',
  'green-1',
  'hover-overlay',
  'input',
  'on-primary',
  'on-secondary',
  'on-surface',
  'primary',
  'primary-disabled',
  'red-1',
  'secondary',
  'surface',
  'surface-inverted',
  'txt',
  'txt-inverted',
  'violet-1',
  'violet-2',
  'yellow-1',
]

const customBorderColors = customColors.reduce(
  (colors, colorName) => ({
    ...colors,
    [colorName]: `var(--border-${colorName}); --tw-border-opacity: 1`,
  }),
  []
)

const customBgColors = customColors.reduce(
  (colors, colorName) => ({
    ...colors,
    [colorName]: `var(--bg-${colorName}); --tw-bg-opacity: 1`,
  }),
  []
)

const customTextColors = customColors.reduce(
  (colors, colorName) => ({
    ...colors,
    [colorName]: `var(--text-${colorName}); --tw-text-opacity: 1`,
  }),
  []
)

const customRingColors = customColors.reduce(
  (colors, colorName) => ({
    ...colors,
    [colorName]: `var(--ring-${colorName}); --tw-ring-opacity: 1`,
  }),
  []
)

module.exports = {
  theme: {
    extend: {
      textColor: customTextColors,
      backgroundColor: customBgColors,
      borderColor: customBorderColors,
      ringColor: customRingColors,
      opacity: {
        '08': '.08',
        12: '.12',
        background: 'var(--opacity-background)',
        disabled: 'var(--opacity-disabled)',
        divider: 'var(--opacity-divider)',
        secondary: 'var(--opacity-secondary)',
        'text-primary': 'var(--opacity-text-primary)',
        'text-secondary': 'var(--opacity-text-secondary)',
        'text-icon': 'var(--opacity-text-icon)',
        'text-hint': 'var(--opacity-text-hint)',
        'text-disabled': 'var(--opacity-text-disabled)',
      },
      zIndex: {
        '-10': '-10',
        '-1': '-1',
        1: '1',
      },
      maxWidth: {
        xxs: '12rem',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 3px 5px rgba(0, 0, 0, .15)',
        md: '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 3px 5px 0 rgba(0, 0, 0, 0.15)',
        lg: '0 12px 28px 0 rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(0, 0, 0, 0.15)',
        xl:
          '0 32px 48px 0 rgba(0, 0, 0, 0.1), 0 12px 28px 0 rgba(0, 0, 0, 0.15)',
        '2xl':
          '0 25px 50px 0 rgba(0, 0, 0, 0.25), 0 32px 48px 0 rgba(0, 0, 0, .15)',
      },
    },
  },
  variants: {
    display: ['responsive', 'group-hover', 'group-focus'],
    opacity: [
      'responsive',
      'hover',
      'focus',
      'active',
      'group-hover',
      'group-focus',
    ],
  },
  purge: {
    content: ['./src/**/*.tsx'],
    options: {
      safelist: ['__light-mode', '__dark-mode', 'h-full'],
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
