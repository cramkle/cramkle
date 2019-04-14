import { RawDraftContentState } from 'draft-js'

export interface APIContentState extends RawDraftContentState {
  id: string
}
