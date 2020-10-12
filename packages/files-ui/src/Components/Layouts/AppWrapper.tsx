import { useImployApi, useUser } from "@imploy/common-contexts"
import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@imploy/common-themes"
import React, { Fragment, useCallback, useState } from "react"
import { ReactNode } from "react"
import clsx from "clsx"
import {
  Link,
  Typography,
  ChainsafeFilesLogo,
  DatabaseSvg,
  HamburgerMenu,
  SettingSvg,
  MenuDropdown,
  PowerDownSvg,
  CssBaseline,
} from "@imploy/common-components"
import { ROUTE_LINKS } from "../FilesRoutes"
import SearchModule from "../Modules/SearchModule"

interface IAppWrapper {
  children: ReactNode | ReactNode[]
}

const useStyles = makeStyles(
  ({ palette, animation, breakpoints, constants, zIndex }: ITheme) => {
    const modalWidth = constants.generalUnit * 27
    const contentPadding = constants.generalUnit * 15
    const contentTopPadding = constants.generalUnit * 15
    const svgWidth = constants.generalUnit * 2.5
    const topPadding = constants.generalUnit * 3
    const accountControlsPadding = constants.generalUnit * 7

    const mobileHeaderHeight = constants.generalUnit * 6.3
    const mobileNavWidth = constants.generalUnit * 30

    return createStyles({
      root: {
        minHeight: "100vh",
      },
      logo: {
        textDecoration: "none",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        [breakpoints.up("sm")]: {
          "& img": {
            height: constants.generalUnit * 5,
            width: "auto",
          },
          "& > *:first-child": {
            marginRight: constants.generalUnit,
          },
        },
        [breakpoints.down("sm")]: {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          "& img": {
            height: constants.generalUnit * 3.25,
            width: "auto",
          },
        },
      },
      nav: {
        width: 0,
        overflow: "hidden",
        transitionDuration: `${animation.translate}ms`,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        opacity: 0,
        "&.active": {
          opacity: 1,
        },
        [breakpoints.up("sm")]: {
          padding: `${topPadding}px ${constants.generalUnit * 4.5}px`,
          backgroundColor: palette.additional["gray"][3],
          top: 0,
          height: "100%",
          "&.active": {
            width: modalWidth,
          },
        },
        [breakpoints.down("sm")]: {
          height: `calc(100% - ${mobileHeaderHeight}px)`,
          top: mobileHeaderHeight,
          backgroundColor: palette.additional["gray"][9],
          zIndex: zIndex?.layer1,
          "&:before": {
            content: "''",
            display: "block",
            backgroundColor: palette.additional["gray"][9],
            opacity: 0.5,
            position: "fixed",
            top: mobileHeaderHeight,
            left: 0,
            height: `calc(100% - ${mobileHeaderHeight}px)`,
            width: "100%",
            zIndex: zIndex?.layer0,
          },
          "&.active": {
            width: modalWidth,
          },
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
        flex: "1 1 0",
        justifyContent: "center",
        "& > span": {
          marginBottom: constants.generalUnit * 2,
        },
        [breakpoints.up("sm")]: {
          height: 0,
        },
        [breakpoints.down("sm")]: {
          transitionDuration: `${animation.translate}ms`,
          position: "fixed",
          top: 0,
          left: 0,
          overflow: "hidden",
          height: "100%",
          width: 0,

          "&.active": {},
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
      header: {
        position: "fixed",
        display: "flex",
        flexDirection: "row",
        top: 0,
        transitionDuration: `${animation.translate}ms`,
        visibility: "hidden",
        [breakpoints.up("sm")]: {
          width: `calc(100% - ${modalWidth}px)`,
          padding: `${0}px ${contentPadding}px ${0}px ${contentPadding}px`,
          left: modalWidth,
          backgroundColor: palette.common.white.main,
          opacity: 0,
          "& > *:first-child": {
            flex: "1 1 0",
          },
          "&.active": {
            opacity: 1,
            height: "auto",
            visibility: "visible",
            padding: `${topPadding}px ${contentPadding}px ${0}px ${contentPadding}px`,
          },
        },
        [breakpoints.down("sm")]: {
          left: 0,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          backgroundColor: palette.additional["gray"][3],
          "&.active": {
            opacity: 1,
            visibility: "visible",
            height: mobileHeaderHeight,
          },
        },
      },
      accountControls: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
        [breakpoints.up("sm")]: {
          marginLeft: accountControlsPadding,
        },
        "& > *:first-child": {
          marginRight: constants.generalUnit * 2,
        },
      },
      menuItem: {
        width: 100,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        "& svg": {
          width: constants.generalUnit * 2,
          height: constants.generalUnit * 2,
          marginRight: constants.generalUnit,
        },
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
      searchModule: {
        [breakpoints.down("sm")]: {
          position: "fixed",
          top: 0,
          right: 0,
          height: mobileHeaderHeight,
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

  const { isLoggedIn, logout } = useImployApi()
  const { getProfileTitle, removeUser } = useUser()

  const signOut = useCallback(() => {
    logout()
    removeUser()
  }, [logout, removeUser])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <section
        className={clsx(classes.nav, {
          active: desktop ? isLoggedIn : navOpen,
        })}
      >
        {isLoggedIn && (
          <Fragment>
            {desktop && (
              <div>
                <Link className={classes.logo} to={ROUTE_LINKS.Home}>
                  <ChainsafeFilesLogo />
                  <Typography variant="h5">Files</Typography>
                </Link>
              </div>
            )}
            <div className={classes.linksArea}>
              <Typography>Folders</Typography>
              <nav className={classes.navMenu}>
                <Link className={classes.navItem} to="">
                  <DatabaseSvg />
                  <Typography variant="h5">All</Typography>
                </Link>
                {/* <Link className={classes.navItem} to="">
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
                </Link> */}
              </nav>
              <Typography>{desktop ? "Resources" : "Account"}</Typography>
              <nav className={classes.navMenu}>
                {/* {
                  desktop && (
                    <Link className={classes.navItem} to="">
                      <InfoCircleSvg />
                      <Typography variant="h5">Support</Typography>
                    </Link>
                  )
                } */}
                <Link className={classes.navItem} to={ROUTE_LINKS.Settings}>
                  <SettingSvg />
                  <Typography variant="h5">Settings</Typography>
                </Link>
              </nav>
            </div>
            <section>
              {/* TODO: GB USED SECTION */}
              {!desktop && (
                <div className={classes.navItem} onClick={() => signOut()}>
                  <PowerDownSvg />
                  <Typography>Sign Out</Typography>
                </div>
              )}
            </section>
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
              {desktop ? (
                <Fragment>
                  <section className={classes.accountControls}>
                    <MenuDropdown
                      title={getProfileTitle()}
                      anchor="bottom-right"
                      menuItems={[
                        {
                          onClick: () => signOut(),
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
              ) : (
                <Fragment>
                  <HamburgerMenu
                    onClick={() => setNavOpen(!navOpen)}
                    variant={navOpen ? "active" : "default"}
                  />
                  <Link className={classes.logo} to={ROUTE_LINKS.Home}>
                    <ChainsafeFilesLogo />
                  </Link>
                  <SearchModule className={classes.searchModule} />
                </Fragment>
              )}
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
