import React from "react"
import { makeStyles, createStyles, useThemeSwitcher } from "@chainsafe/common-theme"
import { CSFTheme } from "../../../../../Themes/types"
import { Modal } from "@chainsafe/common-components"
import CryptoPayment from "../Common/CryptoPayment"

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

interface IChangeProductModal {
  onClose: () => void
}

const PayInvoiceModal = ({ onClose }: IChangeProductModal) => {
  const classes = useStyles()
  const { desktop } = useThemeSwitcher()

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
      testId="pay-invoice"
      onClose={onClose}
    >
      <CryptoPayment />
    </Modal>
  )
}

export default PayInvoiceModal