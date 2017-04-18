import React from "react"
import { connect } from "react-redux"
import { logout } from "../../actions"
import ProfileComponent from "../../components/Profile"

const mapStateToProps = state => ({
  company: state.auth.session.company,
  user: state.auth.session.user,
})

const mapDispatchToProps = dispatch => ({
  onLogout: () => {
    dispatch(logout())
  },
})

const Profile = props => (
  <ProfileComponent {...props} />
)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile)
