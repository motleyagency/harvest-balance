import React from 'react';
import styled from 'styled-components';
import { Link, useRouter } from '../../util/router';

const StyledTabs = styled.nav`
  max-width: 500px;
  margin: 0 auto 1em;
  padding-top: 1em;

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
    padding: 0.75em 2em;
    display: block;
    font-weight: 600;
    border-radius: 1px;
    transition: background 0.125s ease-in, box-shadow 0.125s ease-in;
  }

  a:not(.current) {
    color: #444444;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
    background: #f7f7f7;

    &:hover,
    &:focus {
      background: #ccc;
      box-shadow: none;
      transition-timing-function: ease-out;
    }
  }

  a.current {
    background: #444;
    color: #ffffff;
    cursor: default;
  }
`;

function Tabs({ children }) {
  const { pathname } = useRouter();

  return (
    <StyledTabs>
      {children}
      <ul>
        <li>
          <Link to="/" className={pathname === '/' ? 'current' : ''}>
            Total
          </Link>
        </li>
        <li>
          <Link
            to="/projects"
            className={pathname === '/projects' ? 'current' : ''}
          >
            Weekly
          </Link>
        </li>
      </ul>
    </StyledTabs>
  );
}

export default Tabs;
