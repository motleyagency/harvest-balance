import React, { Fragment } from 'react';
import { useAuth } from '../../util/auth';
import Navbar from './../../components/Navbar';
import SignInSection from './../../components/SignInSection';
import BalanceReportSection from '../../components/BalanceReportSection';
import './styles.scss';

function HomePage() {
  const { user } = useAuth();

  return (
    <Fragment>
      <Navbar color="white" spaced={true} />
      {!user ? (
        <SignInSection color="white" title="Welcome" />
      ) : (
        <BalanceReportSection color="white" size="large" />
      )}
    </Fragment>
  );
}

export default HomePage;
