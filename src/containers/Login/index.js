import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import LoginComponent from "../../components/Login"
import { AUTH_URL } from "../../lib/harvestBalance"

const mapStateToProps = () => ({
  authUrl: AUTH_URL,
})

const Login = ({ authUrl }) => (
  <LoginComponent authUrl={authUrl} />
)

Login.propTypes = {
  authUrl: PropTypes.string,
}
Login.defaultProps = {
  authUrl: null,
}

export default connect(
  mapStateToProps,
)(Login)
