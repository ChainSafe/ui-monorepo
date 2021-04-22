import React, { useEffect } from "react"
import { init as initSentry, ErrorBoundary, showReportDialog } from "@sentry/react"
import { Web3Provider } from "@chainsafe/web3-context"
import { ImployApiProvider, UserProvider, BillingProvider } from "@chainsafe/common-contexts"
import { ThemeSwitcher } from "@chainsafe/common-theme"
import "@chainsafe/common-theme/dist/font-faces.css"
import { Button, CssBaseline, Modal, Router, ToasterProvider, Typography } from "@chainsafe/common-components"
import { DriveProvider } from "./Contexts/DriveContext"
import FilesRoutes from "./Components/FilesRoutes"
import AppWrapper from "./Components/Layouts/AppWrapper"
import { useHotjar } from "react-use-hotjar"
import { LanguageProvider } from "./Contexts/LanguageContext"
import { ThresholdKeyProvider } from "./Contexts/ThresholdKeyContext"
import { lightTheme } from "./Themes/LightTheme"
import { darkTheme } from "./Themes/DarkTheme"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"

if (
  process.env.NODE_ENV === "production" &&
  process.env.REACT_APP_SENTRY_DSN_URL
) {
  initSentry({
    dsn: process.env.REACT_APP_SENTRY_DSN_URL,
    release: process.env.REACT_APP_SENTRY_RELEASE,
    environment: process.env.REACT_APP_SENTRY_ENV
  })
}
const App: React.FC<{}> = () => {
  const { initHotjar } = useHotjar()
  const { canUseLocalStorage } = useLocalStorage()
  const hotjarId = process.env.REACT_APP_HOTJAR_ID
  const apiUrl =
    process.env.REACT_APP_API_URL || "https://stage.imploy.site/api/v1"

  // This will default to testnet unless mainnet is specifically set in the ENV
  const directAuthNetwork = (process.env.REACT_APP_DIRECT_AUTH_NETWORK === "mainnet") ? "mainnet" : "testnet"

  useEffect(() => {
    if (hotjarId && process.env.NODE_ENV === "production") {
      initHotjar(hotjarId, "6", () => console.log("Hotjar initialized"))
    }
  }, [hotjarId, initHotjar])

  return (
    <ThemeSwitcher
      storageKey="csf.themeKey"
      themes={{ light: lightTheme, dark: darkTheme }}
    >
      <ErrorBoundary
        fallback={({ error, componentStack, eventId, resetError }) => (
          <Modal
            active
            closePosition="none"
            setActive={resetError}
          >
            <Typography>
              An error occurred and has been logged. If you would like to
              provide additional info to help us debug and resolve the issue,
              click the `&quot;`Provide Additional Details`&quot;` button
            </Typography>
            <Typography>{error?.message.toString()}</Typography>
            <Typography>{componentStack}</Typography>
            <Typography>{eventId}</Typography>
            <Button
              onClick={() => showReportDialog({ eventId: eventId || "" })}
            >
              Provide Additional Details
            </Button>
            <Button onClick={resetError}>Reset error</Button>
          </Modal>
        )}
        onReset={() => window.location.reload()}
      >
        <LanguageProvider availableLanguages={[{ id: "en", label: "English" }]}>
          <CssBaseline />
          <ToasterProvider autoDismiss>
            <Web3Provider
              onboardConfig={{
                dappId: process.env.REACT_APP_BLOCKNATIVE_ID || "",
                walletSelect: {
                  wallets: [
                    { walletName: "coinbase" },
                    {
                      walletName: "trust",
                      rpcUrl:
                        "https://mainnet.infura.io/v3/a7e16429d2254d488d396710084e2cd3"
                    },
                    { walletName: "metamask", preferred: true },
                    { walletName: "authereum" },
                    { walletName: "opera" },
                    { walletName: "operaTouch" },
                    { walletName: "torus" },
                    { walletName: "status" },
                    {
                      walletName: "walletConnect",
                      infuraKey: "a7e16429d2254d488d396710084e2cd3",
                      preferred: true
                    }
                  ]
                }
              }}
              checkNetwork={false}
              cacheWalletSelection={canUseLocalStorage}
            >
              <ImployApiProvider
                apiUrl={apiUrl}
                withLocalStorage={false}
              >
                <ThresholdKeyProvider
                  enableLogging
                  network={directAuthNetwork}
                >
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
                </ThresholdKeyProvider>
              </ImployApiProvider>
            </Web3Provider>
          </ToasterProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </ThemeSwitcher>
  )
}

export default App
