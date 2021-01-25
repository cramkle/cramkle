module.exports = () => {
  return {
    postcssPlugin: 'themePrefix',
    Comment(comment) {
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
          selectors: next.selectors.map(
            (selector) => prefixClass + ' ' + selector
          ),
        })
      )
    },
  }
}

module.exports.postcss = true
