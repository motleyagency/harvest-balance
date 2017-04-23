import React from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"
import styled from "styled-components"
import harvestIcon from "../../assets/harvest-h.svg"

const LoginButton = styled(Button)`
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

const Error = styled.p`
  margin-top: 3rem;
`

const Login = ({ authUrl, auth: { status, errorDescription } }) => (
  <div className="container-fluid">
    <Row className="row">
      <div className="col text-center align-self-center">
        <H1>Harvest Balance</H1>
        <a href={authUrl}>
          <LoginButton color="primary">
            <HarvestLogo src={harvestIcon} alt="Login with Harvest" />
            Login with Harvest
          </LoginButton>
        </a>
        {
          status === "error" && (
            <Error className="text-danger">
              {errorDescription}
            </Error>
          )
        }
      </div>
    </Row>
  </div>
)

Login.propTypes = {
  authUrl: PropTypes.string.isRequired,
  auth: PropTypes.shape({
    status: PropTypes.string,
    errorDescription: PropTypes.string,
  }).isRequired,
}

Login.defaultProps = {
  auth: {
    status: null,
    errorDescription: null,
  },
}

export default Login
