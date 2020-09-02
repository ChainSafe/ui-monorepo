import React from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"
import { CheckCircle, CloseCircle, InfoCircle, CrossOutlined } from "../Icons"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      padding: `${theme.constants.generalUnit}px`,
    },
    message: {
      color: theme.palette.text.primary,
      fontSize: 16,
      margin: 0,
    },
    description: {
      color: theme.palette.text.secondary,
      fontSize: 12,
      margin: 0,
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
    },
  }),
)

export type ToasterMessageType = "success" | "error" | "warning"

export interface IToasterMessageProps {
  type?: ToasterMessageType
  message: string
  description?: string
  className?: string
  onClose?: () => void
}

const ToasterMessage: React.FC<IToasterMessageProps> = ({
  type = "error",
  message,
  description,
  className,
  onClose,
}: IToasterMessageProps) => {
  if (!open) return null
  const classes = useStyles()

  return (
    <div className={clsx(classes.root, className)}>
      {type === "success" ? (
        <CheckCircle color="success" />
      ) : type === "error" ? (
        <CloseCircle color="error" />
      ) : (
        <InfoCircle color="secondary" />
      )}
      <div>
        <p className={classes.message}>{message}</p>
        {description && <p className={classes.description}>{description}</p>}
      </div>
      <button onClick={onClose} className={classes.closeButton}>
        <CrossOutlined fontSize="small" />
      </button>
    </div>
  )
}

export default ToasterMessage
