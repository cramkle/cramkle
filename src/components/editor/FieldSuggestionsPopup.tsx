import React from 'react'

import FieldSpan from './FieldSpan'
import FieldSuggestionItem from './FieldSuggestionItem'
import { findFieldEntities, findFieldSuggestions } from './strategies'
import getSelectionRect from './getSelectionRect'

export const decorators = [
  {
    strategy: findFieldEntities,
    component: FieldSpan,
  },
  {
    strategy: findFieldSuggestions,
    component: FieldSuggestionItem,
  },
]

interface Props {
  suggestions: { name: string }[]
  onFieldSelect: (field: Props['suggestions'][0]) => void
  onSearchChange: (s: string) => void
  offset?: number
  characterOffset: number
}

const FieldSuggestionsPopup: React.FunctionComponent<Props> = ({
  onFieldSelect,
  suggestions,
  offset = 5,
  characterOffset,
}) => {
  const selectionRect = getSelectionRect(characterOffset)

  return null
}

export default FieldSuggestionsPopup
