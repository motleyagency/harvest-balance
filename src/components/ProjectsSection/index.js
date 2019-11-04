import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useAuth } from '../../util/auth';
import { projectBalance } from '../../util/harvestBalance';
import Section from '../Section';
import ProjectProgress from '../ProjectProgress';
import Loader from '../Loader';

const ShrinkingSection = styled(Section)`
  transition: padding 0.5s ease-out;
`;

const Breakdown = styled.div`
  ${({ showsTotal }) =>
    showsTotal
      ? `
      padding: 1em 0 0 2em
    `
      : `
      padding: 0;
    `};

  max-width: 800px;
`;

const getTotalHours = arr =>
  arr.reduce(
    (acc, curr) => ({
      totalReportedHours: acc.totalReportedHours + (curr.logged_hours || 0),
      totalHours: acc.totalHours + curr.period_allocation_hours,
    }),
    { totalReportedHours: 0, totalHours: 0 },
  );

function ProjectsSection() {
  const [data, setData] = useState({});
  const {
    user: { id: userId },
  } = useAuth();

  const handleSubmit = async (startDate, endDate) => {
    const balance = await projectBalance({
      startDate:
        startDate ||
        moment()
          .startOf('week')
          .toDate(), // '20191021',
      endDate:
        endDate ||
        moment()
          .endOf('week')
          .toDate(), // '20191025',
      harvestUserId: userId,
    });
    setData(balance);
  };

  useEffect(() => {
    // code to run on component mount
    handleSubmit();
  }, []);
  const { timeSummary } = data;

  if (!timeSummary || !timeSummary.length) {
    return <Loader />;
  }

  const { totalHours, totalReportedHours } = getTotalHours(timeSummary);

  return (
    <ShrinkingSection>
      {timeSummary.length > 1 ? (
        <ProjectProgress
          key="total"
          name="Total"
          scope={totalHours}
          progress={totalReportedHours}
        />
      ) : null}
      <Breakdown showsTotal={timeSummary.length > 1}>
        {timeSummary.map(
          ({
            logged_hours: reported,
            project_name: name,
            period_allocation_days: spread,
            period_allocation_hours: hours,
          }) => (
            <ProjectProgress
              key={name}
              name={name}
              spread={spread}
              scope={hours}
              progress={reported || 0}
            />
          ),
        )}
      </Breakdown>
    </ShrinkingSection>
  );
}

export default ProjectsSection;
