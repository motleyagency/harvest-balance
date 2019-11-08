import React, { lazy } from 'react';
import Page from '../page';

const ProjectsSection = lazy(() => import('../../components/ProjectsSection'));

function ProjectsPage() {
  return (
    <Page>
      <ProjectsSection />
    </Page>
  );
}

export default ProjectsPage;
