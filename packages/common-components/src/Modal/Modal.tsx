import React, { ReactNode, useRef } from "react"
import { ITheme, useOnClickOutside, makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { CloseSvg } from "../Icons/icons/Close.icon"

const useStyles = makeStyles(
  ({ animation, constants, breakpoints, palette, overrides, zIndex }: ITheme) =>
    createStyles({
      // JSS in CSS goes here
      root: {
        position: "fixed",
        zIndex: zIndex?.layer3,
        bottom: 0,
        left: 0,
        width: "100%",
        height: "100%",
        maxHeight: "100%",
        opacity: 0,
        visibility: "hidden",
        display: "flex",
        flexDirection: "column",
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        transitionDuration: `${animation.transform}ms`,
        transitionProperty: "opacity",
        "&.closable": {
          "&:before": {
            cursor: "pointer"
          }
        },
        "&:before": {
          content: "''",
          display: "block",
          width: "100%",
          height: "100%",
          position: "absolute",
          opacity: constants.modal?.backgroundFade,
          top: 0,
          left: 0,
          zIndex: 0,
          backgroundColor: palette.common?.black.main,
          transitionDuration: `${animation.transform}ms`
        },
        "& > *": {
          opacity: 0,
          visibility: "hidden",
          transitionDuration: `${animation.transform}ms`
        },
        "&.active": {
          visibility: "visible",
          opacity: 1,
          "& > *": {
            opacity: 1,
            visibility: "visible"
          },
          ...overrides?.Modal?.active
        },
        ...overrides?.Modal?.root
      },
      inner: {
        ...constants.modal.inner,
        flexGrow: 1,
        flexDirection: "column",
        display: "flex",
        backgroundColor: palette.common?.white.main,
        top: "50%",
        left: "50%",
        position: "absolute",
        borderRadius: `${constants.generalUnit / 2}`,
        transform: "translate(-50%, -50%)",
        "&.xs": {
          width: `calc(100% - ${constants.generalUnit * 2}px)`,
          maxWidth: breakpoints.width("xs"),
          ...overrides?.Modal?.inner?.size?.xs
        },
        "&.sm": {
          width: `calc(100% - ${constants.generalUnit * 2}px)`,
          maxWidth: breakpoints.width("sm"),
          ...overrides?.Modal?.inner?.size?.sm
        },
        "&.md": {
          width: `calc(100% - ${constants.generalUnit * 2}px)`,
          maxWidth: breakpoints.width("md"),
          ...overrides?.Modal?.inner?.size?.md
        },
        "&.lg": {
          width: `calc(100% - ${constants.generalUnit * 2}px)`,
          maxWidth: breakpoints.width("lg"),
          ...overrides?.Modal?.inner?.size?.lg
        },
        "&.xl": {
          width: `calc(100% - ${constants.generalUnit * 2}px)`,
          maxWidth: breakpoints.width("lg"),
          ...overrides?.Modal?.inner?.size?.xl
        },
        ...overrides?.Modal?.inner?.root
      },
      closeIcon: {
        ...constants.icon,
        borderRadius: "50%",
        display: "block",
        top: 0,
        backgroundColor: palette.common?.white.main,
        cursor: "pointer",
        position: "absolute",
        "& svg": {
          height: 15,
          width: 15
        },
        "&.right": {
          transform: "translate(50%, -50%)",
          right: 0,
          ...overrides?.Modal?.closeIcon?.right
        },
        "&.left": {
          left: 0,
          transform: "translate(-50%, -50%)",
          ...overrides?.Modal?.closeIcon?.left
        },
        "&.none": {
          display: "none"
        },
        ...overrides?.Modal?.closeIcon?.root
      }
    })
)

interface IModalClasses {
  inner?: string
  close?: string
}

interface IModalProps {
  className?: string
  active: boolean
  setActive?: (state: boolean) => void
  injectedClass?: IModalClasses
  closePosition?: "left" | "right" | "none"
  children?: ReactNode | ReactNode[]
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | number
  onModalBodyClick?: (e: React.MouseEvent) => void
}

const Modal: React.FC<IModalProps> = ({
  children,
  className,
  closePosition = "right",
  injectedClass,
  active = false,
  setActive,
  maxWidth = "sm",
  onModalBodyClick
}: IModalProps) => {
  const classes = useStyles()

  const ref = useRef(null)

  const handleClose = () => {
    if (active && setActive) {
      setActive(false)
    }
  }

  useOnClickOutside(ref, () => handleClose())

  return active ? (
    <article
      className={clsx(
        classes.root,
        className && `${className}`,
        setActive ? "closable" : "",
        active ? "active" : "closed"
      )}
      onClick={onModalBodyClick}
    >
      <section
        ref={ref}
        style={
          maxWidth && typeof maxWidth == "number"
            ? {
              width: "100%",
              maxWidth: maxWidth
            }
            : {}
        }
        className={clsx(
          classes.inner,
          injectedClass?.inner,
          typeof maxWidth != "number" ? maxWidth : ""
        )}
      >
        {setActive && (
          <div
            onClick={() => handleClose()}
            className={clsx(
              classes.closeIcon,
              injectedClass?.close,
              `${closePosition}`
            )}
          >
            <CloseSvg />
          </div>
        )}
        {children}
      </section>
    </article>
  ) : null
}

export default Modal

export { IModalProps }
