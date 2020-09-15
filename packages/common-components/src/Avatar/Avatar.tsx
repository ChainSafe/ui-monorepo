import React, { ReactNode } from "react"
import clsx from "clsx"
import { ITheme, makeStyles, createStyles } from "@chainsafe/common-themes"

const useStyles = makeStyles(({ palette }: ITheme) =>
  createStyles({
    // JSS in CSS goes here
    root: {
      margin: 0,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      fontSize: 14,
      backgroundColor: palette["grey"][6],
      "& svg": {
        height: 18,
        width: 18,
      },
      "&.large": {
        height: 40,
        width: 40,
      },
      "&.medium": {
        height: 32,
        width: 32,
      },
      "&.small": {
        height: 24,
        width: 24,
      },
      "&.square": {
        borderRadius: 2,
      },
      "&.circle": {
        borderRadius: "50%",
      },
    },
  }),
)

type ReactDiv = React.HTMLProps<HTMLDivElement>

interface AvatarProps extends Omit<ReactDiv, "size"> {
  className?: string
  children?: ReactNode | ReactNode[]
  size?: "large" | "medium" | "small"
  variant?: "circle" | "square"
  cover?: boolean
}

const Avatar: React.FC<AvatarProps> = ({
  variant = "circle",
  cover = false,
  size = "medium",
  className,
  children,
  ...rest
}: AvatarProps) => {
  const classes = useStyles()
  return (
    <article
      className={clsx(classes.root, className, classes[variant])}
      {...rest}
    >
      {children}
    </article>
  )
}

export default Avatar
export { AvatarProps }
