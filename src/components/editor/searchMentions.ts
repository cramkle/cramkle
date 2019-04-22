import { ContentState, SelectionState } from 'draft-js'
import { MentionableEntry } from './MentionsPopup'

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
  const block = contentState.getBlockForKey(anchorKey)
  const text = block.getText()

  const match = MENTION_REGEX.exec(text)

  if (match !== null) {
    const matchStr = match[2]
    const offset = match[1].length

    const mentionableEntries = source.filter(({ name }) =>
      name.includes(matchStr)
    )

    callback(mentionableEntries, offset)
  } else {
    callback(null, 0)
  }
}
