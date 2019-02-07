const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const { promisify } = require('util')
const { pipe, map, filter, prepend, join, append } = require('ramda')
const { createContext, Script } = require('vm')

const readFile = promisify(fs.readFile)

const { serverMainRuntime } = require('../../../config/paths')
const {
  STATIC_RUNTIME_MAIN,
  STATIC_RUNTIME_WEBPACK,
} = require('../../../config/constants')
const { ok, error } = require('../../templates')
const createSandbox = require('./sandbox')

const render = async (req, res) => {
  const clientAssetScripts = map(
    pipe(
      prepend('/'),
      append('.js'),
      join('')
    )
  )([STATIC_RUNTIME_WEBPACK, STATIC_RUNTIME_MAIN])

  const serverAssetScripts = [serverMainRuntime]

  //const styles = Object.values(serverAssetManifest).filter(path =>
  //  path.endsWith('.css')
  //)

  const { sandbox, cleanUp, getLogsAndErrors } = createSandbox(req.url)

  try {
    createContext(sandbox)

    const compiledScripts = await Promise.all(
      pipe(
        filter(Boolean),
        map(filepath =>
          readFile(path.resolve(filepath)).then(
            src => new Script(src.toString())
          )
        )
      )(serverAssetScripts)
    )

    compiledScripts.forEach(script => script.runInContext(sandbox))

    const { markup, head, routerContext, state } = await sandbox.rendered

    const { logs } = getLogsAndErrors()

    if (logs.length && process.env.NODE_ENV !== 'production') {
      logs.forEach(log => {
        console.log(chalk.cyan('client log:'), log)
      })
    }

    if (routerContext.url) {
      res.writeHead(302, {
        Location: routerContext.url,
      })
    } else {
      res.write(
        ok({
          markup,
          head,
          scripts: clientAssetScripts,
          state,
          //styles,
        })
      )
    }
  } catch (err) {
    console.error(
      chalk.red('An error ocurred while trying to server-side render')
    )
    console.error(err)

    const { logs, errors, warnings } = getLogsAndErrors()

    res.write(error({ err, logs, errors, warnings }))
  } finally {
    cleanUp()
    res.end()
  }
}

module.exports = render
