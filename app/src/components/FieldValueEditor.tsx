import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import {
  ContentState,
  Editor,
  EditorState,
  RawDraftContentState,
  RichUtils,
  convertFromRaw,
} from 'draft-js'
import 'draft-js/dist/Draft.css'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { TabController } from 'react-tab-controller'

import InlineStyleControls from 'components/editor/InlineStyleControls'
import BlockStyleControls from 'components/editor/BlockStyleControls'
import Card, { CardActionButtons, CardActions } from 'views/Card'

interface Props {
  className?: string
  initialContentState?: any
  onChange?: (
    content: ContentState,
    field: { id: string; name: string }
  ) => void
  field: { id: string; name: string }
}

const FieldValueEditor: React.FC<Props> = ({
  className,
  onChange,
  initialContentState,
  field,
}) => {
  const { i18n } = useLingui()

  const [editor, setEditor] = useState(() => {
    if (!initialContentState || initialContentState.blocks.length === 0) {
      return EditorState.createEmpty()
    }

    const contentState = convertFromRaw(
      initialContentState as RawDraftContentState
    )

    return EditorState.createWithContent(contentState)
  })

  const contentState = editor.getCurrentContent()
  const prevContentState = useRef(contentState)

  useEffect(() => {
    if (contentState === prevContentState.current) {
      return
    }

    prevContentState.current = contentState
    onChange?.(contentState, field)
  }, [onChange, contentState, field])

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
    <Card outlined className={className}>
      <CardActions className="bb b--inherit">
        <CardActionButtons className="flex-column items-start">
          <TabController>
            <BlockStyleControls
              editor={editor}
              onToggle={handleBlockStyleToggle}
            />
          </TabController>
          <TabController>
            <InlineStyleControls editor={editor} onToggle={handleStyleToggle} />
          </TabController>
        </CardActionButtons>
      </CardActions>
      <div className="pa3">
        <Editor
          editorState={editor}
          onChange={setEditor}
          placeholder={i18n._(t`Field value...`)}
        />
      </div>
    </Card>
  )
}

export default FieldValueEditor
