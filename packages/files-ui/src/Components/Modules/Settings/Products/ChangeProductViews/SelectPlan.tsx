import React, { useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { Button, Typography } from "@chainsafe/common-components"
import { Trans } from "@lingui/macro"
import { CSFTheme } from "../../../../../Themes/types"
import { useBilling } from "../../../../../Contexts/BillingContext"
import { Product, ProductPriceRecurringInterval } from "@chainsafe/files-api-client"

const useStyles = makeStyles(({ constants, palette, typography }: CSFTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 3}px 0px`
    },
    panel: {

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
      justifyContent: "space-between",
      alignItems: "center"
    }
  })
)

interface ISelectPlan {
  className?: string
  close: () => void
  next: (id: string) => void
}

const SelectPlan = ({ close, className, next }: ISelectPlan) => {
  const classes = useStyles()
  const { getAvailablePlans } = useBilling()

  const [newPlan, setNewPlan] = useState<string | undefined>(undefined)
  const [plans, setPlans] = useState<Product[] | undefined>()
  const [interval, setInterval] = useState<ProductPriceRecurringInterval>("month")

  useEffect(() => {
    if(!plans) {
      getAvailablePlans()
        .then((plans) => setPlans(plans))
    }
  })
  console.log("Plans ", plans)

  return (
    <article className={clsx(classes.root, className)}>
      <header>
        <Typography
          component="p"
          variant="h4"
        >
          <Trans>
            Switch Plans
          </Trans>
        </Typography>
        <div></div>
      </header>
      <section>
        {
          plans && plans.map((plan) => <div
            className={classes.panel}
            key={`plan-${plan.id}`}>
            <div>
              <Typography>
                {
                  plan.name
                }
              </Typography>
              <Typography>
                {
                  plan.description
                }
              </Typography>
            </div>
            <div>
              {
                plan.prices.filter(plan => plan.recurring.interval === interval).map(price => <div key="">
                  {
                    price.currency
                  }
                </div>)
              }
            </div>
          </div>)
        }
      </section>
      <section className={classes.bottomSection}>
        <a
          href="#"
          target="_blank"
        >
          <Trans>
            Not sure what to pick? Learn more about our plans
          </Trans>
        </a>
        <div className={classes.buttons}>
          <Button
            onClick={() => close()}
            variant="secondary"
          >
            <Trans>
              Cancel
            </Trans>
          </Button>
          <Button
            disabled={!newPlan}
            onClick={() => next(newPlan as string)}
            variant="primary"
          >
            <Trans>
              Select this plan
            </Trans>
          </Button>
        </div>
      </section>
    </article>
  )
}

export default SelectPlan