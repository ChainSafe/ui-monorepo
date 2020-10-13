import { IModalProps, Modal } from "@imploy/common-components"
import { createStyles, ITheme, makeStyles } from "@imploy/common-themes"
import React, { ReactNode } from "react"
import clsx from "clsx"

const useStyles = makeStyles(({ breakpoints, palette }: ITheme) =>
  createStyles({
    root: {
      [breakpoints.down("sm")]: {
        "&:before": {},
      },
    },
    inner: {
      [breakpoints.down("sm")]: {
        backgroundColor: palette.additional["gray"][3],
        top: "unset",
        bottom: 0,
        left: 0,
        width: "100% !important",
        transform: "unset",
      },
    },
    close: {
      [breakpoints.down("sm")]: {},
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
