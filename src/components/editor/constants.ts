import type { TaggableEntry } from './TaggableEntry'

export const TAG_TYPE = 'TAG'
export enum FUNCTION_TAG_TYPE {
  TEXT_TO_SPEECH = 'TEXT_TO_SPEECH',
  TEXT_INPUT = 'TEXT_INPUT',
}

export const SUPPORTED_TEXT_TO_SPEECH_LANGUAGES: TaggableEntry[] = [
  { id: 'en-US', name: 'English (US)' },
  { id: 'de-DE', name: 'German (DE)' },
]
