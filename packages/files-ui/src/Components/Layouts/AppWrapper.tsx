import { useImployApi } from "@chainsafe/common-contexts"
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
  MenuDropdown,
  PowerDownSvg,
  CssBaseline,
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

const useStyles = makeStyles(
  ({ palette, animation, breakpoints, constants }: ITheme) => {
    const modalWidth = constants.generalUnit * 27
    const contentPadding = constants.generalUnit * 15
    const contentTopPadding = constants.generalUnit * 15
    const svgWidth = constants.generalUnit * 2.5
    const topPadding = constants.generalUnit * 3
    const accountControlsPadding = constants.generalUnit * 7

    return createStyles({
      root: {
        minHeight: "100vh",
      },
      logo: {
        textDecoration: "none",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        "& img": {
          height: constants.generalUnit * 5,
          width: "auto",
        },
        "& > *:first-child": {
          marginRight: constants.generalUnit,
        },
      },
      nav: {
        width: 0,
        backgroundColor: palette.additional["gray"][6],
        height: "100%",
        overflow: "hidden",
        transitionDuration: `${animation.translate}ms`,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        opacity: 0,
        padding: `${topPadding}px ${constants.generalUnit * 4.5}px`,
        "&.active": {
          opacity: 1,
          width: modalWidth,
        },
      },
      navMenu: {
        display: "flex",
        flexDirection: "column",
        marginBottom: constants.generalUnit * 8.5,
      },
      linksArea: {
        display: "flex",
        flexDirection: "column",
        height: 0,
        justifyContent: "center",
        flex: "1 1 0",
        "& > span": {
          marginBottom: constants.generalUnit * 2,
        },
      },
      navItem: {
        textDecoration: "none",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: `${constants.generalUnit * 1.5}px 0`,
        "& svg": {
          width: svgWidth,
          marginRight: constants.generalUnit * 2,
        },
      },
      bodyWrapper: {
        transitionDuration: `${animation.translate}ms`,
        padding: `0`,
        "&.active": {
          // This moves the content areas based on the size of the nav bar

          padding: `${0}px ${contentPadding}px ${0}px ${
            modalWidth + contentPadding
          }px`,
        },
      },
      header: {
        position: "fixed",
        display: "flex",
        flexDirection: "row",
        top: 0,
        left: modalWidth,
        width: `calc(100% - ${modalWidth}px)`,
        padding: `${0}px ${contentPadding}px ${0}px ${contentPadding}px`,
        transitionDuration: `${animation.translate}ms`,
        opacity: 0,
        backgroundColor: palette.common.white.main,
        visibility: "hidden",
        backgroundColor: palette.background.default,
        "& >*:first-child": {
          flex: "1 1 0",
        },
        "&.active": {
          opacity: 1,
          height: "auto",
          visibility: "visible",
          padding: `${topPadding}px ${contentPadding}px ${0}px ${contentPadding}px`,
        },
      },
      accountControls: {
        marginLeft: accountControlsPadding,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
        "& > *:first-child": {
          marginRight: constants.generalUnit * 2,
        },
      },
      menuItem: {},
      content: {
        height: "100%",
        minHeight: "100vh",
        transitionDuration: `${animation.translate}ms`,
        padding: 0,
        "&.active": {
          height: "initial",
          padding: `${contentTopPadding}px 0 0`,
        },
      },
    })
  },
)

const AppWrapper: React.FC<IAppWrapper> = ({ children }: IAppWrapper) => {
  const { isLoggedIn } = useImployApi()
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <CssBaseline />
      <section
        className={clsx(classes.nav, {
          active: isLoggedIn,
        })}
      >
        {isLoggedIn && (
          <Fragment>
            <div>
              <Link className={classes.logo} to={ROUTE_LINKS.Home}>
                <ChainsafeFilesLogo />
                <Typography variant="h5">Files</Typography>
              </Link>
            </div>
            <div className={classes.linksArea}>
              <Typography>Folders</Typography>
              <nav className={classes.navMenu}>
                <Link className={classes.navItem} to="">
                  <DatabaseSvg />
                  <Typography variant="h5">All</Typography>
                </Link>
                <Link className={classes.navItem} to="">
                  <StarSvg />
                  <Typography variant="h5">Starred</Typography>
                </Link>
                <Link className={classes.navItem} to="">
                  <CloseCirceSvg />
                  <Typography variant="h5">Recents</Typography>
                </Link>
                <Link className={classes.navItem} to="">
                  <DeleteSvg />
                  <Typography variant="h5">Trash</Typography>
                </Link>
              </nav>
              <Typography>Resources</Typography>
              <nav className={classes.navMenu}>
                <Link className={classes.navItem} to="">
                  <InfoCircleSvg />
                  <Typography variant="h5">Support</Typography>
                </Link>
                <Link className={classes.navItem} to={ROUTE_LINKS.Settings}>
                  <SettingSvg />
                  <Typography variant="h5">Settings</Typography>
                </Link>
              </nav>
            </div>
            <section>TODO: GB USED SECTION</section>
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
          {isLoggedIn && (
            <Fragment>
              <SearchModule />
              <section className={classes.accountControls}>
                <Avatar size="medium" variant="circle">
                  {/* TODO: Wire up to User profile */}
                  <Blockies seed="A wombat enters combat with another wombat, are they both combat wombats by combatting a wombat or is the assailant a combat wombat for combatting a wombat?" />
                </Avatar>
                <MenuDropdown
                  title="Tanmoy B."
                  menuItems={[
                    {
                      onClick: () => console.log("Sign out please"),
                      contents: (
                        <div className={classes.menuItem}>
                          <PowerDownSvg />
                          <Typography>Sign Out</Typography>
                        </div>
                      ),
                    },
                  ]}
                />
              </section>
            </Fragment>
          )}
        </header>
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
