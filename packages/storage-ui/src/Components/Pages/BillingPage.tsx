import React from "react"
import { Helmet } from "react-helmet-async"
import SubscriptionTab from "../Modules/SubscriptionTab"

const BillingPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Billing - Chainsafe Storage</title>
      </Helmet>
      <SubscriptionTab />
    </>
  )
}

export default BillingPage
