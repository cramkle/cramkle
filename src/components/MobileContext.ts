import { useContext, createContext } from 'react'

const Mobile = createContext(true)

export default Mobile

export const useMobile = () => {
  return useContext(Mobile)
}
