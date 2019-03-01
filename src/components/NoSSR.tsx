import * as React from 'react'

interface Props {
  fallback: React.ReactNode
}

// the fragment is required because typescript can be weird sometimes
const NoSSR: React.FunctionComponent<Props> = ({ fallback, children }) => (
  <React.Fragment>{process.browser ? children : fallback}</React.Fragment>
)

export default NoSSR
