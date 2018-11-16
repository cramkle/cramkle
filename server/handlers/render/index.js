const chalk = require('chalk')
const path = require('path')
const { pipe, map, filter } = require('ramda')
const { createContext, Script } = require('vm')

const { ok, error } = require('../../templates')
const createSandbox = require('./sandbox')

const render = async (req, res) => {
  const {
    assets: {
      client: { assetManifest: clientAssetManifest },
      server: { assetManifest: serverAssetManifest, assetBasePath: serverAssetBasePath },
    },
    fs,
  } = req

  const clientAssetScripts = filter(Boolean, [
    clientAssetManifest['main.js'],
    clientAssetManifest['runtime.js'],
  ])

  const serverAssetScripts = [
    serverAssetManifest['main.js'],
    serverAssetManifest['runtime.js'],
  ]

  const styles = [
    serverAssetManifest['main.css'],
  ].filter(Boolean)

  const { sandbox, cleanUp, getLogsAndErrors } = createSandbox(serverAssetBasePath, req.url)

  try {
    createContext(sandbox)

    const compiledScripts = await Promise.all(
      pipe(
        filter(Boolean),
        map(filename => path.join(serverAssetBasePath, filename)),
        map(filepath =>
          fs.readFile(path.resolve(filepath)).then(src => new Script(src.toString()))
        )
      )(serverAssetScripts)
    )

    compiledScripts.forEach(script => script.runInContext(sandbox))

    const { markup, head, routerContext, state } = await sandbox.rendered

    const { logs } = getLogsAndErrors()

    if (logs.length) {
      logs.forEach(log => {
        console.log(chalk.green('client log:'), log)
      })
    }

    if (routerContext.url) {
      res.writeHead(302, {
        Location: routerContext.url,
      })
    } else {
      res.write(ok({
        markup,
        head,
        scripts: clientAssetScripts,
        state,
        styles,
      }))
    }
  } catch (err) {
    console.error(chalk.red('An error ocurred while trying to server-side render:'), err)

    const { logs, errors, warnings } = getLogsAndErrors()

    res.write(error({ err, logs, errors, warnings }))
  } finally {
    cleanUp()
    res.end()
  }
}

module.exports = render
