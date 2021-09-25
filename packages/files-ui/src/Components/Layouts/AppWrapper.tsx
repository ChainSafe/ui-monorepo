import { useFilesApi } from "../../Contexts/FilesApiContext"
import { createStyles, ITheme, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import React, { useState } from "react"
import { ReactNode } from "react"
import clsx from "clsx"
import { Button, CssBaseline, Typography, useHistory } from "@chainsafe/common-components"
import AppHeader from "./AppHeader"
import AppNav from "./AppNav"
import { useThresholdKey } from "../../Contexts/ThresholdKeyContext"
import {Trans} from "@lingui/macro"
import {ROUTE_LINKS} from "../FilesRoutes"

interface IAppWrapper {
  children: ReactNode | ReactNode[]
}

const useStyles = makeStyles(
  ({ animation, breakpoints, constants, palette }: ITheme) => {
    return createStyles({
      root: {
        minHeight: "100vh"
      },
      bodyWrapper: {
        transitionDuration: `${animation.translate}ms`,
        [breakpoints.up("md")]: {
          padding: "0",
          "&.active": {
            // This moves the content areas based on the size of the nav bar
            padding: `${0}px ${constants.contentPadding}px ${0}px ${
              Number(constants.navWidth) +
              Number(constants.contentPadding)
            }px`
          }
        },
        [breakpoints.down("md")]: {}
      },
      content: {
        height: "initial",
        [breakpoints.up("md")]: {
          height: "100%",
          minHeight: "100vh",
          transitionDuration: `${animation.translate}ms`,
          "&.active": {
            padding: `${constants.contentTopPadding}px 0 0`
          },
          "&.bottomBanner": {
            paddingBottom: 80,
          },
        },
        [breakpoints.down("md")]: {
          minHeight: "100vh",
          "&.active": {
            padding: `${constants.mobileHeaderHeight}px 0 0`
          },
          "&.bottomBanner": {
            paddingBottom: 110,
          },
        }
      },
      accountInArrearsNotification: {
        position: 'fixed',
        bottom: 0,
        backgroundColor: palette.additional["gray"][10],
        color: palette.additional['gray'][1],
        padding: '16px 24px',
        marginLeft: 0,
        width: '100vw',
        [breakpoints.up("md")]: {
          marginLeft: `${constants.navWidth}px`,
          width:`calc(100vw - ${constants.navWidth}px)`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      },
    })
  }
)

const AppWrapper: React.FC<IAppWrapper> = ({ children }: IAppWrapper) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const [navOpen, setNavOpen] = useState<boolean>(false)
  const { isLoggedIn, secured, accountInArrears } = useFilesApi()
  const { publicKey, isNewDevice, shouldInitializeAccount } = useThresholdKey()
  const { redirect } = useHistory()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppNav
        setNavOpen={setNavOpen}
        navOpen={navOpen}
      />
      <article
        className={clsx(classes.bodyWrapper, {
          active:
            isLoggedIn &&
            secured &&
            !!publicKey &&
            !isNewDevice &&
            !shouldInitializeAccount
        })}
      >
        <AppHeader
          navOpen={navOpen}
          setNavOpen={setNavOpen}
        />
        <section
          className={clsx(
            classes.content, {
            active:
              isLoggedIn &&
              secured &&
              !!publicKey &&
              !isNewDevice &&
              !shouldInitializeAccount
            }, {
              bottomBanner: accountInArrears
            }
          )}
        >
          {children}
        </section>
      </article>
      {accountInArrears && 
        <div className={classes.accountInArrearsNotification}>
          <Typography variant='body2'>
            <Trans>You've got a payment due. Until you've settled up, we've placed your account in restricted mode</Trans>
          </Typography>
          <Button 
            onClick={() => redirect(ROUTE_LINKS.Settings)}
            fullsize={!desktop}>
              <Trans>Go to Payments</Trans>
          </Button>
        </div>}
    </div>
  )
}

export default AppWrapper
