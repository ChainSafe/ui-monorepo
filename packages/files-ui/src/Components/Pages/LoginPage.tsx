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
  // Link,
} from "@chainsafe/common-components"
import { useImployApi, OAuthProvider } from "@imploy/common-contexts"
import {
  makeStyles,
  ITheme,
  createStyles,
  useTheme,
  useMediaQuery,
} from "@chainsafe/common-theme"
import { useWeb3 } from "@chainsafe/web3-context"
import LargeLightBulbSvg from "../../Media/LargeLightBulb.svg"
import SmallBranchSvg from "../../Media/SmallBranch.svg"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../FilesRoutes"
import LandingImage from "../../Media/auth.jpg"
import MasterKeyModule from "../Modules/MasterKeySequence/MasterKeyModule"
import EnterMasterKeySlide from "../Modules/MasterKeySequence/SequenceSlides/EnterMasterKey.slide"

const useStyles = makeStyles(
  ({ palette, constants, typography, breakpoints }: ITheme) =>
    createStyles({
      root: {
        [breakpoints.down("md")]: {
          backgroundColor: palette.common.black.main,
          height: "100vh",
          display: "flex",
        },
      },
      imageSection: {
        backgroundColor: palette.common.black.main,
        color: palette.common.white.main,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        display: "flex",
        flexFlow: "column",
        "& > img": {
          height: `calc(100% - 180px)`,
          maxHeight: "1000px",
          marginBottom: 50,
          marginTop: 50,
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
        paddingBottom: constants.generalUnit * 2,
        maxWidth: 240,
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
      termsText: {
        marginTop: constants.generalUnit * 2,
      },
      footerText: {
        marginTop: constants.generalUnit * 4,
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
    secured,
    isLoggedIn,
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
      // TODO: Trigger request for Master Key
      await selectWallet()
    } catch (error) {
      setError("There was an error connecting your wallet")
    }
    setIsConnecting(false)
  }

  const handleResetAndSelectWalletAndConnect = async () => {
    setIsConnecting(true)
    try {
      // TODO: Trigger request for Master Key
      await resetAndSelectWallet()
    } catch (error) {
      setError("There was an error connecting your wallet")
    }
    setIsConnecting(false)
  }

  const handleSignAuth = async () => {
    setIsConnecting(true)
    try {
      // TODO: Trigger request for Master Key
      await web3Login()
    } catch (error) {
      setError("There was an error authenticating")
    }
    setIsConnecting(false)
  }

  const onLoginWithProvider = async (provider: OAuthProvider) => {
    const oauthUrl = await getProviderUrl(provider)
    window.location.href = oauthUrl
    // TODO: Trigger request for Master Key
  }

  const desktop = useMediaQuery(breakpoints.up("md"))
  const maintenanceMode = Boolean(process.env.REACT_APP_MAINTENANCE_MODE)

  return (
    <div className={classes.root}>
      <Grid flexDirection={desktop ? "row" : "column"} container>
        {desktop ? (
          <Grid item md={8} lg={8} xl={8} className={classes.imageSection}>
            <img src={LandingImage} alt="" />
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
              <Trans>ChainSafe Files</Trans>
            </Typography>
          </div>
          <div className={classes.controls}>
            {!isLoggedIn ? (
              <>
                <Typography
                  variant="h6"
                  component="h1"
                  className={classes.headerText}
                >
                  {activeMode === "newUser"
                    ? "Create an account"
                    : "Welcome back!"}
                </Typography>
                {error && (
                  <Typography className={classes.error}>{error}</Typography>
                )}
                {maintenanceMode && (
                  <Typography className={classes.error}>
                    We're undergoing maintenace, thank you for being patient
                  </Typography>
                )}

                {!provider ? (
                  <Button
                    onClick={handleSelectWalletAndConnect}
                    className={classes.button}
                    variant={desktop ? "primary" : "outline"}
                    size="large"
                    disabled={maintenanceMode || isConnecting}
                  >
                    <Trans>Select a Web3 Wallet</Trans>
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleSignAuth}
                      className={classes.button}
                      variant={desktop ? "primary" : "outline"}
                      size="large"
                      disabled={maintenanceMode || isConnecting}
                    >
                      <Trans>Continue with</Trans> {wallet?.name}
                    </Button>
                    <Button
                      onClick={handleResetAndSelectWalletAndConnect}
                      className={classes.button}
                      size="large"
                      variant={desktop ? "primary" : "outline"}
                      disabled={isConnecting}
                    >
                      <Trans>Select a different wallet</Trans>
                    </Button>
                  </>
                )}
                {desktop && (
                  <Divider>
                    <Typography>
                      <Trans>or</Trans>
                    </Typography>
                  </Divider>
                )}
                <Button
                  className={classes.button}
                  variant={desktop ? "primary" : "outline"}
                  size="large"
                  onClick={() => onLoginWithProvider("github")}
                  disabled={maintenanceMode}
                >
                  <GithubLogoIcon />
                  <Trans>Continue with Github</Trans>
                </Button>
                <Button
                  className={classes.button}
                  variant={desktop ? "primary" : "outline"}
                  size="large"
                  onClick={() => onLoginWithProvider("google")}
                  disabled={maintenanceMode}
                >
                  <GoogleLogoIcon />
                  <Trans>Continue with Google</Trans>
                </Button>
                <Button
                  className={classes.button}
                  size="large"
                  variant={desktop ? "primary" : "outline"}
                  onClick={() => onLoginWithProvider("facebook")}
                  disabled={maintenanceMode}
                >
                  <FacebookLogoIcon />
                  <Trans>Continue with Facebook</Trans>
                </Button>
                {activeMode === "newUser" && (
                  <Typography
                    component="p"
                    variant="body2"
                    className={classes.termsText}
                  >
                    By signing up you agree to the <br />
                    <a
                      href={ROUTE_LINKS.Terms}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href={ROUTE_LINKS.PrivacyPolicy}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </a>
                  </Typography>
                )}
                <Typography className={classes.footerText}>
                  {activeMode === "newUser"
                    ? "Already have an account?"
                    : "Not registered yet?"}
                </Typography>
                <Typography
                  onClick={toggleActiveMode}
                  className={classes.toggleMode}
                >
                  {activeMode === "newUser" ? (
                    <Trans>Sign in</Trans>
                  ) : (
                    <Trans>Create an account</Trans>
                  )}
                </Typography>
              </>
            ) : !secured ? (
              <MasterKeyModule />
            ) : (
              <EnterMasterKeySlide />
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default LoginPage
