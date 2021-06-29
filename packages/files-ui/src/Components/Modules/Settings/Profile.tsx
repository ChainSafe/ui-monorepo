import React, { useState, useCallback, useMemo } from "react"
import * as yup from "yup"
import {
  FormikTextInput,
  Grid,
  Button,
  Typography,
  useToaster,
  RadioInput,
  TextInput,
  CheckIcon
} from "@chainsafe/common-components"
import {
  makeStyles,
  createStyles,
  debounce,
  useThemeSwitcher
} from "@chainsafe/common-theme"
import { LockIcon, CopyIcon } from "@chainsafe/common-components"
import { Form, useFormik, FormikProvider } from "formik"
import { useUser } from "../../../Contexts/UserContext"
import { t, Trans } from "@lingui/macro"
import { centerEllipsis } from "../../../Utils/Helpers"
import { CSFTheme } from "../../../Themes/types"
import clsx from "clsx"
import LanguageSelection from "./LanguageSelection"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import EthCrypto from "eth-crypto"

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
    header: {
      fontSize: 28,
      lineHeight: "32px",
      marginBottom: constants.generalUnit * 5
    },
    boxContainer: {
      marginBottom: constants.generalUnit * 4
    },
    inputBoxContainer: {
      marginBottom: constants.generalUnit * 3
    },
    labelContainer: {
      marginBottom: constants.generalUnit
    },
    walletAddressContainer: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: constants.generalUnit * 0.5
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
    subLabel: {
      marginBottom: constants.generalUnit * 1,
      color: palette.additional["gray"][8],
      fontSize: 14
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
        constants.generalUnit * 4
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
    copyText: {
      padding: `${constants.generalUnit / 2}px ${constants.generalUnit}px`,
      backgroundColor: constants.loginModule.flagBg,
      borderRadius: 2,
      color: constants.loginModule.flagText
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
    },
    buttonLink: {
      color: palette.additional["gray"][10],
      outline: "none",
      textDecoration: "underline",
      cursor: "pointer",
      textAlign: "center",
      "&.spaceLeft": {
        marginLeft: constants.generalUnit * 0.5
      }
    },
    usernameForm: {
      display: "flex",
      marginBottom: constants.generalUnit * 4,
      "& svg": {
        fill: palette.success.main
      }
    },
    usernameInput: {
      flex: 1,
      margin: 0,
      paddingRight: constants.generalUnit
    }
  })
)

const profileValidation = yup.object().shape({
  // email: yup.string().email("Email is invalid").required("Email is required"),
  firstName: yup.string(),
  lastName: yup.string(),
  username: yup.string()
})

