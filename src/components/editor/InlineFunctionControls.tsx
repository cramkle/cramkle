import { t } from '@lingui/macro'
import * as React from 'react'

import type { TaggableEntry } from './TaggableEntry'
import TemplateEditorFunctionButton from './TemplateEditorFunctionButton'
import { FUNCTION_TAG_TYPE } from './constants'
import TextToSpeechForm from './forms/TextToSpeechForm'

const InlineFunctionControls: React.FunctionComponent<{
  fields: TaggableEntry[]
  handleFunction: (
    tag: FUNCTION_TAG_TYPE,
    data: Record<string, unknown>
  ) => void
}> = ({ handleFunction, fields }) => {
  const [openFormType, setOpenFormType] = React.useState<FUNCTION_TAG_TYPE>()

  return (
    <div className="text-sm flex">
      <TemplateEditorFunctionButton
        key={FUNCTION_TAG_TYPE.TEXT_TO_SPEECH}
        label={t`Text to Speech`}
        setOpenFormType={setOpenFormType}
        entityType={FUNCTION_TAG_TYPE.TEXT_TO_SPEECH}
      />

      <TextToSpeechForm
        fields={fields}
        open={openFormType == FUNCTION_TAG_TYPE.TEXT_TO_SPEECH}
        onClose={() => setOpenFormType(undefined)}
        handleFunction={handleFunction}
      />
    </div>
  )
}

export default InlineFunctionControls
