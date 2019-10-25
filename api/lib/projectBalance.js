const fetch = require('node-fetch');
const moment = require('moment');
const { fetchTimeEntries } = require('./balance');

const getProjectBalance = async (token, { startDate, endDate, personId }) => {
  const start = moment(startDate).format('YYYY-MM-DD');
  const end = moment(endDate).format('YYYY-MM-DD');

  const URL = `https://api.forecastapp.com/assignments?start_date=${start}&end_date=${end}&person_id=${personId}`;

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
