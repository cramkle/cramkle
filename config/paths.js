const path = require('path')
const fs = require('fs')
const {
  STATIC_FOLDER,
  STATIC_RUNTIME_MAIN,
  STATIC_RUNTIME_WEBPACK,
} = require('./constants')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const moduleFileExtensions = ['mjs', 'js', 'json', 'jsx', 'ts', 'tsx']

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`))
  )

  if (extension) {
    return resolveFn(`${filePath}.${extension}`)
  }

  return resolveFn(`${filePath}.js`)
}

const distFolder = resolveApp('.dist')
const serverDistFolder = path.join(distFolder, 'server')

const clientStaticFolder = path.join(distFolder, STATIC_FOLDER)

const clientMainRuntime = path.join(distFolder, `${STATIC_RUNTIME_MAIN}.js`)
const clientWebpack = path.join(distFolder, `${STATIC_RUNTIME_WEBPACK}.js`)
const serverMainRuntime = path.join(
  serverDistFolder,
  `${STATIC_RUNTIME_MAIN}.js`
)

module.exports = {
  dotenv: resolveApp('.env'),
  appPath: resolveApp('.'),
  appDist: distFolder,
  appDistPublic: path.join(distFolder, 'public'),
  clientStatic: clientStaticFolder,
  clientMainRuntime,
  clientWebpack,
  serverMainRuntime,
  appPublic: resolveApp('public'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  appNodeModules: resolveApp('node_modules'),
  moduleFileExtensions,
}
