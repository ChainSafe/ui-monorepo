import { useAuth } from "@chainsafe/common-contexts"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React, { Fragment } from "react"
import { ReactNode } from "react"
import clsx from "clsx"
import { Typography } from "@chainsafe/common-components"

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
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
      width: "100%",
      minHeight: "100vh",
    },
    nav: {
      width: 0,
      overflow: "hidden",
      transitionDuration: `${animation.transform}ms`,
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
            <div>{/* TODO Logo */}</div>
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
