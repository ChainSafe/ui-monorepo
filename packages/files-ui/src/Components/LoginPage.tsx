import React, { useState } from "react"
import { Grid, Typography, Button } from "@chainsafe/common-components"
import { useWeb3 } from "@chainsafe/web3-context"

const LoginPage = () => {
  const returningUser = false // TODO: Get this from Auth Context
  const { wallet, onboard, checkIsReady } = useWeb3()
  const [activeMode, setActiveMode] = useState<"newUser" | "returningUser">(
    returningUser ? "returningUser" : "newUser",
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
    }
    // TODO Call Auth context to initiate auth flow
    setIsConnecting(false)
  }
  return (
    <div>
      <Grid container>
        <Grid item md={8}>
          <img src="abstract-image-large.png" alt="" />
          <Typography>Making secure cloud storage easier than ever.</Typography>
        </Grid>
        <Grid item md={4}>
          <Typography>Chainsafe Files</Typography>
          {activeMode === "newUser" ? (
            <Typography>Create an account</Typography>
          ) : (
            <Typography>Welcome back!</Typography>
          )}
          <Button onClick={handleSelectWalletAndConnect}>
            Continue with Web3 Wallet
          </Button>
          <Button>Continue with Apple</Button>
          <Button>Continue with Google</Button>
          {activeMode === "newUser" ? (
            <>
              <Typography>Already have an account?</Typography>
              <Typography onClick={toggleActiveMode}>Sign in</Typography>
            </>
          ) : (
            <>
              <Typography>Not registered yet?</Typography>
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
