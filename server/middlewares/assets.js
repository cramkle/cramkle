const path = require('path')
const { values } = require('ramda')

const ASSET_MANIFEST_FILENAME = 'asset-manifest.json'

const assetMiddleware = (name, basePath, serve = true) => async (req, res, next) => {
  const { fs } = req
  const assetManifestPath = path.resolve(path.join(basePath, ASSET_MANIFEST_FILENAME))

  let assetManifest = {}

  try {
    assetManifest = JSON.parse(await fs.readFile(assetManifestPath))
  } catch (e) {
    throw new Error(`The asset manifest file for "${name}" was not found.`)
  }

  const assetList = values(assetManifest)

  req.assets = req.assets || {}

  req.assets[name] = {
    assetManifest,
    assetBasePath: basePath,
  }

  if (req.method !== 'GET' || !serve) {
    return next()
  }

  if (assetList.indexOf(req.url) !== -1) {
    fs.createReadStream(
      path.resolve(path.join(basePath, req.url))
    ).pipe(res)
    return
  }

  return next()
}

module.exports = assetMiddleware
