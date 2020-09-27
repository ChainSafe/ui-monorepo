import React, { useState } from "react"
import {
  Grid,
  Typography,
  Button,
  AppleLogoIcon,
  GoogleLogoIcon,
  ChainsafeFilesLogo,
  Link,
  Divider,
} from "@chainsafe/common-components"
import { useImployApi } from "@chainsafe/common-contexts"
import {
  makeStyles,
  ITheme,
  createStyles,
  useTheme,
} from "@chainsafe/common-themes"
import { useWeb3 } from "@chainsafe/web3-context"
import { ROUTE_LINKS } from "../FilesRoutes"

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
        width: `calc(100% - ${theme.constants.generalUnit} * 2)`,
        maxWidth: 667,
        marginBottom: 50,
        marginTop: 125,
      },
    },
    logoContainer: {
      display: "flex",
      alignItems: "center",
    },
    logoImage: {
      width: "fit-content",
    },
    logoText: {
      fontWeight: theme.typography.fontWeight.semibold,
      paddingLeft: theme.constants.generalUnit,
    },
    buttonSection: {
      paddingTop: 26,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyItems: "flex-start",
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
      height: 0,
      justifyContent: "center",
      flex: "1 1 0",
    },
    imageCaption: {
      fontSize: 20,
    },
    footerText: {
      marginTop: theme.constants.generalUnit * 6,
      fontSize: 16,
    },
    headerText: {
      paddingBottom: theme.constants.generalUnit * 8,
    },
    toggleMode: {
      fontWeight: theme.typography.fontWeight.semibold,
      marginBottom: theme.constants.generalUnit * 4,
      cursor: "pointer",
    },
  }),
)

const LoginPage = () => {
  const classes = useStyles()
  const theme: ITheme = useTheme()

  const { isReturningUser, web3Login, selectWallet } = useImployApi()
  const { provider, wallet } = useWeb3()
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
    try {
      await selectWallet()
    } catch (error) {
      setError("There was an error connecting your wallet")
    }
    setIsConnecting(false)
  }

  const handleSignAuth = async () => {
    setIsConnecting(true)
    try {
      await web3Login()
    } catch (error) {
      setError("There was an error authenticating")
    }
    setIsConnecting(false)
  }
  return (
    <div>
      <Grid container>
        <Grid item md={8} className={classes.imageSection}>
          <img src="abstract-image-large.png" alt="" />
          <Typography
            variant="subtitle2"
            component="h2"
            className={classes.imageCaption}
          >
            Making secure cloud storage easier than ever.
          </Typography>
        </Grid>
        <Grid item md={4} className={classes.buttonSection}>
          <div className={classes.logoContainer}>
            <ChainsafeFilesLogo />
            <Typography variant="subtitle2" className={classes.logoText}>
              ChainSafe Files
            </Typography>
          </div>
          <div className={classes.controls}>
            <Typography
              variant="h6"
              component="h1"
              className={classes.headerText}
            >
              {activeMode === "newUser" ? "Create an account" : "Welcome back!"}
            </Typography>
            {error && (
              <Typography color={theme.palette.error.main}>{error}</Typography>
            )}
            {!provider ? (
              <Button
                onClick={handleSelectWalletAndConnect}
                className={classes.button}
                size="large"
              >
                <Typography variant="button" disabled={isConnecting}>
                  Select a Web3 Wallet
                </Typography>
              </Button>
            ) : (
              <Button
                onClick={handleSignAuth}
                className={classes.button}
                size="large"
              >
                <Typography variant="button" disabled={isConnecting}>
                  Continue with {wallet?.name}
                </Typography>
              </Button>
            )}
            <Divider>
              <Typography>or</Typography>
            </Divider>
            <Button disabled className={classes.button} size="large">
              <AppleLogoIcon />{" "}
              <Typography variant="button">Continue with Apple</Typography>
            </Button>
            <Button disabled className={classes.button} size="large">
              <GoogleLogoIcon />{" "}
              <Typography variant="button">Continue with Google</Typography>
            </Button>
            <Typography className={classes.footerText}>
              {activeMode === "newUser"
                ? "Already have an account?"
                : "Not registered yet?"}
            </Typography>
            <Typography
              onClick={toggleActiveMode}
              className={classes.toggleMode}
            >
              {activeMode === "newUser" ? "Sign in" : "Create an account"}
            </Typography>
            <Link to={ROUTE_LINKS.PrivacyPolicy}>Privacy Policy</Link>
            <Link to={ROUTE_LINKS.Terms}>Terms and Conditions</Link>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default LoginPage
