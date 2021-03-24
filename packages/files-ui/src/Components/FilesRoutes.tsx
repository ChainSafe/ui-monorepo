import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import SettingsPage from "./Pages/SettingsPage"
import { useImployApi } from "@chainsafe/common-contexts"
import HomePage from "./Pages/HomePage"
import SearchPage from "./Pages/SearchPage"
import BinPage from "./Pages/BinPage"
import PurchasePlanPage from "./Pages/PurchasePlanPage"
import { useThresholdKey } from "../Contexts/ThresholdKeyContext"

export const ROUTE_LINKS = {
  Landing: "/",
  PrivacyPolicy: "https://files.chainsafe.io/privacy-policy",
  Terms: "https://files.chainsafe.io/terms-of-service",
  ChainSafe: "https://chainsafe.io/",
  Home: (path?: string) => `/home${path ? `?path=${path}` : ""}`,
  Search: (search?: string) => `/search${search ? `?search=${search}` : ""}`,
  Bin: "/bin",
  Settings: "/settings",
  PurchasePlan: "/settings/purchase"
}

const FilesRoutes = () => {
  const { isLoggedIn, secured } = useImployApi()
  const { isNewDevice, publicKey, shouldInitializeAccount } = useThresholdKey()

  const isAuthorized = isLoggedIn && secured && !!publicKey && !isNewDevice && !shouldInitializeAccount

  return (
    <Switch>
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Landing}
        isAuthorized={!isAuthorized}
        component={LoginPage}
        redirectPath={ROUTE_LINKS.Home()}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Home()}
        isAuthorized={isAuthorized}
        component={HomePage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Search()}
        isAuthorized={isAuthorized}
        component={SearchPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Bin}
        isAuthorized={isAuthorized        }
        component={BinPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Settings}
        isAuthorized={isAuthorized}
        component={SettingsPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.PurchasePlan}
        isAuthorized={isAuthorized}
        component={PurchasePlanPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
    </Switch>
  )
}

export default FilesRoutes
