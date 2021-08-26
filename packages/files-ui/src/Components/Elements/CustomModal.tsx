import { IModalProps, Modal } from "@chainsafe/common-components"
import { createStyles, makeStyles } from "@chainsafe/common-theme"
import React, { ReactNode } from "react"
import clsx from "clsx"
import { CSFTheme } from "../../Themes/types"

const useStyles = makeStyles(({ constants, breakpoints }: CSFTheme) =>
  createStyles({
    root: {
      "&:before": {
        backgroundColor: constants.modalDefault.fadeBackground
      }
    },
    inner: {
      backgroundColor: constants.modalDefault.backgroundColor,
      color: constants.modalDefault.color,
      [breakpoints.down("md")]: {
        top: "unset",
        bottom: 0,
        left: 0,
        width: "100% !important",
        transform: "unset",
        borderRadiusLeftTop: `${constants.generalUnit * 1.5}px`,
        borderRadiusRightTop: `${constants.generalUnit * 1.5}px`,
        borderRadiusLeftBottom: 0,
        borderRadiusRightBottom: 0
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
}

const CustomModal: React.FC<ICustomModal> = ({
  className,
  children,
  injectedClass,
  ...rest
}: ICustomModal) => {
  const classes = useStyles()

  return (
    <Modal
      className={clsx(classes.root, className)}
      injectedClass={{
        closeIcon: clsx(classes.closeIcon, injectedClass?.closeIcon),
        inner: clsx(classes.inner, injectedClass?.inner)
      }}
      {...rest}
    >
      {children}
    </Modal>
  )
}

export default CustomModal
