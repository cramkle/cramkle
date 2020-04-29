import { IFieldResolver } from 'graphql-tools'
import { Types } from 'mongoose'

type Version = '01'

const supportedVersions: Version[] = ['01']
const currentVersion: Version = '01'

const isSupportedVersion = (version: string): version is Version => {
  return (supportedVersions as string[]).includes(version)
}

const decoders: {
  [version in Version]: (str: string) => { typeName: string; objectId: string }
} = {
  '01': (modelId: string) => {
    const [objectTypeName, objectId] = modelId.split(':')

    return { typeName: objectTypeName, objectId }
  },
}

export const encodeGlobalId = (name: string, id: Types.ObjectId) => {
  return Buffer.from(`${currentVersion}@${name}:${id}`).toString('base64')
}

export const decodeGlobalId = (id: string) => {
  const [version, modelId] = Buffer.from(id, 'base64').toString().split('@')

  if (!isSupportedVersion(version)) {
    throw new Error(`Unsupported model ID version: "${version}"`)
  }

  return decoders[version](modelId)
}

export const globalIdField = (
  typeName?: string
): IFieldResolver<{ _id: Types.ObjectId }, Context> => {
  return (root, _, __, info) => {
    return encodeGlobalId(typeName ?? info.parentType.name, root._id)
  }
}
