import type { MessageDescriptor } from '@lingui/core'
import { useLingui } from '@lingui/react'
import classNames from 'classnames'
import { memo, useRef } from 'react'
import * as React from 'react'

import type { FUNCTION_TAG_TYPE } from './constants'

export interface TemplateEditorFunction {
  label: MessageDescriptor | string
  entityType: FUNCTION_TAG_TYPE
  icon?: React.ReactElement | undefined
}

interface Props extends TemplateEditorFunction {
  setOpenFormType: (tag: FUNCTION_TAG_TYPE) => void
}

const TemplateEditorFunctionButton: React.FunctionComponent<Props> = ({
  label,
  setOpenFormType,
  entityType,
  icon,
}) => {
  const { i18n } = useLingui()
  const buttonRef = useRef<HTMLButtonElement>(null)

  const className = classNames(
    'mdc-ripple-surface flex-shrink-0 text-txt text-opacity-text-primary bg-editor relative cursor-pointer mr-2 border-0 border-none rounded-sm flex items-center text-center outline-none p-1'
  )

  const translatedLabel = i18n._(label)

  return (
    <>
      <button
        className={className}
        onClick={() => setOpenFormType(entityType)}
        ref={buttonRef}
        aria-label={translatedLabel}
      >
        {icon ? icon : translatedLabel}
      </button>
    </>
  )
}

export default memo(TemplateEditorFunctionButton)
