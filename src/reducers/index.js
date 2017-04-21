import { combineReducers } from "redux"
import auth from "./auth"
import balanceReport from "./balanceReport"
import profile from "./profile"

const rootReducer = combineReducers({
  auth,
  profile,
  balanceReport,
})

export default rootReducer
