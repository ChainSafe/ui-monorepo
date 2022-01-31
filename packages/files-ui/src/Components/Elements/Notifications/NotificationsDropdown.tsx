import React from "react"
import { Button, BellIcon, MenuDropdown } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import NotificationList from "./NotificationList"
import { useNotifications } from "../../../Contexts/NotificationsContext"
import { CSFTheme } from "../../../Themes/types"

const useStyles = makeStyles(({ palette, constants, breakpoints }: CSFTheme) =>
  createStyles({
    notificationsButton: {
      position: "relative",
      transition: "none"
    },
    badge: {
      position: "absolute",
      background: palette.additional["volcano"][6],
      color: palette.additional["gray"][1],
      top: "-2px",
      left: "13px",
      borderRadius: constants.generalUnit,
      padding: `${constants.generalUnit * 0.25}px ${constants.generalUnit * 0.5}px`,
      fontSize: "10px",
      lineHeight: "11px",
      height: "0.92rem",
      minWidth: "1rem"
    },
    button: {
      height: constants.generalUnit * 4,
      padding: `0 ${constants.generalUnit}px !important`,
      [breakpoints.down("md")]: {
        backgroundColor: palette.additional["gray"][3]
      }
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

  return (
    <MenuDropdown
      menuItems={[]}
      dropdown={<NotificationList notifications={notifications} />}
      hideIndicator={true}
      anchor="bottom-right"
      autoclose
      classNames={{ options: classes.optionsOpen }}
    >
      <Button
        variant="tertiary"
        className={classes.button}
      >
        <div className={classes.notificationsButton}>
          <BellIcon />
          {!!notifications.length && <div className={classes.badge}>
            {notifications.length}
          </div>
          }
        </div>
      </Button>
    </MenuDropdown>
  )
}

export default NotificationsDropdown