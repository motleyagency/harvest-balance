import Promise from "bluebird"
import cached from "./cached"

const CACHE_KEY = "account_get"

export const get = (harvestClient, ...opts) => {
  if (!harvestClient || !harvestClient.Account) {
    throw new Error("No or bad harvestClient supplied")
  }
  const Account = harvestClient.Account
  const getAsync = Promise.promisify(Account.get, { context: Account })
  const getCached = cached(getAsync, `${CACHE_KEY}_${harvestClient.balanceAccessToken}`)

  return getCached(...opts)
}

export default {
  get,
}
