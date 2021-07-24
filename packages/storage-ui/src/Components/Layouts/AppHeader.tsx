import React, { useCallback } from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import clsx from "clsx"
import {
  Link,
  Typography,
  ChainsafeLogo,
  HamburgerMenu,
  MenuDropdown,
  PowerDownSvg,
  useHistory
} from "@chainsafe/common-components"
import { ROUTE_LINKS } from "../StorageRoutes"
import { Trans } from "@lingui/macro"
import { CSSTheme } from "../../Themes/types"
import { useStorageApi } from "../../Contexts/StorageApiContext"
import { useUser } from "../../Contexts/UserContext"

const useStyles = makeStyles(
  ({ palette, animation, breakpoints, constants, zIndex }: CSSTheme) => {
    return createStyles({
      root: {
        position: "fixed",
        display: "flex",
        flexDirection: "row",
        top: 0,
        transitionDuration: `${animation.translate}ms`,
        visibility: "hidden",
        [breakpoints.up("md")]: {
          width: `calc(100% - ${constants.navWidth}px)`,
          padding: `${0}px ${constants.contentPadding}px ${0}px ${
            constants.contentPadding
          }px`,
          left: Number(constants.navWidth),
          opacity: 0,

          backgroundColor: constants.header.rootBackground,

          "& > *:first-child": {
            flex: "1 1 0"
          },
          "&.active": {
            opacity: 1,
            height: "auto",
            visibility: "visible",
            padding: `${constants.headerTopPadding}px ${
              constants.contentPadding
            }px ${0}px ${constants.contentPadding}px`,
            zIndex: zIndex?.layer1
          }
        },
        [breakpoints.down("md")]: {
          left: 0,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          backgroundColor: palette.additional["gray"][3],
          "&.active": {
            opacity: 1,
            visibility: "visible",
            height: Number(constants.mobileHeaderHeight),
            zIndex: Number(zIndex?.layer1)
          }
        }
      },
      hamburgerMenu: {
        position: "absolute",
        "& span": {
          backgroundColor: constants.header.hamburger
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
      accountControls: {
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
        [breakpoints.up("md")]: {
          marginLeft: constants.accountControlsPadding
        },
        "& > *:first-child": {
          marginRight: constants.generalUnit * 2
        }
      },
      searchModule: {
        [breakpoints.down("md")]: {
          height: constants.mobileHeaderHeight,
          position: "absolute",
          width: "100%",
          zIndex: zIndex?.background,
          "&.active": {}
        }
      },
      options: {
        backgroundColor: constants.header.optionsBackground,
        color: constants.header.optionsTextColor,
        border: `1px solid ${constants.header.optionsBorder}`,
        minWidth: 145
      },
      menuItem: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: constants.header.menuItemTextColor,
        "& svg": {
          width: constants.generalUnit * 2,
          height: constants.generalUnit * 2,
          marginRight: constants.generalUnit,
          fill: palette.additional["gray"][7],
          stroke: palette.additional["gray"][7]
        }
      },
      icon: {
        "& svg": {
          fill: constants.header.iconColor
        }
      },
      title : {
        marginLeft: constants.generalUnit
      }
    })
  }
)

interface IAppHeader {
  navOpen: boolean
  setNavOpen: (state: boolean) => void
}

const AppHeader = ({ navOpen, setNavOpen }: IAppHeader) => {
  const { desktop } = useThemeSwitcher()
  const classes = useStyles()
  const { isLoggedIn, logout } = useStorageApi()
  const { history } = useHistory()
  const { getProfileTitle } = useUser()

  const signOut = useCallback(async () => {
    logout()
    history.replace("/", {})
  }, [logout, history])

  return (
    <header
      className={clsx(classes.root, {
        active:
          isLoggedIn
      })}
    >
      {isLoggedIn && (
        <>
          {desktop ? (
            <>
              <section className={classes.accountControls}>
                <MenuDropdown
                  title={getProfileTitle()}
                  anchor="bottom-right"
                  classNames={{
                    icon: classes.icon,
                    options: classes.options
                  }}
                  testId="sign-out"
                  menuItems={[
                    {
                      onClick: () => signOut(),
                      contents: (
                        <div
                          data-cy="menu-sign-out"
                          className={classes.menuItem}
                        >
                          <PowerDownSvg />
                          <Typography>
                            <Trans>Sign Out</Trans>
                          </Typography>
                        </div>
                      )
                    }
                  ]}
                />
              </section>
            </>
          ) : (
            <>
              <HamburgerMenu
                onClick={() => setNavOpen(!navOpen)}
                variant={navOpen ? "active" : "default"}
                className={clsx(classes.hamburgerMenu, "hamburger-menu")}
                testId="hamburger-menu"
              />
              <Link
                className={classes.logo}
                to={ROUTE_LINKS.Cids}
              >
                <ChainsafeLogo />
                <Typography
                  variant="h5"
                  className={classes.title}
                >
                  Storage
                </Typography>
              </Link>
            </>
          )}
        </>
      )}
    </header>
  )
}

export default AppHeader
