import { ContentState } from 'draft-js'
import React from 'react'

import { useTagEntriesContext } from './TagEntriesContext'

interface TagSpanProps {
  contentState: ContentState
  entityKey: string
}

const TagSpan: React.FunctionComponent<TagSpanProps> = ({
  contentState,
  entityKey,
}) => {
  const data = contentState.getEntity(entityKey).getData()

  const { tagEntries } = useTagEntriesContext()

  const tag = tagEntries.find((tag) => tag.id === data.id)

  return (
    <span className="relative">
      {tag.name}
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-yellow-1 opacity-25" />
    </span>
  )
}

export default TagSpan
