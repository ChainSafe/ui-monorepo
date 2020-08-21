import React, { ReactNode, useRef, useState, useEffect } from "react"
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
        opacity: theme.constants.modal.backgroundFade,
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
  active?: boolean
  canClose?: boolean
  closePosition?: "left" | "right" | "none"
  children?: ReactNode | ReactNode[]
}

const Modal: React.FC<IModalProps> = ({
  children,
  className,
  canClose = true,
  closePosition = "right",
  active = false,
}: IModalProps) => {
  const classes = useStyles()

  const [activeInternal, setActive] = useState<boolean>()
  const ref = useRef(null)
  useOnClickOutside(ref, () => {
    if (activeInternal && canClose) {
      setActive(false)
    }
  })

  useEffect(() => {
    setActive(active)
  }, [active])

  return (
    <article
      ref={ref}
      className={clsx(
        classes.root,
        className && `${className}`,
        canClose ? `closable` : "",
        activeInternal ? "active" : "closed",
      )}
    >
      <section className={classes.inner}>
        {canClose && (
          <div
            onClick={() => setActive(false)}
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
