import React, { useMemo } from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import SettingsPage from "./Pages/SettingsPage"
import { useFilesApi }  from "../Contexts/FilesApiContext"
import DrivePage from "./Pages/DrivePage"
import SearchPage from "./Pages/SearchPage"
import BinPage from "./Pages/BinPage"
import PurchasePlanPage from "./Pages/PurchasePlanPage"
import { useThresholdKey } from "../Contexts/ThresholdKeyContext"
import SharedFoldersOverview from "./Modules/FileBrowsers/SharedFoldersOverview"

export const SETTINGS_BASE = "/settings"
export const ROUTE_LINKS = {
  Landing: "/",
  PrivacyPolicy: "https://files.chainsafe.io/privacy-policy",
  Terms: "https://files.chainsafe.io/terms-of-service",
  ChainSafe: "https://chainsafe.io/",
  Drive: (rawCurrentPath: string) => `/drive${rawCurrentPath}`,
  Search: (rawSearchTerm: string) => `/search/${rawSearchTerm}`,
  Bin: (rawBinPath: string) => `/bin${rawBinPath}`,
  ApplyCryptography: "https://medium.com/chainsafe-systems/major-improvement-to-chainsafe-files-ab489d3e52a2",
  Settings: `${SETTINGS_BASE}/:path`,
  SettingsDefault: `${SETTINGS_BASE}`,
  PurchasePlan: "/purchase",
  UserSurvey: "https://shrl.ink/kmAL",
  GeneralFeedbackForm: "https://shrl.ink/gvVJ",
  SharedFolders: "/shared"
}

export const SETTINGS_PATHS = ["profile", "plan", "security"] as const
export type SettingsPath = typeof SETTINGS_PATHS[number]

const FilesRoutes = () => {
  const { isLoggedIn, secured } = useFilesApi()
  const { isNewDevice, publicKey, shouldInitializeAccount } = useThresholdKey()

  const isAuthorized = useMemo(() => isLoggedIn && secured && !!publicKey && !isNewDevice && !shouldInitializeAccount,
    [isLoggedIn, isNewDevice, publicKey, secured, shouldInitializeAccount])

  return (
    <Switch>
      <ConditionalRoute
        path={ROUTE_LINKS.Drive("/")}
        isAuthorized={isAuthorized}
        component={DrivePage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.Bin("/")}
        isAuthorized={isAuthorized}
        component={BinPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.SharedFolders}
        isAuthorized={isAuthorized}
        component={SharedFoldersOverview}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Search("")}
        isAuthorized={isAuthorized}
        component={SearchPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Search(":searchTerm")}
        isAuthorized={isAuthorized}
        component={SearchPage}
        redirectPath={ROUTE_LINKS.Landing}
      />

      <ConditionalRoute
        exact
        path={ROUTE_LINKS.SettingsDefault}
        isAuthorized={isAuthorized}
        component={SettingsPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.Settings}
        isAuthorized={isAuthorized}
        component={SettingsPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.PurchasePlan}
        isAuthorized={isAuthorized}
        component={PurchasePlanPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path='/'
        isAuthorized={!isAuthorized}
        component={LoginPage}
        redirectPath={ROUTE_LINKS.Drive("/")}
        redirectToSource
      />
    </Switch>
  )
}

export default FilesRoutes
