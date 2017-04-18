import React, { PropTypes } from "react"
import { connect } from "react-redux"
import BalanceReportForm from "../../components/BalanceReportForm"
import BalanceReportComponent from "../../components/BalanceReport"
import { balanceReportFetch } from "../../actions"

const mapStateToProps = state => ({
  balanceReport: state.balanceReport,
})

const mapDispatchToProps = dispatch => ({
  loadReport: (startDate) => {
    dispatch(balanceReportFetch(startDate))
  },
})

const BalanceReport = ({ loadReport, balanceReport }) => (
  <div>
    <BalanceReportForm onSubmit={loadReport} />
    <BalanceReportComponent status={balanceReport.status} report={balanceReport.report} />
  </div>
)

BalanceReport.propTypes = {
  loadReport: PropTypes.func.isRequired,
  balanceReport: PropTypes.shape({}).isRequired,
}


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BalanceReport)
