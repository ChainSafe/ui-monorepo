import React, { useMemo } from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import SettingsPage from "./Pages/SettingsPage"
import { useFilesApi }  from "../Contexts/FilesApiContext"
import DrivePage from "./Pages/DrivePage"
import SearchPage from "./Pages/SearchPage"
import BinPage from "./Pages/BinPage"
import ShareFilesPage from "./Pages/SharedFilesPage"
import SharedFoldersPage from "./Pages/SharedFoldersPage"
import BillingHistory from "./Pages/BillingHistory"
import LinkSharingLanding from "./Pages/LinkSharingLanding"
import { NonceResponsePermission } from "@chainsafe/files-api-client"
import { useThresholdKey } from "../Contexts/ThresholdKeyContext"

export const SETTINGS_BASE = "/settings"
export const LINK_SHARING_BASE = "/link-sharing"
const CHAINSAFE_LANDING = "https://chainsafe.io/"

export const ROUTE_LINKS = {
  Landing: "/",
  PrivacyPolicy: "https://files.chainsafe.io/privacy-policy",
  Terms: "https://files.chainsafe.io/terms-of-service",
  ChainSafe: CHAINSAFE_LANDING,
  ProductPlans: `${CHAINSAFE_LANDING}`,
  Drive: (rawCurrentPath: string) => `/drive${rawCurrentPath}`,
  Bin: (rawBinPath: string) => `/bin${rawBinPath}`,
  Search: (rawSearchTerm: string) => `/search/${rawSearchTerm}`,
  ApplyCryptography: "https://medium.com/chainsafe-systems/major-improvement-to-chainsafe-files-ab489d3e52a2",
  Settings: `${SETTINGS_BASE}/:path`,
  SettingsDefault: `${SETTINGS_BASE}`,
  SettingsPath: (settingsPath: SettingsPath) => `${SETTINGS_BASE}/${settingsPath}`,
  BillingHistory: "/billing-history",
  UserSurvey: "https://calendly.com/colinschwarz/chainsafe-files-chat",
  Plans: "/plans",
  SharedFolders: "/shared-overview",
  SharedFolderBrowserRoot: "/shared",
  SharingLink: (permission: NonceResponsePermission, jwt: string, bucketEncryptionKey: string) =>
    `${LINK_SHARING_BASE}/${permissionPath(permission)}/${encodeURIComponent(jwt)}#${encodeURIComponent(bucketEncryptionKey)}`,
  SharedFolderExplorer: (bucketId: string, rawCurrentPath: string) => {
    // bucketId should not have a / at the end
    // rawCurrentPath can be empty, or /
    const adjustedRawCurrentPath = !rawCurrentPath ? "/" : rawCurrentPath
    return `/shared/${bucketId}${adjustedRawCurrentPath}`
  },
  DiscordInvite: "https://discord.gg/zAEY37fNb2",
  SubscriptionWhitelistForm: "https://chainsafe.typeform.com/to/unZ0veao"
}

export const permissionPath = (permission: NonceResponsePermission) => permission === "read" ? "read" : "edit"
export const SETTINGS_PATHS = ["profile", "plan", "security", "display"] as const
export type SettingsPath = typeof SETTINGS_PATHS[number]

const FilesRoutes = () => {
  const { isLoggedIn, secured } = useFilesApi()
  const { isNewDevice, publicKey, shouldInitializeAccount } = useThresholdKey()

  const isAuthorized = useMemo(() => isLoggedIn && secured && !!publicKey && !isNewDevice && !shouldInitializeAccount,
    [isLoggedIn, isNewDevice, publicKey, secured, shouldInitializeAccount])
  return (
    <Switch>
      <ConditionalRoute
        path={LINK_SHARING_BASE}
        isAuthorized={isAuthorized}
        component={LinkSharingLanding}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.BillingHistory}
        isAuthorized={isAuthorized}
        component={BillingHistory}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.SharedFolders}
        isAuthorized={isAuthorized}
        component={SharedFoldersPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        path={ROUTE_LINKS.SharedFolderBrowserRoot}
        isAuthorized={isAuthorized}
        component={ShareFilesPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
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
        path={ROUTE_LINKS.Landing}
        isAuthorized={!isAuthorized}
        component={LoginPage}
        redirectPath={ROUTE_LINKS.Drive("/")}
        redirectToSource
      />
    </Switch>
  )
}

export default FilesRoutes
