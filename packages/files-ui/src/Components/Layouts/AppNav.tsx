import { useFiles } from "../../Contexts/FilesContext"
import {
  createStyles,
  makeStyles,
  useThemeSwitcher
} from "@chainsafe/common-theme"
import React, { useCallback } from "react"
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
  DeleteSvg } from "@chainsafe/common-components"
import { ROUTE_LINKS } from "../FilesRoutes"
import { FREE_PLAN_LIMIT } from "../../Utils/Constants"
import { Trans } from "@lingui/macro"
import { useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import { CSFTheme } from "../../Themes/types"
import { useUser } from "../../Contexts/UserContext"
import { useFilesApi } from "../../Contexts/FilesApiContext"
const useStyles = makeStyles(
  ({ palette, animation, breakpoints, constants, zIndex }: CSFTheme) => {
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
          opacity: 1
        },
        [breakpoints.up("md")]: {
          padding: `${constants.topPadding}px ${
            constants.generalUnit * 4.5
          }px`,
          top: 0,
          height: "100%",
          backgroundColor: constants.nav.backgroundColor,
          "&.active": {
            width: `${constants.navWidth}px`
          }
        },
        [breakpoints.down("md")]: {
          height: `calc(100% - ${constants.mobileHeaderHeight}px)`,
          top: `${constants.mobileHeaderHeight}px`,
          backgroundColor: constants.nav.mobileBackgroundColor,
          zIndex: zIndex?.layer1,
          padding: `0 ${constants.generalUnit * 4}px`,
          maxWidth: "100vw",
          visibility: "hidden",
          "&.active": {
            visibility: "visible",
            width: `${constants.mobileNavWidth}px`
          }
        }
      },
      blocker: {
        display: "block",
        backgroundColor: constants.nav.blocker,
        position: "fixed",
        top: Number(constants.mobileHeaderHeight),
        left: 0,
        height: `calc(100% - ${constants.mobileHeaderHeight}px)`,
        width: "100%",
        transitionDuration: `${animation.translate}ms`,
        zIndex: zIndex?.background,
        opacity: 0,
        visibility: "hidden",
        "&.active": {
          visibility: "visible",
          [breakpoints.down("md")]: {
            opacity: 0.5
          }
        }
      },
      logo: {
        textDecoration: "none",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        [breakpoints.up("md")]: {
          "& img": {
            height: constants.generalUnit * 5,
            width: "auto"
          },
          "& > *:first-child": {
            marginRight: constants.generalUnit
          }
        },
        [breakpoints.down("md")]: {
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          "& img": {
            height: constants.generalUnit * 3.25,
            width: "auto"
          }
        }
      },
      navMenu: {
        display: "flex",
        flexDirection: "column",
        marginBottom: constants.generalUnit * 8.5,
        transitionDuration: `${animation.translate}ms`
      },
      linksArea: {
        display: "flex",
        flexDirection: "column",
        flex: "1 1 0",
        justifyContent: "center",
        transitionDuration: `${animation.translate}ms`,
        "& > span": {
          marginBottom: constants.generalUnit * 2
        },
        [breakpoints.up("md")]: {
          height: 0
        },
        [breakpoints.down("md")]: {
          transitionDuration: `${animation.translate}ms`,
          color: palette.additional["gray"][3],
          "&.active": {}
        }
      },
      navHead: {
        fontWeight: 600,
        color: constants.nav.headingColor
      },
      navItem: {
        textDecoration: "none",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        padding: `${constants.generalUnit * 1.5}px 0`,
        transitionDuration: `${animation.transform}ms`,
        "& span": {
          transitionDuration: `${animation.transform}ms`,
          [breakpoints.up("md")]: {
            color: constants.nav.itemColor
          },
          [breakpoints.down("md")]: {
            color: constants.nav.itemColorHover
          }
        },
        "& svg": {
          transitionDuration: `${animation.transform}ms`,
          width: Number(constants.svgWidth),
          marginRight: constants.generalUnit * 2,
          [breakpoints.up("md")]: {
            fill: constants.nav.itemIconColor
          },
          [breakpoints.down("md")]: {
            fill: constants.nav.itemIconColorHover
          }
        },
        "&:hover": {
          "& span": {
            color: constants.nav.itemColorHover
          },
          "& svg": {
            fill: constants.nav.itemIconColorHover
          }
        },
        [breakpoints.down("md")]: {
          minWidth: Number(constants.mobileNavWidth)
        }
      },
      navItemText: {
        [breakpoints.down("md")]: {
          color: palette.additional["gray"][3]
        }
      },
      menuItem: {
        width: 100,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        "& svg": {
          width: constants.generalUnit * 2,
          height: constants.generalUnit * 2,
          marginRight: constants.generalUnit
        }
      },
      spaceUsedMargin: {
        marginBottom: constants.generalUnit
      },
      betaCaption: {
        marginBottom: constants.generalUnit * 0.5
      }
    })
  }
)

