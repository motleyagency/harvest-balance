import React, { PropTypes } from "react"
import { connect } from "react-redux"
import LoginComponent from "../../components/Login"
import { AUTH_URL } from "../../lib/harvestBalance"

const mapStateToProps = state => ({
  status: state.auth.status,
})

const Login = () => (
  <LoginComponent authUrl={AUTH_URL} />
)
Login.propTypes = {
  status: PropTypes.string,
}
Login.defaultProps = {
  status: null,
}

export default connect(
  mapStateToProps,
)(Login)
