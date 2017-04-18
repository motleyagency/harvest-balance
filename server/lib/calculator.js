import moment from "moment"
import business from "moment-business"
import Promise from "bluebird"

export const getAccount = (harvestClient) => {
  const Account = harvestClient.Account
  const getAccountAsync = Promise.promisify(Account.get, { context: Account })

  return getAccountAsync({})
}

export const getReport = (harvestClient, { startDate }) => {
  const Reports = harvestClient.Reports
  const timeEntriesByUserAsync = Promise.promisify(Reports.timeEntriesByUser, { context: Reports })

  const fromDate = moment(startDate)
  const toDate = moment()
  const totalWorkingDays = business.weekDays(fromDate, toDate)
  const maxWorkingHours = totalWorkingDays * 7.5

  return getAccount(harvestClient).then((account) => {
    const userId = account.user.id

    return timeEntriesByUserAsync({
      from: fromDate.format("YYYYMMDD"),
      to: toDate.format("YYYYMMDD"),   // NOTE: to is not included
      user_id: userId,
    })
  }).then((tasks) => {
    const totalWorkedHours = tasks.reduce((sum, task) => sum + task.day_entry.hours, 0)

    const balance = totalWorkedHours - maxWorkingHours

    return {
      fromDate,
      toDate,
      totalWorkingDays,
      maxWorkingHours,
      totalWorkedHours,
      balance,
    }
  })
}

export default {
  getAccount,
  getReport,
}
