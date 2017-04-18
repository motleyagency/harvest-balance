import React, { PropTypes } from "react"
import { connect } from "react-redux"
import { BrowserRouter as Router, Route } from "react-router-dom"
import Home from "../../components/Home"
import Login from "../../containers/Login"
import Oauth from "../../containers/Oauth"

const mapStateToProps = state => ({
  authenticated: !!(state.auth.session && state.auth.session.harvest_token),
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
