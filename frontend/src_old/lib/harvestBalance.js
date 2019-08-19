import { getToken } from "./auth"

const BACKEND_ENDPOINT = "/api"

const jsonHeaders = () => new Headers({
  "Content-Type": "application/json",
  harvest_token: getToken(),
})

const errorChecker = (response) => {
  if (response.status >= 400 && response.status < 600) {
    throw response
  }
  return response
}

export const getAuthUrl = () => fetch(`${BACKEND_ENDPOINT}/auth`, {
  headers: jsonHeaders(),
}).then(errorChecker)

export const handleAuth = authCode => fetch(`${BACKEND_ENDPOINT}/oauth-success?code=${authCode}`, {
  headers: jsonHeaders(),
}).then(errorChecker)

export const account = () => fetch(`${BACKEND_ENDPOINT}/account`, {
  headers: jsonHeaders(),
}).then(errorChecker)

export const balanceReport = startDate => fetch(`${BACKEND_ENDPOINT}/balance?startDate=${startDate}`, {
  headers: jsonHeaders(),
}).then(errorChecker)

export default {
  getAuthUrl,
  handleAuth,
  account,
  balanceReport,
}
