import { CompositeDecorator } from 'draft-js'
import React, { useState, useEffect } from 'react'

import Field from './Field'
import FieldSuggestionItem from './FieldSuggestionItem'
import { findFieldEntities, findFieldSuggestions } from './strategies'

export const decorators = new CompositeDecorator([
  {
    strategy: findFieldEntities,
    component: Field,
  },
  {
    strategy: findFieldSuggestions,
    component: FieldSuggestionItem,
  },
])

interface Props {
  suggestions: { name: string }[]
  onAddField: (field: Props['suggestions'][0]) => void
  onSearchChange: (s: string) => void
}

const FieldSuggestionsPopup: React.FunctionComponent<Props> = () => {
  const [active, setActive] = useState(false)

  if (!active) {
    return null
  }

  return null
}

export default FieldSuggestionsPopup
