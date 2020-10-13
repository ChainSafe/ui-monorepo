import { useImployApi, useUser } from "@imploy/common-contexts"
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
  HamburgerMenu,
  MenuDropdown,
  PowerDownSvg,
} from "@imploy/common-components"
import { ROUTE_LINKS } from "../FilesRoutes"
import SearchModule from "../Modules/SearchModule"

const useStyles = makeStyles(
  ({ palette, animation, breakpoints, constants, zIndex }: ITheme) => {
    const modalWidth = constants.generalUnit * 27
    const contentPadding = constants.generalUnit * 15
    const topPadding = constants.generalUnit * 3
    const accountControlsPadding = constants.generalUnit * 7

    const mobileHeaderHeight = constants.generalUnit * 6.3

    return createStyles({
      root: {
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

interface IAppHeader {
  navOpen: boolean
  setNavOpen: (state: boolean) => void
}

const AppHeader: React.FC<IAppHeader> = ({
  navOpen,
  setNavOpen,
}: IAppHeader) => {
  const classes = useStyles()
  const { breakpoints }: ITheme = useTheme()
  const desktop = useMediaQuery(breakpoints.up("sm"))

  const { isLoggedIn, logout } = useImployApi()
  const { getProfileTitle, removeUser } = useUser()

  const signOut = useCallback(() => {
    logout()
    removeUser()
  }, [logout, removeUser])

  return (
    <header
      className={clsx(classes.root, {
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
  )
}

export default AppHeader
