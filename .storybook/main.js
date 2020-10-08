const path = require('path')

const appPath = path.resolve(__dirname, '..')

const buildNodePath = (basePath) => {
  const nodePath = []
  const splitted = [''].concat(basePath.split(path.sep))

  for (let i = splitted.length - 1; i > 0; i--) {
    nodePath.push(path.join(splitted.join(path.sep), 'node_modules'))
    splitted.pop()
  }

  return nodePath
}

const nodePaths = buildNodePath(appPath)

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {
      name: '@storybook/preset-scss',
      options: {
        sassLoaderOptions: {
          includePaths: nodePaths,
        },
      },
    },
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
}
