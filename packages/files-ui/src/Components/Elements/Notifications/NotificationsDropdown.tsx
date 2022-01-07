import React from "react"
import { Button, BellIcon, MenuDropdown } from "@chainsafe/common-components"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import NotificationList from "./NotificationList"
import { useNotifications } from "../../../Contexts/NotificationsContext"

const useStyles = makeStyles(({ palette, constants }: ITheme) =>
  createStyles({
    notificationsButton: {
      position: "relative",
      "span": {
        transition: "none"
      }
    },
    badge: {
      position: "absolute",
      background: palette.additional["volcano"][6],
      color: palette.additional["gray"][1],
      top: "-2px",
      left: "13px",
      borderRadius: constants.generalUnit,
      padding: `${constants.generalUnit * 0.25}px ${constants.generalUnit * 0.5}px`,
      fontSize: "11px",
      lineHeight: "11px",
      height: "0.9rem",
      minWidth: "1rem"
    },
    icon: {
      transition: "none"
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
      dropdown={<NotificationList notifications={notifications}/>}
      hideIndicator={true}
      anchor="bottom-right"
      autoclose
    >
      <Button variant="tertiary">
        <div className={classes.notificationsButton}>
          <BellIcon className={classes.icon} />
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