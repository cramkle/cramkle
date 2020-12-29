import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

import type { RoutesManifest } from 'casterly'
import { danger, markdown, warn } from 'danger'
import filesize from 'filesize'
import { sync as gzipSize } from 'gzip-size'
import unzipper from 'unzipper'

const BUILD_DIR = path.join(__dirname, 'build')
const BASE_BRANCH_BUILD_DIR = path.join(__dirname, 'base-build')

const routesManifest = JSON.parse(
  fs.readFileSync(path.join(BUILD_DIR, 'routes-manifest.json')).toString()
) as RoutesManifest

const downloadBuildArtifacts = async (ref: string) => {
  const {
    data: { workflow_runs: workflowRuns },
  } = await danger.github.api.actions.listWorkflowRunsForRepo({
    owner: 'cramkle',
    repo: 'cramkle',
    branch: ref,
  })

  const [latestWorkflowRun] = workflowRuns

  if (!latestWorkflowRun) {
    return null
  }

  const {
    data: { artifacts },
  } = await danger.github.api.actions.listWorkflowRunArtifacts({
    owner: 'cramkle',
    repo: 'cramkle',
    run_id: latestWorkflowRun.id,
  })

  const buildArtifact = artifacts.find(({ name }) => name === 'build-artifact')

  if (!buildArtifact) {
    return null
  }

  const { data } = await danger.github.api.actions.downloadArtifact({
    repo: 'cramkle',
    owner: 'cramkle',
    artifact_id: buildArtifact.id,
    archive_format: 'zip',
  })

  fs.writeFileSync(
    path.join(__dirname, 'build-artifact.zip'),
    Buffer.from(data as ArrayBuffer)
  )

  await new Promise<void>((resolve) =>
    fs
      .createReadStream(path.join(__dirname, 'build-artifact.zip'))
      .pipe(
        unzipper.Extract({ path: BASE_BRANCH_BUILD_DIR }).on('finish', resolve)
      )
  )

  const mainBranchRoutesManifest = JSON.parse(
    fs
      .readFileSync(path.join(BASE_BRANCH_BUILD_DIR, 'routes-manifest.json'))
      .toString()
  )

  return mainBranchRoutesManifest as RoutesManifest
}

const getSizeForAssets = (base: string, assets: string[]) => {
  return assets.reduce((totalSize, assetName) => {
    const size = gzipSize(fs.readFileSync(path.join(base, assetName)))

    return totalSize + size
  }, 0)
}

function getDifferenceLabel(currentSize: number, previousSize: number) {
  const FIFTY_KILOBYTES = 1024 * 50
  const difference = currentSize - previousSize
  const fileSize = !Number.isNaN(difference) ? filesize(difference) : 0
  if (difference >= FIFTY_KILOBYTES) {
    return '🔺🔺 ' + fileSize
  } else if (difference < FIFTY_KILOBYTES && difference > 0) {
    return '🔺 ' + fileSize
  } else if (difference < 0) {
    return '🔻 ' + fileSize
  }
  return 'No file size difference'
}

const getFileSizeDifferences = (
  baseBranchRoutes: RoutesManifest['routes'],
  currentRoutes: RoutesManifest['routes']
) => {
  const sizeDifferences: Array<{
    path: string
    prevSize: number
    size: number
    sizeDifference: number
  }> = []

  const usedRoutesSet = new Set<
    RoutesManifest['routes'] extends Array<infer T> ? T : never
  >()

  currentRoutes.forEach((route) => {
    const baseRoute = baseBranchRoutes.find(
      (baseBranchRoute) =>
        baseBranchRoute.path === route.path &&
        !usedRoutesSet.has(baseBranchRoute)
    )

    if (baseRoute) {
      usedRoutesSet.add(baseRoute)
    }

    const baseSize = baseRoute
      ? getSizeForAssets(BASE_BRANCH_BUILD_DIR, baseRoute.assets)
      : 0

    const currentSize = getSizeForAssets(BUILD_DIR, route.assets)

    sizeDifferences.push({
      path: route.path,
      prevSize: baseSize,
      size: currentSize,
      sizeDifference: baseSize - currentSize,
    })

    if (route.children) {
      const childrenSizeDifferences = getFileSizeDifferences(
        baseRoute?.children ?? [],
        route.children
      )

      childrenSizeDifferences.forEach((childSizeDiff) => {
        sizeDifferences.push({
          ...childSizeDiff,
          path: route.path + childSizeDiff.path,
        })
      })
    }
  })

  baseBranchRoutes.forEach((baseRoute) => {
    if (usedRoutesSet.has(baseRoute)) {
      return
    }

    const assetSize = getSizeForAssets(BASE_BRANCH_BUILD_DIR, baseRoute.assets)

    sizeDifferences.push({
      path: baseRoute.path,
      size: 0,
      prevSize: assetSize,
      sizeDifference: -assetSize,
    })

    if (baseRoute.children) {
      const childrenSizeDifferences = getFileSizeDifferences(
        baseRoute.children,
        []
      )

      childrenSizeDifferences.forEach((childSizeDiff) => {
        sizeDifferences.push({
          ...childSizeDiff,
          path: baseRoute.path + childSizeDiff.path,
        })
      })
    }
  })

  return sizeDifferences
}

const getPercentageDifference = ({
  size,
  prevSize,
}: {
  size: number
  prevSize: number
}) => {
  if (!prevSize) {
    return '100%'
  }

  const diff = (size * 100) / prevSize - 100

  return diff.toFixed(0) + '%'
}

const git = (args: string) => {
  return new Promise<string>((res) => {
    exec('git ' + args, (err, stdout) => {
      if (err) {
        throw err
      } else {
        res(stdout.trim())
      }
    })
  })
}

const main = async () => {
  const upstreamRef = danger.github.pr.base.ref

  await git(`remote add upstream https://github.com/cramkle/cramkle.git`)
  await git('fetch upstream')
  const baseCommit = await git(`merge-base HEAD upstream/${upstreamRef}`)

  let baseBranchRoutesManifest

  try {
    baseBranchRoutesManifest = await downloadBuildArtifacts(upstreamRef)
  } catch (err) {
    console.error(err)
    warn('Failed to fetch build artifact for base commit')
    return
  }

  if (!baseBranchRoutesManifest) {
    warn('Build artifact does not exist for the base branch of this PR')
  }

  const fileSizeDifferences = getFileSizeDifferences(
    baseBranchRoutesManifest?.routes ?? [],
    routesManifest.routes
  )

  fileSizeDifferences.sort(
    (a, b) => Math.abs(b.sizeDifference) - Math.abs(a.sizeDifference)
  )

  const tableBody = fileSizeDifferences.map((fileSizeDiff) => {
    return `| \`${JSON.stringify(fileSizeDiff.path)}\` | ${getDifferenceLabel(
      fileSizeDiff.size,
      fileSizeDiff.prevSize
    )} | ${getPercentageDifference(fileSizeDiff)} |`
  })

  markdown(`
## Route file size changes

<details>
<summary>Details of assets sizes by route</summary>

<p>Comparing: ${baseCommit}...${danger.github.pr.head.sha}</p>


| Route path | Asset size difference (gzip) | Percentage difference |
| --- | --- | --- |
${tableBody.join('\n')}

</details>
`)
}

main()
