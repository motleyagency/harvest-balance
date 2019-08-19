import React from "react"
import styled from "styled-components"
import Navbar from "../../containers/Navbar"
import BalanceReport from "../../containers/BalanceReport"
import BalanceReportForm from "../../containers/BalanceReportForm"

const Container = styled.div`
  padding-top: 65px;
`

const Home = () => (
  <Container>
    <Navbar />
    <div className="row">
      <div className="col">
        <BalanceReportForm />
        <BalanceReport />
      </div>
    </div>
  </Container>
)

export default Home
