import React from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"
import styled from "styled-components"
import harvestIcon from "../../assets/harvest-h.svg"

const LoginButton = styled(Button)`
  background-color: #F66621;
  color: white;
  font-weight: 700;
`

const H1 = styled.h1`
  margin-bottom: 6rem;
  color: #F66621;
`

const HarvestLogo = styled.img`
  margin-right: 1rem;
  vertical-align: top;
`

const Row = styled.div`
  height: 100vh;
`

const Login = ({ authUrl }) => (
  <div className="container-fluid">
    <Row className="row">
      <div className="col text-center align-self-center">
        <H1>Harvest Balance</H1>
        <a href={authUrl}>
          <LoginButton>
            <HarvestLogo src={harvestIcon} alt="Login with Harvest" />
            Login with Harvest
          </LoginButton>
        </a>
      </div>
    </Row>
  </div>
)

Login.propTypes = {
  authUrl: PropTypes.string.isRequired,
}

export default Login
