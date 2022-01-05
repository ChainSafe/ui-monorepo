import React from "react"
import { Typography, ScrollbarWrapper } from "@chainsafe/common-components"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Notification } from "./NotificationsDropdown"
import { Trans } from "@lingui/macro"
import { MoonStarIcon } from "@chainsafe/common-components"
import clsx from "clsx"
dayjs.extend(relativeTime)

const useStyles = makeStyles(({ palette, constants }: ITheme) =>
  createStyles({
    notificationBody: {
      padding: `${constants.generalUnit}px ${constants.generalUnit * 1.5}px`,
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
      backgroundColor: palette.additional["gray"][2],
      "&.empty": {
        display: "flex",
        flexDirection: "column",
        padding: `${constants.generalUnit * 3 }px ${constants.generalUnit * 1.5}px`,
        color: palette.additional["gray"][7]
      },
      "&:hover": {
        backgroundColor: palette.additional["gray"][3]
      },
      "& svg>path": {
        stroke: palette.additional["gray"][7]
      },
      borderBottom: `1px solid ${palette.additional["gray"][5]}`,
      "&:last-child": {
        border: "none"
      }
    },
    icon: {
      transition: "none",
      marginBottom: 2 * constants.generalUnit
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
        {notifications.length === 0 && (
          <div className={clsx(classes.notificationBody, "empty")}>
            <MoonStarIcon className={classes.icon} />
            <Typography variant="h4" >
              <Trans>There are no notifications!</Trans>
            </Typography>
          </div>
        )}
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