import { HelmetData } from 'react-helmet'

declare global {
  interface RenderResult {
    markup: string
    routerContext: object
    head?: HelmetData
    state?: object
  }

  interface Window {
    requestUrl?: string
    rendered?: Promise<RenderResult>
  }
}
