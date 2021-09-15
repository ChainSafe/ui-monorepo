import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import { useGamingApi }  from "../Contexts/GamingApiContext"
import SettingsPage from "./Pages/SettingsPage"
import DashboardPage from "./Pages/DashboardPage"

export const SETTINGS_PATHS = ["apiKeys"] as const
export type SettingsPath = typeof SETTINGS_PATHS[number]

export const ROUTE_LINKS = {
  Landing: "/",
  Dashboard: "/dashboard",
  SettingsRoot: "/settings",
  Settings: (path: SettingsPath) => `/settings/${path}`,
  PrivacyPolicy: "https://files.chainsafe.io/privacy-policy",
  Terms: "https://files.chainsafe.io/terms-of-service",
  ChainSafe: "https://chainsafe.io/"
}

const GamingRoutes = () => {
  const { isLoggedIn } = useGamingApi()

  return (
    <Switch>
      <ConditionalRoute
        path={ROUTE_LINKS.Dashboard}
        isAuthorized={isLoggedIn}
        component={DashboardPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.SettingsRoot}
        isAuthorized={isLoggedIn}
        component={SettingsPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.Landing}
        isAuthorized={!isLoggedIn}
        component={LoginPage}
        redirectPath={ROUTE_LINKS.Dashboard}
        redirectToSource
      />
    </Switch>
  )
}

export default GamingRoutes
