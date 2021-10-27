import React, { useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import clsx from "clsx"
import { Modal } from "@chainsafe/common-components"
import SelectPlan from "./ChangeProductViews/SelectPlan"
import { useBilling } from "../../../../Contexts/BillingContext"

const useStyles = makeStyles(({ constants }: CSFTheme) =>
  createStyles({
    root:  {
    },
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
  active: boolean
  className?: string
  close: () => void
}

const ChangeProductModal = ({ active, className, close }: IChangeProductModal) => {
  const classes = useStyles()

  const { changeSubscription } = useBilling()

  const [slide, setSlide] = useState<"select" | "confirm">("select")

  useEffect(() => {
    if (!active && slide !== "select") {
      setSlide("select")
    }
  }, [active, slide])

  return (
    <Modal
      closePosition="none"
      active={active}
      maxWidth="md"
      className={classes.root}
      injectedClass={{
        inner: classes.inner
      }}
      testId="change-product"
    >
      {
        slide === "select" && <SelectPlan
          className={clsx(classes.slide, className)}
          close={close}
          next={(productId: string, priceId: string) => {
            // setSlide("confirm")
            changeSubscription(productId, priceId)
              .then(() => close())
              .catch(console.error)
          }}
        />
      }
    </Modal>
  )
}

export default ChangeProductModal