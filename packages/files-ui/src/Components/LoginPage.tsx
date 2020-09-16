import React, { useState } from "react"
import {
  Grid,
  Typography,
  Button,
  AppleLogoIcon,
  GoogleLogoIcon,
} from "@chainsafe/common-components"
import { useWeb3 } from "@chainsafe/web3-context"
import { useAuth } from "@chainsafe/common-contexts"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    imageSection: {
      backgroundColor: theme.palette.common.black.main,
      color: theme.palette.common.white.main,
      textAlign: "center",
      alignContent: "center",
      minHeight: "100vh",
      "& > img": {
        display: "block",
        maxWidth: 677,
        maxHeight: 677,
        width: "auto",
        height: "auto",
        paddingTop: 125,
        paddingLeft: 116,
        paddingRight: 116,
        paddingBottom: 50,
      },
    },
    buttonSection: {
      paddingTop: 26,
    },
    logo: {
      width: "fit-content",
    },
    button: {
      backgroundColor: theme.palette.common.black.main,
      color: theme.palette.common.white.main,
      width: 237,
      marginBottom: theme.constants.generalUnit,
    },
    divider: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.constants.generalUnit,
      "& span": {
        display: "block",
        margin: "0 5px",
      },
      "&:before,&:after": {
        height: 1,
        width: 0,
        flex: "1 1 0",
        backgroundColor: "gray",
        display: "block",
        content: "''",
      },
    },
  }),
)

const LoginPage = () => {
  const classes = useStyles()
  const { isReturningUser, web3Login } = useAuth()
  const { wallet, onboard, checkIsReady } = useWeb3()
  const [error, setError] = useState<string>("")
  const [activeMode, setActiveMode] = useState<"newUser" | "returningUser">(
    isReturningUser ? "returningUser" : "newUser",
  )

  const toggleActiveMode = () =>
    activeMode === "newUser"
      ? setActiveMode("returningUser")
      : setActiveMode("newUser")

  const [isConnecting, setIsConnecting] = useState(false)

  const handleSelectWalletAndConnect = async () => {
    setIsConnecting(true)
    if (onboard) {
      let walletReady = !!wallet
      if (!walletReady) {
        walletReady = await onboard.walletSelect()
      }
      walletReady && (await checkIsReady())
      try {
        await web3Login()
      } catch (error) {
        setError("There was an error connecting")
      }
    }
    setIsConnecting(false)
  }
  return (
    <div>
      <Grid container>
        <Grid item md={8} className={classes.imageSection}>
          <img src="abstract-image-large.png" alt="" />
          <Typography variant="subtitle2">
            Making secure cloud storage easier than ever.
          </Typography>
        </Grid>
        <Grid item md={4} className={classes.buttonSection} alignItems="center">
          <div>
            <img
              src="ChainSafe-logo.png"
              alt="Chainsafe Logo"
              className={classes.logo}
            />
            <Typography variant="subtitle2">Chainsafe Files</Typography>
          </div>
          {activeMode === "newUser" ? (
            <Typography variant="h6">Create an account</Typography>
          ) : (
            <Typography variant="h6">Welcome back!</Typography>
          )}
          <Button
            onClick={handleSelectWalletAndConnect}
            className={classes.button}
            size="large"
          >
            Continue with Web3 Wallet
          </Button>
          <div className={classes.divider}>
            <Typography>OR</Typography>
          </div>
          <Button disabled className={classes.button} size="large">
            <AppleLogoIcon /> <Typography>Continue with Apple</Typography>
          </Button>
          <Button disabled className={classes.button} size="large">
            <GoogleLogoIcon /> <Typography>Continue with Google</Typography>
          </Button>
          {error && <Typography>{error}</Typography>}
          {activeMode === "newUser" ? (
            <>
              <Typography>Already have an account? </Typography>
              <Typography onClick={toggleActiveMode}>Sign in</Typography>
            </>
          ) : (
            <>
              <Typography>Not registered yet? </Typography>
              <Typography onClick={toggleActiveMode}>
                Create an account
              </Typography>
            </>
          )}
          <Typography>Privacy Policy</Typography>
          <Typography>Terms and Conditions</Typography>
        </Grid>
      </Grid>
    </div>
  )
}

export default LoginPage
