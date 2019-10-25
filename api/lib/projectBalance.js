const ForecastApi = require('forecast-promise');
const moment = require('moment');
const { fetchTimeEntries } = require('./balance');

const getProjectBalance = async (token, startDate, endDate) => {
  const forecast = new ForecastApi({
    accountId: process.env.FORECAST_ACCOUNT_ID,
    token,
  });

  const assignments = await forecast.assignments({
    startDate: moment(startDate),
    endDate: moment(endDate),
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
