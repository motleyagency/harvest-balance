import React, { Fragment } from 'react';
import { useAuth } from '../../util/auth';
import Navbar from './../../components/Navbar';
import SignInSection from './../../components/SignInSection';
import './styles.scss';

function HomePage() {
  const { user } = useAuth();

  return (
    <Fragment>
      <Navbar color="white" spaced={true} />
      {!user ? (
        <SignInSection
          color="white"
          size="medium"
          title="Welcome"
          buttonText="Sign in"
        />
      ) : (
        <p>Signed in</p>
      )}
    </Fragment>
  );
}

export default HomePage;
