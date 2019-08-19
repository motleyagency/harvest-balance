import { call, put, takeLatest } from "redux-saga/effects"
import {
  AUTH_URL_FETCH,
  LOGIN,
  PROFILE_FETCH,
  BALANCE_REPORT_FETCH,
  authUrlSuccess,
  authUrlError,
  loginSuccess,
  loginError,
  logout,
  profileSuccess,
  profileError,
  balanceReportSuccess,
  balanceReportError,
} from "../actions"
import { getAuthUrl, handleAuth, balanceReport, account } from "../lib/harvestBalance"

function* handleError(error, errorAction) {
  if (error.status === 401) {
    yield put(logout())
  } else {
    yield put(errorAction(yield error.json()))
  }
}

export function* fetchAuthUrl() {
  try {
    const authUrlResponse = yield call(getAuthUrl)
    const authUrlResponseJson = yield authUrlResponse.json()
    yield put(authUrlSuccess(authUrlResponseJson.url))
  } catch (err) {
    yield handleError(err, authUrlError)
  }
}

export function* watchAuthUrlFetch() {
  yield takeLatest(AUTH_URL_FETCH, fetchAuthUrl)
}

export function* login(action) {
  try {
    const authResponse = yield call(handleAuth, action.payload.authCode)
    const authResponseJson = yield authResponse.json()
    yield put(loginSuccess(authResponseJson.harvest_token))
  } catch (err) {
    yield handleError(err, loginError)
  }
}

export function* watchLogin() {
  yield takeLatest(LOGIN, login)
}

export function* fetchBalanceReport(action) {
  try {
    const response = yield call(balanceReport, action.payload.startDate)
    yield put(balanceReportSuccess(yield response.json()))
  } catch (err) {
    yield handleError(err, balanceReportError)
  }
}

export function* watchBalanceReport() {
  yield takeLatest(BALANCE_REPORT_FETCH, fetchBalanceReport)
}

export function* fetchProfile() {
  try {
    const response = yield call(account)
    yield put(profileSuccess(yield response.json()))
  } catch (err) {
    yield handleError(err, profileError)
  }
}

export function* watchProfileFetch() {
  yield takeLatest(PROFILE_FETCH, fetchProfile)
}

export function* rootSaga() {
  yield [
    watchAuthUrlFetch(),
    watchLogin(),
    watchProfileFetch(),
    watchBalanceReport(),
  ]
}
