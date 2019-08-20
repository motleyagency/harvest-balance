import React, { Fragment, useState } from 'react';
import { shape } from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import SectionButton from '../SectionButton';

const Timeline = styled.div`
  display: flex;
  overflow-x: scroll;
  justify-content: space-between;
  max-width: 800px;
  min-width: 800px;
  margin: auto;
`;
const Buttons = styled.div`
  text-align: center;
  margin-bottom: 15px;
`;
const Button = styled(SectionButton)`
  margin: 0.2rem;
`;

const DayCol = styled.div`
  display: flex;
  flex-direction: column;
`;
const DayHeaderCol = styled(DayCol)`
  /*
  position: fixed;

  &:after {
    content: attr('text');
    position: relative;
  }
  */
`;
const Cell = styled.div`
  white-space: nowrap;
  padding: 3px;
`;
// const DayEntryCol = styled.div`
//  align-self: flex-end;
// `
// const DayEntryTaskName = styled.div`
//  padding-left: 20px;
// `

const YearMonthCell = ({ dayMoment }) => (
  <Cell>
    <strong
      dangerouslySetInnerHTML={{
        __html:
          dayMoment.date() === 1 || dayMoment.day() === 1
            ? dayMoment.format('MMM YYYY')
            : '&nbsp;',
      }}
    />
  </Cell>
);

function BalanceReportDetails({ dayTotals }) {
  const [week, setWeek] = useState(0);

  const nextWeek = e => {
    e.preventDefault();
    setWeek(weekNow => Math.min(weekNow + 1, 0));
  };

  const prevWeek = e => {
    e.preventDefault();
    setWeek(weekNow => Math.min(weekNow - 1, 0));
  };

  const days = Object.keys(dayTotals);
  const startIndex = Math.max(0, days.length + (week * 7 - 7));
  const paddingDaysCount = Math.abs(days.length + (week * 7 - 7));
  const endIndex = days.length + week * 7;
  const weekSlice = days.slice(startIndex, endIndex);
  let paddingDays = [];

  if (startIndex === 0) {
    paddingDays = new Array(paddingDaysCount).fill('pad');
  }

  return (
    <Fragment>
      <Buttons>
        <Button
          parentColor="info"
          size="small"
          disabled={startIndex === 0}
          onClick={prevWeek}
        >
          Previous week
        </Button>
        <Button
          parentColor="info"
          size="small"
          disabled={week === 0}
          onClick={nextWeek}
        >
          Next week
        </Button>
      </Buttons>

      <Timeline>
        <DayHeaderCol>
          <Cell>
            <strong>Year & month</strong>
          </Cell>
          <Cell>
            <strong>Date</strong>
          </Cell>
          <Cell>
            <strong>Due hours</strong>
          </Cell>
          <Cell>
            <strong>Logged hours</strong>
          </Cell>
          {/* <Cell>{`${balanceHours}:${balanceMinutes}`}</Cell> */}
          <Cell>
            <strong>Day balance</strong>
          </Cell>
          <Cell>
            <strong>Cumulative balance</strong>
          </Cell>
        </DayHeaderCol>
        {paddingDays.map((d, index) => {
          const dayMoment = moment(d);
          return (
            // eslint-disable-next-line react/no-array-index-key
            <DayCol key={index}>
              <YearMonthCell dayMoment={dayMoment} />
              <Cell>
                <strong>
                  {moment(weekSlice[0])
                    .subtract(index + 1, 'day')
                    .format('dd DD')}
                </strong>
              </Cell>
              <Cell />
              <Cell />
              <Cell />
              <Cell />
            </DayCol>
          );
        })}
        {weekSlice.map((day, index) => {
          const dayMoment = moment(day);
          return (
            // const balanceHours = Math.floor(dayTotals[day].balance)
            // const balanceMinutes =
            //   Math.round((dayTotals[day].balance % (balanceHours || 1)) * 60 * 100) / 100

            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              <DayCol>
                <YearMonthCell dayMoment={dayMoment} />
                <Cell>
                  <strong>{dayMoment.format('dd DD')}</strong>
                </Cell>
                <Cell>{Math.round(dayTotals[day].dueHours * 100) / 100}</Cell>
                <Cell>
                  {Math.round(dayTotals[day].loggedHours * 100) / 100}
                </Cell>
                {/* <Cell>{`${balanceHours}:${balanceMinutes}`}</Cell> */}
                <Cell>{Math.round(dayTotals[day].balance * 100) / 100}</Cell>
                <Cell>
                  {Math.round(dayTotals[day].cumulativeBalance * 100) / 100}
                </Cell>
              </DayCol>
              {/*
                            dayTotals[day].day_entries.map((entry, index2) => (
                              // eslint-disable-next-line react/no-array-index-key
                              <Row key={index2}>
                                <DayEntryCol>
                                  <DayEntryTaskName>
                                    {entry.project.name} - {entry.task.name}<br />
                                    {
                                      entry.notes &&
                                      (<i>{entry.notes}</i>)
                                    }
                                  </DayEntryTaskName>
                                </DayEntryCol>
                                <DayEntryCol>{entry.hours}</DayEntryCol>
                                <DayEntryCol>{entry.cumulative_hours}</DayEntryCol>
                              </Row>
                            ))
                          */}
            </div>
          );
        })}
      </Timeline>
    </Fragment>
  );
}

BalanceReportDetails.propTypes = {
  dayTotals: shape({}).isRequired,
};

export default BalanceReportDetails;
