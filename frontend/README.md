# Motley's Harvest Balance App

This is a two-tier app (backend+frontend) for calculating your hour balance (overtime/time debt) based on your logged working hours in Harvest.

Then frontend is served from a public S3 bucket in Motley's Amazon AWS (http://harvestbalance-frontend.s3-website.eu-central-1.amazonaws.com/).

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Deployment

**Prerequisites**

- Install and configure aws-cli (google it)

**Updating the app**

- Build the app `npm run build`
- Sync changes to S3 `aws --profile motley s3 sync ./build s3://harvestbalance-frontend --delete`
- Check the new version at http://harvestbalance-frontend.s3-website.eu-central-1.amazonaws.com/
