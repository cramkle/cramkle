import { Request, Response } from 'express'
import * as fs from 'fs'
import chalk from 'chalk'
import * as path from 'path'
import { promisify } from 'util'
import { createContext, Script } from 'vm'

import { serverMainRuntime, appDist } from '../../../config/paths'
import {
  STATIC_RUNTIME_MAIN,
  STATIC_RUNTIME_WEBPACK,
  ASSET_MANIFEST_FILE,
} from '../../../config/constants'
import { ok, error } from '../../templates'
import createSandbox from './sandbox'

const readFile = promisify(fs.readFile)

const render = async (req: Request, res: Response) => {
  // TODO: read the file for every request?
  const assetManifest = await readFile(path.join(appDist, ASSET_MANIFEST_FILE))
    .then(file => file.toString())
    .then(JSON.parse)

  const clientAssetScripts = [
    assetManifest[`${STATIC_RUNTIME_WEBPACK}.js`],
    assetManifest[`${STATIC_RUNTIME_MAIN}.js`],
    assetManifest['static/hot-runtime.js'],
    // TODO: shouldn't we find a better way to inject the styles?
    assetManifest['styles.js'],
  ].filter(Boolean)

  const serverAssetScripts = [serverMainRuntime]

  // TODO: should it be injecting *all* css in every page?
  const styles = Object.keys(assetManifest)
    .filter(path => path.endsWith('.css'))
    .map(path => assetManifest[path])

  const sandboxContext = {
    requestUrl: req.url,
    forwardCookie: req.headers.cookie,
  }

  const { sandbox, cleanUp, getLogsAndErrors } = createSandbox(sandboxContext)

  try {
    createContext(sandbox)

    const compiledScripts = await Promise.all(
      serverAssetScripts
        .filter(Boolean)
        .map(filepath =>
          readFile(path.resolve(filepath)).then(
            src => new Script(src.toString())
          )
        )
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

export default render
