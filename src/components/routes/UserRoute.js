import React from 'react'
import { connect } from 'react-redux'
import { Route, Redirect } from 'react-router-dom'

import { isAuthenticatedSelector } from '../../selectors/user'

const UserRoute = ({ isAuthenticated, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/login',
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

export default connect(mapStateToProps)(UserRoute)
