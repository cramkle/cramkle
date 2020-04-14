import { Trans } from '@lingui/macro'
import React, { useContext, useMemo } from 'react'
import {
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
} from 'draft-js'

import * as t from './views/Typography'
import Divider from './views/Divider'
import { findTagEntities } from './editor/strategies'

interface NoteValue {
  data: RawDraftContentState
  field: { id: string }
  id: string
}

interface Template {
  frontSide: RawDraftContentState
  backSide: RawDraftContentState
}

const noop = () => {}

const ValuesContext = React.createContext<NoteValue[] | undefined>(undefined)

interface FlashCardValueProps {
  contentState: ContentState
  entityKey: string
}

const FlashCardValue: React.FC<FlashCardValueProps> = ({
  entityKey,
  contentState,
  children,
}) => {
  const data = contentState.getEntity(entityKey).getData()

  const values = useContext(ValuesContext)

  const value = useMemo(
    () => values.find(({ field }) => field.id === data.id),
    [values, data.id]
  )

  const editorState = useMemo(() => {
    if (!value) {
      return null
    }

    const contentState = convertFromRaw(value.data)

    return EditorState.createWithContent(contentState)
  }, [value])

  if (!editorState) {
    return <>{children}</>
  }

  return <Editor editorState={editorState} onChange={noop} readOnly />
}

const decorators = new CompositeDecorator([
  {
    strategy: findTagEntities,
    component: FlashCardValue,
  },
])

interface Props {
  template: Template
  values: NoteValue[]
  hideLabels?: boolean
}

const FlashCardRenderer: React.FC<Props> = ({
  template,
  values,
  hideLabels = false,
}) => {
  const frontSideState = useMemo(() => {
    const contentState = convertFromRaw(template.frontSide)

    return EditorState.createWithContent(contentState, decorators)
  }, [template])

  const backSideState = useMemo(() => {
    const contentState = convertFromRaw(template.backSide)

    return EditorState.createWithContent(contentState, decorators)
  }, [template])

  return (
    <div className="c-on-surface">
      {!hideLabels && (
        <t.Caption className="mb2">
          <Trans>Front Side</Trans>
        </t.Caption>
      )}
      <ValuesContext.Provider value={values}>
        <Editor editorState={frontSideState} onChange={noop} readOnly />
      </ValuesContext.Provider>
      <Divider className="mv3" />
      {!hideLabels && (
        <t.Caption className="mb2">
          <Trans>Back Side</Trans>
        </t.Caption>
      )}
      <ValuesContext.Provider value={values}>
        <Editor editorState={backSideState} onChange={noop} readOnly />
      </ValuesContext.Provider>
    </div>
  )
}

export default FlashCardRenderer
