import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  // ISSUE: findDOMNode is deprecated in StrictMode.
  // findDOMNode was passed an instance of Wave which is inside StrictMode.
  // AntD team disabled & ignored issue: https://github.com/ant-design/ant-design/issues/22493
  // TODO: Enable strict mode when a fix is provided from AntD
  // <React.StrictMode>
  <App />,
  // </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
