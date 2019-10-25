import React, { lazy } from 'react';
import Page from '../page';

const BalanceReportSection = lazy(() =>
  import('../../components/BalanceReportSection'),
);

function HomePage() {
  return (
    <Page>
      <BalanceReportSection color="white" />
    </Page>
  );
}

export default HomePage;