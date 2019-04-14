import { Schema, model, Document } from 'mongoose'

export interface CharacterBlock {
  style: string[]
  entity: string
}

export interface ContentState {
  blocks: {
    key: string
    type: string
    text: string
    depth: number
    inlineStyleRanges: {
      style: string
      offset: number
      length: number
    }[]
    entityRanges: {
      key: number
      length: number
      offset: number
    }[]
    data: object
  }[]
  entityMap: {
    [key: string]: {
      type: string
      mutability: string
      data: object
    }
  }
}

interface ContentStateDocument extends ContentState, Document {}

const ContentStateSchema = new Schema<ContentStateDocument>({
  blocks: [
    {
      key: String,
      type: String,
      text: String,
      inlineStyleRanges: [
        {
          style: String,
          offset: Number,
          length: Number,
        },
      ],
      entityRanges: [
        {
          key: Number,
          length: Number,
          offset: Number,
        },
      ],
      depth: Number,
      data: Object,
    },
  ],
  entityMap: Object,
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
})

export default model<ContentStateDocument>('ContentState', ContentStateSchema)
