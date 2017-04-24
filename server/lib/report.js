import moment from "moment"
import business from "moment-business"
import Promise from "bluebird"
import { listByKey as listProjects } from "./projects"
import { listByKey as listTasks } from "./tasks"
import { listByKey as listClients } from "./clients"
import { get as getAccount } from "./account"

require("dotenv-extended").load()

const deductibles = process.env.DEDUCTIBLE_TASKS

export const get = (harvestClient, { startDate }) => {
  const Reports = harvestClient.Reports
  const timeEntriesByUserAsync = Promise.promisify(Reports.timeEntriesByUser, { context: Reports })

  const fromDate = moment(startDate)
  const toDate = moment().add(1, "day").endOf("day")
  const totalWorkingDays = business.weekDays(fromDate, toDate)
  const maxWorkingHours = totalWorkingDays * 7.5

  return getAccount(harvestClient, {}).then((account) => {
    const userId = account.user.id

    return Promise.all([
      listClients(harvestClient, {}),
      listProjects(harvestClient, {}),
      listTasks(harvestClient, {}),
      timeEntriesByUserAsync({
        from: fromDate.format("YYYYMMDD"),
        to: toDate.format("YYYYMMDD"),   // NOTE: to is not included
        user_id: userId,
      }),
    ])
  }).then(([clients, projects, tasks, entries]) => {
    let cumulativeBalance = 0.0

    const populatedEntries = entries.map((entry) => {
      const dayEntry = entry.day_entry
      const project = projects[dayEntry.project_id]
      const client = clients[project.client_id]
      const task = tasks[dayEntry.task_id]

      if (deductibles.includes(task.task.name)) {
        cumulativeBalance -= entry.day_entry.hours
      } else {
        cumulativeBalance += entry.day_entry.hours
      }

      return {
        day_entry: {
          ...dayEntry,
          ...task,
          project: {
            ...project.project,
            ...client,
          },
          task_balance: cumulativeBalance,
        },
      }
    })

    const balance = Math.round((cumulativeBalance - maxWorkingHours) * 100) / 100
    const balanceDuration = moment.duration(balance, "hours")

    return {
      fromDate,
      toDate,
      totalWorkingDays,
      maxWorkingHours,
      cumulativeBalance,
      balance: {
        value: balance,
        hours: Math.floor(balance),
        minutes: balanceDuration.minutes(),
      },
      entries: populatedEntries,
    }
  })
}

export default {
  get,
}
