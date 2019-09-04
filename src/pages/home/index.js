import React, { Suspense, Fragment, lazy } from 'react';
import { useAuth } from '../../util/auth';
import Navbar from './../../components/Navbar';
import SignInSection from './../../components/SignInSection';
import './styles.scss';

const BalanceReportSection = lazy(() =>
  import('../../components/BalanceReportSection'),
);

function HomePage() {
  const { user } = useAuth();

  return (
    <Fragment>
      <Navbar color="white" spaced={true} />
      {!user ? (
        <SignInSection color="white" title="Welcome" />
      ) : (
        <Suspense fallback={<div>loading...</div>}>
          <BalanceReportSection color="white" size="large" />
        </Suspense>
      )}
    </Fragment>
  );
}

export default HomePage;
