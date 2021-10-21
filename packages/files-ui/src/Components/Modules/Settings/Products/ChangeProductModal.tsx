import React, { useEffect, useState } from "react"
import { makeStyles, createStyles } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../Themes/types"
import clsx from "clsx"
import { Modal } from "@chainsafe/common-components"
import SelectPlan from "./ChangeProductViews/SelectPlan"

const useStyles = makeStyles(({ constants, palette, typography }: CSFTheme) =>
  createStyles({
    root:  {
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

  const [newPlan, setNewPlan] = useState<string | undefined>()

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
      className={classes.root}
    >
      {
        slide === "select" && <SelectPlan
          className={clsx(classes.slide, className)}
          close={close}
          next={(id: string) => {
            setNewPlan(id)
            setSlide("confirm")
          }}
        />
      }
    </Modal>
  )
}

export default ChangeProductModal