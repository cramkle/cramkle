const postcss = require('postcss')

const plugin = (comment) => {
  if (!comment.text.startsWith('prefix: ')) {
    return
  }

  const next = comment.next()

  const prefixClass = comment.text.split('prefix: ')[1]

  comment.remove()

  if (!next || next.type !== 'rule') {
    return
  }

  next.replaceWith(
    next.clone({
      selectors: next.selectors.map((selector) => prefixClass + ' ' + selector),
    })
  )
}

module.exports = postcss.plugin('theme-prefix', () => {
  return (api) => {
    api.walkComments(plugin)
  }
})

/*
// PostCSS 8

module.exports = () => {
  return {
    postcssPlugin: 'themePrefix',
    Comment: plugin,
  }
}

module.exports.postcss = true
*/
