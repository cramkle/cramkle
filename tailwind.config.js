// @ts-check

const customColors =
  /** @type {Array<string | [string, Record<string,string>]>} */ [
    'always-black',
    'always-white',
    'background',
    'disabled',
    'divider',
    'editor',
    'gray-1',
    'gray-2',
    'gray-3',
    'gray-4',
    'green-1',
    'input',
    'on-primary',
    'on-secondary',
    'on-surface',
    [
      'primary',
      { dark: 'primary-dark', DEFAULT: 'primary', light: 'primary-light' },
    ],
    'primary-disabled',
    'red-1',
    ['secondary', { dark: 'secondary-dark', DEFAULT: 'secondary' }],
    'surface',
    'surface-inverted',
    'txt',
    'txt-secondary',
    'txt-inverted',
    'violet-1',
    'violet-2',
    'yellow-1',
  ].reduce((/** @type {Record<string, any>} */ colorMap, colorOrArray) => {
    /** @type {string} */
    let color
    /** @type {string | Record<string, string>} */
    let value

    if (Array.isArray(colorOrArray)) {
      color = /** @type {string} */ (colorOrArray[0])
      value = colorOrArray[1]
    } else {
      color = colorOrArray
      value = colorOrArray
    }

    const createColorFunction = (/** @type string */ colorName) =>
      function colorFn(
        /** @type {{ opacityVariable?: string; opacityValue?: string }} */ {
          opacityVariable,
          opacityValue,
        }
      ) {
        if (opacityValue !== undefined) {
          return `hsla(var(--${colorName}), ${opacityValue})`
        }
        if (opacityVariable !== undefined) {
          return `hsla(var(--${colorName}), var(${opacityVariable}, 1))`
        }
        return `hsl(var(--${colorName}))`
      }

    colorMap[color] =
      typeof value === 'string'
        ? createColorFunction(value)
        : Object.fromEntries(
            Object.keys(value).map((valueKey) => [
              valueKey,
              createColorFunction(
                /** @type {Record<string, string>} */ (value)[valueKey]
              ),
            ])
          )

    return colorMap
  }, {})

module.exports = {
  mode: 'jit',
  theme: {
    colors: {
      ...customColors,
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      opacity: {
        '08': '.08',
        '12': '.12',
        'background': 'var(--opacity-background)',
        'disabled': 'var(--opacity-disabled)',
        'divider': 'var(--opacity-divider)',
        'secondary': 'var(--opacity-secondary)',
        'text-primary': 'var(--opacity-text-primary)',
        'text-secondary': 'var(--opacity-text-secondary)',
        'text-icon': 'var(--opacity-text-icon)',
        'text-hint': 'var(--opacity-text-hint)',
        'text-disabled': 'var(--opacity-text-disabled)',
      },
      zIndex: {
        '-10': '-10',
        '-1': '-1',
        '1': '1',
      },
      maxWidth: {
        xxs: '12rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 3px 5px rgba(0, 0, 0, .15)',
        'md': '0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 3px 5px 0 rgba(0, 0, 0, 0.15)',
        'lg': '0 12px 28px 0 rgba(0, 0, 0, 0.1), 0 4px 8px 0 rgba(0, 0, 0, 0.15)',
        'xl': '0 32px 48px 0 rgba(0, 0, 0, 0.1), 0 12px 28px 0 rgba(0, 0, 0, 0.15)',
        '2xl':
          '0 25px 50px 0 rgba(0, 0, 0, 0.25), 0 32px 48px 0 rgba(0, 0, 0, .15)',
      },
    },
  },
  content: ['./src/**/*.tsx'],
  plugins: [
    // @ts-ignore
    require('@tailwindcss/forms'),
  ],
}
