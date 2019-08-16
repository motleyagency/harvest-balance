import React, { Fragment } from 'react';
import Navbar from './../../components/Navbar';
import SignInSection from './../../components/SignInSection';
import Footer from './../../components/Footer';
import './styles.scss';

function HomePage(props) {
  return (
    <Fragment>
      <Navbar
        color="white"
        spaced={true}
        logo="https://uploads.divjoy.com/logo.svg"
      />
      <SignInSection
        color="white"
        size="medium"
        title="Welcome back"
        subtitle=""
        buttonText="Sign in"
      />
      <Footer
        color="white"
        size="normal"
        logo="https://uploads.divjoy.com/logo.svg"
        copyright="© 2019 Company"
      />
    </Fragment>
  );
}

export default HomePage;
