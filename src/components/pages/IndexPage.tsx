import React from 'react'
import { graphql, ChildDataProps } from 'react-apollo'

import HomePage from './HomePage'
import LandingPage from './LandingPage'
import Shell from '../Shell'
import userQuery from '../../graphql/userQuery.gql'

interface Data {
  user: object
}

const IndexPage: React.FunctionComponent<ChildDataProps<{}, Data>> = ({
  data: { user },
  ...props
}) => {
  if (user === null) {
    return <LandingPage {...props} />
  }

  return (
    <Shell>
      <HomePage {...props} />
    </Shell>
  )
}

export default graphql<{}, Data>(userQuery)(IndexPage)
