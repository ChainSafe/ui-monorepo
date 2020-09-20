import { useAuth } from "@chainsafe/common-contexts"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-themes"
import React, { Fragment } from "react"
import { ReactNode } from "react"
import clsx from "clsx"
import {
  Link,
  Typography,
  ChainsafeFilesLogo,
  DatabaseSvg,
  StarSvg,
  CloseCirceSvg,
  DeleteSvg,
  InfoCircleSvg,
  SettingSvg,
  Avatar,
  Blockies,
} from "@chainsafe/common-components"
import { ROUTE_LINKS } from "../FilesRoutes"
import SearchModule from "../Modules/SearchModule"

interface IAppWrapper {
  children: ReactNode | ReactNode[]
}

/**
 * TODO: Establish height & padding values
 * TODO: position fix + position nav wrappers
 * Content will have padding based on wrappers to ensure system scroll
 */

const useStyles = makeStyles(({ animation, breakpoints, constants }: ITheme) =>
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
    navItem: {},
    bodyWrapper: {
      transitionDuration: `${animation.transform}ms`,
      padding: `0`,
      "&.active": {
        padding: `${0}px ${constants.generalUnit * 15}px`,
      },
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
          active: isLoggedIn,
        })}
      >
        {isLoggedIn && (
          <Fragment>
            <div>
              <Link to={ROUTE_LINKS.Home}>
                <ChainsafeFilesLogo />
                <Typography variant="h5">Files</Typography>
              </Link>
            </div>
            <div>
              <Typography>Folders</Typography>
              <nav>
                <Link to="">
                  <DatabaseSvg />
                  <Typography variant="h5">All</Typography>
                </Link>
                <Link to="">
                  <StarSvg />
                  <Typography variant="h5">Starred</Typography>
                </Link>
                <Link to="">
                  <CloseCirceSvg />
                  <Typography variant="h5">Recents</Typography>
                </Link>
                <Link to="">
                  <DeleteSvg />
                  <Typography variant="h5">Trash</Typography>
                </Link>
              </nav>
            </div>
            <div>
              <Typography>Resources</Typography>
              <nav>
                <Link to="">
                  <InfoCircleSvg />
                  <Typography variant="h5">Support</Typography>
                </Link>
                <Link to="">
                  <SettingSvg />
                  <Typography variant="h5">Settings</Typography>
                </Link>
              </nav>
            </div>
          </Fragment>
        )}
      </section>
      <article
        className={clsx(classes.bodyWrapper, {
          active: isLoggedIn,
        })}
      >
        <header
          className={clsx(classes.header, {
            active: isLoggedIn,
          })}
        >
          <SearchModule />
          <section>
            <Avatar size="large" variant="circle">
              {/* TODO: Wire up to User profile */}
              <Blockies seed="A wombat enters combat with another wombat, are they both combat wombats by combatting a wombat or is the assailant a combat wombat for combatting a wombat?" />
            </Avatar>
          </section>
        </header>
        <body className={classes.content}>{children}</body>
      </article>
    </body>
  )
}

export default AppWrapper
