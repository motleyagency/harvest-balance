// TODO consider using https://babeljs.io/docs/plugins/transform-runtime/ instead of babel-polyfill
import "babel-polyfill"
import React from "react"
import { render } from "react-dom"
import { createStore, applyMiddleware } from "redux"
import { Provider } from "react-redux"
import createSagaMiddleware from "redux-saga"
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

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container,
)
