import React, { useState, useCallback } from "react"
import {
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
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    container: {
      marginTop: 20,
      marginBottom: 160,
    },
    bodyContainer: {
      padding: `${theme.constants.generalUnit * 3}px 0px`,
      borderBottom: `1px solid ${theme.palette.primary.border}`,
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
  name?: string
  email?: string
  handleValueChange(e: React.ChangeEvent<HTMLInputElement>): void
}

const Profile: React.FC<IProfileProps> = (props) => {
  const { name, email, publicAddress, handleValueChange } = props
  const [copied, setCopied] = useState(false)
  const classes = useStyles()

  const debouncedSwitchCopied = React.useCallback(
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

  return (
    <Grid container>
      <Grid item xs={12} sm={8} md={6}>
        <div className={classes.container}>
          <div id="profile" className={classes.bodyContainer}>
            <div className={classes.profileBox}>
              {publicAddress ? (
                <div className={classes.boxContainer}>
                  <div className={classes.walletAddressContainer}>
                    <Typography variant="body1" className={classes.label}>
                      Wallet address
                    </Typography>
                    {copied && <Typography>Copied!</Typography>}
                  </div>
                  <div className={classes.copyBox} onClick={copyAddress}>
                    <Typography variant="body1">{publicAddress}</Typography>
                    <CopyIcon className={classes.copyIcon} />
                  </div>
                </div>
              ) : (
                <div className={classes.boxContainer}>
                  <div className={classes.labelContainer}>
                    <Typography variant="body1" className={classes.label}>
                      Name
                    </Typography>
                  </div>
                  <TextInput
                    placeholder="name"
                    value={name}
                    onChange={handleValueChange}
                    name="name"
                    size="medium"
                  />
                </div>
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
                  onChange={handleValueChange}
                  name="email"
                />
              </div>
              <Button className={classes.button} size="large">
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
                data onn files.
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
