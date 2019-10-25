import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../util/auth';
import { projectBalance } from '../../util/harvestBalance';
import Section from '../Section';
import ProjectProgress from '../ProjectProgress';

const ShrinkingSection = styled(Section)`
  transition: padding 0.5s ease-out;
`;

const Breakdown = styled.div`
  padding: 1em 0 0 2em;
  max-width: 800px;
`;

const getSum = arr => arr.reduce((sum, acc) => sum + Object.values(acc)[0], 0);

function ProjectsSection() {
  const [data, setData] = useState({});
  const auth = useAuth();
  console.log(data);

  const handleSubmit = async (startDate, endDate) => {
    const balance = await projectBalance({
      startDate: '20191021',
      endDate: '20191025',
      personId: '228208', //this is freddes' user id, should be dynamic
    });
    setData(balance);
  };

  const toBeDone = ((data && data.assignments) || []).map(
    ({ allocation, project_id: projId }) => ({
      [`${projId}`]: allocation / 360,
    }),
  );
  const beenDone = ((data && data.timeEntries) || []).map(asd =>
    console.log('---', asd),
  );

  return (
    <ShrinkingSection>
      <button type="button" onClick={() => handleSubmit()}>
        Click me
      </button>

      <ProjectProgress
        name="Total"
        scope={getSum(toBeDone)}
        progress={getSum(beenDone)}
      />
      <Breakdown>
        {toBeDone.map(project => {
          const projectName = Object.keys(project)[0];
          return (
            <ProjectProgress
              name={projectName}
              scope={project[projectName]}
              progress={beenDone[projectName] || 0}
            />
          );
        })}
      </Breakdown>
    </ShrinkingSection>
  );
}

export default ProjectsSection;
