import { Typography, Button, useHistory } from "@chainsafe/common-components"
import { createStyles, makeStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { Trans } from "@lingui/macro"
import React from "react"
import { CSSTheme } from "../../Themes/types"
import { ROUTE_LINKS } from "../StorageRoutes"

const useStyles = makeStyles(
  ({ breakpoints, constants, palette }: CSSTheme) => {
    return createStyles({
      accountRestrictedNotification: {
        position: "fixed",
        bottom: 0,
        backgroundColor: palette.additional["gray"][10],
        color: palette.additional["gray"][1],
        padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 3}px`,
        left: 0,
        width: "100vw",
        [breakpoints.up("md")]: {
          left: `${constants.navWidth}px`,
          width:`calc(100vw - ${constants.navWidth}px)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }
      }
    })
  }
)

const RestrictedModeBanner = () => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const { redirect } = useHistory()

  return (
    <div className={classes.accountRestrictedNotification}>
      <Typography variant={desktop ? "body1" : "body2"}>
        <Trans>You&apos;ve got a payment due. Until you&apos;ve settled up, we&apos;ve placed your account in restricted mode</Trans>
      </Typography>
      <Button
        onClick={() => redirect(ROUTE_LINKS.SettingsPath("plan"))}
        fullsize={!desktop}>
        <Trans>Go to Payments</Trans>
      </Button>
    </div>)
}

export default RestrictedModeBanner