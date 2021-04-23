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

const InitializeAccount: React.FC<IInitializeAccount> = ({
  className
}: IInitializeAccount) => {
  const { addPasswordShare } = useThresholdKey()
  const [initializeState, setInitializeState] = useState<
  "explainer" |
  "authenticationFactors" |
  "setUpPassword" |
  "skip" |
  "backup" |
  "complete"
  >("explainer")
  const { resetShouldInitialize } = useThresholdKey()

  const onSetPassword = useCallback((password: string) =>
    addPasswordShare(password)
      .then(() => {
        setInitializeState("authenticationFactors")
      })
      .catch(console.error)
  , [addPasswordShare])

  return (
    (initializeState === "explainer") ?
      <ConciseExplainer
        className={className}
        onContinue={() => setInitializeState("authenticationFactors")}
      /> :
      (initializeState === "authenticationFactors") ?
        <AuthenticationFactors
          className={className}
          goToPassword={() => setInitializeState("setUpPassword")}
          goToMnemonic={() => setInitializeState("backup")}
          goToSkip={() => setInitializeState("skip")}
          goToComplete={() => setInitializeState("complete")}
        /> :
        (initializeState === "setUpPassword") ?
          <PasswordSetup
            className={className}
            cancel={() => setInitializeState("authenticationFactors")}
            setPassword={onSetPassword}
          /> :
          (initializeState === "skip") ?
            <ConfirmSkip
              className={className}
              confirm={() => resetShouldInitialize()}
              cancel={() => setInitializeState("authenticationFactors")}
            /> :
            (initializeState === "backup") ?
              <SaveBackupPhrase
                className={className}
                cancel={() => setInitializeState("authenticationFactors")}
                complete={() => setInitializeState("authenticationFactors")}
              /> :
              (initializeState === "complete") ?
                <Complete className={className} /> : null
  )
}

export default InitializeAccount
