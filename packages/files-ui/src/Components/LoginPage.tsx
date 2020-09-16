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
      // paddingLeft: 144,
      paddingTop: 26,
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
        <Grid item md={4} className={classes.buttonSection}>
          <img src="ChainSafe-logo.png" alt="Chainsafe Logo" />
          <Typography>Chainsafe Files</Typography>
          {activeMode === "newUser" ? (
            <Typography>Create an account</Typography>
          ) : (
            <Typography>Welcome back!</Typography>
          )}
          <Button onClick={handleSelectWalletAndConnect}>
            Continue with Web3 Wallet
          </Button>
          <Button disabled>
            <AppleLogoIcon fontSize="small" /> Continue with Apple
          </Button>
          <Button disabled>
            <GoogleLogoIcon fontSize="small" /> Continue with Google
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
