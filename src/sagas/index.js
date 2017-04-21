import { call, put, takeLatest } from "redux-saga/effects"
import {
  LOGIN,
  PROFILE_FETCH,
  BALANCE_REPORT_FETCH,
  loginSuccess,
  loginError,
  profileSuccess,
  profileError,
  balanceReportSuccess,
  balanceReportError,
} from "../actions"
import { handleAuth, balanceReport, account } from "../lib/harvestBalance"

export function* login(action) {
  try {
    const authResponse = yield call(handleAuth, action.payload.authCode)
    const authResponseJson = yield authResponse.json()
    yield put(loginSuccess(authResponseJson.harvest_token))
  } catch (err) {
    yield put(loginError(yield err.json()))
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
    yield put(balanceReportError(yield err.json()))
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
    yield put(profileError(yield err.json()))
  }
}

export function* watchProfileFetch() {
  yield takeLatest(PROFILE_FETCH, fetchProfile)
}

export function* rootSaga() {
  yield [
    watchLogin(),
    watchProfileFetch(),
    watchBalanceReport(),
  ]
}
