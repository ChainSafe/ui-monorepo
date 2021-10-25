import React from "react"
import { Button, BellIcon, MenuDropdown, Typography } from "@chainsafe/common-components"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjs.extend(relativeTime)

const useStyles = makeStyles(({ palette, constants }: ITheme) =>
  createStyles({
    notificationsButton: {
      position: "relative"
    },
    badge: {
      position: "absolute",
      background: palette.additional["red"][6],
      color: palette.additional["gray"][1],
      top: "-2px",
      left: "13px",
      borderRadius: constants.generalUnit,
      padding: `${constants.generalUnit * 0.25}px ${constants.generalUnit * 0.5}px`,
      fontSize: "12px",
      lineHeight: "12px"
    },
    notificationBody: {
      margin: `0 ${constants.generalUnit * 1.5}px`,
      padding: constants.generalUnit,
      display: "flex",
      alignItems: "center"
    },
    notificationItem: {
      padding: 0,
      borderBottom: `1px solid ${palette.additional["gray"][5]}`,
      ":last-child": {
        border: "none"
      }
    },
    notificationTitle: {
      color: palette.additional["gray"][9],
      paddingRight: constants.generalUnit * 1.5,
      width: 180
    },
    notificationTime: {
      color: palette.primary.main
    }
  })
)

interface INotificationsDropdownProps {
  notifications: {
    title: string
    subtitle?: string
    createdAt: Date
    onClick?: () => void
  }[]
}

const NotificationsDropdown: React.FC<INotificationsDropdownProps> = ({ notifications }) => {
  const classes = useStyles()

  return (
    <MenuDropdown
      menuItems={notifications.map((n) => ({
        contents: <div className={classes.notificationBody}>
          <Typography variant="body2"
            className={classes.notificationTitle}
            component="p"
          >
            {n.title}
          </Typography>
          <Typography
            variant="body2"
            className={classes.notificationTime}
            component="p"
          >
            {dayjs(n.createdAt).fromNow()}
          </Typography>
        </div>,
        onClick: n.onClick
      }))}
      hideIndicator={true}
      anchor="bottom-right"
      classNames={{
        item: classes.notificationItem
      }}
    >
      <Button variant="outline">
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