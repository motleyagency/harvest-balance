import React, { PropTypes } from "react"
import { Route } from "react-router-dom"

const AuthRoute = ({
  authenticated,
  unauthComponent: UnauthComponent,
  authComponent: AuthComponent,
  ...rest
}) => (
  <Route
    {...rest}
    render={props => (
      authenticated ? (
        <AuthComponent {...props} />
      ) : (
        <UnauthComponent {...props} />
      )
    )}
  />
)

AuthRoute.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  unauthComponent: PropTypes.func.isRequired,
  authComponent: PropTypes.func.isRequired,
}

export default AuthRoute
