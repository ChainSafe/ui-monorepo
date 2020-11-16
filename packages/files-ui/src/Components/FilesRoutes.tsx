import React from "react"
import { Switch, ConditionalRoute } from "@imploy/common-components"
import LoginPage from "./Pages/LoginPage"
import SettingsPage from "./Pages/SettingsPage"
import { useImployApi } from "@imploy/common-contexts"
import HomePage from "./Pages/HomePage"
import OAuthCallbackPage from "./Pages/OAuthCallback"
import PlanSelectionPage from "./Pages/plans/PlanSelectionPage"

export const ROUTE_LINKS = {
  Landing: "/",
  PrivacyPolicy: "",
  Terms: "",
  Home: "/home",
  Settings: "/settings",
  OAuthCallback: "/oauth2/callback/:provider",
  PurchasePlan: "/settings/purchase",
}

const FilesRoutes = () => {
  const { isLoggedIn } = useImployApi()
  return (
    <Switch>
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Landing}
        isAuthorized={!isLoggedIn}
        component={LoginPage}
        redirectPath={ROUTE_LINKS.Home}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Home}
        isAuthorized={isLoggedIn}
        component={HomePage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Settings}
        isAuthorized={isLoggedIn}
        component={SettingsPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.OAuthCallback}
        isAuthorized={!isLoggedIn}
        component={OAuthCallbackPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.PurchasePlan}
        isAuthorized={isLoggedIn}
        component={PlanSelectionPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
    </Switch>
  )
}

export default FilesRoutes
