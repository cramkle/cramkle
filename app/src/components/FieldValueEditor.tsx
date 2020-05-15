import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ContentState } from 'draft-js'
import React, { useCallback } from 'react'

import BaseEditor from './editor/BaseEditor'
import BaseEditorControls from './editor/BaseEditorControls'

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

  const handleChange = useCallback(
    (contentState: ContentState) => {
      onChange(contentState, field)
    },
    [onChange, field]
  )

  return (
    <BaseEditorControls
      className={className}
      initialContentState={initialContentState}
      onChange={handleChange}
    >
      <BaseEditor placeholder={i18n._(t`Field value...`)} />
    </BaseEditorControls>
  )
}

export default FieldValueEditor
