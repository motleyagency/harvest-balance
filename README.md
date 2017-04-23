# Havest Balance

Calculate your time balance using the Harvest API.

## Installing and running

Make sure you have [nodejs](https://nodejs.org/en/) and [yarn](https://yarnpkg.com) installed.

The application consists of a React/Redux frontend and a Node.js backend. You will also need to make changes to your Harvest account.

### Harvest account

You need to register this app in your company's Harvest account to allow authenticating the app over OAuth 2.0. For this webapp to run, you will need

* your company's Harvest subdomain (i.e. **youraccount**_.harvestapp.com_)
* a client ID for this app (acquired when registering this app)
* a client secret for this app (acquired when registering this app)
* a redirect URL where to redirect users after authenticating (configured when registering this app, see below)

**Note:** If you use the frontend bundled with this app, the redirect URL must be the frontend URL `http://apphost.com/oauth`. That page will handle the rest of the OAuth process.

See detailed instructions for registering the app on [Harvest's website](http://help.getharvest.com/api-v1/authentication/authentication/oauth/).

### Harvest Balance set up

Create a `.env` file with the following information from the above step (make a copy of `.env.defaults`):

```
HARVEST_SUBDOMAIN=someValueHere
HARVEST_CLIENT_ID=someValueHere
HARVEST_SECRET=someValueHere
HARVEST_REDIRECT_URI=someValueHere   # must be same as configured in harvestapp.com
```

Install dependencies by running

```
yarn
```

### Frontend

To start the frontend in production mode run

```
yarn build
yarn start-dist
```

To start the frontend in development mode (webpack-dev-server) run
```
yarn start
```

### Backend

To start the backend run

```
yarn server
```

## Server API

### GET /api/auth

Authenticates the user with `harvestapp.com`. Redirects to the `harvestapp.com` OAuth URL for authentication and authorization of this app by the user. This endpoint should be called synchronously through a normal `a` tag or `button` for example.

### GET /api/oauth-success?code=_auth\_code_

After the user has been authenticated and has authorized this app, `harvestapp.com` will redirect back to this app's `REDIRECT_URL` as configured in `harvestapp.com`. The redirect URL will be called with a query parameter `code` containing an authentication code for finalizing the authentication.

If you use the supplied frontend, that URL will be the frontend path `/oauth`, and the frontend will call this endpoint to finalize the authentication process.

If you don't use the bundled frontend, you need to call this endpoint with the auth code received from harvestapp.com. The call can be async as it will return a token to be used in all subsequent requests to the API.

#### Request

The request must be made with a `code` parameter containing the authentication code acquired from `harvestapp.com` OAuth process.

**Query parameters**

* `code`: Mandatory authentication code

#### Response

The response contains a client token to use as the `harvest_token` HTTP header for each subsequent
request to the API endpoints.

```
{
  harvest_token: "osdifuao8e7al34hlk3jg4mn3b..."
}
```

### GET /api/account

Gets the account data for the authenticated user. Essentially the same as Harvest's [/account/who_am_i](http://help.getharvest.com/api-v1/introduction/overview/who-am-i/)

#### Request

**Headers**

* `harvest_token`: The client token obtained through the auth process

#### Response

See the [Harvest API](http://help.getharvest.com/api-v1/introduction/overview/who-am-i/)

### GET /api/report

Gets report data for the authenticated user.

#### Request

**Headers**

* `harvest_token`: The client token obtained through the auth process

**Query parameters**

* `startDate`: Mandatory date in `YYYYMMDD` format. Logged working hours will be calculated from the start of this date.

#### Response

The response contains the report data.

```
{
  "fromDate": "2017-01-22T22:00:00.000Z",
  "toDate": "2017-04-12T20:48:59.274Z",
  "totalWorkingDays": 57,
  "maxWorkingHours": 427.5,
  "totalWorkedHours": 456.9199999999999,
  "balance": {
    "value": 29.42,
    "hours": 29,
    "minutes": "25"
  }
}
```

## Calculation principles

The balance is calculated as `{logged working hours} - {total working hours to date}`.

Logged working hours are collected from Harvest simply by summing up all logged hours between the given start date and today's date.

Total working hours are 7.5 hours times the number of working weekdays since the start date. Working days are Monday to Friday.

