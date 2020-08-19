import React from "react"
import * as Sentry from "@sentry/react"

if (
  // process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_SENTRY_RELEASE &&
  process.env.REACT_APP_SENTRY_DSN_URL
) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN_URL,
    release: process.env.REACT_APP_SENTRY_RELEASE,
    environment: process.env.REACT_APP_SENTRY_ENV,
  })
}
// Add router
// Add all global contexts (theme, language, apis, web3)

const App: React.FC<{}> = () => {
  return (
    <Sentry.ErrorBoundary showDialog fallback={"there was an error"}>
      <div className="App"></div>
    </Sentry.ErrorBoundary>
  )
}

export default App
