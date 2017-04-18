import { combineReducers } from "redux"
import auth from "./auth"
import balanceReport from "./balanceReport"

const rootReducer = combineReducers({
  auth,
  balanceReport,
})

export default rootReducer