const ProfileView = () => {
  const { themeKey, setTheme } = useThemeSwitcher()
  const { addToastMessage } = useToaster()
  const { profile, updateProfile, addUsername, lookupOnUsername } = useUser()
  const { publicKey } = useThresholdKey()
  const [updatingProfile, setUpdatingProfile] = useState(false)
  const [showUsernameForm, setShowUsernameForm] = useState(false)
  const [username, setUsername] = useState("")
  const [usernameData, setUsernameData] = useState({ error: "", loading: false })
  const formik = useFormik({
    initialValues:{
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || ""
      // email: profile?.email || ""
    },
    onSubmit: (values) => {
      onUpdateProfile(
        values.firstName || "",
        values.lastName || ""
        // values.email || ""
      )
    },
    validationSchema: profileValidation,
    validateOnChange: false
  })
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

  const [copiedWalletAddress, setCopiedWalletAddress] = useState(false)
  const [copiedTkeyPublicKey, setCopiedTkeyPublicKey] = useState(false)

  const compressedPubKey = useMemo(() => publicKey && `0x${EthCrypto.publicKey.compress(publicKey)}`, [publicKey])

  const debouncedCopiedWalletAddress =
    debounce(() => setCopiedWalletAddress(false), 3000)

  const debouncedCopiedTkeyPublicKey =
    debounce(() => setCopiedTkeyPublicKey(false), 3000)

  const copyWalletAddress = async () => {
    if (profile?.publicAddress) {
      try {
        await navigator.clipboard.writeText(profile.publicAddress)
        setCopiedWalletAddress(true)
        debouncedCopiedWalletAddress()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const copyTkeyPubKey = async () => {
    if (compressedPubKey) {
      try {
        await navigator.clipboard.writeText(compressedPubKey)
        setCopiedTkeyPublicKey(true)
        debouncedCopiedTkeyPublicKey()
      } catch (err) {
        console.error(err)
      }
    }
  }

  const onLookupUsername = useCallback((username: string) => {
    lookupOnUsername(username)
      .then((doesUsernameExist) => {
        if (doesUsernameExist) {
          setUsernameData({
            loading: false,
            error: t`This username is already taken`
          })
        } else {
          setUsernameData({
            loading: false,
            error: ""
          })
        }
      })
      .catch(console.error)
  }, [lookupOnUsername])

  const debouncedOnLookupUsername = useMemo(
    () => debounce(onLookupUsername, 300),
    [onLookupUsername]
  )

  const onUsernameChange = (value: string | number | undefined) => {
    const sanitizedValue = value?.toString() || ""

    setUsername(sanitizedValue)
    !!sanitizedValue && debouncedOnLookupUsername(sanitizedValue)
  }

  const onSubmitUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUsernameData({ ...usernameData, loading: true })
    addUsername(username)
      .then(() => {
        addToastMessage({ message: t`Username set successfully` })
      })
      .catch((error) => {
        setUsernameData({
          error: error,
          loading: false
        })
      })
  }

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
              <Typography
                variant="h3"
                component="h3"
                className={classes.header}
              >
                <Trans>Profile settings</Trans>
              </Typography>
              {profile?.publicAddress &&
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
                    {copiedWalletAddress && (
                      <Typography>
                        <Trans>Copied!</Trans>
                      </Typography>
                    )}
                  </div>
                  <div
                    className={classes.copyBox}
                    onClick={copyWalletAddress}
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
              }
              {compressedPubKey
                && <div
                  className={classes.boxContainer}
                  data-cy="settings-profile-header"
                >
                  <div className={classes.walletAddressContainer}>
                    <Typography
                      variant="body1"
                      className={classes.label}
                    >
                      <Trans>Files sharing key</Trans>
                    </Typography>
                    {copiedTkeyPublicKey && (
                      <Typography>
                        <Trans>Copied!</Trans>
                      </Typography>
                    )}
                  </div>
                  <div
                    className={classes.copyBox}
                    onClick={copyTkeyPubKey}
                  >
                    <Typography
                      variant="body1"
                      component="p"
                      className={classes.publicAddress}
                    >
                      {centerEllipsis(compressedPubKey, 16)}
                    </Typography>
                    <CopyIcon className={classes.copyIcon} />
                  </div>
                </div>
              }
              {profile?.username
                ? <div className={classes.inputBoxContainer}>
                  <Typography
                    component="p"
                    className={classes.label}
                  >
                    <Trans>Username</Trans>
                  </Typography>
                  <Typography
                    component="p"
                    className={classes.subLabel}
                  >
                    <Trans>This username is public</Trans>
                  </Typography>
                  <div className={classes.usernameForm}>
                    <TextInput
                      disabled={true}
                      value={profile.username}
                      className={classes.usernameInput}
                    />
                  </div>
                </div>
                : <div className={classes.inputBoxContainer}>
                  <Typography
                    component="p"
                    className={classes.label}
                  >
                    <Trans>Username</Trans>
                  </Typography>
                  {showUsernameForm
                    ? <div>
                      <Typography
                        component="p"
                        className={classes.subLabel}
                      >
                        <Trans>Usernames are public and can&apos;t be changed after creation.</Trans>
                      </Typography>
                      <form
                        onSubmit={onSubmitUsername}
                        className={classes.usernameForm}
                      >
                        <TextInput
                          placeholder={t`Username`}
                          name="username"
                          size="medium"
                          value={username}
                          className={classes.usernameInput}
                          RightIcon={username && !usernameData.error ? CheckIcon : undefined}
                          onChange={onUsernameChange}
                          captionMessage={usernameData.error}
                          state={usernameData.error ? "error" : "normal"}
                          data-cy="profile-username-input"
                        />
                        <div>
                          <Button
                            type="submit"
                            disabled={usernameData.loading || !!usernameData.error || !username}
                            loading={usernameData.loading}
                          >
                            {usernameData.loading ? t`Setting Username` : t`Set Username`}
                          </Button>
                        </div>
                      </form>
                    </div>
                    : <div>
                      <Typography
                        component="p"
                        className={classes.subLabel}
                      >
                        <span>
                          <Trans>You haven&apos;t set a username yet.</Trans>
                        </span>
                        {" "}
                        <span
                          className={classes.buttonLink}
                          onClick={() => setShowUsernameForm(true)}
                        >
                          <Trans>Add a username</Trans>
                        </span>
                      </Typography>
                    </div>
                  }
                </div>
              }
              <FormikProvider value={formik}>
                <Form>
                  <div className={classes.inputBoxContainer}>
                    <Typography
                      component="p"
                      className={classes.label}
                    >
                      <Trans>First name</Trans>
                    </Typography>
                    <Typography
                      component="p"
                      className={classes.subLabel}
                    >
                      <Trans>Only you can see this.</Trans>
                    </Typography>
                    <FormikTextInput
                      placeholder={t`First name`}
                      name="firstName"
                      size="medium"
                      hideLabel={true}
                      className={classes.input}
                      data-cy="profile-firstname-input"
                    />
                  </div>
                  <div className={classes.inputBoxContainer}>
                    <Typography
                      variant="body1"
                      component="p"
                      className={classes.label}
                    >
                      <Trans>Last name</Trans>
                    </Typography>
                    <FormikTextInput
                      placeholder={t`Last name`}
                      name="lastName"
                      size="medium"
                      hideLabel={true}
                      className={classes.input}
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
                    disabled={!formik.dirty}
                  >
                    <LockIcon className={classes.icon} />
                    {"  "}
                    <Typography variant="button">
                      <Trans>Save changes</Trans>
                    </Typography>
                  </Button>
                </Form>
              </FormikProvider>
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
