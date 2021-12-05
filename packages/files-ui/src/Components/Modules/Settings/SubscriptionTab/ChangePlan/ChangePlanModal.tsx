import React, { useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Modal } from "@chainsafe/common-components"
import SelectPlan from "./SelectPlan"
import PlanDetails from "./PlanDetails"
import PaymentMethod from "./PaymentMethod"
import ConfirmPlan from "./ConfirmPlan"
import { useBilling } from "../../../../../Contexts/BillingContext"
import { Product, ProductPrice } from "@chainsafe/files-api-client"
import PlanSuccess from "./PlanSuccess"
import ConfirmDowngrade from "./ConfirmDowngrade"

const useStyles = makeStyles(({ constants, breakpoints }: CSFTheme) =>
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
    }
  })
)

type ChangeModalSlides = "select" |
"planDetails"  |
"paymentMethod" |
"confirmPlan" |
"planSuccess" |
"confirmDowngrade"

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
  // console.log("currentSubscription", currentSubscription)

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
    >
      {slide === "select" && (
        <SelectPlan
          onClose={onClose}
          onSelectPlan={(plan: Product) => {
            setSelectedPlan(plan)
            const currentPrice = currentSubscription?.product?.price?.unit_amount
            const currentRecurrence = currentSubscription?.product.price.recurring.interval
            const comparisonPrice = plan.prices.find(price => price?.recurring?.interval === currentRecurrence)?.unit_amount || 0
            const isDowngrade = (currentPrice || 0) > comparisonPrice

            console.log("isDowngrade", isDowngrade)
            isDowngrade
              ? setSlide("confirmDowngrade")
              : setSlide("planDetails")
          }}
          plans={plans}
        />
      )}
      { slide === "confirmDowngrade" && selectedPlan && (
        <ConfirmDowngrade
          goToSelectPlan={() => {
            setSlide("select")
          }}
          plans={plans}
          plan={selectedPlan}
          onClose={onClose}
        />
      )}
      {slide === "planDetails" && selectedPlan && (
        <PlanDetails
          plan={selectedPlan}
          onClose={onClose}
          goToSelectPlan={() => {
            setSlide("select")
          }}
          onSelectPlanPrice={(planPrice: ProductPrice) => {
            setSelectedPrice(planPrice)
            setSlide("paymentMethod")
          }}
        />
      )}
      {slide === "paymentMethod" && (
        <PaymentMethod
          onClose={onClose}
          goToSelectPlan={() => {
            setSlide("select")
          }}
          goToPlanDetails={() => {
            setSlide("planDetails")
          }}
          onSelectPaymentMethod={() => {
            setSlide("confirmPlan")
          }}
        />
      )}
      {slide === "confirmPlan" && selectedPlan && selectedPrice && (
        <ConfirmPlan
          plan={selectedPlan}
          planPrice={selectedPrice}
          onClose={onClose}
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