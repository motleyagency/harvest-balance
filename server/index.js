require('dotenv-extended').load();
const Harvest = require('harvest');
const _ = require('lodash');
const moment = require('moment');
const business = require('moment-business');
require('twix');

const round = number => parseFloat(Math.round(number * 100) / 100).toFixed(2);

const midweekHolidays = [
  '20170101',
  '20170106',
  '20170414',
  '20170417',
  '20170501',
  '20170525',
  '20170624',
  '20171206',
  '20170124',
  '20171225',
  '20171226'
]

const harvest = new Harvest({
  subdomain: process.env.HARVEST_SUBDOMAIN,
  email: process.env.HARVEST_EMAIL,
  password: process.env.HARVEST_PASSWORD
});
const TimeTracking = harvest.TimeTracking;
const Reports = harvest.Reports;

const fromDate = moment(process.env.START_DATE);
const toDate = moment();
let totalWorkingDays = business.weekDays(fromDate, toDate);
const range = fromDate.twix(toDate);

midweekHolidays.forEach(holiday => {
  if (range.contains(holiday) && business.isWeekDay(moment(holiday))) {
    totalWorkingDays -= 1;
  }
})
const maxWorkingHours = totalWorkingDays * 7.5;

Reports.timeEntriesByUser({
  from: fromDate.format('YYYYMMDD'),
  to: toDate.format('YYYYMMDD'),   // NOTE: to is not included
  user_id: process.env.HARVEST_USERID
}, function(err, tasks) {
  if (err) throw new Error(err);
  // console.log(tasks);

  const totalHours = tasks.reduce((sum, task) => {
    return sum + task.day_entry.hours;
  }, 0);

  const balance = totalHours - maxWorkingHours;

  const report = `
    ${totalWorkingDays} working days between ${fromDate.format('YYYY-MM-DD')} to ${toDate.format('YYYY-MM-DD')}.
    7.5 hours per day equals ${maxWorkingHours} working hours in total.
    You have ${round(totalHours)} accumulated hours.
    Your balance: ${round(balance)} hours.
  `

  console.log(report);
  // console.log(totalHours, totalWorkingDays, balance);

});
