import { usePrompt } from 'react-router-dom'

export const useBlock = (shouldBlock: boolean, message?: string) => {
  usePrompt(message ?? '', shouldBlock)
}
