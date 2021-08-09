import React, { useCallback } from "react"
import { Button, CopySvg, Loading, Typography } from "@chainsafe/common-components"
import { useState } from "react"
import { createStyles, debounce, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../Themes/types"
import { t, Trans } from "@lingui/macro"
import { useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import clsx from "clsx"

const useStyles = makeStyles(({ animation, constants, palette, zIndex }: CSFTheme) =>
  createStyles({
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
        fill: palette.primary.main
      }
    },
    loader: {
      display: "flex",
      alignItems: "center",
      "& svg": {
        marginRight: constants.generalUnit
      }
    }
  })
)

interface Props {
    buttonLabel?: string
    onComplete: () => void
}

const MnemonicForm = ({ buttonLabel, onComplete }: Props) => {
  const classes = useStyles()
  const displayButtonLabel = buttonLabel || t`Continue`
  const [isLoading, setIsLoading] = useState(false)
  const { addMnemonicShare, hasMnemonicShare } = useThresholdKey()
  const [mnemonic, setMnemonic] = useState("")
  const [copied, setCopied] = useState(false)
  const debouncedSwitchCopied = debounce(() => setCopied(false), 3000)

  const onSectionClick = useCallback(async () => {
    if (mnemonic.length === 0) {
      if (!hasMnemonicShare) {
        setIsLoading(true)
        const newMnemonic = await addMnemonicShare()
        setMnemonic(newMnemonic)
        setIsLoading(false)
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
  }, [mnemonic, hasMnemonicShare, setIsLoading, addMnemonicShare, debouncedSwitchCopied])

  return (
    <>
      <section
        className={clsx(classes.phraseSpace, "phraseSection")}
        onClick={onSectionClick}
      >
        { isLoading
          ? (
            <Typography
              component="p"
              className={classes.loader}
            >
              <Loading type="inherit"
                size={16} />
              <Trans>
                Generating…
              </Trans>
            </Typography>
          )
          : (
            mnemonic.length === 0
              ? (
                <Typography
                  className={classes.cta}
                  component="p"
                >
                  <Trans>
                    Generate backup secret phrase
                  </Trans>
                </Typography>
              )
              : (
                <div className={classes.copyArea}>
                  <div className={clsx(classes.copiedFlag, { "active": copied })}>
                    <span>
                      <Trans>
                        Copied!
                      </Trans>
                    </span>
                  </div>
                  <Typography component="p">
                    {mnemonic}
                  </Typography>
                  <CopySvg className={clsx(classes.copyIcon, { "active": copied })} />
                </div>
              )
          )}
      </section>
      {!!mnemonic.length && (
        <Button
          variant="primary"
          onClick={onComplete}
        >
          {displayButtonLabel}
        </Button>
      )}
    </>
  )
}

export default MnemonicForm
