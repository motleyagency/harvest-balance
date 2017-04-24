import { connect } from "react-redux"
import Login from "../../components/Login"
import { fetchAuthUrl } from "../../actions"

const mapStateToProps = ({ auth }) => ({
  auth,
})

const mapDispatchToProps = dispatch => ({
  getAuthUrl: () => {
    dispatch(fetchAuthUrl())
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)
