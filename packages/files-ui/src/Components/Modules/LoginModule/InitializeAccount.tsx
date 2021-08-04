import React, { useState, useCallback } from "react"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import ConciseExplainer from "./ConciseExplainer"
import PasswordSetup from "./PasswordSetup"

interface IInitializeAccount {
  className?: string
}

type InitializeState =   "explainer" | "setUpPassword" | "complete"

const InitializeAccount = ({ className }: IInitializeAccount) => {
  const { addPasswordShare, resetShouldInitialize } = useThresholdKey()
  const [initializeState, setInitializeState] = useState<InitializeState>("explainer")

  const onSetPassword = useCallback((password: string) =>
    addPasswordShare(password)
      .then(() => {
        resetShouldInitialize()
      })
      .catch(console.error)
  , [addPasswordShare, resetShouldInitialize])

  switch (initializeState) {
  case "explainer":
    return <ConciseExplainer
      className={className}
      onContinue={() => setInitializeState("setUpPassword")}
    />
  case "setUpPassword":
    return <PasswordSetup
      className={className}
      cancel={() => setInitializeState("explainer")}
      setPassword={onSetPassword}
    />
  default:
    return null
  }
}

export default InitializeAccount
