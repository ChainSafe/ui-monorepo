import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"
import posthog from "posthog-js"

if (process.env.REACT_APP_POSTHOG_PROJECT_API_KEY &&
    process.env.REACT_APP_POSTHOG_INSTANCE_ADDRESS) {
  posthog.init(process.env.REACT_APP_POSTHOG_PROJECT_API_KEY, {
    api_host: process.env.REACT_APP_POSTHOG_INSTANCE_ADDRESS,
    opt_out_capturing_by_default: true
  })
}

ReactDOM.render(<App />, document.getElementById("root"))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
