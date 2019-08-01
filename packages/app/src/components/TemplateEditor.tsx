import {
  EditorState,
  CompositeDecorator,
  RichUtils,
  RawDraftContentState,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import React, { useState, useCallback } from 'react'
import { TabController } from 'react-tab-controller'

import InlineStyleControls from './editor/InlineStyleControls'
import BlockStyleControls from './editor/BlockStyleControls'
import { decorators as tagsDecorators } from './editor/TagsPopup'
import TagEditor from './editor/TagEditor'
import { useHints } from './HintsContext'
import SaveTemplateButton from './SaveTemplateButton'
import { ModelQuery_cardModel_templates_frontSide as TemplateContent } from './pages/__generated__/ModelQuery'
import Card, { CardActions, CardActionButtons } from './views/Card'

const decorators = new CompositeDecorator(tagsDecorators)

const TemplateEditor: React.FunctionComponent<{
  initialContentState: TemplateContent
  fields: { id: string; name: string }[]
}> = ({ initialContentState, fields }) => {
  const { isMobile } = useHints()

  const [editor, setEditor] = useState(() => {
    if (initialContentState.blocks.length === 0) {
      return EditorState.createEmpty(decorators)
    }

    const contentState = convertFromRaw(
      initialContentState as RawDraftContentState
    )

    return EditorState.createWithContent(contentState, decorators)
  })

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
      {!isMobile && (
        <CardActions className="bt b--inherit">
          <CardActionButtons>
            <SaveTemplateButton
              id={initialContentState.id}
              {...convertToRaw(editor.getCurrentContent())}
            />
          </CardActionButtons>
        </CardActions>
      )}
    </Card>
  )
}

export default TemplateEditor
