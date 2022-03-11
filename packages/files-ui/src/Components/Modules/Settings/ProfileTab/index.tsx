import React, { useState, useCallback, useMemo } from "react"
import {
  Grid,
  Button,
  Typography,
  useToasts,
  TextInput,
  CheckIcon,
  Divider,
  ToggleSwitch
} from "@chainsafe/common-components"
import { makeStyles, createStyles, debounce } from "@chainsafe/common-theme"
import { CopyIcon } from "@chainsafe/common-components"
import { useUser } from "../../../../Contexts/UserContext"
import { t, Trans } from "@lingui/macro"
import { centerEllipsis } from "../../../../Utils/Helpers"
import { CSFTheme } from "../../../../Themes/types"
import { useThresholdKey } from "../../../../Contexts/ThresholdKeyContext"
import EthCrypto from "eth-crypto"
// import { Form, useFormik, FormikProvider } from "formik"
// import * as yup from "yup"

const useStyles = makeStyles(({ constants, breakpoints, palette }: CSFTheme) =>
  createStyles({
    container: {
      [breakpoints.down("md")]: {
        paddingRight: constants.generalUnit * 2,
        paddingLeft: constants.generalUnit * 2
      }
    },
    boxContainer: {
      marginBottom: constants.generalUnit * 4,
      [breakpoints.up("md")]: {
        marginLeft: constants.generalUnit * 2
      }
    },
    inputBoxContainer: {
      marginBottom: constants.generalUnit * 3,
      [breakpoints.up("md")]: {
        marginLeft: constants.generalUnit * 2
      }
    },
    labelContainer: {
      marginBottom: constants.generalUnit
    },
    walletAddressContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: constants.generalUnit * 0.5
    },
    input: {
      width: "100%",
      margin: 0,
      marginBottom: constants.generalUnit
    },
    label: {
      marginBottom: constants.generalUnit * 1
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
      margin: `0px ${constants.generalUnit * 0.5}px ${constants.generalUnit * 4}px`,
      [breakpoints.up("md")]: {
        marginLeft: constants.generalUnit * 2
      }
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
      fontSize: 16
    },
    copyText: {
      padding: `${constants.generalUnit / 2}px ${constants.generalUnit}px`,
      backgroundColor: constants.loginModule.flagBg,
      borderRadius: 2,
      color: constants.loginModule.flagText
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
      marginBottom: constants.generalUnit,
      "& svg": {
        fill: palette.success.main
      }
    },
    usernameInput: {
      flex: 1,
      margin: 0,
      paddingRight: constants.generalUnit
    },
    mainHeader: {
      fontSize: 28,
      marginBottom: constants.generalUnit * 2,
      [breakpoints.up("md")]: {
        paddingLeft: constants.generalUnit * 2
      }
    },
    lookupText: {
      paddingLeft: constants.generalUnit
    }
  })
)

// const profileValidation = yup.object().shape({
//   email: yup.string().email("Email is invalid").required("Email is required"),
//   firstName: yup.string(),
//   lastName: yup.string(),
//   username: yup.string()
// })

