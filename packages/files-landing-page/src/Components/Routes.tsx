import React from "react"
import { Switch, Route } from "@chainsafe/common-components"
import HomePage from "./Pages/HomePage"
import TermsOfServicePage from "./Pages/TermsOfServicePage"
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage"

export const ROUTE_LINKS = {
  Home: "/",
  Pricing: "/pricing",
  TermsOfService: "/terms-of-service",
  PrivacyPolicy: "/privacy-policy",
}

const Routes = () => {
  return (
    <Switch>
      <Route exact path={ROUTE_LINKS.Home} component={HomePage} />
      <Route
        exact
        path={ROUTE_LINKS.TermsOfService}
        component={TermsOfServicePage}
      />
      <Route
        exact
        path={ROUTE_LINKS.PrivacyPolicy}
        component={PrivacyPolicyPage}
      />
    </Switch>
  )
}

export default Routes
