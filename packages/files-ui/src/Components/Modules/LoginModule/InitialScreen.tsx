import React, { useState } from "react"
import { Button, FacebookLogoIcon, GithubLogoIcon, GoogleLogoIcon, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { t, Trans } from "@lingui/macro"
import { useImployApi } from "@chainsafe/common-contexts"
import { useWeb3 } from "@chainsafe/web3-context"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { LOGIN_TYPE } from "@toruslabs/torus-direct-web-sdk"
import { ROUTE_LINKS } from "../../FilesRoutes"
import clsx from "clsx"

const useStyles = makeStyles(
  ({ constants, palette, breakpoints }: CSFTheme) =>
    createStyles({
      root: {
        backgroundColor: constants.loginModule.background,
        border: `1px solid ${constants.landing.border}`,
        boxShadow: constants.landing.boxShadow,
        alignItems: "center",
        borderRadius: 6,
        [breakpoints.up("md")]:{
          minHeight: "64vh",
          justifyContent: "space-between",
          width: 440
        },
        [breakpoints.down("md")]: {
          padding: `${constants.generalUnit * 4}px ${constants.generalUnit * 2}px`,
          justifyContent: "center",
          width: `calc(100vw - ${constants.generalUnit * 2}px)`
        }
      },
      buttonSection: {
        [breakpoints.up("md")]: {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)"
        },
        [breakpoints.down("md")]: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly"
        }
      },
      connectingWallet: {
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        "& > *": {
          fontWeight: 400
        },
        [breakpoints.up("md")]: {
          padding: `${constants.generalUnit * 30}px ${constants.generalUnit * 8}px`,
          "& > *": {
            paddingBottom: `${constants.generalUnit * 5}px`
          }
        },
        [breakpoints.down("md")]: {
          justifyContent: "space-evenly"
        }
      },
      button: {
        width: 240,
        marginBottom: constants.generalUnit * 2,
        "&:last-child": {
          marginBottom: 0
        }
      },
      error: {
        color: palette.error.main,
        paddingBottom: constants.generalUnit * 2,
        maxWidth: 240
      },
      headerText: {
        [breakpoints.up("md")]: {
          paddingTop: constants.generalUnit * 4,
          paddingBottom: constants.generalUnit * 8
        },
        [breakpoints.down("md")]: {
          paddingTop: constants.generalUnit * 3,
          paddingBottom: constants.generalUnit * 3,
          textAlign: "center"
        }
      },
      footer: {
        backgroundColor: constants.landing.footerBg,
        color: constants.landing.footerText,
        padding: `${constants.generalUnit * 2.5}px ${constants.generalUnit * 1.5}px`,
        width: "100%",
        "& > *": {
          marginRight: constants.generalUnit * 3.5
        },
        [breakpoints.down("md")]: {
          // TODO: confirm how to move this around
          display: "none"
        }
      },
      connectWalletFooter: {
        backgroundColor: constants.landing.background,
        color: constants.landing.footerText,
        padding: `${constants.generalUnit * 4.375}px ${constants.generalUnit * 11}px`,
        width: "100%",
        textAlign: "center",
        "& > *": {
          fontWeight: 400
        },
        [breakpoints.down("md")]: {
          // TODO: confirm how to move this around
          display: "none"
        }
      }
    })
)

interface IInitialScreen {
  className?: string
}

