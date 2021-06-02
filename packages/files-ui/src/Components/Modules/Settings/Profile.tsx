import React, { useState, useCallback } from "react"
import * as yup from "yup"
import {
  FormikTextInput,
  Grid,
  Button,
  Typography,
  useToaster,
  RadioInput
} from "@chainsafe/common-components"
import {
  makeStyles,
  createStyles,
  debounce,
  useThemeSwitcher
} from "@chainsafe/common-theme"
import { LockIcon, CopyIcon } from "@chainsafe/common-components"
import { Formik, Form } from "formik"
import { useUser } from "../../../Contexts/UserContext"
import { t, Trans } from "@lingui/macro"
import { centerEllipsis } from "../../../Utils/Helpers"
import { CSFTheme } from "../../../Themes/types"
import clsx from "clsx"
import LanguageSelection from "./LanguageSelection"

const useStyles = makeStyles(({ constants, breakpoints, palette, typography }: CSFTheme) =>
  createStyles({
    container: {
      [breakpoints.down("md")]: {
        paddingRight: constants.generalUnit * 2,
        paddingLeft: constants.generalUnit * 2
      }
    },
    sectionContainer: {
      borderBottom: `1px solid ${palette.additional["gray"][4]}`,
      marginBottom: 32,
      [breakpoints.down("md")]: {
        borderBottom: "none"
      }
    },
    boxContainer: {
      marginBottom: constants.generalUnit * 4
    },
    labelContainer: {
      marginBottom: constants.generalUnit
    },
    walletAddressContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: constants.generalUnit
    },
    input: {
      width: "100%",
      margin: 0,
      marginBottom: constants.generalUnit
    },
    label: {
      marginBottom: constants.generalUnit * 1,
      fontSize: 20
    },
    profileBox: {
      maxWidth: 420
    },
    deletionBox: {
      maxWidth: 300
    },
    copyBox: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      cursor: "pointer",
      color: palette.text.secondary
    },
    deletionMargins: {
      marginBottom: constants.generalUnit * 2
    },
    button: {
      width: 200,
      margin: `0px ${constants.generalUnit * 0.5}px ${
        constants.generalUnit * 1
      }px`
    },
    icon: {
      fontSize: "20px",
      margin: "-2px 2px 0 2px"
    },
    copyIcon: {
      fontSize: "14px",
      fill: constants.profile.icon,
      [breakpoints.down("md")]: {
        fontSize: "18px",
        fill: palette.additional["gray"][9]
      }
    },
    publicAddress: {
      color: palette.additional["gray"][8],
      overflowWrap: "break-word",
      wordBreak: "break-all",
      paddingRight: constants.generalUnit * 2,
      width: "90%",
      ...typography.body1,
      [breakpoints.down("md")]: {
        ...typography.body2
      }
    },
    themeBox: {
      height: 87,
      borderRadius: 4,
      paddingLeft: 20,
      paddingTop: 14,
      margin: 6,
      [breakpoints.down("sm")]: {
        width: "100%"
      },
      cursor: "pointer"
    },
    themeBoxDark: {
      ...constants.settingsPage.darkSwitch
    },
    themeBoxLight: {
      ...constants.settingsPage.lightSwitch
    },
    themeSubtitle: {
      ...typography.body1,
      color: palette.additional.gray[8]
    },
    sectionSubHeading: {
      ...typography.h5,
      fontWeight: 400,
      marginTop: 25,
      marginBottom: 14
    }
  })
)

