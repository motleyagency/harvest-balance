import { getSession } from "./auth"

const BACKEND_ENDPOINT = `${process.env.BACKEND_URL}/api`

const jsonHeaders = () => new Headers({
  "Content-Type": "application/json",
  harvest_token: getSession().harvest_token,
})

export const AUTH_URL = `${BACKEND_ENDPOINT}/auth`

export const handleAuth = authCode => fetch(`${BACKEND_ENDPOINT}/oauth-success?code=${authCode}`, {
  headers: jsonHeaders(),
})

export const account = () => fetch(`${BACKEND_ENDPOINT}/account`, {
  headers: jsonHeaders(),
})

export const balanceReport = startDate => fetch(`${BACKEND_ENDPOINT}/balance?startDate=${startDate}`, {
  headers: jsonHeaders(),
})

export default {
  AUTH_URL,
  handleAuth,
  balanceReport,
}
