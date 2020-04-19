import {
  CompositeDecorator,
  EditorState,
  RawDraftContentState,
  RichUtils,
  convertFromRaw,
  convertToRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import React, { useCallback, useState } from 'react'
import { TabController } from 'react-tab-controller'
import Card, { CardActionButtons, CardActions } from 'views/Card'

import { useHints } from './HintsContext'
import SaveTemplateButton from './SaveTemplateButton'
import BlockStyleControls from './editor/BlockStyleControls'
import InlineStyleControls from './editor/InlineStyleControls'
import TagEditor from './editor/TagEditor'
import { decorators as tagsDecorators } from './editor/TagsPopup'
import { ModelQuery_cardModel_templates_frontSide as TemplateContent } from './pages/__generated__/ModelQuery'

const decorators = new CompositeDecorator(tagsDecorators)

interface Props {
  id: string
  isFrontSide?: boolean
  initialContentState: TemplateContent
  fields: { id: string; name: string }[]
}

const TemplateEditor: React.FunctionComponent<Props> = ({
  id,
  isFrontSide = false,
  initialContentState,
  fields,
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
              id={id}
              isFrontSide={isFrontSide}
              {...convertToRaw(editor.getCurrentContent())}
            />
          </CardActionButtons>
        </CardActions>
      )}
    </Card>
  )
}

export default TemplateEditor
