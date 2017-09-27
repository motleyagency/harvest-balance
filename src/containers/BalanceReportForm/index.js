import { connect } from "react-redux"
import moment from "moment"
import BalanceReportForm from "../../components/BalanceReportForm"
import { balanceReportFetch, balanceReportError } from "../../actions"

const mapStateToProps = () => ({
  startDate: moment().startOf("year").format("YYYY-MM-DD"),
})

const mapDispatchToProps = dispatch => ({
  onSubmit: (startDate) => {
    const date = moment.utc(startDate)
    if (!date.isValid()) {
      dispatch(balanceReportError("Invalid date"))
    } else {
      dispatch(balanceReportFetch(date.startOf("day").toISOString()))
    }
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BalanceReportForm)
