import React from "react"
import { makeStyles, createStyles } from "@material-ui/styles"
import { ITheme } from "@chainsafe/common-themes"

const useStyles = makeStyles((theme: ITheme) =>
  createStyles({
    messageContainer: {
      flex: 1,
      width: 300,
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
  }),
)

export interface IToasterContentProps {
  message: string
  description?: string
  className?: string
  onClose?: () => void
}

const ToasterContent: React.FC<IToasterContentProps> = ({
  message,
  description,
}: IToasterContentProps) => {
  const classes = useStyles()

  return (
    <div className={classes.messageContainer}>
      <p className={classes.message}>{message}</p>
      {description && <p className={classes.description}>{description}</p>}
    </div>
  )
}

export default ToasterContent
