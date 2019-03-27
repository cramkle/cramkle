import { Schema, model, Document } from 'mongoose'

export interface CharacterBlock {
  style: string[]
  entity: string
}

export interface Block {
  key: string
  type: string
  text: string
  characterList: CharacterBlock[]
  depth: number
  dataJSON: string
}

interface BlockDocument extends Block, Document {}

const BlockSchema = new Schema<BlockDocument>({
  key: String,
  type: String,
  text: String,
  characterList: {
    style: [String],
    entity: String,
  },
  depth: Number,
  dataJSON: String,
})

export default model<BlockDocument>('Block', BlockSchema)
