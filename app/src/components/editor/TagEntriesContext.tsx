import React, { createContext, useContext, useMemo } from 'react'

import { TaggableEntry } from './TaggableEntry'

interface TagEntriesContext {
  tagEntries: TaggableEntry[]
}

const ctx = createContext<undefined | TagEntriesContext>(undefined)

export const useTagEntriesContext = () => useContext(ctx)

export const TagEntriesProvider: React.FC<TagEntriesContext> = ({
  children,
  tagEntries,
}) => {
  const contextValue = useMemo(() => ({ tagEntries }), [tagEntries])

  return <ctx.Provider value={contextValue}>{children}</ctx.Provider>
}
