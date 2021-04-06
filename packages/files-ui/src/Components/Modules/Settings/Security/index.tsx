import React, { useCallback, useMemo, useState } from "react"
import { CheckCircleSvg, CloseSvg, CrossOutlinedSvg, Grid, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { t, Trans } from "@lingui/macro"
import { useThresholdKey } from "../../../../Contexts/ThresholdKeyContext"
import { SECURITY_QUESTIONS_MODULE_NAME } from "@tkey/security-questions"
import clsx from "clsx"
import PasswordForm from "../../../Elements/PasswordForm"
import useLoggedInAs from "../../hooks/useLoggedInAs"

const useStyles = makeStyles(({ constants, breakpoints, palette, typography }: CSFTheme) =>
  createStyles({
    setOption: {
      width: "100%",
      backgroundColor: palette.additional["gray"][4],
      color: palette.additional["gray"][9],
      padding: constants.generalUnit * 1.5,
      borderRadius: 16,
      marginTop: constants.generalUnit * 1.5,
      "& > div": {
        display: "flex",
        alignItems: "center",
        "& > span": {
          display: "block",
          lineHeight: "16px",
          fontWeight: typography.fontWeight.regular,
          "&:first-child": {
            flex: "1 1 0"
          }
        }
      }
    },
    action: {
      display: "flex",
      alignItems: "center"
    },
    icon: {
      width: 21,
      height: 21,
      marginLeft: constants.generalUnit * 1
    },
    green: {
      stroke: palette.additional.green[6],
      fill: palette.additional.green[6]
    },
    red: {
      stroke: palette.additional.red[6],
      fill: palette.additional.red[6]
    },
    buttonLink: {
      // color: palette.additional["gray"][10],
      outline: "none",
      textDecoration: "underline",
      cursor: "pointer"
    },
    passwordRoot: {
      position: "relative",
      marginTop: constants.generalUnit * 2,
      width: "100%",
      maxWidth: "580px",
      "& p": {
        fontWeight: 400,
        marginBottom: constants.generalUnit * 2
      },
      "& h2": {
        fontWeight: typography.fontWeight.regular,
        marginBottom: constants.generalUnit * 1.5,
        [breakpoints.down("md")]: {
          textAlign: "center"
        }
      }
    },
    close: {
      position: "absolute",
      cursor: "pointer",
      width: 15,
      height: 15,
      stroke: palette.additional["gray"][9],
      [breakpoints.up("md")]: {
        top: 0,
        right: 0
      },
      [breakpoints.down("md")]: {
        top: constants.generalUnit * 1.5,
        right: constants.generalUnit * 1.5
      }
    },
    input: {
      margin: 0,
      width: "100%",
      marginBottom: constants.generalUnit * 1.5
    },
    inputLabel: {
      fontSize: "16px",
      lineHeight: "24px",
      marginBottom: constants.generalUnit
    },
    button: {
      [breakpoints.up("md")]: {
        marginTop: constants.generalUnit * 10
      },
      [breakpoints.down("md")]: {
        marginTop: constants.generalUnit
      }
    },
    warningMessage: {
      marginTop: constants.generalUnit * 2,
      display: "inline-block",
      marginBottom: constants.generalUnit
    },
    changeButton: {
      marginLeft: "0.5rem"
    }
  })
)

interface SecurityProps {
  className?: string
}

const Security = ({ className }: SecurityProps) => {
  // Note should we rename this? it's very specific
  const { keyDetails, addPasswordShare, changePasswordShare } = useThresholdKey()
  // const areSharesMissing = !!keyDetails && keyDetails.requiredShares > 0
  const classes = useStyles()
  const [isSettingPassword, setIsSettingPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const { loggedinAs } = useLoggedInAs()
  const { desktop } = useThemeSwitcher()
  const showWarning = useMemo(() => !!keyDetails && (keyDetails.threshold === keyDetails.totalShares), [keyDetails])
  // TODO this is a dublicate from Missingshares, should be extracted
  const shares = keyDetails
    ? Object.values(keyDetails.shareDescriptions).map((share) => {
      return JSON.parse(share[0])
    })
    : []

  const browserShare = shares.filter((s) => s.module === "webStorage")
  const hasPasswordShare = shares.filter((s) => s.module === SECURITY_QUESTIONS_MODULE_NAME).length > 0
  const onResetPasswordForm = useCallback(() => {
    setIsChangingPassword(false)
    setIsSettingPassword(false)
  }, [])

  const onSetPassword = useCallback(async (password: string) => {
    if (isSettingPassword) {
      await addPasswordShare(password)
      setIsSettingPassword(false)
    }

    if (isChangingPassword) {
      console.log("settingUpPassword", password)
      await changePasswordShare(password)
      setIsChangingPassword(false)
    }
  }, [addPasswordShare, changePasswordShare, isChangingPassword, isSettingPassword])

  return (
    <Grid container>
      <Grid item xs={12} sm={8} md={8}>
        <div
          id="security"
          className={className}
        >
          <Typography
            variant="h4"
            component="h4"
          >
            <Trans>Sign-in methods</Trans>
          </Typography>
          {showWarning && (
            <Typography variant="body1" className={classes.warningMessage}>
              <Trans>
                  Hey! You only have two sign-in methods. If you lose that and have only one left,
                  you will be locked out of your account forever.
              </Trans>
            </Typography>
          )}
          {
            !!loggedinAs && (
              <section className={classes.setOption}>
                <div>
                  <Typography variant="h5">
                    <Trans>
                      Social Sign-in Wallet
                    </Trans>
                  </Typography>
                  {
                    desktop && (
                      <Typography variant="h5">
                        { loggedinAs }
                      </Typography>
                    )
                  }
                  <CheckCircleSvg className={clsx(classes.icon, classes.green)}/>
                </div>
              </section>
            )
          }
          <section className={classes.setOption}>
            <div>
              <Typography variant="h5">
                <Trans>
                    Saved Browser
                </Trans>
              </Typography>
              <Typography variant="h5">
                {browserShare.length} <Trans>Saved</Trans>{" "}
              </Typography>
              { browserShare.length
                ? <CheckCircleSvg className={clsx(classes.icon, classes.green)}/>
                : <CrossOutlinedSvg className={clsx(classes.icon, classes.red)}/>
              }
            </div>
          </section>
          {showWarning && (
            <div>
              <Typography
                variant="body1"
                className={classes.warningMessage}
              >
                <Trans>
                    Add at least one more sign-in method to protect your account for account recovery.
                    You’d only need any two to sign in to Files from any device.
                </Trans>
              </Typography>
            </div>
          )}
          { !isSettingPassword && !isChangingPassword
            ? (
              <section className={classes.setOption}>
                <div>
                  <Typography variant="h5">
                    <Trans>
                        Password
                    </Trans>
                  </Typography>
                  <Typography variant="h5">
                    { !hasPasswordShare
                      ? (
                        <span className={classes.action}>
                          <span
                            className={classes.buttonLink}
                            onClick={() => {setIsSettingPassword(true)}}
                          >
                            <Trans>Set up password</Trans>
                          </span>
                          <CrossOutlinedSvg className={clsx(classes.icon, classes.red)}/>
                        </span>
                      )
                      : (
                        <span className={classes.action}>
                          <Trans>Set up</Trans>
                          <span
                            className={clsx(classes.buttonLink, classes.changeButton)}
                            onClick={() => {setIsChangingPassword(true)}}
                          >
                            <Trans>(Change)</Trans>
                          </span>
                          <CheckCircleSvg className={clsx(classes.icon, classes.green)}/>
                        </span>
                      )
                    }
                  </Typography>
                </div>
              </section>
            )
            : (
              <section className={clsx(classes.passwordRoot, className)}>
                <CloseSvg
                  onClick={onResetPasswordForm}
                  className={classes.close}
                />
                <Typography variant="h4" component="h2">
                  {isChangingPassword
                    ? <Trans>
                      Change password
                    </Trans>
                    : <Trans>
                      Set up a password
                    </Trans>
                  }
                </Typography>
                <PasswordForm
                  setPassword={onSetPassword}
                  buttonLabel={isChangingPassword ? t`Change Password` : t`Set Password`}
                />
              </section>
            )}
        </div>
        {/* <div id="deletion" className={classes.bodyContainer}>
            <div className={classes.deletionBox}>
              <Typography
                variant="h4"
                component="h4"
                className={classes.deletionMargins}
              >
                <Trans>Deletion</Trans>
              </Typography>
              <Typography
                variant="body1"
                component="p"
                className={classes.deletionMargins}
              >
                <Trans>
                  Deleting your account is irreversible. You will lose all your
                  data on files.
                </Trans>
              </Typography>
              <Button
                variant="outline"
                disabled
                className={classes.deletionMargins}
              >
                <Trans>Delete Account</Trans>
              </Button>
            </div>
          </div> */}
      </Grid>
    </Grid>
  )
}

export default Security
