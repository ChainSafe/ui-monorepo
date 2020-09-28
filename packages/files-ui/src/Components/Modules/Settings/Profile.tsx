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
import { Formik, Field, Form, ErrorMessage } from "formik"
import { LockIcon, CopyIcon } from "@chainsafe/common-components"

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
      // what color is the text
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
  onUpdateProfile(): void
}

const Profile: React.FC<IProfileProps> = (props) => {
  const {
    firstName,
    lastName,
    email,
    publicAddress,
    handleValueChange,
    onUpdateProfile,
  } = props
  const [copied, setCopied] = useState(false)
  const [validations, setValidations] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
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
    email: yup.string().email("Email is invalid"),
  })

  // do we want formik for validation here ?
  const onSaveChange = () => {
    if (publicAddress) {
      // web3 validation
      profileWeb3Validation
        .validate({ email }, { abortEarly: false })
        .then(() => {
          setValidations({ firstName: "", lastName: "", email: "" })
          onUpdateProfile()
        })
        .catch((err) => {
          const errObj: any = {}
          err.inner.forEach((item: yup.ValidationError) => {
            errObj[item.path] = item.message
          })
          setValidations(errObj)
        })
    } else {
      // web2 validation
      profileWeb2Validation
        .validate({ firstName, lastName, email }, { abortEarly: false })
        .then(() => {
          setValidations({ firstName: "", lastName: "", email: "" })
          onUpdateProfile()
        })
        .catch((err) => {
          const errObj: any = {}
          err.inner.forEach((item: yup.ValidationError) => {
            errObj[item.path] = item.message
          })
          setValidations(errObj)
        })
    }
  }

  return (
    <Grid container>
      <Grid item xs={12} sm={10} md={8}>
        <div className={classes.container}>
          <div id="profile" className={classes.bodyContainer}>
            <div className={classes.profileBox}>
              {publicAddress ? (
                <Formik
                  initialValues={{
                    email: email,
                  }}
                  validationSchema={profileWeb3Validation}
                  onSubmit={(fields) => {
                    console.log(fields)
                    alert("SUCCESS!! :-)\n\n" + JSON.stringify(fields))
                  }}
                  render={() => (
                    <div>
                      <div className={classes.boxContainer}>
                        <div className={classes.walletAddressContainer}>
                          <Typography variant="body1" className={classes.label}>
                            Wallet address
                          </Typography>
                          {/* TODO: tooltip with copied! */}
                          {copied && <Typography>Copied!</Typography>}
                        </div>
                        <div className={classes.copyBox} onClick={copyAddress}>
                          <Typography variant="body1">
                            {publicAddress}
                          </Typography>
                          <CopyIcon className={classes.copyIcon} />
                        </div>
                      </div>
                      <div className={classes.boxContainer}>
                        <div className={classes.labelContainer}>
                          <Typography variant="body1" className={classes.label}>
                            Email
                          </Typography>
                        </div>
                        <FormikTextInput
                          placeholder="provide an email (optional)"
                          type="email"
                          size="medium"
                          name="email"
                        />
                      </div>
                    </div>
                  )}
                />
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
                      value={firstName}
                      state={validations.firstName ? "error" : "normal"}
                      captionMessage={validations.firstName}
                      onChange={handleValueChange}
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
                      value={lastName}
                      state={validations.lastName ? "error" : "normal"}
                      captionMessage={validations.lastName}
                      onChange={handleValueChange}
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
                  placeholder={
                    publicAddress ? "provide an email (optional)" : "email"
                  }
                  type="email"
                  value={email}
                  size="medium"
                  state={validations.email ? "error" : "normal"}
                  captionMessage={validations.email}
                  onChange={handleValueChange}
                  name="email"
                />
              </div>
              <Button
                className={classes.button}
                size="large"
                onClick={onSaveChange}
              >
                <LockIcon className={classes.icon} />
                {"  "}
                <Typography variant="button">Save changes</Typography>
              </Button>
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
