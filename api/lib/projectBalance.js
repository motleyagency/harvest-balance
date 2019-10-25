const fetch = require('node-fetch');
const moment = require('moment');
const { fetchTimeEntries } = require('./balance');

const headers = token => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
  'Forecast-Account-Id': process.env.FORECAST_ACCOUNT_ID,
});

const getProjectBalance = async (
  token,
  { startDate, endDate, harvestUserId },
) => {
  const start = moment(startDate).format('YYYY-MM-DD');
  const end = moment(endDate).format('YYYY-MM-DD');

  const BASE_URL = 'https://api.forecastapp.com';
  const peopleUrl = `${BASE_URL}/people`;

  const personId = await fetch(peopleUrl, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .then(({ people }) =>
      people.find(p => String(p.harvest_user_id) === String(harvestUserId)),
    )
    .then(person => person.id);

  const assignmentsUrl = `${BASE_URL}/assignments?start_date=${start}&end_date=${end}&person_id=${personId}`;

  const assignments = await fetch(assignmentsUrl, {
    method: 'GET',
    headers: headers(token),
  })
    .then(response => response.json())
    .then(response => {
      if (response.error) {
        throw response;
      }
      return response.assignments;
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
