import { HelmetData } from 'react-helmet'
import { NormalizedCacheObject } from 'apollo-cache-inmemory'
import { StaticRouterContext } from 'react-router'

declare global {
  interface RenderResult {
    markup: string
    routerContext: StaticRouterContext
    head?: HelmetData
    state?: object
  }

  interface Window {
    requestUrl?: string
    rendered?: Promise<RenderResult>
    __APOLLO_STATE__: NormalizedCacheObject
  }
}
