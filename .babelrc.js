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
    [
      'babel-plugin-named-asset-import',
      {
        loaderMap: {
          svg: {
            ReactComponent: '@svgr/webpack?-prettier,-svgo![path]',
          },
        },
      },
    ],
    'babel-plugin-macros',
    'babel-plugin-graphql-tag',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
  ],
}
