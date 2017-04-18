import storage from "./storage"

const lStorage = storage(localStorage)

export const getSession = () => lStorage.get("auth", {})

export const setSession = session => lStorage.set("auth", session)

export const isAuthenticated = () => !!getSession().harvest_token

export default {
  getSession,
  setSession,
  isAuthenticated,
}
