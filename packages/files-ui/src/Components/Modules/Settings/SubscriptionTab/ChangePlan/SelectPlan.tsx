import React, { useState } from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import clsx from "clsx"
import { Button, ExternalSvg, formatBytes, Loading, Typography } from "@chainsafe/common-components"
import { t, Trans } from "@lingui/macro"
import { CSFTheme } from "../../../../../Themes/types"
import { useBilling } from "../../../../../Contexts/BillingContext"
import { Product } from "@chainsafe/files-api-client"
import { ROUTE_LINKS } from "../../../../FilesRoutes"

const useStyles = makeStyles(({ breakpoints, constants, palette, typography }: CSFTheme) =>
  createStyles({
    root:  {
      margin: `${constants.generalUnit * 2}px ${constants.generalUnit * 3}px`,
      [breakpoints.down("md")]: {
        margin: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px`
      }
    },
    header: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: constants.generalUnit * 2
    },
    loadingContainer: {
      margin: `${constants.generalUnit * 4}px 0`,
      display: "flex",
      justifyContent: "center"
    },
    panels: {
      display: "grid",
      gridColumnGap: constants.generalUnit * 1.5,
      gridRowGap: constants.generalUnit * 1.5,
      gridTemplateColumns: "1fr 1fr 1fr",
      marginTop: constants.generalUnit * 2,
      marginBottom: constants.generalUnit * 4,
      [breakpoints.down("md")]: {
        gridTemplateColumns: "1fr",
        marginTop: constants.generalUnit * 3
      }
    },
    planBox: {
      border: `2px solid ${palette.additional["gray"][5]}`,
      padding: `${constants.generalUnit * 3}px ${constants.generalUnit * 4}px `,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderRadius: 5,
      [breakpoints.down("md")]: {
        flexDirection: "row",
        padding: `${constants.generalUnit * 2}px ${constants.generalUnit * 2}px `,
        justifyContent: "space-between"
      },
      "&.active": {
        borderColor: palette.primary.background
      }
    },
    priceSpace: {
      height: 22
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
      },
      [breakpoints.down("md")]: {
        flex: 1
      }
    },
    bottomSection: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
    },
    planTitle: {
      fontWeight: "bold",
      marginBottom: constants.generalUnit
    },
    priceSubtitle: {
      ...typography.body2,
      color: palette.additional["gray"][9]
    },
    description: {
      margin: `${constants.generalUnit * 3}px 0`,
      [breakpoints.down("md")]: {
        margin: 0
      }
    },
    priceYearlyTitle: {
      fontWeight: "bold",
      [breakpoints.down("md")]: {
        fontWeight: "normal",
        marginTop: constants.generalUnit
      }
    },
    mobilePriceBox: {
      display: "flex",
      flexDirection: "column",
      alignItems: "end",
      height: "100%"
    },
    selectButton: {
      marginLeft: constants.generalUnit
    }
  })
)

interface ISelectPlan {
  className?: string
  plans?: Product[]
  onClose: () => void
  onSelectPlan: (plan: Product) => void
}

const SelectPlan = ({ onClose, className, onSelectPlan, plans }: ISelectPlan) => {
  const classes = useStyles()
  const { currentSubscription } = useBilling()
  const { desktop } = useThemeSwitcher()
  const [tempSelectedPlan, setTempSelectedPlan] = useState<Product | undefined>()

  return (
    <article className={clsx(classes.root, className)}>
      <header className={classes.header}>
        <Typography
          component="p"
          variant="h4"
        >
          <Trans>Switch Plans</Trans>
        </Typography>
      </header>
      {!plans && (
        <div className={classes.loadingContainer}>
          <Loading type='initial'/>
        </div>
      )}
      <section className={classes.panels}>
        {plans && plans.map((plan) => {
          const monthly = plan.prices.find((price) => price.recurring.interval === "month")
          const yearly = plan.prices.find((price) => price.recurring.interval === "year")
          const isPlanSelectable = plan.id  !== currentSubscription?.product.id &&
          (monthly?.is_update_allowed || yearly?.is_update_allowed)
          const currentStorage = formatBytes(Number(monthly?.metadata?.storage_size_bytes), 2)


          return desktop ? (
            <div
              className={clsx(classes.planBox)}
              key={`plan-${plan.id}`}
            >
              <Typography
                component="p"
                variant="body1"
                className={classes.planTitle}
              >
                {plan.name}
              </Typography>
              {monthly && (
                <Typography
                  component="h4"
                  variant="h4">
                  {monthly.unit_amount
                    ? <>
                      {monthly.currency.toUpperCase()} {monthly.unit_amount}
                      <span className={classes.priceSubtitle}>
                        <Trans>/month</Trans>
                      </span>
                    </>
                    : t`Free`}
                </Typography>
              )}
              {monthly && yearly
                ? (
                  <Typography
                    variant="body2"
                    className={classes.priceYearlyTitle}
                  >
                    {yearly.currency.toUpperCase()} {yearly.unit_amount}
                    <span className={classes.priceSubtitle}>
                      <Trans>/year</Trans>
                    </span>
                  </Typography>
                )
                : <div className={classes.priceSpace} />
              }
              <Typography
                component="p"
                variant="body1"
                className={classes.description}
              >
                {
                monthly?.metadata?.storage_size_bytes
                  ? <Trans>{currentStorage} of storage</Trans>
                  : plan.description
                }
              </Typography>
              <Button
                variant="primary"
                disabled={!isPlanSelectable}
                onClick={() => onSelectPlan(plan)}
              >
                <Trans>Select plan</Trans>
              </Button>
            </div>
          )
            : (
              <div
                className={clsx(classes.planBox, tempSelectedPlan?.id === plan.id && "active")}
                onClick={() => isPlanSelectable && setTempSelectedPlan(plan)}
                key={`plan-${plan.id}`}
              >
                <div>
                  <Typography
                    component="p"
                    variant="body1"
                    className={classes.planTitle}
                  >
                    {plan.name}
                  </Typography>
                  <Typography
                    component="p"
                    variant="body1"
                    className={classes.description}
                  >
                    {
                      monthly?.metadata?.storage_size_bytes
                        ? <Trans>{currentStorage} of storage</Trans>
                        : plan.description
                    }
                  </Typography>
                </div>
                <div className={classes.mobilePriceBox}>
                  {monthly && (
                    <Typography
                      component="h4"
                      variant="h4">
                      {monthly.unit_amount
                        ? <>
                          {monthly.currency.toUpperCase()} {monthly.unit_amount}
                          <span className={classes.priceSubtitle}>/month</span>
                        </>
                        : t`Free`}
                    </Typography>
                  )}
                  {monthly && yearly
                    ? (
                      <Typography
                        variant="body2"
                        className={classes.priceYearlyTitle}>
                        {yearly.currency.toUpperCase()} {yearly.unit_amount}
                        <span className={classes.priceSubtitle}>/year</span>
                      </Typography>
                    )
                    : <div className={classes.priceSpace} />
                  }
                </div>
              </div>
            )})}
      </section>
      <section className={classes.bottomSection}>
        {desktop && (
          <a
            className={classes.link}
            href={ROUTE_LINKS.ProductPlans}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography
              component="span"
              variant="h5"
            >
              <Trans>Not sure what to pick? Learn more about our plans</Trans>
            </Typography>
            <ExternalSvg />
          </a>
        )}
        <div className={classes.buttons}>
          <Button
            onClick={onClose}
            variant="secondary"
          >
            <Trans>Cancel</Trans>
          </Button>
          {!desktop && (
            <Button
              variant="primary"
              disabled={!tempSelectedPlan}
              className={classes.selectButton}
              onClick={() => tempSelectedPlan && onSelectPlan(tempSelectedPlan)}
            >
              <Trans>Select plan</ Trans>
            </Button>
          )}
        </div>
      </section>
    </article>
  )
}

export default SelectPlan