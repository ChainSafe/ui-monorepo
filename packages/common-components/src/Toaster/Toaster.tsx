import React, { ReactNode, useEffect } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    toast: {
      position: "fixed",
      transitionDuration: `${theme.animation.transform}ms`,
      transitionProperty: "opacity, top, left, right, bottom, transform",
      opacity: 0,
    },
    topRight: {
      top: `${theme.constants.generalUnit * 2}px`,
      right: 0,
      transform: "translate(100%,0)",
      "&.open": {
        right: `${theme.constants.generalUnit * 2}px`,
        transform: "translate(0,0)",
        opacity: 1,
      },
    },
    topLeft: {
      top: `${theme.constants.generalUnit * 2}px`,
      left: 0,
      transform: "translate(-100%,0)",
      "&.open": {
        transform: "translate(0,0)",
        left: `${theme.constants.generalUnit * 2}px`,
        opacity: 1,
      },
    },
    bottomRight: {
      bottom: `${theme.constants.generalUnit * 2}px`,
      right: 0,
      transform: "translate(100%,0)",
      "&.open": {
        right: `${theme.constants.generalUnit * 2}px`,
        transform: "translate(0,0)",
        opacity: 1,
      },
    },
    bottomLeft: {
      bottom: `${theme.constants.generalUnit * 2}px`,
      left: 0,
      transform: "translate(-100%,0)",
      "&.open": {
        left: `${theme.constants.generalUnit * 2}px`,
        transform: "translate(0,0)",
        opacity: 1,
      },
    },
  }),
)

export type ToasterPosition =
  | "topRight"
  | "topLeft"
  | "bottomRight"
  | "bottomLeft"

export interface IToasterProps {
  children?: ReactNode | ReactNode[]
  open: boolean
  className?: string
  position?: ToasterPosition
  openDuration?: number
  onClose?(): void
  keepOpen?: boolean
}

const Toaster: React.FC<IToasterProps> = ({
  className,
  open,
  children,
  position = "topRight",
  openDuration = 3000,
  onClose,
  keepOpen,
}: IToasterProps) => {
  const classes = useStyles()

  useEffect(() => {
    if (open && !keepOpen) {
      const timer = setTimeout(() => {
        onClose ? onClose() : null
      }, openDuration)
      return () => clearTimeout(timer)
    }
    return
  }, [open])

  return (
    <div
      className={clsx(
        classes.toast,
        className,
        classes[position],
        open && "open",
      )}
    >
      {children}
    </div>
  )
}

export default Toaster
