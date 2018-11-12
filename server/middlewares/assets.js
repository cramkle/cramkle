const path = require('path')
const fs = require('fs')
const { values } = require('ramda')

const ASSET_MANIFEST_FILENAME = 'asset-manifest.json'

const assetMiddleware = (name, basePath, serve = true) => {
  const assetManifestPath = path.resolve(path.join(basePath, ASSET_MANIFEST_FILENAME))

  try {
    // There isn't much of a problem to use acessSync here
    // because this function is only invoked once, when the
    // middleware is used.
    fs.accessSync(assetManifestPath, fs.constants.F_OK | fs.constants.R_OK)
  } catch (e) {
    throw new Error(`The asset manifest file for "${name}" was not found.`)
  }

  const assetManifest = JSON.parse(fs.readFileSync(assetManifestPath))
  const assetList = values(assetManifest)

  return (req, res, next) => {
    req.assets = req.assets || {}

    req.assets[name] = {
      assetManifest,
      assetBasePath: basePath,
    }

    if (req.method !== 'GET' || !serve) {
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

module.exports = assetMiddleware
