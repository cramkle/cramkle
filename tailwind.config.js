const commonColors = {
  'green-1': 'var(--green-1)',
  'red-1': 'var(--red-1)',
  'violet-1': 'var(--violet-1)',
  'violet-2': 'var(--violet-2)',
  'yellow-1': 'var(--yellow-1)',
  'gray-1': 'var(--gray-1)',
  'gray-2': 'var(--gray-2)',
  'gray-3': 'var(--gray-3)',
  'gray-4': 'var(--gray-4)',
  transparent: 'transparent',
}

module.exports = {
  theme: {
    colors: {
      primary: 'var(--primary)',
      'background-primary': 'var(--primary-background)',
      'primary-disabled': 'var(--primary-disabled)',
      secondary: 'var(--secondary)',
      surface: 'var(--surface)',
      disabled: 'var(--disabled)',
      background: 'var(--background)',
      'hover-overlay': 'var(--hover-overlay)',
      divider: 'var(--divider)',
      input: 'var(--input-background)',
      editor: 'var(--editor-background)',
      ...commonColors,
    },
    textColor: {
      'on-primary': 'var(--on-primary)',
      'on-surface': 'var(--on-surface)',
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      disabled: 'var(--text-disabled)',
      hint: 'var(--text-hint)',
      icon: 'var(--text-icon)',
      'action-primary': 'var(--primary)',
      'action-primary-disabled': 'var(--primary-disabled)',
      ...commonColors,
    },
    extend: {
      opacity: {
        '08': '.08',
        12: '.12',
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
  plugins: [],
  corePlugins: { float: false },
  purge: {
    content: ['./src/**/*.tsx'],
  },
}
