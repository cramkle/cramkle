import { useState, useCallback } from 'react'

const useClassList = () => {
  const [classList, setClassList] = useState<string[]>([])

  const addClass = useCallback((cls: string) => {
    setClassList(prevList => [...prevList, cls])
  }, [])

  const removeClass = useCallback((cls: string) => {
    setClassList(prevList => prevList.filter(c => c !== cls))
  }, [])

  return { classList, addClass, removeClass }
}

export default useClassList
