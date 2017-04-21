import storage from "./storage"

const lStorage = storage(localStorage)

export const getToken = () => lStorage.get("auth", null)

export const setToken = token => lStorage.set("auth", token)

export const isAuthenticated = () => !!getToken()

export default {
  getToken,
  setToken,
  isAuthenticated,
}
