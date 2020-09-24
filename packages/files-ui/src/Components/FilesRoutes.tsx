import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import { useImployApi } from "@chainsafe/common-contexts"
import HomePage from "./Pages/HomePage"

export const ROUTE_LINKS = {
  Landing: "/",
  PrivacyPolicy: "",
  Terms: "",
  Home: "/home",
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
    </Switch>
  )
}

export default FilesRoutes
