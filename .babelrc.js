module.exports = {
  presets: [['casterly/babel', { 'preset-react': { runtime: 'automatic' } }]],
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
  ],
}
