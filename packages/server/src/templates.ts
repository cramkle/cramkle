import { HelmetData } from 'react-helmet'
import { map } from 'ramda'
import serialize from 'serialize-javascript'

const srcToScriptTag = (src: string) => `<script src="${src}" defer></script>`
const srcToLinkTag = (src: string) => `<link rel="stylesheet" href="${src}" />`

const getHeadTags = (head: HelmetData) => {
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

const getNoScriptTags = (head: HelmetData) => {
  if (!head || !head.noscript) {
    return ''
  }

  return head.noscript.toString()
}

interface TemplateInput {
  markup?: string
  head?: HelmetData
  scripts?: string[]
  styles?: string[]
  state?: object
}

export const ok = (args?: TemplateInput) => {
  const { markup = '', head, scripts = [], styles = [], state } = args
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="theme-color" content="#2962ff">
  ${getHeadTags(head)}
  ${map(srcToLinkTag, styles).join('\n')}
  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Libre+Franklin:300,400,500,600|Material+Icons">
  ${map(srcToScriptTag, scripts).join('\n')}
</head>
<body class="mdc-typography">
  ${getNoScriptTags(head)}
  <div id="root">${markup}</div>
  <script>
    __APOLLO_STATE__ = ${serialize(state || {}, { isJSON: true })}
  </script>
</body>
</html>`
}

interface ErrorInput {
  err: Error
  logs: string[]
  errors: string[]
  warnings: string[]
}

const logsOrMessage = (logs: string[], defaultMessage: string = '') => {
  if (logs.length) {
    return logs.join('\n')
  }

  return defaultMessage
}

export const error = ({
  err,
  logs = [],
  errors = [],
  warnings = [],
}: ErrorInput) => `<!DOCTYPE html>
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
    <pre>${logsOrMessage(logs, 'No normal logs were logged.')}</pre>
  </div>
  <div class="bg-light-yellow pa3 w-100 log">
    Warnings:
    <pre>${logsOrMessage(warnings, 'No warnings were logged.')}</pre>
  </div>
  <div class="pa3 w-100 log">
    Errors:
    <pre>${logsOrMessage(errors, 'No errors were logged.')}</pre>
  </div>
</body>
</html>`
