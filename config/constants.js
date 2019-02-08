const path = require('path')

const STATIC_FOLDER = 'static'
const STATIC_RUNTIME_PATH = path.join(STATIC_FOLDER, 'runtime')
const STATIC_CHUNKS_PATH = path.join(STATIC_FOLDER, 'chunks')
const STATIC_MEDIA_PATH = path.join(STATIC_FOLDER, 'media')

const STATIC_RUNTIME_MAIN = path.join(STATIC_RUNTIME_PATH, 'main')
const STATIC_RUNTIME_WEBPACK = path.join(STATIC_RUNTIME_PATH, 'webpack')

const ASSET_MANIFEST_FILE = 'asset-manifest.json'

module.exports = {
  STATIC_FOLDER,
  STATIC_CHUNKS_PATH,
  STATIC_MEDIA_PATH,
  STATIC_RUNTIME_PATH,
  STATIC_RUNTIME_MAIN,
  STATIC_RUNTIME_WEBPACK,
  ASSET_MANIFEST_FILE,
}
