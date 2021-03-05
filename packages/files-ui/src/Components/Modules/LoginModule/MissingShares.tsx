import React, { useState } from "react"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { Button, TextInput } from "@chainsafe/common-components"
import {SECURITY_QUESTIONS_MODULE_NAME} from "@tkey/security-questions"

const MissingShares: React.FC = () => {
  const {
    keyDetails,
    inputPasswordShare,
    inputMnemonicShare
  } = useThresholdKey()
  const [password, setPassword] = useState<string>("")
  const [mnemonic, setMnemonic] = useState<string>("")

  const shares = keyDetails
    ? Object.values(keyDetails.shareDescriptions).map((share) => {
      return JSON.parse(share[0])
    })
    : []

  const hasPasswordShare =
    shares.filter((s) => s.module === SECURITY_QUESTIONS_MODULE_NAME).length > 0

  const handleSubmitPassword = async () => {
    if (!password) return
    await inputPasswordShare(password)
  }

  const handleSubmitMnemonicShare = async () => {
    if (!mnemonic) return
    await inputMnemonicShare(mnemonic)
  }

  return (
    <div>
      {hasPasswordShare && (
        <>
          <label>Enter you account password:</label>
          <TextInput
            value={password}
            onChange={(val) =>
              val ? setPassword(val.toString()) : setPassword("")
            }
          />
          <Button onClick={handleSubmitPassword}>Submit</Button>
        </>
      )}
      <>
        <label>Enter you backup phrase:</label>
        <TextInput
          value={mnemonic}
          onChange={(val) =>
            val ? setMnemonic(val.toString()) : setMnemonic("")
          }
        />
        <Button onClick={handleSubmitMnemonicShare}>Submit</Button>
      </>
    </div>
  )
}

export default MissingShares
