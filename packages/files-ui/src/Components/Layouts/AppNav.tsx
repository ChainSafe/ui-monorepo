import { useImployApi, useUser } from "@imploy/common-contexts"
import { useDrive } from "../../Contexts/DriveContext"
import {
  createStyles,
  ITheme,
  makeStyles,
  useMediaQuery,
  useTheme,
} from "@imploy/common-themes"
import React, { Fragment, useCallback } from "react"
import clsx from "clsx"
import {
  Link,
  Typography,
  ChainsafeFilesLogo,
  DatabaseSvg,
  SettingSvg,
  PowerDownSvg,
  ProgressBar,
  Button,
  formatBytes,
} from "@imploy/common-components"
import { ROUTE_LINKS } from "../FilesRoutes"
import { FREE_PLAN_LIMIT } from "../../Utils/Constants"

const useStyles = makeStyles(
  ({ palette, animation, breakpoints, constants, zIndex }: ITheme) => {
    const modalWidth = constants.generalUnit * 27
    const svgWidth = constants.generalUnit * 2.5
    const topPadding = constants.generalUnit * 3

    const mobileHeaderHeight = constants.generalUnit * 6.3
    const mobileNavWidth = constants.generalUnit * 30

    return createStyles({
      root: {
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
          padding: `0 ${constants.generalUnit * 4}px`,
          maxWidth: "100vw",
          visibility: "hidden",
          // "&:before": {
          //   content: "''",
          //   display: "block",
          //   backgroundColor: palette.additional["gray"][9],
          //   opacity: 0.5,
          //   position: "fixed",
          //   top: mobileHeaderHeight,
          //   left: 0,
          //   height: `calc(100% - ${mobileHeaderHeight}px)`,
          //   width: "100%",
          //   transitionDuration: `${animation.translate}ms`,
          //   zIndex: zIndex?.background,
          // },
          "&.active": {
            visibility: "visible",
            width: mobileNavWidth,
          },
        },
      },
      blocker: {
        display: "block",
        backgroundColor: palette.additional["gray"][9],
        position: "fixed",
        top: mobileHeaderHeight,
        left: 0,
        height: `calc(100% - ${mobileHeaderHeight}px)`,
        width: "100%",
        transitionDuration: `${animation.translate}ms`,
        zIndex: zIndex?.background,
        opacity: 0,
        visibility: "hidden",
        "&.active": {
          visibility: "visible",
          opacity: 0.5,
        },
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
      navMenu: {
        display: "flex",
        flexDirection: "column",
        marginBottom: constants.generalUnit * 8.5,
        transitionDuration: `${animation.translate}ms`,
      },
      linksArea: {
        display: "flex",
        flexDirection: "column",
        flex: "1 1 0",
        justifyContent: "center",
        transitionDuration: `${animation.translate}ms`,
        "& > span": {
          marginBottom: constants.generalUnit * 2,
        },
        [breakpoints.up("sm")]: {
          height: 0,
        },
        [breakpoints.down("sm")]: {
          transitionDuration: `${animation.translate}ms`,
          color: palette.additional["gray"][3],
          "&.active": {},
        },
      },
      navItem: {
        textDecoration: "none",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        padding: `${constants.generalUnit * 1.5}px 0`,
        "& svg": {
          width: svgWidth,
          marginRight: constants.generalUnit * 2,
          [breakpoints.down("sm")]: {
            fill: palette.additional["gray"][3],
          },
        },
        [breakpoints.down("sm")]: {
          color: palette.additional["gray"][3],
          minWidth: mobileNavWidth,
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
      spaceUsedMargin: {
        marginBottom: constants.generalUnit,
      },
    })
  },
)

interface IAppNav {
  navOpen: boolean
  setNavOpen: (state: boolean) => void
}

const AppNav: React.FC<IAppNav> = ({ navOpen, setNavOpen }: IAppNav) => {
  const classes = useStyles()
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("sm"))
  const { spaceUsed } = useDrive()

  const { isLoggedIn, logout } = useImployApi()
  const { removeUser } = useUser()

  const signOut = useCallback(() => {
    logout()
    removeUser()
  }, [logout, removeUser])

  const handleOnClick = useCallback(() => {
    if (!desktop && navOpen) {
      setNavOpen(false)
    }
  }, [desktop, navOpen, setNavOpen])

  return (
    <section
      className={clsx(classes.root, {
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
              <Link onClick={handleOnClick} className={classes.navItem} to="">
                <DatabaseSvg />
                <Typography variant="h5">All</Typography>
              </Link>
            </nav>
            <Typography>{desktop ? "Resources" : "Account"}</Typography>
            <nav className={classes.navMenu}>
              <Link
                onClick={handleOnClick}
                className={classes.navItem}
                to={ROUTE_LINKS.Settings}
              >
                <SettingSvg />
                <Typography variant="h5">Settings</Typography>
              </Link>
            </nav>
          </div>
          <section>
            {desktop && (
              <div>
                <Typography
                  variant="body2"
                  className={classes.spaceUsedMargin}
                  component="p"
                >{`${formatBytes(spaceUsed)} of ${formatBytes(
                  FREE_PLAN_LIMIT,
                )} used`}</Typography>
                <ProgressBar
                  className={classes.spaceUsedMargin}
                  progress={(spaceUsed / FREE_PLAN_LIMIT) * 100}
                  size="small"
                />
                <Button disabled variant="outline" size="small">
                  UPGRADE
                </Button>
              </div>
            )}
            {!desktop && (
              <div
                className={classes.navItem}
                onClick={() => {
                  handleOnClick()
                  signOut()
                }}
              >
                <PowerDownSvg />
                <Typography>Sign Out</Typography>
              </div>
            )}
          </section>
          {!desktop && (
            <div
              onClick={() => setNavOpen(false)}
              className={clsx(classes.blocker, {
                active: navOpen,
              })}
            ></div>
          )}
        </Fragment>
      )}
    </section>
  )
}

export default AppNav
