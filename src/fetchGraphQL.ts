export function createFetchGraphQL(uri: string, cookie?: string) {
  return async (text: string, variables: Record<string, unknown>) => {
    // Fetch data from Hipocampo's GraphQL API:
    const response = await fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie ?? '',
      },
      body: JSON.stringify({ query: text, variables }),
    })
    // Get the response as JSON
    return await response.json()
  }
}
