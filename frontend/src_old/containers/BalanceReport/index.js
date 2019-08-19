import { connect } from "react-redux"
import BalanceReport from "../../components/BalanceReport"

const mapStateToProps = ({ balanceReport }) => ({
  ...balanceReport,
})

export default connect(
  mapStateToProps,
)(BalanceReport)
