import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import SettingsPage from "./Pages/SettingsPage"
import { useImployApi } from "@imploy/common-contexts"
import HomePage from "./Pages/HomePage"
import SearchPage from "./Pages/SearchPage"
import BinPage from "./Pages/BinPage"
import OAuthCallbackPage from "./Pages/OAuthCallback"
import PurchasePlanPage from "./Pages/PurchasePlanPage"
import { useDrive } from "../Contexts/DriveContext"
import { useThresholdKey } from "../Contexts/ThresholdKeyContext"

export const ROUTE_LINKS = {
  Landing: "/",
  PrivacyPolicy: "https://files.chainsafe.io/privacy-policy",
  Terms: "https://files.chainsafe.io/terms-of-service",
  Home: (path?: string) => `/home${path ? `?path=${path}` : ""}`,
  Search: (search?: string) => `/search${search ? `?search=${search}` : ""}`,
  Bin: "/bin",
  Settings: "/settings",
  OAuthCallback: "/oauth2/callback/:provider",
  PurchasePlan: "/settings/purchase",
}

const FilesRoutes = () => {
  const { isLoggedIn, secured } = useImployApi()
  const { isNewDevice, publicKey, shouldInitializeAccount } = useThresholdKey()
  return (
    <Switch>
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Landing}
        isAuthorized={
          !isLoggedIn ||
          !secured ||
          !publicKey ||
          isNewDevice ||
          shouldInitializeAccount
        }
        component={LoginPage}
        redirectPath={ROUTE_LINKS.Home()}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Home()}
        isAuthorized={
          isLoggedIn &&
          secured &&
          !!publicKey &&
          !isNewDevice &&
          !shouldInitializeAccount
        }
        component={HomePage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Search()}
        isAuthorized={          isLoggedIn &&
          secured &&
          !!publicKey &&
          !isNewDevice &&
          !shouldInitializeAccount}
        component={SearchPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Bin}
        isAuthorized={
          isLoggedIn &&
          secured &&
          !!publicKey &&
          !isNewDevice &&
          !shouldInitializeAccount
        }
        component={BinPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Settings}
        isAuthorized={
          isLoggedIn &&
          secured &&
          !!publicKey &&
          !isNewDevice &&
          !shouldInitializeAccount
        }
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
        isAuthorized={
          isLoggedIn &&
          secured &&
          !!publicKey &&
          !isNewDevice &&
          !shouldInitializeAccount
        }
        component={PurchasePlanPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
    </Switch>
  )
}

export default FilesRoutes
