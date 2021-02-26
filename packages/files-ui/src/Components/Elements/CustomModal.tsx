import { IModalProps, Modal } from "@chainsafe/common-components"
import { createStyles, fade, ITheme, makeStyles } from "@chainsafe/common-theme"
import React, { ReactNode } from "react"
import clsx from "clsx"
import { UI_COLORS } from "../../Themes/Constants"

const useStyles = makeStyles(({ constants, breakpoints, palette }: ITheme) =>
  createStyles({
    root: {
      "&:before": {
        backgroundColor: fade((constants as UI_COLORS).modalDefault.fadebackground, 0.9)
      },
      [breakpoints.down("md")]: {
       
      },
    },
    inner: {
      [breakpoints.down("md")]: {
        backgroundColor: (constants as UI_COLORS).modalDefault.background,
        top: "unset",
        bottom: 0,
        left: 0,
        width: "100% !important",
        transform: "unset",
        borderRadiusLeftTop: `${constants.generalUnit * 1.5}px`,
        borderRadiusRightTop: `${constants.generalUnit * 1.5}px`,
        borderRadiusLeftBottom: 0,
        borderRadiusRightBottom: 0,
      },
    },
    close: {
      [breakpoints.down("md")]: {},
    },
  }),
)

interface ICustomModal extends IModalProps {
  children: ReactNode
  className?: string
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
        close: clsx(classes.close, injectedClass?.close),
        inner: clsx(classes.inner, injectedClass?.inner),
      }}
      {...rest}
    >
      {children}
    </Modal>
  )
}

export default CustomModal
