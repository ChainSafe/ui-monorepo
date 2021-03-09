import React, { useState } from "react"
import { Button, FacebookLogoIcon, GithubLogoIcon, GoogleLogoIcon, Typography } from "@chainsafe/common-components"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../Themes/types"
import { Trans } from "@lingui/macro"
import { useImployApi } from "@imploy/common-contexts"
import { useWeb3 } from "@chainsafe/web3-context"
import { useThresholdKey } from "../../../Contexts/ThresholdKeyContext"
import { LOGIN_TYPE } from "@toruslabs/torus-direct-web-sdk"
import { ROUTE_LINKS } from "../../FilesRoutes"

const useStyles = makeStyles(
  ({ constants, palette, breakpoints, zIndex }: CSFTheme) =>
    createStyles({
      root: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        flex: "1 1 0",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: zIndex?.layer1,
        backgroundColor: constants.landing.background,
        border: `1px solid ${constants.landing.border}`,
        boxShadow: constants.landing.boxShadow,
        minHeight: "64vh",
        borderRadius: 6,
        [breakpoints.up("md")]:{
          minWidth: 440
        }
      },
      buttonSection: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)"
      },
      button: {
        width: 240,
        marginBottom: constants.generalUnit * 2
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
          color: palette.common.white.main,
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
        }
      }
    })
)

const InitialScreen: React.FC = () => {
  const {
    selectWallet,
    resetAndSelectWallet
  } = useImployApi()
  const { desktop } = useThemeSwitcher()
  const { provider, wallet } = useWeb3()
  const {
    login
  } = useThresholdKey()
  const classes = useStyles()

  const [error, setError] = useState<string>("")
  const maintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === "true"
  
  const [isConnecting, setIsConnecting] = useState(false)
  const [showSignatureMessage, setShowSignatureMessage] = useState(false)

  const handleSelectWalletAndConnect = async () => {
    setIsConnecting(true)
    setError("")
    try {
      await selectWallet()
    } catch (error) {
      setError("There was an error connecting your wallet")
    }
    setIsConnecting(false)
  }

  const handleResetAndSelectWalletAndConnect = async () => {
    setError("")
    setIsConnecting(true)
    try {
      await resetAndSelectWallet()
    } catch (error) {
      setError("There was an error connecting your wallet")
    }
    setIsConnecting(false)
  }

  const handleSignAuth = async () => {
    setError("")
    setIsConnecting(true)
    setShowSignatureMessage(true)
    try {
      await login("web3")
    } catch (error) {
      let errorMessage = "There was an error authenticating"
      if (Array.isArray(error) && error[0]) {
        if (
          error[0].type === "signature" &&
          error[0].message === "Invalid signature"
        ) {
          errorMessage = `Failed to validate signature.
            If you are using a contract wallet (Argent) please make 
            sure you have activated your wallet.`
        }
      }
      if (error?.message === "Just nope") {
        // WalletConnect be sassy
        errorMessage = "Failed to get signature"
      }
      setError(errorMessage)
    }
    setIsConnecting(false)
    setShowSignatureMessage(false)
  }

  const handleOAuthLogin = async (loginType: LOGIN_TYPE) => {
    setIsConnecting(true)
    try {
      await login(loginType)
    } catch (error) {
      console.log(error)
    }
    setIsConnecting(false)
  }

  return (
    <div className={classes.root}>
      <Typography
        variant="h6"
        component="h1"
        className={classes.headerText}
      >
        <Trans>
          Sign in
        </Trans>
      </Typography>
      {error && (
        <Typography className={classes.error}>{error}</Typography>
      )}
      {maintenanceMode && (
        <Typography className={classes.error}>
          We`&apos;`re undergoing maintenance, thank you for being patient
        </Typography>
      )}

      <section className={classes.buttonSection}>
        {!provider ? (
          <Button
            onClick={handleSelectWalletAndConnect}
            className={classes.button}
            variant={desktop ? "primary" : "outline"}
            size="large"
            disabled={maintenanceMode}
            loading={isConnecting}
          >
            <span>
              <Trans>Select a Web3 Wallet</Trans>
            </span>
          </Button>
        ) : (
          <>
            <Button
              onClick={handleSignAuth}
              className={classes.button}
              variant={desktop ? "primary" : "outline"}
              size="large"
              disabled={maintenanceMode}
              loading={isConnecting}
            >
              <span>
                <Trans>Continue with</Trans>
              </span>{" "}
              <span>&nbsp;{wallet?.name}</span>
            </Button>
            <Button
              onClick={handleResetAndSelectWalletAndConnect}
              className={classes.button}
              size="large"
              variant={desktop ? "primary" : "outline"}
              disabled={isConnecting}
            >
              <span>
                <Trans>Select a different wallet</Trans>
              </span>
            </Button>
            {showSignatureMessage && (
              <Typography>
                Please confirm in your wallet to continue
              </Typography>
            )}
          </>
        )}
        <Button
          className={classes.button}
          variant={desktop ? "primary" : "outline"}
          size="large"
          onClick={() => handleOAuthLogin("github")}
          disabled={maintenanceMode || isConnecting}
        >
          <GithubLogoIcon />
          <Trans>Continue with Github</Trans>
        </Button>
        <Button
          className={classes.button}
          variant={desktop ? "primary" : "outline"}
          size="large"
          onClick={() => handleOAuthLogin("google")}
          disabled={maintenanceMode || isConnecting}
        >
          <GoogleLogoIcon />
          <Trans>Continue with Google</Trans>
        </Button>
        <Button
          className={classes.button}
          size="large"
          variant={desktop ? "primary" : "outline"}
          onClick={() => handleOAuthLogin("facebook")}
          disabled={maintenanceMode || isConnecting}
        >
          <FacebookLogoIcon />
          <Trans>Continue with Facebook</Trans>
        </Button>
      </section>
      <footer className={classes.footer}>
        <a
          href={ROUTE_LINKS.PrivacyPolicy}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography>
            Privacy Policy
          </Typography>
        </a>
        <a
          href={ROUTE_LINKS.Terms}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography>
            Terms and Conditions
          </Typography>
        </a>
      </footer>
    </div>
  )
}

export default InitialScreen
