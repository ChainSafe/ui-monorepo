import React from "react"
import { init, ErrorBoundary } from "@sentry/react"

if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_SENTRY_RELEASE &&
  process.env.REACT_APP_SENTRY_DSN_URL
) {
  init({
    dsn: process.env.REACT_APP_SENTRY_DSN_URL,
    release: process.env.REACT_APP_SENTRY_RELEASE,
    environment: process.env.REACT_APP_SENTRY_ENV,
  })
}
// Add router
// Add all global contexts (theme, language, apis, web3)

const App: React.FC<{}> = () => {
  return (
    <ErrorBoundary showDialog>
      <div className="App"></div>
    </ErrorBoundary>
  )
}

export default App
