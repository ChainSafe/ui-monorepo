import React, { useState, useCallback } from "react"
import * as yup from "yup"
import {
  FormikTextInput,
  Grid,
  Button,
  Typography,
} from "@imploy/common-components"
import {
  makeStyles,
  ITheme,
  createStyles,
  debounce,
} from "@imploy/common-themes"
import { LockIcon, CopyIcon } from "@imploy/common-components"
import { Formik, Form } from "formik"
import { Profile } from "@imploy/common-contexts"
import { Trans } from "@lingui/macro"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      marginTop: theme.constants.generalUnit * 2,
      marginBottom: 160,
      [theme.breakpoints.down("md")]: {
        paddingRight: theme.constants.generalUnit,
      },
    },
    bodyContainer: {
      padding: `${theme.constants.generalUnit * 3}px 0px`,
      borderBottom: `1px solid ${theme.palette.additional["gray"][4]}`,
      [theme.breakpoints.down("md")]: {
        borderBottom: "none",
      },
    },
    boxContainer: {
      marginBottom: theme.constants.generalUnit * 4,
    },
    labelContainer: {
      marginBottom: theme.constants.generalUnit,
    },
    walletAddressContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: theme.constants.generalUnit,
    },
    input: {
      width: "100%",
      margin: 0,
      marginBottom: theme.constants.generalUnit,
    },
    label: {
      marginBottom: theme.constants.generalUnit * 1,
      fontSize: 20,
    },
    profileBox: {
      maxWidth: 420,
    },
    deletionBox: {
      maxWidth: 300,
    },
    copyBox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      color: theme.palette.text.secondary,
    },
    deletionMargins: {
      marginBottom: theme.constants.generalUnit * 2,
    },
    button: {
      backgroundColor: theme.palette.common.black.main,
      color: theme.palette.common.white.main,
      width: 200,
      margin: `0px ${theme.constants.generalUnit * 0.5}px ${
        theme.constants.generalUnit * 1
      }px`,
    },
    icon: {
      fontSize: "20px",
      margin: "-2px 2px 0 2px",
    },
    copyIcon: {
      fontSize: "14px",
      [theme.breakpoints.down("md")]: {
        fontSize: "18px",
        fill: theme.palette.additional["gray"][8],
      },
    },
    publicAddress: {
      color: theme.palette.additional["gray"][8],
      overflowWrap: "break-word",
      wordBreak: "break-all",
      paddingRight: theme.constants.generalUnit * 2,
      width: "90%",
      ...theme.typography.body1,
      [theme.breakpoints.down("md")]: {
        ...theme.typography.body2,
      },
    },
  }),
)

interface IProfileProps {
  profile: Profile
  handleValueChange(e: React.ChangeEvent<HTMLInputElement>): void
  onUpdateProfile(firstName: string, lastName: string, email: string): void
  updatingProfile: boolean
}

const ProfileView: React.FC<IProfileProps> = (props) => {
  const { profile, onUpdateProfile, updatingProfile } = props
  const [copied, setCopied] = useState(false)
  const classes = useStyles()

  const debouncedSwitchCopied = useCallback(
    debounce(() => setCopied(false), 3000),
    [],
  )

  const copyAddress = async () => {
    if (profile.publicAddress) {
      try {
        await navigator.clipboard.writeText(profile.publicAddress)
        setCopied(true)
        debouncedSwitchCopied()
      } catch (err) {}
    }
  }

  const profileWeb2Validation = yup.object().shape({
    email: yup.string().email("Email is invalid").required("Email is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
  })

  const profileWeb3Validation = yup.object().shape({
    email: yup.string().email("Email is invalid").required("Email is required"),
  })

  return (
    <Grid container>
      <Grid item xs={12} sm={10} md={8}>
        <div className={classes.container}>
          <div id="profile" className={classes.bodyContainer}>
            <div className={classes.profileBox}>
              <Formik
                initialValues={{
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                  email: profile.email,
                }}
                onSubmit={(values) => {
                  onUpdateProfile(
                    values.firstName || "",
                    values.lastName || "",
                    values.email || "",
                  )
                }}
                validationSchema={
                  profile.publicAddress
                    ? profileWeb3Validation
                    : profileWeb2Validation
                }
              >
                <Form>
                  {profile.publicAddress ? (
                    <div className={classes.boxContainer}>
                      <div className={classes.walletAddressContainer}>
                        <Typography variant="body1" className={classes.label}>
                          <Trans>Wallet address</Trans>
                        </Typography>
                        {copied && (
                          <Typography>
                            <Trans>Copied!</Trans>
                          </Typography>
                        )}
                      </div>
                      <div className={classes.copyBox} onClick={copyAddress}>
                        <Typography
                          variant="body1"
                          component="p"
                          className={classes.publicAddress}
                        >
                          {profile.publicAddress}
                        </Typography>
                        <CopyIcon className={classes.copyIcon} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className={classes.boxContainer}>
                        <FormikTextInput
                          placeholder="first name"
                          name="firstName"
                          size="medium"
                          className={classes.input}
                          labelClassName={classes.label}
                          label="First name"
                        />
                      </div>
                      <div className={classes.boxContainer}>
                        <FormikTextInput
                          placeholder="last name"
                          name="lastName"
                          size="medium"
                          className={classes.input}
                          labelClassName={classes.label}
                          label="Last name"
                        />
                      </div>
                    </>
                  )}
                  <div className={classes.boxContainer}>
                    <FormikTextInput
                      placeholder="email"
                      name="email"
                      size="medium"
                      className={classes.input}
                      labelClassName={classes.label}
                      label="Email"
                    />
                  </div>

                  <Button
                    className={classes.button}
                    size="large"
                    type="submit"
                    disabled={updatingProfile}
                  >
                    <LockIcon className={classes.icon} />
                    {"  "}
                    <Typography variant="button">
                      <Trans>Save changes</Trans>
                    </Typography>
                  </Button>
                </Form>
              </Formik>
            </div>
          </div>
          <div id="deletion" className={classes.bodyContainer}>
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
                  Deleting you account is irreversible. You will lose all your
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
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default ProfileView
