import React from "react"
import { Divider, Typography } from "@chainsafe/common-components"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSGTheme } from "../../../Themes/types"
import clsx from "clsx"
import { Trans } from "@lingui/macro"
import { Product } from "@chainsafe/files-api-client"

const useStyles = makeStyles(({ constants, palette, typography }: CSGTheme) =>
  createStyles({
    container: {
      border: "1px solid",
      borderColor: palette.additional["gray"][3],
      color: "inherit",
      padding: `${constants.generalUnit * 4}px ${constants.generalUnit * 4}px ${constants.generalUnit * 5}px`
    },
    planFor: {
      fontSize: 18,
      color: "inherit"
    },
    title: {
      fontSize: 30,
      margin: `${constants.generalUnit * 2}px 0px ${constants.generalUnit * 4}px`
    },
    feature: {
      margin: `${constants.generalUnit * 0.5}px 0px`
    },
    price: {
      fontWeight: "bold",
      margin: `${constants.generalUnit * 3}px 0px ${constants.generalUnit * 6}px`
    },
    buttonLink: {
      outline: "none",
      textDecoration: "underline",
      cursor: "pointer",
      textAlign: "left",
      ...typography.body1,
      fontWeight: "bold"
    },
    divider:  {
      margin: `${constants.generalUnit * 3}px 0px`
    }
  })
)

interface ProductInfoProps {
  product: Product
  billingPeriod: "month" | "year"
  className?: string
}

const ProductInfo = ({ product, billingPeriod, className }: ProductInfoProps) => {
  const classes = useStyles()
  const { description, name, prices } = product

  const price = prices.find(p => p.recurring.interval === billingPeriod && p.recurring.interval_count === 1)

  return (
    <div className={clsx(classes.container, className)}>
      <Typography
        variant="h4"
        component="h4"
        className={classes.planFor}
      >
        Chainsafe Gaming
      </Typography>
      <Typography
        variant="h3"
        component="h3"
        className={classes.title}
      >
        {/* not adding translations to titles */}
        {name}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        className={classes.feature}
      >
        {description}
      </Typography>
      <Typography
        variant="h3"
        component="h3"
        className={classes.price}
      >
        $ {price?.unit_amount} {price?.currency.toUpperCase()} / {price?.recurring.interval}
      </Typography>
      <div
        className={classes.buttonLink}
      >
        <Trans>Try for 7 days</Trans>
      </div>
      <Divider className={classes.divider} />
      <div
        className={classes.buttonLink}
      >
        <Trans>Purchase with card</Trans>
      </div>
    </div>
  )
}

export default ProductInfo