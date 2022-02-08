import React, { useCallback, useEffect, useMemo, useState } from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Modal } from "@chainsafe/common-components"
import SelectPlan from "./SelectPlan"
import PlanDetails from "./PlanDetails"
import PaymentMethodSelector from "./PaymentMethodSelector"
import ConfirmPlan from "../Common/ConfirmPlan"
import { useBilling } from "../../../../../Contexts/BillingContext"
import { Product, ProductPrice, ProductPriceRecurringInterval } from "@chainsafe/files-api-client"
import PlanSuccess from "./PlanSuccess"
import DowngradeDetails from "./DowngradeDetails"
import { PaymentMethod } from "../../../../../Contexts/BillingContext"
import CryptoPayment from "../Common/CryptoPayment"
import { formatSubscriptionError } from "../utils/formatSubscriptionError"

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
"downgradeDetails" |
"cryptoPayment"

const getPrice = (plan: Product, recurrence?: ProductPriceRecurringInterval) => {
  return plan.prices.find(price => price?.recurring?.interval === recurrence)?.unit_amount || 0
}

interface IChangeProductModal {
  onClose: () => void
}

const ChangeProductModal = ({ onClose }: IChangeProductModal) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()
  const { getAvailablePlans, changeSubscription, currentSubscription, isPendingInvoice } = useBilling()
  const [selectedPlan, setSelectedPlan] = useState<Product | undefined>()
  const [selectedPrice, setSelectedPrice] = useState<ProductPrice | undefined>()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | undefined>()
  const [slide, setSlide] = useState<ChangeModalSlides | undefined>()
  const [plans, setPlans] = useState<Product[] | undefined>()
  const [isLoadingChangeSubscription, setIsLoadingChangeSubscription] = useState(false)
  const [subscriptionErrorMessage, setSubscriptionErrorMessage] = useState<string | undefined>()
  const didSelectFreePlan = useMemo(() => !!selectedPlan && getPrice(selectedPlan, "month") === 0, [selectedPlan])
  const monthlyPrice = useMemo(() => selectedPlan?.prices.find((price) => price.recurring.interval === "month"), [selectedPlan])
  const yearlyPrice = useMemo(() => selectedPlan?.prices.find((price) => price.recurring.interval === "year"), [selectedPlan])
  const [billingPeriod, setBillingPeriod] = useState<ProductPriceRecurringInterval | undefined>()

  useEffect(() => {
    if(selectedPlan && !billingPeriod){
      setBillingPeriod(monthlyPrice ? "month" : "year")
    }
  }, [billingPeriod, monthlyPrice, selectedPlan])

  useEffect(() => {
    if(!slide){
      setSlide(isPendingInvoice
        ? "cryptoPayment"
        : "select"
      )
    }
  }, [isPendingInvoice, slide])

  useEffect(() => {
    if(!plans) {
      getAvailablePlans()
        .then((plans) => setPlans(plans))
        .catch(console.error)
    }
  }, [getAvailablePlans, plans])

  const handleChangeSubscription = useCallback(() => {
    if (selectedPrice) {
      setIsLoadingChangeSubscription(true)
      setSubscriptionErrorMessage(undefined)
      changeSubscription(selectedPrice.id)
        .then(() => {
          setSlide("planSuccess")
        })
        .catch((e) => {
          const errorMessage = formatSubscriptionError(e)
          setSubscriptionErrorMessage(errorMessage)
        })
        .finally(() => setIsLoadingChangeSubscription(false))
    }
  }, [changeSubscription, selectedPrice])

  const onSelectPlanPrice = useCallback(() => {
    if(billingPeriod === "month" && monthlyPrice) {
      setSelectedPrice(monthlyPrice)
    } else if (yearlyPrice) {
      setSelectedPrice(yearlyPrice)
    }
    setSlide("paymentMethod")
  }, [billingPeriod, monthlyPrice, yearlyPrice])

  const onSelectPlan = useCallback((plan: Product) => {
    setSelectedPlan(plan)
    const currentPrice = currentSubscription?.product?.price?.unit_amount
    const currentRecurrence = currentSubscription?.product.price.recurring.interval
    const newPrice = getPrice(plan, currentRecurrence)
    const isDowngrade = (currentPrice || 0) > newPrice

    isDowngrade
      ? setSlide("downgradeDetails")
      : setSlide("planDetails")
  }, [currentSubscription])

  return (
    <Modal
      closePosition="right"
      active={true}
      maxWidth={desktop ? 800 : undefined}
      width={desktop ? "max-content" : "100%"}
      className={classes.root}
      injectedClass={{
        inner: classes.inner
      }}
      onClose={onClose}
      testId={slide}
    >
      {slide === "select" && (
        <SelectPlan
          onSelectPlan={onSelectPlan}
          plans={plans}
        />
      )}
      { slide === "downgradeDetails" && selectedPlan && (
        <DowngradeDetails
          goBack={() => {setSlide("select")}}
          goToPlanDetails={() => setSlide("planDetails")}
          shouldCancelPlan={didSelectFreePlan}
          plan={selectedPlan}
          onClose={onClose}
        />
      )}
      {slide === "planDetails" && selectedPlan && billingPeriod && (
        <PlanDetails
          plan={selectedPlan}
          goToSelectPlan={() => {
            setBillingPeriod(undefined)
            setSlide("select")
          }}
          onSelectPlanPrice={onSelectPlanPrice}
          onChangeBillingPeriod={setBillingPeriod}
          billingPeriod={billingPeriod}
          monthlyPrice={monthlyPrice}
          yearlyPrice={yearlyPrice}
        />
      )}
      {slide === "paymentMethod" && selectedPrice &&
        <PaymentMethodSelector
          selectedProductPrice={selectedPrice}
          onClose={onClose}
          goBack={() => setSlide("planDetails")}
          onSelectPaymentMethod={(paymentMethod) => {
            setSelectedPaymentMethod(paymentMethod)
            setSlide("confirmPlan")
          }}
        />
      }
      {slide === "confirmPlan" && selectedPlan && selectedPrice && selectedPaymentMethod &&
      <ConfirmPlan
        plan={selectedPlan}
        planPrice={selectedPrice}
        goToSelectPlan={() => {
          setSubscriptionErrorMessage(undefined)
          setSlide("select")}
        }
        goToPaymentMethod={() => {
          setSubscriptionErrorMessage(undefined)
          setSlide("paymentMethod")
        }}
        loadingChangeSubscription={isLoadingChangeSubscription}
        onChangeSubscription={selectedPaymentMethod === "creditCard" ? handleChangeSubscription : () => setSlide("cryptoPayment")}
        subscriptionErrorMessage={subscriptionErrorMessage}
        paymentMethod={selectedPaymentMethod}
      />
      }
      {slide === "cryptoPayment" && <CryptoPayment planPrice={selectedPrice} />}
      {slide === "planSuccess" && selectedPlan && selectedPrice && <PlanSuccess
        onClose={onClose}
        plan={selectedPlan}
        planPrice={selectedPrice}
      />
      }
    </Modal>
  )
}

export default ChangeProductModal