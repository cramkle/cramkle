const path = require('path')

const cssRegex = /\.global\.css$/
const cssModulesRegex = /\.css$/

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    {
      name: '@storybook/preset-scss',
      options: {
        sassLoaderOptions: {
          implementation: require('sass'),
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

    const scssRules = config.module.rules.filter((rule) =>
      rule.test.test('file.scss')
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

    const scssRulesWithPostcss = scssRules.map((scssRule) => {
      const sassLoaderIndex = scssRule.use.findIndex((loader) =>
        /\Wsass-loader\W/.test(loader.loader)
      )

      const uses = scssRule.use
        .slice(0, sassLoaderIndex)
        .concat([
          {
            loader: 'postcss-loader',
            options: { config: { path: path.resolve(__dirname, '..') } },
          },
        ])
        .concat(scssRule.use.slice(sassLoaderIndex))

      return {
        ...scssRule,
        use: uses,
      }
    })

    const nonCssRules = config.module.rules.filter(
      (rule) => !rule.test.test('file.css') && !rule.test.test('file.scss')
    )

    config.module.rules = nonCssRules.concat([
      ...newCssRules,
      ...cssModulesRules,
      ...scssRulesWithPostcss,
    ])

    return config
  },
}
