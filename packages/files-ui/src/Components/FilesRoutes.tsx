import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import { useAuth } from "@chainsafe/common-contexts"
import SettingsPage from "./Pages/SettingsPage"
import HomePage from "./Pages/HomePage"

export const ROUTE_LINKS = {
  Landing: "/",
  PrivacyPolicy: "",
  Terms: "",
  Home: "/home",
}

const FilesRoutes = () => {
  const { isLoggedIn } = useAuth()
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
        path="/settings"
        isAuthorized={true}
        component={SettingsPage}
        redirectPath="/"
      />
    </Switch>
  )
}

export default FilesRoutes
