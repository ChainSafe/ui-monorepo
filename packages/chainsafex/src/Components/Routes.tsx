import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import HomePage from "./Pages/HomePage"

export const ROUTE_LINKS = {
  Landing: "/"
}

const Routes = () => {
  return (
    <Switch>
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Landing}
        isAuthorized={true}
        component={HomePage}
        redirectPath={ROUTE_LINKS.Landing}
      />
    </Switch>
  )
}

export default Routes
