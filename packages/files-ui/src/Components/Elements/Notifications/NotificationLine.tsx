import React from "react"
import { Typography } from "@chainsafe/common-components"
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
      "&:hover": {
        backgroundColor: palette.additional["gray"][4]
      }
    },
    notificationTitle: {
      color: palette.additional["gray"][9],
      paddingRight: constants.generalUnit * 1.5,
      width: 180
    },
    notificationTime: {
      color: palette.additional["blue"][6],
      width: "100%",
      textAlign: "right"
    }
  })
)

interface Props {
  notification: Notification
}
const NotificationLine = ({ notification }: Props) => {
  const classes = useStyles()

  return <div
    className={classes.notificationBody}
    onClick={notification.onClick}
    data-cy="container-notification"
  >
    <Typography
      variant="body2"
      className={classes.notificationTitle}
      component="p"
      data-cy="label-notification-title"
    >
      {notification.title}
    </Typography>
    <Typography
      variant="body2"
      className={classes.notificationTime}
      component="p"
      data-cy="label-notification-time"
    >
      {dayjs.unix(notification.createdAt).fromNow()}
    </Typography>
  </div>
}

export default NotificationLine
