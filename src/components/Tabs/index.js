import React from 'react';
import styled from 'styled-components';
import { Link, useRouter } from '../../util/router';

const StyledTabs = styled.nav`
  max-width: 600px;
  margin: 0 auto 1em;
  padding-top: 15vh;

  ul,
  li {
    list-style: none;
  }

  ul {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  li {
    width: 47.5%;
    text-align: center;
  }

  a {
    width: 100%;
    padding: 1em 2em;
    background: #ccc;
    color: #ffffff;
    display: block;
  }

  a.current {
    background: salmon;
  }
`;

function Tabs() {
  const { pathname } = useRouter();

  return (
    <StyledTabs>
      <ul>
        <li>
          <Link to="/" className={pathname === '/' ? 'current' : ''}>
            Total balance
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className={pathname === '/projects' ? 'current' : ''}
          >
            Weekly balance
          </Link>
        </li>
      </ul>
    </StyledTabs>
  );
}

export default Tabs;
