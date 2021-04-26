import React, { useState, useCallback } from "react"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import ConciseExplainer from "./ConciseExplainer"
import Complete from "./Complete"
import AuthenticationFactors from "./AuthenticationFactors"
import PasswordSetup from "./PasswordSetup"
import ConfirmSkip from "./ConfirmSkip"
import SaveBackupPhrase from "./SaveBackupPhrase"

interface IInitializeAccount {
  className?: string
}

type InitializeState =   "explainer" |
"authenticationFactors" |
"setUpPassword" |
"skip" |
"backup" |
"complete"

const Content = ({ className }: {
  className?: string
}) => {
  const { addPasswordShare } = useThresholdKey()
  const { resetShouldInitialize } = useThresholdKey()

  const [initializeState, setInitializeState] = useState<InitializeState>("explainer")

  const onSetPassword = useCallback((password: string) =>
    addPasswordShare(password)
      .then(() => {
        setInitializeState("authenticationFactors")
      })
      .catch(console.error)
  , [addPasswordShare])


  switch (initializeState) {
  case "explainer":
    return <ConciseExplainer
      className={className}
      onContinue={() => setInitializeState("authenticationFactors")}
    />
  case "authenticationFactors":
    return <AuthenticationFactors
      className={className}
      goToPassword={() => setInitializeState("setUpPassword")}
      goToMnemonic={() => setInitializeState("backup")}
      goToSkip={() => setInitializeState("skip")}
      goToComplete={() => setInitializeState("complete")}
    />
  case "setUpPassword":
    return <PasswordSetup
      className={className}
      cancel={() => setInitializeState("authenticationFactors")}
      setPassword={onSetPassword}
    />
  case "skip":
    return <ConfirmSkip
      className={className}
      confirm={() => resetShouldInitialize()}
      cancel={() => setInitializeState("authenticationFactors")}
    />
  case "backup":
    return <SaveBackupPhrase
      className={className}
      cancel={() => setInitializeState("authenticationFactors")}
      complete={() => setInitializeState("authenticationFactors")}
    />
  case "complete":
    return <Complete className={className} />
  default:
    return null
  }
}

const InitializeAccount = ({ className }: IInitializeAccount) => <Content className={className} />
export default InitializeAccount
