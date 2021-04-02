import React, { useCallback, useState } from "react"
import { createStyles, debounce, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { Button, CloseSvg, CopySvg, Typography } from "@chainsafe/common-components"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import clsx from "clsx"
import { CSFTheme } from "../../../Themes/types"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles(({ animation, breakpoints, constants, palette, typography, zIndex }: CSFTheme) =>
  createStyles({
    root: {
      color: constants.loginModule.textColor,
      width: "100vw",
      "& h1": {
        fontWeight: typography.fontWeight.regular,
        marginBottom: constants.generalUnit,
        color: constants.loginModule.textColor,
        [breakpoints.down("md")]: {
          textAlign: "center",
          marginBottom: constants.generalUnit * 2
        }
      },
      [breakpoints.up("md")]: {
        padding: `${constants.generalUnit * 13.5}px ${constants.generalUnit * 9.5}px`,
        maxWidth: 580
      },
      [breakpoints.down("md")]: {
        padding: constants.generalUnit * 2
      }
    },
    loader: {
      opacity: 0,
      visibility: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      height: "100%",
      width: "100%",
      zIndex: zIndex?.blocker,
      transitionDuration: `${animation.transform}ms`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      "&:before": {
        content: "''",
        display: "block",
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
        zIndex: zIndex?.background,
        backgroundColor: palette.common.black.main,
        opacity: 0.3
      },
      "&.active": {
        opacity: 1,
        visibility: "visible"
      }
    },
    close: {
      position: "absolute",
      cursor: "pointer",
      "& svg": {
        width: 15,
        height: 15,
        stroke: constants.loginModule.textColor
      },
      [breakpoints.up("md")]: {
        top: constants.generalUnit * 3,
        right: constants.generalUnit * 3
      },
      [breakpoints.down("md")]: {
        top: constants.generalUnit * 1.5,
        right: constants.generalUnit * 1.5
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
      justifyContent: "space-between",
      "& > p": {
        maxWidth: `calc(100% - (35px + ${constants.generalUnit * 3}px))`
      }
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
  cancel: () => void
}

const SaveBackupPhrase = ({ className, complete, cancel }: ISaveBackupPhrase) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const { keyDetails, addMnemonicShare } = useThresholdKey()
  const [mnemonic, setMnemonic] = useState("")
  const [loading, setLoading] = useState(false)

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
        setLoading(true)
        const newMnemonic = await addMnemonicShare()
        setLoading(false)
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
      <div onClick={cancel} className={classes.close}>
        <CloseSvg />
      </div>
      <Typography component="h1" variant={desktop ? "h2" : "h4"}>
        <Trans>
          Save backup phrase
        </Trans>
      </Typography>
      <Typography component="p">
        <Trans>
          <b>We can only show you the backup phrase once</b> <br/>
          because it’s generated and isn’t stored on our servers. Please save it somewhere safe!
        </Trans>
      </Typography>
      <section className={classes.phraseSpace} onClick={onSectionClick}>
        {
          mnemonic.length === 0 && !loading ? (
            <Typography className={classes.cta} component="p">
              <Trans>
                Show me the backup phrase
              </Trans>
            </Typography>
          ) : (
            <div className={classes.copyArea}>
              <div className={clsx(
                classes.copiedFlag, {
                  "active": copied
                }
              )}>
                <span>
                  <Trans>
                    Copied!
                  </Trans>
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
      <Button onClick={complete} disabled={mnemonic.length === 0 || loading} loading={loading}>
        <Trans>
          Continue
        </Trans>
      </Button>
    </div>
  )
}

export default SaveBackupPhrase
