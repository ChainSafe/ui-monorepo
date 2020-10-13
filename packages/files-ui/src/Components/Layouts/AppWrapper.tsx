import { useImployApi } from "@imploy/common-contexts"
import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@imploy/common-themes"
import React, { useState } from "react"
import { ReactNode } from "react"
import clsx from "clsx"
import { ROUTE_LINKS } from "../FilesRoutes"
import SearchModule from "../Modules/SearchModule"
import { CssBaseline } from "@imploy/common-components"
import AppHeader from "./AppHeader"
import AppNav from "./AppNav"

interface IAppWrapper {
  children: ReactNode | ReactNode[]
}

/**
 * TODO: Establish height & padding values
 * TODO: position fix + position nav wrappers
 * Content will have padding based on wrappers to ensure system scroll
 */

const useStyles = makeStyles(
  ({ animation, breakpoints, constants }: ITheme) => {
    const modalWidth = constants.generalUnit * 27
    const contentPadding = constants.generalUnit * 15
    const contentTopPadding = constants.generalUnit * 15

    const mobileHeaderHeight = constants.generalUnit * 6.3

    return createStyles({
      root: {
        minHeight: "100vh",
      },
      bodyWrapper: {
        transitionDuration: `${animation.translate}ms`,
        [breakpoints.up("sm")]: {
          padding: `0`,
          "&.active": {
            // This moves the content areas based on the size of the nav bar

            padding: `${0}px ${contentPadding}px ${0}px ${
              modalWidth + contentPadding
            }px`,
          },
        },
        [breakpoints.down("sm")]: {},
      },
      content: {
        [breakpoints.up("sm")]: {
          height: "100%",
          minHeight: "100vh",
          transitionDuration: `${animation.translate}ms`,
          padding: 0,
          "&.active": {
            height: "initial",
            padding: `${contentTopPadding}px 0 0`,
          },
        },
        [breakpoints.down("sm")]: {
          minHeight: "100vh",
          "&.active": {
            height: "initial",
            padding: `${mobileHeaderHeight}px 0 0`,
          },
        },
      },
    })
  },
)

const AppWrapper: React.FC<IAppWrapper> = ({ children }: IAppWrapper) => {
  const classes = useStyles()
  const { breakpoints }: ITheme = useTheme()

  const desktop = useMediaQuery(breakpoints.up("sm"))

  const [navOpen, setNavOpen] = useState<boolean>(desktop)

  const { isLoggedIn } = useImployApi()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppNav setNavOpen={setNavOpen} navOpen={navOpen} />
      <article
        className={clsx(classes.bodyWrapper, {
          active: isLoggedIn,
        })}
      >
        <AppHeader navOpen={navOpen} setNavOpen={setNavOpen} />
        <section
          className={clsx(classes.content, {
            active: isLoggedIn,
          })}
        >
          {children}
        </section>
      </article>
    </div>
  )
}

export default AppWrapper
