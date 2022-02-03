import React, { useState } from "react"
import {
  Button,
  formatBytes,
  Loading,
  ProgressBar,
  Typography
} from "@chainsafe/common-components"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { useFiles } from "../../../../Contexts/FilesContext"
import { t, Trans } from "@lingui/macro"
import clsx from "clsx"
import { useBilling } from "../../../../Contexts/BillingContext"
import ChangePlanModal from "./ChangePlan/ChangePlanModal"
import { CSFTheme } from "../../../../Themes/types"

const useStyles = makeStyles(({ breakpoints, constants }: CSFTheme) =>
  createStyles({
    root: {
      padding: `${constants.generalUnit}px 0`,
      "& h2, & h5": {
        marginBottom: constants.generalUnit,
        fontWeight: 400
      },
      "& h5": {
      }
    },
    heading: {
      flex: 1
    },
    headline: {
      display: "flex",
      justifyContent: "space-between"
    },
    alignRight: {
      display: "flex",
      justifyContent: "flex-end"
    },
    spaceUsedBox: {
      [breakpoints.down("md")]: {
        marginBottom: constants.generalUnit,
        width: "inherit"
      }
    },
    usageBar: {
      marginTop: constants.generalUnit * 1.5,
      marginBottom: constants.generalUnit,
      overflow: "hidden"
    },
    buttons: {
      maxWidth: 240,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      "& > *:first-child": {
        marginRight: constants.generalUnit
      }
    },
    link: {
      color: constants.settingsPage.linkButton.color,
      paddingRight: "0px !important"
    }
  })
)

interface ICurrentProduct {
  className?: string
}

const CurrentPlan = ({ className }: ICurrentProduct) => {
  const classes = useStyles()
  const { storageSummary } = useFiles()
  const { currentSubscription, isPendingInvoice } = useBilling()
  const [isChangeProductModalVisible, setChangeProductModalVisible] = useState(false)

  return (<section className={clsx(classes.root, className)}>
    {currentSubscription
      ? <div className={classes.headline}>
        <Typography
          variant="h4"
          component="h4"
          className={classes.heading}
        >
          {currentSubscription?.product.name}{isPendingInvoice && ` ${t`(Awaiting payment)`}`}
        </Typography>
        <Button
          variant="link"
          onClick={() => setChangeProductModalVisible(true)}
          data-cy="button-change-plan"
          className={classes.link}
        >
          {isPendingInvoice
            ? <Trans>See payment info</Trans>
            : <Trans>Change Plan</Trans>
          }
        </Button>
      </div>
      : <Loading
        size={36}
        type="initial"
      />
    }
    {storageSummary &&
      <>
        <div className={classes.spaceUsedBox}>
          <ProgressBar
            className={classes.usageBar}
            progress={(storageSummary.used_storage / storageSummary.total_storage) * 100}
            size="medium"
          />
          <div className={classes.alignRight}>
            <Typography
              variant="body1"
              component="p"
            >
              {t`${formatBytes(storageSummary.used_storage, 2)} of ${formatBytes(
                storageSummary.total_storage, 2
              )} used`} ({((storageSummary.used_storage / storageSummary.total_storage) * 100).toFixed(1)}%)
            </Typography>
          </div>
        </div>
        {
          isChangeProductModalVisible && (<ChangePlanModal
            onClose={() => setChangeProductModalVisible(false)}
          />)
        }
      </>
    }

  </section>)
}

export default CurrentPlan