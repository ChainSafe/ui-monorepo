// Source: https://github.com/mui-org/material-ui/blob/next/packages/material-ui/src/useMediaQuery/useMediaQuery.js

import * as React from "react"
import { getThemeProps, useTheme } from "@material-ui/styles"

export interface Options {
  defaultMatches?: boolean
  noSsr?: boolean
  ssrMatchMedia?: (query: string) => { matches: boolean }
}

export const useMediaQuery = <Theme = unknown>(
  queryInput: string | ((theme: Theme) => string),
  options: Options = {}
) => {
  const theme = useTheme()
  const props = getThemeProps({
    theme,
    name: "MuiUseMediaQuery",
    props: {}
  })

  if (process.env.NODE_ENV !== "production") {
    if (typeof queryInput === "function" && theme === null) {
      console.error(
        [
          "Material-UI: The `query` argument provided is invalid.",
          "You are providing a function without a theme in the context.",
          "One of the parent elements needs to use a ThemeProvider."
        ].join("\n")
      )
    }
  }

  let query =
    typeof queryInput === "function" ? queryInput(theme as Theme) : queryInput
  query = query.replace(/^@media( ?)/m, "")

  // Wait for jsdom to support the match media feature.
  // All the browsers Material-UI support have this built-in.
  // This defensive check is here for simplicity.
  // Most of the time, the match media logic isn't central to people tests.
  const supportMatchMedia =
    typeof window !== "undefined" && typeof window.matchMedia !== "undefined"

  const {
    defaultMatches = false,
    matchMedia = supportMatchMedia ? window.matchMedia : null,
    noSsr = false,
    ssrMatchMedia = null
  } = {
    ...props,
    ...options
  }

  const [match, setMatch] = React.useState(() => {
    if (noSsr && supportMatchMedia) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      return matchMedia(query).matches
    }
    if (ssrMatchMedia) {
      return ssrMatchMedia(query).matches
    }

    // Once the component is mounted, we rely on the
    // event listeners to return the correct matches value.
    return defaultMatches
  })

  React.useEffect(() => {
    let active = true

    if (!supportMatchMedia) {
      return undefined
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    const queryList = matchMedia(query)
    const updateMatch = () => {
      // Workaround Safari wrong implementation of matchMedia
      // TODO can we remove it?
      // https://github.com/mui-org/material-ui/pull/17315#issuecomment-528286677
      if (active) {
        setMatch(queryList.matches)
      }
    }
    updateMatch()
    queryList.addListener(updateMatch)
    return () => {
      active = false
      queryList.removeListener(updateMatch)
    }
  }, [query, matchMedia, supportMatchMedia])

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useDebugValue({ query, match })
  }

  return match
}
