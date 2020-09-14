import React, { ChangeEvent } from "react"
// import { makeStyles, createStyles } from "@material-ui/styles"
// import { ITheme } from "@chainsafe/common-themes"
import clsx from "clsx"
import { Typography } from "../Typography"

// const useStyles = makeStyles((theme: ITheme) =>
//   createStyles({
//     label: {},
//     errorColor: {
//       color: theme.palette.error.main,
//     },
//     successColor: {
//       color: theme.palette.success.main,
//     },
//     warningColor: {
//       color: theme.palette.warning.main,
//     },
//   }),
// )

export type InputState = "normal" | "warning" | "success" | "error"
export type Color = "primary" | "secondary"

export interface TextInputProps {
  className?: string
  label?: string
  name?: string
  value?: string
  placeholder?: string
  disabled?: boolean
  color?: Color
  state?: InputState
  size?: "large" | "medium" | "small"
  captionMessage?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const TextInput: React.SFC<TextInputProps> = ({
  className,
  label,
  size = "medium",
  disabled = false,
}: TextInputProps) => {
  return (
    <label
      className={clsx(className, size, {
        ["disabled"]: disabled,
      })}
    >
      {label && label.length && (
        <Typography variant="body2" component="span">
          {label}
        </Typography>
      )}
    </label>
  )
}

export default TextInput
