import { loadQuery } from 'react-relay'

export const createPreloadForContext =
  (context: AppContext) => (metadata: any) => {
    return loadQuery(
      context.relayEnvironment,
      metadata.document,
      metadata.variables,
      metadata.options
    )
  }
