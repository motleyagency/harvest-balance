# Harvest Balance

Calculate your time balance using the Harvest API.

The app consists of a React frontend (built with create-react-app) and a handful of lambda functions for Harvest API calls.

## Calculation principles

The balance is calculated as `{logged working hours} - {logged deductible hours} - {total working hours to date}`.

Logged working hours are collected from Harvest simply by summing up all logged (non-deductible) hours between the given start date and today's date.

Deductible hours are hours from tasks that are included in the `DEDUCTIBLE_TASKS` environment variable (see below).

Total working hours are 7.5 hours times the number of working weekdays since the start date. Working days are Monday to Friday.

## Setup

You need to set up an API client in Harvest and configure your environment variables for the lambdas.

### Harvest account set up

You need to [register this app](https://id.getharvest.com/developers) as an Oauth2 client in your company's Harvest account to allow authenticating the app.

Enter the following information in the application registration:

- Name: Harvest Balance (or whatever you want to call this service)
- Redirect URL: the URL where this service will be deployed (for development, enter `http://localhost:3000`)
- Origin URL: same as the redirect URL
- Multi account: select "I can work with multiple accounts"
- Products: select "I want access to Harvest and Forecast"

See detailed instructions for registering the app on [Harvest's website](https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/#oauth2-application).

### App set up

The information you need to to run this app is

- Your company's Harvest subdomain (i.e. **youraccount**_.harvestapp.com_)
- Your company's Harvest id (visible in the browser's status bar when hovering over your account at [the accounts page](https://id.getharvest.com/accounts))
- The Harvest client ID for this app (acquired when registering this app)
- The Harvest client secret for this app (acquired when registering this app)
- Your company's Forecast account id (visible in the URL when logging in to [Forecast](https://forecastapp.com/))
- A list of deductible Harvest task ids (see below)

The deductible task list is an array of Harvest task ids of the tasks that should be deducted from the cumulative balance. I.e. if the id for "Overtime holiday" is specified, all logged "Overtime holiday" hours will subtract from the balance instead of adding to it.

Create a `.env` file at the root of the project with the following information from the above step (use `.env.template` as template):

```
HARVEST_SUBDOMAIN=yourSubdomain
HARVEST_ACCOUNT_ID=1234567
HARVEST_CLIENT_ID=yourClientId
HARVEST_SECRET=yourClientSecret
DEDUCTIBLE_TASKS=[1537475]
FORECAST_ACCOUNT_ID=yourForecastAccountId
```

Refer to the documentation of your hosting service of choice for information on how to set the environment variables for the deployed app.

## Development

To start the frontend in development mode, clone the repository and run

```
npm install
npm start
```

The frontend, however, requires the backend functions to work properly. If you have the [Now CLI](https://zeit.co/download) installed, you can start the full stack development environment with

```
now dev
```

> **NOTE:** For now you need to stay at version 16 of the Now CLI, since version 17 introduces project linking which forces a deploy when setting up the project. We don't want to deploy only to set up a development environment, so stay at version 16!

## Building and deploying

To deploy this app to Zeit Now, follow these steps:

- Install the [Now CLI](https://zeit.co/download)
- Add the above environment variables in lowercase as [secrets](https://zeit.co/docs/v2/serverless-functions/env-and-secrets/).<br/>
  For example `now secrets add harvest_subdomain -- yourSubdomain`
- Run `now` to build and deploy

For other service providers, refer to their specific documentation.

## Server API

The backend only consists of a handful of lambda functions that are set up to easily deploy to Zeit Now.

### GET /api/auth

Returns an authentication URL for authenting the user with `harvestapp.com`. The client should redirect the user to the URL to initiate the authentication process.

#### Response

```
{
  "url": "https://myaccount.harvestapp.com/...."
}
```

### GET /api/auth/success?code=_auth_code_

After the user has been authenticated and has authorized this app, `harvestapp.com` will redirect back to this app's `REDIRECT_URL` as configured in the developer section in Harvest. The redirect URL will be called with a query parameter `code` containing an authentication code for finalizing the authentication.

#### Request

The request must be made with a `code` parameter containing the authentication code acquired from `harvestapp.com` OAuth process.

**Query parameters**

- `code`: Mandatory authentication code

#### Response

The response contains a client token to use as the `harvest_token` HTTP header for each subsequent
request to the API endpoints.

```
{
  harvest_token: "osdifuao8e7al34hlk3jg4mn3b..."
}
```

### GET /api/account

Gets the account data for the authenticated user. Essentially the same as Harvest's [/v2/users/me](https://help.getharvest.com/api-v2/users-api/users/users/#retrieve-the-currently-authenticated-user)

#### Request

**Headers**

- `harvest_token`: The client token obtained through the auth process

#### Response

See the [Harvest API](https://help.getharvest.com/api-v2/users-api/users/users/#retrieve-the-currently-authenticated-user)

### GET /api/balance

Gets report data for the authenticated user.

#### Request

**Headers**

- `harvest_token`: The client token obtained through the auth process

**Query parameters**

- `startDate`: Mandatory date in `YYYYMMDD` format. Logged working hours will be calculated from the start of this date.
- `includeToday`: Set to literal 'true' to include the currently logged hours for this day in the caluclations.

#### Response

The response contains the report data.

```
{
  "start": "2019-01-01T00:00:00.000Z",
  "end": "2019-06-06T23:59:59.999Z",
  "balance": {
    "value": 4.05,
    "hours": 4,
    "minutes": 3
  },
  "dayTotals": {
    "2017-01-01": {
      "isFuture": false,
      "weekday": 1,
      "dueHours": 7.5,
      "loggedHours": 7.5,
      "balance": 0,
      "cumulativeBalance": 0,
      "dayEntries": [{
        "hours": 2,
        "notes": "Working hard...",
        "client": {
          "name": "ACME Inc"
        },
        "project": {
          "name": "Fancy stuff"
        },
        "task": {
          "name": "Development"
        }
      }
      // ... more entries for the same day here
      ]
      // ... more days here
    }
  }
}
```

### GET /api/project-balance

Gets report data per Forecast project for the authenticated user.

#### Request

**Headers**

- `harvest_token`: The client token obtained through the auth process

**Query parameters**

- `startDate`: Mandatory date in `YYYYMMDD` format
- `endDate`: Mandatory date in `YYYYMMDD` format
- `harvestUserId`: the user ID of the currently logged in user (needed for mapping Forecast users to Harvest users)

#### Response

The response contains the Forecast allocation hours for the queried period and the logged hours on those projects, one object per scheduled project in Forecast.

```
{
  "timeSummary": [
    {
      "forecast_user_id": 123123,
      "harvest_user_id": 321321,
      "forecast_project_id": 112233,
      "harvest_project_id": 332211,
      "project_name": "Project A",
      "period_allocation_days": 6,
      "period_allocation_hours": 45,
      "logged_hours": 52.28999999999999
    },
    {
      "forecast_user_id": 313131,
      "harvest_user_id": 131313,
      "forecast_project_id": 553311,
      "harvest_project_id": 115533,
      "project_name": "Project B",
      "period_allocation_days": 2,
      "period_allocation_hours": 15,
      "logged_hours": 5.49
    }
  ]
}
```

## License

[ISC License (ISC)](LICENSE)
