const { map } = require('ramda')

const srcToScriptTag = src => `<script src="${src}" defer></script>`
const srcToLinkTag = src => `<link rel="stylesheet" href="${src}" />`

const getHeadTags = head => {
  if (!head) {
    return ''
  }

  return [
    head.meta && head.meta.toString(),
    head.title && head.title.toString(),
    head.link && head.link.toString(),
    head.base && head.base.toString(),
    head.script && head.script.toString(),
  ]
    .filter(Boolean)
    .join('\n')
}

const getNoScriptTags = head => {
  if (!head || !head.noscript) {
    return ''
  }

  return head.noscript.toString()
}

const ok = ({ markup = '', head, scripts, styles, state }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#2962ff">
  ${getHeadTags(head)}
  ${map(srcToLinkTag, styles).join('\n')}
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  ${map(srcToScriptTag, scripts).join('\n')}
</head>
<body class="mdc-typography">
  ${getNoScriptTags(head)}
  <div id="root">${markup}</div>
  <script>
    __APOLLO_STATE__ = ${JSON.stringify(state || {})}
  </script>
</body>
</html>`

const error = ({
  err,
  logs = [],
  errors = [],
  warnings = [],
}) => `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width" />
  <title>Rendering Error</title>
  <link rel="stylesheet" type="text/css" href="https://unpkg.com/tachyons@4/css/tachyons.min.css" />
  <style>
    .log {
      max-width: 80%;
    }
  </style>
</head>
<body class="flex flex-column items-center helvetica">
  <div class="bg-light-red ph4 white w-100 overflow-x-auto">
    <h1>${err.message}</h1>
    <pre>${err.stack}</pre>
  </div>
  <div class="mt4 pa3 w-100 log">
    Logs:
    <pre>${logs.join('\n')}${!logs.length &&
  'No normal logs were logged.'}</pre>
  </div>
  <div class="bg-light-yellow pa3 w-100 log">
    Warnings:
    <pre>${warnings.join('\n')}${!warnings.length &&
  'No warnings were logged.'}</pre>
  </div>
  <div class="pa3 w-100 log">
    Errors:
    <pre>${errors.join('\n')}${!errors.length && 'No errors were logged.'}</pre>
  </div>
</body>
</html>`

module.exports = {
  ok,
  error,
}
