# Changelog

## Version 2.0.0

- Re-generate frontend using DivJoy (uses create-react-app)
- Change backend to only consist of lambda functions
- Update to use Harvest API v2
- Update the server API routes

**New features**

- The report enpoint now accepts an `includeToday` query parameter

**BREAKING CHANGES**

- `/api/oauth-success` is now `/api/auth/success`

## Version 1.0.0

**BREAKING CHANGES**

The project is now split up into two parts, the UI and the API.

## Version 0.2.0

**New features**

- Added `DEDUCTIBLE_TASKS` environment variable for tasks that should be deducted from the cumulative balance
- Added detailed report (all tasks) to the report endpoint response
- Added caching of requests to the Harvest API

## Version 0.1.0

- Node backend, React/Redux frontend implemented
- Hours calculated as sum of all logged work hours
- OAuth through Harvest
