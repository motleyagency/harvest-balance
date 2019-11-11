import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useAuth } from '../../util/auth';
import { projectBalance } from '../../util/harvestBalance';
import ProjectProgress from '../ProjectProgress';
import Loader from '../Loader';

const StyledLoader = styled(Loader)``;

const Breakdown = styled.div``;

const TotalProjectProgress = styled(ProjectProgress)`
  margin-bottom: 1.5em;
  padding-bottom: 1em;
  // border-bottom: 1px solid rgba(0,0,0, .1);
  font-size: 80%;
`;

const Container = styled.div(
  ({ isLoading }) => `
  padding: 1em 0;

  ${
    isLoading
      ? `
    position: relative;

    ${TotalProjectProgress},
    ${Breakdown} {
      opacity: .6;
    }

    ${StyledLoader} {
      position: absolute;
      left: 0;
      right: 0;
      z-index: 5;
      top: 26%;
    }
    `
      : ''
  }

  @media (min-width: 640px) {
    padding: 3rem 1.5rem;
  }
`,
);

const Date = styled.time`
  color: rgba(33, 33, 33, 0.8);
  display: inline-block;
  margin-bottom: 0.5em;
`;

const ProjectHeader = styled.div`
  text-align: center;
  font-size: 0.8em;
`;

const Controls = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 320px;
  margin: 0 auto 0.5em;
  border: 1px solid rgba(0, 0, 0, 0.175);
  border-radius: 2px;
`;

const WeekController = styled.button.attrs({ type: 'button' })`
  padding: 0.75em 0.5em;
  background: #e2e2e2;
  border: 0;
  outline: none;
  flex: 1 1 auto;
  display: block;
  font-size: 1em;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.125s ease-in;

  &:not(:first-of-type) {
    border-left: 1px solid rgba(0, 0, 0, 0.15);
  }
  &:not(:first-of-type):not(:last-of-type):not(:hover):not(:active),
  &:not(:first-of-type):not(:last-of-type):disabled {
    background: #ececec;
  }

  &:disabled {
    cursor: default;
  }

  &:hover:not(:disabled),
  &:active:not(:disabled) {
    background: #ccc;
    transition-timing-function: ease-out;
  }
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
  const [dateString, setDateString] = useState('');
  const [weekModifier, setWeek] = useState(0);
  const [isLoading, setLoading] = useState(false);
  const {
    user: { id: userId },
  } = useAuth();

  const handleSubmit = async reqWeek => {
    setLoading(true);
    let startDate = moment(),
      endDate = moment();
    const subsMod = reqWeek ? weekModifier + reqWeek : 0;

    if (reqWeek && subsMod) {
      if (reqWeek > 0) {
        startDate = startDate.add(subsMod, 'weeks');
        endDate = endDate.add(subsMod, 'weeks');
      } else {
        startDate = startDate.subtract(Math.abs(subsMod), 'weeks');
        endDate = endDate.subtract(Math.abs(subsMod), 'weeks');
      }
    }

    startDate = startDate.startOf('week');
    endDate = endDate.endOf('week');

    if (subsMod !== weekModifier) {
      setWeek(subsMod);
    }
    setDateString(
      [startDate, endDate]
        .map((day, i) => {
          if (!i) {
            return day.format('D.M');
          }
          return `${day.format('D.M.YYYY')} (week ${day.format('w')})`;
        })
        .join(' - '),
    );

    const balance = await projectBalance({
      startDate: startDate.format('YYYYMMDD'),
      endDate: endDate.format('YYYYMMDD'),
      harvestUserId: userId,
    });
    setLoading(false);
    setData(balance);
  };

  useEffect(() => {
    // code to run on component mount
    handleSubmit();
  }, []);
  const { timeSummary } = data;
  const hasData = timeSummary && timeSummary.length;

  const controlsAndDate = (
    <ProjectHeader>
      <Date>{dateString}</Date>
      <Controls>
        <WeekController
          onClick={() => {
            handleSubmit(-1);
          }}
        >
          Previous week
        </WeekController>
        <WeekController
          onClick={() => {
            handleSubmit(0);
          }}
          disabled={!weekModifier}
        >
          This week
        </WeekController>
        <WeekController
          onClick={() => {
            handleSubmit(1);
          }}
        >
          Next week
        </WeekController>
      </Controls>
    </ProjectHeader>
  );

  // if () {
  //   return (
  //     <ProjectsContainer>
  //       {controlsAndDate}
  //       <Loader />
  //     </ProjectsContainer>
  //   );
  // }

  const { totalHours, totalReportedHours } = hasData
    ? getTotalHours(timeSummary)
    : {};

  return (
    <Container isLoading={isLoading}>
      {controlsAndDate}
      {isLoading || !hasData ? <StyledLoader /> : null}
      {hasData && timeSummary.length > 1 ? (
        <TotalProjectProgress
          key="total"
          name="Total"
          scope={totalHours}
          progress={totalReportedHours}
        />
      ) : null}
      {hasData && (
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
      )}
    </Container>
  );
}

export default ProjectsSection;
