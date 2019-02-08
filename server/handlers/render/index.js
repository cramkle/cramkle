const fs = require('fs')
const chalk = require('chalk')
const path = require('path')
const { promisify } = require('util')
const { pipe, map, filter } = require('ramda')
const { createContext, Script } = require('vm')

const readFile = promisify(fs.readFile)

const { serverMainRuntime, appDist } = require('../../../config/paths')
const {
  STATIC_RUNTIME_MAIN,
  STATIC_RUNTIME_WEBPACK,
  ASSET_MANIFEST_FILE,
} = require('../../../config/constants')
const { ok, error } = require('../../templates')
const createSandbox = require('./sandbox')

const render = async (req, res) => {
  // TODO: read the file for every request?
  const assetManifest = await readFile(path.join(appDist, ASSET_MANIFEST_FILE))
    .then(file => file.toString())
    .then(JSON.parse)

  const clientAssetScripts = [
    assetManifest[`${STATIC_RUNTIME_WEBPACK}.js`],
    assetManifest[`${STATIC_RUNTIME_MAIN}.js`],
    // TODO: shouldn't we find a better way to inject the styles?
    assetManifest['styles.js'],
  ]

  const serverAssetScripts = [serverMainRuntime]

  // TODO: should it be injecting *all* css in every page?
  const styles = Object.keys(assetManifest)
    .filter(path => path.endsWith('.css'))
    .map(path => assetManifest[path])

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
          styles,
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
