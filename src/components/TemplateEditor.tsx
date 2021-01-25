import {
  CompositeDecorator,
  ContentState,
  RawDraftContentState,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import { useCallback, useEffect, useRef } from 'react'
import * as React from 'react'

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
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const handleChange = useCallback(
    (contentState: ContentState) => {
      onChangeRef.current?.(contentState, id)
    },
    [id]
  )

  return (
    <BaseEditorControls
      className="mt-2 border border-divider border-opacity-divider"
      onChange={handleChange}
      initialContentState={initialContentState as RawDraftContentState}
      decorators={decorators}
    >
      <TagEditor tagSource={fields} />
    </BaseEditorControls>
  )
}

export default TemplateEditor
