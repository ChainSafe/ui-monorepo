import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import { useGamingApi }  from "../Contexts/GamingApiContext"
import BillingPage from "./Pages/BillingPage"
import Products from "./Modules/Products"
import ApiKeys from "./Modules/ApiKeys"

export const SETTINGS_PATHS = ["apiKeys", "billing"] as const
export type SettingsPath = typeof SETTINGS_PATHS[number]

export const ROUTE_LINKS = {
  Landing: "/",
  // SettingsRoot: "/settings",
  // Settings: (path: SettingsPath) => `/settings/${path}`,
  APIKeys: "/keys",
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
        path={ROUTE_LINKS.APIKeys}
        isAuthorized={isLoggedIn}
        component={ApiKeys}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.Billing}
        isAuthorized={isLoggedIn}
        component={BillingPage}
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
        redirectPath={ROUTE_LINKS.APIKeys}
        redirectToSource
      />
    </Switch>
  )
}

export default GamingRoutes
