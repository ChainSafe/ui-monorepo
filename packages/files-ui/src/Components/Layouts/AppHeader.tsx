import React, { useCallback, useState } from "react"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import clsx from "clsx"
import { Link, Typography, ChainsafeFilesLogo, HamburgerMenu, Button, SearchIcon, useHistory } from "@chainsafe/common-components"
import { ROUTE_LINKS } from "../FilesRoutes"
import SearchModule from "../Modules/SearchModule"
import { Trans } from "@lingui/macro"
import { useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import { CSFTheme } from "../../Themes/types"
import { useFilesApi } from "../../Contexts/FilesApiContext"
import BetaModal from "../Elements/BetaModal"
import NotificationsDropdown from "../Elements/Notifications/NotificationsDropdown"
import { useBilling } from "../../Contexts/BillingContext"

const useStyles = makeStyles(
  ({ palette, animation, breakpoints, constants, zIndex }: CSFTheme) => {
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
            padding: `${constants.headerTopPadding}px ${constants.contentPadding}px ${0}px ${constants.contentPadding}px`,
            zIndex: zIndex?.layer1
          }
        },
        [breakpoints.down("md")]: {
          left: 0,
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          backgroundColor: palette.additional["gray"][1],
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
      searchIcon: {
        marginRight: "10px",
        cursor: "pointer",
        "& > svg": {
          fill: constants.header.hamburger
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
      searchModule: {
        [breakpoints.down("md")]: {
          height: constants.mobileHeaderHeight,
          position: "absolute",
          width: "100%",
          zIndex: zIndex?.background
        }
      },
      title : {
        marginLeft: constants.generalUnit
      },
      buttonsSection: {
        display: "flex",
        alignItems: "center",
        margin: `0 ${constants.generalUnit * 2}px`,

        "& button" : {
          height: constants.generalUnit * 4,

          "&:not(:first-child)": {
            marginLeft: constants.generalUnit * 2
          }
        }
      },
      headerSection: {
        display: "flex",
        alignItems: "center"
      },
      searchBox: {
        flex: 1
      },
      rightSection: {
        display: "flex",
        alignItems: "center",
        position: "absolute",
        right: 0
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
  const { isBillingEnabled } = useBilling()
  const classes = useStyles()
  const { isLoggedIn, secured } = useFilesApi()
  const { publicKey, isNewDevice, shouldInitializeAccount } = useThresholdKey()
  const [searchActive, setSearchActive] = useState(false)
  const [isBetaModalOpen, setIsBetaModalOpen] = useState(false)
  const { redirect } = useHistory()

  const onReportBugClick = useCallback(() => {
    window.open(ROUTE_LINKS.DiscordInvite, "_blank")
  }, [])

  // const onJoinBetaClick = useCallback(() => {
  //   setIsBetaModalOpen(true)
  // }, [])

  const onUpgradeClick = useCallback(() => {
    redirect(ROUTE_LINKS.SettingsPath("plan"))
  }, [redirect])

  return (
    <header
      className={clsx(classes.root, {
        active:
          isLoggedIn &&
          secured &&
          !!publicKey &&
          !isNewDevice &&
          !shouldInitializeAccount
      })}
    >
      {isLoggedIn &&
        secured &&
        !!publicKey &&
        !isNewDevice &&
        !shouldInitializeAccount && (
        <>
          {desktop
            ? <section className={classes.headerSection}>
              <section className={classes.searchBox}>
                <SearchModule
                  className={classes.searchModule}
                  searchActive={searchActive}
                  setSearchActive={setSearchActive}
                />
              </section>
              <section className={classes.buttonsSection}>
                <Button
                  data-posthog="Report-a-bug"
                  data-cy="button-report-bug"
                  variant="tertiary"
                  size="small"
                  onClick={onReportBugClick}
                >
                  <Trans>Report a bug</Trans>
                </Button>
                {/* {!isBillingEnabled && <Button
                  data-posthog="Join-beta"
                  variant="tertiary"
                  size="small"
                  onClick={onJoinBetaClick}
                >
                  <Trans>Need more storage?</Trans>
                </Button>} */}
                {isBillingEnabled && <Button
                  data-posthog="Upgrade"
                  variant="tertiary"
                  size="small"
                  onClick={onUpgradeClick}
                >
                  <Trans>Upgrade</Trans>
                </Button>}
              </section>
              <section>
                <NotificationsDropdown />
              </section>
            </section>
            : <>
              <>
                <HamburgerMenu
                  onClick={() => setNavOpen(!navOpen)}
                  variant={navOpen ? "active" : "default"}
                  className={classes.hamburgerMenu}
                  testId="icon-hamburger-menu"
                />
                {!searchActive && (
                  <>
                    <Link
                      className={classes.logo}
                      to={ROUTE_LINKS.Drive("/")}
                    >
                      <ChainsafeFilesLogo />
                      <Typography
                        variant="h5"
                        className={classes.title}
                      >
                        Files
                      </Typography>
                      &nbsp;
                      <Typography variant="caption">beta</Typography>
                    </Link>
                    <section className={classes.rightSection}>
                      <SearchIcon
                        className={classes.searchIcon}
                        onClick={() => setSearchActive(true)}
                      />
                      <NotificationsDropdown />
                    </section>
                  </>
                )}
              </>
              {searchActive && (
                <SearchModule
                  className={clsx(classes.searchModule)}
                  searchActive={searchActive}
                  setSearchActive={setSearchActive}
                />
              )}
            </>
          }
        </>
      )}
      {isBetaModalOpen && <BetaModal onHide={() => setIsBetaModalOpen(false)}/>}
    </header>
  )
}

export default AppHeader
