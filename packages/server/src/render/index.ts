import { Request, Response } from 'express'
import * as fs from 'fs'
import chalk from 'chalk'
import * as path from 'path'
import { promisify } from 'util'

import * as Log from '../output/log'
import { ok, error } from '../templates'
import { appDistServer, appDist } from '../../config/paths'
import {
  STATIC_RUNTIME_MAIN,
  STATIC_RUNTIME_WEBPACK,
  STATIC_RUNTIME_HOT,
  ASSET_MANIFEST_FILE,
} from '../../config/constants'

interface RenderOptions {
  requestUrl: string
  requestHost: string
  cookie?: string
  userAgent: string
  requestLanguage: string
}

function interopDefault(mod: any) {
  return mod.default || mod
}

const readFile = promisify(fs.readFile)

const render = async (req: Request, res: Response) => {
  const renderClient =
    req.query.nossr !== undefined && process.env.NODE_ENV !== 'production'

  const assetManifest = await readFile(path.join(appDist, ASSET_MANIFEST_FILE))
    .then(file => file.toString())
    .then(JSON.parse)

  const clientAssetScripts = [
    assetManifest['commons.js'],
    assetManifest[`${STATIC_RUNTIME_WEBPACK}.js`],
    assetManifest[`${STATIC_RUNTIME_MAIN}.js`],
    assetManifest[`${STATIC_RUNTIME_HOT}.js`],
    assetManifest['styles.js'],
  ].filter(Boolean)

  const serverAssetManifest = await readFile(
    path.join(appDistServer, ASSET_MANIFEST_FILE)
  )
    .then(file => file.toString())
    .then(JSON.parse)

  const [serverAssetScript] = [
    serverAssetManifest[`${STATIC_RUNTIME_MAIN}.js`],
  ].map(relativePath => path.join(appDistServer, relativePath))

  const styles = Object.keys(assetManifest)
    .filter(path => path.endsWith('.css'))
    .map(path => assetManifest[path])

  const language = req.language

  res.set('Content-Type', 'text/html')

  try {
    if (renderClient) {
      res.write(
        ok({
          scripts: clientAssetScripts,
          styles,
        })
      )
    } else {
      const appRender = interopDefault(require(serverAssetScript)) as (
        opts: RenderOptions
      ) => Promise<any>

      const { markup, head, routerContext, state } = await appRender({
        requestUrl: req.url,
        requestHost: `${req.protocol}://${req.get('host')}`,
        cookie: req.headers.cookie,
        userAgent: req.headers['user-agent'],
        requestLanguage: language,
      })

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
    }
  } catch (err) {
    Log.error('An error ocurred while trying to server-side render')
    console.error(err)

    res.write(error({ err, logs: [], errors: [], warnings: [] }))
  } finally {
    res.end()
  }
}

export default render
