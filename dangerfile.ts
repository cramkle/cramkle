import fs from 'fs'
import path from 'path'

import type { RoutesManifest } from '@casterly/cli'
import { danger, markdown, warn } from 'danger'
import filesize from 'filesize'
import { sync as gzipSize } from 'gzip-size'
import unzipper from 'unzipper'

const routesManifest = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, '.dist', 'routes-manifest.json'))
    .toString()
) as RoutesManifest

const downloadBuildArtifacts = async () => {
  const {
    data: { workflow_runs: workflowRuns },
  } = await danger.github.api.actions.listWorkflowRunsForRepo({
    owner: 'cramkle',
    repo: 'cramkle',
    branch: 'main',
  })

  const [latestWorkflowRun] = workflowRuns

  const {
    data: { artifacts },
  } = await danger.github.api.actions.listWorkflowRunArtifacts({
    owner: 'cramkle',
    repo: 'cramkle',
    run_id: latestWorkflowRun.id,
  })

  const buildArtifact = artifacts.find(({ name }) => name === 'build-artifact')

  const { data } = await danger.github.api.actions.downloadArtifact({
    repo: 'cramkle',
    owner: 'cramkle',
    artifact_id: buildArtifact.id,
    archive_format: 'zip',
  })

  fs.writeFileSync(
    path.join(__dirname, 'build-artifact.zip'),
    Buffer.from(data)
  )

  await new Promise<void>((resolve) =>
    fs
      .createReadStream(path.join(__dirname, 'build-artifact.zip'))
      .pipe(
        unzipper
          .Extract({ path: path.join(__dirname, 'build-dist') })
          .on('finish', resolve)
      )
  )

  const mainBranchRoutesManifest = JSON.parse(
    fs
      .readFileSync(path.join(__dirname, 'build-dist', 'routes-manifest.json'))
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
    return '🔺🔺' + fileSize
  } else if (difference < FIFTY_KILOBYTES && difference > 0) {
    return '🔺' + fileSize
  } else if (difference < 0) {
    return '🔻' + fileSize
  }
  return 'No file size difference'
}

const getFileSizeDifferences = (
  mainBranchRoutes: RoutesManifest['routes'],
  currentRoutes: RoutesManifest['routes']
) => {
  const sizeDifferences: Array<{
    path: string
    prevSize: number
    size: number
    sizeDifference: number
  }> = []

  mainBranchRoutes.forEach((route, index) => {
    const mainSize = getSizeForAssets(
      path.join(__dirname, 'build-dist'),
      route.assets
    )
    const currentSize = getSizeForAssets(
      path.join(__dirname, '.dist'),
      currentRoutes[index].assets
    )

    sizeDifferences.push({
      path: route.path,
      prevSize: mainSize,
      size: currentSize,
      sizeDifference: mainSize - currentSize,
    })

    if (route.children) {
      const childrenSizeDifferences = getFileSizeDifferences(
        route.children,
        currentRoutes[index].children
      )

      childrenSizeDifferences.forEach((childSizeDiff) => {
        sizeDifferences.push({
          ...childSizeDiff,
          path: route.path + childSizeDiff.path,
        })
      })
    }
  })

  return sizeDifferences
}

downloadBuildArtifacts()
  .catch((error) => {
    console.error(error)
    warn('Failed to fetch build artifact for main branch')
  })
  .then((mainBranchRoutesManifest) => {
    if (!mainBranchRoutesManifest) {
      return
    }

    const fileSizeDifferences = getFileSizeDifferences(
      mainBranchRoutesManifest.routes,
      routesManifest.routes
    )

    fileSizeDifferences.sort(
      (a, b) => Math.abs(a.sizeDifference) - Math.abs(b.sizeDifference)
    )

    const tableBody = fileSizeDifferences.map((fileSizeDiff) => {
      return `| \`${JSON.stringify(fileSizeDiff.path)}\` | ${getDifferenceLabel(
        fileSizeDiff.size,
        fileSizeDiff.prevSize
      )} |`
    })

    markdown(`
<details>
<summary>Details of assets sizes by route</summary>


| Route path | Asset size difference |
| --- | --- |
${tableBody.join('\n')}

</details>
`)
  })
