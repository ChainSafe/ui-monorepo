import React, { useEffect, useMemo, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { Button, ExternalSvg, Loading, ToggleSwitch, Typography } from "@chainsafe/common-components"
import { t, Trans } from "@lingui/macro"
import { CSFTheme } from "../../../../../Themes/types"
import { useBilling } from "../../../../../Contexts/BillingContext"
import { Product, ProductPriceRecurringInterval } from "@chainsafe/files-api-client"

const useStyles = makeStyles(({ breakpoints, constants, palette, typography }: CSFTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 2}px 0px`
    },
    header: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between"
    },
    label: {
      ...typography.h5
    },
    panels: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      margin: `${constants.generalUnit * 3.5}px 0`
    },
    panel: {
      display: "flex",
      flexDirection: "column",
      padding: `${constants.generalUnit}px ${constants.generalUnit * 3}px`,
      width: `calc(33.3333% - ${constants.generalUnit * 2}px)`,
      minHeight: 200,
      cursor: "pointer",
      border: `3px solid ${palette.additional.gray[4]}`,
      borderRadius: constants.generalUnit,
      marginBottom: constants.generalUnit,
      "&.active": {
        opacity: "1 !important",
        backgroundColor: constants.changeProduct.currentBackground,
        borderColor: constants.changeProduct.selectedColor
      },
      [breakpoints.down("sm")]: {
        width: `calc(50% - ${constants.generalUnit}px)`
      }
    },
    loader: {
      margin: "0 auto"
    },
    panelTop: {
      height: "60%",
      "& > header": {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: constants.generalUnit
      }
    },
    tag: {
      display: "block",
      padding: `0 ${constants.generalUnit}px`,
      borderRadius: `${constants.generalUnit * 2}px`,
      height: 20,
      "&.current": {
        backgroundColor: palette.primary.main,
        color: constants.changeProduct.currentTag.text
      },
      "&.popular": {
        backgroundColor: palette.additional.gold[5]
      }
    },
    panelBottom: {
      height: "40%"
    },
    link: {
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      "& svg": {
        marginLeft: constants.generalUnit,
        stroke: palette.additional.gray[10],
        width: constants.generalUnit * 2,
        height: constants.generalUnit * 2
      }
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
  next: (newPriceId: string) => void
}

const SelectPlan = ({ close, className, next }: ISelectPlan) => {
  const classes = useStyles()
  const { getAvailablePlans, currentSubscription } = useBilling()
  const [selectedPlan, setSelectedPlan] = useState<string | undefined>(currentSubscription?.product.id)
  const [plans, setPlans] = useState<Product[] | undefined>()
  const [interval, setInterval] = useState<ProductPriceRecurringInterval>("month")

  useEffect(() => {
    if(!plans) {
      getAvailablePlans()
        .then((plans) => setPlans(plans))
    }
  })

  const selectedPrice = useMemo(() => {
    return plans?.find(plan => plan.id === selectedPlan)?.prices.find(price => price.recurring.interval === interval)?.id
  }, [selectedPlan, plans, interval])

  const translatedPrice = useMemo(() => {
    switch (interval) {
      case "day":
        return t`per day`
      case "week":
        return t`per week`
      case "month":
        return t`per month`
      case "year":
        return t`per year`
    }
  }, [interval])

  return (
    <article className={clsx(classes.root, className)}>
      <header className={classes.header}>
        <Typography
          component="p"
          variant="h4"
        >
          <Trans>
            Switch Plans
          </Trans>
        </Typography>
        <div>
          <ToggleSwitch
            left={{
              value: "month",
              label: t`Billed Monthly`
            }}
            right={{
              value: "year",
              label: t`Billed Annually`
            }}
            injectedClasses={{
              label: classes.label
            }}
            value={interval}
            onChange={(value: ProductPriceRecurringInterval) => setInterval(value)}
            size="medium"
          />
        </div>
      </header>
      <section className={classes.panels}>
        {
          !plans && <Loading className={classes.loader} />
        }
        {
          plans && plans.map((plan) => <div
            className={clsx(classes.panel, {
              "active": selectedPlan === plan.id
            })}
            onClick={() => setSelectedPlan(plan.id) }
            key={`plan-${plan.id}`}>
            <div className={classes.panelTop}>
              <header>
                <Typography
                  component="p"
                  variant="h5">
                  {
                    plan.name
                  }
                </Typography>
                {
                  plan.id  === currentSubscription?.product.id && <Typography
                    component="p"
                    variant="body2"
                    className={clsx(classes.tag, "current")}>
                    <Trans>
                      Current
                    </Trans>
                  </Typography>
                }
              </header>
              <Typography
                component="p"
                variant="body1">
                {
                  plan.description
                }
              </Typography>
            </div>
            <div className={classes.panelBottom}>
              {
                plan.prices
                  .filter(price => price.recurring.interval === interval)
                  .map(price => <Typography
                    disabled={price.is_update_allowed}
                    variant="h5"
                    key={`${plan.id}-${price.id}`}>
                    {
                      price.unit_amount === 0 ? t`Free` : `${price.unit_amount} ${price.currency} ${translatedPrice}`
                    }
                  </Typography>)
              }
            </div>
          </div>)
        }
      </section>
      <section className={classes.bottomSection}>
        <a
          className={classes.link}
          href="http://chainsafe.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Typography
            component="span"
            variant="h5">
            <Trans>
              Not sure what to pick? Learn more about our plans
            </Trans>
          </Typography>
          <ExternalSvg />
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
            disabled={!selectedPlan || !selectedPrice || selectedPlan === currentSubscription?.product.id}
            onClick={() => next(
              selectedPrice as string)}
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