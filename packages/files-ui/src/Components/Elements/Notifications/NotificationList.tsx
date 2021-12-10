import React from "react"
import { Typography, ScrollbarWrapper } from "@chainsafe/common-components"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Notification } from "./NotificationsDropdown"
dayjs.extend(relativeTime)

const useStyles = makeStyles(({ palette, constants }: ITheme) =>
  createStyles({
    notificationBody: {
      padding: `${constants.generalUnit}px ${constants.generalUnit * 1.5}px`,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: "initial",
      "&:hover": {
        backgroundColor: palette.additional["gray"][3]
      },
      "svg": {
        fill: palette.additional["gray"][9]
      },
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
    scrollContent: {
      minWidth: 300
    },
    notificationTime: {
      color: palette.additional["blue"][6]
    }
  })
)

interface INotificationListProps {
  notifications: Notification[]
}

const NotificationList = ({ notifications }: INotificationListProps) => {
  const classes = useStyles()

  return (
    <ScrollbarWrapper
      autoHide={true}
      maxHeight={300}
      className={classes.scrollContent}
    >
      <div>
        {notifications.map((n, i) => (
          <div
            key={i}
            className={classes.notificationBody}
            onClick={n.onClick}
          >
            <Typography
              variant="body2"
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
    </ScrollbarWrapper>
  )}

export default NotificationList