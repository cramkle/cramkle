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

const cssRegex = /\.global\.css$/
const cssModulesRegex = /\.css$/

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
  webpackFinal: async (config) => {
    const cssRules = config.module.rules.filter((rule) =>
      rule.test.test('file.css')
    )

    const newCssRules = cssRules
      .map((cssRule) => {
        return {
          ...cssRule,
          test: cssRegex,
        }
      })
      .concat(
        cssRules.map((cssRule) => {
          return {
            ...cssRule,
            include: [/node_modules/],
          }
        })
      )

    const cssModulesRules = cssRules.map((cssRule) => {
      const uses = cssRule.use.map((cssRuleModule) => {
        let moduleName
        let moduleOptions

        if (typeof cssRuleModule === 'string') {
          moduleName = cssRuleModule
          moduleOptions = {}
        } else {
          moduleName = cssRuleModule.loader
          moduleOptions = cssRuleModule.options
        }

        if (/\Wcss-loader\W/.test(moduleName)) {
          return {
            loader: moduleName,
            options: {
              ...moduleOptions,
              modules: true,
            },
          }
        }

        return { loader: moduleName, options: moduleOptions }
      })

      return {
        ...cssRule,
        use: uses,
        test: cssModulesRegex,
        exclude: [cssRegex, /node_modules/],
      }
    })

    const nonCssRules = config.module.rules.filter(
      (rule) => !rule.test.test('file.css')
    )

    config.module.rules = nonCssRules.concat([
      ...newCssRules,
      ...cssModulesRules,
    ])

    return config
  },
}
