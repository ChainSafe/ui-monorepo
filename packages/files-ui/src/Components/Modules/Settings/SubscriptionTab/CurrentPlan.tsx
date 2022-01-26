import React, { useState } from "react"
import {
  Button,
  formatBytes,
  Loading,
  ProgressBar,
  Typography
} from "@chainsafe/common-components"
import { makeStyles, ITheme, createStyles } from "@chainsafe/common-theme"
import { useFiles } from "../../../../Contexts/FilesContext"
import { t, Trans } from "@lingui/macro"
import clsx from "clsx"
import { useBilling } from "../../../../Contexts/BillingContext"
import ChangePlanModal from "./ChangePlan/ChangePlanModal"

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
      maxWidth: 240,
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
      maxWidth: 240,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      "& > *:first-child": {
        marginRight: constants.generalUnit
      }
    },
    link: {
      display: "block",
      width: "100%",
      textDecoration: "none"
    },
    changePlanButton: {
      "& > svg" : {
        marginRight: constants.generalUnit
      }
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
    <Typography
      variant="h4"
      component="h2"
    >
      <Trans>Your plan</Trans>
    </Typography>
    {
      currentSubscription
        ?  <Typography
          variant="h5"
          component="h5"
        >
          {currentSubscription?.product.name}{isPendingInvoice && ` ${t`(Awaiting payment)`}`}
        </Typography>
        : <Loading
          size={36}
          type="initial"
        />
    }
    {storageSummary &&
      <>
        <div className={classes.spaceUsedBox}>
          <Typography
            variant="body2"
            component="p"
          >
            {t`${formatBytes(storageSummary.used_storage, 2)} of ${formatBytes(
              storageSummary.total_storage, 2
            )} used`} ({((storageSummary.used_storage / storageSummary.total_storage) * 100).toFixed(1)}%)
          </Typography>
          <ProgressBar
            className={classes.usageBar}
            progress={(storageSummary.used_storage / storageSummary.total_storage) * 100}
            size="small"
          />
        </div>
        <div className={classes.buttons}>
          <Button
            fullsize
            variant="primary"
            onClick={() => setChangeProductModalVisible(true)}
            data-cy="button-change-plan"
            className={classes.changePlanButton}
          >
            {isPendingInvoice
              ? <Trans>See payment info</Trans>
              : <Trans>Change Plan</Trans>
            }
          </Button>
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