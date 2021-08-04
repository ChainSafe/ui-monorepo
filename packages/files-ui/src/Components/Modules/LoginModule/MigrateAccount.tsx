import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useState, useCallback, SyntheticEvent } from "react"
import {
  Button,
  TextInput,
  Typography
} from "@chainsafe/common-components"
import clsx from "clsx"
import { useFiles } from "../../../Contexts/FilesContext"
import { useFilesApi } from "../../../Contexts/FilesApiContext"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import ConciseExplainer from "./ConciseExplainer"
import { CSFTheme } from "../../../Themes/types"
import { t, Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ constants, breakpoints, palette, typography }: CSFTheme) =>
    createStyles({
      root: {
        padding: `0 ${constants.generalUnit * 15.5}px`,
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
          paddingTop: constants.generalUnit * 6.625,
          paddingBottom: constants.generalUnit * 3
        },
        [breakpoints.down("md")]: {
          paddingTop: constants.generalUnit * 3,
          textAlign: "center"
        }
      },
      form: {
        width: "100%"
      },
      text: {
        ...typography.h5,
        fontWeight: typography.fontWeight.regular,
        paddingBottom: constants.generalUnit * 3
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
        ...typography.h5,
        fontWeight: typography.fontWeight.regular,
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

const MigrateAccount = ({ className }: IMigrateAccount) => {
  const classes = useStyles()
  const { validateMasterPassword } = useFilesApi()
  const { secureAccountWithMasterPassword } = useFiles()
  const { addPasswordShare, logout, resetShouldInitialize } = useThresholdKey()
  const [migrateState, setMigrateState] = useState<"migrate"|"explainer">("migrate")
  const [masterPassword, setMasterPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onPasswordChange = useCallback((password: string | number | undefined) => {
    setError("")
    setMasterPassword(password?.toString() || "")
  }, [])

  const handleSecureAccountWithMasterPassword = useCallback(async (e: SyntheticEvent) => {
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
      setMigrateState("explainer")
      setIsLoading(false)
    } catch (err) {
      console.error(err)
      setError(t`Failed to migrate account, please try again.`)
      setIsLoading(false)
    }
  },
  [addPasswordShare, masterPassword, secureAccountWithMasterPassword, validateMasterPassword])

  const MigrationScreen = useCallback(() =>
    <section className={clsx(classes.root, className)}>
      <form
        onSubmit={handleSecureAccountWithMasterPassword}
        className={classes.form}
      >
        <Typography
          variant="h6"
          component="h6"
          className={classes.headerText}
        >
          <Trans>Hello again!</Trans>
        </Typography>
        <Typography
          variant="h5"
          component="h5"
          className={classes.text}
        >
          <Trans>
            We’ve got a new authentication system in place. All you need to do is enter
            your password again to migrate your credentials over to the new system.
          </Trans>
        </Typography>
        <Typography>
          <Trans>Password</Trans>
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
          onClick={logout}
        >
          <Typography>
            <Trans>
              Sign in with a different account
            </Trans>
          </Typography>
        </div>
      </footer>
    </section>
  , [className, classes, error, handleSecureAccountWithMasterPassword, isLoading, masterPassword, logout, onPasswordChange])

  return (
    <>
      {migrateState === "migrate" && <MigrationScreen/>}
      {migrateState === "explainer" && (
        <ConciseExplainer
          className={className}
          onContinue={resetShouldInitialize}
        />
      )}
    </>
  )
}

export default MigrateAccount
