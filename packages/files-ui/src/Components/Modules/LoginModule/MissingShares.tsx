import React, { ChangeEvent, useCallback, useState } from "react"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { Button, TextInput, Typography } from "@chainsafe/common-components"
import { SECURITY_QUESTIONS_MODULE_NAME } from "@tkey/security-questions"
import { Trans } from "@lingui/macro"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import clsx from "clsx"

const useStyles = makeStyles(({ breakpoints, constants, palette }: CSFTheme) =>
  createStyles({
    content:{
      width: "100%"
    },
    buttonSection: {
      [breakpoints.up("md")]: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      },
      [breakpoints.down("md")]: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly"
      }
    },
    button: {
      width: 240,
      marginBottom: constants.generalUnit * 2,
      [breakpoints.up("md")]: {
        backgroundColor: palette.common.black.main,
        color: palette.common.white.main
      },
      [breakpoints.down("md")]: {
        backgroundColor: palette.common.black.main,
        color: palette.common.white.main
      }
    },
    buttonWrapper: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginTop: constants.generalUnit * 4,
      marginBottom: constants.generalUnit * 4
    },
    headerText: {
      textAlign: "center",
      [breakpoints.up("md")]: {
        paddingTop: constants.generalUnit * 4,
        paddingBottom: constants.generalUnit * 8
      },
      [breakpoints.down("md")]: {
        paddingTop: constants.generalUnit * 3,
        paddingBottom: constants.generalUnit * 3,
        textAlign: "center"
      }
    },
    text: {
      display: "inline-block",
      paddingLeft: constants.generalUnit * 4,
      paddingRight: constants.generalUnit * 4,
      textAlign: "center",
      [breakpoints.down("md")]: {
        paddingLeft: 0,
        paddingRight: 0,
        "&.label": {
          paddingLeft: constants.generalUnit * 4
        }
      }
    },
    footer: {
      textAlign: "center",
      marginTop: constants.generalUnit * 2,
      padding: `${constants.generalUnit * 2.5}px ${constants.generalUnit * 1.5}px`,
      width: "100%"
    },
    buttonLink: {
      color: palette.additional["gray"][10],
      outline: "none",
      textDecoration: "underline",
      cursor: "pointer"
    },
    form: {
      
    },
    textInput:{
      width: "100%",
      margin: 0,
      paddingLeft: constants.generalUnit*4,
      paddingRight: constants.generalUnit*4
    },
    belowInput: {
      margin: "auto",
      marginTop: constants.generalUnit * 4
    },
    textAreaContainer: {
      marginTop: constants.generalUnit,
      paddingLeft: constants.generalUnit * 4,
      paddingRight: constants.generalUnit * 4,
      "& > textarea" : {
        width: "100%",
        height: constants.generalUnit * 10
      }
    }
  }))

const MissingShares: React.FC = () => {
  const { keyDetails, inputPasswordShare, inputMnemonicShare } = useThresholdKey()
  const [password, setPassword] = useState("")
  const [mnemonic, setMnemonic] = useState("")
  const [withMnemonic, setWithMnemonic] = useState(false)
  const [withPassword, setWithPassword] = useState(false)
  const classes = useStyles()
  const { logout } = useThresholdKey()
  const [isLoading, setIsLoading] = useState(false)
  
  const shares = keyDetails
    ? Object.values(keyDetails.shareDescriptions).map((share) => {
      return JSON.parse(share[0])
    })
    : []

  const hasPasswordShare = shares.filter((s) => s.module === SECURITY_QUESTIONS_MODULE_NAME).length > 0

  const handleSubmitPassword = async () => {
    if (!password) return
    setIsLoading(true)
    await inputPasswordShare(password)
  }

  const handleSubmitMnemonicShare = async () => {
    if (!mnemonic) return
    setIsLoading(true)
    await inputMnemonicShare(mnemonic)
  }

  const onPasswordChange = useCallback((password: string | number | undefined) => {
    setPassword(password?.toString() || "") 
  }, [])

  const onMnemonicChange = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    console.log("event", event.currentTarget.value)
    setMnemonic(event.currentTarget.value) 
  }, [])

  const onResetMethod = useCallback(() => {
    setMnemonic("") 
    setPassword("")
    setWithMnemonic(false)
    setWithPassword(false)
  }, [])

  return (
    <>
      <div className={classes.content}>
        <Typography
          variant="h6"
          component="h1"
          className={classes.headerText}
        >
          <Trans>Sign in</Trans>
        </Typography>
        { !withMnemonic && !withPassword && (
          <>
            <Typography className={classes.text}>  
              <Trans>
                Looks like you’re signing in from a new browser.
                Please choose one of the following to continue:
              </Trans>
            </Typography>
            <div className={classes.buttonWrapper}>
              {hasPasswordShare && (
                <Button                   
                  className={classes.button}
                  variant="primary"
                  size="large"
                  onClick={() => setWithPassword(true)}>
                  <Trans>Enter a password</Trans>
                </Button>
              )}
              <Button 
                className={classes.button}
                variant="primary"
                size="large"
                onClick={() => setWithMnemonic(true)}>
                <Trans>Restore with backup phrase</Trans>
              </Button>
            </div>
            <Typography className={classes.text}>  
              <Trans>
                Or confirm by signing into your Files on any
                browser you’ve used before.
              </Trans>
            </Typography>
          </>
        )}
        {withPassword && (
          <div className={classes.form}>
            <Typography className={clsx(classes.text, "label")}>
              <Trans>Enter you account password:</Trans>
            </Typography>
            <TextInput
              className={classes.textInput}
              value={password}
              onChange={onPasswordChange}
              type={"password"}
            />
            <Button
              onClick={handleSubmitPassword}
              className={clsx(classes.button, classes.belowInput)}
              size="large"
              loading={isLoading}
              disabled={isLoading}
            >
              <Trans>Continue</Trans>
            </Button>

          </div>
        )}
        {withMnemonic && (
          <div className={classes.form}>
            <Typography className={clsx(classes.text, "label")}>
              <Trans>Enter you backup phrase:</Trans>
            </Typography>
            <div className={classes.textAreaContainer}>
              <textarea
                value={mnemonic}
                onChange={onMnemonicChange}
              />
            </div>
            <Button
              onClick={handleSubmitMnemonicShare}
              className={clsx(classes.button, classes.belowInput)}
              size="large"
              loading={isLoading}
              disabled={isLoading}
            >
              <Trans>Continue</Trans>
            </Button>
          </div>
        )}
      </div>
      <footer className={classes.footer}>
        { !withMnemonic && !withPassword && !isLoading && (
          <div
            className={classes.buttonLink}
            onClick={logout}
          >
            <Typography>
              <Trans>
                Sign in with a different account
              </Trans>
            </Typography>
          </div>
        )}
        { (withMnemonic || withPassword) && !isLoading && (
          <div
            className={classes.buttonLink}
            onClick={onResetMethod}
          >
            <Typography>
              <Trans>
                Try another method
              </Trans>
            </Typography>
          </div>
        )}
      </footer>
    </>
  )
}

export default MissingShares

