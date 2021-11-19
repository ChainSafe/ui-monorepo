import React, { useCallback, useEffect, useMemo, useState } from "react"
import posthog from "posthog-js"
import { Button, Typography, useLocation } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import { useLocalStorage } from "@chainsafe/browser-storage-hooks"
import { CSFTheme } from "../Themes/types"
import { useUser } from "./UserContext"

export type PosthogContext = {
  hasOptedIn: boolean
  posthogInitialized: boolean
  captureEvent: (eventName: string, properties?: posthog.Properties) => void
}

type PosthogProviderProps = posthog.Config & {
  children: React.ReactNode | React.ReactNode[]
}

const PosthogContext = React.createContext<PosthogContext>({
  hasOptedIn: false,
  posthogInitialized: false,
  captureEvent: () => undefined
})

const useStyles = makeStyles(
  ({ palette, breakpoints, constants }: CSFTheme) => {
    return createStyles({
      cookieBanner: {
        position: "fixed",
        bottom: 0,
        width: "100%",
        display: "flex",
        color: palette.common.white.main,
        flexDirection: "column",
        backgroundColor: constants.cookieBanner.backgroundColor,
        padding: "16px 32px",
        [breakpoints.down("sm")]: {
          padding: "8px 16px"
        }
      },
      bannerHeading: {
        fontSize: 24,
        lineHeight: "28px",
        [breakpoints.down("sm")]: {
          fontSize: 18,
          lineHeight: "22px"
        }
      },
      bannerText: {
        fontSize: 14,
        lineHeight: "18px",
        [breakpoints.down("sm")]: {
          fontSize: 12,
          lineHeight: "16px"
        }
      },
      link: {
        color: palette.common.white.main
      },
      buttonSection: {
        display: "flex",
        flexDirection: "row",
        "& > *": {
          margin: 8
        }
      }
    })
  }
)

const TOUCHED_COOKIE_BANNER_KEY = "csf.touchedCookieBanner"

const PosthogProvider = ({ children }: PosthogProviderProps) => {
  const [hasOptedIn, setHasOptedIn] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [hasTouchedCookieBanner, setHasTouchedCookieBanner ] = useState(false)
  const { localStorageGet, localStorageSet } = useLocalStorage()
  const { profile } = useUser()

  const classes = useStyles()
  const posthogInitialized = useMemo(() =>
    !!process.env.REACT_APP_POSTHOG_PROJECT_API_KEY &&
    !!process.env.REACT_APP_POSTHOG_INSTANCE_ADDRESS,
  [])

  useEffect(() => {
    if(localStorageGet(TOUCHED_COOKIE_BANNER_KEY) === null){
      localStorageSet(TOUCHED_COOKIE_BANNER_KEY, "false")
    }
  }, [localStorageGet, localStorageSet])

  useEffect(() => {
    if(posthogInitialized && !hasTouchedCookieBanner && localStorageGet(TOUCHED_COOKIE_BANNER_KEY) === "false"){
      setShowBanner(true)
    } else {
      setShowBanner(false)
    }
  }, [posthogInitialized, hasTouchedCookieBanner, localStorageGet])

  const touchCookieBanner = useCallback(() => {
    localStorageSet(TOUCHED_COOKIE_BANNER_KEY, "true")
    setHasTouchedCookieBanner(true)
  }, [localStorageSet])

  const optInCapturing = useCallback(() => {
    if (posthogInitialized) {
      posthog.opt_in_capturing()
      touchCookieBanner()
      setHasOptedIn(true)
    }
  }, [posthogInitialized, touchCookieBanner])

  const optOutCapturing = useCallback(() => {
    if (posthogInitialized) {
      posthog.opt_out_capturing()
      touchCookieBanner()
    }
  }, [posthogInitialized, touchCookieBanner])

  const captureEvent = useCallback((eventName: string, properties?: posthog.Properties) => {
    if (posthogInitialized) {
      posthog.capture(eventName, properties)
    }
  }, [posthogInitialized])

  useEffect(() => {
    if (profile) {
      posthogInitialized && posthog.identify(profile.userId)
    } else {
      posthogInitialized && posthog.reset()
    }
  }, [profile, posthogInitialized])

  return (
    <PosthogContext.Provider
      value={{
        hasOptedIn,
        posthogInitialized,
        captureEvent
      }}
    >
      {children}
      {showBanner &&
        <div className={classes.cookieBanner}>
          <Typography className={classes.bannerHeading}><Trans>This website uses cookies</Trans></Typography>
          <Typography className={classes.bannerText}>
            <Trans>
              This website uses cookies that help the website function and track interactions for analytics purposes.
              You have the right to decline our use of cookies. For us to provide a customizable user experience to you,
              please click on the Accept button below.
              <a className={classes.link}
                href="https://files.chainsafe.io/privacy-policy"
                target='_blank'
                rel='noopener noreferrer'>Learn more
              </a>
            </Trans>
          </Typography>
          <div className={classes.buttonSection}>
            <Button
              onClick={optOutCapturing}
              variant='secondary'
            >
              <Trans>Decline</Trans></Button>
            <Button
              onClick={optInCapturing}
              variant='outline'
            >
              <Trans>Accept</Trans>
            </Button>
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
  const { hasOptedIn, posthogInitialized } = usePosthogContext()

  useEffect(() => {
    posthogInitialized && hasOptedIn && posthog.capture("$pageview")
  }, [pathname, hasOptedIn, posthogInitialized])
}

export { PosthogProvider, usePosthogContext, usePageTrack }