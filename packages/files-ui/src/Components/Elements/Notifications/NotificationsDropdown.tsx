import React from "react"
import { Button, BellIcon, MenuDropdown } from "@chainsafe/common-components"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import NotificationList from "./NotificationList"
import { useNotifications } from "../../../Contexts/NotificationsContext"

const useStyles = makeStyles(({ palette, constants }: ITheme) =>
  createStyles({
    notificationsButton: {
      position: "relative"
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
    icon: {
      transition: "none"
    },
    button: {
      height: constants.generalUnit * 4
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
      <Button
        variant="tertiary"
        className={classes.button}
      >
        <div className={classes.notificationsButton}>
          <BellIcon className={classes.icon} />
          {!!notifications.length && <div className={classes.badge}>
            {notifications.length}
          </div>
          }
          <div className={classes.badge}>
            {10}
          </div>

        </div>
      </Button>
    </MenuDropdown>
  )
}

export default NotificationsDropdown