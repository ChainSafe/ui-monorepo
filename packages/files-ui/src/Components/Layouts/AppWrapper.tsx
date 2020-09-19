import { useAuth } from "@chainsafe/common-contexts"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React, { Fragment } from "react"
import { ReactNode } from "react"
import clsx from "clsx"
import {
  Link,
  Typography,
  ChainsafeFilesLogo,
} from "@chainsafe/common-components"
import { ROUTE_LINKS } from "../FilesRoutes"

interface IAppWrapper {
  children: ReactNode | ReactNode[]
}

/**
 * TODO: Establish height & padding values
 * TODO: position fix + position nav wrappers
 * Content will have padding based on wrappers to ensure system scroll
 */

const useStyles = makeStyles(({ animation, breakpoints }: ITheme) =>
  createStyles({
    root: {
      minHeight: "100vh",
    },
    nav: {
      width: 0,
      height: "100%",
      overflow: "hidden",
      transitionDuration: `${animation.transform}ms`,
      position: "fixed",
      top: 0,
      left: 0,
      "&.active": {},
    },
    header: {
      transitionDuration: `${animation.transform}ms`,
      "&.active": {},
    },
    content: {
      height: "100%",
      transitionDuration: `${animation.transform}ms`,
      "&.active": {},
    },
  }),
)

const AppWrapper: React.FC<IAppWrapper> = ({ children }: IAppWrapper) => {
  const { isLoggedIn } = useAuth()
  const classes = useStyles()
  return (
    <body className={classes.root}>
      <section
        className={clsx(classes.nav, {
          ["active"]: isLoggedIn,
        })}
      >
        {isLoggedIn && (
          <Fragment>
            <div>
              <Link to={ROUTE_LINKS.Home}>
                <ChainsafeFilesLogo />
                <Typography>Files</Typography>
              </Link>
            </div>
            <div>
              <Typography>Folders</Typography>
              <nav>{/* TODO: itterate over routes */}</nav>
            </div>
            <div>
              <Typography>Resources</Typography>
              <nav>{/* TODO: itterate over routes */}</nav>
            </div>
          </Fragment>
        )}
      </section>
      <article>
        <header
          className={clsx(classes.header, {
            ["active"]: isLoggedIn,
          })}
        ></header>
        <body className={classes.content}>{children}</body>
      </article>
    </body>
  )
}

export default AppWrapper
