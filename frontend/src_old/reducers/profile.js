import {
  PROFILE_FETCH,
  PROFILE_SUCCESS,
  PROFILE_ERROR,
  LOGOUT,
} from "../actions"

const initialState = {
  account: {},
}

const profile = (state = initialState, action) => {
  switch (action.type) {
  case PROFILE_FETCH:
    return Object.assign({}, state, {
      status: "pending",
      account: {},
    })
  case PROFILE_SUCCESS:
    return Object.assign({}, state, {
      status: "success",
      account: action.payload,
    })
  case PROFILE_ERROR:
    return Object.assign({}, state, {
      status: "error",
      error: action.payload,
      account: {},
    })
  case LOGOUT:
    return initialState
  default:
    return state
  }
}

export default profile
