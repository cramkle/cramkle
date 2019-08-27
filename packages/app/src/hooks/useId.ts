import { useRef } from 'react'
import * as uuid from 'uuid'

const useId = () => {
  const idRef = useRef(uuid.v4())

  return idRef.current
}

export default useId
