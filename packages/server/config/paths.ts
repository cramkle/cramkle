import * as path from 'path'
import * as fs from 'fs'
import {
  STATIC_FOLDER,
  STATIC_RUNTIME_MAIN,
  STATIC_RUNTIME_WEBPACK,
} from './constants'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relativePath: string) =>
  path.resolve(appDirectory, relativePath)

const moduleFileExtensions = ['mjs', 'js', 'json', 'jsx', 'ts', 'tsx']

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn = resolveApp, filePath: string) => {
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

const dotenv = resolveApp('.env')
const appPath = resolveApp('.')
const appDist = distFolder
const appDistPublic = path.join(distFolder, 'public')
const appPublic = resolveApp('public')
const appIndexJs = resolveModule(resolveApp, 'src/index')
const appPackageJson = resolveApp('package.json')
const appSrc = resolveApp('src')
const yarnLockFile = resolveApp('yarn.lock')
const appNodeModules = resolveApp('node_modules')

export {
  dotenv,
  appPath,
  appDist,
  appDistPublic,
  clientStaticFolder as clientStatic,
  clientMainRuntime,
  clientWebpack,
  serverMainRuntime,
  appPublic,
  appIndexJs,
  appPackageJson,
  appSrc,
  yarnLockFile,
  appNodeModules,
  moduleFileExtensions,
}
