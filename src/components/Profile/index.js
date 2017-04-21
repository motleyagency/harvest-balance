import React from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"

const Profile = ({ company, user, logout, loadProfile }) => {
  if (!user) {
    loadProfile()
    return <div>Loading...</div>
  }

  return (
    <div>
      <img src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
      <p>
        {`${user.first_name} ${user.last_name}`}<br />
        { company.name }
      </p>
      <Button color="link" onClick={logout}>Logout</Button>
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
