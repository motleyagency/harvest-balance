import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Home from "../../components/Home"
import Login from "../../containers/Login"
import Oauth from "../../containers/Oauth"

const mapStateToProps = ({ auth }) => ({
  authenticated: !!auth.token,
})

const App = ({ authenticated }) => (
  <Router>
    <div className="body-container container-fluid">
      <Route
        exact path="/"
        render={() => (
          authenticated ? (
            <Home />
          ) : (
            <Login />
          )
        )}
      />
      <Route exact path="/oauth" component={Oauth} />
    </div>
  </Router>
)

App.propTypes = {
  authenticated: PropTypes.bool.isRequired,
}

export default connect(
  mapStateToProps,
)(App)
