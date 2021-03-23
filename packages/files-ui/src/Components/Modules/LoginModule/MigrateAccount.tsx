import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { useState, useCallback } from "react"
import {
  Button,
  TextInput,
  Typography
} from "@chainsafe/common-components"
import clsx from "clsx"
import { useDrive } from "../../../Contexts/DriveContext"
import { useImployApi, useUser } from "@chainsafe/common-contexts"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import ConciseExplainer from "./ConciseExplainer"
import { CSFTheme } from "../../../Themes/types"
import { t, Trans } from "@lingui/macro"

const useStyles = makeStyles(
  ({ constants, breakpoints, palette }: CSFTheme) =>
    createStyles({
      root: {
        padding: `${constants.generalUnit * 4}px ${constants.generalUnit * 4}px`,
        backgroundColor: constants.landing.background,
        boxShadow: constants.landing.boxShadow,
        width: 440,
        [breakpoints.down("md")]: {
          padding: `${constants.generalUnit * 3}px ${constants.generalUnit * 3}px`,
          width: `calc(100vw - ${constants.generalUnit * 4}px)`,
          maxHeight: "100vh",
          overflow: "scroll"
        }
      },
      headerText: {
        textAlign: "center",
        [breakpoints.up("md")]: {
          paddingBottom: constants.generalUnit * 8
        },
        [breakpoints.down("md")]: {
          paddingBottom: constants.generalUnit * 3,
          textAlign: "center"
        }
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
        marginTop: constants.generalUnit * 3
      },
      userContainer: {
        marginTop: constants.generalUnit * 4,
        textAlign: "center"
      },
      logoutButton: {
        textDecoration: "underline",
        border: "none",
        cursor: "pointer",
        backgroundColor: "transparent"
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
  const { validateMasterPassword, logout } = useImployApi()
  const { secureAccountWithMasterPassword } = useDrive()
  const { addPasswordShare } = useThresholdKey()
  const { getProfileTitle } = useUser()
  const [hasShownConciseExplainer, setHasShownConciseExplainer] = useState(false)
  const [masterPassword, setMasterPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const onPasswordChange = useCallback((password: string | number | undefined) => {
    setError("")
    setMasterPassword(password?.toString() || "") 
  }, [])

  const handleSecureAccountWithMasterPassword = async () => {
    if (!masterPassword) return

    setIsLoading(true)

    validateMasterPassword(masterPassword).then(async () => {
      try {
        await addPasswordShare(masterPassword)
        await secureAccountWithMasterPassword(masterPassword)
      } catch (err) {
        console.error(err)
      }
      setIsLoading(false)
    }).catch(() => {
      setIsLoading(false)
      setError(t`Password does not match user account, please double-check and try again.`)
    })
  }

  const onLogout = () => {
    // TODO
    // key details in threshold ket context should be removed
    logout()
  }


  return (
    !hasShownConciseExplainer ? <ConciseExplainer screen="migrate" onLetsDoIt={() => setHasShownConciseExplainer(true)} /> : 
      <section className={clsx(classes.root, className)}>
        <Typography variant="h6" component="h6" className={classes.headerText}>
          <Trans>Encryption Password</Trans>
        </Typography>
        <div>
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
            onClick={handleSecureAccountWithMasterPassword}
            className={clsx(classes.button, classes.belowInput)}
            size="large"
            loading={isLoading}
            disabled={!!error || isLoading}
          >
            <Trans>Continue</Trans>
          </Button>
          <Typography className={classes.error}>
            {error}
          </Typography>
        </div>
        <div className={classes.userContainer}>
          <Typography><Trans>Signed in as:</Trans></Typography>
          <br />
          <Typography>
            <b>{getProfileTitle()}</b>
          </Typography>
          <br />
          <button className={classes.logoutButton} onClick={onLogout}>
            <Trans>Log out</Trans>
          </button>
        </div>
      </section>
  )
}

export default MigrateAccount