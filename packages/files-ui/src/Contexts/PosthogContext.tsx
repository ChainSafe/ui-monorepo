import React, { useCallback, useEffect, useMemo, useState } from "react"
import posthog from "posthog-js"
import {Button, Typography} from "@chainsafe/common-components";
import {createStyles, makeStyles} from "@chainsafe/common-theme";
import {CSFTheme} from "../Themes/types";

export type PosthogContext = {
  shouldShowBanner: Boolean
  optInCapturing: () => void
  optOutCapturing: () => void
}

type PosthogProviderProps = posthog.Config & {
  children: React.ReactNode | React.ReactNode[]
}

const PosthogContext = React.createContext<PosthogContext>({
  shouldShowBanner: true,
  optInCapturing: () => {},
  optOutCapturing: () => {},
})

const useStyles = makeStyles(
  ({ palette }: CSFTheme) => {

    return createStyles({
      cookieBanner: {
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translate(-50%)',
        width:'100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: palette.primary.main,
      }, 
      buttonSection: {
        display: 'flex',
        flexDirection: 'row'
      }
    })
  }
)

const PosthogProvider = ({ children }: PosthogProviderProps) => {
  const [posthogState, setPosthogState] = useState({hasOptedOut: false, hasOptedIn: false})
  const classes = useStyles()

  const refreshPosthogState = () => {
    setPosthogState({
      hasOptedOut: posthog.has_opted_out_capturing(),
      hasOptedIn: posthog.has_opted_in_capturing()
    })
  }

  useEffect(() => {
    refreshPosthogState()
  }, [])

  const shouldShowBanner = useMemo(() => !!posthog && (!posthogState.hasOptedOut && !posthogState.hasOptedIn), [posthogState])
  console.log(posthogState.hasOptedOut, posthogState.hasOptedIn, shouldShowBanner)
  
  const optInCapturing = useCallback(() => {
    posthog.opt_in_capturing()
    refreshPosthogState()
  },[])

  const optOutCapturing = useCallback(() => {
    posthog.opt_out_capturing()
    refreshPosthogState()
  },[])

  return (
    <PosthogContext.Provider
      value={{
        shouldShowBanner,
        optInCapturing,
        optOutCapturing
      }}
    >
      {children}
      {shouldShowBanner && 
        <div className={classes.cookieBanner}>
          <Typography variant='h4'>This website uses cookies</Typography>
          <Typography variant='body2'>Cookie legal...Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Typography>
          <div className={classes.buttonSection}>
          <Button onClick={optInCapturing}>Accept</Button>
          <Button onClick={optOutCapturing}>Decline</Button>
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
  // const { pathname } = useLocation();
  // useEffect(() => {
  //   posthog.capture("$pageview");
  // }, [pathname]);
}

export { PosthogProvider, usePosthogContext, usePageTrack }