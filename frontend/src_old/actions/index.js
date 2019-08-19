export const AUTH_URL_FETCH = "AUTH_URL_FETCH"
export const AUTH_URL_SUCCESS = "AUTH_URL_SUCCESS"
export const AUTH_URL_ERROR = "AUTH_URL_ERROR"
export const LOGIN = "LOGIN"
export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGIN_ERROR = "LOGIN_ERROR"
export const LOGOUT = "LOGOUT"
export const PROFILE_FETCH = "PROFILE_FETCH"
export const PROFILE_SUCCESS = "PROFILE_SUCCESS"
export const PROFILE_ERROR = "PROFILE_ERROR"
export const BALANCE_REPORT_FETCH = "BALANCE_REPORT_FETCH"
export const BALANCE_REPORT_SUCCESS = "BALANCE_REPORT_SUCCESS"
export const BALANCE_REPORT_ERROR = "BALANCE_REPORT_ERROR"


export const fetchAuthUrl = () => ({
  type: AUTH_URL_FETCH,
  payload: {},
})

export const authUrlSuccess = authUrl => ({
  type: AUTH_URL_SUCCESS,
  payload: authUrl,
})

export const authUrlError = error => ({
  type: AUTH_URL_ERROR,
  payload: error,
})

export const login = authCode => ({
  type: LOGIN,
  payload: {
    authCode,
  },
})

export const loginSuccess = token => ({
  type: LOGIN_SUCCESS,
  payload: token,
})

export const loginError = error => ({
  type: LOGIN_ERROR,
  payload: error,
})

export const logout = () => ({
  type: LOGOUT,
  payload: {},
})

export const profileFetch = () => ({
  type: PROFILE_FETCH,
  payload: {},
})

export const profileSuccess = profile => ({
  type: PROFILE_SUCCESS,
  payload: profile,
})

export const profileError = error => ({
  type: PROFILE_ERROR,
  payload: error,
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
