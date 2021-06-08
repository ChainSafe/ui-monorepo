import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import { useStorageApi }  from "../Contexts/StorageApiContext"
import PinsPage from "./Pages/PinsPage"
import BucketsPage from "./Pages/Buckets"

export const ROUTE_LINKS = {
  Landing: "/",
  Pins: "/pins",
  Buckets: "/buckets",
  PrivacyPolicy: "https://files.chainsafe.io/privacy-policy",
  Terms: "https://files.chainsafe.io/terms-of-service",
  ChainSafe: "https://chainsafe.io/"
}

export const SETTINGS_PATHS = ["profile", "plan", "security"] as const
export type SettingsPath = typeof SETTINGS_PATHS[number]

const FilesRoutes = () => {
  const { isLoggedIn } = useStorageApi()

  return (
    <Switch>
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Pins}
        isAuthorized={isLoggedIn}
        component={PinsPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Buckets}
        isAuthorized={isLoggedIn}
        component={BucketsPage}
        redirectPath={ROUTE_LINKS.Buckets}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.Landing}
        isAuthorized={!isLoggedIn}
        component={LoginPage}
        redirectPath={ROUTE_LINKS.Pins}
        redirectToSource
      />
    </Switch>
  )
}

export default FilesRoutes
