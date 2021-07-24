import React, { useCallback, useEffect } from "react"
import { init as initSentry, ErrorBoundary, showReportDialog } from "@sentry/react"
import { Web3Provider } from "@chainsafe/web3-context"
import { ThemeSwitcher } from "@chainsafe/common-theme"
import "@chainsafe/common-theme/dist/font-faces.css"
import { Button, CssBaseline, Modal, Router, ToasterProvider, Typography } from "@chainsafe/common-components"
import StorageRoutes from "./Components/StorageRoutes"
import AppWrapper from "./Components/Layouts/AppWrapper"
import { useHotjar } from "react-use-hotjar"
import { LanguageProvider } from "./Contexts/LanguageContext"
import { lightTheme } from "./Themes/LightTheme"
import { darkTheme } from "./Themes/DarkTheme"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { StorageApiProvider }  from "./Contexts/StorageApiContext"
import { StorageProvider } from "./Contexts/StorageContext"
import { UserProvider } from "./Contexts/UserContext"

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

const availableLanguages = [
  { id: "en", label: "English" }
]

const onboardConfig = {
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
}

const App = () => {
  const { initHotjar } = useHotjar()
  const { canUseLocalStorage } = useLocalStorage()
  const hotjarId = process.env.REACT_APP_HOTJAR_ID
  const apiUrl = process.env.REACT_APP_API_URL || "https://stage.imploy.site/api/v1"
  // This will default to testnet unless mainnet is specifically set in the ENV

  useEffect(() => {
    if (hotjarId && process.env.NODE_ENV === "production") {
      initHotjar(hotjarId, "6", () => console.log("Hotjar initialized"))
    }
  }, [hotjarId, initHotjar])

  const fallBack = useCallback(({ error, componentStack, eventId, resetError }) => (
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
  ), [])

  return (
    <ThemeSwitcher
      storageKey="css.themeKey"
      themes={{ light: lightTheme, dark: darkTheme }}
    >
      <ErrorBoundary
        fallback={fallBack}
        onReset={() => window.location.reload()}
      >
        <CssBaseline />
        <LanguageProvider availableLanguages={availableLanguages}>
          <ToasterProvider autoDismiss>
            <Web3Provider
              onboardConfig={onboardConfig}
              checkNetwork={false}
              cacheWalletSelection={canUseLocalStorage}
            >
              <StorageApiProvider
                apiUrl={apiUrl}
                withLocalStorage={true}
              >
                <UserProvider>
                  <StorageProvider>
                    <Router>
                      <AppWrapper>
                        <StorageRoutes />
                      </AppWrapper>
                    </Router>
                  </StorageProvider>
                </UserProvider>
              </StorageApiProvider>
            </Web3Provider>
          </ToasterProvider>
        </LanguageProvider>
      </ErrorBoundary>
    </ThemeSwitcher>
  )
}

export default App
