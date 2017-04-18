import React, { PropTypes } from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { login } from "../../actions"

const mapStateToProps = state => ({
  status: state.auth.status,
})

const mapDispatchToProps = dispatch => ({
  handleAuth: (authCode) => {
    dispatch(login(authCode))
  },
})

class Oauth extends React.Component {

  componentDidMount() {
    const { handleAuth, location: { search }, status } = this.props
    const authCode = new URLSearchParams(search).get("code")

    if (status !== "loading" && authCode) {
      handleAuth(authCode)
    }
  }

  render() {
    if (this.props.status === "success" || this.props.status === "error") {
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
  status: "",
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Oauth)
