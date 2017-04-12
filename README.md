# Havest Balance

Calculate your time balance using the Harvest API.

## Installing and running

Create a `.env` file with the following information (make a copy of `.env.defaults`):

```
HARVEST_SUBDOMAIN=someValueHere
HARVEST_CLIENT_ID=someValueHere
HARVEST_SECRET=someValueHere
HARVEST_REDIRECT_URI=someValueHere
```

Then run

```
yarn
yarn start
```

## Server API

### GET /api/auth

Authorizes the user with the Harvest app.

#### Response

The response contains a client token to use as the `harvest_token` HTTP header for each subsequent
request to the API endpoints.

```
{
  harvest_token: "osdifuao8e7al34hlk3jg4mn3b..."
}
```

### GET /api/report

Gets report data for the authenticated user.

#### Request

**Headers**

* `harvest_token`: The client token obtained through `/api/auth`

**Query parameters**

* `startDate`: Mandatory date in `YYYYMMDD` format for how long back in time to calculate the balance.

#### Response

The response contains the report data.

```
{
  "fromDate": "2017-01-22T22:00:00.000Z",
  "toDate": "2017-04-12T20:48:59.274Z",
  "totalWorkingDays": 57,
  "maxWorkingHours": 427.5,
  "totalWorkedHours": 456.9199999999999,
  "balance": 29.419999999999902
}
```

## Calculation principles

The balance is calculated as `{logged working hours} - {total working hours to date}`.

Logged working hours are collected from Harvest simply by summing up all logged hours between the given start date and today's date.

Total working hours are 7.5 hours times the number of working weekdays since the start date. Working days are Monday to Friday.

