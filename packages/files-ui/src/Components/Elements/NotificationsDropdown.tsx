import React from "react"
import { Button, BellIcon, MenuDropdown, Typography, Paper } from "@chainsafe/common-components"
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
    notificationBody: {
      margin: `0 ${constants.generalUnit * 1.5}px`,
      padding: constants.generalUnit,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: "initial",
      "&:hover": {
        backgroundColor: palette.additional["gray"][3]
      },
      "svg": {
        fill: palette.additional["gray"][9]
      }
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
      color: palette.additional["blue"][6]
    }
  })
)

interface INotificationsDropdownProps {
  notifications: {
    title: string
    createdAt: Date
    onClick?: () => void
  }[]
}

const NotificationsDropdown: React.FC<INotificationsDropdownProps> = ({ notifications }) => {
  const classes = useStyles()

  return (
    <MenuDropdown
      dropdown={
        <div>
          {notifications.map((n, i) => (
            <div key={i}
              className={classes.notificationBody}
              onClick={n.onClick}>
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
            </div>
          ))}
        </div>
      }
      hideIndicator={true}
      anchor="bottom-right"
      classNames={{
        item: classes.notificationItem
      }}
    >
      <Button variant="tertiary">
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