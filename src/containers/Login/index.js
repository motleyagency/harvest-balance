import { connect } from "react-redux"
import Login from "../../components/Login"
import { AUTH_URL } from "../../lib/harvestBalance"

const mapStateToProps = ({ auth }) => ({
  authUrl: AUTH_URL,
  auth,
})

export default connect(
  mapStateToProps,
)(Login)
