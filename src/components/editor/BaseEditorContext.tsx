import { EditorProps } from 'draft-js'
import React, { createContext, useContext } from 'react'

type BaseEditorContext = Pick<
  EditorProps,
  'onChange' | 'editorState' | 'handleKeyCommand'
>

const ctx = createContext<undefined | BaseEditorContext>(undefined)

export const BaseEditorContextProvider: React.FC<{
  value: BaseEditorContext
}> = ({ value, children }) => {
  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export const useBaseEditorControls = () => {
  const contextValue = useContext(ctx)

  if (!contextValue) {
    throw new Error(
      'useBaseEditorControls must be used inside <BaseEditorControls />'
    )
  }

  return contextValue
}
