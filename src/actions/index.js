export const LOGIN = "LOGIN"
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_ERROR = "LOGIN_ERROR"
export const LOGOUT = "LOGOUT"
export const BALANCE_REPORT_FETCH = "BALANCE_REPORT_FETCH"
export const BALANCE_REPORT_SUCCESS = "BALANCE_REPORT_SUCCESS"
export const BALANCE_REPORT_ERROR = "BALANCE_REPORT_ERROR"


export const login = authCode => ({
  type: LOGIN,
  payload: {
    authCode,
  },
})

export const loginSuccess = session => ({
  type: LOGIN_SUCCESS,
  payload: session,
})

export const loginError = error => ({
  type: LOGIN_ERROR,
  payload: {
    error,
  },
})

export const logout = () => ({
  type: LOGOUT,
  payload: {},
})

export const balanceReportFetch = startDate => ({
  type: BALANCE_REPORT_FETCH,
  payload: {
    startDate,
  },
})

export const balanceReportSuccess = payload => ({
  type: BALANCE_REPORT_SUCCESS,
  payload,
})

export const balanceReportError = error => ({
  type: BALANCE_REPORT_ERROR,
  payload: {
    error,
  },
})
