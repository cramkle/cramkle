const { map } = require('ramda')

const srcToScriptTag = srcUrl => `<script src="${srcUrl}" async defer></script>`

const ok = ({ markup, head = {}, assetScripts = [], state }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#2962ff">
  ${head.meta.toString()}
  ${head.title.toString()}
  ${head.link.toString()}
  ${head.base.toString()}
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Raleway:300,400,500,600">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body class="mdc-typography">
  <noscript>
    You need to enable JavaScript to run this app.
  </noscript>
  ${head.noscript.toString()}
  <div id="root">${markup}</div>
  ${map(srcToScriptTag, assetScripts).join('\n')}
  ${head.script.toString()}
  <script>
    __APOLLO_STATE__ = ${JSON.stringify(state || {})}
  </script>
</body>
</html>`

const error = ({ err, logs = [], errors = [], warnings = [] }) => `<!DOCTYPE html>
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
  <div class="bg-light-red ph4 white w-100 overflow-x-scroll">
    <h1>${err.message}</h1>
    <pre>${err.stack}</pre>
  </div>
  <div class="mt4 pa3 w-100 log">
    Logs:
    <pre>${logs.join('\n')}${!logs.length && 'No normal logs were logged.'}</pre>
  </div>
  <div class="bg-light-yellow pa3 w-100 log">
    Warnings:
    <pre>${warnings.join('\n')}${!warnings.length && 'No warnings were logged.'}</pre>
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