const InitialScreen: React.FC<IInitialScreen> = ({
  className
}: IInitialScreen) => {
  const { selectWallet, resetAndSelectWallet } = useImployApi()
  const { desktop } = useThemeSwitcher()
  const { wallet } = useWeb3()
  const { login } = useThresholdKey()
  const classes = useStyles()
  const [loginMode, setLoginMode] = useState<"web3" | LOGIN_TYPE | undefined>()

  const [error, setError] = useState<string | undefined>()
  const maintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === "true"

  const [isConnecting, setIsConnecting] = useState(false)

  const handleSelectWalletAndConnect = async () => {
    setError(undefined)
    try {
      await selectWallet()
    } catch (error) {
      setError(t`There was an error connecting your wallet`)
    }
  }

  const handleResetAndSelectWallet = async () => {
    setError(undefined)
    try {
      await resetAndSelectWallet()
    } catch (error) {
      setError(t`There was an error connecting your wallet`)
    }
  }

  const resetLogin = async () => {
    setError(undefined)
    setLoginMode(undefined)
  }

  const handleLogin = async (loginType: LOGIN_TYPE | "web3") => {
    setError("")
    setIsConnecting(true)
    setLoginMode(loginType)
    try {
      await login(loginType)
    } catch (error) {
      let errorMessage = t`There was an error authenticating`
      console.log(error)
      if (Array.isArray(error) && error[0]) {
        if (
          error[0].type === "signature" &&
          error[0].message === "Invalid signature"
        ) {
          errorMessage = t`Failed to validate signature.
            If you are using a contract wallet, please make 
            sure you have activated your wallet.`
        }
      }
      // WalletConnect be sassy
      if (error?.message === "Just nope" || error?.code === 4001) {
        errorMessage = t`Failed to get signature`
      }
      if (error?.message === "user closed popup") {
        errorMessage = t`The authentication popup was closed`
      }
      setError(errorMessage)
    }
    setIsConnecting(false)
  }

  return (
    <div className={clsx(classes.root, className)}>
      {
        ((desktop && !isConnecting && !error) || (isConnecting && loginMode !== "web3")) && (
          <Typography
            variant="h6"
            component="h1"
            className={classes.headerText}
          >
            <Trans>
              Get Started
            </Trans>
          </Typography>
        )
      }
      {
        !error ?
          loginMode !== "web3" ? (
            <>
              <section className={classes.buttonSection}>
                <Button
                  onClick={() => {
                    setLoginMode("web3")
                    handleSelectWalletAndConnect()
                  }}
                  className={classes.button}
                  variant="primary"
                  size="large"
                  disabled={maintenanceMode || isConnecting}
                >
                  <Trans>Continue with Web3 Wallet</Trans>
                </Button>
                <Button
                  className={classes.button}
                  variant="primary"
                  size="large"
                  onClick={() => handleLogin("github")}
                  disabled={maintenanceMode || isConnecting}
                  loading={isConnecting && loginMode === "github"}
                >
                  <GithubLogoIcon />
                  <Trans>Continue with Github</Trans>
                </Button>
                <Button
                  className={classes.button}
                  variant="primary"
                  size="large"
                  onClick={() => handleLogin("google")}
                  disabled={maintenanceMode || isConnecting}
                  loading={isConnecting && loginMode === "google"}
                >
                  <GoogleLogoIcon />
                  <Trans>Continue with Google</Trans>
                </Button>
                <Button
                  className={classes.button}
                  size="large"
                  variant="primary"
                  onClick={() => handleLogin("facebook")}
                  disabled={maintenanceMode || isConnecting}
                  loading={isConnecting && loginMode === "facebook"}
                >
                  <FacebookLogoIcon />
                  <Trans>Continue with Facebook</Trans>
                </Button>
                {maintenanceMode && (
                  <Typography>
                    <Trans>
                      We`&apos;`re undergoing maintenance, thank you for being patient
                    </Trans>
                  </Typography>
                )}
              </section>
              <footer className={classes.footer}>
                <a
                  href={ROUTE_LINKS.PrivacyPolicy}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography>
                    <Trans>
                        Privacy Policy
                    </Trans>
                  </Typography>
                </a>
                <a
                  href={ROUTE_LINKS.Terms}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography>
                    <Trans>
                        Terms and Conditions
                    </Trans>
                  </Typography>
                </a>
              </footer>
            </>
          ) : (
            wallet ?
              !isConnecting ? (
                <>
                  <section className={classes.buttonSection}>
                    <Button
                      onClick={() => {
                        handleLogin("web3")
                      }}
                      className={classes.button}
                      variant="primary"
                      size="large"
                      disabled={maintenanceMode}
                    >
                      <Trans>Continue with {wallet.name}</Trans>
                    </Button>
                    <Button
                      onClick={handleResetAndSelectWallet}
                      className={classes.button}
                      variant="primary"
                      size="large"
                      disabled={maintenanceMode}
                    >
                      <Trans>Connect a new wallet</Trans>
                    </Button>
                  </section>
                  <footer className={classes.connectWalletFooter}>
                    <Typography variant='h5'>
                      <Trans>By connecting your wallet, you agree to our terms and privacy policy.</Trans>
                    </Typography>
                  </footer>
                </>
              ) : (
                <>
                  <section className={classes.connectingWallet}>
                    <Typography variant='h2'><Trans>Connect Wallet to Files</Trans></Typography>
                    <Typography variant='h5'>
                      <Trans>You will need to sign a message in your wallet to complete sign in.</Trans>
                    </Typography>
                  </section>
                </>
              )
              : null
          ) : (
            <>
              <section className={classes.connectingWallet}>
                <Typography variant='h2'><Trans>Connection failed</Trans></Typography>
                <Typography variant='h5'>
                  {error}
                </Typography>
                <Button onClick={resetLogin}>
                  <Trans>Try again</Trans>
                </Button>
              </section>
            </>
          )
      }
    </div>
  )
}

export default InitialScreen
