import React from "react"
import clsx from "clsx"
import {
  ITheme,
  makeStyles,
  createStyles,
  useOnClickOutside,
} from "@chainsafe/common-themes"

interface IStyleProps {
  size: number
}

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: (props: IStyleProps) => ({
      backgroundColor: theme.palette.background.default,
      border: "1px solid",
      borderColor: theme.palette["gray"][4],
      position: "fixed",
      "&.top": {
        opacity: 0,
        top: 0,
        left: 0,
        height: `${props.size}px`,
        width: `100%`,
        visibility: "hidden",
        transition: `all ${theme.animation.transform}ms ease`,
        transform: "translateY(-100%)",
        "&.open": {
          opacity: 1,
          visibility: "visible",
          transform: "translateY(0)",
        },
      },
      "&.right": {
        opacity: 0,
        right: 0,
        top: 0,
        height: "100%",
        width: `${props.size}px`,
        visibility: "hidden",
        transition: `all ${theme.animation.transform}ms ease`,
        transform: "translateX(100%)",
        "&.open": {
          opacity: 1,
          visibility: "visible",
          transform: "translateX(0)",
        },
      },
      "&.bottom": {
        opacity: 0,
        bottom: 0,
        left: 0,
        height: `${props.size}px`,
        width: `100%`,
        visibility: "hidden",
        transition: `all ${theme.animation.transform}ms ease`,
        transform: "translateY(100%)",
        "&.open": {
          opacity: 1,
          visibility: "visible",
          transform: "translateY(0)",
        },
      },
      "&.left": {
        opacity: 0,
        left: 0,
        top: 0,
        height: "100%",
        width: `${props.size}px`,
        visibility: "hidden",
        transition: `all ${theme.animation.transform}ms ease`,
        transform: "translateX(-100%)",
        "&.open": {
          opacity: 1,
          visibility: "visible",
          transform: "translateX(0)",
        },
      },
    }),
    backdrop: {
      transition: `all ${theme.animation.transform}ms`,
      "&.open": {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.25,
        background: theme.palette["gray"][6],
        "&.transparent": {
          background: "transparent",
        },
      },
    },
  }),
)

export type Position = "top" | "bottom" | "right" | "left"

export interface IDrawerProps {
  children: React.ReactNode | React.ReactNode[]
  className?: string
  open: boolean
  position?: Position
  size?: number
  backdrop?: boolean
  onClose?(): void
}

const SIZE = 360

const Drawer: React.FC<IDrawerProps> = ({
  children,
  className,
  position = "left",
  open,
  size = SIZE,
  backdrop = true,
  onClose,
}: IDrawerProps) => {
  const classes = useStyles({ size })

  const drawerRef = React.useRef(null)

  if (onClose) {
    useOnClickOutside(drawerRef, onClose)
  }

  return (
    <div>
      <div
        className={clsx(
          classes.backdrop,
          open && "open",
          !backdrop && "transparent",
        )}
      />
      <div
        className={clsx(className, classes.root, position, open && "open")}
        ref={drawerRef}
      >
        {children}
      </div>
    </div>
  )
}

export default Drawer
