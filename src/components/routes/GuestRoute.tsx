import * as React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

import { isAuthenticatedSelector } from '../../selectors/user'

interface GuestRouteProps {
  isAuthenticated: boolean
  component: React.ComponentType
}

const GuestRoute: React.StatelessComponent<GuestRouteProps> = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !isAuthenticated ? (
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

const mapStateToProps = state => ({
  isAuthenticated: isAuthenticatedSelector(state),
})

export default connect(mapStateToProps)(GuestRoute)
