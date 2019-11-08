import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { useAuth } from '../../util/auth';
import { projectBalance } from '../../util/harvestBalance';
import ProjectProgress from '../ProjectProgress';
import Loader from '../Loader';

const Container = styled.div`
  padding: 1em 0;

  @media (min-width: 640px) {
    padding: 3rem 1.5rem;
  }
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
  width: 50%;
  outline: none;
  display: block;
  font-size: 1em;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.125s ease-in;

  &:last-of-type {
    border-left: 1px solid rgba(0, 0, 0, 0.15);
  }

  &:hover,
  &:active {
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
      console.log(startDate, endDate);
    }

    startDate = startDate.startOf('week').toDate();
    endDate = endDate.endOf('week').toDate();

    if (subsMod !== weekModifier) {
      setWeek(subsMod);
    }
    setDateString(
      [startDate, endDate]
        .map((d, i) => {
          const day = moment(d);
          if (!i) {
            return day.format('D.M');
          }
          return `${day.format('D.M.YYYY')} (week ${day.format('w')})`;
        })
        .join(' - '),
    );

    const balance = await projectBalance({
      startDate,
      endDate,
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
            handleSubmit(1);
          }}
        >
          Next week
        </WeekController>
      </Controls>
    </ProjectHeader>
  );

  if (!timeSummary || !timeSummary.length || isLoading) {
    return (
      <Container>
        {controlsAndDate}
        <Loader />
      </Container>
    );
  }

  const { totalHours, totalReportedHours } = getTotalHours(timeSummary);

  return (
    <Container>
      {controlsAndDate}
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
    </Container>
  );
}

export default ProjectsSection;
