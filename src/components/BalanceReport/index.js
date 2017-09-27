import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import BalanceReportDetails from "../BalanceReportDetails"

const Header = styled.div `
  font-size: 1.5rem;
  text-align: center;
  transform: translateY(0.5rem);
`
const Spinner = styled.div `
  font-size: 2rem;
  padding-top: 2rem;
`
const Balance = styled.div `
  position: relative;
  text-align: center;
`
const Hours = styled.span`
  font-size: 5rem;
`
const H = styled.span`
  font-size: 2rem;
  position: absolute;
  top: 1.2rem;
`
const Minutes = styled.span`
  font-size: 2rem;
`
const M = styled.span`
  font-size: 1rem;
  margin-left: 0.2rem;
`

const BalanceReport = ({ status, report: { balance: { hours, minutes }, entries, dayTotals } }) => {
  switch (status) {
  case "pending":
    return (
      <div>
        <Header>
          Your balance is
        </Header>
        <Balance>
          <Spinner><i className="icon-spin animate-spin" /></Spinner>
        </Balance>
      </div>
    )
  case "success":
    return (
      <div>
        <Header>
          Your balance is
        </Header>
        <Balance>
          <Hours>{hours}</Hours>
          <H>h</H>
          <Minutes>{Math.abs(minutes)}</Minutes>
          <M>min</M>
        </Balance>
        <BalanceReportDetails entries={entries} dayTotals={dayTotals} />
      </div>
    )
  default:
    return (
      <div />
    )
  }
}

BalanceReport.defaultProps = {
  status: null,
  report: {
    balance: {
      hours: null,
      minutes: null,
    },
    entries: [],
    dayTotals: {},
  },
}

BalanceReport.propTypes = {
  status: PropTypes.string,
  report: PropTypes.shape({
    balance: PropTypes.shape({
      hours: PropTypes.number,
      minutes: PropTypes.number,
    }),
    entries: PropTypes.arrayOf(PropTypes.shape({})),
    dayTotals: PropTypes.shape({}),
  }),
}

export default BalanceReport
