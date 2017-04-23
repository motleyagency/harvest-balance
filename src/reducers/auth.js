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
} from "../actions"

const auth = (state = {}, action) => {
  switch (action.type) {
  case LOGIN:
    return Object.assign({}, state, {
      status: "pending",
      token: null,
      errorDescription: null,
    })
  case LOGIN_SUCCESS:
    return Object.assign({}, state, {
      status: "success",
      token: action.payload,
      errorDescription: null,
    })
  case LOGIN_ERROR:
    return Object.assign({}, state, {
      status: "error",
      token: null,
      errorDescription: action.payload,
    })
  case LOGOUT:
    return {}
  default:
    return state
  }
}

export default auth
