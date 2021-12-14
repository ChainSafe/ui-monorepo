import React, { useEffect, useMemo, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { CrossIcon, Modal } from "@chainsafe/common-components"
import SelectPlan from "./SelectPlan"
import PlanDetails from "./PlanDetails"
import PaymentMethod from "./PaymentMethod"
import ConfirmPlan from "./ConfirmPlan"
import { useBilling } from "../../../../../Contexts/BillingContext"
import { Product, ProductPrice, ProductPriceRecurringInterval } from "@chainsafe/files-api-client"
import PlanSuccess from "./PlanSuccess"
import DowngradeDetails from "./DowngradeDetails"

const useStyles = makeStyles(({ constants, breakpoints, palette }: CSFTheme) =>
  createStyles({
    root: {
      "&:before": {
        backgroundColor: constants.modalDefault.fadeBackground
      }
    },
    inner: {
      borderRadius: `${constants.generalUnit / 2}px`,
      [breakpoints.up("sm")]: {
        minWidth: 480
      },
      [breakpoints.down("sm")]: {
        width: "100%"
      }
    },
    crossIcon: {
      position: "absolute",
      right: 0,
      top: 0,
      fontSize: 14,
      fill: palette.additional["gray"][8],
      cursor: "pointer"
    }
  })
)

type ChangeModalSlides = "select" |
"planDetails"  |
"paymentMethod" |
"confirmPlan" |
"planSuccess" |
"downgradeDetails"

const getPrice = (plan: Product, recurrence?: ProductPriceRecurringInterval) => {
  return plan.prices.find(price => price?.recurring?.interval === recurrence)?.unit_amount || 0
}

interface IChangeProductModal {
  onClose: () => void
}

const ChangeProductModal = ({ onClose }: IChangeProductModal) => {
  const classes = useStyles()
  const { getAvailablePlans, changeSubscription, currentSubscription } = useBilling()
  const [selectedPlan, setSelectedPlan] = useState<Product | undefined>()
  const [selectedPrice, setSelectedPrice] = useState<ProductPrice | undefined>()
  const [slide, setSlide] = useState<ChangeModalSlides>("select")
  const [plans, setPlans] = useState<Product[] | undefined>()
  const [isLoadingChangeSubscription, setIsLoadingChangeSubscription] = useState(false)
  const [isSubscriptionError, setIsSubscriptionError] = useState(false)
  const didSelectFreePlan = useMemo(() => !!selectedPlan && getPrice(selectedPlan, "month") === 0, [selectedPlan])

  useEffect(() => {
    if(!plans) {
      getAvailablePlans()
        .then((plans) => setPlans(plans))
        .catch(console.error)
    }
  }, [getAvailablePlans, plans])

  const handleChangeSubscription = () => {
    if (selectedPrice) {
      setIsLoadingChangeSubscription(true)
      changeSubscription(selectedPrice.id)
        .then(() => {
          setSlide("planSuccess")
        })
        .catch(() => {
          setIsSubscriptionError(true)
        })
        .finally(() => setIsLoadingChangeSubscription(false))
    }
  }

  const closeIcon = <CrossIcon
    onClick={onClose}
    className={classes.crossIcon}
  />

  return (
    <Modal
      closePosition="none"
      active={true}
      maxWidth="md"
      className={classes.root}
      injectedClass={{
        inner: classes.inner
      }}
      testId="change-product"
      onClose={onClose}
    >
      {slide === "select" && (
        <SelectPlan
          onSelectPlan={(plan: Product) => {
            setSelectedPlan(plan)
            const currentPrice = currentSubscription?.product?.price?.unit_amount
            const currentRecurrence = currentSubscription?.product.price.recurring.interval
            const newPrice = getPrice(plan, currentRecurrence)
            const isDowngrade = (currentPrice || 0) > newPrice

            isDowngrade
              ? setSlide("downgradeDetails")
              : setSlide("planDetails")
          }}
          plans={plans}
          closeIcon={closeIcon}
        />
      )}
      { slide === "downgradeDetails" && selectedPlan && (
        <DowngradeDetails
          goBack={() => {setSlide("select")}}
          goToPlanDetails={() => setSlide("planDetails")}
          shouldCancelPlan={didSelectFreePlan}
          plan={selectedPlan}
          closeIcon={closeIcon}
          onClose={onClose}
        />
      )}
      {slide === "planDetails" && selectedPlan && (
        <PlanDetails
          plan={selectedPlan}
          goToSelectPlan={() => {
            setSlide("select")
          }}
          onSelectPlanPrice={(planPrice: ProductPrice) => {
            setSelectedPrice(planPrice)
            setSlide("paymentMethod")
          }}
          closeIcon={closeIcon}
        />
      )}
      {slide === "paymentMethod" && (
        <PaymentMethod
          goBack={() => {
            setSlide("planDetails")
          }}
          onSelectPaymentMethod={() => {
            setSlide("confirmPlan")
          }}
          closeIcon={closeIcon}
        />
      )}
      {slide === "confirmPlan" && selectedPlan && selectedPrice && (
        <ConfirmPlan
          plan={selectedPlan}
          planPrice={selectedPrice}
          goToSelectPlan={() => {
            setSlide("select")
          }}
          goToPlanDetails={() => {
            setSlide("planDetails")
          }}
          goToPaymentMethod={() => {
            setSlide("paymentMethod")
          }}
          loadingChangeSubscription={isLoadingChangeSubscription}
          onChangeSubscription={handleChangeSubscription}
          isSubscriptionError={isSubscriptionError}
          closeIcon={closeIcon}
        />
      )}
      {slide === "planSuccess" && selectedPlan && selectedPrice && (
        <PlanSuccess
          onClose={onClose}
          plan={selectedPlan}
          planPrice={selectedPrice}
        />
      )}
    </Modal>
  )
}

export default ChangeProductModal