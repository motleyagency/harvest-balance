import Promise from "bluebird"
import { keyBy } from "lodash"
import cached from "./cached"

const CACHE_KEY_LIST = "projects_list"
const CACHE_KEY_LIST_BY_KEY = "projects_list_by_key"

export const list = (harvestClient, ...opts) => {
  if (!harvestClient || !harvestClient.Account) {
    throw new Error("No or bad harvestClient supplied")
  }
  const Projects = harvestClient.Projects
  const listAsync = Promise.promisify(Projects.list, { context: Projects })
  const listCached = cached(listAsync, `${CACHE_KEY_LIST}_${harvestClient.balanceAccessToken}`)

  return listCached(...opts)
}

export const listByKey = (harvestClient, ...opts) => {
  const lbk = (...args) => list(harvestClient, ...args).then(projects => keyBy(projects, "project.id"))
  const cachedLbk = cached(lbk, `${CACHE_KEY_LIST_BY_KEY}_${harvestClient.balanceAccessToken}`)

  return cachedLbk(...opts)
}

export default {
  list,
  listByKey,
}
