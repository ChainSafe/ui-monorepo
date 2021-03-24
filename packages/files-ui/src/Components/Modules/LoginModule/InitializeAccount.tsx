import React, { useState } from "react"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { Button, TextInput, Typography } from "@chainsafe/common-components"
import { SECURITY_QUESTIONS_MODULE_NAME } from "@tkey/security-questions"

const InitializeAccount: React.FC = () => {
  const {
    keyDetails,
    addPasswordShare,
    isNewKey,
    addMnemonicShare,
    resetShouldInitialize
  } = useThresholdKey()
  const [password, setPassword] = useState<string | undefined>("")
  const [showOnboardingInfo, setShowOnboardingInfo] = useState(false)
  const [mnemonic, setMnemonic] = useState("")

  const shares = keyDetails
    ? Object.values(keyDetails.shareDescriptions).map((share) => {
      return JSON.parse(share[0])
    })
    : []

  console.log("keyDetails", keyDetails)

  const hasPasswordShare =
    shares.filter((s) => s.module === SECURITY_QUESTIONS_MODULE_NAME).length > 0

  // `shares` object above only contains security question and local device shares
  // The service provider share as well as backup mnemonic do not appear in this share 
  // array. Note: Files accounts have one service provider by default.
  // If an account has totalShares - shares.length === 1 this indicates that a
  // mnemonic has not been set up for the account. If totalShares - shares.length === 2
  // this indicates that a mnemonic has already been set up. "2" corresponds here to one
  // service provider (default), and one mnemonic.
  const hasMnemonicShare = keyDetails && (keyDetails.totalShares - shares.length > 1)

  const handleSetPassword = async () => {
    if (!password) return
    await addPasswordShare(password)
  }

  const handleSetMnemonic = async () => {
    const newMnemonic = await addMnemonicShare()
    setMnemonic(newMnemonic)
  }

  return (
    <div>
      {isNewKey && !showOnboardingInfo ? (
        <>
          <Typography variant="h5">This is a new account</Typography>
          <Typography>Lorem ipsum setup info</Typography>
          <Button onClick={() => setShowOnboardingInfo(true)}>Lets go</Button>
        </>
      ) : (
        <>
          <Typography variant="h5">Min number of shares</Typography>
          <Typography>
              Add more shares to ensure you dont get locked out of your account
          </Typography>
          {!hasPasswordShare && (
            <div>
              <label>Enter you account password:</label>
              <TextInput
                type='password'
                value={password}
                onChange={(val) => setPassword(val?.toString())}
              />
              <Button onClick={handleSetPassword}>Submit</Button>
            </div>
          )}
          {!hasMnemonicShare && (
            <div>
              <Button onClick={handleSetMnemonic} disabled={!!mnemonic}>
                  Generate mnemonic
              </Button>
              {mnemonic && <span>{mnemonic}</span>}
            </div>
          )}
          <Button onClick={resetShouldInitialize}>
            {keyDetails?.totalShares === keyDetails?.threshold
              ? "Skip for now"
              : "Finish"}
          </Button>
        </>
      )}
    </div>
  )
}

export default InitializeAccount
