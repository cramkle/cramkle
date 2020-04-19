import { Trans } from '@lingui/macro'
import {
  CompositeDecorator,
  ContentState,
  Editor,
  EditorState,
  RawDraftContentState,
  convertFromRaw,
} from 'draft-js'
import React, { useContext, useMemo } from 'react'

import { findTagEntities } from './editor/strategies'
import Divider from './views/Divider'
import * as t from './views/Typography'

interface NoteValue {
  data: RawDraftContentState
  field: { id: string }
  id: string
}

interface Template {
  frontSide: RawDraftContentState | null
  backSide: RawDraftContentState | null
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

interface PanelProps {
  hideLabel: boolean
  label: React.ReactNode
  templateContent: RawDraftContentState | null
  values: NoteValue[]
  emptyMessage: React.ReactNode
}

const FlashCardPanel: React.FC<PanelProps> = ({
  hideLabel,
  label,
  templateContent,
  values,
  emptyMessage,
}) => {
  const editorState = useMemo(() => {
    if (!templateContent) {
      return EditorState.createEmpty()
    }

    const contentState = convertFromRaw(templateContent)

    return EditorState.createWithContent(contentState, decorators)
  }, [templateContent])

  return (
    <>
      {!hideLabel && (
        <t.Caption className="mb2 c-text-secondary">{label}</t.Caption>
      )}
      {templateContent == null ? (
        <t.Body2 className="db mv2">{emptyMessage}</t.Body2>
      ) : (
        <ValuesContext.Provider value={values}>
          <Editor editorState={editorState} onChange={noop} readOnly />
        </ValuesContext.Provider>
      )}
    </>
  )
}

interface Props {
  template: Template
  values: NoteValue[]
  hideLabels?: boolean
  hideBackSide?: boolean
}

const FlashCardRenderer: React.FC<Props> = ({
  template,
  values,
  hideLabels = false,
  hideBackSide = true,
}) => {
  return (
    <div className="c-on-surface">
      <FlashCardPanel
        label={<Trans>Front side</Trans>}
        hideLabel={hideLabels}
        emptyMessage={<Trans>Front side template is empty</Trans>}
        values={values}
        templateContent={template.frontSide}
      />
      {!hideBackSide && (
        <>
          <Divider className="mv3" />
          <FlashCardPanel
            label={<Trans>Back side</Trans>}
            hideLabel={hideLabels}
            emptyMessage={<Trans>Back side template is empty</Trans>}
            values={values}
            templateContent={template.backSide}
          />
        </>
      )}
    </div>
  )
}

export default FlashCardRenderer
