import { ContentState, SelectionState } from 'draft-js'
import { MentionableEntry } from './MentionsPopup'

export default function searchMentions(
  source: MentionableEntry[],
  selection: SelectionState,
  contentState: ContentState,
  callback: (mentionableEntries: MentionableEntry[]) => void
) {}
