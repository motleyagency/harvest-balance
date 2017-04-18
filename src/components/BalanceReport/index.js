import React from "react"

// eslint-disable-next-line
const BalanceReport = ({ status, report }) => (
  status === "success" ? (
    <div>Balance: {report.balance}</div>
  ) : (
    <p>Enter start date and press submit</p>
  )
)

export default BalanceReport
