import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import { useStorageApi }  from "../Contexts/StorageApiContext"
import CidsPage from "./Pages/CidsPage"
import BucketsPage from "./Pages/BucketsPage"
import SettingsPage from "./Pages/SettingsPage"
import BucketPage from "./Pages/BucketPage"

export const ROUTE_LINKS = {
  Landing: "/",
  Cids: "/cids",
  Buckets: "/buckets",
  Settings: "/settings",
  PrivacyPolicy: "https://files.chainsafe.io/privacy-policy",
  Terms: "https://files.chainsafe.io/terms-of-service",
  ChainSafe: "https://chainsafe.io/",
  BucketRoot: "/bucket",
  Bucket: (id: string, bucketPath: string) => `/bucket/${id}${bucketPath}`
}

export const SETTINGS_PATHS = ["apiKeys"] as const
export type SettingsPath = typeof SETTINGS_PATHS[number]

const StorageRoutes = () => {
  const { isLoggedIn } = useStorageApi()

  return (
    <Switch>
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Cids}
        isAuthorized={isLoggedIn}
        component={CidsPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Cids}
        isAuthorized={isLoggedIn}
        component={CidsPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Buckets}
        isAuthorized={isLoggedIn}
        component={BucketsPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.BucketRoot}
        isAuthorized={isLoggedIn}
        component={BucketPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Settings}
        isAuthorized={isLoggedIn}
        component={SettingsPage}
        redirectPath={ROUTE_LINKS.Buckets}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.Landing}
        isAuthorized={!isLoggedIn}
        component={LoginPage}
        redirectPath={ROUTE_LINKS.Cids}
        redirectToSource
      />
    </Switch>
  )
}

export default StorageRoutes
