declare module '*.svg' {
  import { ComponentType, SVGAttributes } from 'react'

  const ReactComponent: ComponentType<SVGAttributes>

  const url: string
}
