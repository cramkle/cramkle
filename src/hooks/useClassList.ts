import { useCallback, useState } from 'react'

export const useClassList = () => {
  const [classList, setClassList] = useState<string[]>([])

  const addClass = useCallback((cls: string) => {
    setClassList((prevList) => {
      if (prevList.includes(cls)) {
        return prevList
      }

      return [...prevList, cls]
    })
  }, [])

  const removeClass = useCallback((cls: string) => {
    setClassList((prevList) => prevList.filter((c) => c !== cls))
  }, [])

  return { classList, addClass, removeClass }
}
