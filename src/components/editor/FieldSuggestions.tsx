import { CompositeDecorator } from 'draft-js'
import React from 'react'

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

const FieldSuggestions: React.FunctionComponent = () => {
  return null
}

export default FieldSuggestions
