import {
  CompositeDecorator,
  ContentState,
  RawDraftContentState,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import React, { useCallback } from 'react'

import { useHints } from './HintsContext'
import BaseEditorControls from './editor/BaseEditorControls'
import TagEditor from './editor/TagEditor'
import { decorators as tagsDecorators } from './editor/TagsPopup'
import { ModelQuery_model_templates_frontSide as TemplateContent } from './pages/__generated__/ModelQuery'

const decorators = new CompositeDecorator(tagsDecorators)

interface Props {
  id: string
  initialContentState: TemplateContent
  fields: { id: string; name: string }[]
  onChange?: (content: ContentState, templateId: string) => void
}

const TemplateEditor: React.FunctionComponent<Props> = ({
  id,
  initialContentState,
  fields,
  onChange,
}) => {
  const { isMobile } = useHints()

  const handleChange = useCallback(
    (contentState: ContentState) => {
      onChange?.(contentState, id)
    },
    [onChange, id]
  )

  return (
    <BaseEditorControls
      className="mt-2"
      onChange={handleChange}
      initialContentState={initialContentState as RawDraftContentState}
      decorators={decorators}
    >
      <TagEditor tagSource={fields} readOnly={isMobile} />
    </BaseEditorControls>
  )
}

export default TemplateEditor
