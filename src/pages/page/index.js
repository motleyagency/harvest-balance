import React, { Suspense } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../util/auth';
import Navbar from '../../components/Navbar';
import SignInSection from '../../components/SignInSection';
import Tabs from '../../components/Tabs';

const PageContent = styled.main`
  max-width: 750px;
  margin: 0 auto 2em;
  padding-top: 10vh;
`;

const Container = styled.div`
  padding: 0 1em;
`;

const NavTitle = styled.p`
  text-align: center;
  margin: 0 auto 1em;
`;

function Page({ children }) {
  const { user } = useAuth();

  return (
    <>
      <Navbar color="white" spaced />
      {!user ? (
        <SignInSection color="white" title="Welcome" />
      ) : (
        <Suspense fallback={<div>loading...</div>}>
          <PageContent>
            <Container>
              <Tabs>
                <NavTitle>Show balance as</NavTitle>
              </Tabs>
              {children}
            </Container>
          </PageContent>
        </Suspense>
      )}
    </>
  );
}

export default Page;