const ProfileView = () => {
  const { themeKey, setTheme } = useThemeSwitcher()
  const { addToastMessage } = useToaster()
  const { profile, updateProfile } = useUser()
  const [updatingProfile, setUpdatingProfile] = useState(false)

  const onUpdateProfile = async (firstName: string, lastName: string) => {
    try {
      setUpdatingProfile(true)
      await updateProfile(firstName, lastName)
      addToastMessage({ message: t`Profile updated` })
      setUpdatingProfile(false)
    } catch (error) {
      addToastMessage({ message: error, appearance: "error" })
      setUpdatingProfile(false)
    }
  }

  const classes = useStyles()

  const [copied, setCopied] = useState(false)

  // TODO useCallback is maybe not needed here
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSwitchCopied = useCallback(
    debounce(() => setCopied(false), 3000),
    []
  )

  const copyAddress = async () => {
    if (profile?.publicAddress) {
      try {
        await navigator.clipboard.writeText(profile.publicAddress)
        setCopied(true)
        debouncedSwitchCopied()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const profileValidation = yup.object().shape({
    // email: yup.string().email("Email is invalid").required("Email is required"),
    firstName: yup.string(),
    lastName: yup.string()
  })

  return (
    <Grid container>
      <Grid
        item
        xs={12}
      >
        <div className={classes.container}>
          <div
            id="profile"
            className={classes.sectionContainer}
          >
            <div className={classes.profileBox}>
              <Formik
                initialValues={{
                  firstName: profile?.firstName || "",
                  lastName: profile?.lastName || ""
                  // email: profile?.email || ""
                }}
                onSubmit={(values) => {
                  onUpdateProfile(
                    values.firstName || "",
                    values.lastName || ""
                    // values.email || ""
                  )
                }}
                validationSchema={profileValidation}
                validateOnChange={false}
              >
                <Form>
                  {profile?.publicAddress ? (
                    <div
                      className={classes.boxContainer}
                      data-cy="settings-profile-header"
                    >
                      <div className={classes.walletAddressContainer}>
                        <Typography
                          variant="body1"
                          className={classes.label}
                        >
                          <Trans>Wallet address</Trans>
                        </Typography>
                        {copied && (
                          <Typography>
                            <Trans>Copied!</Trans>
                          </Typography>
                        )}
                      </div>
                      <div
                        className={classes.copyBox}
                        onClick={copyAddress}
                      >
                        <Typography
                          variant="body1"
                          component="p"
                          className={classes.publicAddress}
                        >
                          {centerEllipsis(profile.publicAddress, 16)}
                        </Typography>
                        <CopyIcon className={classes.copyIcon} />
                      </div>
                    </div>
                  ) : null}
                  <div className={classes.boxContainer}>
                    <FormikTextInput
                      placeholder={t`First name`}
                      name="firstName"
                      size="medium"
                      className={classes.input}
                      labelClassName={classes.label}
                      label={t`First name`}
                      data-cy="profile-firstname-input"
                    />
                  </div>
                  <div className={classes.boxContainer}>
                    <FormikTextInput
                      placeholder={t`Last name`}
                      name="lastName"
                      size="medium"
                      className={classes.input}
                      labelClassName={classes.label}
                      label={t`Last name`}
                      data-cy="profile-lastname-input"
                    />
                  </div>
                  {/* <div className={classes.boxContainer}>
                    <FormikTextInput
                      placeholder="Email"
                      name="email"
                      size="medium"
                      className={classes.input}
                      labelClassName={classes.label}
                      label="Email"
                      disabled={!profile?.publicAddress}
                    />
                  </div> */}

                  <Button
                    className={classes.button}
                    size="large"
                    type="submit"
                    loading={updatingProfile}
                    variant={themeKey === "dark" ? "outline" : "primary"}
                    loadingText="Saving"
                    data-cy="profile-save-button"
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
          {/* <div id="deletion" className={classes.sectionContainer}>
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
          <div className={classes.profileBox}>
            <Typography
              variant='h4'
              component='h4'
            >
              <Trans>Display Settings</Trans>
            </Typography>
            <Typography
              variant='h5'
              component='h5'
              className={classes.sectionSubHeading}
            >
              <Trans>Theme</Trans>
            </Typography>
            <Grid container>
              <Grid item
                xs={12}
                lg={6}
              >
                <label className={clsx(classes.themeBox, classes.themeBoxDark)}>
                  <RadioInput
                    value='dark'
                    label={t`Dark Theme`}
                    onChange={(e) => setTheme(e.target.value)}
                    checked={themeKey === "dark"}
                  />
                  {themeKey === "dark" && <Typography className={classes.themeSubtitle}>
                    <Trans>What a fine night it is.</Trans>
                  </Typography>}
                </label>
              </Grid>
              <Grid item
                xs={12}
                lg={6}
              >
                <label className={clsx(classes.themeBox, classes.themeBoxLight)}>
                  <RadioInput
                    value='light'
                    label={t`Light Theme`}
                    onChange={(e) => setTheme(e.target.value)}
                    checked={themeKey === "light"} />
                  {themeKey === "light" && <Typography className={classes.themeSubtitle}>
                    <Trans>What a fine day it is.</Trans>
                  </Typography>}
                </label>
              </Grid>
            </Grid>
          </div>
          <Typography
            variant='h5'
            component='h5'
            className={classes.sectionSubHeading}
          >
            <Trans>Language</Trans>
          </Typography>
          <LanguageSelection/>
        </div>
      </Grid>
    </Grid>
  )
}

export default ProfileView
