# Havest Balance

Calculate your time balance using the Harvest API.

## Installing and running

Create a `.env` file with your Harvest subdomain, username, password and user ID and the date to use as start date for the balance calculations (make a copy of `.env.defaults`), then run

```
yarn
yarn start
```

## Calculation principles

The balance is calculated as `{logged working hours} - {total working hours to date} `.

Logged working hours are collected from Harvest simply by summing up all logged hours between the given start date and today's date.

Total working hours are 7.5 hours times the number of working weekdays since `START_DATE`. Working days are Monday to Friday. Finnish public holidays each subtract one working day if they occur during the week.

