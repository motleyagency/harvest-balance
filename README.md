# Havest Balance

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

The information you need to to run this app is

- your company's Harvest subdomain (i.e. **youraccount**_.harvestapp.com_)
- your company's Harvest id (visible in the browser's status bar when hovering over your account at [the accounts page](https://id.getharvest.com/accounts))
- a client ID for this app (acquired when registering this app)
- a client secret for this app (acquired when registering this app)
- a redirect URL defining where to redirect users after authenticating (configured when registering this app, see below)

The redirect URL is the exact path where `harvestapp.com` should redirect after authentication. Set this to the URL where the app will run, e.g. `https://harvestbalance.mycompany.com/`.

See detailed instructions for registering the app on [Harvest's website](https://help.getharvest.com/api-v2/authentication-api/authentication/authentication/#oauth2-application).

### App set up

Create a `.env` file with the following information from the above step (make a copy of `.env.template`):

```
HARVEST_SUBDOMAIN=yourSubdomain
HARVEST_ACCOUNT_ID=1234567
HARVEST_CLIENT_ID=yourClientId
HARVEST_SECRET=yourClientSecret
DEDUCTIBLE_TASKS=[1537475]
```

The `DEDUCTIBLE_TASKS` is an array of task ids of the tasks that should be deducted from the cumulative balance. I.e. if the id for "Overtime holiday" is specified, all logged "Overtime holiday" hours will subtract from the balance instead of adding to it.

Refer to the documentation of your hosting service of choice for information on how to set the environment variables for the deployed app.

## Building and running

To deploy this app to Zeit Now, first install the [Now CLI](https://zeit.co/download). Then you need to add the above environment variables as [secrets](https://zeit.co/docs/v2/serverless-functions/env-and-secrets/). Finally run `now` to build and deploy.

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

### GET /api/report

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

## Development

To start the frontend in development mode, clone the repository and run

```
npm install
npm start
```

If you have the [Now CLI](https://zeit.co/download) installed, you can start the full stack development environment with `now dev`.

## License

[ISC License (ISC)](LICENSE)
