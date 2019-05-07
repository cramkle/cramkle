#!/usr/bin/env node

const fs = require('fs')
const { promisify } = require('util')

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const CHANGELOG_FILENAME = 'CHANGELOG.md'
const UNRELEASED_SECTION = '## [Unreleased]'

const getVersion = () => {
  const package = require('../package.json')

  return package.version
}

const update = async () => {
  const changelog = (await readFile(CHANGELOG_FILENAME)).toString()

  const unreleasedSectionIndex = changelog.indexOf(UNRELEASED_SECTION)
  const headerLength = unreleasedSectionIndex + UNRELEASED_SECTION.length + 1

  const header = changelog.slice(0, headerLength)

  const body = changelog.slice(headerLength)
  const now = new Date()

  const year = now.getFullYear()
  const month = (now.getUTCMonth() + 1).toString().pad(2, '0')
  const day = now
    .getUTCDate()
    .toString()
    .pad(2, '0')

  const newChangelog = `
${header}
## [${getVersion()}] - ${year}-${month}-${day}
${body}
  `.trim()

  await writeFile(CHANGELOG_FILENAME, newChangelog + '\n')
}

update()
