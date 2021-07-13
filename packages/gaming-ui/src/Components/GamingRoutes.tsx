import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import { useGamingApi }  from "../Contexts/GamingApiContext"
import SettingsPage from "./Pages/SettingsPage"
import CurrentProduct from "./Pages/CurrentProduct"
import Products from "./Modules/Products"

export const SETTINGS_PATHS = ["apiKeys", "billing"] as const
export type SettingsPath = typeof SETTINGS_PATHS[number]

export const ROUTE_LINKS = {
  Landing: "/",
  SettingsRoot: "/settings",
  Settings: (path: SettingsPath) => `/settings/${path}`,
  PrivacyPolicy: "https://files.chainsafe.io/privacy-policy",
  Terms: "https://files.chainsafe.io/terms-of-service",
  ChainSafe: "https://chainsafe.io/",
  Billing: "/billing",
  Products: "/products"
}



const GamingRoutes = () => {
  const { isLoggedIn } = useGamingApi()

  return (
    <Switch>
      <ConditionalRoute
        path={ROUTE_LINKS.SettingsRoot}
        isAuthorized={isLoggedIn}
        component={SettingsPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.Billing}
        isAuthorized={isLoggedIn}
        component={CurrentProduct}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.Products}
        isAuthorized={isLoggedIn}
        component={Products}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.Landing}
        isAuthorized={!isLoggedIn}
        component={LoginPage}
        redirectPath={ROUTE_LINKS.SettingsRoot}
        redirectToSource
      />
    </Switch>
  )
}

export default GamingRoutes
