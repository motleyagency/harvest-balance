import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from "reactstrap"

const ProfilePic = styled.img`
  border-radius: 100%;
  border: 2px solid #F66621;
  width: 38px;
  height: 38px;
  margin-left: 1rem;
`

const Username = styled.span`
`

const ProfilePlaceholder = styled.i`
  border-radius: 100%;
  border: 2px solid #F66621;
  width: 38px;
  height: 38px;
  margin-left: 1rem;
  font-size: 1.5rem;
  line-height: 2.0rem;
  background-color: #999;
  color: #fff;
`

const ProfileToggler = ({ user, ...rest }) => {
  if (!user) {
    return (
      <div {...rest}>
        <ProfilePlaceholder className="icon-user" />
      </div>
    )
  }

  return (
    <div {...rest}>
      <Username>{`${user.first_name}`}</Username>
      <ProfilePic src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
    </div>
  )
}

ProfileToggler.propTypes = {
  user: PropTypes.shape({}),
}
ProfileToggler.defaultProps = {
  user: undefined,
}

const NavbarTogglerFlex = styled(NavbarToggler)`
  padding: 0;
  display: flex;
  align-items: center;
`

// eslint-disable-next-line no-unused-vars
class AppNavbar extends React.Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false,
    }
  }

  componentDidMount() {
    const { user, loadProfile } = this.props
    if (!user) {
      loadProfile()
    }
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }

  render() {
    const { user, logout } = this.props

    return (
      <div>
        <Navbar color="faded" fixed="top" light>
          <NavbarTogglerFlex right onClick={this.toggle} tag={ProfileToggler} user={user} />
          <NavbarBrand href="/">Harvest Balance</NavbarBrand>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem className="text-right">
                <NavLink onClick={logout}>Logout</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}

AppNavbar.propTypes = {
  // company: PropTypes.shape({}),
  user: PropTypes.shape({}),
  logout: PropTypes.func.isRequired,
  loadProfile: PropTypes.func.isRequired,
}

AppNavbar.defaultProps = {
  user: null,
  company: null,
}

export default AppNavbar
