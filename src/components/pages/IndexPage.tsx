import React from 'react'
import { graphql, ChildDataProps } from 'react-apollo'

import HomePage from './HomePage'
import LandingPage from './LandingPage'
import TopBar from '../TopBar'
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
    <TopBar>
      <HomePage {...props} />
    </TopBar>
  )
}

export default graphql<{}, Data>(userQuery)(IndexPage)
