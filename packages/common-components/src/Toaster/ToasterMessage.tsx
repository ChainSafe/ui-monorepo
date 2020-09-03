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
      boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.25)",
      borderRadius: 4,
      padding: `${theme.constants.generalUnit * 2}px`,
    },
    typeIcon: {
      marginRight: `${theme.constants.generalUnit * 2}px`,
    },
    messageContainer: {
      maxWidth: 300,
    },
    message: {
      ...theme.typography.body1,
      color: theme.palette.text.primary,
      fontSize: 16,
      margin: 0,
    },
    description: {
      ...theme.typography.body2,
      color: theme.palette.text.secondary,
      fontSize: 12,
      margin: 0,
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
    },
    closeIcon: {
      fontSize: `${theme.constants.generalUnit * 1.5}px`,
      fill: theme.palette["gray"][6],
      marginLeft: `${theme.constants.generalUnit * 2}px`,
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
        <CheckCircle color="success" className={classes.typeIcon} />
      ) : type === "error" ? (
        <CloseCircle color="error" className={classes.typeIcon} />
      ) : (
        <InfoCircle color="secondary" className={classes.typeIcon} />
      )}
      <div className={classes.messageContainer}>
        <p className={classes.message}>{message}</p>
        {description && <p className={classes.description}>{description}</p>}
      </div>
      <button onClick={onClose} className={classes.closeButton}>
        <CrossOutlined className={classes.closeIcon} />
      </button>
    </div>
  )
}

export default ToasterMessage
