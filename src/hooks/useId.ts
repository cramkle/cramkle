import { useRef } from 'react'
import * as uuid from 'uuid'

export const useId = () => {
  const idRef = useRef(uuid.v4())

  return idRef.current
}
