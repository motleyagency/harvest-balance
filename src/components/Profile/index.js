import React, { PropTypes } from "react"
import { Button } from "reactstrap"

const Profile = ({ company, user, onLogout }) => (
  <div>
    <img src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
    <p>
      {`${user.first_name} ${user.last_name}`}<br />
      { company.name }
    </p>
    <Button color="link" onClick={onLogout}>Logout</Button>
  </div>
)

Profile.propTypes = {
  company: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}).isRequired,
  onLogout: PropTypes.func.isRequired,
}


export default Profile
