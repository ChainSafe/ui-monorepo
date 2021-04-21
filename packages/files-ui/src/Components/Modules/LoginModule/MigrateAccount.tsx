import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useState, useCallback, SyntheticEvent } from "react"
import {
  Button,
  TextInput,
  Typography
} from "@chainsafe/common-components"
import clsx from "clsx"
import { useDrive } from "../../../Contexts/DriveContext"
import { useImployApi } from "@chainsafe/common-contexts"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import ConciseExplainer from "./ConciseExplainer"
import { CSFTheme } from "../../../Themes/types"
import { t, Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ constants, breakpoints, palette }: CSFTheme) =>
    createStyles({
      root: {
        padding: `0 ${constants.generalUnit * 4}px`,
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        [breakpoints.up("md")]: {
          maxWidth: 580
        },
        [breakpoints.down("md")]: {
          padding: `0 ${constants.generalUnit * 3}px`
        }
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
      form: {
        width: "100%"
      },
      text: {
        display: "inline-block",
        textAlign: "center"
      },
      textInput:{
        width: "100%",
        margin: 0
      },
      belowInput: {
        margin: "auto",
        marginTop: constants.generalUnit * 4
      },
      inputLabel: {
        fontSize: 16,
        lineHeight: 24,
        color: palette.additional["gray"][8],
        marginBottom: constants.generalUnit
      },
      error: {
        display: "inline-block",
        padding: `${constants.generalUnit * 4}px 0`
      },
      button: {
        width: "100%",
        marginTop: constants.generalUnit * 4
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
      }
    })
)

interface IMigrateAccount {
  className?: string
}

const MigrateAccount: React.FC<IMigrateAccount> = ({
  className
}: IMigrateAccount) => {
  const classes = useStyles()
  const { validateMasterPassword } = useImployApi()
  const { secureAccountWithMasterPassword } = useDrive()
  const { addPasswordShare, logout, resetShouldInitialize } = useThresholdKey()
  const [hasShownConciseExplainer, setHasShownConciseExplainer] = useState(false)
  const [masterPassword, setMasterPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onPasswordChange = useCallback((password: string | number | undefined) => {
    setError("")
    setMasterPassword(password?.toString() || "")
  }, [])

  const handleSecureAccountWithMasterPassword = async (e: SyntheticEvent) => {
    e.preventDefault()

    if (!masterPassword) return
    setIsLoading(true)
    try {
      const isMasterPasswordValid = await validateMasterPassword(masterPassword)
      if (!isMasterPasswordValid) {
        setIsLoading(false)
        setError(t`Password does not match user account, please double-check and try again.`)
        return
      }
      await addPasswordShare(masterPassword)
      await secureAccountWithMasterPassword(masterPassword)
      resetShouldInitialize()
      setIsLoading(false)
    } catch (err) {
      console.error(err)
      setError(t`Failed to migrate account, please try again.`)
      setIsLoading(false)
    }
  }

  const onLogout = () => {
    logout()
  }


  return (
    !hasShownConciseExplainer
      ? <ConciseExplainer
        className={className}
        onContinue={() => setHasShownConciseExplainer(true)}
      />
      : <section className={clsx(classes.root, className)}>
        <form
          onSubmit={handleSecureAccountWithMasterPassword}
          className={classes.form}
        >
          <Typography
            variant="h6"
            component="h6"
            className={classes.headerText}
          >
            <Trans>Encryption Password</Trans>
          </Typography>
          <Typography className={clsx(classes.text)}>
            <Trans>Enter password:</Trans>
          </Typography>
          <TextInput
            className={classes.textInput}
            value={masterPassword}
            onChange={onPasswordChange}
            type="password"
          />
          <Button
            variant="primary"
            onClick={handleSecureAccountWithMasterPassword}
            className={clsx(classes.button, classes.belowInput)}
            size="large"
            loading={isLoading}
            disabled={!!error || isLoading}
            type="submit"
          >
            <Trans>Continue</Trans>
          </Button>
          <Typography className={classes.error}>
            {error}
          </Typography>
        </form>
        <footer className={classes.footer}>
          <div
            className={classes.buttonLink}
            onClick={onLogout}
          >
            <Typography>
              <Trans>
                Sign in with a different account
              </Trans>
            </Typography>
          </div>
        </footer>
      </section>
  )
}

export default MigrateAccount
