import { ContentState, SelectionState } from 'draft-js'

import { TaggableEntry } from './TaggableEntry'

const PUNCTUATION_REGEX =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;'
const AT_SIGN = ['@', '\\uff20'].join('')
const AT_OR_PUNCTUATION = '[^' + AT_SIGN + PUNCTUATION_REGEX + '\\s]'
const END = '(?:\\.[ |$]| |[' + PUNCTUATION_REGEX + ']|)'

const TAG_REGEX = new RegExp(
  '(?:^|\\s|[(\\/])([' +
    AT_SIGN +
    ']((?:' +
    AT_OR_PUNCTUATION +
    END +
    '){0,20}))$'
)

export default function searchTags(
  source: TaggableEntry[],
  selection: SelectionState,
  contentState: ContentState,
  callback: (
    taggableEntries: TaggableEntry[] | null,
    characterOffset: number
  ) => void
) {
  const anchorKey = selection.getAnchorKey()
  const anchorOffset = selection.getAnchorOffset()
  const block = contentState.getBlockForKey(anchorKey)
  const text = block.getText().slice(0, anchorOffset)

  const match = TAG_REGEX.exec(text)

  if (match !== null) {
    const matchStr = match[2].toLowerCase()
    const offset = match[1].length

    const taggableEntries = source.filter(({ name }) =>
      name.toLowerCase().includes(matchStr)
    )

    taggableEntries.sort(
      (a, b) =>
        matchStr.indexOf(b.name.toLowerCase()) -
        matchStr.indexOf(a.name.toLowerCase())
    )

    callback(taggableEntries, offset)
  } else {
    callback(null, 0)
  }
}
