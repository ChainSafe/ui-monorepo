import React from "react"
import {
  Button,
  formatBytes,
  Link,
  ProgressBar,
  Typography
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { ROUTE_LINKS } from "../../../FilesRoutes"
import { useFiles } from "../../../../Contexts/FilesContext"
import { Trans } from "@lingui/macro"
import clsx from "clsx"
import { useFilesApi } from "../../../../Contexts/FilesApiContext"
import { useEffect } from "react"
import { useUser } from "../../../../Contexts/UserContext"

const useStyles = makeStyles(({ breakpoints, constants }: ITheme) =>
  createStyles({
    root: {
      padding: constants.generalUnit,
      "& h2, & h5": {
        marginBottom: constants.generalUnit,
        fontWeight: 400
      },
      "& h5": {
      }
    },
    spaceUsedBox: {
      [breakpoints.down("md")]: {
        marginBottom: constants.generalUnit,
        width: "inherit"
      }
    },
    usageBar: {
      maxWidth: "70%",
      marginBottom: constants.generalUnit,
      marginTop: constants.generalUnit,
      overflow: "hidden"
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      "& > *:first-child": {
        marginRight: constants.generalUnit
      }
    },
    link: {
      display: "block",
      width: `calc(50% - ${constants.generalUnit}px)`,
      textDecoration: "none"
    }
  })
)

interface ISubscriptionWidget {
  className?: string
}

const SubscriptionWidget = ({ className }: ISubscriptionWidget) => {
  const classes = useStyles()
  const { storageSummary } = useFiles()
  const { filesApiClient } = useFilesApi()
  const { profile } = useUser()

  useEffect(() => {
    const test = async () => {
      try {
        const returnData = await filesApiClient.getCurrentSubscription()
        console.log(returnData)
      } catch (error: any) {
        console.error(error)
      }
    }
    test()
  }, [filesApiClient, profile])

  return (<section className={clsx(classes.root, className)}>
    <Typography
      variant="h4"
      component="h2"
    >
      <Trans>Your plan</Trans>
    </Typography>
    <Typography
      variant="h5"
      component="h5"
    >
      <Trans>Basic - Free</Trans>
    </Typography>
    {storageSummary &&
      <div className={classes.spaceUsedBox}>
        <Typography
          variant="body2"
          component="p"
        >
          {`${formatBytes(storageSummary.used_storage, 2)} of ${formatBytes(
            storageSummary.total_storage, 2
          )} used`}
        </Typography>
        <ProgressBar
          className={classes.usageBar}
          progress={(storageSummary.used_storage / storageSummary.total_storage) * 100}
          size="small"
        />
      </div>
    }
    <div className={classes.buttons}>
      <Link
        className={classes.link}
        to={ROUTE_LINKS.PurchasePlan}
      >
        <Button
          fullsize
          variant="primary"
        >
            Change Plan
        </Button>
      </Link>
      <Link
        className={classes.link}
        to={ROUTE_LINKS.PurchasePlan}
      >
        <Button
          fullsize
          variant="secondary"
        >
            Cancel Plan
        </Button>
      </Link>
    </div>
  </section>)
}

export default SubscriptionWidget