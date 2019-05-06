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
    requestCookie?: string
    requestLanguage?: string
    rendered?: Promise<RenderResult>
    hostname?: string
    userAgent?: string
    __APOLLO_STATE__: NormalizedCacheObject
  }
}
