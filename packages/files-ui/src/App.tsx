import React, { useEffect } from "react"
import {
  init as initSentry,
  ErrorBoundary,
  showReportDialog,
} from "@sentry/react"
import { ThemeSwitcher } from "@chainsafe/common-theme"
import {
  CssBaseline,
  Router,
  ToasterProvider,
} from "@chainsafe/common-components"
import { Web3Provider } from "@chainsafe/web3-context"
import {
  ImployApiProvider,
  UserProvider,
  BillingProvider,
} from "@imploy/common-contexts"
import { DriveProvider } from "./Contexts/DriveContext"
import FilesRoutes from "./Components/FilesRoutes"
import AppWrapper from "./Components/Layouts/AppWrapper"
import { lightTheme } from "./Themes/LightTheme"
import { darkTheme } from "./Themes/DarkTheme"
import { useHotjar } from "react-use-hotjar"
import { LanguageProvider } from "./Contexts/LanguageContext"

if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_SENTRY_DSN_URL &&
  process.env.REACT_APP_SENTRY_RELEASE
) {
  initSentry({
    dsn: process.env.REACT_APP_SENTRY_DSN_URL,
    release: process.env.REACT_APP_SENTRY_RELEASE,
  })
}

const App: React.FC<{}> = () => {
  const { initHotjar } = useHotjar()
  const hotjarId = process.env.REACT_APP_HOTJAR_ID

  const apiUrl =
    process.env.REACT_APP_API_URL || "http://3.236.79.100:8000/api/v1"

  useEffect(() => {
    if (hotjarId && process.env.NODE_ENV === "production") {
      initHotjar(hotjarId, "6", () => console.log("Hotjar initialized"))
    }
  }, [hotjarId, initHotjar])

  return (
    <ErrorBoundary
      fallback={({ error, componentStack, eventId, resetError }) => (
        <div>
          <p>
            An error occurred and has been logged. If you would like to provide
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
      <LanguageProvider availableLanguages={[{ id: "en", label: "English" }]}>
        <ThemeSwitcher themes={{ light: lightTheme, dark: darkTheme }}>
          <CssBaseline />
          <ToasterProvider autoDismiss>
            <Web3Provider
              onboardConfig={{
                walletSelect: {
                  wallets: [
                    { walletName: "coinbase" },
                    {
                      walletName: "trust",
                      preferred: true,
                      rpcUrl:
                        "https://mainnet.infura.io/v3/a7e16429d2254d488d396710084e2cd3",
                    },
                    { walletName: "metamask" },
                    { walletName: "dapper" },
                    { walletName: "opera" },
                    { walletName: "operaTouch" },
                    { walletName: "torus" },
                    { walletName: "status" },
                    {
                      walletName: "walletConnect",
                      infuraKey: "a7e16429d2254d488d396710084e2cd3",
                    },
                  ],
                },
              }}
              checkNetwork={false}
            >
              <ImployApiProvider apiUrl={apiUrl}>
                <UserProvider>
                  <DriveProvider>
                    <BillingProvider>
                      <Router>
                        <AppWrapper>
                          <FilesRoutes />
                        </AppWrapper>
                      </Router>
                    </BillingProvider>
                  </DriveProvider>
                </UserProvider>
              </ImployApiProvider>
            </Web3Provider>
          </ToasterProvider>
        </ThemeSwitcher>
      </LanguageProvider>
    </ErrorBoundary>
  )
}

export default App
