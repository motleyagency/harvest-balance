import React, { lazy } from 'react';
import Page from '../page';

const BalanceReportSection = lazy(() =>
  import('../../components/BalanceReportSection'),
);

function HomePage() {
  return (
    <Page>
      <BalanceReportSection />
    </Page>
  );
}

export default HomePage;
