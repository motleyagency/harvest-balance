const fetch = require('node-fetch');
const moment = require('moment');
const { fetchTimeEntries } = require('./balance');

const getProjectBalance = async (token, { startDate, endDate }) => {
  const URL =
    'https://api.forecastapp.com/assignments?start_date=2019-10-21&end_date=2019-10-25&person_id=228208';

  const assignments = await fetch(URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'Forecast-Account-Id': process.env.FORECAST_ACCOUNT_ID,
    },
  })
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        throw response;
      }
      return response;
    });

  const timeEntries = await fetchTimeEntries(token, {
    fromDate: moment(startDate).format('YYYYMMDD'),
    toDate: moment(endDate).format('YYYYMMDD'),
  });

  return {
    assignments,
    timeEntries,
  };
};

module.exports = {
  getProjectBalance,
};
