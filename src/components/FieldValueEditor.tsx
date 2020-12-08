import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { ContentState } from 'draft-js'
import { useCallback, useEffect, useRef } from 'react'
import * as React from 'react'

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

  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const handleChange = useCallback(
    (contentState: ContentState) => {
      onChangeRef.current?.(contentState, field)
    },
    [field]
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
