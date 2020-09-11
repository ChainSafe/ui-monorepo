import React from "react"
import { init, ErrorBoundary, showReportDialog } from "@sentry/react"
import { createTheme, ThemeProvider } from "@chainsafe/common-themes"
import { Router } from "@chainsafe/common-components"
import { Web3Provider } from "@chainsafe/web3-context"
import { ImployApiProvider } from "@chainsafe/common-contexts"
import FilesRoutes from "./Components/FilesRoutes"
if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_SENTRY_DSN_URL &&
  process.env.REACT_APP_SENTRY_RELEASE
) {
  init({
    dsn: process.env.REACT_APP_SENTRY_DSN_URL,
    release: process.env.REACT_APP_SENTRY_RELEASE,
  })
}
// Add router
// Add all global contexts (theme, language, apis, web3)

const theme = createTheme()

const App: React.FC<{}> = () => {
  return (
    <ErrorBoundary
      fallback={({ error, componentStack, eventId, resetError }) => (
        <div>
          <p>
            An error occured and has been logged. If you would like to provide
            additional info to help us debug and resolve the issue, click the
            "Provide Additional Details" button
          </p>
          <p>{error?.message.toString()}</p>
          <p>{componentStack}</p>
          <p>{eventId}</p>
          <button onClick={() => showReportDialog({ eventId: eventId || "" })}>
            Provide Additional Details
          </button>
          <button onClick={resetError}>Reset error</button>
        </div>
      )}
      onReset={() => window.location.reload()}
    >
      <ThemeProvider theme={theme}>
        <ImployApiProvider>
          <Web3Provider networkIds={[1]}>
            <Router>
              <FilesRoutes />
            </Router>
          </Web3Provider>
        </ImployApiProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
