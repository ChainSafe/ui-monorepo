import React, { ReactNode, useEffect, useRef } from "react"
import { ITheme, useOnClickOutside, makeStyles, createStyles } from "@chainsafe/common-theme"
import clsx from "clsx"
import { CloseSvg } from "../Icons/icons/Close.icon"

const useStyles = makeStyles(
  ({ animation, constants, breakpoints, palette, overrides, zIndex }: ITheme) =>
    createStyles({
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
          zIndex: 2500,
          "& > *": {
            opacity: 1,
            visibility: "visible"
          },
          ...overrides?.Modal?.active
        },
        ...overrides?.Modal?.root
      },
      modalSection: {
        ...constants.modal.inner,
        backgroundColor: palette.common?.white.main,
        zIndex: 1,
        "&.subModal": {
          marginTop: "0.5rem"
        }
      },
      closeIcon: {
        ...constants.icon,
        width: 15,
        height: 15,
        display: "block",
        top: 0,
        cursor: "pointer",
        position: "absolute",
        zIndex: 2,
        "& svg": {
          stroke: palette.common?.black.main
        },
        "&.right": {
          transform: "translate(-50%, 50%)",
          top: 4,
          right: 4,
          ...overrides?.Modal?.closeIcon?.right
        },
        "&.left": {
          left: 4,
          top: 4,
          transform: "translate(50%, -50%)",
          ...overrides?.Modal?.closeIcon?.left
        },
        "&.none": {
          display: "none"
        },
        ...overrides?.Modal?.closeIcon?.root
      },
      wrapper : {
        position: "relative",
        flexDirection: "column",
        display: "flex",
        margin: "auto",
        maxHeight: "100%",
        overflow: "auto",
        alignItems: "center",
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
      }
    })
)

interface IModalClasses {
  inner?: string
  closeIcon?: string
  subModalInner?: string
}

interface IModalProps {
  className?: string
  active?: boolean
  injectedClass?: IModalClasses
  closePosition?: "left" | "right" | "none"
  children?: ReactNode | ReactNode[]
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | number
  width?: string
  onModalBodyClick?: (e: React.MouseEvent) => void
  onClickOutside?: (e?: React.MouseEvent) => void
  testId?: string
  onClose?: () => void
  subModal?: ReactNode | ReactNode[]
}

interface IModalBaseProps {
  children?: ReactNode | ReactNode[]
  injectedClassInner?: string
}

const ModalBase = ({ children, injectedClassInner }: IModalBaseProps) => {
  const classes = useStyles()

  return (
    <section
      className={clsx(
        classes.modalSection,
        injectedClassInner
      )}
    >
      {children}
    </section>
  )
}

const Modal = ({
  children,
  className = "",
  closePosition = "right",
  injectedClass,
  active = false,
  maxWidth = "sm",
  width,
  onModalBodyClick,
  testId,
  onClose,
  onClickOutside,
  subModal
}: IModalProps) => {
  const classes = useStyles()
  const ref = useRef(null)

  useEffect(() => {
    if(!active) return

    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [active])

  const handleClose = () => {
    onClose && onClose()
  }

  useOnClickOutside(ref, () => onClickOutside && onClickOutside())

  if (!active) return null

  return (
    <article
      className={clsx(classes.root, className, "active")}
      onClick={onModalBodyClick}
      ref={ref}
    >
      <section
        data-testId={`modal-container-${testId}`}
        style={
          maxWidth && typeof maxWidth == "number"
            ? {
              width: width || "100%",
              maxWidth: maxWidth
            }
            : {}
        }
        className={clsx(classes.wrapper, typeof maxWidth != "number" ? maxWidth : "")}
      >
        {closePosition !== "none" && (
          <div
            onClick={handleClose}
            className={clsx(classes.closeIcon, injectedClass?.closeIcon, closePosition)}
          >
            <CloseSvg />
          </div>
        )}
        <ModalBase injectedClassInner={injectedClass?.inner}>
          {children}
        </ModalBase>
        {subModal && (
          <ModalBase injectedClassInner={clsx(injectedClass?.subModalInner, "subModal")}>
            {subModal}
          </ModalBase>
        )}
      </section>
    </article>
  )
}

export default Modal

export { IModalProps }
