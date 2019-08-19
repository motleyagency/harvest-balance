import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { login, loginError } from "../../actions"

const mapStateToProps = ({ auth }) => ({
  ...auth,
})

const mapDispatchToProps = dispatch => ({
  handleAuth: (authCode) => {
    dispatch(login(authCode))
  },
  handleAuthError: (errorDescription) => {
    dispatch(loginError(errorDescription))
  },
})

const Spinner = styled.div`
  height: 100vh;
  text-align: center;

  > i {
    margin-top: 50vh;
  }
`

class Oauth extends React.Component {

  componentDidMount() {
    // eslint-disable-next-line
    const { handleAuth, handleAuthError, location: { search },
    } = this.props
    const authCode = new URLSearchParams(search).get("code")
    const authError = new URLSearchParams(search).get("error")

    if (authCode) {
      handleAuth(authCode)
    } else if (authError) {
      handleAuthError(new URLSearchParams(search).get("error_description"))
    }
  }

  render() {
    const { status } = this.props
    if (status === "success" || status === "error") {
      return <Redirect to="/" />
    }
    return <Spinner><i className="icon-spin animate-spin" /></Spinner>
  }
}

Oauth.propTypes = {
  handleAuth: PropTypes.func.isRequired,
  handleAuthError: PropTypes.func.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  status: PropTypes.string,
}
Oauth.defaultProps = {
  location: {
    search: "",
  },
  status: "pending",
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Oauth)
