import React from "react"
import { Helmet } from "react-helmet-async"
import ApiKeys from "../Modules/ApiKeys"

const ApiKeysPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>API Keys - Chainsafe Storage</title>
      </Helmet>
      <ApiKeys />
    </>
  )
}

export default ApiKeysPage
