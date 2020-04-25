import { Types } from 'mongoose'

type Version = '01'

const supportedVersions: Version[] = ['01']
const currentVersion: Version = '01'

const isSupportedVersion = (version: string): version is Version => {
  return (supportedVersions as string[]).includes(version)
}

const decoders: {
  [version in Version]: (str: string) => [string, string]
} = {
  '01': (modelId: string) => {
    const [objectTypeName, objectId] = modelId.split(':')

    return [objectTypeName, objectId]
  },
}

export const encodeModelID = (name: string, id: Types.ObjectId) => {
  return Buffer.from(`${currentVersion}@${name}:${id}`).toString('base64')
}

export const decodeModelId = (id: string) => {
  const [version, modelId] = Buffer.from(id, 'base64').toString().split('@')

  if (!isSupportedVersion(version)) {
    throw new Error(`Unsupported model ID version: "${version}"`)
  }

  return decoders[version](modelId)
}
