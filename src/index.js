// TODO consider using https://babeljs.io/docs/plugins/transform-runtime/ instead of babel-polyfill
import "babel-polyfill"
import React from "react"
import { render } from "react-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import createSagaMiddleware from "redux-saga"
import debounce from "lodash.debounce"
import { getToken, setToken } from "./lib/auth"
import { loginSuccess } from "./actions"
import reducers from "./reducers"
import { rootSaga } from "./sagas"
import "./main.scss"
import App from "./containers/App"

const container = document.getElementById("app")
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducers,
  // eslint-disable-next-line
  process.env.NODE_ENV !== "production" && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(sagaMiddleware),
)
sagaMiddleware.run(rootSaga)

const token = getToken()
if (token) {
  store.dispatch(loginSuccess(token))
}
store.subscribe(debounce(() => {
  console.log("setting token", store.getState().auth.token)
  setToken(store.getState().auth.token)
}, 500, {
  leading: true,
  trailing: false,
}))

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container,
)
