import React from "react"
import { Switch, ConditionalRoute } from "@chainsafe/common-components"
import LoginPage from "./Pages/LoginPage"
import SettingsPage from "./Pages/SettingsPage"
import { useImployApi } from "@imploy/common-contexts"
import HomePage from "./Pages/HomePage"
import OAuthCallbackPage from "./Pages/OAuthCallback"
import PlanSelectionPage from "./Pages/plans/PlanSelectionPage"
import { TabKey } from "./Modules/SettingsModule"
import { PLAN_OPTION } from "../Utils/SubscriptionOptions"
import CardPaymentPage from "./Pages/plans/CardPaymentPage"
import CryptoPaymentPage from "./Pages/plans/CryptoPaymentPage"

export const ROUTE_LINKS = {
  Landing: "/",
  PrivacyPolicy: "",
  Terms: "",
  Home: "/home",
  Settings: (tab?: TabKey) => `/settings/${tab ? tab : TabKey.Profile}`,
  ChoosePlan: "/choose-plan/",
  PlanSelected: (planOption: PLAN_OPTION) => `/choose-plan/${planOption}`,
  CardPayment: (planOption: PLAN_OPTION) =>
    `/choose-plan/${planOption}/card-payment`,
  CryptoPayment: (planOption: PLAN_OPTION) =>
    `/choose-plan/${planOption}/crypto-payment`,

  OAuthCallback: "/oauth2/callback/:provider",
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
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.ChoosePlan}
        isAuthorized={isLoggedIn}
        component={PlanSelectionPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.CardPayment(PLAN_OPTION._routeParam)}
        isAuthorized={isLoggedIn}
        component={CardPaymentPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.CryptoPayment(PLAN_OPTION._routeParam)}
        isAuthorized={isLoggedIn}
        component={CryptoPaymentPage}
        redirectPath={ROUTE_LINKS.Landing}
      />
      <ConditionalRoute
        exact
        path={ROUTE_LINKS.Settings(TabKey._routeParam)}
        isAuthorized={isLoggedIn}
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
    </Switch>
  )
}

export default FilesRoutes
