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
  const projectsUrl = `${BASE_URL}/projects`;

  const projects = await fetch(projectsUrl, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .then(res => {
      if (res.error) {
        throw res;
      }
      return res.projects;
    });

  const personId = await fetch(peopleUrl, {
    method: 'GET',
    headers: headers(token),
  })
    .then(res => res.json())
    .then(({ people = [] }) => {
      const person = people.find(
        p => String(p.harvest_user_id) === String(harvestUserId),
      );

      if (!person) {
        throw new Error('Cannot find a Forecast person for the Harvest user.');
      }

      return person;
    })
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
    })
    .then(ass =>
      ass.map(a => {
        const project = projects.find(p => p.id === a.project_id) || {};

        return {
          ...a,
          harvest_project_id: project.harvest_id,
          project_name: project.name,
        };
      }),
    );

  const assignmentPeriodSummaryByProject = assignments.reduce((acc, a) => {
    if (!acc[a.project_id]) {
      acc[a.project_id] = {
        forecast_user_id: a.person_id,
        harvest_user_id: +harvestUserId,
        forecast_project_id: a.project_id,
        harvest_project_id: a.harvest_project_id,
        project_name: a.project_name,
        period_allocation_days: 0,
        period_allocation_hours: 0,
      };
    }
    const assStartInPeriod = moment.max(moment(start), moment(a.start_date));
    const assEndInPeriod = moment.min(moment(end), moment(a.end_date));
    const assDays = assEndInPeriod.diff(assStartInPeriod, 'days') + 1;

    acc[a.project_id].period_allocation_days += assDays;
    acc[a.project_id].period_allocation_hours +=
      (a.allocation * assDays) / 3600;

    return acc;
  }, {});

  const assignedHarvestProjectIds = Object.values(
    assignmentPeriodSummaryByProject,
  ).map(a => a.harvest_project_id);

  const timeEntries = await fetchTimeEntries(token, {
    userId: harvestUserId,
    fromDate: moment(startDate).format('YYYYMMDD'),
    toDate: moment(endDate).format('YYYYMMDD'),
  });

  const timeEntriesPeriodSummaryByProject = timeEntries.reduce((acc, entry) => {
    if (!assignedHarvestProjectIds.includes(entry.project.id)) {
      return acc;
    }

    if (!acc[entry.project.id]) {
      acc[entry.project.id] = {
        harvest_project_id: entry.project.id,
        logged_hours: 0,
      };
    }

    acc[entry.project.id].logged_hours += entry.hours;

    return acc;
  }, {});

  const timeSummary = Object.values(assignmentPeriodSummaryByProject).map(
    ass => ({
      ...ass,
      ...timeEntriesPeriodSummaryByProject[ass.harvest_project_id],
    }),
  );

  return {
    timeSummary,
    // assignmentPeriodSummary: Object.values(assignmentPeriodSummaryByProject),
    // timeEntriesPeriodSummary: Object.values(timeEntriesPeriodSummaryByProject),
    // assignments,
    // timeEntries,
  };
};

module.exports = {
  getProjectBalance,
};
