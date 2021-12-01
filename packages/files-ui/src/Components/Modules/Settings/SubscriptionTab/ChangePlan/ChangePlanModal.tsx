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

const useStyles = makeStyles(({ constants, breakpoints }: CSFTheme) =>
  createStyles({
    inner: {
      borderRadius: `${constants.generalUnit / 2}px`,
      [breakpoints.up("sm")]: {
        minWidth: 480
      }
    },
    slide: {
      borderRadius: constants.generalUnit / 2,
      padding: `0 ${constants.generalUnit * 3}px`
    }
  })
)

interface IChangeProductModal {
  onClose: () => void
}

const ChangeProductModal = ({ onClose }: IChangeProductModal) => {
  const classes = useStyles()
  const { getAvailablePlans, changeSubscription } = useBilling()
  const [selectedPlan, setSelectedPlan] = useState<Product | undefined>()
  const [selectedPrice, setSelectedPrice] = useState<ProductPrice | undefined>()
  const [slide, setSlide] = useState<"select" | "planDetails" |  "paymentMethod" | "confirmPlan">("select")
  const [plans, setPlans] = useState<Product[] | undefined>()
  const [isLoadingChangeSubscription, setIsLoadingChangeSubscription] = useState(false)

  useEffect(() => {
    if(!plans) {
      getAvailablePlans()
        .then((plans) => setPlans(plans))
        .catch(console.error)
    }
  })

  const handleChangeSubscription = () => {
    if (selectedPrice) {
      setIsLoadingChangeSubscription(true)
      changeSubscription(selectedPrice.id)
        .then(onClose)
        .catch(console.error)
        .finally(() => setIsLoadingChangeSubscription(false))
    }
  }

  return (
    <Modal
      closePosition="none"
      active={true}
      maxWidth="md"
      injectedClass={{
        inner: classes.inner
      }}
      testId="change-product"
    >
      {
        slide === "select" ? <SelectPlan
          className={classes.slide}
          onClose={onClose}
          onSelectPlan={(plan: Product) => {
            setSelectedPlan(plan)
            setSlide("planDetails")
          }}
          plans={plans}
        /> : slide === "planDetails" && selectedPlan ? <PlanDetails plan={selectedPlan}
          onClose={onClose}
          goToSelectPlan={() => {
            setSlide("select")
          }}
          onSelectPlanPrice={(planPrice: ProductPrice) => {
            setSelectedPrice(planPrice)
            setSlide("paymentMethod")
          }}
        /> : slide === "paymentMethod" ? <PaymentMethod onClose={onClose}
          goToSelectPlan={() => {
            setSlide("select")
          }}
          goToPlanDetails={() => {
            setSlide("planDetails")
          }}
          onSelectPaymentMethod={() => {
            setSlide("confirmPlan")
          }}
        /> : slide === "confirmPlan" && selectedPlan && selectedPrice ? <ConfirmPlan
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
        /> : null
      }
    </Modal>
  )
}

export default ChangeProductModal