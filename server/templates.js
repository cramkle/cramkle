import { map } from 'ramda'

const srcToScriptTag = srcUrl => `<script src="${srcUrl}"></script>`

export const ok = ({ markup, head, assetScripts }) => `
<!DOCTYPE html>
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
</body>
</html>`

