import React, { Suspense, Fragment, lazy } from 'react';
import { useAuth } from '../../util/auth';
import Navbar from '../../components/Navbar';
import SignInSection from '../../components/SignInSection';

const ProjectsSection = lazy(() => import('../../components/ProjectsSection'));

function ProjectsPage() {
  const { user } = useAuth();

  return (
    <Fragment>
      <Navbar color="white" spaced />
      {!user ? (
        <SignInSection color="white" title="Welcome" />
      ) : (
        <Suspense fallback={<div>loading...</div>}>
          <ProjectsSection />
        </Suspense>
      )}
    </Fragment>
  );
}

export default ProjectsPage;
