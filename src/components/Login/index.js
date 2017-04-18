import React, { PropTypes } from "react"
import { Button } from "reactstrap"

const Login = ({ authUrl }) => (
  <div>
    <a href={authUrl}>
      <Button>Login with Harvest</Button>
    </a>
  </div>
)

Login.propTypes = {
  authUrl: PropTypes.string.isRequired,
}

export default Login
