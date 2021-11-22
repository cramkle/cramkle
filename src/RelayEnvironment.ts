import { Environment, Network, RecordSource, Store } from 'relay-runtime'

import { createFetchGraphQL } from './fetchGraphQL'

// Relay passes a "params" object with the query name and text. So we define a helper function
// to call our fetchGraphQL utility with params.text
function createFetchRelay(uri: string, cookie?: string) {
  const fetchGraphQL = createFetchGraphQL(uri, cookie)

  return async (params, variables) => {
    console.log(
      `fetching query ${params.name} with ${JSON.stringify(variables)}`
    )
    return fetchGraphQL(params.text, variables)
  }
}

// Export a singleton instance of Relay Environment configured with our network
// function
export const createRelayEnvironment = (uri: string, cookie?: string) =>
  new Environment({
    network: Network.create(createFetchRelay(uri, cookie)),
    store: new Store(new RecordSource()),
  })
