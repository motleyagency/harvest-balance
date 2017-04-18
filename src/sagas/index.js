import { call, put, takeLatest } from "redux-saga/effects"
import {
  LOGIN,
  BALANCE_REPORT_FETCH,
  loginSuccess,
  loginError,
  balanceReportSuccess,
  balanceReportError,
} from "../actions"
import { handleAuth, balanceReport, account } from "../lib/harvestBalance"
import { setSession } from "../lib/auth"

export function* login(action) {
  try {
    const authResponse = yield call(handleAuth, action.payload.authCode)
    const authResponseJson = yield authResponse.json()

    setSession(authResponseJson)

    const userResponse = yield call(account)
    const userResponseJson = yield userResponse.json()

    const session = {
      ...authResponseJson,
      ...userResponseJson,
    }

    setSession(session)
    yield put(loginSuccess(session))
  } catch (err) {
    setSession(null)
    yield put(loginError(err))
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
    yield put(balanceReportError(err))
  }
}

export function* watchBalanceReport() {
  yield takeLatest(BALANCE_REPORT_FETCH, fetchBalanceReport)
}

export function* rootSaga() {
  yield [
    watchLogin(),
    watchBalanceReport(),
  ]
}
