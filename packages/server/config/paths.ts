import * as path from 'path'
import * as fs from 'fs'

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

const dotenv = resolveApp('.env')
const appPath = resolveApp('.')
const appDist = distFolder
const appDistServer = serverDistFolder
const appDistPublic = path.join(distFolder, 'public')
const appPublic = resolveApp('public')
const appIndexJs = resolveModule(resolveApp, 'src/index')
const appStartJs = resolveModule(resolveApp, 'src/start')
const appServiceWorker = resolveModule(resolveApp, 'src/serviceWorker')
const appPackageJson = resolveApp('package.json')
const appSrc = resolveApp('src')
const yarnLockFile = resolveApp('yarn.lock')
const appNodeModules = resolveApp('node_modules')

export {
  dotenv,
  appPath,
  appDist,
  appDistServer,
  appDistPublic,
  appPublic,
  appIndexJs,
  appStartJs,
  appServiceWorker,
  appPackageJson,
  appSrc,
  yarnLockFile,
  appNodeModules,
  moduleFileExtensions,
}
