/// <reference types="graphql" />

import { NormalizedCacheObject } from 'apollo-cache-inmemory'

declare global {
  interface Window {
    __APOLLO_STATE__: NormalizedCacheObject
  }
}
