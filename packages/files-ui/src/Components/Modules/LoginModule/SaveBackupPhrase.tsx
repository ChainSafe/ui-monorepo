import React, { useEffect, useState } from "react"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Button, Typography } from "@chainsafe/common-components"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import clsx from "clsx"

const useStyles = makeStyles(() =>
  createStyles({
    root:{
    }
  })
)

interface ISaveBackupPhrase {
  className?: string
}

const SaveBackupPhrase: React.FC<ISaveBackupPhrase> = ({
  className
}: ISaveBackupPhrase) => {
  const classes = useStyles()
  const {
    keyDetails,
    addMnemonicShare
  } = useThresholdKey()
  const [mnemonic, setMnemonic] = useState("")

  const shares = keyDetails
    ? Object.values(keyDetails.shareDescriptions).map((share) => {
      return JSON.parse(share[0])
    })
    : []

  // `shares` object above only contains security question and local device shares
  // The service provider share as well as backup mnemonic do not appear in this share 
  // array. Note: Files accounts have one service provider by default.
  // If an account has totalShares - shares.length === 1 this indicates that a
  // mnemonic has not been set up for the account. If totalShares - shares.length === 2
  // this indicates that a mnemonic has already been set up. "2" corresponds here to one
  // service provider (default), and one mnemonic.
  const hasMnemonicShare = keyDetails && (keyDetails.totalShares - shares.length > 1)

  useEffect(() => {
    const init = async () => {
      if (!hasMnemonicShare) {
        const newMnemonic = await addMnemonicShare()
        setMnemonic(newMnemonic)
      }
    }
    init()
  }, [addMnemonicShare, setMnemonic, hasMnemonicShare])

  return (
    <div className={clsx(classes.root, className)}>
      <Typography component="h1">
        Save backup phrase
      </Typography>
      <Typography component="p">
        We can only show you the backup phrase once because it’s generated and isn’t stored on our servers. Please save it somewhere safe!
      </Typography>

      <Button>
        Continue
      </Button>
    </div>
  )
}

export default SaveBackupPhrase
