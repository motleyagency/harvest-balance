/**
 * Reducer for authenticating through Harvestapp.
 * Keeps the harvest_token and authentication state
 * and errors.
 */
import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
  AUTH_URL_FETCH,
  AUTH_URL_SUCCESS,
  AUTH_URL_ERROR,
} from "../actions"

const auth = (state = {}, action) => {
  switch (action.type) {
  case LOGIN:
    return Object.assign({}, state, {
      status: "pending",
      token: null,
      errorDescription: null,
      authUrl: null,
    })
  case LOGIN_SUCCESS:
    return Object.assign({}, state, {
      status: "success",
      token: action.payload,
      errorDescription: null,
      authUrl: null,
    })
  case LOGIN_ERROR:
    return Object.assign({}, state, {
      status: "error",
      token: null,
      errorDescription: action.payload,
      authUrl: null,
    })
  case AUTH_URL_FETCH:
    return Object.assign({}, state, {
      status: null,
      authUrl: null,
    })
  case AUTH_URL_SUCCESS:
    return Object.assign({}, state, {
      status: null,
      authUrl: action.payload,
    })
  case AUTH_URL_ERROR:
    return Object.assign({}, state, {
      status: "error",
      authUrl: null,
      errorDescription: action.payload,
    })
  case LOGOUT:
    return {}
  default:
    return state
  }
}

export default auth
