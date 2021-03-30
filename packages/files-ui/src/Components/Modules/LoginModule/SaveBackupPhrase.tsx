import React, { useCallback, useState } from "react"
import { createStyles, debounce, makeStyles } from "@chainsafe/common-theme"
import { Button, CopySvg, Typography } from "@chainsafe/common-components"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import clsx from "clsx"
import { CSFTheme } from "../../../Themes/types"

const useStyles = makeStyles(({
  animation,
  constants,
  palette,
  typography,
  zIndex
}: CSFTheme) =>
  createStyles({
    root: {
      padding: `${constants.generalUnit * 13.5}px ${constants.generalUnit * 9.5}px`,
      color: constants.loginModule.textColor,
      "& h1": {
        fontWeight: typography.fontWeight.regular,
        marginBottom: constants.generalUnit
      }
    },
    phraseSpace: {
      cursor: "pointer",
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      minHeight: 123,
      borderRadius: 10,
      backgroundColor: constants.loginModule.itemBackground,
      color: constants.loginModule.textColor,
      padding: `${constants.generalUnit}px ${constants.generalUnit * 3}px`,
      marginTop: constants.generalUnit * 3,
      marginBottom: constants.generalUnit * 4
    },
    cta: {
      textDecoration: "underline"
    },
    copyArea: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    copiedFlag: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      left: "50%",
      top: 0,
      position: "absolute",
      transform: "translate(-50%, -50%)",
      zIndex: zIndex?.layer1,
      transitionDuration: `${animation.transform}ms`,
      opacity: 0,
      visibility: "hidden",
      backgroundColor: constants.loginModule.flagBg,
      color: constants.loginModule.flagText,
      padding: `${constants.generalUnit / 2}px ${constants.generalUnit}px`,
      borderRadius: 2,
      "&:after": {
        transitionDuration: `${animation.transform}ms`,
        content: "''",
        position: "absolute",
        top: "100%",
        left: "50%",
        transform: "translate(-50%,0)",
        width: 0,
        height: 0,
        borderLeft: "5px solid transparent",
        borderRight: "5px solid transparent",
        borderTop: `5px solid ${constants.loginModule.flagBg}`
      },
      "&.active": {
        opacity: 1,
        visibility: "visible"
      }
    },
    copyIcon: {
      transitionDuration: `${animation.transform}ms`,
      fill: constants.loginModule.iconColor,
      height: 35,
      width: 35,
      marginLeft: constants.generalUnit * 3,
      "&.active": {
        fill: palette.success.main
      }
    }
  })
)

interface ISaveBackupPhrase {
  className?: string
  complete: () => void
}

const SaveBackupPhrase: React.FC<ISaveBackupPhrase> = ({
  className,
  complete
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

  const [copied, setCopied] = useState(false)
  const debouncedSwitchCopied = debounce(() => setCopied(false), 3000)
  
  const onSectionClick = useCallback(async () => {
    if (mnemonic.length === 0) {
      if (!hasMnemonicShare) {
        const newMnemonic = await addMnemonicShare()
        setMnemonic(newMnemonic)
      }
    } else {
      try {
        await navigator.clipboard.writeText(mnemonic)
        setCopied(true)
        debouncedSwitchCopied()
      } catch (err) {
        console.error(err)
      }
    }
  }, [debouncedSwitchCopied, hasMnemonicShare, mnemonic, addMnemonicShare])


  return (
    <div className={clsx(classes.root, className)}>
      <Typography component="h1" variant="h2">
        Save backup phrase
      </Typography>
      <Typography component="p">
        <b>We can only show you the backup phrase once</b> <br/> 
        because it’s generated and isn’t stored on our servers. Please save it somewhere safe!
      </Typography>
      <section className={classes.phraseSpace} onClick={onSectionClick}>
        {
          mnemonic.length === 0 ? (
            <Typography className={classes.cta} component="p">
              Show me the backup phrase
            </Typography>
          ) : (
            <div className={classes.copyArea}>
              <div className={clsx(
                classes.copiedFlag, {
                  "active": copied
                }
              )}>
                <span>
                  Copied!
                </span>
              </div>
              <Typography component="p">
                {mnemonic}
              </Typography>
              <CopySvg className={clsx(classes.copyIcon, {
                "active": copied
              })} />
            </div>
          )
        }
      </section>
      <Button onClick={complete} disabled={mnemonic.length === 0}>
        Continue
      </Button>
    </div>
  )
}

export default SaveBackupPhrase
