# Harvest Balance API

The backend for the Harvest Balance app.

## Developer's memo

Useful commands etc for developing

### Run in dev mode

`npm start`

### Build production app

`npm run build`

### Run the production app locally

`npm run serve`

### Build a Docker image

```
docker build -t harvest-balance-api:local .
```

### Publish the Docker image to Docker Hub

```
docker login
docker tag harvest-balance-api:local <yourusername>/harvest-balance-api:latest
docker tag harvest-balance-api:local <yourusername>/harvest-balance-api:<version>
docker push <yourusername>/harvest-balance-api
```
