import React from "react"
import { shape } from "prop-types"
import styled from "styled-components"
import moment from "moment"

const Timeline = styled.div`
  display: flex;
  overflow-x: scroll;
  justify-content: space-between;
  max-width: 700px;
  margin: auto;
`
const Buttons = styled.div`
  text-align: center;
  margin-bottom: 15px;
`
const Button = styled.button`
  margin: 3px;
`
const DayCol = styled.div`
  display: flex;
  flex-direction: column;
`
const DayHeaderCol = styled(DayCol)`
  /*
  position: fixed;

  &:after {
    content: attr('text');
    position: relative;
  }
  */
`
const Cell = styled.div`
  white-space: nowrap;
  padding: 3px;
`
// const DayEntryCol = styled.div`
//  align-self: flex-end;
// `
// const DayEntryTaskName = styled.div`
//  padding-left: 20px;
// `

class BalanceReportDetails extends React.Component {
  constructor(props) {
    super(props)
    this.nextWeek = this.nextWeek.bind(this)
    this.prevWeek = this.prevWeek.bind(this)
    this.days = Object.keys(props.dayTotals)
    this.state = {
      week: 0, // week goes from negative weeks (in past) to 0 (current week)
    }
  }

  nextWeek() {
    this.setState(({ week: weekNow }) => ({
      week: Math.min(weekNow + 1, 0),
    }))
  }

  prevWeek() {
    this.setState(({ week: weekNow }) => ({
      week: weekNow - 1,
    }))
  }

  render() {
    const { dayTotals } = this.props
    const { week } = this.state

    const startIndex = Math.max(0, this.days.length + ((week * 7) - 7))
    const paddingDaysCount = Math.abs(this.days.length + ((week * 7) - 7))
    const endIndex = this.days.length + (week * 7)
    const weekSlice = this.days.slice(startIndex, endIndex)
    let paddingDays = []
    console.log(paddingDaysCount)

    if (startIndex === 0) {
      paddingDays = (new Array(paddingDaysCount)).fill("pad")
    }

    return (
      <div>
        <Buttons>
          <Button
            className="btn btn-sm btn-info"
            disabled={startIndex === 0}
            onClick={this.prevWeek}
          >
            Previous week
          </Button>
          <Button
            className="btn btn-sm btn-info"
            disabled={week === 0}
            onClick={this.nextWeek}
          >
            Next week
          </Button>
        </Buttons>

        <Timeline>
          <DayHeaderCol>
            <Cell><strong>Date</strong></Cell>
            <Cell><strong>Due hours</strong></Cell>
            <Cell><strong>Logged hours</strong></Cell>
            {/* <Cell>{`${balanceHours}:${balanceMinutes}`}</Cell> */}
            <Cell><strong>Day balance</strong></Cell>
            <Cell><strong>Cumulative balance</strong></Cell>
          </DayHeaderCol>
          {paddingDays.map((d, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <DayCol key={index}>
              <Cell><strong>{moment(weekSlice[0]).subtract(index + 1, "day").format("DD.MM")}</strong></Cell>
              <Cell />
              <Cell />
              <Cell />
              <Cell />
            </DayCol>
          ))}
          {weekSlice.map((day, index) => (
            // const balanceHours = Math.floor(dayTotals[day].balance)
            // const balanceMinutes =
            //   Math.round((dayTotals[day].balance % (balanceHours || 1)) * 60 * 100) / 100

            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              <DayCol>
                <Cell><strong>{moment(day).format("DD.MM")}</strong></Cell>
                <Cell>{Math.round(dayTotals[day].due_hours * 100) / 100}</Cell>
                <Cell>
                  {Math.round(dayTotals[day].logged_hours * 100) / 100}
                </Cell>
                {/* <Cell>{`${balanceHours}:${balanceMinutes}`}</Cell> */}
                <Cell>{Math.round(dayTotals[day].balance * 100) / 100}</Cell>
                <Cell>
                  {Math.round(dayTotals[day].cumulative_balance * 100) / 100}
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
          ))}
        </Timeline>
      </div>
    )
  }
}

BalanceReportDetails.propTypes = {
  dayTotals: shape({}).isRequired,
}

export default BalanceReportDetails
