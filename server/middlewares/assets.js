import path from 'path'
import fs from 'fs'
import { values } from 'ramda'

const ASSET_MANIFEST_FILENAME = 'asset-manifest.json'

const assetMiddleware = basePath => {
  const assetManifestPath = path.resolve(path.join(basePath, ASSET_MANIFEST_FILENAME))

  try {
    // There isn't much of a problem to use acessSync here
    // because this function is only invoked once, when the
    // middleware is used.
    fs.accessSync(assetManifestPath, fs.constants.F_OK | fs.constants.R_OK)
  } catch (e) {
    throw new Error('The asset manifest file was not found.')
  }

  const assetManifest = JSON.parse(fs.readFileSync(assetManifestPath))
  const assetList = values(assetManifest)

  return (req, res, next) => {
    req.assets = assetManifest

    if (req.method !== 'GET') {
      return next()
    }

    if (assetList.indexOf(req.url) !== -1) {
      res.sendFile(
        path.resolve(path.join(basePath, req.url))
      )
      return
    }

    return next()
  }
}

export default  assetMiddleware
