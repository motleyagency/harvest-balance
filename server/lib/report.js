import moment from "moment"
import "twix"
import Promise from "bluebird"
import { listByKey as listProjects } from "./projects"
import { listByKey as listTasks } from "./tasks"
import { listByKey as listClients } from "./clients"
import { get as getAccount } from "./account"

require("dotenv-extended").load()

const deductibles = process.env.DEDUCTIBLE_TASKS
const hoursPerDay = process.env.HOURS_PER_DAY || 7.5
const isWeekend = dayNumber => [0, 6].includes(dayNumber)

// for each day, get
// * due hours for that day (normally 7.5)
// * logged hours per task
// * sum of all logged hours
// * balance for that day (due hours - logged hours)
// * cumulative balance from start of year

export const get = (harvestClient, { startDate }) => {
  const Reports = harvestClient.Reports
  const timeEntriesByUserAsync = Promise.promisify(Reports.timeEntriesByUser, { context: Reports })

  const fromDate = moment.utc(startDate)
  const today = moment().endOf("day")
  const toDate = moment().utc().endOf("isoweek") // Sunday as last day of week

  return getAccount(harvestClient, {}).then((account) => {
    const userId = account.user.id

    return Promise.all([
      listClients(harvestClient, {}),
      listProjects(harvestClient, {}),
      listTasks(harvestClient, {}),
      timeEntriesByUserAsync({
        from: fromDate.format("YYYYMMDD"),
        // NOTE: to is not included, so we need to add
        // an extra day to the harvest query
        to: moment.utc(toDate).add(1, "day").format("YYYYMMDD"),
        user_id: userId,
      }),
    ])
  }).then(([clients, projects, tasks, entries]) => {
    let cumulativeBalance = 0.0
    const dayTotals = {}

    // * iterate all days between start date and end date
    // * set start balance for that day (weekday vs holiday or future)
    // * for each day, find all entries spent on that day
    // * for each entry, get the tasks and their individual logged hours
    // * if no entry for given day, leave balance at start balance

    // const populatedEntries = entries.map(({ day_entry: dayEntry }) => {
    moment(startDate).twix(toDate).toArray("days").forEach((day) => {
      const dayDate = day.format("YYYY-MM-DD")

      // we're starting a new day, init the day balance (negative due hours)
      const weekday = day.day()
      const future = day > today
      const dueHours = (isWeekend(weekday) || future) ? 0 : hoursPerDay

      dayTotals[dayDate] = {
        future,
        weekday,
        due_hours: dueHours,
        logged_hours: 0,
        // init balance as -hoursPerDay for weekdays, not for Sat & Sun
        balance: -dueHours,
        day_entries: [],
      }

      // Grab entries from harvest for this date (there might or might not be any)
      // and populate them with calculated values
      dayTotals[dayDate].day_entries = entries
      .filter(({ day_entry }) => day_entry.spent_at === dayDate)
      .map(({ day_entry: dayEntry }) => {
        const project = projects[dayEntry.project_id]
        const client = clients[project.project.client_id]
        const task = tasks[dayEntry.task_id]

        // deductible tasks reduce the logged time from the
        // total balance instead of adding to it
        //
        // ex:
        // startbalance -7.5
        // overtime holiday 7.5
        // balance: -7.5
        //
        // ex 2:
        // startbalance -7.5
        // overtime holiday 7.5
        // some task 2.5
        // balance: -5
        if (deductibles.includes(task.task.name)) {
          // reduce the logged hours from cumulative hours
          dayTotals[dayDate].logged_hours -= dayEntry.hours
          // deductible days leave the day balance at -hoursPerDay,
          // regardless of logged hours, is that correct...?
        } else {
          dayTotals[dayDate].logged_hours += dayEntry.hours
          dayTotals[dayDate].balance += dayEntry.hours
        }

        return {
          ...dayEntry,
          ...task,
          project: {
            ...project.project,
            ...client,
          },
        }
      })

      cumulativeBalance += dayTotals[dayDate].balance
      dayTotals[dayDate].cumulative_balance = cumulativeBalance
    })

    const balance = Math.round(cumulativeBalance * 100) / 100
    const balanceDuration = moment.duration(balance, "hours")

    return {
      fromDate,
      toDate,
      balance: {
        value: balance,
        hours: Math.floor(balance),
        minutes: balanceDuration.minutes(),
      },
      dayTotals,
    }
  })
}

export default {
  get,
}
