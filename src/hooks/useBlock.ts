import { useEffect } from 'react'
import { useHistory } from 'react-router'

export const useBlock = (shouldBlock: boolean, message?: string) => {
  const history = useHistory()

  useEffect(() => {
    if (!shouldBlock) {
      return
    }

    return history.block(message)
  }, [history, shouldBlock, message])
}
