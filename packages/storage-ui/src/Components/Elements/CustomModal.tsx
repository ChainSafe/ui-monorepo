import { IModalProps, Modal } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { ReactNode } from "react"
import clsx from "clsx"
import { CSSTheme } from "../../Themes/types"

const useStyles = makeStyles(({ constants, breakpoints }: CSSTheme) =>
  createStyles({
    root: {
      "&:before": {
        backgroundColor: constants.modalDefault.fadeBackground
      }
    },
    inner: {
      backgroundColor: constants.modalDefault.backgroundColor,
      color: constants.modalDefault.color,
      width: "100%"
    },
    mobileStickyBottom: {
      [breakpoints.down("md")]: {
        position: "fixed",
        top: "unset",
        bottom: 0,
        left: 0,
        width: "100% !important",
        transform: "unset"
      }
    },
    closeIcon : {
      "& svg": {
        stroke: constants.modalDefault.closeIconColor
      }
    }
  })
)

interface ICustomModal extends IModalProps {
  children: ReactNode
  className?: string
  testId?: string
  mobileStickyBottom?: boolean
}

const CustomModal = ({ className, children, injectedClass, mobileStickyBottom = true, ...rest }: ICustomModal) => {
  const classes = useStyles()

  return (
    <Modal
      className={clsx(classes.root, className)}
      injectedClass={{
        closeIcon: clsx(classes.closeIcon, injectedClass?.closeIcon),
        inner: clsx(classes.inner, mobileStickyBottom ? classes.mobileStickyBottom : undefined, injectedClass?.inner),
        subModalInner: injectedClass?.subModalInner
      }}
      {...rest}
    >
      {children}
    </Modal>
  )
}

export default CustomModal
