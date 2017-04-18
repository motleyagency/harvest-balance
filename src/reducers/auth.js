import {
  LOGIN,
  LOGIN_SUCCESS,
  LOGIN_ERROR,
  LOGOUT,
} from "../actions"
import { getSession, setSession } from "../lib/auth"

const initialState = () => {
  const session = getSession()
  if (session) {
    return {
      status: session.user ? "success" : "",
      session,
    }
  }
  return {}
}

const auth = (state = initialState(), action) => {
  switch (action.type) {
  case LOGIN:
    return Object.assign({}, state, {
      status: "loading",
    })
  case LOGIN_SUCCESS:
    return Object.assign({}, state, {
      status: "success",
      session: action.payload,
    })
  case LOGIN_ERROR:
    return Object.assign({}, state, {
      status: "error",
    })
  case LOGOUT:
    setSession(null)
    return {}
  default:
    return state
  }
}

export default auth