interface IAppNav {
  navOpen: boolean
  setNavOpen: (state: boolean) => void
}

const AppNav: React.FC<IAppNav> = ({ navOpen, setNavOpen }: IAppNav) => {
  const { desktop } = useThemeSwitcher()
  const classes = useStyles()

  const { spaceUsed } = useFiles()

  const { isLoggedIn, secured } = useFilesApi()
  const { publicKey, isNewDevice, shouldInitializeAccount, logout } = useThresholdKey()

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

  const collectFeedback = () => {
    window.open(ROUTE_LINKS.UserSurvey, "_blank")
  }

  return (
    <section
      className={clsx(classes.root, {
        active: desktop
          ? isLoggedIn &&
          secured &&
          !!publicKey &&
          !isNewDevice &&
          !shouldInitializeAccount
          : navOpen
      })}
    >
      {isLoggedIn &&
        secured &&
        !!publicKey &&
        !isNewDevice &&
        !shouldInitializeAccount && (
        <>
          {desktop && (
            <div>
              <Link
                className={classes.logo}
                to={ROUTE_LINKS.Drive("/")}
              >
                <ChainsafeFilesLogo />
                <Typography variant="h5">
                  Files
                </Typography>
                &nbsp;
                <Typography
                  variant="caption"
                  className={classes.betaCaption}
                >
                  beta
                </Typography>
              </Link>
            </div>
          )}
          <div className={classes.linksArea}>
            <Typography className={classes.navHead}>
              <Trans>Folders</Trans>
            </Typography>
            <nav className={classes.navMenu}>
              <Link
                onClick={() => {
                  handleOnClick()
                }}
                className={classes.navItem}
                to={ROUTE_LINKS.Drive("/")}
              >
                <DatabaseSvg />
                <Typography
                  data-cy="home-nav"
                  variant="h5"
                  className={classes.navItemText}
                >
                  <Trans>Home</Trans>
                </Typography>
              </Link>
              <Link
                onClick={handleOnClick}
                className={classes.navItem}
                to={ROUTE_LINKS.Bin("/")}
              >
                <DeleteSvg />
                <Typography
                  data-cy="bin-nav"
                  variant="h5"
                  className={classes.navItemText}
                >
                  <Trans>Bin</Trans>
                </Typography>
              </Link>
            </nav>
            <Typography className={classes.navHead}>
              {desktop ? <Trans>Resources</Trans> : <Trans>Account</Trans>}
            </Typography>
            <nav className={classes.navMenu}>
              <Link
                onClick={handleOnClick}
                className={classes.navItem}
                to={ROUTE_LINKS.SettingsDefault}
              >
                <SettingSvg />
                <Typography
                  data-cy="settings-nav"
                  variant="h5"
                  className={classes.navItemText}
                >
                  <Trans>Settings</Trans>
                </Typography>
              </Link>
            </nav>
          </div>
          <section>
            {desktop && (
              <div>
                <Typography
                  data-cy="space-used-label"
                  variant="body2"
                  className={classes.spaceUsedMargin}
                  component="p"
                >{`${formatBytes(spaceUsed)} of ${formatBytes(
                    FREE_PLAN_LIMIT
                  )} used`}</Typography>
                <ProgressBar
                  data-cy="space-used-progress-bar"
                  className={classes.spaceUsedMargin}
                  progress={(spaceUsed / FREE_PLAN_LIMIT) * 100}
                  size="small"
                />
                {/* <Button disabled variant="outline" size="small">
                  <Trans>UPGRADE</Trans>
                </Button> */}
                <Button
                  data-cy="send-feedback-nav"
                  variant="outline"
                  size="small"
                  onClick={() => collectFeedback()}
                >
                  <Trans>Send Feedback</Trans>
                </Button>
              </div>
            )}
            {!desktop && (
              <div
                data-cy="signout-nav"
                className={classes.navItem}
                onClick={() => {
                  handleOnClick()
                  signOut()
                }}
              >
                <PowerDownSvg />
                <Typography>
                  <Trans>Sign Out</Trans>
                </Typography>
              </div>
            )}
          </section>
          {!desktop && (
            <div
              onClick={() => setNavOpen(false)}
              className={clsx(classes.blocker, {
                active: navOpen
              })}
            ></div>
          )}
        </>
      )}
    </section>
  )
}

export default AppNav