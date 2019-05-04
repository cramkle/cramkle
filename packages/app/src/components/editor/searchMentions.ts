import { ContentState, SelectionState } from 'draft-js'
import { MentionableEntry } from '../../model/MentionableEntry'

const PUNCTUATION_REGEX =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;'
const AT_SIGN = ['@', '\\uff20'].join('')
const AT_OR_PUNCTUATION = '[^' + AT_SIGN + PUNCTUATION_REGEX + '\\s]'
const END = '(?:\\.[ |$]| |[' + PUNCTUATION_REGEX + ']|)'

const MENTION_REGEX = new RegExp(
  '(?:^|\\s|[(\\/])([' +
    AT_SIGN +
    ']((?:' +
    AT_OR_PUNCTUATION +
    END +
    '){0,20}))$'
)

export default function searchMentions(
  source: MentionableEntry[],
  selection: SelectionState,
  contentState: ContentState,
  callback: (
    mentionableEntries: MentionableEntry[],
    characterOffset: number
  ) => void
) {
  const anchorKey = selection.getAnchorKey()
  const anchorOffset = selection.getAnchorOffset()
  const block = contentState.getBlockForKey(anchorKey)
  const text = block.getText().slice(0, anchorOffset)

  const match = MENTION_REGEX.exec(text)

  if (match !== null) {
    const matchStr = match[2].toLowerCase()
    const offset = match[1].length

    const mentionableEntries = source.filter(({ name }) =>
      name.toLowerCase().includes(matchStr)
    )

    mentionableEntries.sort(
      (a, b) =>
        matchStr.indexOf(b.name.toLowerCase()) -
        matchStr.indexOf(a.name.toLowerCase())
    )

    callback(mentionableEntries, offset)
  } else {
    callback(null, 0)
  }
}
