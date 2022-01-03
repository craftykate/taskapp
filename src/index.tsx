import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import './index.scss'
import App from 'Components/App/App'
import store from 'Store/index'
import 'Utils/Config/config'
import { TasksContextProvider } from 'Context/tasks-context'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'

// Hide most logs in prod. Let info and error through
if (process.env.REACT_APP_ENV === 'PROD') {
  console.log = () => {}
  console.debug = () => {}
  console.warn = () => {}
  console.time = () => {}
  console.timeLog = () => {}
  console.timeEnd = () => {}
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <TasksContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TasksContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
