import React from "react"
import { Helmet } from "react-helmet-async"
import SubscriptionTab from "../Modules/SubscriptionTab"

const SubscriptionPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Subscription - Chainsafe Storage</title>
      </Helmet>
      <SubscriptionTab />
    </>
  )
}

export default SubscriptionPage
