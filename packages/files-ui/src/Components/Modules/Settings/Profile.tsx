import React, { useState, useCallback } from "react"
import * as yup from "yup"
import {
  FormikTextInput,
  TextInput,
  Grid,
  Button,
  Typography,
} from "@chainsafe/common-components"
import {
  makeStyles,
  ITheme,
  createStyles,
  debounce,
} from "@chainsafe/common-themes"
import { LockIcon, CopyIcon } from "@chainsafe/common-components"
import { useFormik } from "formik"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      marginTop: theme.constants.generalUnit * 2,
      marginBottom: 160,
    },
    bodyContainer: {
      padding: `${theme.constants.generalUnit * 3}px 0px`,
      borderBottom: `1px solid ${theme.palette.additional["gray"][4]}`,
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
    label: {
      marginBottom: theme.constants.generalUnit * 2,
      fontSize: 20,
    },
    profileBox: {
      maxWidth: 400,
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
    },
    copyIcon: {
      fontSize: "14px",
    },
  }),
)

interface IProfileProps {
  publicAddress?: string
  firstName?: string
  lastName?: string
  email?: string
  handleValueChange(e: React.ChangeEvent<HTMLInputElement>): void
  onUpdateProfile(firstName: string, lastName: string, email: string): void
  updatingProfile: boolean
}

const Profile: React.FC<IProfileProps> = (props) => {
  const {
    firstName,
    lastName,
    email,
    publicAddress,
    onUpdateProfile,
    updatingProfile,
  } = props
  const [copied, setCopied] = useState(false)
  const classes = useStyles()

  const debouncedSwitchCopied = useCallback(
    debounce(() => setCopied(false), 3000),
    [],
  )

  const copyAddress = async () => {
    if (publicAddress) {
      try {
        await navigator.clipboard.writeText(publicAddress)
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

  const formikProfile = useFormik({
    initialValues: { firstName, lastName, email },
    onSubmit: (fields) =>
      onUpdateProfile(
        fields.firstName || "",
        fields.lastName || "",
        fields.email || "",
      ),
    validationSchema: publicAddress
      ? profileWeb3Validation
      : profileWeb2Validation,
  })

  return (
    <Grid container>
      <Grid item xs={12} sm={10} md={8}>
        <div className={classes.container}>
          <div id="profile" className={classes.bodyContainer}>
            <div className={classes.profileBox}>
              <form onSubmit={formikProfile.handleSubmit}>
                {publicAddress ? (
                  <div className={classes.boxContainer}>
                    <div className={classes.walletAddressContainer}>
                      <Typography variant="body1" className={classes.label}>
                        Wallet address
                      </Typography>
                      {/* TODO: tooltip with copied! */}
                      {copied && <Typography>Copied!</Typography>}
                    </div>
                    <div className={classes.copyBox} onClick={copyAddress}>
                      <Typography variant="body1">{publicAddress}</Typography>
                      <CopyIcon className={classes.copyIcon} />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className={classes.boxContainer}>
                      <div className={classes.labelContainer}>
                        <Typography variant="body1" className={classes.label}>
                          First Name
                        </Typography>
                      </div>
                      <TextInput
                        placeholder="first name"
                        value={formikProfile.values.firstName}
                        state={
                          formikProfile.errors.firstName ? "error" : "normal"
                        }
                        captionMessage={formikProfile.errors.firstName}
                        onChange={formikProfile.handleChange}
                        name="firstName"
                        size="medium"
                      />
                    </div>
                    <div className={classes.boxContainer}>
                      <div className={classes.labelContainer}>
                        <Typography variant="body1" className={classes.label}>
                          Last Name
                        </Typography>
                      </div>
                      <TextInput
                        placeholder="last name"
                        value={formikProfile.values.lastName}
                        state={
                          formikProfile.errors.lastName ? "error" : "normal"
                        }
                        captionMessage={formikProfile.errors.lastName}
                        onChange={formikProfile.handleChange}
                        name="lastName"
                        size="medium"
                      />
                    </div>
                  </>
                )}
                <div className={classes.boxContainer}>
                  <div className={classes.labelContainer}>
                    <Typography variant="body1" className={classes.label}>
                      Email
                    </Typography>
                  </div>
                  <TextInput
                    placeholder="email"
                    value={formikProfile.values.email}
                    state={formikProfile.errors.email ? "error" : "normal"}
                    captionMessage={formikProfile.errors.email}
                    onChange={formikProfile.handleChange}
                    name="email"
                    size="medium"
                  />
                </div>
                <FormikTextInput name="email" />
                <Button
                  className={classes.button}
                  size="large"
                  type="submit"
                  disabled={updatingProfile}
                >
                  <LockIcon className={classes.icon} />
                  {"  "}
                  <Typography variant="button">Save changes</Typography>
                </Button>
              </form>
            </div>
          </div>
          <div id="deletion" className={classes.bodyContainer}>
            <div className={classes.deletionBox}>
              <Typography
                variant="h4"
                component="h4"
                className={classes.deletionMargins}
              >
                Deletion
              </Typography>
              <Typography
                variant="body1"
                component="p"
                className={classes.deletionMargins}
              >
                Deleting you account is irreversible. You will lose all your
                data on files.
              </Typography>
              <Button
                variant="outline"
                disabled
                className={classes.deletionMargins}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default Profile
