import { HelmetData } from 'react-helmet'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'

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
    __APOLLO_STATE__: NormalizedCacheObject
  }
}
