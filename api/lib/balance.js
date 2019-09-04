const moment = require('moment');
const fetch = require('node-fetch');
const groupBy = require('lodash.groupby');
require('twix');

const deductibles = process.env.DEDUCTIBLE_TASKS;
const hoursPerDay = process.env.HOURS_PER_DAY || 7.5;

const isWeekend = dayNumber => [0, 6].includes(dayNumber);

// recursively fetches all pages of time entries from harvest for the current user
const fetchTimeEntries = (token, { fromDate, toDate }, url) => {
  const currentUrl =
    url ||
    `https://api.harvestapp.com/v2/time_entries?from=${fromDate}&to=${toDate}`;

  return fetch(currentUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Harvest-Account-Id': process.env.HARVEST_ACCOUNT_ID,
      'User-Agent': 'Harvest Balance (fredrik.bostrom@motley.fi)',
    },
  })
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        throw response;
      }
      return response;
    })
    .then(({ time_entries: timeEntries, links: { next } }) => {
      if (next) {
        return fetchTimeEntries(token, { fromDate, toDate }, next).then(
          nextEntries => timeEntries.concat(nextEntries),
        );
      }
      return timeEntries;
    });
};

// for each day, get
// * due hours for that day (normally 7.5)
// * logged hours per task
// * sum of all logged hours
// * balance for that day (due hours - logged hours)
// * cumulative balance from start of year

const getBalance = (token, { startDate, includeToday }) => {
  const fromDate = moment(startDate);
  const toDate = moment()
    .subtract(includeToday ? 0 : 1, 'day')
    .endOf('day');
  const endOfWeek = moment(toDate).endOf('isoweek'); // Sunday as last day of week

  return fetchTimeEntries(token, {
    fromDate: fromDate.format('YYYYMMDD'),
    toDate: toDate.format('YYYYMMDD'),
  })
    .then(timeEntries =>
      // first group the time entries array into an object
      // keyed by the spent date so we don't have to loop
      // the whole array for each day in the requested time range
      groupBy(timeEntries, 'spent_date'),
    )
    .then(timeEntries => {
      // our master cumulative balance, this is what we want to calculate
      let cumulativeBalance = 0.0;

      // * iterate all days between start date and end date
      // * set start balance for that day (weekday vs holiday or future)
      // * for each day, get all timeEntries spent on that day
      // * for each entry, get the tasks and their individual logged hours
      // * if no entry for given day, leave balance at start balance

      const report = moment(startDate)
        .twix(endOfWeek)
        .toArray('days')
        .reduce((dayReports, day) => {
          const currentDate = day.format('YYYY-MM-DD');

          // we're starting a new day, init the day balance (negative due hours)
          const weekday = day.day();
          const isFuture = day > toDate;
          const dueHours = isWeekend(weekday) || isFuture ? 0 : hoursPerDay;

          const dayReport = {
            isFuture,
            weekday,
            dueHours,
            loggedHours: 0,
            // init balance as -hoursPerDay for weekdays, not for Sat & Sun
            balance: -dueHours,
            dayEntries: [],
          };

          // Grab timeEntries from the harvest result for
          // this date (there might or might not be any)
          // and populate them with calculated values
          dayReport.dayEntries = (timeEntries[currentDate] || []).map(
            timeEntry => {
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
              if (deductibles.includes(timeEntry.task.id)) {
                // reduce the logged hours from cumulative hours
                dayReport.loggedHours -= timeEntry.hours;
                // deductible days leave the day balance at -hoursPerDay,
                // regardless of logged hours, is that correct...?
              } else {
                dayReport.loggedHours += timeEntry.hours;
                dayReport.balance += timeEntry.hours;
              }

              const { hours, notes, client, project, task } = timeEntry;

              // only return the bare minimum to reduce payload size
              return {
                hours,
                notes,
                client: {
                  name: client.name,
                },
                project: {
                  name: project.name,
                },
                task: {
                  name: task.name,
                },
              };
            },
          );

          cumulativeBalance += dayReport.balance;
          dayReport.cumulativeBalance = cumulativeBalance;

          return {
            ...dayReports,
            [currentDate]: dayReport,
          };
        }, {});

      const balance = Math.round(cumulativeBalance * 100) / 100;
      const balanceDuration = moment.duration(balance, 'hours');

      return {
        start: fromDate,
        end: endOfWeek,
        balance: {
          value: balance,
          hours: Math.floor(balance),
          minutes: balanceDuration.minutes(),
        },
        dayTotals: report,
      };
    });
};

module.exports = {
  getBalance,
};
