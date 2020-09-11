import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./LoginPage"

const FilesRoutes = () => {
  const isAuthenticated = false //TODO: Get this from the Auth context
  return (
    <Switch>
      <ConditionalRoute
        exact
        path="/"
        isAuthorized={!isAuthenticated}
        component={LoginPage}
      />
    </Switch>
  )
}

export default FilesRoutes
