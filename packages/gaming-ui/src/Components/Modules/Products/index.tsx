import React, { useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSGTheme } from "../../../Themes/types"
import ProductInfo from "./ProductInfo"
import { ArrowLeftIcon, Link, RadioInput, Typography } from "@chainsafe/common-components"
import { t, Trans } from "@lingui/macro"
import { ROUTE_LINKS } from "../../GamingRoutes"
import { useGamingApi } from "../../../Contexts/GamingApiContext"
import { Product } from "@chainsafe/files-api-client"
import { useEffect } from "react"

const useStyles = makeStyles(({ constants, palette, breakpoints }: CSGTheme) =>
  createStyles({
    root: {
      [breakpoints.down("md")]: {
        padding: `${constants.generalUnit * 4}px ${constants.generalUnit * 2}px`
      }
    },
    container: {
      display: "grid",
      gridColumnGap: constants.generalUnit * 2,
      gridTemplateColumns: "1fr 1fr 1fr",
      [breakpoints.down("md")]: {
        gridTemplateColumns: "1fr 1fr",
        gridRowGap: constants.generalUnit * 2
      },
      [breakpoints.down("sm")]: {
        gridTemplateColumns: "1fr",
        gridRowGap: constants.generalUnit * 2
      }
    },
    heading: {
      marginBottom: constants.generalUnit * 4,
      [breakpoints.down("md")]: {
        marginBottom: constants.generalUnit * 2
      }
    },
    backIcon: {
      fontSize: 10,
      marginRight: constants.generalUnit
    },
    planSettings: {
      display: "flex",
      justifyContent: "space-between",
      margin: `${constants.generalUnit * 2}px 0px ${constants.generalUnit * 5}px`,
      alignItems: "center",
      [breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "flex-start",
        margin: `${constants.generalUnit * 2}px 0px ${constants.generalUnit * 2}px`
      }
    },
    planRadios: {
      display: "flex",
      alignItems: "center"
    },
    plan1: {
      backgroundColor: palette.additional["gray"][3],
      color: palette.additional["gray"][9]
    },
    plan2: {
      backgroundColor: palette.additional["blue"][7],
      color: palette.additional["gray"][1]
    },
    plan3: {
      backgroundColor: palette.additional["gray"][9],
      color: palette.additional["gray"][1]
    }
  })
)

const Products = () => {
  const classes = useStyles()
  const [billingPeriod, setBillingPeriod] = useState<"month" | "year">("month")
  const { gamingApiClient } = useGamingApi()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    gamingApiClient.getAllProducts().then(prods => {
      console.log(prods)
      setProducts(prods)
    }).catch(console.error)
  }, [gamingApiClient])

  return (
    <div className={classes.root}>
      <Typography
        className={classes.heading}
        variant="h1"
        component="p"
      >
        <Trans>Upgrade your plan</Trans>
      </Typography>
      <div className={classes.planSettings}>
        <Link to={ROUTE_LINKS.SettingsRoot}>
          <ArrowLeftIcon className={classes.backIcon} />
          <Typography><Trans>Back to plan settings</Trans></Typography>
        </Link>
        <div className={classes.planRadios}>
          <RadioInput
            label={t`Billed Monthly`}
            value="monthly"
            onChange={() => setBillingPeriod("month")}
            checked={billingPeriod === "month"}
          />
          <RadioInput
            label={t`Billed Yearly`}
            value="yearly"
            onChange={() => setBillingPeriod("year")}
            checked={billingPeriod === "year"}
          />
        </div>
      </div>
      <div className={classes.container}>
        {products.map(p =>
          <ProductInfo
            key={p.id}
            product={p}
            billingPeriod={billingPeriod} />
        )}
      </div>
    </div>

  )
}

export default Products