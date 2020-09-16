import React, { useState } from "react"
import {
  Grid,
  Typography,
  Button,
  AppleLogoIcon,
  GoogleLogoIcon,
  ChainsafeFilesLogo,
} from "@chainsafe/common-components"
import { useWeb3 } from "@chainsafe/web3-context"
import { useAuth } from "@chainsafe/common-contexts"
import {
  makeStyles,
  ITheme,
  createStyles,
  useTheme,
} from "@chainsafe/common-themes"

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
    button: {
      backgroundColor: theme.palette.common.black.main,
      color: theme.palette.common.white.main,
      width: 240,
      marginBottom: theme.constants.generalUnit * 2,
    },
    controls: {
      display: "flex",
      flexDirection: "column",
      paddingTop: 230, //TODO: Figure out how to center this section vertically
    },
    divider: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 4,
      marginBottom: 22,
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
  const theme: ITheme = useTheme()

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
          <Typography variant="subtitle2" style={{ fontSize: 20 }}>
            Making secure cloud storage easier than ever.
          </Typography>
        </Grid>
        <Grid item md={4} className={classes.buttonSection} alignItems="center">
          <ChainsafeFilesLogo />
          <div className={classes.controls}>
            <Typography
              variant="h6"
              style={{ paddingBottom: theme.constants.generalUnit * 8 }}
            >
              {activeMode === "newUser" ? "Create an account" : "Welcome back!"}
            </Typography>
            {error && (
              <Typography color={theme.palette.error.main}>{error}</Typography>
            )}
            <Button
              onClick={handleSelectWalletAndConnect}
              className={classes.button}
              size="large"
            >
              <Typography variant="button">
                Continue with Web3 Wallet
              </Typography>
            </Button>
            <div className={classes.divider}>
              <Typography>or</Typography>
            </div>
            <Button disabled className={classes.button} size="large">
              <AppleLogoIcon />{" "}
              <Typography variant="button">Continue with Apple</Typography>
            </Button>
            <Button disabled className={classes.button} size="large">
              <GoogleLogoIcon />{" "}
              <Typography variant="button">Continue with Google</Typography>
            </Button>
            <Typography
              style={{
                marginTop: theme.constants.generalUnit * 6,
                fontSize: 16,
              }}
            >
              {activeMode === "newUser"
                ? "Already have an account?"
                : "Not registered yet?"}
            </Typography>
            <Typography
              onClick={toggleActiveMode}
              style={{ fontWeight: theme.typography.fontWeight.semibold }}
            >
              {activeMode === "newUser" ? "Sign in" : "Create an account"}
            </Typography>

            <Typography
              style={{
                marginTop: theme.constants.generalUnit * 4,
                //@ts-ignore
                color: theme.palette["gray"][7],
                textDecoration: "underline",
              }}
            >
              Privacy Policy
            </Typography>
            <Typography
              style={{
                //@ts-ignore
                color: theme.palette["gray"][7],
                textDecoration: "underline",
              }}
            >
              Terms and Conditions
            </Typography>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default LoginPage
