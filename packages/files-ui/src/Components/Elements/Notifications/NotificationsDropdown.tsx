import React, { useState } from "react"
import { BellIcon, MenuDropdown } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import NotificationList from "./NotificationList"
import { useNotifications } from "../../../Contexts/NotificationsContext"
import { CSFTheme } from "../../../Themes/types"
import clsx from "clsx"

const useStyles = makeStyles(({ animation, palette, constants, breakpoints, overrides }: CSFTheme) =>
  createStyles({
    notificationsButton: {
      position: "relative",
      transition: "none",
      height: constants.generalUnit * 4,
      padding: `0 ${constants.generalUnit}px !important`,
      backgroundColor: palette.additional["gray"][3],
      color: palette.additional["gray"][10],
      borderRadius: `${constants.generalUnit / 4}px`,
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      textDecoration: "none",
      cursor: "pointer",
      transitionDuration: `${animation.transform}ms`,
      border: "none",
      outline: "none",
      ...overrides?.Button?.variants?.tertiary?.root,
      "& svg": {
        transitionDuration: `${animation.transform}ms`,
        margin: `${0}px ${constants.generalUnit / 2}px 0`,
        fill: palette.common.white.main
      },
      "&:hover": {
        backgroundColor: palette.primary.main,
        color: palette.common.white.main,
        ...overrides?.Button?.variants?.tertiary?.hover
      },
      "&:focus": {
        backgroundColor: palette.primary.main,
        color: palette.common.white.main,
        ...overrides?.Button?.variants?.tertiary?.focus
      },
      "&:active, &.active": {
        backgroundColor: palette.primary.main,
        color: palette.common.white.main,
        ...overrides?.Button?.variants?.tertiary?.active
      },
      [breakpoints.down("md")]: {
        backgroundColor: palette.additional["gray"][3]
      }
    },
    badge: {
      position: "absolute",
      background: palette.additional["volcano"][6],
      color: palette.additional["gray"][1],
      top: "0px",
      right: "5px",
      borderRadius: constants.generalUnit,
      padding: `${constants.generalUnit * 0.25}px ${constants.generalUnit * 0.5}px`,
      fontSize: "10px",
      lineHeight: "11px",
      height: "0.92rem",
      minWidth: "1rem"
    },
    optionsOpen: {
      [breakpoints.down("md")]: {
        minWidth: "100vw",
        backgroundColor: palette.additional["gray"][3]
      }
    }
  })
)

export interface Notification {
  id: string
  title: string
  createdAt: number
  onClick?: () => void
}

const NotificationsDropdown = () => {
  const classes = useStyles()
  const { notifications } = useNotifications()
  const [isActive, setIsActive] = useState(false)

  return (
    <MenuDropdown
      menuItems={[]}
      dropdown={<NotificationList notifications={notifications} />}
      hideIndicator={true}
      anchor="bottom-right"
      autoclose
      classNames={{ options: classes.optionsOpen }}
      onClose={() => setIsActive(false)}
      testId="notifications"
    >
      <div
        className={clsx(classes.notificationsButton, isActive && "active")}
        onClick={() => !isActive && setIsActive(true)}
      >
        <BellIcon />
        {!!notifications.length && <div className={classes.badge}>
          {notifications.length}
        </div>
        }
      </div>
    </MenuDropdown>
  )
}

export default NotificationsDropdown