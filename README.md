# Havest Balance

Calculate your time balance using the Harvest API.

## Calculation principles

The balance is calculated as `{logged working hours} - {logged deductible hours} - {total working hours to date}`.

Logged working hours are collected from Harvest simply by summing up all logged (non-deductible) hours between the given start date and today's date.

Deductible hours are hours from tasks that are included in the `DEDUCTIBLE_TASKS` environment variable (see below).

Total working hours are 7.5 hours times the number of working weekdays since the start date. Working days are Monday to Friday.

## Setup

The preferred way of running the app in production is using Docker. Before you can run the app, however, you need to configure your `harvestapp.com` account to allow the app to read data. The next sections describes how to set up the app for running in production mode.

### Harvest account set up

You need to register this app in your company's Harvest account to allow authenticating the app over OAuth 2.0. For this app to run, you will need

* your company's Harvest subdomain (i.e. **youraccount**_.harvestapp.com_)
* a client ID for this app (acquired when registering this app)
* a client secret for this app (acquired when registering this app)
* a redirect URL defining where to redirect users after authenticating (configured when registering this app, see below)

**Note:** When running this app in Docker, it's enough to configure the redirect URL as the host where the app is running, e.g. `https://harvestbalance.mycompany.com`. For finer granularity you may add `/oauth` to the end of the URL, as this is the path where the app accepts redirects.

See detailed instructions for registering the app on [Harvest's website](http://help.getharvest.com/api-v1/authentication/authentication/oauth/).

### App set up

Create a `.env` file with the following information from the above step (make a copy of `.env.defaults`):

```
HARVEST_SUBDOMAIN=yourSubdomain
HARVEST_CLIENT_ID=yourClientId
HARVEST_SECRET=yourClientSecret
HARVEST_REDIRECT_URI=someValueHere   # see below
DEDUCTIBLE_TASKS=['Overtime holiday', 'Something else']
```

The `HARVEST_REDIRECT_URI` is the exact path where `harvestapp.com` should redirect after authentication. The app is configured to accept redirects at `/oauth`, which means that the value should be `{APP_HOST}/oauth`, where `APP_HOST` is the URL where the app is running.

The `DEDUCTIBLE_TASKS` is an array of task names of the tasks that should be deducted from the cumulative balance. I.e. if "Overtime holiday" is specified, all logged "Overtime holiday" hours will subtract from the balance instead of adding to it.

**Example:**

The app is running at `https://harvestbalance.mycompany.com`. The redirect URL in `harvestapp.com` should be configured as one of

* `https://harvestbalance.mycompany.com`
* `https://harvestbalance.mycompany.com/oauth`
* `https://*.mycompany.com`
* `https://*.mycompany.com/oauth`

The final `.env` file would look like

```
HARVEST_SUBDOMAIN=mycompanyltd
HARVEST_CLIENT_ID=4naflAKEHR231NNQA001221Q
HARVEST_SECRET=JTMsGvnalie43WTi9-A6ZBoeh53daF2A-i18MFSzOOFAE-WFq7--oakRCDKJAR246SHqowlBC7F-zam_qNMcJ4NDwA
HARVEST_REDIRECT_URI=https://harvestbalance.mycompany.com
```

## Building and running

If you run this app from the Docker Hub, simply start it with

`docker run --env-file .env -P bostrom/harvest-balance:latest`

If you downloaded the source, first build the Docker image with

`docker build -t harvest-balance:local .`

and then run it with

`docker run --env-file .env -P harvest-balance:local`

The app will be available at the local port that Docker assigned to the running container (check with `docker ps -a`).

**Note:** You will have to modify the redirect URL values both in `.env` and your Harvest account if you run it locally.


## Server API

### GET /api/auth

Returns an authentication URL for authenting the user with `harvestapp.com`. The client should redirect the user to the URL to initiate the authentication process.

#### Response

```
{
  "url": "https://myaccount.harvestapp.com/...."
}
```

### GET /api/oauth-success?code=_auth\_code_

After the user has been authenticated and has authorized this app, `harvestapp.com` will redirect back to this app's `REDIRECT_URL` as configured in `.env`. The redirect URL will be called with a query parameter `code` containing an authentication code for finalizing the authentication.

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

## Development

To start the app in development mode, clone the repository and run

```
yarn
yarn start   # starts webpack-dev-server
yarn server  # in another terminal, starts the backend
```

## License

[ISC License (ISC)](LICENSE)
