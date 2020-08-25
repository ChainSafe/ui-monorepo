import React, { ReactNode, useRef } from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme, useOnClickOutside } from "@chainsafe/common-themes"
import clsx from "clsx"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      position: "fixed",
      zIndex: 1,
      bottom: 0,
      left: 0,
      width: "100%",
      height: "100%",
      opacity: 0,
      visibility: "hidden",
      maxHeight: 0,
      display: "flex",
      flexDirection: "column",
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      "&.closable": {
        "&:before": {
          cursor: "pointer",
        },
      },
      "&:before": {
        content: "''",
        display: "block",
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 0,
        backgroundColor: theme.palette.common?.black.main,
        opacity: theme.constants.modal?.backgroundFade,
      },
      "&.active": {
        ...theme.constants.modal,
        maxHeight: "100%",
        visibility: "visible",
        opacity: 1,
      },
    },
    inner: {
      ...theme.constants.modal.inner,
      flexGrow: 1,
      flexDirection: "column",
      display: "flex",
      backgroundColor: theme.palette.common?.white.main,
      top: "50%",
      left: "50%",
      position: "absolute",
      transform: "translate(-50%, -50%)",
      "&.xs": {
        width: "100%",
        maxWidth: theme.breakpoints.xs,
      },
      "&.sm": {
        width: "100%",
        maxWidth: theme.breakpoints.sm,
      },
      "&.md": {
        width: "100%",
        maxWidth: theme.breakpoints.md,
      },
      "&.lg": {
        width: "100%",
        maxWidth: theme.breakpoints.lg,
      },
      "&.xl": {
        width: "100%",
        maxWidth: theme.breakpoints.xl,
      },
    },
    closeIcon: {
      ...theme.constants.icon,
      borderRadius: "50%",
      display: "block",
      top: 0,
      backgroundColor: theme.palette.common?.white.main,
      cursor: "pointer",
      position: "absolute",
      "&.right": {
        transform: "translate(50%, -50%)",
        right: 0,
      },
      "&.left": {
        left: 0,
        transform: "translate(-50%, -50%)",
      },
      "&.none": {
        display: "none",
      },
    },
  }),
)

interface IModalProps {
  className?: string
  active: boolean
  setActive?: (state: boolean) => void
  closePosition?: "left" | "right" | "none"
  children?: ReactNode | ReactNode[]
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | number
}

const Modal: React.FC<IModalProps> = ({
  children,
  className,
  closePosition = "right",
  active = false,
  setActive,
  maxWidth = "sm",
}: IModalProps) => {
  const classes = useStyles()

  const ref = useRef(null)

  const handleClose = () => {
    if (active && setActive) {
      setActive(false)
    }
  }

  useOnClickOutside(ref, () => handleClose())

  return (
    <article
      className={clsx(
        classes.root,
        className && `${className}`,
        setActive ? `closable` : "",
        active ? "active" : "closed",
      )}
    >
      <section
        ref={ref}
        style={
          maxWidth && typeof maxWidth == "number"
            ? {
                maxWidth: maxWidth,
              }
            : {}
        }
        className={clsx(
          classes.inner,
          typeof maxWidth != "number" ? maxWidth : "",
        )}
      >
        {setActive && (
          <div
            onClick={() => handleClose()}
            className={clsx(classes.closeIcon, `${closePosition}`)}
          >
            {/* TODO: Close icon replace */}
            close
          </div>
        )}
        {children}
      </section>
    </article>
  )
}

export default Modal

export { IModalProps }
