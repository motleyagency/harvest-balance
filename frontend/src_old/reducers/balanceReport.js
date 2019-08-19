import {
  BALANCE_REPORT_FETCH,
  BALANCE_REPORT_SUCCESS,
  BALANCE_REPORT_ERROR,
} from "../actions"

const balanceReport = (state = {}, action) => {
  switch (action.type) {
  case BALANCE_REPORT_FETCH:
    return Object.assign({}, state, {
      status: "pending",
    })
  case BALANCE_REPORT_SUCCESS:
    return Object.assign({}, state, {
      status: "success",
      report: action.payload,
    })
  case BALANCE_REPORT_ERROR:
    return Object.assign({}, state, {
      status: "error",
      error: action.payload,
    })
  default:
    return state
  }
}

export default balanceReport
