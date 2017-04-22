import React from "react"
import PropTypes from "prop-types"
// import { Link } from "reactstrap"
import styled from "styled-components"

const ProfilePic = styled.img`
  border-radius: 100%;
  border: 2px solid #F66621;
  width: 50px;
  float: left;
  margin-right: 1rem;
`

const Username = styled.span`
  font-weight: 700;
`

const Profile = ({ company, user, logout, loadProfile }) => {
  if (!user) {
    loadProfile()
    return <div>Loading...</div>
  }

  return (
    <div>
      <ProfilePic src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
      <a href="" onClick={logout}><i className="icon-logout" /></a>
      <Username>{`${user.first_name} ${user.last_name}`}</Username><br />
      <span>{ company.name }</span>
    </div>
  )
}

Profile.propTypes = {
  company: PropTypes.shape({}),
  user: PropTypes.shape({}),
  logout: PropTypes.func.isRequired,
  loadProfile: PropTypes.func.isRequired,
}
Profile.defaultProps = {
  user: null,
  company: null,
}


export default Profile
