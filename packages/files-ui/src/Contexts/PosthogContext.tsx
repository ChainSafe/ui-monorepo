import React, { useCallback, useEffect, useMemo, useState } from "react"
import posthog from "posthog-js"
import { Button, Typography, useLocation } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../Themes/types"
import { useUser } from "./UserContext"

export type PosthogContext = {
  posthogInitialized: boolean
  shouldShowBanner: boolean
}

type PosthogProviderProps = posthog.Config & {
  children: React.ReactNode | React.ReactNode[]
}

const PosthogContext = React.createContext<PosthogContext>({
  posthogInitialized: false,
  shouldShowBanner: false
})

const useStyles = makeStyles(
  ({ palette }: CSFTheme) => {

    return createStyles({
      cookieBanner: {
        position: "fixed",
        bottom: 0,
        width:"100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: palette.primary.main,
        padding: "16px 32px"
      },
      buttonSection: {
        display: "flex",
        flexDirection: "row",
        "& > *":{
          margin: 8
        }
      }
    })
  }
)

const PosthogProvider = ({ children }: PosthogProviderProps) => {
  const [posthogState, setPosthogState] = useState({ hasOptedOut: false, hasOptedIn: false })
  const { profile } = useUser()
  const classes = useStyles()
  const posthogInitialized = useMemo(() =>
    !!process.env.REACT_APP_POSTHOG_PROJECT_API_KEY &&
    !!process.env.REACT_APP_POSTHOG_INSTANCE_ADDRESS,
  [])

  const refreshPosthogState = useCallback(() => {
    if (posthogInitialized) {
      const optedOut = posthog.has_opted_out_capturing()
      const optedIn = posthog.has_opted_in_capturing()
      setPosthogState({
        hasOptedOut: optedOut,
        hasOptedIn: optedIn
      })
    }
  }, [posthogInitialized])

  useEffect(() => {
    refreshPosthogState()
  }, [refreshPosthogState])

  useEffect(() => {
    if (posthogInitialized){
      profile?.userId
        ? posthog.identify(profile.userId)
        : posthog.reset()
    }
  }, [profile, posthogInitialized])

  const shouldShowBanner = useMemo(() =>
    posthogInitialized && !posthogState.hasOptedOut && !posthogState.hasOptedIn, [posthogState, posthogInitialized])

  const optInCapturing = useCallback(() => {
    if (posthogInitialized) {
      posthog.opt_in_capturing()
      refreshPosthogState()
    }
  }, [posthogInitialized, refreshPosthogState])

  const optOutCapturing = useCallback(() => {
    if (posthogInitialized) {
      posthog.opt_out_capturing()
      refreshPosthogState()
    }
  }, [posthogInitialized, refreshPosthogState])

  return (
    <PosthogContext.Provider
      value={{
        posthogInitialized,
        shouldShowBanner
      }}
    >
      {children}
      {shouldShowBanner &&
        <div className={classes.cookieBanner}>
          <Typography variant='h4'>This website uses cookies</Typography>
          <Typography variant='body2'>
            Cookie legal...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Typography>
          <div className={classes.buttonSection}>
            <Button onClick={optOutCapturing}>Decline</Button>
            <Button onClick={optInCapturing}
              variant='outline'>Accept</Button>
          </div>
        </div>
      }
    </PosthogContext.Provider>
  )
}

function usePosthogContext() {
  const context = React.useContext(PosthogContext)
  if (context === undefined) {
    throw new Error("usePosthogContext must be used within a LanguageProvider")
  }
  return context
}

function usePageTrack() {
  const { pathname } = useLocation()
  const { posthogInitialized } = usePosthogContext()
  useEffect(() => {
    posthogInitialized && posthog.capture("$pageview")
  }, [pathname, posthogInitialized])
}

export { PosthogProvider, usePosthogContext, usePageTrack }