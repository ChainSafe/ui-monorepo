import React from "react"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-theme"

const ContentWidth = 300

const useStyles = makeStyles(({ typography, palette, overrides }: ITheme) =>
  createStyles({
    messageContainer: {
      flex: 1,
      width: ContentWidth,
      ...overrides?.Toaster?.messageContainer
    },
    message: {
      ...typography.body1,
      color: palette.text.primary,
      fontSize: 16,
      margin: 0,
      ...overrides?.Toaster?.message
    },
    description: {
      ...typography.body2,
      color: palette.text.secondary,
      fontSize: 12,
      margin: 0,
      ...overrides?.Toaster?.description
    }
  })
)

export interface IToasterContentProps {
  message: string
  description?: string
  className?: string
  onClose?: () => void
}

const ToasterContent: React.FC<IToasterContentProps> = ({
  message,
  description
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
