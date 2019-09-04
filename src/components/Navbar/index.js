import React, { useState } from 'react';
import styled from 'styled-components';
import NavbarContainer from './../NavbarContainer';
import { Link } from './../../util/router.js';
import { useAuth } from './../../util/auth.js';
import './styles.scss';

const BrandLink = styled(Link)`
  color: #f66621;
  font-weight: bold;
  font-size: 1.5rem;
  display: flex;
  align-items: center;

  &:hover {
    color: #f66621;
  }
`;

const ProfilePic = styled.img`
  border-radius: 100%;
  width: 1.75rem;
  height: 1.75rem;
  margin-right: 1rem;
`;

function Navbar(props) {
  const { user, signout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <NavbarContainer spaced={props.spaced} color={props.color}>
      <div className="container">
        <div className="navbar-brand">
          <div className="navbar-item">
            <BrandLink to="/">Harvest Balance</BrandLink>
          </div>
          <div
            className={'navbar-burger burger' + (menuOpen ? ' is-active' : '')}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={'navbar-menu' + (menuOpen ? ' is-active' : '')}>
          <div className="navbar-end">
            {user && (
              <div className="navbar-item has-dropdown is-hoverable">
                <Link className="navbar-link" to="/">
                  <ProfilePic
                    src={user.avatar_url}
                    alt={`${user.first_name} ${user.last_name}`}
                  />

                  {user.first_name}
                </Link>
                <div className="navbar-dropdown is-boxed">
                  <Link
                    className="navbar-item"
                    to="/signout"
                    onClick={e => {
                      e.preventDefault();
                      signout();
                    }}
                  >
                    Sign out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </NavbarContainer>
  );
}

export default Navbar;
