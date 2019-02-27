import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { graphql } from 'react-apollo'

import userQuery from '../../graphql/userQuery.gql'

interface Props extends RouteProps {
}

const GuestRoute: React.FunctionComponent<Props> = ({ data: { user }, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      user === null ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/dashboard',
            // eslint-disable-next-line react/prop-types
            state: { from: props.location },
          }}
        />
      )
    }
  />
)

export default graphql(userQuery)(GuestRoute)
