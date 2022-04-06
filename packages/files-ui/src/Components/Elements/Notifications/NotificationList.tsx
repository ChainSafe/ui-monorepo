import React, { useEffect } from "react"
import { Typography, ScrollbarWrapper, Divider } from "@chainsafe/common-components"
import { createStyles, ITheme, makeStyles } from "@chainsafe/common-theme"
import dayjs from "dayjs"
import { Notification } from "./NotificationsDropdown"
import { Trans } from "@lingui/macro"
import { MoonStarIcon } from "@chainsafe/common-components"
import NotificationLine from "./NotificationLine"

const useStyles = makeStyles(({ palette, constants }: ITheme) =>
  createStyles({
    notificationsBody: {
      backgroundColor: palette.additional["gray"][2]
    },
    emptyBody: {
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
      padding: `${constants.generalUnit * 3}px ${constants.generalUnit * 1.5}px`,
      color: palette.additional["gray"][7],
      "& svg>path": {
        stroke: palette.additional["gray"][7]
      }
    },
    icon: {
      transition: "none",
      marginBottom: 2 * constants.generalUnit
    },
    scrollContent: {
      minWidth: 350
    },
    header: {
      padding: `${constants.generalUnit * 3}px ${constants.generalUnit * 3}px`,
      paddingBottom: 0
    },
    notificationTitle: {
      color: palette.additional["gray"][9],
      paddingRight: constants.generalUnit * 1.5,
      width: 180
    },
    notifs: {
      padding: `${constants.generalUnit * 3}px ${constants.generalUnit * 3}px`,
      paddingTop: 0
    },
    timeHeader: {
      paddingLeft: constants.generalUnit * 1.5
    }
  })
)

interface INotificationListProps {
  notifications: Notification[]
}

const NotificationList = ({ notifications }: INotificationListProps) => {
  const classes = useStyles()
  const thisWeeksNotifications = notifications.filter(n => dayjs(Date.now()).diff(dayjs.unix(n.createdAt), "day") <= 7)
  const olderNotifications = notifications.filter(n => dayjs(Date.now()).diff(dayjs.unix(n.createdAt), "day") > 7)

  useEffect(() => {
    console.log("notif", notifications.length)
  }, [notifications])

  return (
    <ScrollbarWrapper
      autoHide={true}
      maxHeight={300}
      className={classes.scrollContent}
    >
      <div className={classes.notificationsBody}>
        {notifications.length === 0 && (
          <div className={classes.emptyBody}>
            <MoonStarIcon className={classes.icon} />
            <Typography variant="h4" >
              <Trans>There are no notifications!</Trans>
            </Typography>
          </div>
        )}
        {notifications.length !== 0 && <>
          <section className={classes.header}>
            <Typography
              variant="h3"
              component="p"
              data-cy="label-notifications-header"
            >
              <Trans>Notifications</Trans>
            </Typography>
            <Divider />
          </section>
          {!!thisWeeksNotifications.length && <section className={classes.notifs}>
            <Typography
              variant="h5"
              component="p"
              className={classes.timeHeader}
              data-cy="label-notifications-this-week"
            >
              <Trans>This week</Trans>
            </Typography>
            {thisWeeksNotifications.map((n, i) => <NotificationLine
              key={`${i}-thisWeek`}
              notification={n}
            />)}
          </section>
          }
          {!!olderNotifications.length && <section className={classes.notifs}>
            <Typography
              variant="h5"
              component="p"
              className={classes.timeHeader}
              data-cy="label-notifications-older"
            >
              <Trans>Older notifications</Trans>
            </Typography>
            {olderNotifications.map((n, i) => <NotificationLine
              key={`${i}-olderNotifications`}
              notification={n}
            />)}
          </section>
          }
        </>}
      </div>
    </ScrollbarWrapper>
  )
}

export default NotificationList