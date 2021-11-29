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
import ChangeProductModal from "../ChangePlan/ChangePlanModal"

const useStyles = makeStyles(({ breakpoints, constants }: ITheme) =>
  createStyles({
    root: {
      padding: constants.generalUnit,
      maxWidth: 240,
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
      width: "100%",
      textDecoration: "none"
    }
  })
)

interface ICurrentProduct {
  className?: string
}

const CurrentProduct = ({ className }: ICurrentProduct) => {
  const classes = useStyles()
  const { storageSummary } = useFiles()
  const { currentSubscription } = useBilling()
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
          {currentSubscription?.product.name}
        </Typography>
        : <Loading size={36}
          type="inherit" />
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
          >
            <Trans>Change Plan</Trans>
          </Button>
        </div>
        {
          isChangeProductModalVisible && (<ChangeProductModal
            close={() => setChangeProductModalVisible(false)}
          />)
        }
      </>
    }

  </section>)
}

export default CurrentProduct