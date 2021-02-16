declare module '*.svg' {
  import type { ComponentType, SVGAttributes } from 'react'

  export const ReactComponent: ComponentType<SVGAttributes>

  const url: string

  export default url
}

declare module '*.woff2' {
  const url: string

  export default url
}
