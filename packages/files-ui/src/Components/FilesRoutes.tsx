import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import { useAuth } from "@chainsafe/common-contexts"
import SettingsPage from "./Pages/SettingsPage"
import HomePage from "./Pages/HomePage"

const FilesRoutes = () => {
  const { isLoggedIn } = useAuth()
  return (
    <Switch>
      <ConditionalRoute
        exact
        path="/"
        isAuthorized={!isLoggedIn}
        component={LoginPage}
        redirectPath="/home"
      />
      <ConditionalRoute
        exact
        path="/home"
        isAuthorized={isLoggedIn}
        component={HomePage}
        redirectPath="/"
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
