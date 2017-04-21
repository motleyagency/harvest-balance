import { connect } from "react-redux"
import { profileFetch, logout } from "../../actions"
import ProfileComponent from "../../components/Profile"

const mapStateToProps = ({ profile: { account } }) => ({
  company: account.company,
  user: account.user,
})

const mapDispatchToProps = dispatch => ({
  loadProfile: () => {
    dispatch(profileFetch())
  },
  logout: () => {
    dispatch(logout())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProfileComponent)
