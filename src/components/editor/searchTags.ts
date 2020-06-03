import { ContentState, SelectionState } from 'draft-js'

import { TaggableEntry } from './TaggableEntry'

const SYMBOL_REGEX =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;'
const AT_SIGN = ['@', '\\uff20'].join('')
const NOT_AT_OR_SYMBOL = '[^' + AT_SIGN + SYMBOL_REGEX + '\\s]'
const END = '(?:\\.[ |$]| |[' + SYMBOL_REGEX + ']|)'

const TAG_REGEX = new RegExp(
  '(?:^|\\s|[(\\/])([' +
    AT_SIGN +
    ']((?:' +
    NOT_AT_OR_SYMBOL +
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
