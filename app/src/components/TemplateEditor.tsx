import {
  CompositeDecorator,
  ContentState,
  EditorState,
  RawDraftContentState,
  RichUtils,
  convertFromRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TabController } from 'react-tab-controller'
import Card, { CardActionButtons, CardActions } from 'views/Card'

import { useHints } from './HintsContext'
import BlockStyleControls from './editor/BlockStyleControls'
import InlineStyleControls from './editor/InlineStyleControls'
import TagEditor from './editor/TagEditor'
import { decorators as tagsDecorators } from './editor/TagsPopup'
import { ModelQuery_cardModel_templates_frontSide as TemplateContent } from './pages/__generated__/ModelQuery'

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

  const [editor, setEditor] = useState(() => {
    if (!initialContentState || initialContentState.blocks.length === 0) {
      return EditorState.createEmpty(decorators)
    }

    const contentState = convertFromRaw(
      initialContentState as RawDraftContentState
    )

    return EditorState.createWithContent(contentState, decorators)
  })

  const contentState = editor.getCurrentContent()
  const prevContentState = useRef(contentState)

  useEffect(() => {
    if (contentState === prevContentState.current) {
      return
    }

    prevContentState.current = contentState
    onChange?.(contentState, id)
  }, [contentState, onChange, id])

  const handleStyleToggle = useCallback(
    (style: string) => {
      setEditor(RichUtils.toggleInlineStyle(editor, style))
    },
    [editor]
  )

  const handleBlockStyleToggle = useCallback(
    (style: string) => {
      setEditor(RichUtils.toggleBlockType(editor, style))
    },
    [editor]
  )

  return (
    <Card outlined className="mt2">
      {!isMobile && (
        <CardActions className="bb b--inherit">
          <CardActionButtons className="flex-column items-start">
            <TabController>
              <BlockStyleControls
                editor={editor}
                onToggle={handleBlockStyleToggle}
              />
            </TabController>
            <TabController>
              <InlineStyleControls
                editor={editor}
                onToggle={handleStyleToggle}
              />
            </TabController>
          </CardActionButtons>
        </CardActions>
      )}
      <div className="pa3">
        <TagEditor
          tagSource={fields}
          editorState={editor}
          onChange={setEditor}
          readOnly={isMobile}
        />
      </div>
    </Card>
  )
}

export default TemplateEditor
