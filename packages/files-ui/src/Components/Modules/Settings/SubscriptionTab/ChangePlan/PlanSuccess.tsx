import React from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Product, ProductPrice } from "@chainsafe/files-api-client"
import {  Button, CheckCircleIcon, CheckIcon, Divider, formatBytes, Link, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../../../FilesRoutes"
import clsx from "clsx"

const useStyles = makeStyles(({ constants, palette }: CSFTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`
    },
    headingBadge: {
      color: palette.additional["gray"][7],
      marginTop: constants.generalUnit * 3
    },
    headingBox: {
      marginTop: constants.generalUnit * 2,
      marginBottom: constants.generalUnit * 2
    },
    rowBox: {
      display: "flex",
      padding: `${constants.generalUnit * 0.5}px 0px`
    },
    middleRowBox: {
      display: "flex",
      alignItems: "center"
    },
    featuresTitle: {
      marginTop: constants.generalUnit * 2,
      marginBottom: constants.generalUnit * 2
    },
    pushRightBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      marginLeft: constants.generalUnit * 4
    },
    buttons: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      "& > *": {
        marginLeft: constants.generalUnit
      }
    },
    bottomSection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      margin: `${constants.generalUnit * 3}px 0px`
    },
    divider: {
      margin: `${constants.generalUnit}px 0`
    },
    featuresBox: {
      marginTop: constants.generalUnit,
      marginBottom: constants.generalUnit * 2
    },
    featureTickBox: {
      marginBottom: constants.generalUnit
    },
    textLink: {
      color: palette.primary.background
    },
    checkCircleIcon:  {
      fill: palette.additional["gray"][7]
    },
    tickIcon: {
      fill: palette.success.main
    },
    invoiceText: {
      marginTop: constants.generalUnit * 3,
      marginBottom: constants.generalUnit
    }
  })
)

interface IPlanSuccess {
  plan: Product
  planPrice: ProductPrice
  onClose: () => void
}

const PlanSuccess = ({
  plan,
  onClose,
  planPrice
}: IPlanSuccess) => {
  const classes = useStyles()

  return (
    <article className={classes.root}>
      <Typography
        variant="body1"
        component="p"
        className={classes.headingBadge}
      >
        <Trans>Confirmation</Trans>
      </Typography>
      <div className={clsx(classes.middleRowBox, classes.headingBox)}>
        <Typography
          variant="h5"
          component="h4"
        >
          <Trans>Plan changed successfully</Trans>
          &nbsp;&nbsp;
        </Typography>
        <CheckCircleIcon className={classes.checkCircleIcon} />
      </div>
      <Divider className={classes.divider} />
      <div>
        <Typography variant="body1"
          component="p"
          className={classes.featuresTitle}
        >
          <Trans>You now have: </Trans>
        </Typography>
        <div className={classes.pushRightBox}>
          <div className={clsx(classes.middleRowBox, classes.featureTickBox)}>
            <CheckIcon className={classes.tickIcon} />
            <Typography component="p"
              variant="body1"
            >
              {planPrice?.metadata?.storage_size_bytes
                ? <>
                  <b>{formatBytes(Number(planPrice?.metadata?.storage_size_bytes), 2)}&nbsp;</b>
                  <Trans>of storage</Trans >
                </>
                : plan.description
              }
            </Typography>
          </div>
          <div className={classes.middleRowBox}>
            <CheckIcon className={classes.tickIcon} />
            <Typography component="p"
              variant="body1">
              {plan.description}
            </Typography>
          </div>
        </div>
      </div>
      <div className={classes.rowBox}>
        <Typography component="p"
          variant="body1"
          className={classes.invoiceText}
        >
          <Trans>Access your billing history in settings or view your </Trans>&nbsp;
          <Link to={ROUTE_LINKS.BillingHistory}
            className={classes.textLink}
          >
            <Trans>invoices here</Trans>
          </Link>
        </Typography>
      </div>
      <section className={classes.bottomSection}>
        <div className={classes.buttons}>
          <Button
            onClick={() => onClose()}
            variant="secondary"
          >
            <Trans>
              Close
            </Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default PlanSuccess