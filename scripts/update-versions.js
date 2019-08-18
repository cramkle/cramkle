#!/usr/bin/env node

const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const workspacePackageJson = require('../package.json')
const version = workspacePackageJson.version

const update = async () => {
  const appPackageJson = JSON.parse(
    (await readFile('./packages/app/package.json')).toString()
  )
  const serverPackageJson = JSON.parse(
    (await readFile('./packages/server/package.json')).toString()
  )

  appPackageJson.version = version
  serverPackageJson.version = version

  if (appPackageJson.dependencies['@cramkle/server']) {
    appPackageJson.dependencies['@cramkle/server'] = `^${version}`
  }

  await writeFile(
    './packages/app/package.json',
    JSON.stringify(appPackageJson, null, 2) + '\n'
  )
  await writeFile(
    './packages/server/package.json',
    JSON.stringify(serverPackageJson, null, 2) + '\n'
  )
}

update()
