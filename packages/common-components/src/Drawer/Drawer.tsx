import React from "react"
import clsx from "clsx"
import {
  ITheme,
  makeStyles,
  createStyles,
  useOnClickOutside
} from "@chainsafe/common-theme"

interface IStyleProps {
  size: number
}

const useStyles = makeStyles(({ animation, palette, overrides }: ITheme) =>
  createStyles({
    root: (props: IStyleProps) => ({
      backgroundColor: palette.background.default,
      border: "1px solid",
      borderColor: palette.additional["gray"][4],
      position: "fixed",
      opacity: 0,
      visibility: "hidden",
      transition: `all ${animation.transform}ms ease`,
      "&.top": {
        top: 0,
        left: 0,
        height: `${props.size}px`,
        width: "100%",
        transform: "translateY(-100%)",
        "&.open": {
          opacity: 1,
          visibility: "visible",
          transform: "translateY(0)",
          ...overrides?.Drawer?.position?.top?.open
        },
        ...overrides?.Drawer?.position?.top?.root
      },
      "&.right": {
        right: 0,
        top: 0,
        height: "100%",
        width: `${props.size}px`,
        transform: "translateX(100%)",
        "&.open": {
          opacity: 1,
          visibility: "visible",
          transform: "translateX(0)",
          ...overrides?.Drawer?.position?.right?.open
        },
        ...overrides?.Drawer?.position?.right?.root
      },
      "&.bottom": {
        bottom: 0,
        left: 0,
        height: `${props.size}px`,
        width: "100%",
        transform: "translateY(100%)",
        "&.open": {
          opacity: 1,
          visibility: "visible",
          transform: "translateY(0)",
          ...overrides?.Drawer?.position?.bottom?.open
        },
        ...overrides?.Drawer?.position?.bottom?.root
      },
      "&.left": {
        left: 0,
        top: 0,
        height: "100%",
        width: `${props.size}px`,
        transform: "translateX(-100%)",
        "&.open": {
          opacity: 1,
          visibility: "visible",
          transform: "translateX(0)",
          ...overrides?.Drawer?.position?.left?.open
        },
        ...overrides?.Drawer?.position?.left?.root
      },
      ...overrides?.Drawer?.root
    }),
    backdrop: {
      transition: `all ${animation.transform}ms`,
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
        background: palette.additional["gray"][6],
        "&.transparent": {
          background: "transparent",
          ...overrides?.Drawer?.backdrop?.transparent
        },
        ...overrides?.Drawer?.backdrop?.open
      },
      ...overrides?.Drawer?.backdrop?.root
    }
  })
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
  classNames?: {
    backdrop?: string
  }
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
  classNames
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
          classNames?.backdrop,
          open && "open",
          !backdrop && "transparent"
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