const ProfileView = () => {
  const { addToast } = useToasts()
  const { profile, addUsername, lookupOnUsername, toggleLookupConsent } = useUser()
  const { publicKey } = useThresholdKey()
  const [showUsernameForm, setShowUsernameForm] = useState(false)
  const [username, setUsername] = useState("")
  const [usernameData, setUsernameData] = useState({ error: "", loading: false })
  // const [updatingProfile, setUpdatingProfile] = useState(false)
  // const formik = useFormik({
  //   initialValues: {
  //     firstName: profile?.firstName || "",
  //     lastName: profile?.lastName || ""
  //     email: profile?.email || ""
  //   },
  //   onSubmit: (values) => {
  //     onUpdateProfile(
  //       values.firstName || "",
  //       values.lastName || ""
  //       values.email || ""
  //     )
  //   },
  //   validationSchema: profileValidation,
  //   validateOnChange: false
  // })
  // const onUpdateProfile = async (firstName: string, lastName: string) => {
  //   try {
  //     setUpdatingProfile(true)
  //     await updateProfile(firstName, lastName)
  //     addToast({ title: t`Profile updated`, type: "success", testId: "profile-update-success" })
  //     setUpdatingProfile(false)
  //   } catch (error) {
  //     error instanceof Error && addToast({ title: error.message, type: "error" })
  //     setUpdatingProfile(false)
  //   }
  // }

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
    if (sanitizedValue.length > 32) {
      setUsernameData({
        loading: false,
        error: t`The username is too long`
      })
    } else {
      setUsernameData({
        loading: false,
        error: ""
      })
      !!sanitizedValue && debouncedOnLookupUsername(sanitizedValue)
    }
  }

  const onSubmitUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setUsernameData({ ...usernameData, loading: true })
    addUsername(username)
      .then(() => {
        addToast({ title: t`Username set successfully`, type: "success" })
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
            data-cy="label-profile-header"
          >
            <Typography
              variant="h3"
              component="h3"
              className={classes.mainHeader}
            >
              <Trans>Profile</Trans>
            </Typography>
            <Divider />
            <div className={classes.profileBox}>
              <div className={classes.boxContainer}>
                <Typography
                  variant="h4"
                  component="h4"
                  className={classes.label}
                >
                  <Trans>Account visibility</Trans>
                </Typography>
                <div className={classes.walletAddressContainer}>
                  <ToggleSwitch
                    left={{ value: false }}
                    right={{ value: true }}
                    testId="address-lookup"
                    onChange={toggleLookupConsent}
                    value={profile?.lookupConsent || false}
                  />
                  <Typography className={classes.lookupText}>
                    <Trans>
                      Allow lookup by sharing key, wallet address, username or ENS
                    </Trans>
                  </Typography>
                </div>
              </div>
              {profile?.publicAddress &&
                <div className={classes.boxContainer}>
                  <div className={classes.walletAddressContainer}>
                    <Typography
                      variant="h4"
                      component="h4"
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
              {compressedPubKey &&
                <div
                  className={classes.boxContainer}
                  data-cy="label-profile-header"
                >
                  <div className={classes.walletAddressContainer}>
                    <Typography
                      variant="h4"
                      component="h4"
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
              <div className={classes.inputBoxContainer}>
                {profile?.username
                  ? <>
                    <Typography
                      variant="h4"
                      component="h4"
                      className={classes.label}
                    >
                      <Trans>Username</Trans>
                    </Typography>
                    <div className={classes.usernameForm}>
                      <TextInput
                        disabled={true}
                        value={profile.username}
                        className={classes.usernameInput}
                        data-cy="input-profile-username-present"
                      />
                    </div>
                  </>
                  : <>
                    <Typography
                      variant="h4"
                      component="h4"
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
                            data-cy="input-profile-username"
                          />
                          <div>
                            <Button
                              type="submit"
                              disabled={usernameData.loading || !!usernameData.error || !username}
                              loading={usernameData.loading}
                              data-cy="button-set-username"
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
                            data-cy="button-add-username"
                          >
                            <Trans>Add a username</Trans>
                          </span>
                        </Typography>
                      </div>
                    }
                  </>
                }
              </div>
              {/* <FormikProvider value={formik}>
                <Form>
                  <div className={classes.inputBoxContainer}>
                    <Typography
                      variant="h4"
                      component="h4"
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
                      data-cy="input-profile-firstname"
                    />
                  </div>
                  <div className={classes.inputBoxContainer}>
                    <Typography
                      variant="h4"
                      component="h4"
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
                      data-cy="input-profile-lastname"
                    />
                  </div>
                  <div className={classes.boxContainer}>
                    <FormikTextInput
                      placeholder="Email"
                      name="email"
                      size="medium"
                      className={classes.input}
                      labelClassName={classes.label}
                      label="Email"
                      disabled={!profile?.publicAddress}
                    />
                  </div>
                  <Button
                    className={classes.button}
                    size="large"
                    type="submit"
                    loading={updatingProfile}
                    variant="primary"
                    loadingText="Saving"
                    data-cy="button-save-changes"
                    disabled={!formik.dirty}
                  >
                    <Typography variant="button">
                      <Trans>Save changes</Trans>
                    </Typography>
                  </Button>
                </Form>
              </FormikProvider> */}
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
        </div>
      </Grid>
    </Grid>
  )
}

export default ProfileView
