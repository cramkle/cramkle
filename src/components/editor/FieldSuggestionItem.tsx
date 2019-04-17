import { ContentState } from 'draft-js'
import React from 'react'

const FieldSuggestionItem: React.FunctionComponent<{
  contentState: ContentState
  offsetKey: string
}> = ({ children }) => {
  return <span>{children}</span>
}

export default FieldSuggestionItem
