module.exports = {
  presets: [
    [
      'casterly/babel',
      {
        'preset-react': { runtime: 'automatic' },
        'preset-env': { loose: true },
      },
    ],
  ],
  plugins: [
    'babel-plugin-relay',
    'babel-plugin-macros',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
}
