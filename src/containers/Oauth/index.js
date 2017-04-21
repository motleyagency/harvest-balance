import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { login } from "../../actions"

const mapStateToProps = ({ auth }) => ({
  ...auth,
})

const mapDispatchToProps = dispatch => ({
  handleAuth: (authCode) => {
    dispatch(login(authCode))
  },
})

class Oauth extends React.Component {

  componentDidMount() {
    const { handleAuth, location: { search },
    } = this.props
    const authCode = new URLSearchParams(search).get("code")

    if (authCode) {
      handleAuth(authCode)
    }
  }

  render() {
    const { status } = this.props
    if (status === "success" || status === "error") {
      return <Redirect to="/" />
    }
    return <div>Authenticating...</div>
  }
}

Oauth.propTypes = {
  handleAuth: PropTypes.func.isRequired,
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
