import React, { useState } from "react"
import {
  Grid,
  Typography,
  Button,
  GoogleLogoIcon,
  FacebookLogoIcon,
  GithubLogoIcon,
  ChainsafeFilesLogo,
  Divider,
} from "@imploy/common-components"
import { useImployApi, OAuthProvider } from "@imploy/common-contexts"
import {
  makeStyles,
  ITheme,
  createStyles,
  useTheme,
  useMediaQuery,
} from "@imploy/common-themes"
import { useWeb3 } from "@chainsafe/web3-context"
import LargeLightBulbSvg from "../../Media/LargeLightBulb.svg"
import SmallBranchSvg from "../../Media/SmallBranch.svg"

const useStyles = makeStyles(
  ({ palette, constants, typography, breakpoints }: ITheme) =>
    createStyles({
      root: {
        [breakpoints.down("md")]: {
          backgroundColor: palette.common.black.main,
          minHeight: "100vh",
          display: "flex",
        },
      },
      imageSection: {
        backgroundColor: palette.common.black.main,
        color: palette.common.white.main,
        textAlign: "center",
        alignContent: "center",
        minHeight: "100vh",
        "& > img": {
          display: "block",
          width: `calc(100% - ${constants.generalUnit} * 2)`,
          maxWidth: 667,
          marginBottom: 50,
          marginTop: 125,
        },
      },
      logoContainer: {
        display: "flex",
        alignItems: "center",
        [breakpoints.down("md")]: {
          "& > svg": {},
        },
      },
      logoImage: {
        [breakpoints.down("md")]: {
          width: constants.generalUnit * 4.5,
          height: constants.generalUnit * 4.5,
        },
      },
      logoText: {
        fontWeight: typography.fontWeight.semibold,
        paddingLeft: constants.generalUnit,
        [breakpoints.down("md")]: {
          color: palette.common.white.main,
          fontSize: 16,
        },
      },
      buttonSection: {
        paddingTop: 26,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyItems: "flex-start",
        zIndex: 0,
      },
      button: {
        width: 240,
        marginBottom: constants.generalUnit * 2,
        [breakpoints.up("md")]: {
          backgroundColor: palette.common.black.main,
          color: palette.common.white.main,
        },
        [breakpoints.down("md")]: {
          backgroundColor: palette.common.black.main,
          color: palette.common.white.main,
        },
      },
      controls: {
        display: "flex",
        flexDirection: "column",
        height: 0,
        justifyContent: "center",
        flex: "1 1 0",
      },
      error: {
        color: palette.error.main,
      },
      imageCaption: {
        fontSize: 20,
      },
      headerText: {
        paddingBottom: constants.generalUnit * 8,
        [breakpoints.down("md")]: {
          color: palette.common.white.main,
          textAlign: "center",
        },
      },
      footerText: {
        marginTop: constants.generalUnit * 6,
        fontSize: 16,
        [breakpoints.down("md")]: {
          color: palette.common.white.main,
          textAlign: "center",
        },
      },
      toggleMode: {
        fontWeight: typography.fontWeight.semibold,
        marginBottom: constants.generalUnit * 4,
        cursor: "pointer",
        [breakpoints.down("md")]: {
          color: palette.common.white.main,
          textAlign: "center",
        },
      },
      largeBulb: {
        position: "fixed",
        width: "auto",
        height: "auto",
        top: "-5vw",
        right: 0,
        maxWidth: "50vw",
        zIndex: 0,
      },
      smallBranch: {
        position: "fixed",
        bottom: 0,
        left: "-2vw",
        maxWidth: "35vw",
        width: "auto",
        height: "auto",
        zIndex: 0,
      },
    }),
)

const LoginPage = () => {
  const classes = useStyles()
  const { breakpoints }: ITheme = useTheme()
  const {
    isReturningUser,
    web3Login,
    selectWallet,
    resetAndSelectWallet,
    getProviderUrl,
  } = useImployApi()
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

  const handleResetAndSelectWalletAndConnect = async () => {
    setIsConnecting(true)
    try {
      await resetAndSelectWallet()
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

  const onLoginWithProvider = async (provider: OAuthProvider) => {
    const oauthUrl = await getProviderUrl(provider)
    window.location.href = oauthUrl
  }

  const desktop = useMediaQuery(breakpoints.up("md"))

  return (
    <div className={classes.root}>
      <Grid flexDirection={desktop ? "row" : "column"} container>
        {desktop ? (
          <Grid item md={8} lg={8} xl={8} className={classes.imageSection}>
            <img src="abstract-image-large.png" alt="" />
            <Typography
              variant="subtitle2"
              component="h2"
              className={classes.imageCaption}
            >
              Making secure cloud storage easier than ever.
            </Typography>
          </Grid>
        ) : (
          <>
            <LargeLightBulbSvg className={classes.largeBulb} />
            <SmallBranchSvg className={classes.smallBranch} />
          </>
        )}
        <Grid
          item
          md={4}
          lg={4}
          xl={4}
          xs={12}
          sm={12}
          className={classes.buttonSection}
        >
          <div className={classes.logoContainer}>
            <ChainsafeFilesLogo className={classes.logoImage} />
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
              <Typography className={classes.error}>{error}</Typography>
            )}
            {!provider ? (
              <Button
                onClick={handleSelectWalletAndConnect}
                className={classes.button}
                variant={desktop ? "primary" : "outline"}
                size="large"
                disabled={isConnecting}
              >
                Select a Web3 Wallet
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSignAuth}
                  className={classes.button}
                  variant={desktop ? "primary" : "outline"}
                  size="large"
                  disabled={isConnecting}
                >
                  Continue with {wallet?.name}
                </Button>
                <Button
                  onClick={handleResetAndSelectWalletAndConnect}
                  className={classes.button}
                  size="large"
                  variant={desktop ? "primary" : "outline"}
                  disabled={isConnecting}
                >
                  Select a different wallet
                </Button>
              </>
            )}
            {desktop && (
              <Divider>
                <Typography>or</Typography>
              </Divider>
            )}
            <Button
              className={classes.button}
              variant={desktop ? "primary" : "outline"}
              size="large"
              onClick={() => onLoginWithProvider("github")}
            >
              <GithubLogoIcon /> Continue with Github
            </Button>
            <Button
              className={classes.button}
              variant={desktop ? "primary" : "outline"}
              size="large"
              onClick={() => onLoginWithProvider("google")}
            >
              <GoogleLogoIcon /> Continue with Google
            </Button>
            <Button
              className={classes.button}
              size="large"
              variant={desktop ? "primary" : "outline"}
              onClick={() => onLoginWithProvider("facebook")}
            >
              <FacebookLogoIcon /> Continue with Facebook
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
            {/* {
              desktop && (
                <>
                  <Link to={ROUTE_LINKS.PrivacyPolicy}>Privacy Policy</Link>
                  <Link to={ROUTE_LINKS.Terms}>Terms and Conditions</Link>
                </>
              )
            } */}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default LoginPage
