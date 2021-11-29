import React, { useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import { Modal } from "@chainsafe/common-components"
import SelectPlan from "./SelectPlan"
import PlanDetails from "./Subscribe"
import { useBilling } from "../../../../Contexts/BillingContext"
import { Product } from "@chainsafe/files-api-client"

const useStyles = makeStyles(({ constants }: CSFTheme) =>
  createStyles({
    inner: {
      borderRadius: `${constants.generalUnit / 2}px`
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
  const { getAvailablePlans } = useBilling()
  const [selectedPlan, setSelectedPlan] = useState<Product | undefined>()
  const [slide, setSlide] = useState<"select" | "subscribe">("select")
  const [plans, setPlans] = useState<Product[] | undefined>()

  useEffect(() => {
    if(!plans) {
      getAvailablePlans()
        .then((plans) => setPlans(plans))
        .catch(console.error)
    }
  })

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
            setSlide("subscribe")
          }}
          plans={plans}
        /> : slide === "subscribe" && selectedPlan ? <PlanDetails plan={selectedPlan} /> : null
      }
    </Modal>
  )
}

export default ChangeProductModal