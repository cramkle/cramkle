import type { ContentState } from 'draft-js'
import * as React from 'react'

import { VolumeUpIcon } from '../icons/VolumeUpIcon'
import { SUPPORTED_TEXT_TO_SPEECH_LANGUAGES } from './constants'

interface TextToSpeechPlayerProps {
  contentState: ContentState
  entityKey: string
}

const TextToSpeechPlayer: React.FunctionComponent<TextToSpeechPlayerProps> = ({
  entityKey,
  contentState,
}) => {
  const data = contentState.getEntity(entityKey).getData()
  const fieldName = data.fieldName
  const languageCode = data.languageId
  const language = SUPPORTED_TEXT_TO_SPEECH_LANGUAGES.find(
    (l) => l.id == languageCode
  )?.name

  return (
    <span className="px-5 py-1 mb-2 h-10 justify-center items-center shadow-md rounded-full">
      {fieldName} - {language}
      <VolumeUpIcon className="ml-1 text-primary inline-block" />
    </span>
  )
}

export default TextToSpeechPlayer
